import { useQuery } from '@tanstack/react-query'
import { GitHubResponse } from '../types/github'

export const useGithubApi = {
  useRepos: (page: number) => {
    return useQuery<GitHubResponse>({
      queryKey: ['repos', page],
      queryFn: async () => {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc&page=${page}&per_page=30`
        )
        if (!response.ok) throw new Error('Failed to fetch repositories')
        return response.json()
      },
      staleTime: 5 * 60 * 1000,
    })
  },

  useCodeFrequency: (owner: string, repo: string) => {
    return useQuery({
      queryKey: ['codeFrequency', owner, repo],
      queryFn: async () => {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`)
        if (!response.ok) throw new Error('Failed to fetch code frequency')
        return response.json()
      },
      enabled: !!owner && !!repo,
    })
  },

  useCommitActivity: (owner: string, repo: string) => {
    return useQuery({
      queryKey: ['commitActivity', owner, repo],
      queryFn: async () => {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`)
        if (!response.ok) throw new Error('Failed to fetch commit activity')
        return response.json()
      },
      enabled: !!owner && !!repo,
    })
  },

  getContributors: async (owner: string, repo: string) => {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/contributors`
    )
    if (!response.ok) throw new Error('Failed to fetch contributors')
    return response.json()
  }
}