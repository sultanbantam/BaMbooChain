/**
 * BOOMBOOM GEOCODING & REALISTIC ROUTE ENGINE
 * Menghitung jarak rute nyata dan titik koordinat akurat
 */

import { calculateHaversineDistance } from './mapAdapter';

// Kamus titik koordinat wilayah penting (Jabodetabek, Jawa Barat, Banten, dsb)
export const PRESET_COORDINATES = {
  // Jakarta Timur & sekitarnya
  'pondok kelapa': { lat: -6.2372, lng: 106.9408, label: 'Pondok Kelapa, Duren Sawit, Jakarta Timur' },
  'duren sawit': { lat: -6.2345, lng: 106.9156, label: 'Duren Sawit, Jakarta Timur' },
  'villa mutiara': { lat: -6.2372, lng: 106.9408, label: 'Villa Mutiara, Pondok Kelapa, Jakarta Timur' },
  'manggar': { lat: -6.2372, lng: 106.9408, label: 'Jl. Manggar, Pondok Kelapa, Jakarta Timur' },
  'cakung': { lat: -6.1950, lng: 106.9489, label: 'Cakung, Jakarta Timur' },
  'rawamangun': { lat: -6.1945, lng: 106.8856, label: 'Rawamangun, Jakarta Timur' },

  // Tangerang Selatan & Banten
  'balaikota tangerang selatan': { lat: -6.2941, lng: 106.7029, label: 'Balaikota Tangerang Selatan, Pamulang' },
  'tangerang selatan': { lat: -6.2941, lng: 106.7029, label: 'Tangerang Selatan, Banten' },
  'tangsel': { lat: -6.2941, lng: 106.7029, label: 'Tangerang Selatan, Banten' },
  'pamulang': { lat: -6.3429, lng: 106.7381, label: 'Pamulang, Tangerang Selatan' },
  'bsd': { lat: -6.3016, lng: 106.6534, label: 'BSD City, Serpong, Tangerang Selatan' },
  'serpong': { lat: -6.3016, lng: 106.6534, label: 'Serpong, Tangerang Selatan' },
  'bintaro': { lat: -6.2842, lng: 106.7262, label: 'Bintaro Jaya, Tangerang Selatan' },
  'ciputat': { lat: -6.3117, lng: 106.7467, label: 'Ciputat, Tangerang Selatan' },
  'tangerang': { lat: -6.1783, lng: 106.6319, label: 'Kota Tangerang' },

  // Jakarta lainnya
  'monas': { lat: -6.1754, lng: 106.8272, label: 'Monas, Gambir, Jakarta Pusat' },
  'jakarta pusat': { lat: -6.1754, lng: 106.8272, label: 'Jakarta Pusat' },
  'jakarta selatan': { lat: -6.2615, lng: 106.8106, label: 'Kebayoran Baru, Jakarta Selatan' },
  'blok m': { lat: -6.2443, lng: 106.7974, label: 'Blok M, Jakarta Selatan' },
  'bekasi': { lat: -6.2383, lng: 106.9756, label: 'Kota Bekasi' },
  'depok': { lat: -6.4025, lng: 106.7942, label: 'Kota Depok' },
  'bogor': { lat: -6.5971, lng: 106.7949, label: 'Kota Bogor' },

  // Subang & Kasepuhan Cibarani
  'sentra bibit bambu cibarani': { lat: -6.6521, lng: 107.6932, label: 'Sentra Bibit Bambu Cibarani, Subang' },
  'cibarani': { lat: -6.6521, lng: 107.6932, label: 'Kasepuhan Cibarani, Subang' },
  'pasar desa cibarani': { lat: -6.6850, lng: 107.7200, label: 'Pasar Desa Cibarani, Subang' },
  'subang': { lat: -6.5674, lng: 107.7600, label: 'Subang Kota, Jawa Barat' },
  'ciater': { lat: -6.7410, lng: 107.6539, label: 'Pemandian Air Panas Ciater, Subang' },
  'lembang': { lat: -6.8168, lng: 107.6180, label: 'Lembang, Bandung Barat' },
  'bandung': { lat: -6.9175, lng: 107.6191, label: 'Bandung Kota, Jawa Barat' },
  'garut': { lat: -7.2278, lng: 107.9087, label: 'Garut Kota, Jawa Barat' }
};

