'use client'

import { useMemo } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

interface TrendDataPoint {
  date: string
  value: number
  label?: string
}

interface GeointTrendData {
  data: TrendDataPoint[]
  period_start: string
  period_end: string
  average_score: number
  trend_direction: 'up' | 'down' | 'stable'
  change_percentage: number
}

interface GeointTrendChartProps {
  data: GeointTrendData | null
  isLoading?: boolean
}

// Custom tooltip component for proper theming
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">{label}</p>
        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
          GEOINT Skoru: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export function GeointTrendChart({ data, isLoading }: GeointTrendChartProps) {
  const chartData = useMemo(() => {
    if (!data?.data?.length) return []

    return data.data.map((point) => ({
      date: new Date(point.date).toLocaleDateString('tr-TR', {
        month: 'short',
        day: 'numeric',
      }),
      value: point.value,
      fullDate: point.date,
    }))
  }, [data])

  const trendColor = useMemo(() => {
    if (!data) return '#6366f1'
    if (data.trend_direction === 'up') return '#10b981'
    if (data.trend_direction === 'down') return '#ef4444'
    return '#6366f1'
  }, [data])

  const trendIcon = useMemo(() => {
    if (!data) return null
    if (data.trend_direction === 'up') {
      return (
        <svg className="w-4 h-4 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
    if (data.trend_direction === 'down') {
      return (
        <svg className="w-4 h-4 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    }
    return (
      <svg className="w-4 h-4 text-surface-500 dark:text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    )
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
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Henuz veri bulunmuyor</p>
          <p className="text-xs text-surface-400 dark:text-surface-500">Anahtar kelime ekleyerek baslayin</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-surface-900 dark:text-surface-100">{data.average_score}</span>
          <span className="text-sm text-surface-500 dark:text-surface-400">Ortalama GEOINT Skoru</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          data.trend_direction === 'up' ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400' :
          data.trend_direction === 'down' ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400' :
          'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
        }`}>
          {trendIcon}
          <span>{data.change_percentage > 0 ? '+' : ''}{data.change_percentage}%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={trendColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-surface-200 dark:stroke-surface-700" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              className="text-surface-500 dark:text-surface-400 fill-surface-500 dark:fill-surface-400"
              axisLine={{ className: 'stroke-surface-200 dark:stroke-surface-700' }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              className="text-surface-500 dark:text-surface-400 fill-surface-500 dark:fill-surface-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={trendColor}
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
