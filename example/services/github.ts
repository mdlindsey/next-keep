import { http } from './http'
import type { Repo } from './repo'

export class GitHubAPI {
    public static async OwnerProfile(owner:string):Promise<Repo['owner']> {
        const { data } = await http.get(`https://api.github.com/users/${owner}`)
        return {
            name: data.name,
            bio: data.bio,
            url: `https://github.com/${owner}`,
            type: data.type.toLowerCase() === 'user' ? 'user' : 'team',
            avatar: data.avatar_url,
            username: data.login,
        }
    }
    public static async RepoStats(owner:string, repo:string):Promise<Repo['stats']> {
        const { data } = await http.get(`https://api.github.com/repos/${owner}/${repo}`)
        return {
            forks: data.forks_count,
            stars: data.stargazers_count,
            watchers: data.watchers_count,
        }
    }
    public static async RepoReleases(owner:string, repo:string):Promise<Repo['releases']> {
        const { data } = await http.get(`https://api.github.com/repos/${owner}/${repo}/releases`)
        return data.map((r:any) => ({
            tag: r.tag_name,
            notes: r.body,
            timestamp: Number(Date.parse(r.created_at)),
        }))
    }
}