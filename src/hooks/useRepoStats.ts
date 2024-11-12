import { useQuery } from '@tanstack/react-query'
import { githubApi } from '../services/githubApi'

export const useRepoStats = (owner: string, repo: string,
     enabled: boolean = true) => {
  return useQuery({
    queryKey: ['repoStats', owner, repo],
    queryFn: () => githubApi.getRepoStats(owner, repo),
    enabled: enabled && !!owner && !!repo,
    retry: 3,
    staleTime: 10 * 60 * 1000
  })
}
