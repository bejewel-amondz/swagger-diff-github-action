const { structuredPatch } = require("diff");

function compareJsonsWithStructured(sourceJson, targetJson) {
    return structuredPatch(
        'sourceJson',
        'targetJson',
        JSON.stringify(sourceJson, null, 2),
        JSON.stringify(targetJson, null, 2),
        {
            ignoreWhitespace: true,
        }
    );
}

function diffToHtml(diff) {
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>swagger docs 버전 비교</title>
         <style>            
            .line {
                background-color: #f6f8fa;
                padding: 10px;
                border: 1px solid #ddd;
                margin-bottom: 10px;
            }
            
            .num {
                display: inline-block;
                min-width: 30px;
                color: #868e96;
                margin-right: 5px;
            }
            
            .content {
                white-space: pre-wrap;
            }
        </style>
    </head>
    <body>
    <div style="font-family: monospace;">
    `;

    if (diff.hunks.length === 0) {
        html += '<h1 style="text-align: center;"><strong>변경된 사항이 없습니다.</strong></h1>'
    } else {
        html += '<h1 style="text-align: center;"><strong>변경사항은 아래와 같습니다.</strong></h1>'

        diff.hunks.forEach(hunk => {
            html += '<div class="line">';

            let lineNum = hunk.oldStart - 1;
            hunk.lines.forEach(line => {
                if (line.startsWith('-')) {
                    html += `<div><div class="num">${++lineNum}</div><span class="content" style="color: red;">${line}</span></div>`;
                } else if (line.startsWith('+')) {
                    html += `<div><div class="num"></div><span class="content" style="color: green;">${line}</span></div>`;
                } else {
                    html += `<div><div class="num">${++lineNum}</div><span class="content" style="color: grey;">${line}</span></div>`;
                }
            });

            html += '</div>';
        });
    }

    html += '</div></body></html>';

    return html;
}

module.exports = {
    compareJsonsWithStructured,
    diffToHtml,
};
