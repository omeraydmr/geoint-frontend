'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Map, { Source, Layer, Popup } from 'react-map-gl'

/**
 * Province code mapping from shapeISO (e.g. "TR-34" -> "34").
 * Used to join static boundary GeoJSON with comparison API data.
 */
function extractProvinceCode(shapeISO: string): string | null {
  if (!shapeISO) return null
  const parts = shapeISO.split('-')
  if (parts.length !== 2) return null
  return parts[1]
}

interface RegionCompetitorData {
  region_id: string
  region_name: string
  positions: Record<string, number | null>
  your_position: number | null
  best_competitor_position: number | null
  position_gap: number | null
}

interface CompetitorComparisonSummary {
  total_regions: number
  regions_with_your_data: number
  winning_regions: number
  losing_regions: number
  tied_regions: number
  not_ranking_regions: number
  avg_position: number | null
  avg_competitor_position: number | null
}

interface ComparisonData {
  keyword_id: string
  keyword: string
  user_domain: string | null
  competitors: string[]
  regions: RegionCompetitorData[]
  summary: CompetitorComparisonSummary
}

interface CompetitorMapProps {
  comparisonData: ComparisonData
}

type GeoJsonFeature = {
  type: 'Feature'
  geometry: Record<string, unknown>
  properties: Record<string, unknown>
}

type GeoJsonCollection = {
  type: 'FeatureCollection'
  features: GeoJsonFeature[]
}

/**
 * Standalone competitor comparison map component.
 *
 * Loads province polygons directly from the static GeoJSON boundary file,
 * then joins comparison data by province code. Each province is colored:
 *   - Green shades: user is ahead (lower SERP position = better)
 *   - Yellow: tied
 *   - Red shades: user is behind
 *   - Gray: no data for this province
 */
