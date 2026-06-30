const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('npm');

function detect(history, context) {
    const matches = [];
    for (const rule of rules) {
        if (matchRule(rule, history, context)) {
            matches.push({ cause: rule.cause, confidence: rule.confidence, plugin: 'npm', ruleData: rule });
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
        case 'File Lock':
            let lockTime = startTime + 1000;
            if (context && context.filesystem && context.filesystem.fileStats && context.filesystem.fileStats['package-lock.json']) {
                lockTime = context.filesystem.fileStats['package-lock.json'];
                if (lockTime >= endTime) lockTime = endTime - 1000;
                if (lockTime <= startTime) startTime = lockTime - 2000;
                events[0].time = startTime;
            }
            events.push({ time: lockTime, msg: 'package-lock updated or file accessed' });
            events.push({ time: lockTime + 500, msg: 'Another process locked file' });
            events.push({ time: endTime - 100, msg: 'Windows denied write' });
            events.push({ time: endTime, msg: `${baseCommand} aborted` });
            rootCauseText = 'Windows refused to overwrite a file. Most likely because another Node process still has it open.';
            break;
        case 'Module Not Found':
            events.push({ time: startTime + 1000, msg: 'Node.js attempted to resolve module' });
            events.push({ time: endTime - 100, msg: 'Module was missing from node_modules' });
            events.push({ time: endTime, msg: 'Process threw MODULE_NOT_FOUND' });
            rootCauseText = 'Node.js could not find a required dependency. The module might not be installed.';
            break;
        case 'NPM Error':
            events.push({ time: startTime + 1000, msg: 'npm execution started' });
            events.push({ time: endTime - 100, msg: 'npm encountered an internal or cache error' });
            events.push({ time: endTime, msg: `${baseCommand} aborted` });
            rootCauseText = 'NPM encountered an internal error, often related to a corrupted cache or network issue.';
            break;
        default:
            events.push({ time: endTime, msg: 'Command failed unexpectedly' });
            rootCauseText = 'An unexpected NPM error occurred.';
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