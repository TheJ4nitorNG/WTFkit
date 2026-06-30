const registry = require('../plugins/registry');

function analyze(history, context) {
    if (!history) return [];

    let allMatches = [];

    for (const plugin of registry.getAll()) {
        try {
            const matches = plugin.detect(history, context);
            if (matches && matches.length > 0) {
                matches.forEach(m => {
                    m.pluginRef = plugin;
                });
                allMatches = allMatches.concat(matches);
            }
        } catch (e) {
            // Ignore plugin detect errors
        }
    }

    return allMatches.sort((a, b) => b.confidence - a.confidence);
}

module.exports = { analyze };