'use client'

import { useState, useEffect } from 'react'
import { useGEOINT } from '@/contexts/GEOINTContext'
import { competitorsAPI } from '@/services/api'
import { Button } from '@/components/ui/button'

interface Competitor {
  id: string
  domain: string
  name?: string
}

interface CompetitorComparisonPanelProps {
  alwaysExpanded?: boolean
}

export default function CompetitorComparisonPanel({ alwaysExpanded = false }: CompetitorComparisonPanelProps) {
  const {
    comparisonMode,
    setComparisonMode,
    selectedCompetitors,
    setSelectedCompetitors,
    userDomain,
    setUserDomain,
    competitorComparison,
    fetchCompetitorComparison,
    comparisonLoading,
    selectedKeyword,
    comparisonHistory,
    loadComparisonById,
    comparisonHistoryLoading,
  } = useGEOINT()

  const [trackedCompetitors, setTrackedCompetitors] = useState<Competitor[]>([])
  const [loadingCompetitors, setLoadingCompetitors] = useState(false)
  const [customDomain, setCustomDomain] = useState('')

  // Fetch tracked competitors
  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        setLoadingCompetitors(true)
        const data = await competitorsAPI.getAll()
        setTrackedCompetitors(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching competitors:', error)
        setTrackedCompetitors([])
      } finally {
        setLoadingCompetitors(false)
      }
    }
    fetchCompetitors()
  }, [])

  const handleToggleCompetitor = (domain: string) => {
    if (selectedCompetitors.includes(domain)) {
      setSelectedCompetitors(selectedCompetitors.filter(d => d !== domain))
    } else if (selectedCompetitors.length < 4) {
      setSelectedCompetitors([...selectedCompetitors, domain])
    }
  }

  const handleAddCustomDomain = () => {
    if (customDomain && !selectedCompetitors.includes(customDomain) && selectedCompetitors.length < 4) {
      setSelectedCompetitors([...selectedCompetitors, customDomain])
      setCustomDomain('')
    }
  }

  const handleCompare = () => {
    if (selectedKeyword?.id && selectedCompetitors.length > 0) {
      fetchCompetitorComparison(selectedKeyword.id, selectedCompetitors, userDomain)
    }
  }

  const handleToggleMode = () => {
    setComparisonMode(!comparisonMode)
    if (comparisonMode) {
      // Clear comparison data when exiting
      setSelectedCompetitors([])
    }
  }

  // Auto-enable comparison mode when alwaysExpanded
  useEffect(() => {
    if (alwaysExpanded && !comparisonMode) {
      setComparisonMode(true)
    }
  }, [alwaysExpanded, comparisonMode, setComparisonMode])

  if (!comparisonMode && !alwaysExpanded) {
    return (
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-surface-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Rakip Karsilastirma
            </h3>
            <p className="text-sm text-surface-500 mt-1">
              Keyword&apos;unuzun bolgelere gore SERP siralamasini rakiplerle karsilastirin
            </p>
          </div>
          <Button onClick={handleToggleMode} variant="outline" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            Karsilastir
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-0 border border-surface-200 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-surface-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Rakip Karsilastirma
        </h3>
        {!alwaysExpanded && (
          <Button variant="ghost" size="sm" onClick={handleToggleMode}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>

      {/* Your Domain */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Sizin Domain&apos;iniz
        </label>
        <input
          type="text"
          value={userDomain}
          onChange={(e) => setUserDomain(e.target.value)}
          placeholder="ornek.com"
          className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Tracked Competitors */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Rakipler (max 4)
        </label>

        {loadingCompetitors ? (
          <div className="text-sm text-surface-500">Yukluyor...</div>
        ) : trackedCompetitors.length > 0 ? (
          <div className="space-y-2">
            {trackedCompetitors.map((competitor) => (
              <label
                key={competitor.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedCompetitors.includes(competitor.domain)
                    ? 'bg-brand-50 border border-brand-200'
                    : 'bg-surface-50 border border-surface-200 hover:bg-surface-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCompetitors.includes(competitor.domain)}
                  onChange={() => handleToggleCompetitor(competitor.domain)}
                  disabled={!selectedCompetitors.includes(competitor.domain) && selectedCompetitors.length >= 4}
                  className="rounded border-surface-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm">{competitor.domain}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-surface-500">
            Henuz takip edilen rakip yok. Rakipler sayfasindan ekleyebilirsiniz.
          </p>
        )}

        {/* Custom domain input */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="Ozel domain ekle..."
            className="flex-1 px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomDomain()}
          />
          <Button
            onClick={handleAddCustomDomain}
            variant="outline"
            size="sm"
            disabled={!customDomain || selectedCompetitors.length >= 4}
          >
            Ekle
          </Button>
        </div>

        {/* Selected competitors chips */}
        {selectedCompetitors.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedCompetitors.map((domain) => (
              <span
                key={domain}
                className="inline-flex items-center gap-1 px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-xs"
              >
                {domain}
                <button
                  onClick={() => setSelectedCompetitors(selectedCompetitors.filter(d => d !== domain))}
                  className="hover:text-brand-900"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Compare Button */}
      <Button
        onClick={handleCompare}
        disabled={selectedCompetitors.length === 0 || !selectedKeyword || comparisonLoading}
        className="w-full"
      >
        {comparisonLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Karsilastiriliyor...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Karsilastir
          </span>
        )}
      </Button>

      {/* Comparison History Selector */}
      {comparisonHistory.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">
            Gecmis Karsilastirmalar
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                loadComparisonById(e.target.value)
              }
            }}
            value={competitorComparison ? '' : ''}
            className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            disabled={comparisonHistoryLoading}
          >
            <option value="">Tarih secin...</option>
            {comparisonHistory.map((item) => {
              const date = new Date(item.created_at)
              const dateStr = date.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
              const domainsStr = item.competitor_domains.join(', ')
              return (
                <option key={item.id} value={item.id}>
                  {dateStr} — {item.user_domain || '?'} vs {domainsStr}
                </option>
              )
            })}
          </select>
        </div>
      )}

      {/* Comparison Summary */}
      {competitorComparison && !comparisonLoading && (
        <div className="border-t border-surface-200 pt-4 mt-4">
          <h4 className="font-medium text-surface-900 mb-3">Karsilastirma Ozeti</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {competitorComparison.summary.winning_regions}
              </div>
              <div className="text-xs text-green-700">Onde Oldugunuz Bolge</div>
            </div>

            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">
                {competitorComparison.summary.losing_regions}
              </div>
              <div className="text-xs text-red-700">Geride Oldugunuz Bolge</div>
            </div>

            <div className="bg-surface-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-surface-700">
                {competitorComparison.summary.avg_position?.toFixed(1) || '-'}
              </div>
              <div className="text-xs text-surface-600">Ort. Siralamaniz</div>
            </div>

            <div className="bg-surface-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-surface-700">
                {competitorComparison.summary.avg_competitor_position?.toFixed(1) || '-'}
              </div>
              <div className="text-xs text-surface-600">Ort. Rakip Siralama</div>
            </div>
          </div>

          {competitorComparison.summary.not_ranking_regions > 0 && (
            <div className="mt-3 text-sm text-amber-600 bg-amber-50 rounded-lg p-2 text-center">
              {competitorComparison.summary.not_ranking_regions} bolgede siralamaniz yok
            </div>
          )}
        </div>
      )}
    </div>
  )
}
