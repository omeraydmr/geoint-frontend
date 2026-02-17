'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

interface KeywordGap {
  keyword: string
  search_volume: number
  difficulty?: number
  your_position?: number
  competitor_position?: number
  estimated_traffic?: number
  opportunity?: 'high' | 'medium' | 'low'
}

interface KeywordGapTableProps {
  data: KeywordGap[]
  isLoading?: boolean
  maxRows?: number
  onViewAll?: () => void
}

type SortField = 'keyword' | 'search_volume' | 'difficulty' | 'your_position' | 'competitor_position'
type SortDirection = 'asc' | 'desc'

export function KeywordGapTable({
  data,
  isLoading,
  maxRows = 10,
  onViewAll
}: KeywordGapTableProps) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('search_volume')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const filteredData = useMemo(() => {
    let result = [...data]

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(item => item.keyword.toLowerCase().includes(searchLower))
    }

    // Filter by opportunity
    if (filter !== 'all') {
      result = result.filter(item => item.opportunity === filter)
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField] ?? 0
      const bVal = b[sortField] ?? 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })

    return result.slice(0, maxRows)
  }, [data, search, filter, sortField, sortDirection, maxRows])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc'
      ? <ArrowUpIcon className="w-3 h-3 ml-1" />
      : <ArrowDownIcon className="w-3 h-3 ml-1" />
  }

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'default'
    if (difficulty < 30) return 'success'
    if (difficulty < 60) return 'warning'
    return 'danger'
  }

  const getOpportunityColor = (opportunity?: string) => {
    if (opportunity === 'high') return 'success'
    if (opportunity === 'medium') return 'warning'
    return 'default'
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="h-6 w-40 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Anahtar Kelime Boşluk Analizi
          </h3>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kelime ara..."
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48"
              />
            </div>
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tüm Fırsatlar</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => handleSort('keyword')}
              >
                <span className="flex items-center">Kelime <SortIcon field="keyword" /></span>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => handleSort('search_volume')}
              >
                <span className="flex items-center justify-end">Hacim <SortIcon field="search_volume" /></span>
              </th>
              <th
                className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => handleSort('your_position')}
              >
                <span className="flex items-center justify-center">Sizin Sıra <SortIcon field="your_position" /></span>
              </th>
              <th
                className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => handleSort('competitor_position')}
              >
                <span className="flex items-center justify-center">Rakip Sıra <SortIcon field="competitor_position" /></span>
              </th>
              <th
                className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => handleSort('difficulty')}
              >
                <span className="flex items-center justify-center">Zorluk <SortIcon field="difficulty" /></span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Fırsat
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Kelime boşluğu bulunamadı
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {item.keyword}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                    {item.search_volume?.toLocaleString() || '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.your_position ? (
                      <Badge variant="info" size="sm">#{item.your_position}</Badge>
                    ) : (
                      <span className="text-xs text-slate-400">Sıralamada değil</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.competitor_position ? (
                      <Badge variant="primary" size="sm">#{item.competitor_position}</Badge>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.difficulty !== undefined ? (
                      <Badge variant={getDifficultyColor(item.difficulty) as any} size="sm">
                        {item.difficulty}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.opportunity ? (
                      <Badge variant={getOpportunityColor(item.opportunity) as any} size="sm">
                        {item.opportunity.charAt(0).toUpperCase() + item.opportunity.slice(1)}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {data.length > maxRows && onViewAll && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={onViewAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Tüm {data.length} kelimeyi görüntüle &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
