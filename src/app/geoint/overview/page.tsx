'use client'

import { useRouter } from 'next/navigation'
import { useGEOINT } from '@/contexts/GEOINTContext'
import { BentoGrid, BentoCard } from '@/components/ui/bento-card'
import { StatsCard } from '@/components/ui/stats-card'
import { InsightCard } from '@/components/ui/insight-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const getTrendIcon = (direction: string) => {
  if (direction === 'up')
    return (
      <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
          clipRule="evenodd"
        />
      </svg>
    )
  if (direction === 'down')
    return (
      <svg className="w-4 h-4 text-error-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
          clipRule="evenodd"
        />
      </svg>
    )
  return (
    <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  )
}

const getMarkerColor = (score: number) => {
  if (score >= 70) return '#10b981'
  if (score >= 40) return '#f59e0b'
  return '#f43f5e'
}

export default function GEOINTOverviewPage() {
  const router = useRouter()
  const {
    keywords,
    selectedKeyword,
    overview,
    stats,
    loadingStats,
    topRegions,
    loadingRegions,
    calculateGEOINT
  } = useGEOINT()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">Toplam Bolge</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{overview?.total_provinces || 81}</p>
          <p className="text-xs text-surface-400 mt-1">Tum iller</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">Yuksek Potansiyel</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{loadingStats ? '...' : stats?.high_potential_count || 0}</p>
          <p className="text-xs text-surface-400 mt-1">GEOINT 70+</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">Ortalama Skor</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{loadingStats ? '...' : stats?.avg_score?.toFixed(1) || '0.0'}</p>
          <p className="text-xs text-surface-400 mt-1">Genel performans</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">Anahtar Kelimeler</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{keywords.length}</p>
          <p className="text-xs text-surface-400 mt-1">Analiz edilen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Regions */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-surface-900 mb-4">En Iyi 5 Bolge</h2>
          {loadingRegions ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={60} />
              ))}
            </div>
          ) : topRegions.length === 0 ? (
            <div className="text-center py-12 text-surface-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-sm font-medium mb-2">Henuz veri bulunmuyor</p>
              <p className="text-xs text-surface-400 mb-4">GEOINT skorlarini hesaplamak icin butona tiklayin</p>
              <button className="btn-premium btn-primary text-sm" onClick={calculateGEOINT} disabled={!selectedKeyword}>
                GEOINT Hesapla
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {topRegions.slice(0, 5).map((region, index) => (
                <div
                  key={region.region_id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 hover:bg-surface-100 transition-all cursor-pointer"
                  onClick={() => router.push('/geoint/map')}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ backgroundColor: getMarkerColor(region.geoint_score) }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-surface-900 text-sm">{region.region_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-surface-500">Skor: {region.geoint_score.toFixed(1)}</span>
                      <span className="text-surface-300">•</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(region.trend_direction || 'stable')}
                        <span className="text-2xs text-surface-400">
                          {region.trend_direction === 'up'
                            ? 'Yukseliyor'
                            : region.trend_direction === 'down'
                            ? 'Dusuyor'
                            : 'Stabil'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`score ${region.geoint_score >= 70 ? 'score-high' : region.geoint_score >= 40 ? 'score-mid' : 'score-low'}`}>
                    {region.geoint_score.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Insights */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-surface-900">Oneriler</h2>
          <div className="card p-5 border-l-4 border-l-success-500">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-surface-900">Yuksek Firsat</h4>
                <p className="text-xs text-surface-500 mt-1">{topRegions[0]?.region_name || 'Ilk bolge'} yuksek potansiyele sahip. Bu bolgeye odaklanin.</p>
                <button onClick={() => router.push('/geoint/map')} className="text-xs text-brand-600 hover:text-brand-700 font-medium mt-2">
                  Haritada Gor →
                </button>
              </div>
            </div>
          </div>

          <div className="card p-5 border-l-4 border-l-brand-500">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-surface-900">Trend Analizi</h4>
                <p className="text-xs text-surface-500 mt-1">3 bolgede yukselis trendi tespit edildi. Hemen harekete gecin.</p>
                <button onClick={() => router.push('/geoint/regions')} className="text-xs text-brand-600 hover:text-brand-700 font-medium mt-2">
                  Detaylari Gor →
                </button>
              </div>
            </div>
          </div>

          <div className="card p-5 border-l-4 border-l-warning-500">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-surface-900">Butce Optimizasyonu</h4>
                <p className="text-xs text-surface-500 mt-1">Butcenizi en verimli bolgelere dagitin. Onerilerimizi inceleyin.</p>
                <button onClick={() => router.push('/geoint/budget')} className="text-xs text-brand-600 hover:text-brand-700 font-medium mt-2">
                  Butce Onerileri →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
