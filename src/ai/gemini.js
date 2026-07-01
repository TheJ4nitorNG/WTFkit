async function askGemini(history, context) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("\n⚠ Warning: GEMINI_API_KEY environment variable is required to use the --ai flag.\n");
        return null;
    }

    const prompt = `
You are an expert terminal debugging assistant.
Analyze this terminal failure and provide a structured diagnosis.

Command: ${history.command}
Exit Code: ${history.exitCode}
Error Output:
${history.stderr}

Return ONLY a valid JSON object matching this schema exactly. Do not include markdown blocks or any other text.
{
  "cause": "Short title of the error (e.g. 'Type Error', 'Missing File')",
  "confidence": 0.85,
  "explanation": {
    "timeline": [
        "14:00:00\\nCommand started", 
        "14:00:01\\nAnalysis of what caused the crash"
    ],
    "rootCauseText": "Detailed explanation of why it failed."
  },
  "fixes": [
    { "level": "SAFE", "command": "command to fix it safely" }
  ]
}
`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });

        const data = await response.json();
        
        if (data.error) {
            if (data.error.code === 429 || data.error.message.includes('Quota exceeded')) {
                console.error("\n⚠ AI Error: Gemini API rate limit exceeded (Too many requests per minute). Please wait a moment and try again.\n");
            } else {
                console.error("\n⚠ AI Error:", data.error.message, "\n");
            }
            return null;
        }

        const jsonText = data.candidates[0].content.parts[0].text;
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
        console.error("\n⚠ Failed to contact Gemini API:", e.message, "\n");
        return null;
    }
}

module.exports = { askGemini };