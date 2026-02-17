'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  CheckIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface Competitor {
  id: string
  name?: string
  domain: string
  domain_authority?: number
}

interface CompetitorSelectorProps {
  competitors: Competitor[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  maxSelections?: number
  isLoading?: boolean
}

export function CompetitorSelector({
  competitors,
  selected,
  onSelectionChange,
  maxSelections = 4,
  isLoading = false
}: CompetitorSelectorProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredCompetitors = useMemo(() => {
    if (!search) return competitors
    const searchLower = search.toLowerCase()
    return competitors.filter(c =>
      c.domain.toLowerCase().includes(searchLower) ||
      c.name?.toLowerCase().includes(searchLower)
    )
  }, [competitors, search])

  const selectedCompetitors = useMemo(() => {
    return competitors.filter(c => selected.includes(c.id))
  }, [competitors, selected])

  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      onSelectionChange(selected.filter(s => s !== id))
    } else if (selected.length < maxSelections) {
      onSelectionChange([...selected, id])
    }
  }

  const removeSelection = (id: string) => {
    onSelectionChange(selected.filter(s => s !== id))
  }

  return (
    <div className="relative">
      {/* Selected Chips */}
      {selectedCompetitors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedCompetitors.map(c => (
            <div
              key={c.id}
              className="flex items-center gap-1.5 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm"
            >
              <span>{c.domain}</span>
              <button
                onClick={() => removeSelection(c.id)}
                className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded p-0.5"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-left flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        disabled={isLoading}
      >
        <span className="text-slate-500 dark:text-slate-400">
          {selected.length === 0
            ? 'Karşılaştırılacak rakipleri seçin...'
            : `${selected.length} seçili (maks ${maxSelections})`}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rakip ara..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Options */}
          <div className="overflow-y-auto max-h-48">
            {filteredCompetitors.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-500 text-center">
                Rakip bulunamadı
              </div>
            ) : (
              filteredCompetitors.map(competitor => {
                const isSelected = selected.includes(competitor.id)
                const isDisabled = !isSelected && selected.length >= maxSelections

                return (
                  <button
                    key={competitor.id}
                    onClick={() => toggleSelection(competitor.id)}
                    disabled={isDisabled}
                    className={`w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    } ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {competitor.domain}
                        </span>
                        {competitor.name && competitor.name !== competitor.domain && (
                          <span className="text-xs text-slate-500 ml-2">
                            {competitor.name}
                          </span>
                        )}
                      </div>
                    </div>
                    {competitor.domain_authority && (
                      <Badge variant="info" size="sm">
                        DA: {competitor.domain_authority}
                      </Badge>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
