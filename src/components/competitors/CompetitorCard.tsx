'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  TrashIcon,
  ChartBarIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import type { Competitor } from '@/types/competitor'

interface CompetitorCardProps {
  competitor: Competitor
  onView: (competitor: Competitor) => void
  onDelete: (competitor: Competitor) => void
  onCompare?: (competitor: Competitor) => void
  isSelected?: boolean
}

export function CompetitorCard({
  competitor,
  onView,
  onDelete,
  onCompare,
  isSelected = false
}: CompetitorCardProps) {
  const getDAColor = (da?: number) => {
    if (!da) return 'default'
    if (da >= 70) return 'success'
    if (da >= 40) return 'warning'
    return 'danger'
  }

  const formatNumber = (num?: number) => {
    if (!num) return '-'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const lastAnalyzed = competitor.last_analyzed_at
    ? new Date(competitor.last_analyzed_at).toLocaleDateString('tr-TR', {
        month: 'short',
        day: 'numeric',
      })
    : 'Hiç'

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800 rounded-xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border-primary-500 ring-2 ring-primary-500/20'
          : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50'
      }`}
    >
      {/* Gradient accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <GlobeAltIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[180px]">
                {competitor.name || competitor.domain}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {competitor.domain}
              </p>
            </div>
          </div>
          {competitor.category && (
            <Badge variant="info" size="sm">
              {competitor.category}
            </Badge>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <ChartBarIcon className="w-3.5 h-3.5" />
              Trafik
            </div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {formatNumber(competitor.organic_traffic)}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Kelimeler
            </div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {formatNumber(competitor.organic_keywords)}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              DA
            </div>
            <Badge variant={getDAColor(competitor.domain_authority) as any} size="sm">
              {competitor.domain_authority || '-'}
            </Badge>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <LinkIcon className="w-3.5 h-3.5" />
              Bağlantılar
            </div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {formatNumber(competitor.total_backlinks)}
            </div>
          </div>
        </div>

        {/* Last Analyzed */}
        <div className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          Son analiz: {lastAnalyzed}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<EyeIcon className="w-4 h-4" />}
            onClick={() => onView(competitor)}
            className="flex-1"
          >
            Detaylar
          </Button>
          {onCompare && (
            <Button
              variant={isSelected ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onCompare(competitor)}
              title={isSelected ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
            onClick={() => onDelete(competitor)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
