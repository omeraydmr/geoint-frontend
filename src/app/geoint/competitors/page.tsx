'use client'

import { Suspense } from 'react'
import CompetitorMap from '@/components/geoint/CompetitorMap'
import CompetitorComparisonPanel from '@/components/geoint/CompetitorComparisonPanel'
import { useGEOINT } from '@/contexts/GEOINTContext'

function CompetitorsContent() {
  const {
    comparisonMode,
    competitorComparison
  } = useGEOINT()

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="bg-surface-0 p-4 rounded-xl border border-surface-200">
        <h2 className="text-lg font-semibold text-surface-900 flex items-center gap-2">
          <span className="w-2 h-6 bg-brand-500 rounded-full"></span>
          Rakip Karsilastirma
        </h2>
        <p className="text-sm text-surface-500 mt-1">
          Keyword&apos;unuzun bolgelere gore SERP siralamasini rakiplerle karsilastirin ve harita uzerinde goruntuleyin.
        </p>
      </div>

      {/* Competitor Selection Panel - always expanded */}
      <CompetitorComparisonPanel alwaysExpanded />

      {/* Standalone Competitor Comparison Map */}
      {comparisonMode && competitorComparison && (
        <CompetitorMap comparisonData={competitorComparison as any} />
      )}

      {/* Empty state when no comparison yet */}
      {(!competitorComparison || !comparisonMode) && (
        <div className="bg-surface-0 border border-surface-200 rounded-xl p-8 text-center">
          <svg className="w-12 h-12 text-surface-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-surface-700 font-medium mb-1">Henuz karsilastirma yapilmadi</h3>
          <p className="text-sm text-surface-500">
            Yukaridaki panelden rakiplerinizi secin ve &quot;Karsilastir&quot; butonuna tiklayin.
          </p>
        </div>
      )}
    </div>
  )
}

export default function GEOINTCompetitorsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-surface-500">Yukleniyor...</div>}>
      <CompetitorsContent />
    </Suspense>
  )
}
