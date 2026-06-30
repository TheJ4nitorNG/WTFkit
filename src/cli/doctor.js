#!/usr/bin/env node

const { getEnvContext } = require('../collectors/env');
const { getProcessContext } = require('../collectors/processes');
const colors = require('../output/colors');
const child_process = require('child_process');

function checkGit() {
    try {
        child_process.execSync('git --version', { stdio: 'ignore' });
        return { status: true, message: 'Git' };
    } catch (e) {
        return { status: false, message: 'Git missing or not in PATH' };
    }
}

function checkExecutionPolicy() {
    try {
        if (process.platform === 'win32') {
            const out = child_process.execSync('powershell -NoProfile -Command "Get-ExecutionPolicy"', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
            if (out === 'Restricted') {
                return { status: false, message: 'Execution Policy is Restricted' };
            }
            return { status: true, message: `Execution Policy (${out})` };
        }
        return { status: true, message: 'Execution Policy (N/A non-windows)' };
    } catch (e) {
        return { status: false, message: 'Could not determine Execution Policy' };
    }
}

function main() {
    if (process.argv.includes('-help') || process.argv.includes('--help')) {
        console.log("Usage: doctor [--json] [-help]\n\nRuns a proactive health check across your environment.");
        return;
    }

    const isJson = process.argv.includes('--json');
    let score = 100;
    const deductions = 12; // points per failed check

    const env = getEnvContext();
    const processes = getProcessContext();
    const checks = [];

    if (env.duplicateNode) {
        checks.push({ status: false, message: 'Node (Duplicate installations detected in PATH)' });
        score -= deductions;
    } else if (env.nodeExecutables.length === 0) {
        checks.push({ status: false, message: 'Node missing from PATH' });
        score -= deductions * 2;
    } else {
        checks.push({ status: true, message: `Node (${env.nodeVersion})` });
    }

    if (env.missingNpm) {
        checks.push({ status: false, message: 'npm missing from PATH' });
        score -= deductions * 2;
    } else {
        checks.push({ status: true, message: 'npm' });
    }

    if (env.duplicateNode || env.npmExecutables.length > 1) {
        checks.push({ status: false, message: 'PATH duplicated / messy' });
        score -= deductions;
    } else {
        checks.push({ status: true, message: 'PATH clean' });
    }

    const gitCheck = checkGit();
    checks.push(gitCheck);
    if (!gitCheck.status) score -= deductions;

    const execCheck = checkExecutionPolicy();
    checks.push(execCheck);
    if (!execCheck.status) score -= deductions;

    if (processes.hasHungNpm) {
        checks.push({ status: false, message: 'Hung npm process detected in background' });
        score -= deductions;
    }

    if (score < 0) score = 0;
    
    if (isJson) {
        return console.log(JSON.stringify({ score, checks }, null, 2));
    }

    console.log("System Health\n");
    for (const check of checks) {
        if (check.status) {
            console.log(colors.green(`✔ ${check.message}`));
        } else {
            console.log(colors.yellow(`⚠ ${check.message}`));
        }
        console.log('');
    }

    console.log("Overall Score\n");
    if (score >= 90) {
        console.log(colors.green(`${score}/100`));
    } else if (score >= 70) {
        console.log(colors.yellow(`${score}/100`));
    } else {
        console.log(colors.red(`${score}/100`));
    }
}

main();