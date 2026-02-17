'use client';

import { useState, useEffect, useRef } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { Badge } from 'primereact/badge';
import { mergeProvinceBoundaries, mergeDistrictBoundaries } from '@/lib/geo-boundaries';

// Province center coordinates for Turkey
const PROVINCE_COORDINATES = {
  'Istanbul': { lng: 29.0, lat: 41.0, zoom: 9 },
  'Ankara': { lng: 32.85, lat: 39.92, zoom: 9 },
  'Izmir': { lng: 27.14, lat: 38.42, zoom: 9 },
  'Bursa': { lng: 29.06, lat: 40.19, zoom: 9 },
  'Antalya': { lng: 30.71, lat: 36.90, zoom: 9 },
  'Adana': { lng: 35.32, lat: 37.00, zoom: 9 },
  'Konya': { lng: 32.48, lat: 37.87, zoom: 8 },
  'Gaziantep': { lng: 37.38, lat: 37.07, zoom: 9 },
  'Mersin': { lng: 34.63, lat: 36.80, zoom: 9 },
  'Diyarbakir': { lng: 40.22, lat: 37.91, zoom: 9 },
  'Kayseri': { lng: 35.48, lat: 38.73, zoom: 9 },
  'Eskisehir': { lng: 30.52, lat: 39.78, zoom: 9 },
  'Samsun': { lng: 36.33, lat: 41.29, zoom: 9 },
  'Denizli': { lng: 29.09, lat: 37.77, zoom: 9 },
  'Sanliurfa': { lng: 38.79, lat: 37.16, zoom: 9 },
  'Malatya': { lng: 38.32, lat: 38.35, zoom: 9 },
  'Trabzon': { lng: 39.73, lat: 41.00, zoom: 9 },
  'Erzurum': { lng: 41.27, lat: 39.90, zoom: 9 },
  'Van': { lng: 43.38, lat: 38.49, zoom: 9 },
  'Manisa': { lng: 27.43, lat: 38.62, zoom: 9 },
  'Balikesir': { lng: 27.88, lat: 39.65, zoom: 9 },
  'Kocaeli': { lng: 29.94, lat: 40.76, zoom: 9 },
  'Sakarya': { lng: 30.40, lat: 40.74, zoom: 9 },
  'Tekirdag': { lng: 27.51, lat: 41.00, zoom: 9 },
  'Mugla': { lng: 28.36, lat: 37.21, zoom: 9 },
  'Aydin': { lng: 27.84, lat: 37.85, zoom: 9 },
  'Hatay': { lng: 36.16, lat: 36.20, zoom: 9 },
  'Kahramanmaras': { lng: 36.93, lat: 37.58, zoom: 9 },
  'Mardin': { lng: 40.73, lat: 37.31, zoom: 9 },
  'Batman': { lng: 41.13, lat: 37.88, zoom: 9 },
  'Elazig': { lng: 39.22, lat: 38.67, zoom: 9 },
  'Sivas': { lng: 37.01, lat: 39.75, zoom: 8 },
  'Afyonkarahisar': { lng: 30.54, lat: 38.75, zoom: 9 },
  'Kutahya': { lng: 29.97, lat: 39.42, zoom: 9 },
  'Usak': { lng: 29.40, lat: 38.68, zoom: 9 },
  'Isparta': { lng: 30.55, lat: 37.76, zoom: 9 },
  'Burdur': { lng: 30.29, lat: 37.72, zoom: 9 },
  'Zonguldak': { lng: 31.79, lat: 41.45, zoom: 9 },
  'Karabuk': { lng: 32.62, lat: 41.20, zoom: 9 },
  'Bartin': { lng: 32.35, lat: 41.64, zoom: 9 },
  'Kastamonu': { lng: 33.78, lat: 41.38, zoom: 8 },
  'Cankiri': { lng: 33.62, lat: 40.60, zoom: 9 },
  'Corum': { lng: 34.96, lat: 40.55, zoom: 9 },
  'Amasya': { lng: 35.83, lat: 40.65, zoom: 9 },
  'Tokat': { lng: 36.55, lat: 40.31, zoom: 9 },
  'Ordu': { lng: 37.88, lat: 40.98, zoom: 9 },
  'Giresun': { lng: 38.39, lat: 40.91, zoom: 9 },
  'Rize': { lng: 40.52, lat: 41.02, zoom: 9 },
  'Artvin': { lng: 41.82, lat: 41.18, zoom: 9 },
  'Gumushane': { lng: 39.46, lat: 40.46, zoom: 9 },
  'Bayburt': { lng: 40.22, lat: 40.26, zoom: 9 },
  'Erzincan': { lng: 39.49, lat: 39.75, zoom: 9 },
  'Tunceli': { lng: 39.55, lat: 39.11, zoom: 9 },
  'Bingol': { lng: 40.50, lat: 38.88, zoom: 9 },
  'Mus': { lng: 41.49, lat: 38.74, zoom: 9 },
  'Bitlis': { lng: 42.11, lat: 38.40, zoom: 9 },
  'Siirt': { lng: 41.94, lat: 37.93, zoom: 9 },
  'Sirnak': { lng: 42.46, lat: 37.52, zoom: 9 },
  'Hakkari': { lng: 43.74, lat: 37.58, zoom: 9 },
  'Agri': { lng: 43.05, lat: 39.72, zoom: 9 },
  'Igdir': { lng: 44.05, lat: 39.92, zoom: 9 },
  'Kars': { lng: 43.10, lat: 40.60, zoom: 9 },
  'Ardahan': { lng: 42.70, lat: 41.11, zoom: 9 },
  'Nigde': { lng: 34.68, lat: 37.97, zoom: 9 },
  'Aksaray': { lng: 34.03, lat: 38.37, zoom: 9 },
  'Nevsehir': { lng: 34.71, lat: 38.62, zoom: 9 },
  'Kirsehir': { lng: 34.16, lat: 39.15, zoom: 9 },
  'Yozgat': { lng: 34.81, lat: 39.82, zoom: 9 },
  'Karaman': { lng: 33.22, lat: 37.18, zoom: 9 },
  'Kirikkale': { lng: 33.52, lat: 39.85, zoom: 9 },
  'Bilecik': { lng: 29.98, lat: 40.05, zoom: 9 },
  'Bolu': { lng: 31.61, lat: 40.73, zoom: 9 },
  'Duzce': { lng: 31.16, lat: 40.84, zoom: 9 },
  'Yalova': { lng: 29.27, lat: 40.65, zoom: 10 },
  'Edirne': { lng: 26.55, lat: 41.68, zoom: 9 },
  'Kirklareli': { lng: 27.23, lat: 41.73, zoom: 9 },
  'Canakkale': { lng: 26.41, lat: 40.15, zoom: 9 },
  'Kilis': { lng: 37.12, lat: 36.72, zoom: 10 },
  'Osmaniye': { lng: 36.25, lat: 37.07, zoom: 9 },
  'Adiyaman': { lng: 38.28, lat: 37.76, zoom: 9 },
};

