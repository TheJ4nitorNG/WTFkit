function rankConfidence(diagnoses) {
    if (!diagnoses) return [];
    return diagnoses.sort((a, b) => b.confidence - a.confidence);
}

module.exports = { rankConfidence };