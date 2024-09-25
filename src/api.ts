import * as core from '@actions/core';
import { readFile, lstat, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import mime from 'mime-types';

// Utils
import type { ChallengesResponse, FilesResponse } from './types';


const token = core.getInput('rctf-token', { required: true });

const url = core.getInput('rctf-url', { required: true });
const apiBase = new URL('/api/v1', url).href;


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

export async function getChallenges() {
    const res = await (await fetch(`${apiBase}/challs`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })).json() as ChallengesResponse;

    return res.data;
}

/**
 * Deploys the given rCTF challenge data to the backend.
 * @param data The data to deploy.
 */
export async function deployChallenge(data: UploadData) {
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
 * @param name The name of the challenge to delete.
 */
export async function deleteChallenge(name: string) {
    const res = await (await fetch(`${apiBase}/admin/challs/${name}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })).json();

    // TODO

    core.warning(`Deleted ${name}`);
}

/**
 * Attempts to upload the dist folder for the given challenge, or clears any previously uploaded files
 * if no dist folder is found.
 *
 * @param category The category of the challenge.
 * @param name The name of the challenge.
 * @param data The data associated with the challenge.
 */
export async function uploadDist(category: string, name: string, data: UploadData) {
    const baseDir = `./${core.getInput('base-dir') || 'src'}`;
    const distPath = `${baseDir}/${category}/${name}/dist`;

    // If the dist folder exists, upload all files within it.
    // If there's no dist to upload, send a `PUT` with files: [] to clear any files previously uploaded.
    const files = existsSync(distPath) && (await lstat(distPath)).isDirectory()
        ? await uploadFiles(distPath)
        : []

    await (await fetch(`${apiBase}/admin/challs/${data.name}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: { files } })
    })).json();
}

/**
 * Uploads all files in the given dist folder to rCTF, returning the array of uploaded file objects.
 *
 * @param distPath The path of the dist folder to upload.
 * @returns The uploaded file objects returned by rCTF.
 */
async function uploadFiles(distPath: string) {
    // Encode files to rCTF base64 upload format
    const files = (await readdir(distPath, { withFileTypes: true }))
        .filter((d) => d.isFile())
        .map((d) => ({ name: d.name, data: encodeFile(`${distPath}/${d.name}`) }))

    const res = await (await fetch(`${apiBase}/admin/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files })
    })).json() as FilesResponse;

    return res.data;
}

async function encodeFile(path: string) {
    const mimetype = mime.lookup(path) || 'application/octet-stream';
    const raw = await readFile(path, { encoding: 'base64' });

    return `data:${mimetype};base64,${raw}`;
}
