function getPathContext() {
    const rawPath = process.env.PATH || '';
    return rawPath.split(';');
}

module.exports = { getPathContext };