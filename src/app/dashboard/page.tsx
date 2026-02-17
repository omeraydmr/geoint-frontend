'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/common/DashboardLayout'
import { useDashboard } from '@/hooks/useDashboard'
import { GeointTrendChart, KeywordPerformanceChart, RegionalDistributionChart } from '@/components/charts'
import { Toast } from 'primereact/toast'

export default function DashboardPage() {
  const router = useRouter()
  const toast = useRef<any>(null)
  const [downloadingReport, setDownloadingReport] = useState(false)

  // Use the dashboard hook to fetch all data
  const {
    stats,
    geointTrend,
    keywordPerformance,
    regionalDistribution,
    activities,
    isLoading,
  } = useDashboard()

  const handleDownloadReport = async () => {
    setDownloadingReport(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const reportData = {
        generated: new Date().toISOString(),
        summary: {
          totalKeywords: stats?.total_keywords || 0,
          activeStrategies: stats?.active_strategies || 0,
          competitors: stats?.total_competitors || 0,
          avgGeointScore: stats?.avg_geoint_score || 0,
        }
      }

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `stratyon-report-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.current?.show({
        severity: 'success',
        summary: 'Basarili',
        detail: 'Rapor indirildi',
        life: 3000
      })
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: 'Rapor indirilemedi',
        life: 3000
      })
    } finally {
      setDownloadingReport(false)
    }
  }

  const statCards = [
    {
      title: 'Anahtar Kelimeler',
      value: stats?.total_keywords || 0,
      icon: (
        <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      bgColor: 'bg-brand-100 dark:bg-brand-900/30',
      change: stats?.keywords_change || 0,
    },
    {
      title: 'Aktif Strateji',
      value: stats?.active_strategies || 0,
      icon: (
        <svg className="w-5 h-5 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgColor: 'bg-success-100 dark:bg-success-900/30',
      change: stats?.strategies_change || 0,
    },
    {
      title: 'Takip Edilen Rakip',
      value: stats?.total_competitors || 0,
      icon: (
        <svg className="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'bg-accent-100 dark:bg-accent-900/30',
      change: stats?.competitors_change || 0,
    },
    {
      title: 'GEOINT Skoru',
      value: stats?.avg_geoint_score || 0,
      icon: (
        <svg className="w-5 h-5 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      bgColor: 'bg-warning-100 dark:bg-warning-900/30',
      subtitle: `${stats?.total_regions_analyzed || 0} Bolge`,
      change: stats?.geoint_score_change || 0,
    },
  ]

  // Activity icons based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'keyword_added':
      case 'keyword_deleted':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        )
      case 'strategy_created':
      case 'strategy_updated':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        )
      case 'competitor_added':
      case 'competitor_analyzed':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" />
          </svg>
        )
    }
  }

  const getActivityColor = (type: string) => {
    if (type.includes('keyword')) return 'brand'
    if (type.includes('strategy')) return 'success'
    if (type.includes('competitor')) return 'accent'
    return 'surface'
  }

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Az once'
    if (hours < 24) return `${hours} saat once`
    if (days < 7) return `${days} gun once`
    return date.toLocaleDateString('tr-TR')
  }

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <div className="space-y-6 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 font-display tracking-tight">Dashboard</h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm">STRATYON Strategic Intelligence Platform</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadReport}
              disabled={downloadingReport}
              className="btn-premium btn-ghost"
            >
              {downloadingReport ? (
                <div className="w-4 h-4 border-2 border-surface-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              Rapor Indir
            </button>
            <button
              onClick={() => router.push('/keywords')}
              className="btn-premium btn-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Yeni Analiz
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">{stat.title}</span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {isLoading ? '...' : stat.value}
                </p>
                {stat.change !== 0 && (
                  <span className={`text-xs font-medium ${stat.change > 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </span>
                )}
              </div>
              {stat.subtitle && (
                <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GEOINT Trend Chart */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4">GEOINT Skoru Trendi</h2>
            <GeointTrendChart data={geointTrend} isLoading={isLoading} />
          </div>

          {/* Keyword Performance Chart */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4">Anahtar Kelime Performansi</h2>
            <KeywordPerformanceChart data={keywordPerformance} isLoading={isLoading} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed - Spans 2 columns */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Son Aktiviteler</h2>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Platformdaki son islemler</p>
              </div>
              <button className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
                Tumunu Gor
              </button>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800 animate-pulse">
                      <div className="w-10 h-10 rounded-xl bg-surface-200 dark:bg-surface-700" />
                      <div className="flex-1">
                        <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/3 mb-2" />
                        <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities?.activities?.length ? (
                activities.activities.map((activity: any) => {
                  const color = getActivityColor(activity.activity_type)
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          color === 'brand'
                            ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                            : color === 'success'
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'
                            : color === 'accent'
                            ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                        }`}
                      >
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-surface-900 dark:text-surface-100">{activity.title}</h4>
                        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{activity.description}</p>
                        <span className="text-2xs text-surface-400 dark:text-surface-500 mt-1 inline-block">
                          {formatActivityTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-surface-500 dark:text-surface-400 text-sm">
                  Henuz aktivite bulunmuyor
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 bg-white dark:bg-gradient-to-br dark:from-brand-600 dark:to-brand-700">
            <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Hizli Islemler</h2>
            <p className="text-surface-500 dark:text-white/70 text-xs mb-6">Sik kullanilan ozellikler</p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/keywords')}
                className="w-full p-4 bg-surface-50 hover:bg-surface-100 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-left transition-all border border-surface-200 dark:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 dark:bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-surface-900 dark:text-white font-medium text-sm">Anahtar Kelime Ekle</div>
                    <div className="text-surface-500 dark:text-white/60 text-2xs">Yeni GEOINT analizi baslat</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/strategies')}
                className="w-full p-4 bg-surface-50 hover:bg-surface-100 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-left transition-all border border-surface-200 dark:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-100 dark:bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-success-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-surface-900 dark:text-white font-medium text-sm">Strateji Olustur</div>
                    <div className="text-surface-500 dark:text-white/60 text-2xs">AI destekli plan hazirla</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/geoint')}
                className="w-full p-4 bg-surface-50 hover:bg-surface-100 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-left transition-all border border-surface-200 dark:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-100 dark:bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-surface-900 dark:text-white font-medium text-sm">GEOINT Haritasi</div>
                    <div className="text-surface-500 dark:text-white/60 text-2xs">Bolgesel analizi incele</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Insights & Regional Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insights */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Oneriler ve Icgoruler</h2>

            <div className="card p-5 border-l-4 border-l-success-500">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success-100 dark:bg-success-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Yuksek Potansiyel Tespit Edildi</h4>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Ankara'da 'dijital pazarlama' aramalari %45 artti. Bu bolgeye odaklanmayi dusunun.</p>
                  <button onClick={() => router.push('/geoint')} className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium mt-2">
                    GEOINT'e Git
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-5 border-l-4 border-l-brand-500">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Bolge Analizi</h4>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">En yuksek potansiyelli 5 bolge belirlendi. Butce dagitimi onerilerini inceleyin.</p>
                  <button onClick={() => router.push('/geoint/budget')} className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium mt-2">
                    Butce Onerileri
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-5 border-l-4 border-l-warning-500">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Rakip Aktivitesi</h4>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Rakibiniz yeni bir icerik stratejisi baslatti. Detaylari inceleyin.</p>
                  <button onClick={() => router.push('/competitors')} className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium mt-2">
                    Detaylari Gor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Distribution Chart */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4">Bolgesel Dagilim</h2>
            <RegionalDistributionChart data={regionalDistribution} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
