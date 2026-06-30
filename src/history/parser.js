function parseHistory(rawHistory) {
    if (!rawHistory) return null;
    
    return {
        command: rawHistory.command || "",
        exitCode: rawHistory.exitCode !== undefined ? rawHistory.exitCode : null,
        stdout: rawHistory.stdout || "",
        stderr: rawHistory.stderr || "",
        cwd: rawHistory.cwd || process.cwd(),
        shell: rawHistory.shell || "unknown",
        timestamp: rawHistory.timestamp || Date.now()
    };
}

module.exports = { parseHistory };