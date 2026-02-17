'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  value: number
}

interface MetricSparklineProps {
  data: number[]
  color?: string
  height?: number
  showTrend?: boolean
}

export function MetricSparkline({
  data,
  color = '#6366f1',
  height = 40,
  showTrend = true
}: MetricSparklineProps) {
  const chartData = useMemo(() => {
    return data.map(value => ({ value }))
  }, [data])

  const trend = useMemo(() => {
    if (data.length < 2) return 0
    const first = data[0]
    const last = data[data.length - 1]
    if (first === 0) return 0
    return ((last - first) / first) * 100
  }, [data])

  const trendColor = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#6b7280'

  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-slate-400 text-xs" style={{ height }}>
        Veri yok
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div style={{ width: 60, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#gradient-${color.replace('#', '')})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {showTrend && (
        <span className="text-xs font-medium" style={{ color: trendColor }}>
          {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
        </span>
      )}
    </div>
  )
}
