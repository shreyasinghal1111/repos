import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { githubApi } from '../services/githubApi'

type StatsOption = 'commits' | 'additions' | 'deletions'

export const StatsDropdown = ({ owner, repo }: { owner: string, repo: string }) => {
  const [selectedStat, setSelectedStat] = useState<StatsOption>('commits')

  const { data: stats, isLoading } = useQuery({
    queryKey: ['detailedStats', owner, repo],
    queryFn: () => githubApi.getDetailedStats(owner, repo),
    staleTime: 60000
  })

  const renderStats = () => {
    if (!stats) return null

    const weeklyData = Array.isArray(stats.commitActivity) ? stats.commitActivity : []
    const codeFrequencyData = Array.isArray(stats.codeFrequency) ? stats.codeFrequency : []

    switch (selectedStat) {
      case 'commits':
        return (
          <div className="mt-4 bg-gray-700 p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Weekly Commits</h4>
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.slice(0, 7).map((week, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-blue-500 rounded p-2">
                    {typeof week === 'object' ? week.total || 0 : 0}
                  </div>
                  <div className="text-xs mt-1">Week {idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'additions':
        return (
          <div className="mt-4 bg-gray-700 p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Code Additions</h4>
            <div className="grid grid-cols-7 gap-2">
              {codeFrequencyData.slice(0, 7).map((week, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-green-500 rounded p-2">
                    {Array.isArray(week) ? Math.abs(week[1] || 0) : 0}
                  </div>
                  <div className="text-xs mt-1">Week {idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'deletions':
        return (
          <div className="mt-4 bg-gray-700 p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Code Deletions</h4>
            <div className="grid grid-cols-7 gap-2">
              {codeFrequencyData.slice(0, 7).map((week, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-red-500 rounded p-2">
                    {Array.isArray(week) ? Math.abs(week[2] || 0) : 0}
                  </div>
                  <div className="text-xs mt-1">Week {idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="mt-4">
      <select
        value={selectedStat}
        onChange={(e) => setSelectedStat(e.target.value as StatsOption)}
        className="bg-gray-700 text-white rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="commits">Commits</option>
        <option value="additions">Additions</option>
        <option value="deletions">Deletions</option>
      </select>

      {isLoading ? (
        <div className="text-center mt-4">Loading detailed stats...</div>
      ) : (
        renderStats()
      )}
    </div>
  )
}