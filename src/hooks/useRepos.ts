import { useQuery } from '@tanstack/react-query'
import { GitHubSearchResponse } from '../types/github'

export const useGithubRepos = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const formattedDate = date.toISOString().split('T')[0]

  return useQuery({
    queryKey: ['repos', daysAgo],
    queryFn: async () => {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=created:>${formattedDate}&sort=stars&order=desc`
      )
      const data: GitHubSearchResponse = await response.json()
      return data
    }
  })
}
