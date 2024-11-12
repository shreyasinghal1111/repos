import { useState } from 'react'
import { RepoList } from './components/RepoList'
import { Pagination } from './components/Pagination'
import { useRepos } from './hooks/useRepos'
import ClassicLoader from './components/ClassicLoader'

function App() {
  const [timeFilter, setTimeFilter] = useState(30)
  const {
    repos,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage
  } = useRepos(timeFilter)
  if (isLoading) {
    return <ClassicLoader />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-4">
        {isLoading && <ClassicLoader />}
        <h1 className="text-3xl font-bold text-white mb-8 text-center relative 
        before:absolute before:bottom-0 before:h-1 before:w-48 before:left-1/2 
        before:-translate-x-1/2 before:bg-blue-500 before:rounded-full pb-2 
        hover:before:w-96 before:transition-all">Trending GitHub Repositories</h1>
        <div className="mt-6">
          <RepoList 
            repos={repos}
            error={error as Error}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default App
