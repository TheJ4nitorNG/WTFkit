const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('windows');

function detect(history, context) {
    const matches = [];
    for (const rule of rules) {
        if (matchRule(rule, history, context)) {
            matches.push({ cause: rule.cause, confidence: rule.confidence, plugin: 'windows', ruleData: rule });
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
        case 'Permission Issue':
            events.push({ time: startTime + 1000, msg: 'Attempted restricted operation' });
            events.push({ time: endTime - 100, msg: 'Windows denied access (EPERM)' });
            events.push({ time: endTime, msg: `${baseCommand} aborted` });
            rootCauseText = 'The command was blocked by Windows due to insufficient permissions. You may need Administrator access.';
            break;
        case 'Restricted Execution Policy':
            events.push({ time: startTime + 500, msg: 'PowerShell attempted to load script' });
            events.push({ time: endTime - 100, msg: 'Execution Policy prevented execution' });
            events.push({ time: endTime, msg: 'Script aborted' });
            rootCauseText = 'PowerShell blocked the script because your system Execution Policy restricts running unsigned scripts.';
            break;
        case 'PATH Not Recognized':
            events.push({ time: startTime + 200, msg: 'Windows attempted to resolve command in PATH' });
            events.push({ time: endTime - 100, msg: 'Executable not found' });
            events.push({ time: endTime, msg: `${baseCommand} aborted` });
            rootCauseText = 'Windows does not recognize the command. The executable is either not installed or missing from your PATH environment variable.';
            break;
        default:
            events.push({ time: endTime, msg: 'Command failed unexpectedly' });
            rootCauseText = 'An unexpected Windows error occurred.';
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