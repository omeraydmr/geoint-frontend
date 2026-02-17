'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
// @ts-ignore
import HeatMap from '@/components/geoint/HeatMap'
import { useGEOINT } from '@/contexts/GEOINTContext'
import { Button } from '@/components/ui/button'

function MapContent() {
  const searchParams = useSearchParams()
  const highlightParam = searchParams.get('highlight')
  const provinceIdParam = searchParams.get('province')
  const provinceNameParam = searchParams.get('provinceName')

  const {
    heatmapData,
    fetchHeatmapData,
    selectedKeyword,
    loadingRegions,
    highlightedProvince,
    setHighlightedProvince,
    currentDrillDownProvince,
    setCurrentDrillDownProvince,
  } = useGEOINT()

  const [viewMode, setViewMode] = useState<'province' | 'district'>('province')

  // Handle URL params for drill-down
  useEffect(() => {
    if (provinceIdParam && provinceNameParam) {
      console.log('Setting district view from URL params:', provinceIdParam, provinceNameParam)
      setViewMode('district')
      setCurrentDrillDownProvince({ id: provinceIdParam, name: provinceNameParam })
      setHighlightedProvince(null)

      // Fetch district data if we have a keyword
      if (selectedKeyword?.id) {
        fetchHeatmapData(selectedKeyword.id, 'ilce', provinceIdParam)
      }
    } else if (highlightParam) {
      // Just highlighting, not drilling down
      setHighlightedProvince(highlightParam)
      setViewMode('province')
    }
  }, [provinceIdParam, provinceNameParam, highlightParam, selectedKeyword?.id, fetchHeatmapData, setHighlightedProvince, setCurrentDrillDownProvince])

  // Sync view mode with currentDrillDownProvince
  useEffect(() => {
    if (currentDrillDownProvince) {
      setViewMode('district')
    }
  }, [currentDrillDownProvince])

  const handleRegionClick = (id: string, name: string) => {
    if (viewMode === 'province') {
      // Drill down to district
      console.log('Drilling down to:', id, name)
      setViewMode('district')
      setCurrentDrillDownProvince({ id, name })
      setHighlightedProvince(null)

      if (selectedKeyword?.id) {
        fetchHeatmapData(selectedKeyword.id, 'ilce', id)
      }

      // Update URL
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set('province', id)
      newParams.set('provinceName', name)
      newParams.delete('highlight')
      window.history.pushState({}, '', `?${newParams.toString()}`)
    }
  }

  const handleBack = () => {
    console.log('Going back to Turkey view')
    setViewMode('province')
    setCurrentDrillDownProvince(null)
    setHighlightedProvince(null)

    if (selectedKeyword?.id) {
      fetchHeatmapData(selectedKeyword.id, 'il', null)
    }

    // Update URL - remove province params
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('province')
    newParams.delete('provinceName')
    newParams.delete('highlight')
    const newUrl = newParams.toString() ? `?${newParams.toString()}` : window.location.pathname
    window.history.pushState({}, '', newUrl)
  }

  const clearHighlight = () => {
    setHighlightedProvince(null)
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('highlight')
    const newUrl = newParams.toString() ? `?${newParams.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }

  // Determine current province name to display
  const currentProvinceName = currentDrillDownProvince?.name || provinceNameParam

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center bg-surface-0 p-4 rounded-xl border border-surface-200">
        <div>
          <h2 className="text-lg font-semibold text-surface-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-500 rounded-full"></span>
            {viewMode === 'province'
              ? 'Turkiye Geneli (Iller)'
              : `${currentProvinceName} (Ilceler)`
            }
          </h2>
          <p className="text-sm text-surface-500 mt-1">
            {viewMode === 'district'
              ? 'Ilce bazli GEOINT skorlari goruntuleniyor.'
              : highlightedProvince
                ? `${highlightedProvince} ili vurgulandi. Detay icin tiklayin.`
                : 'Detayli analiz icin bir ilin uzerine tiklayin.'}
          </p>
        </div>

        <div className="flex gap-2">
          {highlightedProvince && viewMode === 'province' && (
            <Button
              variant="outline"
              onClick={clearHighlight}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Vurguyu Kaldir
            </Button>
          )}
          {viewMode === 'district' && (
            <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Turkiye Haritasina Don
            </Button>
          )}
        </div>
      </div>

      <div className="card border-0 p-0 overflow-hidden rounded-xl shadow-lg ring-1 ring-surface-200">
        <HeatMap
          geojsonData={heatmapData}
          loading={loadingRegions}
          onRegionClick={handleRegionClick}
          highlightedProvince={highlightedProvince}
          isDistrictView={viewMode === 'district'}
          currentProvinceName={currentProvinceName}
        />
      </div>
    </div>
  )
}

export default function GEOINTMapPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-surface-500">Harita yukleniyor...</div>}>
      <MapContent />
    </Suspense>
  )
}