/**
 * Mencari titik koordinat berdasarkan teks alamat
 */
export async function geocodeLocation(addressText) {
  if (!addressText || typeof addressText !== 'string') {
    return { lat: -6.6521, lng: 107.6932, label: 'Sentra Bibit Bambu Cibarani' };
  }

  const queryLower = addressText.toLowerCase().trim();

  // 1. Cek kamus preset offline
  for (const [key, val] of Object.entries(PRESET_COORDINATES)) {
    if (queryLower.includes(key)) {
      return { lat: val.lat, lng: val.lng, label: val.label, source: 'preset' };
    }
  }

  // 2. Fetch ke Nominatim OpenStreetMap API (Free, akurat di Indonesia)
  try {
    const cleanQuery = addressText
      .replace(/kav.|blok|rt.|rw.|no.|jl.|jalan/gi, ' ')
      .replace(/s+/g, ' ')
      .trim();

    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=id&limit=1&q=${encodeURIComponent(cleanQuery)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'id,en',
        'User-Agent': 'BaMbooChain-BoomBoom-Mobility/1.0'
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
    console.warn('[BoomBoom Geocode] Menggunakan fallback kalkulasi cerdas:', err);
  }

  // 3. Fallback estimasi cerdas jika query menyebut kota/wilayah tertentu
  if (queryLower.includes('tangerang') || queryLower.includes('tangsel') || queryLower.includes('pamulang')) {
    return { lat: -6.2941, lng: 106.7029, label: addressText, source: 'fallback_tangsel' };
  }
  if (queryLower.includes('kelapa') || queryLower.includes('duren') || queryLower.includes('sawit') || queryLower.includes('jakarta')) {
    return { lat: -6.2372, lng: 106.9408, label: addressText, source: 'fallback_jaktim' };
  }
  if (queryLower.includes('cibarani') || queryLower.includes('subang')) {
    return { lat: -6.6521, lng: 107.6932, label: addressText, source: 'fallback_subang' };
  }

  return { lat: -6.2000, lng: 106.8166, label: addressText, source: 'fallback_general' };
}

/**
 * Menghitung jarak jalan riil (Road Distance) dengan faktor liku jalan Indonesia (1.35x)
 */
export function calculateRealisticRoadDistance(coord1, coord2) {
  if (!coord1 || !coord2) return 4.5;
  const straightLine = calculateHaversineDistance(coord1.lat, coord1.lng, coord2.lat, coord2.lng);

  // Jika jarak sangat dekat (< 1 km)
  if (straightLine < 1.0) {
    return Math.max(0.8, Number((straightLine * 1.15).toFixed(1)));
  }

  // Faktor jalan perkotaan/pedesaan di Indonesia rata-rata 1.30 - 1.40x jarak garis lurus
  const roadFactor = 1.35;
  const roadDistance = straightLine * roadFactor;
  return Number(roadDistance.toFixed(1));
}

/**
 * Menghitung estimasi durasi perjalanan jalan raya
 */
export function calculateRealisticEta(distanceKm, serviceType = 'BoomRide') {
  // Kecepatan rata-rata motor 30-35 km/jam, mobil 25-30 km/jam
  const avgSpeed = serviceType === 'BoomCar' ? 28 : 32;
  const hours = distanceKm / avgSpeed;
  const minutes = Math.ceil(hours * 60) + 5; // buffer 5 menit lampu merah / rute
  return Math.max(5, minutes);
}

/**
 * Reverse geocode dari koordinat GPS HP
 */
export async function reverseGeocodeCoords(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'id,en',
        'User-Agent': 'BaMbooChain-BoomBoom-Mobility/1.0'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    }
  } catch (err) {
    console.warn('[BoomBoom ReverseGeocode] Fallback GPS address:', err);
  }

  return `Titik Lokasi GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}
