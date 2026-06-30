const child_process = require('child_process');

function parseWmic(csvOutput) {
    if (!csvOutput) return [];
    
    const lines = csvOutput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const processes = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(',');
        if (parts.length >= 3) {
            const pidStr = parts[parts.length - 1];
            const name = parts[parts.length - 2];
            const commandLine = parts.slice(1, parts.length - 2).join(',');
            
            const pid = parseInt(pidStr, 10);
            if (!isNaN(pid)) {
                processes.push({ name, pid, commandLine });
            }
        }
    }
    
    return processes;
}

function getProcessContext() {
    if (process.platform !== 'win32') {
        return []; 
    }
    
    try {
        const output = child_process.execSync('wmic process get name,processid,commandline /format:csv', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        
        const processes = parseWmic(output);

        const analysis = {
            all: processes,
            nodeProcesses: processes.filter(p => p.name.toLowerCase() === 'node.exe'),
            hasVite: processes.some(p => p.commandLine && p.commandLine.includes('vite')),
            hasElectron: processes.some(p => p.name.toLowerCase() === 'electron.exe' || (p.commandLine && p.commandLine.includes('electron'))),
            hasHungNpm: processes.some(p => p.name.toLowerCase() === 'node.exe' && p.commandLine && p.commandLine.includes('npm'))
        };

        return analysis;
    } catch (e) {
        return { all: [], nodeProcesses: [], hasVite: false, hasElectron: false, hasHungNpm: false };
    }
}

module.exports = { getProcessContext, parseWmic };