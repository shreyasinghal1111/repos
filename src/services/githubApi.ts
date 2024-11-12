import { GitHubResponse, RepoStats } from '../types/github'

export const githubApi = {
  async getRepositories(formattedDate: string, currentPage: number, perPage: number): Promise<GitHubResponse> {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=created:>${formattedDate}&sort=stars&order=desc&page=${currentPage}&per_page=${perPage}`
    )
    return response.json()
  },

  async getRepoStats(owner: string, repo: string): Promise<RepoStats> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
    return response.json()
  },

  async getDetailedStats(owner: string, repo: string) {
    const [codeFrequency, commitActivity, contributors] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`).then(r => r.json()),
      fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`).then(r => r.json()),
      fetch(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`).then(r => r.json())
    ])

    return {
      codeFrequency,
      commitActivity,
      contributors
    }
  }
}