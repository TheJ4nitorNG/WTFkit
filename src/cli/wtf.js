#!/usr/bin/env node

const { runDiagnostic } = require('./shared');

async function main() {
    if (process.argv.includes('-help') || process.argv.includes('--help')) {
        console.log("Usage: wtf [--json] [--ai] [file|string] [-help]\n\nIdentifies what broke in your last terminal command.");
        return;
    }

    const isJson = process.argv.includes('--json');
    const { history, context, diagnoses } = await runDiagnostic();

    if (!history || !history.command) {
        if (isJson) return console.log(JSON.stringify({ error: "Could not detect the last command." }));
        console.log("❌ Could not detect the last command.");
        return;
    }

    if (isJson) {
        const safeDiagnoses = diagnoses.map(d => ({ cause: d.cause, confidence: d.confidence, plugin: d.plugin }));
        return console.log(JSON.stringify({ history, diagnoses: safeDiagnoses }, null, 2));
    }

    console.log(`❌ ${history.command} failed\n`);

    if (!diagnoses || diagnoses.length === 0) {
        console.log("No known causes could be identified.");
        return;
    }

    console.log("Likely causes\n");

    for (const d of diagnoses) {
        let severity = "LOW";
        if (d.confidence > 0.9) severity = "HIGH";
        else if (d.confidence > 0.7) severity = "MEDIUM";

        console.log(`${severity}`);
        console.log(`• ${d.cause}\n`);
    }
}

main();