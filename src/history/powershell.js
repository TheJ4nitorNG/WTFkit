const fs = require('fs');
const path = require('path');
const os = require('os');

function getHistory() {
    // 1. Try reading from the Magic Shell Hook state file
    const stateFile = path.join(os.tmpdir(), 'wtfkit_state.json');
    if (fs.existsSync(stateFile)) {
        try {
            const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
            return {
                command: state.command || "",
                exitCode: state.exitCode,
                stdout: "",
                stderr: state.stderr || "",
                cwd: state.cwd || process.cwd(),
                shell: 'powershell',
                timestamp: state.timestamp || Date.now()
            };
        } catch (e) {
            // fallback if corrupt
        }
    }

    const exitCode = process.env.WTF_LAST_EXIT_CODE ? parseInt(process.env.WTF_LAST_EXIT_CODE, 10) : null;
    const stderr = process.env.WTF_LAST_STDERR || "";
    let command = process.env.WTF_LAST_COMMAND || "";
    
    if (!command) {
        try {
            const appData = process.env.APPDATA;
            if (appData) {
                const historyPath = path.join(appData, 'Microsoft', 'Windows', 'PowerShell', 'PSReadLine', 'ConsoleHost_history.txt');
                
                if (fs.existsSync(historyPath)) {
                    const history = fs.readFileSync(historyPath, 'utf8');
                    const lines = history.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                    
                    for (let i = lines.length - 1; i >= 0; i--) {
                        const line = lines[i];
                        if (!line.match(/^(wtf|why|fix)(\s|$)/)) {
                            command = line;
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            // Ignore error, return what we have so far
        }
    }

    return {
        command,
        exitCode,
        stdout: "", // Standard PowerShell does not persist stdout to history
        stderr,
        cwd: process.cwd(),
        shell: 'powershell'
    };
}

module.exports = { getHistory };