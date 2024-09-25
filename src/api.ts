import * as core from '@actions/core';


export type UploadData = {
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

export type Challenge = {
    name: string,
    id: string,
    files: FileData[]
    category: string,
    author: string,
    description: string,
    sortWeight: number,
    solves: number,
    points: number,
}

type FileData = {
    url: string,
    name: string
}

type ChallengesResponse = {
    kind: 'goodChallenges',
    message: string,
    data: Challenge[]
}

export async function getChallenges(apiBase: string, token: string) {
    const res = await (await fetch(`${apiBase}/challs`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })).json() as ChallengesResponse;

    return res.data;
}

/**
 * Deploys the given rCTF challenge data to the backend.
 *
 * @param apiBase The API URL of the rCTF backend to deploy to.
 * @param token The auth token of the configured admin account.
 * @param data The data to deploy.
 */
export async function deployChallenge(apiBase: string, token: string, data: UploadData) {
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

/**
 * Deletes the given rCTF challenge from the backend.
 *
 * @param apiBase The API URL of the rCTF backend to deploy to.
 * @param token The auth token of the configured admin account.
 * @param name The name of the challenge to delete.
 */
export async function deleteChallenge(apiBase: string, token: string, name: string) {
    const res = await (await fetch(`${apiBase}/admin/challs/${name}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })).json();

    // TODO

    core.warning(`Deleted ${name}`);
}
