/**
 * Turkey Geographic Boundary Loader
 *
 * Loads real GeoJSON polygon boundaries for Turkey's provinces (ADM1)
 * and districts (ADM2) from static files, then merges GEOINT score
 * properties from the API into those boundary features.
 *
 * This eliminates dependency on PostGIS geometry quality -- the
 * authoritative polygon shapes always come from the static GeoJSON
 * files sourced from geoBoundaries (OpenStreetMap).
 */

let provinceBoundariesCache = null;
let districtBoundariesCache = null;

/**
 * Normalize Turkish characters for fuzzy name matching.
 * Handles both the GeoJSON source names (which use Turkish characters)
 * and the API names (which may or may not).
 */
function normalizeTurkish(name) {
  if (!name) return '';
  return name
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .toLowerCase()
    .trim();
}

/**
 * Extract the 2-digit province code from a shapeISO like "TR-34".
 * Returns the numeric string without leading zeros for matching,
 * or the zero-padded version based on the `padded` flag.
 */
function extractProvinceCode(shapeISO) {
  if (!shapeISO) return null;
  const parts = shapeISO.split('-');
  if (parts.length !== 2) return null;
  return parts[1];
}

/**
 * Load province boundaries from the static GeoJSON file.
 * Caches the result after the first successful fetch.
 */
async function loadProvinceBoundaries() {
  if (provinceBoundariesCache) return provinceBoundariesCache;

  const response = await fetch('/geo/turkey-provinces.geojson');
  if (!response.ok) {
    console.error('Failed to load province boundaries:', response.status);
    return null;
  }

  const geojson = await response.json();
  provinceBoundariesCache = geojson;
  return geojson;
}

/**
 * Load district boundaries from the static GeoJSON file.
 * Caches the result after the first successful fetch.
 */
async function loadDistrictBoundaries() {
  if (districtBoundariesCache) return districtBoundariesCache;

  const response = await fetch('/geo/turkey-districts.geojson');
  if (!response.ok) {
    console.error('Failed to load district boundaries:', response.status);
    return null;
  }

  const geojson = await response.json();
  districtBoundariesCache = geojson;
  return geojson;
}

/**
 * Build a lookup map from API score features, keyed by province code.
 * API features have properties.code (e.g. "01", "34").
 */
function buildProvinceScoreLookup(apiFeatures) {
  const byCode = {};
  const byName = {};

  for (const feature of apiFeatures) {
    const props = feature.properties || {};
    if (props.code) {
      byCode[props.code] = props;
    }
    if (props.name) {
      byName[normalizeTurkish(props.name)] = props;
    }
  }

  return { byCode, byName };
}

/**
 * Build a lookup map from API district score features, keyed by
 * normalized district name. District names are unique within a province.
 */
function buildDistrictScoreLookup(apiFeatures) {
  const byName = {};

  for (const feature of apiFeatures) {
    const props = feature.properties || {};
    if (props.name) {
      byName[normalizeTurkish(props.name)] = props;
    }
  }

  return byName;
}

/**
 * Merge province score data from the API into static province boundaries.
 *
 * Returns a new GeoJSON FeatureCollection where each feature has:
 * - The real polygon geometry from the static file
 * - All score properties from the API (geoint_score, search_index, etc.)
 * - Fallback defaults if no API data exists for a province
 */
export async function mergeProvinceBoundaries(apiGeoJson) {
  const boundaries = await loadProvinceBoundaries();

  if (!boundaries) {
    // Fallback: return API data as-is if boundary file unavailable
    return apiGeoJson;
  }

  if (!apiGeoJson || !apiGeoJson.features || apiGeoJson.features.length === 0) {
    // No API data yet; return boundaries with zero scores
    return {
      type: 'FeatureCollection',
      features: boundaries.features.map((boundaryFeature) => {
        const code = extractProvinceCode(boundaryFeature.properties.shapeISO);
        return {
          type: 'Feature',
          geometry: boundaryFeature.geometry,
          properties: {
            id: code || '',
            code: code || '',
            name: boundaryFeature.properties.shapeName || '',
            geoint_score: 0,
            search_index: 0,
            trend_score: 0,
            trend_direction: 'stable',
            has_data: false,
            population: 0,
            region: '',
          },
        };
      }),
    };
  }

  const { byCode, byName } = buildProvinceScoreLookup(apiGeoJson.features);

  const mergedFeatures = boundaries.features.map((boundaryFeature) => {
    const code = extractProvinceCode(boundaryFeature.properties.shapeISO);
    const boundaryName = normalizeTurkish(boundaryFeature.properties.shapeName);

    // Match by code first, then by name
    const scoreProps = (code && byCode[code]) || byName[boundaryName] || null;

    return {
      type: 'Feature',
      geometry: boundaryFeature.geometry,
      properties: scoreProps
        ? { ...scoreProps, name: scoreProps.name || boundaryFeature.properties.shapeName }
        : {
            id: code || '',
            code: code || '',
            name: boundaryFeature.properties.shapeName || '',
            geoint_score: 0,
            search_index: 0,
            trend_score: 0,
            trend_direction: 'stable',
            has_data: false,
            population: 0,
            region: '',
          },
    };
  });

  return {
    type: 'FeatureCollection',
    features: mergedFeatures,
    metadata: apiGeoJson.metadata || {},
  };
}

/**
 * Compute a rough centroid from a GeoJSON geometry (Polygon or MultiPolygon).
 * Uses the first ring of the first polygon to approximate the center.
 * This avoids pulling in a full geometry library on the client.
 */
