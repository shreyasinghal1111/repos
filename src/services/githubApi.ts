export const githubApi = {
  getRepos: async (page: number) => {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc&page=${page}&per_page=30`
    )
    if (!response.ok) throw new Error('Failed to fetch repositories')
    return response.json()
  },

  getCodeFrequency: async (owner: string, repo: string) => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`)
    return response.json()
  },

  getCommitActivity: async (owner: string, repo: string) => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`)
    return response.json()
  },

  getContributors: async (owner: string, repo: string) => {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/contributors`
    )
    if (!response.ok) throw new Error('Failed to fetch contributors')
    return response.json()
  }
}