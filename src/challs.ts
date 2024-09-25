import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import * as core from '@actions/core';

// Utils
import type { ChallengeData } from './api';


const challSchema = z.object({
    author: z.string(),
    description: z.string(),
    flag: z.string(),
    name: z.string(),
    hidden: z.boolean().optional()
});

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
    const raw = await readFile(`${base}/${category}/${name}/chal.json`)
        .catch((e) => { throw new Error(`Challenge data not found for \`${category}/${name}\`.`) });

    const { data, success, error } = challSchema.safeParse(raw.toString());
    if (!success)
        throw new Error(`Invalid challenge data for \`${category}/${name}\`: ${error.message}`);

    // Skip hidden challenges
    if (data.hidden) {
        core.info(`Skipping ${category}/${data.name}`);
        return null;
    }

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
