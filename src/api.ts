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

export async function getChallenges() {
    const token = core.getInput('rctf-token', { required: true });

    const url = core.getInput('rctf-url', { required: true });
    const endpoint = new URL('/api/v1/challs', url);

    const res = await (await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
    })).json() as ChallengesResponse;

    return res.data;
}

/**
 * Deploys the given rCTF challenge data to the backend.
 * @param data The data to deploy.
 */
export async function deployChallenge(data: UploadData) {
    const token = core.getInput('rctf-token', { required: true });

    const url = core.getInput('rctf-url', { required: true });
    const endpoint = new URL(`/api/v1/admin/challs/${data.name}`, url);

    const res = await (await fetch(endpoint, {
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
 * @param name The name of the challenge to delete.
 */
export async function deleteChallenge(name: string) {
    const token = core.getInput('rctf-token', { required: true });

    const url = core.getInput('rctf-url', { required: true });
    const endpoint = new URL(`/api/v1/admin/challs/${name}`, url);

    const res = await (await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })).json();

    // TODO

    core.warning(`Deleted ${name}`);
}
