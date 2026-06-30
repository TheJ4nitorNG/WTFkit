const fs = require('fs');
const path = require('path');

function getFilesystemContext(cwd) {
    let hasPackageJson = false;
    let hasNodeModules = false;
    let isWritable = false;
    let lockFiles = [];
    let isCorruptedInstall = false;
    let fileStats = {};

    if (fs.existsSync(cwd)) {
        const checkStat = (filename) => {
            const p = path.join(cwd, filename);
            if (fs.existsSync(p)) {
                fileStats[filename] = fs.statSync(p).mtimeMs;
                return true;
            }
            return false;
        };

        hasPackageJson = checkStat('package.json');
        hasNodeModules = checkStat('node_modules');
        
        if (checkStat('package-lock.json')) lockFiles.push('package-lock.json');
        if (checkStat('yarn.lock')) lockFiles.push('yarn.lock');
        if (checkStat('pnpm-lock.yaml')) lockFiles.push('pnpm-lock.yaml');
        
        if (hasNodeModules) {
            try {
                const items = fs.readdirSync(path.join(cwd, 'node_modules'));
                if (items.length === 0 || (items.length === 1 && items[0] === '.bin')) {
                    isCorruptedInstall = true;
                }
            } catch(e) {
                // ignore
            }
        }
        
        try {
            const testFile = path.join(cwd, '.wtfkit_write_test');
            fs.writeFileSync(testFile, '');
            fs.unlinkSync(testFile);
            isWritable = true;
        } catch (e) {
            isWritable = false;
        }
    }

    return {
        hasPackageJson,
        hasNodeModules,
        lockFiles,
        fileStats,
        isWritable,
        isCorruptedInstall,
        missingPackageJson: !hasPackageJson
    };
}

module.exports = { getFilesystemContext };