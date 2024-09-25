import * as core from '@actions/core';


export type ChallengeData = {
    author: string,
    category: string,
    description: string,
    flag: string,
    name: string,
    points: {
        min: number,
        max: number
    },
    tiebreakEligible: boolean
}

/**
 * Deploys the given rCTF challenge data to the backend.
 *
 * @param apiBase The API URL of the rCTF backend to deploy to.
 * @param token The auth token of the configured admin account.
 * @param data The data to deploy.
 */
export async function deployChallenge(apiBase: string, token: string, data: ChallengeData) {
    const res = await (await fetch(`${apiBase}/admin/challs/${data.name}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })).json();

    // TODO

    core.info(`Deployed ${data.category}/${data.name}`);
}
