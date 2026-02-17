'use client'

import { useState, useRef, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Button, Badge, StatsCard } from '@/components/ui'
import { Toast } from 'primereact/toast'
import { competitorsAPI } from '@/services/api'
import {
  ComparisonRadar,
  CompetitorSelector,
} from '@/components/competitors'
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ScaleIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'

import type { Competitor, CompetitorComparison } from '@/types/competitor'

function CompetitorCompareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useRef<any>(null)

  // Get initial selection from URL
  const initialIds = searchParams.get('ids')?.split(',').filter(Boolean) || []
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds)

  // Fetch all competitors for selection
  const { data: competitors = [], isLoading: competitorsLoading } = useSWR<Competitor[]>(
    '/competitors',
    competitorsAPI.getAll,
    { revalidateOnFocus: false }
  )

  // Fetch comparison data when we have selections
  const { data: comparison, isLoading: comparisonLoading, error: comparisonError } = useSWR<CompetitorComparison>(
    selectedIds.length >= 2 ? `/competitors/compare?ids=${selectedIds.join(',')}` : null,
    () => competitorsAPI.compare(selectedIds),
    { revalidateOnFocus: false }
  )

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids)
    // Update URL
    if (ids.length > 0) {
      router.replace(`/competitors/compare?ids=${ids.join(',')}`, { scroll: false })
    } else {
      router.replace('/competitors/compare', { scroll: false })
    }
  }

  const formatNumber = (num?: number) => {
    if (!num) return '-'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const getDAColor = (da?: number) => {
    if (!da) return 'default'
    if (da >= 70) return 'success'
    if (da >= 40) return 'warning'
    return 'danger'
  }

  const metrics = [
    { key: 'domain_authority', label: 'Domain Otoritesi', format: (v: number) => v?.toString() || '-' },
    { key: 'organic_traffic', label: 'Organik Trafik', format: formatNumber },
    { key: 'organic_keywords', label: 'Anahtar Kelimeler', format: formatNumber },
    { key: 'total_backlinks', label: 'Geri Bağlantılar', format: formatNumber },
    { key: 'referring_domains', label: 'Ref. Domainler', format: formatNumber },
  ]

  // Get winner for each metric
  const getWinner = (metric: string) => {
    if (!comparison?.metrics_comparison[metric]) return null
    const values = comparison.metrics_comparison[metric]
    const entries = Object.entries(values)
    if (entries.length === 0) return null
    const [winner] = entries.sort((a, b) => (b[1] || 0) - (a[1] || 0))
    return winner[0]
  }

  return (
    <DashboardLayout>
      <Toast ref={toast} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/competitors">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Geri
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Rakipleri Karşılaştır
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Yan yana rekabet analizi
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
            disabled={!comparison}
          >
            Rapor İndir
          </Button>
        </div>

        {/* Competitor Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Karşılaştırılacak Rakipleri Seçin
          </h2>
          <CompetitorSelector
            competitors={competitors}
            selected={selectedIds}
            onSelectionChange={handleSelectionChange}
            maxSelections={4}
            isLoading={competitorsLoading}
          />
          {selectedIds.length < 2 && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Karşılaştırmak için en az 2 rakip seçin
            </p>
          )}
        </div>

        {/* Comparison Results */}
        {selectedIds.length >= 2 && (
          <>
            {comparisonLoading ? (
              <div className="space-y-6">
                <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              </div>
            ) : comparisonError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <p className="text-red-600 dark:text-red-400">Karşılaştırma verileri yüklenemedi</p>
              </div>
            ) : comparison ? (
              <>
                {/* Radar Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Rekabet Ortamı
                  </h2>
                  <ComparisonRadar
                    data={comparison.radar_data as any}
                    height={400}
                  />
                </div>

                {/* Metrics Comparison Table */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                      Metrik Karşılaştırması
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Metrik
                          </th>
                          {comparison.competitors.map(c => (
                            <th
                              key={c.id}
                              className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"
                            >
                              {c.domain}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {metrics.map(metric => {
                          const winner = getWinner(metric.key)
                          return (
                            <tr key={metric.key} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                              <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                                {metric.label}
                              </td>
                              {comparison.competitors.map(c => {
                                const value = comparison.metrics_comparison[metric.key]?.[c.domain]
                                const isWinner = c.domain === winner
                                return (
                                  <td
                                    key={c.id}
                                    className={`px-6 py-4 text-center ${
                                      isWinner ? 'bg-green-50 dark:bg-green-900/20' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-center gap-2">
                                      <span className={`text-sm font-medium ${
                                        isWinner
                                          ? 'text-green-600 dark:text-green-400'
                                          : 'text-slate-900 dark:text-slate-100'
                                      }`}>
                                        {metric.format(value)}
                                      </span>
                                      {isWinner && (
                                        <TrophyIcon className="w-4 h-4 text-green-500" />
                                      )}
                                    </div>
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Rankings Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {comparison.competitors.slice(0, 3).map((c, index) => {
                    const winsCount = metrics.filter(m => getWinner(m.key) === c.domain).length
                    return (
                      <div
                        key={c.id}
                        className={`p-6 rounded-xl border ${
                          index === 0
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {index === 0 && (
                            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                              <TrophyIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                              {c.domain}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {winsCount} metrikte lider
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">DA</span>
                            <Badge variant={getDAColor(c.domain_authority) as any} size="sm">
                              {c.domain_authority || '-'}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Trafik</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {formatNumber(c.organic_traffic)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Kelimeler</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {formatNumber(c.organic_keywords)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : null}
          </>
        )}

        {/* Empty State */}
        {selectedIds.length < 2 && !competitorsLoading && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ScaleIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Rakip Seçin
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Radar grafikleri ve metrik analizleriyle detaylı yan yana karşılaştırma görmek için
              yukarıdaki açılır menüden 2-4 rakip seçin.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function CompetitorComparePage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-slate-500">Yükleniyor...</div>
        </div>
      </DashboardLayout>
    }>
      <CompetitorCompareContent />
    </Suspense>
  )
}
