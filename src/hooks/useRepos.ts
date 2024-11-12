import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { githubApi } from '../services/githubApi'
import { GitHubResponse } from '../types/github'

export const useRepos = (daysAgo: number) => {
  const [currentPage, setCurrentPage] = useState(1)
  const PER_PAGE = 30

  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const formattedDate = date.toISOString().split('T')[0]

  const { data, isLoading, error } = useQuery<GitHubResponse>({
    queryKey: ['repos', daysAgo, currentPage],
    queryFn: () => githubApi.getRepositories(formattedDate, currentPage, PER_PAGE)
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
