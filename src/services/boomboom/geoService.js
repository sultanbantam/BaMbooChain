/**
 * BOOMBOOM GEOCODING & REALISTIC OSRM ROAD ROUTE ENGINE
 * Menghitung jarak jalan raya nyata (OSRM), rute polyline jalan, dan titik koordinat akurat
 */

import { calculateHaversineDistance } from './mapAdapter';

// Kamus titik landmark spesifik (Bukan nama kota umum agar tidak menimpa alamat jalan spesifik)
export const SPECIFIC_LANDMARKS = {
  // Tangerang Selatan — Stasiun, Balaikota & Landmark Spesifik
  'balaikota tangerang selatan': { lat: -6.3198, lng: 106.7069, label: 'Balaikota Tangerang Selatan, Jl. Maruga Raya, Ciputat' },
  'balaikota tangsel': { lat: -6.3198, lng: 106.7069, label: 'Balaikota Tangerang Selatan, Ciputat' },
  'jalan benda raya': { lat: -6.3225, lng: 106.7082, label: 'Jl. Benda Raya, Pamulang / Ciputat, Tangerang Selatan' },
  'benda raya': { lat: -6.3225, lng: 106.7082, label: 'Jl. Benda Raya, Tangerang Selatan' },
  'stasiun sudimara': { lat: -6.2966, lng: 106.7128, label: 'Stasiun Sudimara, Jombang, Ciputat, Tangerang Selatan' },
  'sudimara': { lat: -6.2966, lng: 106.7128, label: 'Stasiun Sudimara, Ciputat, Tangerang Selatan' },
  'stasiun jurangmangu': { lat: -6.2882, lng: 106.7292, label: 'Stasiun Jurangmangu, Bintaro, Tangerang Selatan' },
  'stasiun rawa buntu': { lat: -6.3149, lng: 106.6761, label: 'Stasiun Rawa Buntu, BSD, Tangerang Selatan' },
  'stasiun serpong': { lat: -6.3202, lng: 106.6634, label: 'Stasiun Serpong, Tangerang Selatan' },
  'stasiun pondok ranji': { lat: -6.2769, lng: 106.7445, label: 'Stasiun Pondok Ranji, Ciputat Timur, Tangerang Selatan' },
  'stasiun cisauk': { lat: -6.3250, lng: 106.6411, label: 'Stasiun Cisauk, Tangerang' },
  'bsd city': { lat: -6.3016, lng: 106.6534, label: 'BSD City, Serpong, Tangerang Selatan' },
  'bintaro jaya': { lat: -6.2842, lng: 106.7262, label: 'Bintaro Jaya, Tangerang Selatan' },
  'alun alun pamulang': { lat: -6.3429, lng: 106.7381, label: 'Alun-Alun Pamulang, Tangerang Selatan' },

  // Jakarta Timur & sekitarnya
  'villa mutiara': { lat: -6.2372, lng: 106.9408, label: 'Villa Mutiara, Pondok Kelapa, Jakarta Timur' },
  'pondok kelapa': { lat: -6.2372, lng: 106.9408, label: 'Pondok Kelapa, Duren Sawit, Jakarta Timur' },
  'duren sawit': { lat: -6.2345, lng: 106.9156, label: 'Duren Sawit, Jakarta Timur' },
  'rawamangun': { lat: -6.1945, lng: 106.8856, label: 'Rawamangun, Jakarta Timur' },
  'monas': { lat: -6.1754, lng: 106.8272, label: 'Monas, Gambir, Jakarta Pusat' },
  'blok m': { lat: -6.2443, lng: 106.7974, label: 'Blok M, Jakarta Selatan' },

  // Subang & Kasepuhan Cibarani
  'sentra bibit bambu cibarani': { lat: -6.6521, lng: 107.6932, label: 'Sentra Bibit Bambu Cibarani, Subang' },
  'pasar desa cibarani': { lat: -6.6850, lng: 107.7200, label: 'Pasar Desa Cibarani, Subang' },
  'kasepuhan cibarani': { lat: -6.6521, lng: 107.6932, label: 'Kasepuhan Cibarani, Subang' },
  'stasiun kereta cisadane': { lat: -6.5971, lng: 106.7996, label: 'Stasiun Kereta Cisadane, Bogor' },
  'kawasan wisata hutan bambu': { lat: -6.6312, lng: 106.8350, label: 'Kawasan Wisata Hutan Bambu' },
  'pemandian air panas ciater': { lat: -6.7410, lng: 107.6539, label: 'Pemandian Air Panas Ciater, Subang' },
  'ciater': { lat: -6.7410, lng: 107.6539, label: 'Ciater, Subang' }
};

