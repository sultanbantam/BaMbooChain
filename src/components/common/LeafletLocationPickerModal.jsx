import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Navigation, X, Check, Loader2, Compass } from 'lucide-react';
import { globalLocations, getAllLocationPins } from '../../utils/locationData';

// Fix for default Leaflet marker icons in React
const pinIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to handle clicks on the map
function MapEvents({ onLocationClick }) {
  useMapEvents({
    click(e) {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Helper component to programmatically pan/zoom map
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 14, { duration: 1 });
      setTimeout(() => map.invalidateSize(), 150);
    }
  }, [center, zoom, map]);
  return null;
}

// Helper component to trigger invalidateSize when map mounts in modal
function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function LeafletLocationPickerModal({
  isOpen,
  onClose,
  initialCoords = null,
  onSelectLocation
}) {
  // Parse initial coordinates if provided (e.g. "-6.6370, 106.2090")
  const parseInitial = () => {
    if (initialCoords) {
      if (typeof initialCoords === 'string') {
        const match = initialCoords.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
        if (match) {
          return [parseFloat(match[1]), parseFloat(match[2])];
        }
      } else if (Array.isArray(initialCoords) && initialCoords.length >= 2) {
        return [parseFloat(initialCoords[0]), parseFloat(initialCoords[1])];
      }
    }
    // Default to Kasepuhan Cibarani / Banten
    return [-6.6370, 106.2090];
  };

  const [position, setPosition] = useState(parseInitial);
  const [mapCenter, setMapCenter] = useState(parseInitial);
  const [mapZoom, setMapZoom] = useState(13);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // Responsive mobile detector
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      const init = parseInitial();
      setPosition(init);
      setMapCenter(init);
      setSearchQuery('');
      setSearchResults([]);
      setGpsError(null);
    }
  }, [isOpen, initialCoords]);

  // Search logic (Preset locations + OpenStreetMap Nominatim with debouncing)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const q = searchQuery.toLowerCase().trim();

      // 1. Check local presets first (0ms latency)
      const allPins = getAllLocationPins();
      const localMatches = allPins
        .filter(p => p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)))
        .map(p => ({
          name: p.name,
          lat: p.lat,
          lng: p.lng,
          source: 'Preset Eco-Location'
        }));

      // 2. Fetch from Nominatim OpenStreetMap (Indonesia prioritized)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=id&limit=5&addressdetails=1`, {
          headers: { 'Accept-Language': 'id,en' }
        });
        if (res.ok) {
          const data = await res.json();
          const remoteMatches = data.map(item => ({
            name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            source: 'OpenStreetMap'
          }));

          // Merge without duplicates
          const combined = [...localMatches];
          remoteMatches.forEach(rm => {
            if (!combined.some(c => Math.abs(c.lat - rm.lat) < 0.001 && Math.abs(c.lng - rm.lng) < 0.001)) {
              combined.push(rm);
            }
          });
          setSearchResults(combined.slice(0, 6));
        } else {
          setSearchResults(localMatches);
        }
      } catch (err) {
        setSearchResults(localMatches);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (result) => {
    const newPos = [result.lat, result.lng];
    setPosition(newPos);
    setMapCenter(newPos);
    setMapZoom(15);
    setSelectedAddress(result.name);
    setSearchQuery(result.name.split(',')[0]);
    setSearchResults([]);
  };

  const handleMapClick = (lat, lng) => {
    const newPos = [parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))];
    setPosition(newPos);
    setGpsError(null);
  };

  // Trigger device GPS
  const handleDetectDeviceGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser atau perangkat ini tidak mendukung sensor GPS.');
      return;
    }
    setIsGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        const newPos = [lat, lng];
        setPosition(newPos);
        setMapCenter(newPos);
        setMapZoom(16);
        setSelectedAddress('Lokasi GPS HP Terkini');
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsError(`Gagal membaca GPS: ${err.message}. Pastikan izin lokasi aktif.`);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
    );
  };

  const handleConfirm = () => {
    if (position && position.length >= 2) {
      const lat = position[0].toFixed(5);
      const lng = position[1].toFixed(5);
      const coordString = `${lat}, ${lng}`;
      if (onSelectLocation) {
        onSelectLocation(lat, lng, coordString, selectedAddress);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 100000,
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      padding: isMobile ? 0 : '20px'
    }}>
      <div style={{
        background: 'white',
        width: '100%',
        maxWidth: '720px',
        height: isMobile ? '92vh' : 'auto',
        maxHeight: isMobile ? '92vh' : '88vh',
        borderRadius: isMobile ? '24px 24px 0 0' : '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        border: '1px solid #dee2e6'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: isMobile ? '14px 18px' : '18px 24px',
          borderBottom: '1px solid #f1f3f5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff',
          flexShrink: 0
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: isMobile ? '1.05rem' : '1.25rem', fontWeight: '800', color: '#212529', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="#0ca678" /> Pilih Titik Lokasi GPS
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#6c757d' }}>
              Ketik lokasi atau klik langsung di peta untuk menetapkan koordinat
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f8f9fa',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#495057'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar & GPS HP Action Controls */}
        <div style={{ padding: isMobile ? '12px 14px' : '14px 24px', background: '#f8f9fa', borderBottom: '1px solid #e9ecef', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Ketik nama desa, jalan, kecamatan, kota..."
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #ced4da',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
              />
              {isSearching ? (
                <Loader2 size={16} className="animate-spin" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0ca678' }} />
              ) : searchQuery ? (
                <button
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#adb5bd' }}
                >
                  <X size={15} />
                </button>
              ) : null}

              {/* Autocomplete Suggestion Dropdown */}
              {searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '6px',
                  background: 'white',
                  borderRadius: '14px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                  border: '1px solid #dee2e6',
                  zIndex: 99999,
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}>
                  {searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSearchResult(res)}
                      style={{
                        padding: '10px 14px',
                        cursor: 'pointer',
                        borderBottom: idx < searchResults.length - 1 ? '1px solid #f1f3f5' : 'none',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#212529', lineHeight: 1.3 }}>
                        {res.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#0ca678', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>📍 {res.lat.toFixed(5)}, {res.lng.toFixed(5)}</span>
                        <span style={{ color: '#868e96' }}>{res.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GPS HP Button */}
            <button
              type="button"
              onClick={handleDetectDeviceGps}
              disabled={isGpsLoading}
              style={{
                background: '#e6fcf5',
                color: '#0ca678',
                border: '1.5px solid #63e6be',
                borderRadius: '12px',
                padding: '9px 14px',
                fontWeight: 'bold',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="Gunakan sensor GPS smartphone Anda"
            >
              {isGpsLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={15} />}
              <span>{isMobile ? 'GPS HP' : 'Deteksi GPS HP'}</span>
            </button>
          </div>

          {gpsError && (
            <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#e03131', background: '#fff5f5', padding: '4px 8px', borderRadius: '6px' }}>
              ⚠️ {gpsError}
            </div>
          )}
        </div>

        {/* Leaflet Map Interactive Container */}
        <div style={{ flex: 1, position: 'relative', minHeight: isMobile ? '280px' : '360px', width: '100%', background: '#e9ecef' }}>
          <MapContainer
            center={position}
            zoom={mapZoom}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <MapInvalidator />
            <MapEvents onLocationClick={handleMapClick} />
            
            {position && (
              <Marker
                position={position}
                icon={pinIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    handleMapClick(pos.lat, pos.lng);
                  }
                }}
              >
                <Popup>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                    <strong style={{ color: '#0ca678' }}>Titik Koordinat Terpilih</strong><br/>
                    <span>Lat: {position[0].toFixed(5)}</span><br/>
                    <span>Lng: {position[1].toFixed(5)}</span>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Map Overlay Helper Prompt */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(33, 37, 41, 0.85)',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            pointerEvents: 'none',
            zIndex: 1000,
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            👆 Klik di mana saja pada peta untuk menggeser pin
          </div>
        </div>

        {/* Modal Footer / Selected Coordinates Display */}
        <div style={{
          padding: isMobile ? '12px 16px' : '16px 24px',
          borderTop: '1px solid #f1f3f5',
          background: 'white',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: '12px',
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#868e96', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Koordinat Terpilih:
            </div>
            <div style={{ fontSize: isMobile ? '0.92rem' : '1.02rem', fontWeight: '800', color: '#0ca678' }}>
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </div>
            {selectedAddress && (
              <div style={{ fontSize: '0.72rem', color: '#495057', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '300px' : '380px' }}>
                {selectedAddress}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: isMobile ? 1 : 'none',
                padding: '10px 18px',
                border: '1px solid #dee2e6',
                background: '#f8f9fa',
                color: '#495057',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                flex: isMobile ? 2 : 'none',
                padding: '10px 22px',
                border: 'none',
                background: '#0ca678',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(12,166,120,0.3)'
              }}
            >
              <Check size={16} /> Terapkan Koordinat Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
