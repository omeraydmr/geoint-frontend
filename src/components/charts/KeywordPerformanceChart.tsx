'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface KeywordPerformanceItem {
  keyword_id: string
  keyword: string
  avg_geoint_score: number
  top_region: string | null
  top_region_score: number
  trend_direction: 'up' | 'down' | 'stable'
  regions_count: number
}

interface KeywordPerformanceData {
  keywords: KeywordPerformanceItem[]
  total_keywords: number
}

interface KeywordPerformanceChartProps {
  data: KeywordPerformanceData | null
  isLoading?: boolean
}

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff']

// Custom tooltip component for proper theming
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-1">{data.fullName}</p>
        <p className="text-xs text-surface-600 dark:text-surface-400">GEOINT: {data.score}</p>
        {data.topRegion && (
          <p className="text-xs text-surface-600 dark:text-surface-400">En Iyi Bolge: {data.topRegion} ({data.topScore})</p>
        )}
        <p className="text-xs text-surface-500 dark:text-surface-500">Bolge Sayisi: {data.regions}</p>
      </div>
    )
  }
  return null
}

export function KeywordPerformanceChart({ data, isLoading }: KeywordPerformanceChartProps) {
  const chartData = useMemo(() => {
    if (!data?.keywords?.length) return []

    return data.keywords.slice(0, 6).map((keyword) => ({
      name: keyword.keyword.length > 15 ? keyword.keyword.slice(0, 15) + '...' : keyword.keyword,
      fullName: keyword.keyword,
      score: keyword.avg_geoint_score,
      topRegion: keyword.top_region,
      topScore: keyword.top_region_score,
      regions: keyword.regions_count,
    }))
  }, [data])

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-surface-50 dark:bg-surface-800 rounded-xl animate-pulse">
        <div className="text-surface-400 dark:text-surface-500">Yukleniyor...</div>
      </div>
    )
  }

  if (!data || !chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center bg-surface-50 dark:bg-surface-800 rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Anahtar kelime bulunmuyor</p>
          <p className="text-xs text-surface-400 dark:text-surface-500">Takip etmek icin anahtar kelime ekleyin</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-surface-900 dark:text-surface-100">{data.total_keywords}</span>
          <span className="text-sm text-surface-500 dark:text-surface-400">Anahtar Kelime</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-surface-200 dark:stroke-surface-700" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              tickLine={false}
              className="text-surface-500 dark:text-surface-400 fill-surface-500 dark:fill-surface-400"
              axisLine={{ className: 'stroke-surface-200 dark:stroke-surface-700' }}
              domain={[0, 100]}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={100}
              className="text-surface-500 dark:text-surface-400 fill-surface-500 dark:fill-surface-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
