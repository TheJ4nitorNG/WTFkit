const { collectHistory } = require('../collectors/history');
const { getProcessContext } = require('../collectors/processes');
const { getFilesystemContext } = require('../collectors/filesystem');
const { getEnvContext } = require('../collectors/env');
const { analyze } = require('../analyzers/engine');

function runDiagnostic() {
    const history = collectHistory();
    const context = {
        processes: getProcessContext(),
        filesystem: getFilesystemContext(process.cwd()),
        env: getEnvContext()
    };

    const diagnoses = analyze(history, context);

    return { history, context, diagnoses };
}

module.exports = { runDiagnostic };
