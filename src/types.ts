type Challenge = {
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

export type ChallengesResponse = {
    kind: 'goodChallenges',
    message: string,
    data: Challenge[]
}

export type FilesResponse = {
    kind: "goodFilesUpload",
    message: string,
    data: { name: string, url: string }[]
}
