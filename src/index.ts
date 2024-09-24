import * as core from '@actions/core'
import { readdir } from 'node:fs/promises';


async function run() {
    try {
        const url = core.getInput('rctf-url', { required: true });
        const token = core.getInput('rctf-token', { required: true });

        const apiBase = new URL('/api/v1', url).href;
        core.info(`API_BASE: ${apiBase}`);

        // Parse categories from subdirectories of challenge directory.
        const categories = (await readdir('./src', { withFileTypes: true }))
            .filter((d) => d.isDirectory())
            .map((d) => d.name);

        core.info(`Categories: [${categories.join(', ')}]`);

        for (const category of categories) {
            const challs = (await readdir(`./src/${category}`, { withFileTypes: true }))
                .filter((d) => d.isDirectory())
                .map((d) => d.name);

            for (const chall of challs) {
                core.info(`Found chall \`${category}/${chall}\``);
            }
        }

        core.setOutput('categories', categories);
        core.setOutput('deployed', []);
    } catch (e) {
        if (e instanceof Error) core.setFailed(e.message);
    }
}

void run();
