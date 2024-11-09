import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import * as core from '@actions/core';

// Utils
import type { UploadData } from './api';


const challSchema = z.object({
    author: z.string(),
    description: z.string(),
    flag: z.string(),
    name: z.string(),
    hidden: z.boolean().optional(),
    minPoints: z.number().int().optional(),
    maxPoints: z.number().int().optional(),
    tiebreakEligible: z.boolean().optional(),

    // Non-standard properties
    prereqs: z.array(z.string()).optional(),
    difficulty: z.string().optional(),
});

/**
 * Gets the rCTF challenge data for a given category and challenge name.
 *
 * @param category The category directory.
 * @param name The challenge directory.
 *
 * @returns The parsed data, or `null` if the challenge should be skipped.
 */
export async function getChallengeMetadata(category: string, name: string) {
    const baseDir = `./${core.getInput('base-dir') || 'src'}`;

    const raw = await readFile(`${baseDir}/${category}/${name}/chal.json`)
        .catch((e) => { throw new Error(`Challenge data not found for \`${category}/${name}\`.`) });

    const { data, success, error } = challSchema.safeParse(JSON.parse(raw.toString()));
    if (!success)
        throw new Error(`Invalid challenge data for \`${category}/${name}\`: ${error.message}`);

    // Skip hidden challenges
    if (data.hidden) {
        core.info(`Skipping ${category}/${data.name}`);
        return null;
    }

    const ret: UploadData = {
        author: data.author,
        category,
        description: data.description,
        flag: data.flag,
        name: data.name,
        points: {
            min: data.minPoints ?? 100,
            max: data.maxPoints ?? 500
        },
        tiebreakEligible: data.tiebreakEligible ?? true,
        prereqs: data.prereqs,
        difficulty: data.difficulty
    }
    return ret;
}
