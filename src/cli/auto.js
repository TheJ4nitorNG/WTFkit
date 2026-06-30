#!/usr/bin/env node

const child_process = require('child_process');
const path = require('path');

function executeCommand(commandName) {
    const cmdPath = path.join(__dirname, `${commandName}.js`);
    try {
        const output = child_process.execSync(`node "${cmdPath}"`, { encoding: 'utf8' });
        console.log(output.trim());
    } catch (e) {
        if (e.stdout) console.log(e.stdout.trim());
        if (e.stderr) console.error(e.stderr.trim());
    }
}

function main() {
    if (process.argv.includes('-help') || process.argv.includes('--help')) {
        console.log("Usage: wtfkit [-help]\n\nRuns the full diagnostic pipeline (wtf, why, fix) in sequence.");
        return;
    }

    console.log("=========================================");
    console.log("             WTFKit Auto Mode            ");
    console.log("=========================================\n");

    console.log("--- 1. WHAT BROKE? (wtf) ---\n");
    executeCommand('wtf');

    console.log("\n--- 2. WHY DID IT HAPPEN? (why) ---\n");
    executeCommand('why');

    console.log("\n--- 3. HOW DO I FIX IT? (fix) ---\n");
    executeCommand('fix');
    
    console.log("\n=========================================\n");
}

main();