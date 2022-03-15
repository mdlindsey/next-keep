import { GitHubAPI } from "./github"
import { Package } from "./package"

export type Repo = {
    stats: {
        stars: number
        forks: number
        watchers: number
    }
    owner: {
        url: string
        name: string
        bio: string
        avatar: string
        username: string
        type: 'user' | 'team'
    }
    releases: {
        tag: string
        notes: string
        timestamp: number
    }[]
}

const githubRepoFactory = async (pkg:Package):Promise<Repo> => {
    let stats:Repo['stats'], owner:Repo['owner'], releases:Repo['releases']
    const { identifier:repoIdentifier, ownerIdentifier } = pkg.repo
    await Promise.all([
      GitHubAPI.OwnerProfile(ownerIdentifier).then(u => owner = u),
      GitHubAPI.RepoStats(ownerIdentifier, repoIdentifier).then(s => stats = s),
      GitHubAPI.RepoReleases(ownerIdentifier, repoIdentifier).then(r => releases = r),
    ])
    return {
        stats,
        owner,
        releases,
    }
}
const gitlabRepoFactory = async () => {}
const bitbucketRepoFactory = async () => {}

export const repoFactory = async (pkg:Package):Promise<Repo> => {
    switch(pkg.repo.platform) {
        case 'github':
            return githubRepoFactory(pkg)
        default:
            throw new Error(`unsupported git platform "${pkg.repo.platform}"`)
    }
}
