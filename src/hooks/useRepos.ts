import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GitHubSearchResponse } from '../types/github'
import { githubApi } from '../services/githubApi'
import { GitHubResponse } from '../types/github'

export const useRepos = (daysAgo: number) => {
  const [currentPage, setCurrentPage] = useState(1)
  const PER_PAGE = 30

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

  const { data, isLoading, error } = useQuery<GitHubResponse>({
    queryKey: ['repos', daysAgo, currentPage],
    queryFn: () => githubApi.getRepos(currentPage)
  })

  return {
    repos: data?.items || [],
    isLoading,
    error,
    currentPage,
    totalPages: Math.ceil((data?.total_count || 0) / PER_PAGE),
    setCurrentPage
  }
  }
