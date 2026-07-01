const { formatTime } = require('../../shared/utils');
const { loadDatabase, matchRule, generateFixes } = require('../../shared/ruleParser');

const rules = loadDatabase('flutter');

function detect(history, context) {
    return rules.filter(r => matchRule(r, history, context))
        .map(r => ({ cause: r.cause, confidence: r.confidence, plugin: 'flutter', ruleData: r }));
}

function explain(diagnosis, history, context) {
    const baseCommand = (history.command || "command").split(' ')[0];
    const endTime = history.timestamp || Date.now();
    const startTime = endTime - 3000; 
    
    const events = [
        { time: startTime, msg: `${history.command || "command"} started` },
        { time: endTime - 100, msg: `Flutter toolchain encountered an error` },
        { time: endTime, msg: `${baseCommand} aborted` }
    ];

    let rootCauseText = "A Flutter or Dart environment error occurred.";
    if (diagnosis.cause === 'Flutter Pub Dependency Missing') rootCauseText = 'A required Dart package is missing or your pubspec.lock is out of sync with your imports.';
    if (diagnosis.cause === 'CocoaPods Out of Sync') rootCauseText = 'Your iOS CocoaPods dependencies are missing or require an update to compile the native runner.';
    if (diagnosis.cause === 'Android Gradle Build Failure') rootCauseText = 'The Android Gradle daemon failed to compile the Java/Kotlin source files.';
    if (diagnosis.cause === 'Flutter Version Conflict') rootCauseText = 'A package in your pubspec requires a newer version of the Dart SDK than you currently have installed.';

    return { timeline: events.map(e => `${formatTime(e.time)}\n${e.msg}`), rootCauseText };
}

function fixes(diagnosis, history, context) {
    return diagnosis.ruleData ? generateFixes(diagnosis.ruleData, context) : [];
}

module.exports = { detect, explain, fixes };