import { useState } from 'react'
// import { TimeFilter } from './components/TimeFilter'
import { RepoList } from './components/RepoList'
import { useGithubRepos } from './hooks/useRepos'

function App() {
  const [timeFilter, setTimeFilter] = useState(30)
  const { data, isLoading, error } = useGithubRepos(timeFilter)

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center"> GitHub Repositories</h1>
      {/* <TimeFilter value={timeFilter} onChange={setTimeFilter} /> */}
      <div className="mt-6 ">
        <RepoList 
          repos={data?.items ?? []} 
          isLoading={isLoading} 
          error={error as Error}
        />
      </div>
    </div>
  )
}

export default App
