import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { fetchOsrmRoadRoute, reverseGeocodeCoords } from '../../services/boomboom/geoService';
import { Navigation, MapPin, Crosshair, Compass, ExternalLink, Bike, Car } from 'lucide-react';

const DEFAULT_CENTER = { lat: -6.3198, lng: 106.7069 }; // default view (Tangsel / Jabodetabek)

const MapViewComponent = ({
  height = '420px',
  showNearbyDrivers = true,
  driverMode = false
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
  const [isLocating, setIsLocating] = useState(false);
  const [turnDirection, setTurnDirection] = useState('Menuju Rute Penjemputan');

  useEffect(() => {
    clickPinModeRef.current = clickPinMode;
  }, [clickPinMode]);

  const pickupCoords = activeBooking.pickupCoords;
  const destCoords = activeBooking.destinationCoords;

  // Inisialisasi Peta Leaflet + ResizeObserver agar 100% Responsif di ponsel dan desktop
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const initialCenter = pickupCoords 
        ? [pickupCoords.lat, pickupCoords.lng] 
        : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
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

    // ResizeObserver agar peta otomatis invalidateSize saat kontainer/layar ponsel berubah
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

  // Update Markers, Polyline, dan FitBounds saat koordinat berubah
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    let isCancelled = false;

    // 1. MARKER JEMPUT (Simbol Hijau Ikonik + Pulse Animation)
    if (pickupCoords) {
      const shortPickup = activeBooking.pickupAddress
        ? activeBooking.pickupAddress.split(',')[0].slice(0, 22)
        : 'Titik Jemput';

      const pickupHtml = `
        <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%); cursor:grab;">
          <div style="background:#065f46; color:#ffffff; font-size:11px; font-weight:900; padding:4px 9px; border-radius:12px; border:2px solid #34d399; box-shadow:0 4px 14px rgba(0,0,0,0.35); white-space:nowrap; margin-bottom:4px; display:flex; align-items:center; gap:4px;">
            <span>🟢</span> ${shortPickup}
          </div>
          <div style="position:relative; width:24px; height:24px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:100%; height:100%; background:rgba(16,185,129,0.35); border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:18px; height:18px; background:#10b981; border:3.5px solid #ffffff; border-radius:50%; box-shadow:0 0 10px #10b981; z-index:2;"></div>
          </div>
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
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }

    // 2. MARKER TUJUAN (Simbol Merah/Bendera Ikonik)
    if (destCoords) {
      const shortDest = activeBooking.destinationAddress
        ? activeBooking.destinationAddress.split(',')[0].slice(0, 22)
        : 'Titik Tujuan';

      const destHtml = `
        <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%); cursor:grab;">
          <div style="background:#78350f; color:#ffffff; font-size:11px; font-weight:900; padding:4px 9px; border-radius:12px; border:2px solid #fbbf24; box-shadow:0 4px 14px rgba(0,0,0,0.35); white-space:nowrap; margin-bottom:4px; display:flex; align-items:center; gap:4px;">
            <span>🏁</span> ${shortDest}
          </div>
          <div style="width:20px; height:20px; background:#ef4444; border:3.5px solid #ffffff; border-radius:50%; box-shadow:0 0 10px #ef4444;"></div>
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
    } else if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }

    // 3. RUTE JALAN RAYA OSRM (Hijau Terang Mudah Diikuti Driver & Penumpang)
    if (pickupCoords && destCoords) {
      const drawRoute = async () => {
        const initialPoints = [
          [pickupCoords.lat, pickupCoords.lng],
          [destCoords.lat, destCoords.lng]
        ];

        if (routeLineRef.current) {
          routeLineRef.current.setLatLngs(initialPoints);
        } else {
          routeOutlineRef.current = L.polyline(initialPoints, {
            color: '#064e3b',
            weight: 7,
            opacity: 0.6,
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

        try {
          map.invalidateSize({ animate: false });
          const bounds = L.latLngBounds(initialPoints);
          map.fitBounds(bounds.pad(0.25), { maxZoom: 15, animate: true, duration: 0.5 });
        } catch {}

        const osrmRoute = await fetchOsrmRoadRoute(pickupCoords, destCoords, activeBooking.serviceType);
        if (isCancelled || !leafletMapRef.current) return;

        if (osrmRoute?.routeGeometry?.length >= 2) {
          if (routeOutlineRef.current) routeOutlineRef.current.setLatLngs(osrmRoute.routeGeometry);
          if (routeLineRef.current) routeLineRef.current.setLatLngs(osrmRoute.routeGeometry);
          try {
            const roadBounds = L.latLngBounds(osrmRoute.routeGeometry);
            leafletMapRef.current.fitBounds(roadBounds.pad(0.22), { maxZoom: 15, animate: true, duration: 0.6 });
          } catch {}
          setTurnDirection(`Rute Siap: ${osrmRoute.distanceKm} km • ~${osrmRoute.durationMin} mnt via jalur utama`);
        }
      };

      drawRoute();
    } else {
      if (routeOutlineRef.current) { routeOutlineRef.current.remove(); routeOutlineRef.current = null; }
      if (routeLineRef.current) { routeLineRef.current.remove(); routeLineRef.current = null; }
      if (pickupCoords && !destCoords) {
        map.flyTo([pickupCoords.lat, pickupCoords.lng], 15, { animate: true, duration: 0.5 });
      }
    }

    // 4. IKON DRIVER SEKITAR (Simbol Kendaraan 🛵 / 🚗 Hijau Canggih)
    driverMarkersRef.current.forEach(m => m.remove());
    driverMarkersRef.current = [];

    if (showNearbyDrivers) {
      const activeDrivers = drivers.filter(d => d.isOnline);
      const centerPoint = pickupCoords || DEFAULT_CENTER;

      activeDrivers.forEach((driver, idx) => {
        const offsetLat = ((idx % 2 === 0 ? 1 : -1) * (0.0022 + idx * 0.0012));
        const offsetLng = ((idx % 3 === 0 ? -1 : 1) * (0.0025 + idx * 0.001));
        const dLat = centerPoint.lat + offsetLat;
        const dLng = centerPoint.lng + offsetLng;
        const isCar = (driver.vehicle_brand || '').toLowerCase().includes('mobil') || (driver.service_type || '').includes('Car');

        const dHtml = `
          <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -50%);">
            <div style="width:32px; height:32px; background:#064e3b; border:2px solid #34d399; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.35); font-size:16px;">
              ${isCar ? '🚗' : '🛵'}
            </div>
            <div style="background:#0f172a; color:#a7f3d0; font-size:9px; font-weight:800; padding:1px 5px; border-radius:6px; margin-top:1px; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.3);">
              ${driver.name.split(' ')[0]}
            </div>
          </div>
        `;
        const dIcon = L.divIcon({ html: dHtml, className: 'driver-live-pin', iconSize: [0, 0] });
        const marker = L.marker([dLat, dLng], { icon: dIcon }).addTo(map);
        driverMarkersRef.current.push(marker);
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [
    pickupCoords?.lat,
    pickupCoords?.lng,
    destCoords?.lat,
    destCoords?.lng,
    activeBooking.pickupAddress,
    activeBooking.destinationAddress,
    activeBooking.serviceType,
    showNearbyDrivers,
    drivers
  ]);

  // Tombol "Lokasi Saya" GPS Berkecepatan Tinggi
  const handleLocateMe = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung fitur lokasi GPS.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const quickLabel = `Lokasi Saya (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        setPickup(quickLabel, { lat: latitude, lng: longitude });

        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([latitude, longitude], 16, { animate: true, duration: 0.6 });
        }

        try {
          const addr = await reverseGeocodeCoords(latitude, longitude);
          setPickup(addr, { lat: latitude, lng: longitude });
        } catch {}
      },
      (err) => {
        setIsLocating(false);
        alert('Gagal mendeteksi lokasi GPS. Pastikan izin lokasi perangkat telah diaktifkan.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleCenterRoute = () => {
    if (!leafletMapRef.current) return;
    if (pickupCoords && destCoords) {
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [destCoords.lat, destCoords.lng]
      ]);
      leafletMapRef.current.fitBounds(bounds.pad(0.25), { maxZoom: 15, animate: true });
    } else if (pickupCoords) {
      leafletMapRef.current.flyTo([pickupCoords.lat, pickupCoords.lng], 16, { animate: true });
    } else {
      leafletMapRef.current.flyTo([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 14, { animate: true });
    }
  };

  const openExternalNavigation = () => {
    if (!destCoords && !pickupCoords) return;
    const target = destCoords || pickupCoords;
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}`;
    window.open(navUrl, '_blank');
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      minHeight: '280px',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '2px solid var(--border-color, #cbd5e1)',
      background: '#0f172a',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
    }}>
      {/* Map Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* TOP: Quick Driver/Passenger Navigation Guidance Pill */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        zIndex: 500,
        pointerEvents: 'none'
      }}>
        {/* Route status / Turn indicator */}
        <div style={{
          background: 'rgba(6, 78, 59, 0.94)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          padding: '7px 14px',
          borderRadius: '16px',
          fontSize: '0.8rem',
          fontWeight: '800',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
          border: '1.5px solid #34d399',
          pointerEvents: 'auto'
        }}>
          <Navigation size={14} color="#34d399" />
          <span>
            {pickupCoords && destCoords 
              ? `${activeBooking.fareCalc?.distanceKm || 0} km • ~${activeBooking.fareCalc?.durationMin || 0} mnt`
              : (pickupCoords ? '🟢 Titik Jemput Siap • Pilih Tujuan' : '📍 Pilih Lokasi di Peta')}
          </span>
        </div>

        {/* Pin Click Mode Selector */}
        <div style={{
          display: 'inline-flex',
          gap: '4px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          padding: '3px 4px',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.18)',
          pointerEvents: 'auto'
        }}>
          <button
            type="button"
            onClick={() => setClickPinMode('PICKUP')}
            style={{
              background: clickPinMode === 'PICKUP' ? '#10b981' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '5px 10px',
              fontSize: '0.72rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>🟢</span> Jemput
          </button>
          <button
            type="button"
            onClick={() => setClickPinMode('DEST')}
            style={{
              background: clickPinMode === 'DEST' ? '#ef4444' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '5px 10px',
              fontSize: '0.72rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>🏁</span> Tujuan
          </button>
        </div>
      </div>

      {/* FLOATING ACTION CONTROLS: Lokasi Saya + Recenter + Navigasi Eksternal */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 500
      }}>
        {/* Lokasi Saya Button (GPS) */}
        <button
          type="button"
          onClick={handleLocateMe}
          title="Gunakan Lokasi GPS Saya Saat Ini"
          style={{
            background: isLocating ? '#059669' : '#10b981',
            color: '#ffffff',
            border: '2px solid #ffffff',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(16,185,129,0.4)',
            transition: 'all 0.15s'
          }}
        >
          <Crosshair size={22} className={isLocating ? 'animate-spin' : ''} />
        </button>

        {/* Recenter Route */}
        <button
          type="button"
          onClick={handleCenterRoute}
          title="Fokus Rute Lengkap"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#ffffff',
            border: '1.5px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <Compass size={20} color="#34d399" />
        </button>

        {/* Driver Google Maps Nav Shortcut */}
        {(pickupCoords || destCoords) && (
          <button
            type="button"
            onClick={openExternalNavigation}
            title="Buka Navigasi Driver di Google Maps"
            style={{
              background: '#047857',
              color: '#ffffff',
              border: '1.5px solid #34d399',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(4,120,87,0.35)'
            }}
          >
            <ExternalLink size={18} />
          </button>
        )}
      </div>

      {/* BOTTOM LEFT: Status Pengemudi Sekitar (Sangat Simpel & Bersih) */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '14px',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        color: '#ecfdf5',
        padding: '6px 12px',
        borderRadius: '16px',
        fontSize: '0.74rem',
        fontWeight: '800',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 500,
        border: '1px solid rgba(52,211,153,0.3)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#10b981',
          boxShadow: '0 0 8px #10b981'
        }} />
        <span>{drivers.filter(d => d.isOnline).length} Driver Sekitar Aktif</span>
      </div>
    </div>
  );
};

export default MapViewComponent;
