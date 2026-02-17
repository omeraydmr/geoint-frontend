'use client'

import { Suspense } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/common/DashboardLayout'
import { GEOINTProvider, useGEOINT } from '@/contexts/GEOINTContext'
import { BentoCard } from '@/components/ui/bento-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ChatbotGEOINTConnector from '@/components/chatbot/ChatbotGEOINTConnector'

const tabs = [
  { id: 'overview', label: 'Genel Bakis', path: '/geoint/overview' },
  { id: 'map', label: 'Isi Haritasi', path: '/geoint/map' },
  { id: 'regions', label: 'Tum Bolgeler', path: '/geoint/regions' },
  { id: 'budget', label: 'Butce Onerileri', path: '/geoint/budget' },
  { id: 'competitors', label: 'Rakip Karsilastirma', path: '/geoint/competitors' },
]

function GEOINTHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    keywords,
    selectedKeyword,
    setSelectedKeyword,
    loadingKeywords,
    recentKeywords,
    loadingStats,
    calculateGEOINT,
    refreshData
  } = useGEOINT()

  const activeTab = tabs.find(tab => pathname === tab.path)?.id || 'overview'

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display tracking-tight">GEOINT</h1>
          <p className="text-surface-500 mt-1 text-sm">Cografi Istihbarat - Il, ilce ve mahalle duzeyinde talep analizi</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={calculateGEOINT}
            disabled={!selectedKeyword || loadingStats}
            className="btn-premium btn-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {loadingStats ? 'Hesaplaniyor...' : 'GEOINT Hesapla'}
          </button>
          <button
            onClick={refreshData}
            className="btn-premium btn-ghost"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Yenile
          </button>
        </div>
      </div>

      {/* Keyword Selector */}
      <div className="card p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">Anahtar Kelime</label>
            {loadingKeywords ? (
              <Skeleton height={40} />
            ) : (
              <select
                value={selectedKeyword?.id || ''}
                onChange={(e) => {
                  const keyword = keywords.find((k) => k.id === e.target.value)
                  if (keyword) setSelectedKeyword(keyword)
                }}
                className="input"
              >
                {keywords.map((keyword) => (
                  <option key={keyword.id} value={keyword.id}>
                    {keyword.keyword}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Recent Keywords Chips */}
          {recentKeywords.length > 1 && (
            <div className="flex-1">
              <label className="block text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">Son Kullanilanlar</label>
              <div className="flex flex-wrap gap-2">
                {recentKeywords.slice(0, 4).map((keyword) => (
                  <button
                    key={keyword.id}
                    onClick={() => setSelectedKeyword(keyword)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                      selectedKeyword?.id === keyword.id
                        ? 'bg-brand-100 text-brand-700 border border-brand-300'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200 border border-transparent'
                    }`}
                  >
                    {keyword.keyword}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedKeyword && (
            <div className="flex gap-2 flex-shrink-0">
              <span className="badge badge-brand">{selectedKeyword.intent || 'Belirsiz'}</span>
              {selectedKeyword.is_active && <span className="badge badge-success">Aktif</span>}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-surface-200 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(tab.path)}
            className={`px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-brand-600 border-b-2 border-brand-600'
                : 'text-surface-500 hover:text-surface-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function GEOINTLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <ChatbotGEOINTConnector />
      <div className="space-y-6">
        <GEOINTHeader />
        {children}
      </div>
    </DashboardLayout>
  )
}

export default function GEOINTLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardLayout><div className="animate-pulse text-surface-500">Yukleniyor...</div></DashboardLayout>}>
      <GEOINTProvider>
        <GEOINTLayoutContent>{children}</GEOINTLayoutContent>
      </GEOINTProvider>
    </Suspense>
  )
}