export default function CompetitorMap({ comparisonData }: CompetitorMapProps) {
  const [mapGeoJson, setMapGeoJson] = useState<GeoJsonCollection | null>(null)
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number
    latitude: number
    properties: Record<string, unknown>
  } | null>(null)
  const mapRef = useRef<any>(null)

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  /**
   * Build a lookup from region_id (province code) to comparison data.
   * Province codes from the API may or may not be zero-padded;
   * static GeoJSON codes are always zero-padded (e.g. "01", "34").
   */
  const buildComparisonLookup = useCallback((regions: RegionCompetitorData[]) => {
    const lookup: Record<string, RegionCompetitorData> = {}
    for (const region of regions) {
      const paddedCode = region.region_id.padStart(2, '0')
      lookup[paddedCode] = region
    }
    return lookup
  }, [])

  /**
   * Load static province boundaries, then merge comparison properties
   * into each feature for Mapbox GL style expressions to consume.
   */
  useEffect(() => {
    let cancelled = false

    async function loadAndMerge() {
      try {
        const response = await fetch('/geo/turkey-provinces.geojson')
        if (!response.ok) {
          console.error('CompetitorMap: failed to load province boundaries', response.status)
          return
        }

        const boundaries: GeoJsonCollection = await response.json()
        if (cancelled) return

        const lookup = buildComparisonLookup(comparisonData.regions)

        const enrichedFeatures = boundaries.features.map((feature) => {
          const code = extractProvinceCode(
            (feature.properties.shapeISO as string) || ''
          )
          const match = code ? lookup[code] : null

          return {
            ...feature,
            properties: {
              name: feature.properties.shapeName || '',
              code: code || '',
              has_comparison: !!match,
              your_position: match?.your_position ?? null,
              best_competitor_position: match?.best_competitor_position ?? null,
              position_gap: match?.position_gap ?? null,
              region_name: match?.region_name ?? (feature.properties.shapeName || ''),
              positions_json: match ? JSON.stringify(match.positions) : '{}',
            },
          }
        })

        if (!cancelled) {
          setMapGeoJson({
            type: 'FeatureCollection',
            features: enrichedFeatures as GeoJsonFeature[],
          })
        }
      } catch (err) {
        console.error('CompetitorMap: boundary load error', err)
      }
    }

    loadAndMerge()
    return () => { cancelled = true }
  }, [comparisonData, buildComparisonLookup])

  const choroplethLayer = {
    id: 'competitor-choropleth',
    type: 'fill' as const,
    paint: {
      'fill-color': [
        'case',
        ['!', ['get', 'has_comparison']],
        '#e5e7eb',
        ['==', ['get', 'position_gap'], null],
        '#fbbf24',
        [
          'interpolate',
          ['linear'],
          ['get', 'position_gap'],
          -20, '#ef4444',
          -10, '#f97316',
          -5, '#fb923c',
          0, '#fbbf24',
          5, '#84cc16',
          10, '#22c55e',
          20, '#16a34a',
        ],
      ],
      'fill-opacity': 0.78,
    },
  }

  const borderLayer = {
    id: 'competitor-borders',
    type: 'line' as const,
    paint: {
      'line-color': '#ffffff',
      'line-width': 1,
    },
  }

  const labelLayer = {
    id: 'competitor-labels',
    type: 'symbol' as const,
    layout: {
      'text-field': [
        'case',
        ['!', ['get', 'has_comparison']],
        '',
        ['==', ['get', 'your_position'], null],
        '-',
        ['concat', '#', ['to-string', ['get', 'your_position']]],
      ],
      'text-size': 11,
      'text-allow-overlap': false,
      'text-ignore-placement': false,
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#000000',
      'text-halo-width': 1.5,
    },
  }

  const handleMouseMove = useCallback((event: any) => {
    const feature = event.features && event.features[0]
    if (feature) {
      setPopupInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        properties: feature.properties,
      })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setPopupInfo(null)
  }, [])

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-surface-50 rounded-xl">
        <p className="text-surface-500">Mapbox token bulunamadi. .env.local dosyasini kontrol edin.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-surface-200">
      <div style={{ height: '500px', width: '100%' }}>
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 35.24,
            latitude: 38.96,
            zoom: 5.5,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={['competitor-choropleth']}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {mapGeoJson && (
            <Source
              id="competitor-data"
              type="geojson"
              data={mapGeoJson}
              generateId
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Layer {...(choroplethLayer as any)} />
              <Layer {...(borderLayer as any)} />
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Layer {...(labelLayer as any)} />
            </Source>
          )}

          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              closeButton={false}
              closeOnClick={false}
              anchor="top"
            >
              <div className="p-3 min-w-[200px]">
                <h3 className="font-semibold text-base mb-2">
                  {popupInfo.properties.region_name as string}
                </h3>

                {popupInfo.properties.has_comparison ? (
                  <div className="space-y-2">
                    <div className="text-center pb-2 border-b border-gray-200">
                      <div className="text-2xl font-bold">
                        {popupInfo.properties.your_position !== null ? (
                          <span
                            className={
                              (popupInfo.properties.position_gap as number) < 0
                                ? 'text-red-500'
                                : (popupInfo.properties.position_gap as number) > 0
                                  ? 'text-green-500'
                                  : 'text-yellow-500'
                            }
                          >
                            #{popupInfo.properties.your_position as number}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Sizin Siralamaniz</div>
                    </div>

                    {popupInfo.properties.position_gap !== null && (
                      <div
                        className={`text-center py-1 px-2 rounded text-sm font-medium ${
                          (popupInfo.properties.position_gap as number) < 0
                            ? 'bg-red-100 text-red-700'
                            : (popupInfo.properties.position_gap as number) > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {(popupInfo.properties.position_gap as number) < 0
                          ? `${Math.abs(popupInfo.properties.position_gap as number)} sira geride`
                          : (popupInfo.properties.position_gap as number) > 0
                            ? `${popupInfo.properties.position_gap as number} sira onde`
                            : 'Berabere'}
                      </div>
                    )}

                    {typeof popupInfo.properties.positions_json === 'string' &&
                      popupInfo.properties.positions_json !== '{}' && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1 font-medium">
                            Tum Siralamalar
                          </div>
                          <table className="w-full text-sm">
                            <tbody>
                              {Object.entries(
                                JSON.parse(popupInfo.properties.positions_json as string)
                              )
                                .sort(
                                  (a, b) =>
                                    ((a[1] as number | null) ?? 999) -
                                    ((b[1] as number | null) ?? 999)
                                )
                                .map(([domain, position]) => (
                                  <tr
                                    key={domain}
                                    className="border-b border-gray-100 last:border-0"
                                  >
                                    <td
                                      className="py-1 text-gray-700 truncate max-w-[120px]"
                                      title={domain}
                                    >
                                      {domain.length > 15
                                        ? domain.substring(0, 15) + '...'
                                        : domain}
                                    </td>
                                    <td className="py-1 text-right font-medium">
                                      {position !== null ? `#${position}` : '-'}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Bu bolge icin veri yok</p>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-2 text-sm">Siralama Farki</h4>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded" />
            <span className="text-xs text-gray-600">Siralama Farki</span>
          </div>
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500" /> Onde
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-400" /> Berabere
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500" /> Geride
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-300" /> Veri Yok
            </span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Haritadaki sayilar sizin SERP siralamanizi gosterir
        </div>
      </div>
    </div>
  )
}
