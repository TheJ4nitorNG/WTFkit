const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('yarn');

function detect(history, context) {
    return rules.filter(r => matchRule(r, history, context))
        .map(r => ({ cause: r.cause, confidence: r.confidence, plugin: 'yarn', ruleData: r }));
}

function explain(diagnosis, history, context) {
    const baseCommand = (history.command || "command").split(' ')[0];
    const endTime = history.timestamp || Date.now();
    const startTime = endTime - 3000; 
    
    const events = [
        { time: startTime, msg: `${history.command || "command"} started` },
        { time: endTime - 100, msg: `Yarn execution failed` },
        { time: endTime, msg: `${baseCommand} aborted` }
    ];

    let rootCauseText = "A Yarn environment error occurred.";
    if (diagnosis.cause === 'Yarn Network Timeout') rootCauseText = 'Yarn encountered a network timeout while attempting to fetch packages.';
    if (diagnosis.cause === 'Yarn Version Mismatch') rootCauseText = 'The current Node version does not match the constraints specified in the package.json engines field.';

    return { timeline: events.map(e => `${formatTime(e.time)}\n${e.msg}`), rootCauseText };
}

function fixes(diagnosis, history, context) {
    return diagnosis.ruleData ? generateFixes(diagnosis.ruleData, context) : [];
}

module.exports = { detect, explain, fixes };