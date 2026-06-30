const { getEnvContext } = require('../collectors/env');
const { getFilesystemContext } = require('../collectors/filesystem');
const { getProcessContext } = require('../collectors/processes');

function gatherContext(cwd) {
    return {
        env: getEnvContext(),
        filesystem: getFilesystemContext(cwd || process.cwd()),
        processes: getProcessContext()
    };
}

module.exports = { gatherContext };