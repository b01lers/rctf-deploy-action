import * as core from '@actions/core'
import { readdir } from 'node:fs/promises';

// Utils
import { getChallengeMetadata } from './challs';
import { deployChallenge } from './api';


async function run() {
    try {
        const url = core.getInput('rctf-url', { required: true });
        const token = core.getInput('rctf-token', { required: true });

        const apiBase = new URL('/api/v1', url).href;
        core.info(`API_BASE: ${apiBase}`);

        const baseDir = `./${core.getInput('base-dir') || 'src'}`;

        // Parse categories from subdirectories of challenge directory.
        const categories = (await readdir(baseDir, { withFileTypes: true }))
            .filter((d) => d.isDirectory())
            .map((d) => d.name);

        core.info(`Categories: [${categories.join(', ')}]`);

        for (const category of categories) {
            const challs = (await readdir(`${baseDir}/${category}`, { withFileTypes: true }))
                .filter((d) => d.isDirectory())
                .map((d) => d.name);

            for (const chall of challs) {
                core.debug(`Processing chall \`${category}/${chall}\``);

                const data = await getChallengeMetadata(baseDir, category, chall);
                core.debug(JSON.stringify(data));

                if (!data) continue;

                await deployChallenge(apiBase, token, data);
            }
        }

        core.setOutput('categories', categories);
        core.setOutput('deployed', []);
    } catch (e) {
        if (e instanceof Error) core.setFailed(e.message);
    }
}

void run();
