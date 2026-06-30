const fs = require('fs');
const path = require('path');

function loadDatabase(pluginName) {
    const dbPath = path.join(__dirname, '../../database', `${pluginName}.json`);
    if (fs.existsSync(dbPath)) {
        try {
            return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        } catch (e) {
            return [];
        }
    }
    return [];
}

function checkConditions(conditions, context) {
    if (!conditions || conditions.length === 0) return true;
    for (const cond of conditions) {
        if (cond === 'node_running') {
            if (!context || !context.processes || !context.processes.nodeProcesses || context.processes.nodeProcesses.length === 0) {
                return false;
            }
        }
        // Future conditions can be added here
    }
    return true;
}

function matchRule(rule, history, context) {
    if (!history || !history.stderr) return false;
    
    let hasMatch = false;
    if (Array.isArray(rule.match)) {
        hasMatch = rule.match.some(m => history.stderr.includes(m));
    } else {
        hasMatch = history.stderr.includes(rule.match);
    }

    if (!hasMatch) return false;
    return checkConditions(rule.conditions, context);
}

function generateFixes(rule, context) {
    if (!rule.fixes) return [];
    const finalFixes = [];
    
    let targetPid = null;
    if (context && context.processes && context.processes.nodeProcesses && context.processes.nodeProcesses.length > 0) {
        targetPid = context.processes.nodeProcesses[0].pid;
    }

    for (const fix of rule.fixes) {
        if (fix.requires === 'targetPid' && !targetPid) continue;
        if (fix.fallback && targetPid) continue;

        let command = fix.command;
        if (targetPid) {
            command = command.replace('{{targetPid}}', targetPid);
        }
        
        finalFixes.push({ level: fix.level, command });
    }
    return finalFixes;
}

module.exports = { loadDatabase, matchRule, generateFixes };