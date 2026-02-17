'use client'

import { useMemo, useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface RegionDistributionItem {
  region_id: string
  region_name: string
  region_type: string
  avg_score: number
  keywords_count: number
  percentage: number
}

interface RegionalDistributionData {
  regions: RegionDistributionItem[]
  total_regions: number
  region_type: string
}

interface RegionalDistributionChartProps {
  data: RegionalDistributionData | null
  isLoading?: boolean
}

const COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f97316', // orange
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
]

// Custom tooltip component for proper theming
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{data.name}</p>
        <p className="text-xs text-surface-600 dark:text-surface-400">
          GEOINT: {data.value} ({data.percentage}%)
        </p>
      </div>
    )
  }
  return null
}

export function RegionalDistributionChart({ data, isLoading }: RegionalDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!data?.regions?.length) return []

    return data.regions.map((region) => ({
      name: region.region_name,
      value: region.avg_score,
      percentage: region.percentage,
      keywords: region.keywords_count,
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
          <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Bolge verisi bulunmuyor</p>
          <p className="text-xs text-surface-400 dark:text-surface-500">GEOINT analizi yapildiginda gosterilecek</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-surface-900 dark:text-surface-100">{data.total_regions}</span>
          <span className="text-sm text-surface-500 dark:text-surface-400">Aktif Bolge</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 flex">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-1/2 flex flex-col justify-center pl-4 space-y-2 overflow-y-auto max-h-56">
          {chartData.slice(0, 6).map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-surface-900 dark:text-surface-100 truncate">{item.name}</div>
                <div className="text-2xs text-surface-500 dark:text-surface-400">{item.value} puan</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
