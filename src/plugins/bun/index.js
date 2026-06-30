const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('bun');

function detect(history, context) {
    return rules.filter(r => matchRule(r, history, context))
        .map(r => ({ cause: r.cause, confidence: r.confidence, plugin: 'bun', ruleData: r }));
}

function explain(diagnosis, history, context) {
    const baseCommand = (history.command || "command").split(' ')[0];
    const endTime = history.timestamp || Date.now();
    const startTime = endTime - 3000; 
    
    const events = [
        { time: startTime, msg: `${history.command || "command"} started` },
        { time: endTime - 100, msg: `Bun execution failed` },
        { time: endTime, msg: `${baseCommand} aborted` }
    ];

    let rootCauseText = "A Bun environment error occurred.";
    if (diagnosis.cause === 'Bun Missing Dependency') rootCauseText = 'Bun could not find a required module in your node_modules directory.';
    if (diagnosis.cause === 'Bun Lockfile Conflict') rootCauseText = 'The bun.lockb file is corrupted or failed to parse.';

    return { timeline: events.map(e => `${formatTime(e.time)}\n${e.msg}`), rootCauseText };
}

function fixes(diagnosis, history, context) {
    return diagnosis.ruleData ? generateFixes(diagnosis.ruleData, context) : [];
}

module.exports = { detect, explain, fixes };