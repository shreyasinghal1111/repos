import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { githubApi } from '../services/githubApi'
import { FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { RiErrorWarningFill } from "react-icons/ri";
import { GoRepoPush } from "react-icons/go";
import { GitHubRepo } from '../types/github'

export const RepoCard = ({ repo }: { repo: GitHubRepo }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>('commits')

  const { data: stats, isLoading } = useQuery({
    queryKey: ['detailedStats', repo.owner.login, repo.name],
    queryFn: () => githubApi.getDetailedStats(repo.owner.login, repo.name),
    enabled: isExpanded
  })

  const renderStats = () => {
    if (!stats) return null

    switch (selectedOption) {
      case 'commits':
        return (
          <div className="mt-4 bg-gray-700 p-4 rounded">
            <h4 className="text-lg font-semibold">Weekly Commits</h4>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {Array.isArray(stats.commitActivity) && stats.commitActivity.slice(0, 7).map((week, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-blue-500 rounded p-2">{week?.total || 0}</div>
                  <div className="text-xs mt-1">Week {idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'additions':
        return (
          <div className="mt-4 bg-gray-700 p-4 rounded">
            <h4 className="text-lg font-semibold">Code Additions</h4>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {Array.isArray(stats.codeFrequency) && stats.codeFrequency.slice(0, 7).map((week, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-green-500 rounded p-2">{Math.abs(week?.[1] || 0)}</div>
                  <div className="text-xs mt-1">Week {idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'deletions':
        return (
          <div className="mt-4 bg-gray-700 p-4 rounded">
            <h4 className="text-lg font-semibold">Code Deletions</h4>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {Array.isArray(stats.codeFrequency) && stats.codeFrequency.slice(0, 7).map((week, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-red-500 rounded p-2">{Math.abs(week?.[2] || 0)}</div>
                  <div className="text-xs mt-1">Week {idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <img src={repo.owner.avatar_url} alt="avatar" className="w-16 h-16 rounded-full" />
          <div>
            <h3 className="text-xl font-bold text-white">{repo.name}</h3>
            <p className="text-gray-300">{repo.description}</p>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <RiErrorWarningFill className="text-red-400" />
                {repo.open_issues_count}
              </span>
              <span className="flex items-center gap-1">
                <GoRepoPush className="text-green-400" />
                {repo.pushed_at}
                </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-gray-700 p-2 rounded-full"
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isExpanded && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={() => setSelectedOption('commits')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-t-md"
              >
                Commits
              </button>
              <button
                onClick={() => setSelectedOption('additions')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
              >
                Additions
              </button>
              <button
                onClick={() => setSelectedOption('deletions')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-b-md"
              >
                Deletions
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        isLoading ? (
          <div className="text-center mt-4">Loading stats...</div>
        ) : (
          renderStats()
        )
      )}
    </div>
  )
}