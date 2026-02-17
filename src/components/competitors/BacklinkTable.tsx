'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

interface Backlink {
  id: string
  source_url: string
  source_domain: string
  target_url?: string
  anchor_text?: string
  domain_authority?: number
  page_authority?: number
  link_type: string
  first_seen: string
  last_seen: string
}

interface BacklinkTableProps {
  data: Backlink[]
  isLoading?: boolean
  maxRows?: number
}

export function BacklinkTable({ data, isLoading, maxRows = 20 }: BacklinkTableProps) {
  const [search, setSearch] = useState('')
  const [linkTypeFilter, setLinkTypeFilter] = useState<'all' | 'dofollow' | 'nofollow'>('all')

  const filteredData = useMemo(() => {
    let result = [...data]

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(item =>
        item.source_domain.toLowerCase().includes(searchLower) ||
        item.anchor_text?.toLowerCase().includes(searchLower)
      )
    }

    if (linkTypeFilter !== 'all') {
      result = result.filter(item => item.link_type === linkTypeFilter)
    }

    return result.slice(0, maxRows)
  }, [data, search, linkTypeFilter, maxRows])

  const getDAColor = (da?: number) => {
    if (!da) return 'default'
    if (da >= 70) return 'success'
    if (da >= 40) return 'warning'
    return 'danger'
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="h-6 w-40 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
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
            Geri Bağlantı Profili
          </h3>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Domain ara..."
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48"
              />
            </div>
            {/* Filter */}
            <select
              value={linkTypeFilter}
              onChange={(e) => setLinkTypeFilter(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
            >
              <option value="all">Tüm Bağlantılar</option>
              <option value="dofollow">Dofollow</option>
              <option value="nofollow">Nofollow</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Kaynak Domain
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Çapa Metni
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                DA
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tür
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                İlk Görülme
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Geri bağlantı bulunamadı
                </td>
              </tr>
            ) : (
              filteredData.map((backlink) => (
                <tr
                  key={backlink.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {backlink.source_domain}
                      </span>
                      <p className="text-xs text-slate-500 truncate max-w-xs" title={backlink.source_url}>
                        {backlink.source_url}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs block" title={backlink.anchor_text}>
                      {backlink.anchor_text || '(çapa metni yok)'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={getDAColor(backlink.domain_authority) as any} size="sm">
                      {backlink.domain_authority || '-'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant={backlink.link_type === 'dofollow' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {backlink.link_type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-slate-500">
                    {new Date(backlink.first_seen).toLocaleDateString('tr-TR', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a
                      href={backlink.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                      title="Bağlantıyı aç"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Footer */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-4 text-sm text-slate-500">
        <span>Toplam: {data.length}</span>
        <span>Dofollow: {data.filter(b => b.link_type === 'dofollow').length}</span>
        <span>Nofollow: {data.filter(b => b.link_type !== 'dofollow').length}</span>
      </div>
    </div>
  )
}
