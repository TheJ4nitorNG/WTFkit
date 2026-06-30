const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('docker');

function detect(history, context) {
    return rules.filter(r => matchRule(r, history, context))
        .map(r => ({ cause: r.cause, confidence: r.confidence, plugin: 'docker', ruleData: r }));
}

function explain(diagnosis, history, context) {
    const baseCommand = (history.command || "command").split(' ')[0];
    const endTime = history.timestamp || Date.now();
    const startTime = endTime - 3000; 
    
    const events = [
        { time: startTime, msg: `${history.command || "command"} started` },
        { time: endTime - 100, msg: `Docker daemon responded with error` },
        { time: endTime, msg: `${baseCommand} aborted` }
    ];

    let rootCauseText = "A Docker container or daemon error occurred.";
    if (diagnosis.cause === 'Port Conflict') rootCauseText = 'A requested port is already in use by another container or process.';
    if (diagnosis.cause === 'Daemon Not Running') rootCauseText = 'The Docker service is not active. The CLI cannot communicate with the daemon.';

    return { timeline: events.map(e => `${formatTime(e.time)}\n${e.msg}`), rootCauseText };
}

function fixes(diagnosis, history, context) {
    return diagnosis.ruleData ? generateFixes(diagnosis.ruleData, context) : [];
}

module.exports = { detect, explain, fixes };