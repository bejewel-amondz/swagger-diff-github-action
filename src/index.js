import core from '@actions/core';
import artifact from '@actions/artifact';
import { compareJsonsWithStructured, diffToHtml } from "./functions.js";
// import * as fs from "fs";

async function main() {
    try {
        const sourceSwaggerDocsJson = core.getInput('source-swagger-docs-json', {
            required: true,
        });
        // const sourceSwaggerDocsJson = JSON.parse(fs.readFileSync('./file1.json', 'utf8'));
        const targetSwaggerDocsJson = core.getInput('target-swagger-docs-json', {
            required: true,
        });
        // const targetSwaggerDocsJson = JSON.parse(fs.readFileSync('./file2.json', 'utf8'));
        const artifactName = core.getInput('artifact-name', {
            required: true,
        });

        // json 비교
        const diff = compareJsonsWithStructured({
            json: sourceSwaggerDocsJson
        }, {
                json: targetSwaggerDocsJson
            }
            );

        // json 의 변경된 사항을 HTML 형식으로 변환하기
        const htmlContent = diffToHtml(diff);
        const contentBuffer = Buffer.from(htmlContent, "utf-8");

        const fileName = "buffer-content.html";

        const file = {
            path: fileName,
            size: contentBuffer.length,
            file: contentBuffer
        };

        const artifactClient = artifact.create();
        const uploadResponse = await artifactClient.uploadArtifact(artifactName, [file], __dirname, {
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
