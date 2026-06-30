function createTable(headers, rows) {
    let out = headers.join(' | ') + '\n';
    out += headers.map(() => '---').join(' | ') + '\n';
    for (const row of rows) {
        out += row.join(' | ') + '\n';
    }
    return out;
}
module.exports = { createTable };