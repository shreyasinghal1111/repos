import { useQuery } from '@tanstack/react-query'
import { githubApi } from '../services/githubApi'
import { useState } from 'react'

export const useRepo = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 30

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['repos', currentPage],
    queryFn: () => githubApi.getRepos(currentPage),
    staleTime: Infinity
  })

  const totalPages = Math.ceil((data?.total_count || 0) / pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return {
    repos: data?.items || [],
    isLoading,
    error,
    currentPage,
    totalPages,
    handlePageChange
  }
}