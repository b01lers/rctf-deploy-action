import * as core from '@actions/core'


async function run() {
    try {
        // ...
    } catch (e) {
        if (e instanceof Error) core.setFailed(e.message);
    }
}

void run();