function approximateCentroid(geometry) {
  if (!geometry || !geometry.coordinates) return null;

  let ring;
  if (geometry.type === 'Polygon') {
    ring = geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon') {
    ring = geometry.coordinates[0]?.[0];
  }

  if (!ring || ring.length === 0) return null;

  let sumLng = 0;
  let sumLat = 0;
  for (const [lng, lat] of ring) {
    sumLng += lng;
    sumLat += lat;
  }
  return [sumLng / ring.length, sumLat / ring.length];
}

/**
 * Rough point-in-polygon test using ray-casting on the outer ring
 * of a GeoJSON Polygon or the largest ring of a MultiPolygon.
 * Sufficient for filtering districts into their parent province.
 */
function pointInPolygonFeature(point, provinceFeature) {
  if (!point || !provinceFeature || !provinceFeature.geometry) return false;

  const [px, py] = point;
  const geom = provinceFeature.geometry;

  let rings;
  if (geom.type === 'Polygon') {
    rings = [geom.coordinates[0]];
  } else if (geom.type === 'MultiPolygon') {
    rings = geom.coordinates.map((poly) => poly[0]);
  } else {
    return false;
  }

  for (const ring of rings) {
    if (rayCast(px, py, ring)) return true;
  }
  return false;
}

function rayCast(px, py, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];

    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Merge district score data from the API into static district boundaries.
 *
 * Uses a two-pass strategy to reliably select the correct boundary
 * features for each district:
 *
 * 1. **Spatial filter**: If a province boundary is available, test each
 *    static district feature's centroid against the province polygon.
 *    This correctly disambiguates districts that share the same name
 *    across different provinces (e.g. "Kale" in Denizli vs Malatya).
 *
 * 2. **Name match**: Within the spatially-filtered set, match each
 *    district to its API score data by normalized Turkish name.
 *
 * Districts that exist in the API response but have no boundary match
 * fall back to the API-provided geometry (which may be a bounding box).
 */
export async function mergeDistrictBoundaries(apiGeoJson, provinceCode) {
  const districtBounds = await loadDistrictBoundaries();
  const provinceBounds = await loadProvinceBoundaries();

  if (!districtBounds) {
    return apiGeoJson;
  }

  if (!apiGeoJson || !apiGeoJson.features || apiGeoJson.features.length === 0) {
    return apiGeoJson;
  }

  const districtScoreLookup = buildDistrictScoreLookup(apiGeoJson.features);
  const apiDistrictNames = new Set(
    apiGeoJson.features.map((f) => normalizeTurkish(f.properties?.name))
  );

  // Resolve the province boundary for spatial filtering.
  // provinceCode can be a 2-digit plate code ("63") or a UUID from the DB.
  let provinceFeature = null;
  if (provinceBounds && provinceCode) {
    if (provinceCode.length <= 3) {
      const paddedCode = provinceCode.padStart(2, '0');
      provinceFeature = provinceBounds.features.find((f) => {
        const code = extractProvinceCode(f.properties.shapeISO);
        return code === paddedCode;
      });
    }

    // If provinceCode was a UUID (or code lookup missed), try matching
    // by the province name from the first API feature's province_id link.
    if (!provinceFeature && apiGeoJson.metadata?.province_name) {
      const targetName = normalizeTurkish(apiGeoJson.metadata.province_name);
      provinceFeature = provinceBounds.features.find(
        (f) => normalizeTurkish(f.properties.shapeName) === targetName
      );
    }
  }

  // PASS 1: Spatially filter district boundaries that fall inside the province.
  let candidateDistricts;
  if (provinceFeature) {
    candidateDistricts = districtBounds.features.filter((districtFeature) => {
      const centroid = approximateCentroid(districtFeature.geometry);
      return centroid && pointInPolygonFeature(centroid, provinceFeature);
    });
  } else {
    // No province boundary available: fall back to full name matching
    candidateDistricts = districtBounds.features;
  }

  // PASS 2: Match spatially-filtered districts to API data by name.
  const matchedFeatures = [];
  const matchedNames = new Set();

  for (const districtFeature of candidateDistricts) {
    const distName = normalizeTurkish(districtFeature.properties.shapeName);

    if (apiDistrictNames.has(distName)) {
      const scoreProps = districtScoreLookup[distName];
      matchedNames.add(distName);

      matchedFeatures.push({
        type: 'Feature',
        geometry: districtFeature.geometry,
        properties: scoreProps
          ? { ...scoreProps, name: scoreProps.name || districtFeature.properties.shapeName }
          : {
              id: '',
              code: '',
              name: districtFeature.properties.shapeName || '',
              geoint_score: 0,
              search_index: 0,
              trend_direction: 'stable',
              has_data: false,
              population: 0,
            },
      });
    }
  }

  // PASS 3: Any API districts not matched to a boundary get the API geometry
  // as a fallback (ensures every district appears on the map even if the
  // static GeoJSON boundary is somehow missing).
  for (const apiFeature of apiGeoJson.features) {
    const apiName = normalizeTurkish(apiFeature.properties?.name);
    if (!matchedNames.has(apiName) && apiFeature.geometry) {
      matchedFeatures.push({
        type: 'Feature',
        geometry: apiFeature.geometry,
        properties: apiFeature.properties,
      });
    }
  }

  if (matchedFeatures.length > 0) {
    return {
      type: 'FeatureCollection',
      features: matchedFeatures,
      metadata: apiGeoJson.metadata || {},
    };
  }

  // Fallback: return API data if no boundary matches found
  return apiGeoJson;
}
