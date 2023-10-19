const { structuredPatch } = require("diff");

/**
 * Get pull requests from multiple github repositories
 * @param {*} source
 * @param {*} target
 * @param {*} repos
 * @returns
 */
function compareJsonsWithStructured(source, target) {
    return structuredPatch('file1.json','file2.json', JSON.stringify(source.json, null, 2), JSON.stringify(target.json, null, 2));
}

function diffToHtml(diff) {
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>JSON Diff</title>
    </head>
    <body>
    <div style="font-family: monospace;">
    `;

    diff.hunks.forEach(hunk => {
        html += `<div><strong>file1.json 의 Lines ${hunk.oldStart}-${hunk.oldStart + hunk.oldLines - 1}:</strong></div>`;
        html += '<div style="background-color: #f6f8fa; padding: 10px; border: 1px solid #ddd; margin-bottom: 10px;">';
        hunk.lines.forEach(line => {
            if (line.startsWith('-')) {
                html += `<div style="color: red;">${line}</div>`;
            } else if (line.startsWith('+')) {
                html += `<div style="color: green;">${line}</div>`;
            } else {
                html += `<div style="color: grey;">${line}</div>`;
            }
        });
        html += '</div>';
    });

    html += '</div></body></html>';

    return html;
}

module.exports = {
    compareJsonsWithStructured,
    diffToHtml,
};
