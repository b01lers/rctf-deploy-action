import * as core from '@actions/core'


async function run() {
    try {
        const url = core.getInput('rctf-url', { required: true });
        const token = core.getInput('rctf-token', { required: true });

        const apiBase = new URL('/api/v1', url).href;

        core.info(apiBase);

        core.setOutput('deployed', []);
    } catch (e) {
        if (e instanceof Error) core.setFailed(e.message);
    }
}

void run();
