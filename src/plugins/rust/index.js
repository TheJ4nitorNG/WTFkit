const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('rust');

function detect(history, context) {
    return rules.filter(r => matchRule(r, history, context))
        .map(r => ({ cause: r.cause, confidence: r.confidence, plugin: 'rust', ruleData: r }));
}

function explain(diagnosis, history, context) {
    const baseCommand = (history.command || "command").split(' ')[0];
    const endTime = history.timestamp || Date.now();
    const startTime = endTime - 3000; 
    
    const events = [
        { time: startTime, msg: `${history.command || "command"} started` },
        { time: endTime - 100, msg: `Cargo build / execution failed` },
        { time: endTime, msg: `${baseCommand} aborted` }
    ];

    let rootCauseText = "A Rust compilation or runtime error occurred.";
    if (diagnosis.cause === 'Dependency Resolution Failed') rootCauseText = 'Cargo was unable to resolve a dependency or find the Cargo.toml file.';
    if (diagnosis.cause === 'Borrow Checker / Lifetimes') rootCauseText = 'The Rust compiler rejected the code due to a lifetime or borrowing violation.';

    return { timeline: events.map(e => `${formatTime(e.time)}\n${e.msg}`), rootCauseText };
}

function fixes(diagnosis, history, context) {
    return diagnosis.ruleData ? generateFixes(diagnosis.ruleData, context) : [];
}

module.exports = { detect, explain, fixes };