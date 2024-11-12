import { GitHubRepo } from '../types/github'
import { RepoCard } from './RepoCard'

export const RepoList = ({ repos, error }: { repos: GitHubRepo[], error: Error | null }) => {
  if (error) return <div className="text-red-500">Error: {error.message}</div>

  return (
    <div className="space-y-4">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  )
}
