const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('fallback');

function detect(history, context) {
    const matches = [];
    for (const rule of rules) {
        if (matchRule(rule, history, context)) {
            matches.push({ cause: rule.cause, confidence: rule.confidence, plugin: 'fallback', ruleData: rule });
        }
    }
    return matches;
}

function explain(diagnosis, history, context) {
    const baseCommand = (history.command || "command").split(' ')[0];
    const fullCommand = history.command || "command";
    
    const endTime = history.timestamp || Date.now();
    let startTime = endTime - 3000; 
    const events = [];

    events.push({ time: startTime, msg: `${fullCommand} started` });

    let rootCauseText = "";

    switch (diagnosis.cause) {
        case 'Missing File or Directory':
            events.push({ time: startTime + 1000, msg: 'Attempted to access filesystem resource' });
            events.push({ time: endTime - 100, msg: 'File or directory not found (ENOENT)' });
            events.push({ time: endTime, msg: `${baseCommand} aborted` });
            rootCauseText = 'The command tried to access a file or directory that does not exist (ENOENT).';
            break;
        default:
            events.push({ time: endTime, msg: 'Command failed unexpectedly' });
            rootCauseText = 'An unexpected error occurred. The system could not determine a specific root cause.';
            break;
    }

    events.sort((a, b) => a.time - b.time);
    const timeline = events.map(e => `${formatTime(e.time)}\n${e.msg}`);

    return { timeline, rootCauseText };
}

function fixes(diagnosis, history, context) {
    if (diagnosis.ruleData) {
        return generateFixes(diagnosis.ruleData, context);
    }
    return [];
}

module.exports = { detect, explain, fixes };