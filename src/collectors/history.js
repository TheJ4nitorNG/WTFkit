const powershell = require('../history/powershell');
const cmd = require('../history/cmd');
const { parseHistory } = require('../history/parser');

function collectHistory() {
    const shell = process.env.WTF_SHELL || (process.env.PSModulePath ? 'powershell' : 'cmd');
    
    let raw;
    if (shell === 'powershell') {
        raw = powershell.getHistory();
    } else {
        raw = cmd.getHistory();
    }
    
    return parseHistory(raw);
}

module.exports = { collectHistory };