// Fallback hanya jika API online gagal dan tidak ada landmark spesifik
const CITY_FALLBACKS = {
  'pamulang': { lat: -6.3429, lng: 106.7381, label: 'Pamulang, Tangerang Selatan' },
  'ciputat': { lat: -6.3117, lng: 106.7467, label: 'Ciputat, Tangerang Selatan' },
  'serpong': { lat: -6.3016, lng: 106.6534, label: 'Serpong, Tangerang Selatan' },
  'tangerang selatan': { lat: -6.2941, lng: 106.7029, label: 'Tangerang Selatan, Banten' },
  'tangsel': { lat: -6.2941, lng: 106.7029, label: 'Tangerang Selatan, Banten' },
  'tangerang': { lat: -6.1783, lng: 106.6319, label: 'Kota Tangerang' },
  'jakarta timur': { lat: -6.2250, lng: 106.9004, label: 'Jakarta Timur' },
  'jakarta selatan': { lat: -6.2615, lng: 106.8106, label: 'Jakarta Selatan' },
  'jakarta pusat': { lat: -6.1754, lng: 106.8272, label: 'Jakarta Pusat' },
  'bekasi': { lat: -6.2383, lng: 106.9756, label: 'Kota Bekasi' },
  'depok': { lat: -6.4025, lng: 106.7942, label: 'Kota Depok' },
  'bogor': { lat: -6.5971, lng: 106.7949, label: 'Kota Bogor' },
  'cibarani': { lat: -6.6521, lng: 107.6932, label: 'Cibarani, Subang' },
  'subang': { lat: -6.5674, lng: 107.7600, label: 'Subang, Jawa Barat' },
  'lembang': { lat: -6.8168, lng: 107.6180, label: 'Lembang, Bandung Barat' },
  'bandung': { lat: -6.9175, lng: 107.6191, label: 'Kota Bandung' },
  'garut': { lat: -7.2278, lng: 107.9087, label: 'Garut, Jawa Barat' }
};

export const PRESET_COORDINATES = {
  ...SPECIFIC_LANDMARKS
};

