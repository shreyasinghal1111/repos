import { useQuery } from '@tanstack/react-query'

import { useGithubApi } from '../services/githubApi'
import { useState } from 'react'

export const useRepos = (page: number) => {
  return useGithubApi.useRepos(page)
}

export const useRepo = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 30

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['repos', currentPage],
    queryFn: () => useGithubApi.useRepos(currentPage),
    staleTime: Infinity
  })

  const totalPages = Math.ceil((data?.data?.total_count || 0) / pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return {
    repos: data?.data?.items || [],
    isLoading,
    error,
    currentPage,
    totalPages,
    handlePageChange
  }
}