// Normalize province name for matching
function normalizeProvinceName(name) {
  if (!name) return '';
  return name
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .toLowerCase()
    .trim();
}

// Find province coordinates by name
function findProvinceCoordinates(provinceName) {
  if (!provinceName) return null;

  const normalized = normalizeProvinceName(provinceName);

  for (const [key, value] of Object.entries(PROVINCE_COORDINATES)) {
    if (normalizeProvinceName(key) === normalized) {
      return value;
    }
  }

  // Try partial match
  for (const [key, value] of Object.entries(PROVINCE_COORDINATES)) {
    if (normalizeProvinceName(key).includes(normalized) || normalized.includes(normalizeProvinceName(key))) {
      return value;
    }
  }

  return null;
}

export default function HeatMap({
  geojsonData,
  onRegionClick,
  loading,
  highlightedProvince,
  isDistrictView,
  currentProvinceName,
  comparisonMode = false,
  comparisonData = null
}) {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mergedGeoJson, setMergedGeoJson] = useState(null);
  const mapRef = useRef();
  const lastZoomedProvinceRef = useRef(null);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Merge API score data with static GeoJSON polygon boundaries.
  // This replaces any rectangular bounding-box geometries from the DB
  // with real province/district polygon shapes from the static files.
  useEffect(() => {
    let cancelled = false;

    async function mergeBoundaries() {
      if (!geojsonData || !geojsonData.features) {
        setMergedGeoJson(null);
        return;
      }

      try {
        let merged;
        if (isDistrictView) {
          // Prefer the 2-digit province code from metadata for reliable
          // spatial filtering. Falls back to province_id (UUID) if needed.
          const provinceCode =
            geojsonData.metadata?.province_code ||
            geojsonData.metadata?.province_id ||
            geojsonData.features[0]?.properties?.province_id ||
            null;
          merged = await mergeDistrictBoundaries(geojsonData, provinceCode);
        } else {
          merged = await mergeProvinceBoundaries(geojsonData);
        }

        if (!cancelled) {
          setMergedGeoJson(merged);
        }
      } catch (err) {
        console.error('Failed to merge boundaries, using API data as fallback:', err);
        if (!cancelled) {
          setMergedGeoJson(geojsonData);
        }
      }
    }

    mergeBoundaries();
    return () => { cancelled = true; };
  }, [geojsonData, isDistrictView]);

  // Handle map load
  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  // Build comparison data lookup map
  const comparisonLookup = {};
  if (comparisonMode && comparisonData?.regions) {
    comparisonData.regions.forEach(region => {
      comparisonLookup[region.region_id] = region;
    });
  }

  // Merge comparison data into the boundary-merged geojson for visualization
  const enrichedGeojsonData = comparisonMode && mergedGeoJson ? {
    ...mergedGeoJson,
    features: mergedGeoJson.features.map(feature => {
      const regionId = feature.properties?.id || feature.properties?.code;
      const compData = comparisonLookup[regionId];

      return {
        ...feature,
        properties: {
          ...feature.properties,
          position_gap: compData?.position_gap ?? null,
          your_position: compData?.your_position ?? null,
          best_competitor_position: compData?.best_competitor_position ?? null,
          positions: compData?.positions ?? {},
          has_comparison: !!compData
        }
      };
    })
  } : mergedGeoJson;

  // Choropleth layer style - changes based on comparison mode
  const choroplethLayer = comparisonMode ? {
    id: 'geoint-choropleth',
    type: 'fill',
    paint: {
      'fill-color': [
        'case',
        // No comparison data - gray
        ['!', ['get', 'has_comparison']],
        '#e5e7eb',
        // No position gap (either you or competitor not ranking)
        ['==', ['get', 'position_gap'], null],
        '#fbbf24', // Yellow for missing data
        // Position gap coloring: negative = you're behind (red), positive = you're ahead (green)
        [
          'interpolate',
          ['linear'],
          ['get', 'position_gap'],
          -20, '#ef4444', // Very behind (dark red)
          -10, '#f97316', // Behind (orange)
          -5, '#fb923c',  // Slightly behind (light orange)
          0, '#fbbf24',   // Tied (yellow)
          5, '#84cc16',   // Slightly ahead (lime)
          10, '#22c55e',  // Ahead (green)
          20, '#16a34a'   // Very ahead (dark green)
        ]
      ],
      'fill-opacity': [
        'case',
        ['==', ['get', 'name'], highlightedProvince || ''],
        0.9,
        0.75
      ]
    }
  } : {
    id: 'geoint-choropleth',
    type: 'fill',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'geoint_score'],
        0,  '#a50026',
        15, '#d73027',
        25, '#f46d43',
        35, '#fdae61',
        45, '#fee08b',
        50, '#ffffbf',
        55, '#d9ef8b',
        60, '#a6d96a',
        65, '#66bd63',
        70, '#1a9850',
        80, '#006837',
        100, '#004529'
      ],
      'fill-opacity': [
        'case',
        ['==', ['get', 'name'], highlightedProvince || ''],
        0.9,
        0.75
      ]
    }
  };

  // Border layer
  const borderLayer = {
    id: 'geoint-borders',
    type: 'line',
    paint: {
      'line-color': '#ffffff',
      'line-width': 1
    }
  };

  // Highlighted layer (on hover or selected)
  const highlightLayer = {
    id: 'geoint-highlighted',
    type: 'line',
    paint: {
      'line-color': '#0ea5e9',
      'line-width': 3
    },
    filter: ['==', 'id', '']
  };

  // Selected province highlight (thicker border)
  const selectedLayer = {
    id: 'geoint-selected',
    type: 'line',
    paint: {
      'line-color': '#f97316',
      'line-width': 4
    },
    filter: ['==', 'name', highlightedProvince || '']
  };

  // Label layer for scores - shows position in comparison mode
  const labelLayer = comparisonMode ? {
    id: 'geoint-labels',
    type: 'symbol',
    layout: {
      'text-field': [
        'case',
        ['==', ['get', 'your_position'], null],
        '-',
        ['to-string', ['get', 'your_position']]
      ],
      'text-size': 11,
      'text-allow-overlap': false,
      'text-ignore-placement': false
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#000000',
      'text-halo-width': 1.5
    }
  } : {
    id: 'geoint-labels',
    type: 'symbol',
    layout: {
      'text-field': ['to-string', ['round', ['get', 'geoint_score']]],
      'text-size': 12,
      'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
      'text-allow-overlap': false,
      'text-ignore-placement': false
    },
    paint: {
      'text-color': [
        'interpolate',
        ['linear'],
        ['get', 'geoint_score'],
        0,  '#ffffff',
        35, '#ffffff',
        42, '#1a1a1a',
        58, '#1a1a1a',
        65, '#ffffff',
        100, '#ffffff'
      ],
      'text-halo-color': [
        'interpolate',
        ['linear'],
        ['get', 'geoint_score'],
        0,  '#000000',
        35, '#000000',
        42, '#ffffff',
        58, '#ffffff',
        65, '#000000',
        100, '#000000'
      ],
      'text-halo-width': 1.5
    }
  };

  // Zoom to highlighted province or district view province
  useEffect(() => {
    // Determine which province to zoom to
    const targetProvince = highlightedProvince || (isDistrictView ? currentProvinceName : null);

    if (!targetProvince) {
      console.log('No target province to zoom to');
      lastZoomedProvinceRef.current = null;
      return;
    }

    // Create a unique key for this zoom target
    const zoomKey = `${targetProvince}-${isDistrictView ? 'district' : 'province'}`;

    // Skip if we already zoomed to this exact target
    if (lastZoomedProvinceRef.current === zoomKey) {
      console.log('Already zoomed to:', zoomKey);
      return;
    }

    console.log('Zooming to province:', targetProvince, 'mapLoaded:', mapLoaded, 'isDistrictView:', isDistrictView);

    const coords = findProvinceCoordinates(targetProvince);
    console.log('Province coordinates:', coords);

    const zoomToProvince = (map) => {
      if (!coords || !map) return;

      console.log('Flying to:', coords);
      lastZoomedProvinceRef.current = zoomKey;
      map.flyTo({
        center: [coords.lng, coords.lat],
        zoom: isDistrictView ? coords.zoom + 1 : coords.zoom, // Zoom in more for district view
        duration: 1500,
        essential: true
      });
    };

    if (coords && mapRef.current && mapLoaded) {
      const map = mapRef.current.getMap();
      zoomToProvince(map);
    } else if (coords && mapRef.current) {
      // Map not loaded yet, try after a delay
      const timer = setTimeout(() => {
        const map = mapRef.current?.getMap();
        zoomToProvince(map);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Also try to find the feature and set popup (only for highlight, not district view)
    if (highlightedProvince && mergedGeoJson && mergedGeoJson.features) {
      const normalizedHighlight = normalizeProvinceName(highlightedProvince);
      const feature = mergedGeoJson.features.find(f =>
        normalizeProvinceName(f.properties?.name) === normalizedHighlight
      );

      if (feature && feature.properties) {
        // Set popup for the highlighted province
        if (coords) {
          setPopupInfo({
            longitude: coords.lng,
            latitude: coords.lat,
            properties: feature.properties
          });
        }
      }
    }
  }, [highlightedProvince, currentProvinceName, isDistrictView, mergedGeoJson, mapLoaded]);

  const handleMouseMove = (event) => {
    const feature = event.features && event.features[0];
    if (feature) {
      setHoveredFeature(feature);
      setPopupInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        properties: feature.properties
      });

      // Update highlight filter
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        if (map && map.getLayer('geoint-highlighted')) {
          map.setFilter('geoint-highlighted', ['==', 'id', feature.id || '']);
        }
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredFeature(null);

    // Keep popup if province is highlighted
    if (!highlightedProvince) {
      setPopupInfo(null);
    }

    // Clear highlight
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      if (map && map.getLayer('geoint-highlighted')) {
        map.setFilter('geoint-highlighted', ['==', 'id', '']);
      }
    }
  };

  const handleClick = (event) => {
    const feature = event.features && event.features[0];
    if (feature && onRegionClick) {
      onRegionClick(feature.properties.id, feature.properties.name);
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { severity: 'success', label: 'Cok Yuksek' };
    if (score >= 70) return { severity: 'success', label: 'Yuksek' };
    if (score >= 55) return { severity: 'info', label: 'Ortanin Ustu' };
    if (score >= 40) return { severity: 'warning', label: 'Orta' };
    if (score >= 20) return { severity: 'danger', label: 'Dusuk' };
    return { severity: 'danger', label: 'Cok Dusuk' };
  };

  const getTrendIcon = (direction) => {
    if (direction === 'up') return 'pi-arrow-up text-green-500';
    if (direction === 'down') return 'pi-arrow-down text-red-500';
    return 'pi-minus text-gray-500';
  };

  // Auto-fit bounds when data changes
  useEffect(() => {
    // For district view, always fit to bounds
    // For province view with highlight, zoom to highlighted province
    // For province view without highlight, fit to Turkey

    if (!mapRef.current || !mergedGeoJson || !mergedGeoJson.features || mergedGeoJson.features.length === 0) {
      return;
    }

    const fitToBounds = () => {
      // Calculate bounds from merged geojson data
      let minLng = 180, minLat = 90, maxLng = -180, maxLat = -90;
      let hasValidCoords = false;

      mergedGeoJson.features.forEach(feature => {
        if (!feature.geometry || !feature.geometry.coordinates) return;

        const processCoords = (coords) => {
          if (!Array.isArray(coords)) return;

          if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
             const [lng, lat] = coords;
             if (lng < minLng) minLng = lng;
             if (lng > maxLng) maxLng = lng;
             if (lat < minLat) minLat = lat;
             if (lat > maxLat) maxLat = lat;
             hasValidCoords = true;
             return;
          }

          coords.forEach(sub => processCoords(sub));
        };

        processCoords(feature.geometry.coordinates);
      });

      if (hasValidCoords && minLng !== 180) {
        try {
          const map = mapRef.current.getMap();
          if (map) {
            console.log('Fitting to bounds:', [[minLng, minLat], [maxLng, maxLat]]);
            map.fitBounds(
              [[minLng, minLat], [maxLng, maxLat]],
              { padding: 50, duration: 1000 }
            );
          }
        } catch (e) {
          console.warn("Could not fit bounds", e);
        }
      }
    };

    // For district view, fit to district bounds after zoom animation completes
    // But only if the data looks like district data (not 81 provinces)
    if (isDistrictView) {
      // Skip fitting if we still have province-level data (81 features = all provinces)
      // District data typically has fewer features for a single province
      const featureCount = mergedGeoJson.features.length;
      if (featureCount >= 75) {
        console.log('District view but still have province data, skipping fit');
        return;
      }

      console.log('District view - fitting to district bounds after zoom, features:', featureCount);
      // Longer delay to let the initial zoom animation complete first
      setTimeout(fitToBounds, 1800);
      return;
    }

    // For province view with highlight, zoom to province
    if (highlightedProvince && !isDistrictView) {
      // Let the highlight effect handle this
      return;
    }

    // For province view without highlight, fit to Turkey
    fitToBounds();
  }, [mergedGeoJson, isDistrictView, highlightedProvince]);

  if (loading) {
    return (
      <Card className="map-container">
        <Skeleton height="600px" />
      </Card>
    );
  }

  if (!MAPBOX_TOKEN) {
    return (
      <Card className="map-container">
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <i className="pi pi-exclamation-triangle text-5xl text-orange-500 mb-4"></i>
            <p className="text-gray-600">Mapbox token bulunamadi</p>
            <p className="text-sm text-gray-400">Lutfen .env.local dosyasinda NEXT_PUBLIC_MAPBOX_TOKEN tanimlayin</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="map-container">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 35.24,
            latitude: 38.96,
            zoom: 5.5
          }}
          style={{ width: '100%', height: '600px' }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={['geoint-choropleth']}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onLoad={handleMapLoad}
        >
          {enrichedGeojsonData && (
            <Source
              id="geoint-data"
              type="geojson"
              data={enrichedGeojsonData}
              generateId={true}
            >
              <Layer {...choroplethLayer} />
              <Layer {...borderLayer} />
              <Layer {...highlightLayer} />
              <Layer {...selectedLayer} />
              <Layer {...labelLayer} />
            </Source>
          )}

          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              closeButton={false}
              closeOnClick={false}
              anchor="top"
              className="geoint-popup"
            >
              <div className="p-3 min-w-[200px]">
                <h3 className="font-semibold text-lg mb-2">
                  {popupInfo.properties.name}
                  {highlightedProvince && normalizeProvinceName(popupInfo.properties.name) === normalizeProvinceName(highlightedProvince) && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                      Secili
                    </span>
                  )}
                </h3>

                {comparisonMode && popupInfo.properties.has_comparison ? (
                  // Comparison mode popup
                  <div className="space-y-3">
                    {/* Position comparison header */}
                    <div className="text-center pb-2 border-b border-gray-200">
                      <div className="text-2xl font-bold">
                        {popupInfo.properties.your_position !== null ? (
                          <span className={popupInfo.properties.position_gap < 0 ? 'text-red-500' : popupInfo.properties.position_gap > 0 ? 'text-green-500' : 'text-yellow-500'}>
                            #{popupInfo.properties.your_position}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Sizin Siralamaniz</div>
                    </div>

                    {/* Position gap indicator */}
                    {popupInfo.properties.position_gap !== null && (
                      <div className={`text-center py-1 px-2 rounded text-sm font-medium ${
                        popupInfo.properties.position_gap < 0
                          ? 'bg-red-100 text-red-700'
                          : popupInfo.properties.position_gap > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {popupInfo.properties.position_gap < 0
                          ? `${Math.abs(popupInfo.properties.position_gap)} sira geride`
                          : popupInfo.properties.position_gap > 0
                            ? `${popupInfo.properties.position_gap} sira onde`
                            : 'Berabere'}
                      </div>
                    )}

                    {/* All positions table */}
                    {popupInfo.properties.positions && Object.keys(popupInfo.properties.positions).length > 0 && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1 font-medium">Tum Siralamar</div>
                        <table className="w-full text-sm">
                          <tbody>
                            {Object.entries(popupInfo.properties.positions)
                              .sort((a, b) => (a[1] ?? 999) - (b[1] ?? 999))
                              .map(([domain, position]) => (
                                <tr key={domain} className="border-b border-gray-100 last:border-0">
                                  <td className="py-1 text-gray-700 truncate max-w-[120px]" title={domain}>
                                    {domain.length > 15 ? domain.substring(0, 15) + '...' : domain}
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
                  // Normal mode popup
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">GEOINT Skoru:</span>
                      <Badge
                        value={popupInfo.properties.geoint_score?.toFixed(1) || '0'}
                        severity={getScoreBadge(popupInfo.properties.geoint_score || 0).severity}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Arama Ilgisi:</span>
                      <span className="font-medium">
                        {popupInfo.properties.search_index?.toFixed(0) || '0'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trend:</span>
                      <i className={`pi ${getTrendIcon(popupInfo.properties.trend_direction)}`}></i>
                    </div>

                    {popupInfo.properties.population && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nufus:</span>
                        <span className="font-medium">
                          {popupInfo.properties.population.toLocaleString('tr-TR')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded">
        {comparisonMode ? (
          <>
            <h4 className="font-semibold mb-2 text-sm">Rakip Karsilastirma Lejanti</h4>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded"></div>
                <span className="text-xs text-gray-600">Siralama Farki</span>
              </div>
              <div className="flex items-center gap-4 text-xs flex-wrap">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Onde</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Berabere</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Geride</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-300"></span> Veri Yok</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Haritadaki sayilar sizin SERP siralamanizi gosterir
            </div>
          </>
        ) : (
          <>
            <h4 className="font-semibold mb-2 text-sm">GEOINT Skoru Lejanti</h4>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-4 rounded flex-1 max-w-[240px]"
                style={{
                  background: 'linear-gradient(to right, #a50026, #d73027, #f46d43, #fdae61, #fee08b, #ffffbf, #d9ef8b, #a6d96a, #66bd63, #1a9850, #006837, #004529)'
                }}
              ></div>
              <span className="text-xs text-gray-600 ml-1">0 - 100</span>
            </div>
            <div className="flex items-center gap-4 text-xs flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#006837' }}></span> Cok Yuksek (80+)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1a9850' }}></span> Yuksek (70-80)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a6d96a' }}></span> Ortanin Ustu (55-70)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#fee08b' }}></span> Orta (40-55)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f46d43' }}></span> Dusuk (20-40)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a50026' }}></span> Cok Dusuk (&lt;20)</span>
            </div>
          </>
        )}
        {highlightedProvince && (
          <div className="mt-2 text-xs text-orange-600">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full border-2 border-orange-500"></span>
              Vurgulanan: {highlightedProvince}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
