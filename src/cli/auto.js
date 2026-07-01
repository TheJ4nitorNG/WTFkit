#!/usr/bin/env node

const child_process = require('child_process');
const path = require('path');

function executeCommand(commandName, args) {
    const cmdPath = path.join(__dirname, `${commandName}.js`);
    try {
        const output = child_process.execSync(`node "${cmdPath}" ${args}`, { encoding: 'utf8' });
        console.log(output.trim());
    } catch (e) {
        if (e.stdout) console.log(e.stdout.trim());
        if (e.stderr) console.error(e.stderr.trim());
    }
}

function main() {
    if (process.argv.includes('-help') || process.argv.includes('--help')) {
        console.log("Usage: wtfkit [--ai] [file|string] [-help]\n\nRuns the full diagnostic pipeline (wtf, why, fix) in sequence.");
        return;
    }

    // Pass the --ai flag or positional arguments through to the child processes
    // Make sure we quote the args if we are passing them via execSync so strings don't break
    let args = process.argv.slice(2).join(' ');
    if (args && !args.includes('--ai')) {
        args = `"${args}"`;
    }

    console.log("=========================================");
    console.log("             WTFKit Auto Mode            ");
    console.log("=========================================\n");

    console.log("--- 1. WHAT BROKE? (wtf) ---\n");
    executeCommand('wtf', args);

    console.log("\n--- 2. WHY DID IT HAPPEN? (why) ---\n");
    executeCommand('why', args);

    console.log("\n--- 3. HOW DO I FIX IT? (fix) ---\n");
    executeCommand('fix', args);
    
    console.log("\n=========================================\n");
}

main();