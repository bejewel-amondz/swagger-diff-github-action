const fs = require("fs");
const core = require('@actions/core');
const { readSwaggerDocsFromFilePath, compareJsonsWithStructured, diffToHtml, uploadArtifact } = require("./functions.js");

async function main() {
    try {
        const sourceSwaggerDocsJsonFilePath = core.getInput('source-swagger-docs-json-file-path', {
            required: true,
        });
        const sourceSwaggerDocsJson = await readSwaggerDocsFromFilePath(sourceSwaggerDocsJsonFilePath);

        const targetSwaggerDocsJsonFilePath = core.getInput('target-swagger-docs-json-file-path', {
            required: true,
        });
        const targetSwaggerDocsJson = await readSwaggerDocsFromFilePath(targetSwaggerDocsJsonFilePath);

        const artifactName = core.getInput('artifact-name', {
            required: true,
        });

        // json 비교
        const diff = compareJsonsWithStructured(sourceSwaggerDocsJson, targetSwaggerDocsJson);

        if (diff.hunks.length === 0) {
            core.setOutput('hasChanges', 'false');
            return;
        }

        core.setOutput('hasChanges', 'true');

        // json 의 변경된 사항을 HTML 형식으로 변환하기
        const htmlContent = diffToHtml(diff);

        const fileName = "json-diff.html";
        fs.writeFileSync(fileName, htmlContent);

        await uploadArtifact(artifactName, `./${fileName}`);

    } catch (error) {
        console.error(error);
        core.setFailed(error.message);
    }
}

main();
