const npmPlugin = require('./npm');
const windowsPlugin = require('./windows');
const gitPlugin = require('./git');
const fallbackPlugin = require('./fallback');
const dockerPlugin = require('./docker');
const pythonPlugin = require('./python');
const rustPlugin = require('./rust');
const goPlugin = require('./go');
const bunPlugin = require('./bun');
const yarnPlugin = require('./yarn');
const pnpmPlugin = require('./pnpm');
const flutterPlugin = require('./flutter');

class PluginRegistry {
    constructor() {
        this.plugins = new Map();
    }

    loadBuiltInPlugins() {
        this.register('npm', npmPlugin);
        this.register('windows', windowsPlugin);
        this.register('git', gitPlugin);
        this.register('docker', dockerPlugin);
        this.register('python', pythonPlugin);
        this.register('rust', rustPlugin);
        this.register('go', goPlugin);
        this.register('bun', bunPlugin);
        this.register('yarn', yarnPlugin);
        this.register('pnpm', pnpmPlugin);
        this.register('flutter', flutterPlugin);
        this.register('fallback', fallbackPlugin);
    }

    register(name, plugin) {
        if (!plugin.detect || !plugin.explain || !plugin.fixes) {
            return false;
        }
        
        plugin.name = name;
        this.plugins.set(name, plugin);
        return true;
    }

    getAll() {
        return Array.from(this.plugins.values());
    }
}

const registry = new PluginRegistry();
registry.loadBuiltInPlugins();

module.exports = registry;