const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('pnpm');

function detect(history, context) {
    return rules.filter(r => matchRule(r, history, context))
        .map(r => ({ cause: r.cause, confidence: r.confidence, plugin: 'pnpm', ruleData: r }));
}

function explain(diagnosis, history, context) {
    const baseCommand = (history.command || "command").split(' ')[0];
    const endTime = history.timestamp || Date.now();
    const startTime = endTime - 3000; 
    
    const events = [
        { time: startTime, msg: `${history.command || "command"} started` },
        { time: endTime - 100, msg: `pnpm execution failed` },
        { time: endTime, msg: `${baseCommand} aborted` }
    ];

    let rootCauseText = "A pnpm environment error occurred.";
    if (diagnosis.cause === 'pnpm Store Corruption') rootCauseText = 'The global pnpm content-addressable store is corrupted or has incorrect permissions.';
    if (diagnosis.cause === 'pnpm Peer Dependency') rootCauseText = 'A strict peer dependency requirement failed. pnpm enforces strict linking by default.';

    return { timeline: events.map(e => `${formatTime(e.time)}\n${e.msg}`), rootCauseText };
}

function fixes(diagnosis, history, context) {
    return diagnosis.ruleData ? generateFixes(diagnosis.ruleData, context) : [];
}

module.exports = { detect, explain, fixes };