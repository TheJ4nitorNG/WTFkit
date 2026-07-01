#!/usr/bin/env node

const { runDiagnostic } = require('./shared');
const { generatePlan } = require('../repair/planner');

async function main() {
    if (process.argv.includes('-help') || process.argv.includes('--help')) {
        console.log("Usage: fix [--json] [--ai] [file|string] [-help]\n\nSuggests safe, actionable repair commands for your last terminal failure.");
        return;
    }

    const isJson = process.argv.includes('--json');
    const { history, context, diagnoses } = await runDiagnostic();

    if (!diagnoses || diagnoses.length === 0) {
        if (isJson) return console.log(JSON.stringify({ hasRepairs: false, error: "No cause identified." }));
        console.log("No fixes available because no cause was identified.");
        return;
    }

    const plan = generatePlan(diagnoses, history, context);

    if (isJson) {
        return console.log(JSON.stringify(plan, null, 2));
    }

    if (!plan.hasRepairs) {
        console.log("No automated fixes available for this issue.");
        return;
    }

    console.log("Recommended fixes\n");

    for (const fix of plan.strategies) {
        console.log(`${fix.level}`);
        console.log(`${fix.command}\n`);
    }
}

main();