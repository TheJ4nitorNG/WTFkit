const colors = require('./colors');

function formatDiagnosis(diagnosis) {
    let severity = colors.yellow("LOW");
    if (diagnosis.confidence > 0.9) severity = colors.red("HIGH");
    else if (diagnosis.confidence > 0.7) severity = colors.yellow("MEDIUM");

    return `${severity}\n• ${diagnosis.cause}\n`;
}

function formatFix(fix) {
    let colorLevel = fix.level;
    if (fix.level === 'SAFE') colorLevel = colors.green(fix.level);
    if (fix.level === 'CAUTION') colorLevel = colors.yellow(fix.level);
    if (fix.level === 'ADVANCED') colorLevel = colors.red(fix.level);

    return `${colorLevel}\n${fix.command}\n`;
}

module.exports = { formatDiagnosis, formatFix };