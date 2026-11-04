import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { Navigation, MapPin, RefreshCw, ZoomIn, ZoomOut, Check } from 'lucide-react';

const MapViewComponent = ({
  height = '360px',
  showNearbyDrivers = true,
  interactiveBooking = true,
  trackingDriver = null
}) => {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const driverMarkersRef = useRef([]);

  const { activeBooking, drivers, setPickup } = useBoomBoomStore();
  const [mapReady, setMapReady] = useState(false);
  const [isRelocating, setIsRelocating] = useState(false);

  const pickupCoords = activeBooking.pickupCoords || { lat: -6.6521, lng: 107.6932 };
  const destCoords = activeBooking.destinationCoords || { lat: -6.6850, lng: 107.7200 };

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [pickupCoords.lat, pickupCoords.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Event klik peta untuk konfirmasi / ubah titik penjemputan
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setPickup(`Titik Peta (${lat.toFixed(4)}, ${lng.toFixed(4)})`, { lat, lng });
      });

      leafletMapRef.current = map;
      setMapReady(true);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Sinkronisasi Marker & Bounds saat Koordinat Jemput / Tujuan Berubah
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // 1. Marker Titik Jemput (Green Pin)
    const pickupHtml = `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:#065f46; color:#ffffff; font-size:11px; font-weight:800; padding:3px 8px; border-radius:10px; border:1.5px solid #34d399; box-shadow:0 4px 10px rgba(0,0,0,0.3); white-space:nowrap; margin-bottom:3px; max-width:180px; overflow:hidden; text-overflow:ellipsis;">
          📍 Jemput: ${activeBooking.pickupAddress ? activeBooking.pickupAddress.split(',')[0] : 'Lokasi Jemput'}
        </div>
        <div style="width:18px; height:18px; background:#10b981; border:3px solid #ffffff; border-radius:50%; box-shadow:0 0 10px #10b981;"></div>
      </div>
    `;
    const pickupIcon = L.divIcon({ html: pickupHtml, className: 'boomboom-pickup-pin', iconSize: [0, 0] });

    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setLatLng([pickupCoords.lat, pickupCoords.lng]);
      pickupMarkerRef.current.setIcon(pickupIcon);
    } else {
      pickupMarkerRef.current = L.marker([pickupCoords.lat, pickupCoords.lng], {
        icon: pickupIcon,
        draggable: true
      }).addTo(map);

      pickupMarkerRef.current.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        setPickup(`Titik Geser (${lat.toFixed(4)}, ${lng.toFixed(4)})`, { lat, lng });
      });
    }

    // 2. Marker Titik Tujuan (Red / Amber Checkered Flag Pin)
    const destHtml = `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:#78350f; color:#ffffff; font-size:11px; font-weight:800; padding:3px 8px; border-radius:10px; border:1.5px solid #fbbf24; box-shadow:0 4px 10px rgba(0,0,0,0.3); white-space:nowrap; margin-bottom:3px; max-width:180px; overflow:hidden; text-overflow:ellipsis;">
          🏁 Tujuan: ${activeBooking.destinationAddress ? activeBooking.destinationAddress.split(',')[0] : 'Tujuan'}
        </div>
        <div style="width:18px; height:18px; background:#ef4444; border:3px solid #ffffff; border-radius:50%; box-shadow:0 0 10px #ef4444;"></div>
      </div>
    `;
    const destIcon = L.divIcon({ html: destHtml, className: 'boomboom-dest-pin', iconSize: [0, 0] });

    if (destMarkerRef.current) {
      destMarkerRef.current.setLatLng([destCoords.lat, destCoords.lng]);
      destMarkerRef.current.setIcon(destIcon);
    } else {
      destMarkerRef.current = L.marker([destCoords.lat, destCoords.lng], {
        icon: destIcon
      }).addTo(map);
    }

    // 3. Garis Rute Penghubung
    const latLngs = [
      [pickupCoords.lat, pickupCoords.lng],
      [destCoords.lat, destCoords.lng]
    ];

    if (routeLineRef.current) {
      routeLineRef.current.setLatLngs(latLngs);
    } else {
      routeLineRef.current = L.polyline(latLngs, {
        color: '#10b981',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
    }

    // 4. Update Driver Sekitar
    driverMarkersRef.current.forEach(m => m.remove());
    driverMarkersRef.current = [];

    if (showNearbyDrivers) {
      const activeDrivers = drivers.filter(d => d.isOnline && d.status === 'VERIFIED');
      activeDrivers.forEach((driver) => {
        const dLat = driver.currentLat || (pickupCoords.lat + (Math.random() * 0.01 - 0.005));
        const dLng = driver.currentLng || (pickupCoords.lng + (Math.random() * 0.01 - 0.005));
        const isEv = (driver.vehicle_brand || '').toLowerCase().includes('ev');
        
        const dHtml = `
          <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -50%);">
            <div style="background:#0f172a; color:#a7f3d0; font-size:10px; font-weight:800; padding:2px 6px; border-radius:8px; border:1px solid #10b981; box-shadow:0 2px 6px rgba(0,0,0,0.4); white-space:nowrap; margin-bottom:2px;">
              ${isEv ? '⚡' : '🛵'} ${driver.name.split(' ')[0]}
            </div>
            <div style="width:14px; height:14px; background:#f59f00; border:2px solid #ffffff; border-radius:50%; box-shadow:0 0 8px #f59f00;"></div>
          </div>
        `;
        const dIcon = L.divIcon({ html: dHtml, className: 'driver-pin', iconSize: [0, 0] });
        const marker = L.marker([dLat, dLng], { icon: dIcon }).addTo(map);
        driverMarkersRef.current.push(marker);
      });
    }

    // 5. RESPONSIVE FIT BOUNDS: Otomatis Menyesuaikan Tampilan Peta dengan Jarak Jemput & Tujuan
    try {
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [destCoords.lat, destCoords.lng]
      ]);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 0.8
      });
    } catch (e) {
      console.warn('Gagal fitBounds peta:', e);
    }
  }, [pickupCoords.lat, pickupCoords.lng, destCoords.lat, destCoords.lng, activeBooking.pickupAddress, activeBooking.destinationAddress, showNearbyDrivers, drivers]);

  const handleCenterPickup = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([pickupCoords.lat, pickupCoords.lng], 15, { animate: true, duration: 0.8 });
    }
  };

  const handleCenterRoute = () => {
    if (leafletMapRef.current) {
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [destCoords.lat, destCoords.lng]
      ]);
      leafletMapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      borderRadius: '24px',
      overflow: 'hidden',
      border: '2px solid var(--border-color, #cbd5e1)',
      background: '#e2e8f0',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
    }}>
      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* Floating Status & Provider Pill */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        color: '#ffffff',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.72rem',
        fontWeight: '800',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        <Navigation size={12} color="#34d399" />
        <span>Peta Responsif Real-Time (OSM)</span>
      </div>

      {/* Floating Controls for Auto-Fitting Route */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 500
      }}>
        <button
          type="button"
          onClick={handleCenterRoute}
          title="Sesuaikan Tampilan Rute Penuh"
          style={{
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
          }}
        >
          <Navigation size={13} color="#10b981" /> Rute Penuh
        </button>

        <button
          type="button"
          onClick={handleCenterPickup}
          title="Fokus ke Titik Penjemputan"
          style={{
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
          }}
        >
          <MapPin size={13} color="#059669" /> Titik Jemput
        </button>
      </div>

      {/* Floating Active Driver Count Badge */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(6px)',
        color: '#ffffff',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.72rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 500,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59f00' }} />
        <span>{drivers.filter(d => d.isOnline).length} Driver Sekitar Aktif</span>
      </div>
    </div>
  );
};

export default MapViewComponent;