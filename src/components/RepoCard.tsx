import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { RiErrorWarningFill } from "react-icons/ri"
import { GoRepoPush } from "react-icons/go"
import { GitHubRepo } from '../types/github'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export const RepoCard = ({ repo }: { repo: GitHubRepo }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>('commits')
  const { data: commitData } = useQuery({
    queryKey: ['commits', repo.owner.login, repo.name],
    queryFn: async () => {
      const response = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/stats/commit_activity`)
      return response.json()
    },
    enabled: showChart && selectedOption === 'commits',
    gcTime: 0,
  })

  const { data: codeFrequencyData } = useQuery({
    queryKey: ['codeFrequency', repo.owner.login, repo.name],
    queryFn: async () => {
      const response = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/stats/code_frequency`)
      return response.json()
    },
    enabled: showChart && (selectedOption === 'additions' || selectedOption === 'deletions')
  })

  const handleStatClick = (type: string) => {
    setSelectedOption(type)
    setShowChart(true)
    setIsExpanded(true)
  }

  const renderChart = () => {
    if (!showChart) return null

    let chartData = []
  
    if (selectedOption === 'commits') {
      chartData = Array.isArray(commitData) ? 

        commitData.map((week: { week: number; total: number }) => [week.week * 1000, week.total]) : []
    } else {
      chartData = Array.isArray(codeFrequencyData) ?
        codeFrequencyData.map((week: [number, number, number]) => [
          week[0] * 1000,
          selectedOption === 'additions' ? week[1] : Math.abs(week[2])

        ]) : []
    }

    const chartOptions = {
      chart: {
        backgroundColor: '#374151',
        type: 'line',
        height: 250
      },
      title: {
        text: selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1),
        style: { color: '#fff' }
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#fff' } }
      },
      yAxis: {
        title: { text: 'Count', style: { color: '#fff' } },
        labels: { style: { color: '#fff' } }
      },
      series: [{
        name: selectedOption,
        data: chartData,
        color: selectedOption === 'commits' 
          ? '#3B82F6' 
          : selectedOption === 'additions'
          ? '#10B981'
          : '#EF4444'
      }],
      accessibility: { enabled: false }
    }

    return (
      <div className="mt-4 bg-gray-700 p-4 rounded">
        {chartData.length > 0 ? (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        ) : (
          <div className="text-white text-center p-4">Loading chart data...</div>
        )}
      </div>
    )
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
              <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleStatClick('commits')}>
                <FaStar className="text-yellow-400" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleStatClick('additions')}>
                <RiErrorWarningFill className="text-red-400" />
                {repo.open_issues_count}
              </span>
              <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleStatClick('deletions')}>
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
                onClick={() => handleStatClick('commits')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-t-md"
              >
                Commits
              </button>
              <button
                onClick={() => handleStatClick('additions')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
              >
                Additions
              </button>
              <button
                onClick={() => handleStatClick('deletions')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-b-md"
              >
                Deletions
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && renderChart()}
    </div>
  )
}