const fs = require("fs");
const core = require('@actions/core');
const artifact = require('@actions/artifact');
const { compareJsonsWithStructured, diffToHtml } = require("./functions.js");

async function main() {
    try {
        const sourceSwaggerDocsJson = core.getInput('source-swagger-docs-json', {
            required: true,
        });
        const targetSwaggerDocsJson = core.getInput('target-swagger-docs-json', {
            required: true,
        });
        const artifactName = core.getInput('artifact-name', {
            required: true,
        });

        // json 비교
        const diff = compareJsonsWithStructured(sourceSwaggerDocsJson, targetSwaggerDocsJson);

        // json 의 변경된 사항을 HTML 형식으로 변환하기
        const htmlContent = diffToHtml(diff);

        const fileName = "json-diff.html";
        fs.writeFileSync(fileName, htmlContent);

        const rootDirectory = '.'
        const filePath = './' + fileName;
        const artifactClient = artifact.create();
        const uploadResponse = await artifactClient.uploadArtifact(artifactName, [filePath], rootDirectory, {
            continueOnError: false
        });

        if (uploadResponse.failedItems.length > 0) {
            core.setFailed('Some items failed to upload');
        } else {
            core.info('Artifact uploaded successfully');
        }

    } catch (error) {
        console.error(error);
        core.setFailed(error.message);
    }
}

main();
