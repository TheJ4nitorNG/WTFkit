const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('git');

function detect(history, context) {
    const matches = [];
    for (const rule of rules) {
        if (matchRule(rule, history, context)) {
            matches.push({ cause: rule.cause, confidence: rule.confidence, plugin: 'git', ruleData: rule });
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
        case 'Git Merge Conflict':
            events.push({ time: startTime + 1000, msg: 'Git attempted to merge branches' });
            events.push({ time: endTime - 100, msg: 'Conflicting lines detected in file(s)' });
            events.push({ time: endTime, msg: 'Merge paused' });
            rootCauseText = 'Git encountered overlapping changes in the same file from different branches and cannot resolve them automatically.';
            break;
        case 'Git Detached Head':
            events.push({ time: startTime + 1000, msg: 'Git checkout executed on a commit hash' });
            events.push({ time: endTime - 100, msg: 'HEAD pointer detached from branch reference' });
            events.push({ time: endTime, msg: 'Working tree updated' });
            rootCauseText = 'You checked out a specific commit rather than a branch. Any new commits will not be attached to a branch.';
            break;
        default:
            events.push({ time: endTime, msg: 'Command failed unexpectedly' });
            rootCauseText = 'An unexpected Git error occurred.';
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