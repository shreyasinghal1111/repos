import React from 'react'
import { GitHubRepo } from '../types/github'
import { IoStar } from "react-icons/io5";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { GoRepoPush } from "react-icons/go";


interface RepoListProps {
  repos: GitHubRepo[]
  isLoading: boolean
  error: Error | null
}

export const RepoList: React.FC<RepoListProps> = ({ repos, isLoading, error }) => {
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="space-y-4">
      {repos.map((repo) => (
        <div key={repo.id} className="border p-4 rounded shadow">
          <div className="flex items-center gap-4">
            <img 
              src={repo.owner.avatar_url} 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{repo.name}</h2>
              <p className="text-gray-600">{repo.description}</p>
              <div className="flex gap-4 mt-2">
                <span  className='font-bold'>
                    <IoStar className='text-yellow-300'/>{repo.stargazers_count}
                     </span>
                <span className='font-bold'>
                <AiOutlineIssuesClose className='text-red-500 font-bold'/>
                    {repo.open_issues_count} issues</span>
                <span>
                    <GoRepoPush className='text-green-500 font-bold'/>
                     {repo.pushed_at}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
