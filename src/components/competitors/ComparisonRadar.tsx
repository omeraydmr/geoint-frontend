'use client'

import { useMemo } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

interface RadarDataPoint {
  domain: string
  domain_authority: number
  organic_traffic: number
  organic_keywords: number
  total_backlinks: number
  referring_domains: number
}

interface ComparisonRadarProps {
  data: RadarDataPoint[]
  isLoading?: boolean
  height?: number
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899']

const METRIC_LABELS: Record<string, string> = {
  domain_authority: 'Domain Otoritesi',
  organic_traffic: 'Trafik',
  organic_keywords: 'Kelimeler',
  total_backlinks: 'Bağlantılar',
  referring_domains: 'Ref. Domainler',
}

export function ComparisonRadar({ data, isLoading, height = 400 }: ComparisonRadarProps) {
  const chartData = useMemo(() => {
    if (!data?.length) return []

    const metrics = ['domain_authority', 'organic_traffic', 'organic_keywords', 'total_backlinks', 'referring_domains']

    return metrics.map(metric => {
      const point: Record<string, any> = {
        metric: METRIC_LABELS[metric] || metric,
      }
      data.forEach((competitor, index) => {
        point[competitor.domain] = competitor[metric as keyof RadarDataPoint] || 0
      })
      return point
    })
  }, [data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" style={{ height }}>
        <div className="text-slate-400">Yükleniyor...</div>
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl" style={{ height }}>
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">Karşılaştırılacak rakipleri seçin</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid className="stroke-slate-200 dark:stroke-slate-700" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          {data.map((competitor, index) => (
            <Radar
              key={competitor.domain}
              name={competitor.domain}
              dataKey={competitor.domain}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
