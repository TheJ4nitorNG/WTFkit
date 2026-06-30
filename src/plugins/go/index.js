const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('go');

function detect(history, context) {
    return rules.filter(r => matchRule(r, history, context))
        .map(r => ({ cause: r.cause, confidence: r.confidence, plugin: 'go', ruleData: r }));
}

function explain(diagnosis, history, context) {
    const baseCommand = (history.command || "command").split(' ')[0];
    const endTime = history.timestamp || Date.now();
    const startTime = endTime - 3000; 
    
    const events = [
        { time: startTime, msg: `${history.command || "command"} started` },
        { time: endTime - 100, msg: `Go toolchain failed` },
        { time: endTime, msg: `${baseCommand} aborted` }
    ];

    let rootCauseText = "A Go compilation or module error occurred.";
    if (diagnosis.cause === 'Module Resolution') rootCauseText = 'The Go toolchain could not locate a required package. Your go.mod/go.sum may be out of sync.';
    if (diagnosis.cause === 'Build Failure') rootCauseText = 'A Go source file failed to compile due to undefined variables or incorrect types.';

    return { timeline: events.map(e => `${formatTime(e.time)}\n${e.msg}`), rootCauseText };
}

function fixes(diagnosis, history, context) {
    return diagnosis.ruleData ? generateFixes(diagnosis.ruleData, context) : [];
}

module.exports = { detect, explain, fixes };