// Normalisasi singkatan populer di Indonesia agar mesin pencari peta akurat
function normalizeIndonesianAddress(rawText) {
  return (rawText || '')
    .replace(/\btangsel\b/gi, 'Tangerang Selatan')
    .replace(/\bjaktim\b/gi, 'Jakarta Timur')
    .replace(/\bjaksel\b/gi, 'Jakarta Selatan')
    .replace(/\bjakpus\b/gi, 'Jakarta Pusat')
    .replace(/\bjakbar\b/gi, 'Jakarta Barat')
    .replace(/\bjakut\b/gi, 'Jakarta Utara')
    .replace(/\bjl\.?\b/gi, 'Jalan ')
    .replace(/\bst\.?\b/gi, 'Stasiun ')
    .replace(/\bno\.?\s*\d+/gi, ' ')
    .replace(/\bkav\.?\s*\d+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Mencari titik koordinat berdasarkan teks alamat dengan akurasi tinggi
 */
export async function geocodeLocation(addressText) {
  if (!addressText || typeof addressText !== 'string') {
    return { lat: -6.6521, lng: 107.6932, label: 'Sentra Bibit Bambu Cibarani' };
  }

  const queryLower = addressText.toLowerCase().trim();

  // 0. Jika format string mengandung koordinat langsung "(lat, lng)"
  const coordMatch = addressText.match(/\((-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\)/);
  if (coordMatch) {
    return {
      lat: parseFloat(coordMatch[1]),
      lng: parseFloat(coordMatch[2]),
      label: addressText,
      source: 'direct_coords'
    };
  }

  // 1. Cek kamus landmark spesifik (diurutkan dari frasa terpanjang agar presisi)
  const sortedSpecificKeys = Object.keys(SPECIFIC_LANDMARKS).sort((a, b) => b.length - a.length);
  for (const key of sortedSpecificKeys) {
    if (queryLower.includes(key)) {
      const val = SPECIFIC_LANDMARKS[key];
      return { lat: val.lat, lng: val.lng, label: val.label, source: 'landmark' };
    }
  }

  const normalizedQuery = normalizeIndonesianAddress(addressText);

  // 2. Fetch ke Nominatim OpenStreetMap API (Prioritas Utama)
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=id&limit=1&q=${encodeURIComponent(normalizedQuery)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'id,en'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          label: data[0].display_name,
          source: 'nominatim'
        };
      }
    }
  } catch (err) {
    console.warn('[BoomBoom Geocode] Nominatim fallback ke Photon:', err);
  }

  // 3. Jika query berformat "A, B" (mis. "balaikota tangsel, jalan benda raya"), coba geocode bagian utamanya
  if (normalizedQuery.includes(',')) {
    const parts = normalizedQuery.split(',').map(p => p.trim()).filter(Boolean);
    for (const part of parts) {
      try {
        const subUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=id&limit=1&q=${encodeURIComponent(part + ' Indonesia')}`;
        const res = await fetch(subUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            return {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
              label: data[0].display_name,
              source: 'nominatim_part'
            };
          }
        }
      } catch {
        // Lanjut ke bagian berikutnya
      }
    }
  }

  // 4. Fallback ke Photon Komoot OpenStreetMap Geocoder (Sangat cepat & bebas CORS)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(normalizedQuery)}&limit=1&lat=-6.25&lon=106.8`;
    const res = await fetch(photonUrl);
    if (res.ok) {
      const data = await res.json();
      if (data?.features?.length > 0) {
        const feat = data.features[0];
        const [lng, lat] = feat.geometry.coordinates;
        const name = feat.properties?.name || addressText;
        const city = feat.properties?.city || feat.properties?.state || '';
        return {
          lat: Number(lat),
          lng: Number(lng),
          label: city ? `${name}, ${city}` : name,
          source: 'photon'
        };
      }
    }
  } catch {
    // Abaikan jika offline
  }

  // 5. Fallback ke kamus kota + offset deterministik berdasarkan hash teks agar 2 alamat berbeda di kota yang sama tidak bertumpuk di titik 0.0 km!
  const sortedCityKeys = Object.keys(CITY_FALLBACKS).sort((a, b) => b.length - a.length);
  for (const key of sortedCityKeys) {
    if (queryLower.includes(key)) {
      const base = CITY_FALLBACKS[key];
      let hash = 0;
      for (let i = 0; i < queryLower.length; i++) {
        hash = (hash * 31 + queryLower.charCodeAt(i)) % 1000;
      }
      const latOffset = ((hash % 40) - 20) * 0.0008;
      const lngOffset = (((hash >> 3) % 40) - 20) * 0.0008;
      return {
        lat: Number((base.lat + latOffset).toFixed(5)),
        lng: Number((base.lng + lngOffset).toFixed(5)),
        label: addressText,
        source: 'city_fallback'
      };
    }
  }

  return { lat: -6.3016, lng: 106.7029, label: addressText, source: 'fallback_general' };
}

/**
 * Menghitung rute jalan raya sesungguhnya menggunakan OSRM (Open Source Routing Machine)
 * Mengembalikan jarak (km), durasi (menit), dan array koordinat polyline jalan raya
 */
export async function fetchOsrmRoadRoute(coord1, coord2, serviceType = 'BoomRide') {
  if (!coord1 || !coord2) {
    return {
      distanceKm: 4.5,
      durationMin: 12,
      routeGeometry: [
        [-6.6521, 107.6932],
        [-6.6850, 107.7200]
      ]
    };
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${coord1.lng},${coord1.lat};${coord2.lng},${coord2.lat}?overview=full&geometries=geojson`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.routes?.length > 0) {
        const route = data.routes[0];
        const distanceKm = Math.max(0.8, Number((route.distance / 1000).toFixed(1)));
        const durationMin = calculateRealisticEta(distanceKm, serviceType);
        const coords = route.geometry?.coordinates || [];
        const routeGeometry = coords.map(([lng, lat]) => [lat, lng]);

        if (routeGeometry.length >= 2) {
          return {
            distanceKm,
            durationMin,
            routeGeometry,
            source: 'osrm'
          };
        }
      }
    }
  } catch (err) {
    console.warn('[BoomBoom OSRM] Fallback ke kalkulasi kurva jalan:', err);
  }

  // Fallback jika OSRM sedang sibuk / offline: buat kurva jalan realistis
  const distanceKm = calculateRealisticRoadDistance(coord1, coord2);
  const durationMin = calculateRealisticEta(distanceKm, serviceType);
  const midLat = (coord1.lat + coord2.lat) / 2 + (coord2.lng - coord1.lng) * 0.12;
  const midLng = (coord1.lng + coord2.lng) / 2 - (coord2.lat - coord1.lat) * 0.12;

  return {
    distanceKm,
    durationMin,
    routeGeometry: [
      [coord1.lat, coord1.lng],
      [midLat, midLng],
      [coord2.lat, coord2.lng]
    ],
    source: 'fallback_curve'
  };
}

/**
 * Menghitung jarak jalan riil (Road Distance) dengan faktor liku jalan Indonesia (1.35x)
 */
export function calculateRealisticRoadDistance(coord1, coord2) {
  if (!coord1 || !coord2) return 4.5;
  const straightLine = calculateHaversineDistance(coord1.lat, coord1.lng, coord2.lat, coord2.lng);

  if (straightLine < 0.15) {
    return 0.8;
  }
  if (straightLine < 1.0) {
    return Math.max(0.8, Number((straightLine * 1.3).toFixed(1)));
  }

  const roadFactor = 1.35;
  const roadDistance = straightLine * roadFactor;
  return Number(roadDistance.toFixed(1));
}

/**
 * Menghitung estimasi durasi perjalanan jalan raya
 */
export function calculateRealisticEta(distanceKm, serviceType = 'BoomRide') {
  const avgSpeed = serviceType === 'BoomCar' ? 26 : 32;
  const hours = distanceKm / avgSpeed;
  const minutes = Math.ceil(hours * 60) + 4;
  return Math.max(5, minutes);
}

/**
 * Reverse geocode dari koordinat GPS HP / Klik Peta
 */
export async function reverseGeocodeCoords(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'id,en'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        return data.display_name.split(',').slice(0, 4).join(',');
      }
    }
  } catch (err) {
    console.warn('[BoomBoom ReverseGeocode] Fallback GPS address:', err);
  }

  return `Titik Peta (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}
