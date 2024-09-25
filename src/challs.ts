import { readFile } from 'node:fs/promises';
import type { ChallengeData } from './api';


/**
 * Gets the rCTF challenge data for a given category and challenge name.
 *
 * @param base The base challenge directory.
 * @param category The category directory.
 * @param name The challenge directory.
 *
 * @returns The parsed data, or `null` if the challenge should be skipped.
 */
export async function getChallengeMetadata(base: string, category: string, name: string) {
    let raw;
    try {
        raw = (await readFile(`${base}/${category}/${name}/chal.json`)).toString();
    } catch {
        throw new Error(`Challenge data not found for \`${category}/${name}\`.`)
    }

    const data = JSON.parse(raw);
    if (!('author' in data) || typeof data.author !== 'string')
        throw new Error(`Field \`author\` for \`${category}/${name}\` missing or wrong type.`);
    if (!('description' in data) || typeof data.description !== 'string')
        throw new Error(`Field \`author\` for \`${category}/${name}\` missing or wrong type.`);
    if (!('flag' in data) || typeof data.description !== 'string')
        throw new Error(`Field \`flag\` for \`${category}/${name}\` missing or wrong type.`);
    if (!('name' in data) || typeof data.name !== 'string')
        throw new Error(`Field \`name\` for \`${category}/${name}\` missing or wrong type.`);

    const ret: ChallengeData = {
        author: data.author,
        category,
        description: data.description,
        flag: data.flag,
        name: data.name,
        points: {
            min: 100,
            max: 500
        },
        tiebreakEligible: true // TODO
    }

    return ret;
}
