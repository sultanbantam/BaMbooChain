import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { fetchOsrmRoadRoute, reverseGeocodeCoords } from '../../services/boomboom/geoService';
import { Navigation, MapPin, Flag } from 'lucide-react';

const MapViewComponent = ({
  height = '420px',
  showNearbyDrivers = true
}) => {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const routeOutlineRef = useRef(null);
  const driverMarkersRef = useRef([]);

  const { activeBooking, drivers, setPickup, setDestination } = useBoomBoomStore();
  const [clickPinMode, setClickPinMode] = useState('PICKUP'); // 'PICKUP' | 'DEST'
  const clickPinModeRef = useRef('PICKUP');

  useEffect(() => {
    clickPinModeRef.current = clickPinMode;
  }, [clickPinMode]);

  const pickupCoords = activeBooking.pickupCoords || { lat: -6.3198, lng: 106.7069 };
  const destCoords = activeBooking.destinationCoords || { lat: -6.2966, lng: 106.7128 };

  // Inisialisasi Peta Leaflet + ResizeObserver agar 100% Responsif di semua ukuran layar
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [pickupCoords.lat, pickupCoords.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Klik peta untuk menaruh titik Jemput atau Tujuan sesuai mode aktif
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        const quickLabel = `Titik Peta (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        if (clickPinModeRef.current === 'DEST') {
          setDestination(quickLabel, { lat, lng });
          const addr = await reverseGeocodeCoords(lat, lng);
          setDestination(addr, { lat, lng });
        } else {
          setPickup(quickLabel, { lat, lng });
          const addr = await reverseGeocodeCoords(lat, lng);
          setPickup(addr, { lat, lng });
        }
      });

      leafletMapRef.current = map;
    }

    // ResizeObserver agar peta otomatis menyesuaikan ukuran kontainer tanpa terpotong/abu-abu
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize({ animate: false });
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Sinkronisasi Marker, Garis Rute Jalan Raya OSRM & FitBounds Responsif
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    let isCancelled = false;

    // 1. Marker Titik Jemput (Draggable Green Pin)
    const shortPickup = activeBooking.pickupAddress
      ? activeBooking.pickupAddress.split(',')[0].slice(0, 26)
      : 'Lokasi Jemput';

    const pickupHtml = `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -105%); cursor:grab;">
        <div style="background:#065f46; color:#ffffff; font-size:11px; font-weight:800; padding:4px 9px; border-radius:10px; border:2px solid #34d399; box-shadow:0 4px 12px rgba(0,0,0,0.35); white-space:nowrap; margin-bottom:4px;">
          📍 Jemput: ${shortPickup}
        </div>
        <div style="width:20px; height:20px; background:#10b981; border:3.5px solid #ffffff; border-radius:50%; box-shadow:0 0 12px #10b981;"></div>
      </div>
    `;
    const pickupIcon = L.divIcon({ html: pickupHtml, className: 'boomboom-pickup-pin', iconSize: [0, 0] });

    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setLatLng([pickupCoords.lat, pickupCoords.lng]);
      pickupMarkerRef.current.setIcon(pickupIcon);
    } else {
      pickupMarkerRef.current = L.marker([pickupCoords.lat, pickupCoords.lng], {
        icon: pickupIcon,
        draggable: true,
        zIndexOffset: 1000
      }).addTo(map);

      pickupMarkerRef.current.on('dragend', async (e) => {
        const { lat, lng } = e.target.getLatLng();
        setPickup(`Titik Geser (${lat.toFixed(4)}, ${lng.toFixed(4)})`, { lat, lng });
        const addr = await reverseGeocodeCoords(lat, lng);
        setPickup(addr, { lat, lng });
      });
    }

    // 2. Marker Titik Tujuan (Draggable Red/Amber Flag Pin)
    const shortDest = activeBooking.destinationAddress
      ? activeBooking.destinationAddress.split(',')[0].slice(0, 26)
      : 'Tujuan';

    const destHtml = `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -105%); cursor:grab;">
        <div style="background:#78350f; color:#ffffff; font-size:11px; font-weight:800; padding:4px 9px; border-radius:10px; border:2px solid #fbbf24; box-shadow:0 4px 12px rgba(0,0,0,0.35); white-space:nowrap; margin-bottom:4px;">
          🏁 Tujuan: ${shortDest}
        </div>
        <div style="width:20px; height:20px; background:#ef4444; border:3.5px solid #ffffff; border-radius:50%; box-shadow:0 0 12px #ef4444;"></div>
      </div>
    `;
    const destIcon = L.divIcon({ html: destHtml, className: 'boomboom-dest-pin', iconSize: [0, 0] });

    if (destMarkerRef.current) {
      destMarkerRef.current.setLatLng([destCoords.lat, destCoords.lng]);
      destMarkerRef.current.setIcon(destIcon);
    } else {
      destMarkerRef.current = L.marker([destCoords.lat, destCoords.lng], {
        icon: destIcon,
        draggable: true,
        zIndexOffset: 950
      }).addTo(map);

      destMarkerRef.current.on('dragend', async (e) => {
        const { lat, lng } = e.target.getLatLng();
        setDestination(`Titik Tujuan (${lat.toFixed(4)}, ${lng.toFixed(4)})`, { lat, lng });
        const addr = await reverseGeocodeCoords(lat, lng);
        setDestination(addr, { lat, lng });
      });
    }

    // 3. Gambar Rute Jalan Raya Nyata (OSRM Geometry) + Auto FitBounds
    const drawRouteAndFit = async () => {
      const initialPoints = [
        [pickupCoords.lat, pickupCoords.lng],
        [destCoords.lat, destCoords.lng]
      ];

      if (routeLineRef.current) {
        routeLineRef.current.setLatLngs(initialPoints);
      } else {
        routeOutlineRef.current = L.polyline(initialPoints, {
          color: '#064e3b',
          weight: 8,
          opacity: 0.5,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        routeLineRef.current = L.polyline(initialPoints, {
          color: '#10b981',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
      }

      // Sesuaikan bounds awal dengan segera agar responsif
      try {
        map.invalidateSize({ animate: false });
        const bounds = L.latLngBounds(initialPoints);
        map.fitBounds(bounds.pad(0.28), {
          maxZoom: 15,
          animate: true,
          duration: 0.5
        });
      } catch {
        // Ignore
      }

      // Ambil geometri jalan raya sesungguhnya dari OSRM
      const osrmRoute = await fetchOsrmRoadRoute(pickupCoords, destCoords, activeBooking.serviceType);
      if (isCancelled || !leafletMapRef.current) return;

      if (osrmRoute?.routeGeometry?.length >= 2) {
        if (routeOutlineRef.current) routeOutlineRef.current.setLatLngs(osrmRoute.routeGeometry);
        if (routeLineRef.current) routeLineRef.current.setLatLngs(osrmRoute.routeGeometry);
        try {
          const roadBounds = L.latLngBounds(osrmRoute.routeGeometry);
          leafletMapRef.current.fitBounds(roadBounds.pad(0.22), {
            maxZoom: 15,
            animate: true,
            duration: 0.6
          });
        } catch {
          // Ignore
        }
      }
    };

    drawRouteAndFit();

    // 4. Update Driver Sekitar di sekitar titik penjemputan aktif
    driverMarkersRef.current.forEach(m => m.remove());
    driverMarkersRef.current = [];

    if (showNearbyDrivers) {
      const activeDrivers = drivers.filter(d => d.isOnline && d.status === 'VERIFIED');
      activeDrivers.forEach((driver, idx) => {
        // Tempatkan driver relatif di sekitar titik jemput penumpang agar terlihat di area pemesanan
        const offsetLat = ((idx % 2 === 0 ? 1 : -1) * (0.0022 + idx * 0.0012));
        const offsetLng = ((idx % 3 === 0 ? -1 : 1) * (0.0025 + idx * 0.001));
        const dLat = pickupCoords.lat + offsetLat;
        const dLng = pickupCoords.lng + offsetLng;
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

    return () => {
      isCancelled = true;
    };
  }, [
    pickupCoords.lat,
    pickupCoords.lng,
    destCoords.lat,
    destCoords.lng,
    activeBooking.pickupAddress,
    activeBooking.destinationAddress,
    activeBooking.serviceType,
    showNearbyDrivers,
    drivers
  ]);

  const handleCenterPickup = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([pickupCoords.lat, pickupCoords.lng], 16, { animate: true, duration: 0.6 });
    }
  };

  const handleCenterRoute = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.invalidateSize();
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [destCoords.lat, destCoords.lng]
      ]);
      leafletMapRef.current.fitBounds(bounds.pad(0.25), { maxZoom: 15, animate: true });
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      minHeight: '320px',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '2px solid var(--border-color, #cbd5e1)',
      background: '#0f172a',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
    }}>
      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* Top Floating Control Bar — prevents any overlap on mobile/desktop */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        zIndex: 500,
        pointerEvents: 'none'
      }}>
        {/* Distance Badge */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          padding: '6px 10px',
          borderRadius: '12px',
          fontSize: '0.72rem',
          fontWeight: '800',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: '1px solid rgba(52,211,153,0.4)',
          pointerEvents: 'auto',
          whiteSpace: 'nowrap'
        }}>
          <Navigation size={13} color="#34d399" />
          <span>Rute Nyata: {activeBooking.fareCalc?.distanceKm || 4.5} km (~{activeBooking.fareCalc?.durationMin || 12} mnt)</span>
        </div>

        {/* Toggle Klik Peta */}
        <div style={{
          display: 'inline-flex',
          gap: '4px',
          background: 'rgba(15, 23, 42, 0.92)',
          padding: '3px 4px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.15)',
          pointerEvents: 'auto'
        }}>
          <button
            type="button"
            onClick={() => setClickPinMode('PICKUP')}
            style={{
              background: clickPinMode === 'PICKUP' ? '#10b981' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '0.68rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            📍 Klik=Jemput
          </button>
          <button
            type="button"
            onClick={() => setClickPinMode('DEST')}
            style={{
              background: clickPinMode === 'DEST' ? '#ef4444' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '0.68rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            🏁 Klik=Tujuan
          </button>
        </div>
      </div>

      {/* Bottom Right: Floating Controls for Auto-Fitting Route */}
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
            background: '#0f172a',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
          }}
        >
          <Navigation size={13} color="#10b981" /> Rute Penuh
        </button>

        <button
          type="button"
          onClick={handleCenterPickup}
          title="Fokus ke Titik Penjemputan"
          style={{
            background: '#0f172a',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
          }}
        >
          <MapPin size={13} color="#34d399" /> Titik Jemput
        </button>
      </div>

      {/* Bottom Left: Floating Active Driver Count Badge */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        background: 'rgba(15, 23, 42, 0.88)',
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
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59f00' }} />
        <span>{drivers.filter(d => d.isOnline).length} Driver Sekitar Aktif • Geser Pin untuk Presisi</span>
      </div>
    </div>
  );
};

export default MapViewComponent;
