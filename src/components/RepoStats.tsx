import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { githubApi } from '../services/githubApi'

interface RepoStatsProps {
  owner: string
  repo: string
}

type StatType = 'commits' | 'additions' | 'deletions'

export const RepoStats: React.FC<RepoStatsProps> = ({ owner, repo }) => {
  const [statType, setStatType] = useState<StatType>('commits')

  const { data: codeFrequency } = useQuery({
    queryKey: ['codeFrequency', owner, repo],
    queryFn: () => githubApi.getCodeFrequency(owner, repo)
  })

  const { data: commitActivity } = useQuery({
    queryKey: ['commitActivity', owner, repo],
    queryFn: () => githubApi.getCommitActivity(owner, repo)
  })

  const getChartOptions = () => {
    switch (statType) {
      case 'commits':
        return {
          title: { text: 'Weekly Commits' },
          series: [{
            name: 'Commits',
            data: commitActivity?.map((week: { week: number; total: number }) => ({
              x: week.week * 1000,
              y: week.total
            })) || []          }]
        }
      case 'additions':
        return {
          title: { text: 'Weekly Additions' },
          series: [{
            name: 'Additions',
            color: '#2ecc71',
            data: codeFrequency?.map((week: [number, number, number]) => ({
              x: week[0] * 1000,
              y: week[1]
            })) || []          }]
        }
      case 'deletions':
        return {
          title: { text: 'Weekly Deletions' },
          series: [{
            name: 'Deletions',
            color: '#e74c3c',
            data: codeFrequency?.map((week: [number, number, number]) => ({
              x: week[0] * 1000,
              y: Math.abs(week[2])
            })) || []          }]
        }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setStatType('commits')}
          className={`px-4 py-2 rounded ${
            statType === 'commits' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Commits
        </button>
        <button
          onClick={() => setStatType('additions')}
          className={`px-4 py-2 rounded ${
            statType === 'additions' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Additions
        </button>
        <button
          onClick={() => setStatType('deletions')}
          className={`px-4 py-2 rounded ${
            statType === 'deletions' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Deletions
        </button>
      </div>

      <HighchartsReact
        highcharts={Highcharts}
        options={{
          ...getChartOptions(),
          chart: {
            type: 'line',
            zoomType: 'x'
          },
          xAxis: {
            type: 'datetime'
          },
          yAxis: {
            title: {
              text: statType.charAt(0).toUpperCase() + statType.slice(1)
            }
          },
          tooltip: {
            formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
              return `<b>${this.series.name}</b><br/>
                Date: ${Highcharts.dateFormat('%Y-%m-%d', this.x as number)}<br/>
                Value: ${this.y}`
            }          }
        }}
      />
    </div>
  )
}