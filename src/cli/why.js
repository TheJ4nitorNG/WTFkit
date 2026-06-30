#!/usr/bin/env node

const { runDiagnostic } = require('./shared');

function main() {
    if (process.argv.includes('-help') || process.argv.includes('--help')) {
        console.log("Usage: why [--json] [-help]\n\nExplains the timeline and root cause of why your last command failed.");
        return;
    }

    const isJson = process.argv.includes('--json');
    const { history, context, diagnoses } = runDiagnostic();

    if (!history || !history.command) {
        if (isJson) return console.log(JSON.stringify({ error: "Could not detect the last command." }));
        console.log("❌ Could not detect the last command.");
        return;
    }

    if (!diagnoses || diagnoses.length === 0) {
        if (isJson) return console.log(JSON.stringify({ error: "No known causes could be identified." }));
        console.log("No known causes could be identified.");
        return;
    }

    const topDiagnosis = diagnoses[0];
    const explanation = topDiagnosis.pluginRef.explain(topDiagnosis, history, context);

    if (isJson) {
        return console.log(JSON.stringify({ 
            cause: topDiagnosis.cause,
            confidence: topDiagnosis.confidence,
            explanation 
        }, null, 2));
    }

    console.log("Timeline\n");
    
    explanation.timeline.forEach(eventStr => {
        console.log(`${eventStr}\n`);
    });

    console.log("Root Cause\n");
    console.log(explanation.rootCauseText);
}

main();
