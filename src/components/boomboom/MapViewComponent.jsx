import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Car, Shield, RefreshCw } from 'lucide-react';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const MapViewComponent = ({
  height = '320px',
  showNearbyDrivers = true,
  interactiveBooking = false,
  trackingDriver = null
}) => {
  const { activeBooking, drivers } = useBoomBoomStore();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const activeDrivers = drivers.filter(d => d.isOnline && d.status === 'VERIFIED');

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      borderRadius: '20px',
      overflow: 'hidden',
      border: '2px solid var(--border-color)',
      background: '#e5e7eb',
      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)'
    }}>
      {/* Map Graphic Canvas / Stylized Rural Network Grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="1" />
          </pattern>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#f59f00" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="#f0fdf4" />
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Contour Rivers & Green Zones */}
        <path d="M -50 100 Q 150 200 400 120 T 900 300" fill="none" stroke="#a7f3d0" strokeWidth="24" strokeLinecap="round" opacity="0.6" />
        <path d="M 100 -20 Q 300 250 800 200" fill="none" stroke="#cbd5e1" strokeWidth="12" strokeDasharray="6,6" />

        {/* Route line between pickup and destination */}
        <path
          d="M 120 180 C 220 100, 320 220, 480 140"
          fill="none"
          stroke="url(#routeGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={activeBooking.step === 'ON_TRIP' ? '8,8' : 'none'}
        />

        {/* Moving Driver Marker along the route during tracking */}
        {activeBooking.step === 'ON_TRIP' && (
          <circle cx="280" cy="150" r="14" fill="#f59f00" stroke="#ffffff" strokeWidth="3">
            <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>

      {/* Pickup Location Marker */}
      <div style={{
        position: 'absolute',
        left: '22%',
        top: '52%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 5
      }}>
        <div style={{
          background: '#10b981',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '700',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
          whiteSpace: 'nowrap',
          marginBottom: '4px'
        }}>
          📍 Jemput: {activeBooking.pickupAddress.split(',')[0]}
        </div>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#10b981',
          border: '3px solid white',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }} />
      </div>

      {/* Destination Location Marker */}
      <div style={{
        position: 'absolute',
        left: '75%',
        top: '40%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 5
      }}>
        <div style={{
          background: '#ef4444',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '700',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
          whiteSpace: 'nowrap',
          marginBottom: '4px'
        }}>
          🏁 Tujuan: {activeBooking.destinationAddress.split(',')[0]}
        </div>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#ef4444',
          border: '3px solid white',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }} />
      </div>

      {/* Nearby Active Drivers Visualization */}
      {showNearbyDrivers && activeDrivers.map((driver, idx) => {
        const positions = [
          { left: '35%', top: '35%' },
          { left: '48%', top: '65%' },
          { left: '62%', top: '30%' },
          { left: '28%', top: '75%' }
        ];
        const pos = positions[idx % positions.length];
        return (
          <div key={driver.driver_id} style={{
            position: 'absolute',
            left: pos.left,
            top: pos.top,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'white',
            padding: '3px 8px',
            borderRadius: '16px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            border: '1px solid #10b981',
            zIndex: 4
          }}>
            <span style={{ fontSize: '1rem' }}>{driver.vehicle_type === 'BoomCar' ? '🚗' : '🛵'}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#064e3b' }}>{driver.name.split(' ')[0]}</span>
          </div>
        );
      })}

      {/* Floating Controls Overlay */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        padding: '6px 12px',
        borderRadius: '14px',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#064e3b',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Navigation size={14} color="#10b981" />
        <span>OpenStreetMap Provider (Subang - Cibarani Zone)</span>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        background: 'rgba(6, 78, 59, 0.9)',
        color: 'white',
        backdropFilter: 'blur(8px)',
        padding: '6px 12px',
        borderRadius: '14px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: pulse ? '#f59f00' : '#10b981',
          transition: 'background 0.5s'
        }} />
        <span>{activeDrivers.length} Pengemudi Sekitar Aktif</span>
      </div>
    </div>
  );
};

export default MapViewComponent;
