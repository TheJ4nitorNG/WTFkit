const LEVEL_WEIGHTS = {
    'SAFE': 1,
    'CAUTION': 2,
    'ADVANCED': 3
};

function generatePlan(diagnoses, history, context) {
    if (!diagnoses || diagnoses.length === 0) {
        return { hasRepairs: false, strategies: [] };
    }

    const topDiagnosis = diagnoses[0];
    
    const rawFixes = topDiagnosis.pluginRef.fixes(topDiagnosis, history, context);
    
    if (!rawFixes || rawFixes.length === 0) {
        return { hasRepairs: false, strategies: [] };
    }

    const sortedFixes = [...rawFixes].sort((a, b) => {
        const weightA = LEVEL_WEIGHTS[a.level] || 99;
        const weightB = LEVEL_WEIGHTS[b.level] || 99;
        return weightA - weightB;
    });

    return {
        hasRepairs: true,
        strategies: sortedFixes
    };
}

module.exports = { generatePlan };