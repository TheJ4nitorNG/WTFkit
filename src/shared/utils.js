function extractCommandBase(command) {
    if (!command) return "";
    return command.trim().split(/\s+/)[0];
}

function formatTime(ms) {
    const d = new Date(ms);
    return d.toTimeString().split(' ')[0]; // HH:MM:SS
}

module.exports = { extractCommandBase, formatTime };