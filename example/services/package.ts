const platformNames = {
    github: 'GitHub',
    gitlab: 'GitLab',
    bitbucket: 'BitBucket',
}
export type Package = {
    name: string
    author: string
    version: string
    description: string
    repo: {
        url: string
        ownerUrl: string
        identifier: string
        ownerIdentifier: string
        platform: 'github' | 'gitlab' | 'bitbucket'
        platformName: 'GitHub' | 'GitLab' | 'BitBucket'
    }
}
export const packageFactory = (packageJson:{[key:string]:any}):Package => {
    if (!packageJson.repository) {
        throw new Error('package.json missing repository')
    }
    // repository field may be url or object containing url property
    const repositoryUrl = packageJson.repository.url || packageJson.repository
    // repository url may contain trailing slashes or .git extension
    const cleanRepoUrl = repositoryUrl.replace(/(.git|\/)$/i, '')
    // this will not work for nested groups which are supported on GitLab
    const ownerUrl = cleanRepoUrl.split('/').slice(0, -1).join('/')
    const [ownerId, repoId] = cleanRepoUrl.split('/').slice(-2)
    const [platformDomain] = cleanRepoUrl.replace(/^https?:\/\//i, '').split('/')
    const platform = platformDomain.replace(/.com$/i, '')
    return {
        name: packageJson.name,
        author: packageJson.author?.name || packageJson.author,
        version: packageJson.version,
        description: packageJson.description,
        repo: {
            url: repositoryUrl,
            identifier: repoId,
            ownerUrl,
            ownerIdentifier: ownerId,
            platform,
            platformName: platformNames[platform],
        }
    }
}
