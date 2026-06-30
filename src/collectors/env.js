const fs = require('fs');
const path = require('path');

function detectDuplicateBinaries(pathList, binaryName) {
    const foundPaths = [];
    for (const dir of pathList) {
        try {
            const exePath = path.join(dir, binaryName);
            if (fs.existsSync(exePath)) {
                foundPaths.push(exePath);
            }
        } catch (e) {
            // ignore invalid paths
        }
    }
    return foundPaths;
}

function getEnvContext() {
    const pathList = (process.env.PATH || '').split(';').filter(Boolean);
    
    const nodePaths = detectDuplicateBinaries(pathList, 'node.exe');
    const npmPaths = detectDuplicateBinaries(pathList, 'npm.cmd');

    return {
        path: process.env.PATH || '',
        pathList,
        nodePath: process.env.NODE_PATH || null,
        platform: process.platform,
        nodeVersion: process.version,
        
        duplicateNode: nodePaths.length > 1,
        nodeExecutables: nodePaths,
        missingNpm: npmPaths.length === 0,
        npmExecutables: npmPaths,
        hasNvm: pathList.some(p => p.toLowerCase().includes('nvm'))
    };
}

module.exports = { getEnvContext, detectDuplicateBinaries };