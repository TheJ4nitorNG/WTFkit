const assert = require('assert');
const test = require('node:test');

// We intercept require to mock @google/genai
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(request) {
    if (request === '@google/genai') {
        return {
            Type: { OBJECT: 'OBJECT', STRING: 'STRING', NUMBER: 'NUMBER', ARRAY: 'ARRAY' },
            GoogleGenAI: class MockGoogleGenAI {
                constructor({ apiKey }) {
                    this.apiKey = apiKey;
                    this.models = {
                        generateContent: async ({ contents, config }) => {
                            // Ensure the schema was passed correctly
                            assert.ok(config.responseSchema);
                            assert.strictEqual(config.responseSchema.type, 'OBJECT');
                            
                            // Mocking the model's response
                            return {
                                text: JSON.stringify({
                                    cause: 'Mocked Type Error',
                                    confidence: 0.95,
                                    explanation: {
                                        timeline: ['10:00:00\\nCommand started', '10:00:01\\nCrashed'],
                                        rootCauseText: 'Mocked explanation'
                                    },
                                    fixes: [
                                        { level: 'SAFE', command: 'echo "fixed"' }
                                    ]
                                })
                            };
                        }
                    };
                }
            }
        };
    }
    return originalRequire.apply(this, arguments);
};

const { askGemini } = require('../../src/ai/gemini.js');

test('Gemini wrapper correctly parses structured JSON output', async () => {
    // Inject a fake key
    process.env.GEMINI_API_KEY = 'fake-key';
    
    const history = { command: 'test', exitCode: 1, stderr: 'error' };
    const context = { processes: [], filesystem: {}, env: {} };
    
    const result = await askGemini(history, context);
    
    assert.strictEqual(result.cause, 'AI: Mocked Type Error');
    assert.strictEqual(result.confidence, 0.95);
    assert.strictEqual(result.plugin, 'gemini');
    
    const explanation = result.pluginRef.explain();
    assert.strictEqual(explanation.timeline.length, 2);
    assert.strictEqual(explanation.rootCauseText, 'Mocked explanation');
    
    const fixes = result.pluginRef.fixes();
    assert.strictEqual(fixes.length, 1);
    assert.strictEqual(fixes[0].command, 'echo "fixed"');
    
    // Clean up
    delete process.env.GEMINI_API_KEY;
});
