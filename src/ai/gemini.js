const { GoogleGenAI, Type } = require('@google/genai');

async function askGemini(history, context) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("\n⚠ Warning: GEMINI_API_KEY environment variable is required to use the --ai flag.\n");
        return null;
    }

    // Strip conflicting Google Cloud variables that cause the SDK to attempt Vertex/OAuth authentication
    const originalEnv = { ...process.env };
    delete process.env.GOOGLE_CLOUD_PROJECT;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.GOOGLE_GENAI_USE_VERTEXAI;

    let ai;
    try {
        ai = new GoogleGenAI({ apiKey: apiKey });
    } finally {
        // Restore environment variables
        process.env = originalEnv;
    }

    const prompt = `
You are an expert terminal debugging assistant.
Analyze this terminal failure and provide a structured diagnosis.

Command: ${history.command}
Exit Code: ${history.exitCode}
Error Output:
${history.stderr || "(No stderr captured. The command may have failed silently or written to stdout instead.)"}

Consider the following system context:
Processes: ${JSON.stringify(context.processes || {}, null, 2)}
Environment: ${JSON.stringify(context.env || {}, null, 2)}
Filesystem state (abbreviated): ${JSON.stringify(context.filesystem || {}, null, 2)}
`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            cause: {
                type: Type.STRING,
                description: "Short title of the error (e.g. 'Type Error', 'Missing File')"
            },
            confidence: {
                type: Type.NUMBER,
                description: "Confidence score between 0.0 and 1.0"
            },
            explanation: {
                type: Type.OBJECT,
                properties: {
                    timeline: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING
                        },
                        description: "An array of strings representing the sequence of events leading to the failure. Format: 'HH:MM:SS\\nEvent description'"
                    },
                    rootCauseText: {
                        type: Type.STRING,
                        description: "Detailed explanation of why the command failed."
                    }
                },
                required: ["timeline", "rootCauseText"]
            },
            fixes: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        level: {
                            type: Type.STRING,
                            description: "Risk level of the fix. Allowed values: SAFE, CAUTION, ADVANCED"
                        },
                        command: {
                            type: Type.STRING,
                            description: "The terminal command to execute to fix the issue."
                        }
                    },
                    required: ["level", "command"]
                },
                description: "An array of suggested fixes."
            }
        },
        required: ["cause", "confidence", "explanation", "fixes"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        });

        const jsonText = response.text;
        const result = JSON.parse(jsonText);

        return {
            cause: `AI: ${result.cause}`,
            confidence: result.confidence || 0.8,
            plugin: 'gemini',
            pluginRef: {
                explain: () => result.explanation,
                fixes: () => result.fixes || []
            }
        };

    } catch (e) {
        if (e.status === 429 || (e.message && e.message.includes('Quota exceeded'))) {
            console.error("\n⚠ AI Error: Gemini API rate limit exceeded (Too many requests per minute). Please wait a moment and try again.\n");
        } else {
            console.error("\n⚠ Failed to contact Gemini API:", e.message, "\n");
        }
        return null;
    }
}

module.exports = { askGemini };
