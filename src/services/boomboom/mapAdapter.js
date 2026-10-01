/**
 * BOOMBOOM MAP ADAPTER ABSTRACTION
 * Supports Google Maps, Mapbox, and OpenStreetMap (Leaflet)
 * Key-safe, environment variable driven.
 */

export const MAP_PROVIDERS = {
  OSM: 'OpenStreetMap',
  GOOGLE: 'GoogleMaps',
  MAPBOX: 'Mapbox'
};

export const DEFAULT_MAP_CONFIG = {
  provider: import.meta.env.VITE_MAP_PROVIDER || MAP_PROVIDERS.OSM,
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  mapboxToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  defaultZoom: 14,
  center: {
    lat: -6.6521,
    lng: 107.6932 // Subang Cibarani center
  }
};

/**
 * Calculates distance in KM using Haversine formula
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(2));
}

/**
 * Estimates Travel Time in Minutes based on service type & distance
 */
export function calculateEstimatedEta(distanceKm, serviceType = 'BoomRide') {
  const avgSpeedKmH = serviceType === 'BoomRide' ? 30 : 25; // Rural speed average
  const hours = distanceKm / avgSpeedKmH;
  const minutes = Math.max(3, Math.ceil(hours * 60));
  return minutes;
}
