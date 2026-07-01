const fs = require('fs');
const path = require('path');
const { collectHistory } = require('../collectors/history');
const { getProcessContext } = require('../collectors/processes');
const { getFilesystemContext } = require('../collectors/filesystem');
const { getEnvContext } = require('../collectors/env');
const { analyze } = require('../analyzers/engine');
const { askGemini } = require('../ai/gemini');

async function getCustomHistory(args) {
    let input = "";

    // 1. Check for piped stdin
    if (!process.stdin.isTTY) {
        try {
            for await (const chunk of process.stdin) input += chunk;
            input = input.trim();
        } catch(e) {}
    } 
    
    // 2. Check for positional arguments if stdin is empty
    if (!input && args.length > 0) {
        // Remove literal wrapping quotes if they got passed down from auto.js execSync
        let target = args.join(' ').replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        
        // Try as a file first
        if (fs.existsSync(target) && fs.statSync(target).isFile()) {
            input = fs.readFileSync(target, 'utf8');
            return {
                command: `File: ${path.basename(target)}`,
                exitCode: 1,
                stdout: "",
                stderr: input,
                cwd: process.cwd(),
                shell: 'custom',
                timestamp: fs.statSync(target).mtimeMs
            };
        } else {
            // Treat as raw string
            input = target;
        }
    }

    if (input) {
        return {
            command: "Manual Input",
            exitCode: 1,
            stdout: "",
            stderr: input,
            cwd: process.cwd(),
            shell: 'custom',
            timestamp: Date.now()
        };
    }
    return null;
}

async function runDiagnostic() {
    const isAiEnabled = process.argv.includes('--ai');
    const positionalArgs = process.argv.slice(2).filter(a => !a.startsWith('-'));

    // Try custom input first, fallback to native shell history
    let history = await getCustomHistory(positionalArgs);
    if (!history) {
        history = collectHistory();
    }

    const context = {
        processes: getProcessContext(),
        filesystem: getFilesystemContext(process.cwd()),
        env: getEnvContext()
    };

    let diagnoses = analyze(history, context);

    if (isAiEnabled && history && history.stderr) {
        const aiDiagnosis = await askGemini(history, context);
        if (aiDiagnosis) {
            diagnoses.push(aiDiagnosis);
            // Re-sort by confidence to ensure AI competes naturally
            diagnoses.sort((a, b) => b.confidence - a.confidence);
        }
    }

    return { history, context, diagnoses };
}

module.exports = { runDiagnostic };