import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRepo } from './hooks/useRepo'
import { RepoList } from './components/RepoList'

const queryClient = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

const AppContent = () => {
  const { data: repos, isLoading, error } = useRepo()
  
  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold text-white 
      mb-8 text-center relative before:absolute before:bottom-0
       before:h-1 before:w-48 before:left-1/2 before:-translate-x-1/2
        before:bg-blue-500 before:rounded-full pb-2 hover:before:w-96 before:transition-all">
      Trending Github Repositories</h1>
      <RepoList 
        repos={repos || []}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
};
export default App