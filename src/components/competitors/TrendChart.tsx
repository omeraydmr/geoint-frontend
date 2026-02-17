'use client'

import { useMemo } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts'

interface TrendPoint {
  date: string
  domain_authority?: number
  organic_traffic?: number
  organic_keywords?: number
  total_backlinks?: number
  referring_domains?: number
}

interface TrendData {
  competitor_id: string
  domain: string
  time_range: string
  data_points: TrendPoint[]
  growth_rates: Record<string, number>
}

interface TrendChartProps {
  data: TrendData | null
  metrics?: string[]
  isLoading?: boolean
  height?: number
}

const METRIC_COLORS: Record<string, string> = {
  domain_authority: '#6366f1',
  organic_traffic: '#10b981',
  organic_keywords: '#f59e0b',
  total_backlinks: '#ec4899',
  referring_domains: '#8b5cf6',
}

const METRIC_LABELS: Record<string, string> = {
  domain_authority: 'Domain Otoritesi',
  organic_traffic: 'Organik Trafik',
  organic_keywords: 'Anahtar Kelimeler',
  total_backlinks: 'Geri Bağlantılar',
  referring_domains: 'Ref. Domainler',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {METRIC_LABELS[entry.dataKey] || entry.dataKey}: {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function TrendChart({
  data,
  metrics = ['domain_authority', 'organic_traffic'],
  isLoading,
  height = 300
}: TrendChartProps) {
  const chartData = useMemo(() => {
    if (!data?.data_points?.length) return []

    return data.data_points.map((point) => ({
      ...point,
      date: new Date(point.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }))
  }, [data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" style={{ height }}>
        <div className="text-slate-400 dark:text-slate-500">Yükleniyor...</div>
      </div>
    )
  }

  if (!data || !chartData.length) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50" style={{ height }}>
        <div className="text-center">
          <div className="w-14 h-14 bg-white dark:bg-slate-800 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-200 dark:border-slate-700">
            <svg className="w-7 h-7 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Trend verisi bulunamadı</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Zaman içindeki performansı görmek için anlık görüntü ekleyin</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Growth Rates */}
      {data.growth_rates && Object.keys(data.growth_rates).length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {metrics.map(metric => {
            const rate = data.growth_rates[metric]
            if (rate === undefined) return null
            const isPositive = rate > 0
            return (
              <div key={metric} className="flex items-center gap-1.5 text-sm">
                <span className="text-slate-600 dark:text-slate-400">{METRIC_LABELS[metric]}:</span>
                <span className={`font-medium ${isPositive ? 'text-green-600' : rate < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                  {isPositive ? '+' : ''}{rate.toFixed(1)}%
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Chart */}
      <div style={{ height: height - 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              className="text-slate-500 fill-slate-500"
              axisLine={{ className: 'stroke-slate-200 dark:stroke-slate-700' }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="text-slate-500 fill-slate-500"
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => METRIC_LABELS[value] || value}
            />
            {metrics.map(metric => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={METRIC_COLORS[metric] || '#6366f1'}
                strokeWidth={2}
                dot={chartData.length <= 3 ? { r: 4, strokeWidth: 2, fill: '#fff' } : false}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
