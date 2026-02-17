'use client'

import { useState, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Button, Badge, StatsCard } from '@/components/ui'
import { Toast } from 'primereact/toast'
import { competitorsAPI } from '@/services/api'
import {
  TrendChart,
  SWOTCard,
  KeywordGapTable,
  BacklinkTable,
} from '@/components/competitors'
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  GlobeAltIcon,
  ChartBarIcon,
  LinkIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

import type {
  CompetitorWithSnapshots,
  TrendData,
  BacklinkProfile,
  ContentGapResponse,
  SWOTAnalysis,
  KeywordGap,
} from '@/types/competitor'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CompetitorDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const toast = useRef<any>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)

  // Fetch competitor data
  const { data: competitor, error, isLoading, mutate } = useSWR<CompetitorWithSnapshots>(
    `/competitors/${id}`,
    () => competitorsAPI.getById(id),
    { revalidateOnFocus: false }
  )

  // Fetch trends
  const { data: trends, isLoading: trendsLoading } = useSWR<TrendData>(
    competitor ? `/competitors/${id}/trends/${timeRange}` : null,
    () => competitorsAPI.getTrends(id, timeRange),
    { revalidateOnFocus: false }
  )

  // Fetch backlinks
  const { data: backlinks, isLoading: backlinksLoading } = useSWR<BacklinkProfile>(
    activeTab === 2 ? `/competitors/${id}/backlinks` : null,
    () => competitorsAPI.getBacklinks(id),
    { revalidateOnFocus: false }
  )

  // Fetch content gaps
  const { data: contentGaps, isLoading: contentLoading } = useSWR<ContentGapResponse>(
    activeTab === 3 ? `/competitors/${id}/content-gap` : null,
    () => competitorsAPI.getContentGaps(id),
    { revalidateOnFocus: false }
  )

  // Fetch AI insights
  const { data: insights, isLoading: insightsLoading, mutate: mutateInsights } = useSWR<SWOTAnalysis>(
    activeTab === 4 ? `/competitors/${id}/ai-insights` : null,
    () => competitorsAPI.getAIInsights(id, false),
    { revalidateOnFocus: false }
  )

  // Fetch keywords for gap analysis
  const { data: keywords, isLoading: keywordsLoading } = useSWR(
    activeTab === 1 ? `/competitors/${id}/keywords` : null,
    () => competitorsAPI.getKeywords(id),
    { revalidateOnFocus: false }
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await competitorsAPI.analyze(id)
      await mutate()
      toast.current?.show({
        severity: 'success',
        summary: 'Analiz Başlatıldı',
        detail: 'Rakip verileri yenileniyor',
        life: 3000
      })
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: 'Rakip verileri yenilenemedi',
        life: 3000
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRegenerateInsights = async () => {
    setIsGeneratingInsights(true)
    try {
      const newInsights = await competitorsAPI.getAIInsights(id, true)
      mutateInsights(newInsights)
      toast.current?.show({
        severity: 'success',
        summary: 'Analizler Oluşturuldu',
        detail: 'AI analizi güncellendi',
        life: 3000
      })
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: 'Analizler oluşturulamadı',
        life: 3000
      })
    } finally {
      setIsGeneratingInsights(false)
    }
  }

  const formatNumber = (num?: number) => {
    if (!num) return '-'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const getDAVariant = (da?: number) => {
    if (!da) return 'primary'
    if (da >= 70) return 'success'
    if (da >= 40) return 'warning'
    return 'danger'
  }

  // Convert keywords to gap format for table
  const keywordGaps: KeywordGap[] = (keywords || []).map((k: any) => ({
    keyword: k.keyword,
    search_volume: k.search_volume || 0,
    difficulty: k.keyword_difficulty,
    competitor_position: k.position,
    opportunity: k.position <= 10 ? 'high' : k.position <= 30 ? 'medium' : 'low'
  }))

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-red-500 mb-4">Rakip yüklenemedi</div>
          <Button variant="secondary" onClick={() => router.push('/competitors')}>
            Rakiplere Dön
          </Button>
        </div>
      </DashboardLayout>
    )
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
            {isLoading ? (
              <div className="h-8 w-48 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                  <GlobeAltIcon className="w-7 h-7 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {competitor?.name || competitor?.domain}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400">{competitor?.domain}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={handleRefresh}
              loading={isRefreshing}
            >
              Yenile
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
            >
              Dışa Aktar
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatsCard
            title="Domain Otoritesi"
            value={competitor?.domain_authority?.toString() || '-'}
            variant={getDAVariant(competitor?.domain_authority) as any}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            }
            subtitle="100 üzerinden"
          />
          <StatsCard
            title="Organik Trafik"
            value={formatNumber(competitor?.organic_traffic)}
            variant="success"
            icon={<ChartBarIcon className="w-5 h-5" />}
            subtitle="Aylık ziyaret"
          />
          <StatsCard
            title="Anahtar Kelimeler"
            value={formatNumber(competitor?.organic_keywords)}
            variant="accent"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
              </svg>
            }
            subtitle="Sıralanan kelimeler"
          />
          <StatsCard
            title="Geri Bağlantılar"
            value={formatNumber(competitor?.total_backlinks)}
            variant="primary"
            icon={<LinkIcon className="w-5 h-5" />}
            subtitle="Toplam bağlantı"
          />
          <StatsCard
            title="Ref. Domainler"
            value={formatNumber(competitor?.referring_domains)}
            variant="info"
            icon={<GlobeAltIcon className="w-5 h-5" />}
            subtitle="Benzersiz domainler"
          />
        </div>

        {/* Last Analyzed */}
        {competitor?.last_analyzed_at && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <ClockIcon className="w-4 h-4" />
            Son analiz: {new Date(competitor.last_analyzed_at).toLocaleDateString('tr-TR', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}

        {/* Custom Tabs Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            {[
              { label: 'Genel Bakış', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              )},
              { label: 'Anahtar Kelimeler', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                </svg>
              )},
              { label: 'Geri Bağlantılar', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              )},
              { label: 'İçerik', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              )},
              { label: 'AI Analizleri', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              )},
            ].map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                  activeTab === index
                    ? 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 bg-white dark:bg-slate-800'
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={activeTab === 0 ? 'block' : 'hidden'}>
              <div className="p-6 space-y-6">
                {/* Time Range Selector */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Performans Trendleri
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          timeRange === range
                            ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trend Chart */}
                <TrendChart
                  data={trends || null}
                  metrics={['organic_traffic', 'organic_keywords', 'domain_authority']}
                  isLoading={trendsLoading}
                  height={350}
                />

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="p-4 bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-900/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">Ücretli Kelimeler</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {formatNumber(competitor?.paid_keywords) || '0'}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Güven Akışı</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {competitor?.trust_flow || '-'}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Alıntı Akışı</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {competitor?.citation_flow || '-'}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-950/30 dark:to-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-900/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-sky-600 dark:text-sky-400 uppercase tracking-wider">İçerik Puanı</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {competitor?.content_score || '-'}
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* Keywords Tab */}
          <div className={activeTab === 1 ? 'block' : 'hidden'}>
            <div className="p-6">
              <KeywordGapTable
                data={keywordGaps}
                isLoading={keywordsLoading}
                maxRows={50}
              />
            </div>
          </div>

          {/* Backlinks Tab */}
          <div className={activeTab === 2 ? 'block' : 'hidden'}>
            <div className="p-6 space-y-6">
              {/* Backlink Stats */}
              {backlinks && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Toplam</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {formatNumber(backlinks.total_backlinks)}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <GlobeAltIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Domainler</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {formatNumber(backlinks.referring_domains)}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Dofollow</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatNumber(backlinks.dofollow_count)}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Nofollow</span>
                    </div>
                    <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {formatNumber(backlinks.nofollow_count)}
                    </div>
                  </div>
                </div>
              )}

              {/* Backlink Table */}
              <BacklinkTable
                data={backlinks?.backlinks || []}
                isLoading={backlinksLoading}
                maxRows={50}
              />
            </div>
          </div>

          {/* Content Tab */}
          <div className={activeTab === 3 ? 'block' : 'hidden'}>
            <div className="p-6 space-y-6">
              {contentLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : contentGaps ? (
                <>
                  {/* Top Performing Pages */}
                  {contentGaps.top_performing_pages?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        En İyi Performans Gösteren Sayfalar
                      </h3>
                      <div className="space-y-3">
                        {contentGaps.top_performing_pages.map((page, index) => (
                          <div
                            key={index}
                            className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <a
                                href={page.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 truncate block"
                              >
                                {page.url}
                              </a>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-slate-500 dark:text-slate-400">
                                Trafik: <span className="font-medium text-slate-900 dark:text-slate-100">{formatNumber(page.traffic)}</span>
                              </span>
                              <span className="text-slate-500 dark:text-slate-400">
                                Kelimeler: <span className="font-medium text-slate-900 dark:text-slate-100">{page.keywords}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Gaps */}
                  {contentGaps.content_gaps?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        İçerik Fırsatları ({contentGaps.total_gaps})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {contentGaps.content_gaps.map((gap, index) => (
                          <div
                            key={index}
                            className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {gap.topic}
                              </span>
                              <Badge
                                variant={gap.opportunity_score >= 0.7 ? 'success' : gap.opportunity_score >= 0.4 ? 'warning' : 'neutral'}
                                size="sm"
                              >
                                {gap.content_type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                              <span>Hacim: {formatNumber(gap.search_volume)}</span>
                              {gap.difficulty && <span>Zorluk: {gap.difficulty}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <DocumentTextIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  İçerik verisi bulunamadı
                </div>
              )}
            </div>
          </div>

          {/* AI Insights Tab */}
          <div className={activeTab === 4 ? 'block' : 'hidden'}>
            <div className="p-6">
              <SWOTCard
                data={insights || null}
                isLoading={insightsLoading || isGeneratingInsights}
                onRegenerate={handleRegenerateInsights}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
