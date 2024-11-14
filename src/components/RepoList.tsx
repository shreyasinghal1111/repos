import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GitHubRepo } from '../types/github'
import { RepoCard } from './RepoCard'
import { Pagination } from './Pagination'

export const RepoList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 30 // GitHub's default items per page

  const { data, isLoading } = useQuery({
    queryKey: ['repos', currentPage],
    queryFn: async () => {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc&page=${currentPage}&per_page=${perPage}`
      )
      return response.json()
    }
  })

  const totalPages = Math.ceil((data?.total_count || 0) / perPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  if (isLoading) return <div className="flex justify-center items-center min-h-[400px]">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {data?.items.map((repo: GitHubRepo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}