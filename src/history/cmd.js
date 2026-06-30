function getHistory() {
    const exitCode = process.env.WTF_LAST_EXIT_CODE ? parseInt(process.env.WTF_LAST_EXIT_CODE, 10) : null;
    const stderr = process.env.WTF_LAST_STDERR || "";
    const command = process.env.WTF_LAST_COMMAND || "";
    
    // CMD does not persist history across processes in a file like PSReadLine.
    // Relying on the wrapper (wtf.cmd) to pass the command via environment.

    return {
        command,
        exitCode,
        stdout: "",
        stderr,
        cwd: process.cwd(),
        shell: 'cmd'
    };
}

module.exports = { getHistory };