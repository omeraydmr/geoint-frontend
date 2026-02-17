'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useGEOINT } from '@/contexts/GEOINTContext'

export default function GEOINTBudgetPage() {
  const {
    selectedKeyword,
    budget,
    setBudget,
    budgetRecommendations,
    calculateBudget
  } = useGEOINT()

  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Auto-calculate on budget change (debounced)
  const handleBudgetChange = useCallback((value: number) => {
    setBudget(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (selectedKeyword) {
        calculateBudget()
      }
    }, 500)
  }, [setBudget, calculateBudget, selectedKeyword])

  // Initial calculation
  useEffect(() => {
    if (selectedKeyword && budgetRecommendations.length === 0) {
      calculateBudget()
    }
  }, [selectedKeyword, calculateBudget, budgetRecommendations.length])

  const formatBudget = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-base font-semibold text-surface-900 mb-6">Butce Onerileri</h2>
      <div className="space-y-6">
        {/* Budget Slider - Zero Click Improvement */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-surface-500 uppercase tracking-wider">Toplam Butce</label>
            <div className="text-2xl font-bold text-brand-600">
              TL{budget.toLocaleString('tr-TR')}
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={budget}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-xs text-surface-400 mt-2">
              <span>TL10K</span>
              <span>TL100K</span>
              <span>TL250K</span>
              <span>TL500K</span>
            </div>
          </div>

          {/* Quick Budget Presets */}
          <div className="flex flex-wrap gap-2">
            {[25000, 50000, 100000, 150000, 250000].map((preset) => (
              <button
                key={preset}
                onClick={() => handleBudgetChange(preset)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  budget === preset
                    ? 'bg-brand-100 text-brand-700 border border-brand-300'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200 border border-transparent'
                }`}
              >
                TL{formatBudget(preset)}
              </button>
            ))}
          </div>
        </div>

        {budgetRecommendations.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-surface-900">Butce Dagilimi</h3>
            {budgetRecommendations.map((alloc, index) => (
              <div key={index} className="p-5 rounded-xl border border-surface-200 hover:border-brand-300 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-surface-900">{alloc.region_name}</h4>
                    <p className="text-xs text-surface-500 mt-1">GEOINT Skoru: {alloc.geoint_score?.toFixed(1)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-brand-600">
                      TL{alloc.allocated_budget?.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-surface-500">{alloc.allocation_percentage?.toFixed(1)}%</div>
                  </div>
                </div>

                {/* Allocation Progress Bar */}
                <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                    style={{ width: `${alloc.allocation_percentage}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {alloc.recommended_channels?.map((channel: string, i: number) => (
                    <span key={i} className="px-2 py-1 text-2xs font-medium bg-surface-100 text-surface-600 rounded-md">
                      {channel}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-3 mt-4 pt-3 border-t border-surface-100">
                  <div className="text-center">
                    <div className="text-2xs text-surface-400">Arama</div>
                    <div className="text-sm font-medium text-surface-700">{alloc.search_index?.toFixed(0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xs text-surface-400">Trend</div>
                    <div className="text-sm font-medium text-surface-700">{alloc.trend_score?.toFixed(0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xs text-surface-400">Demo</div>
                    <div className="text-sm font-medium text-surface-700">{alloc.demographic_fit?.toFixed(0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xs text-surface-400">Rekabet</div>
                    <div className="text-sm font-medium text-surface-700">{alloc.competition_gap?.toFixed(0)}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 bg-surface-50 rounded-xl mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-surface-900">Toplam Butce</span>
                <span className="text-xl font-bold text-brand-600">
                  TL{budget.toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-surface-500">
            <svg className="w-16 h-16 mx-auto mb-3 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium mb-1">Butce Dagilimi Hesaplaniyor</p>
            <p className="text-xs text-surface-400 mb-4">Bir anahtar kelime secin ve butce ayarlayin</p>
            <button className="btn-premium btn-primary" onClick={calculateBudget} disabled={!selectedKeyword}>
              Butce Hesapla
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
