const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('python');

function detect(history, context) {
    return rules.filter(r => matchRule(r, history, context))
        .map(r => ({ cause: r.cause, confidence: r.confidence, plugin: 'python', ruleData: r }));
}

function explain(diagnosis, history, context) {
    const baseCommand = (history.command || "command").split(' ')[0];
    const endTime = history.timestamp || Date.now();
    const startTime = endTime - 3000; 
    
    const events = [
        { time: startTime, msg: `${history.command || "command"} started` },
        { time: endTime - 100, msg: `Python interpreter encountered an exception` },
        { time: endTime, msg: `${baseCommand} aborted` }
    ];

    let rootCauseText = "A Python script error occurred.";
    if (diagnosis.cause === 'Module Not Found') rootCauseText = 'A required Python package is missing from your active virtual environment.';
    if (diagnosis.cause === 'Syntax Error') rootCauseText = 'The Python script contains invalid syntax or an indentation error.';

    return { timeline: events.map(e => `${formatTime(e.time)}\n${e.msg}`), rootCauseText };
}

function fixes(diagnosis, history, context) {
    return diagnosis.ruleData ? generateFixes(diagnosis.ruleData, context) : [];
}

module.exports = { detect, explain, fixes };