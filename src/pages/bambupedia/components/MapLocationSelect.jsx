import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { globalLocations, getAllLocationPins } from '../../../utils/locationData';

// Fix for default Leaflet marker icons in React
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customPinIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapLocationSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [customPosition, setCustomPosition] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (loc) => {
    const locationString = `${loc.name} (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`;
    onChange(locationString);
    setIsOpen(false);
    setSearch('');
  };

  const handleMapClick = (lat, lng) => {
    setCustomPosition({ lat, lng });
    const locationString = `Titik Kustom (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    onChange(locationString);
  };

  const keyword = search.toLowerCase();
  const filteredData = {};
  Object.entries(globalLocations).forEach(([region, items]) => {
    const matched = items.filter(loc => 
      loc.name.toLowerCase().includes(keyword) || region.toLowerCase().includes(keyword)
    );
    if (matched.length > 0) filteredData[region] = matched;
  });

  const allPins = getAllLocationPins();

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', background: 'white', fontSize: '0.95rem'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || "-- Pilih Lokasi Penanaman --"}
        </span>
        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, 
          marginTop: '8px', padding: '12px', 
          backgroundColor: 'white', border: '1px solid #eee', borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 9999,
          maxHeight: '450px', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', marginBottom: '12px', borderBottom: '1px solid #eee' }}>
            <button 
              type="button"
              style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', fontWeight: activeTab === 'list' ? 'bold' : 'normal', color: activeTab === 'list' ? 'var(--primary)' : '#666', borderBottom: activeTab === 'list' ? '2px solid var(--primary)' : 'none', cursor: 'pointer' }}
              onClick={() => setActiveTab('list')}
            >
              Cari Daftar
            </button>
            <button 
              type="button"
              style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', fontWeight: activeTab === 'map' ? 'bold' : 'normal', color: activeTab === 'map' ? 'var(--primary)' : '#666', borderBottom: activeTab === 'map' ? '2px solid var(--primary)' : 'none', cursor: 'pointer' }}
              onClick={() => setActiveTab('map')}
            >
              Peta Interaktif
            </button>
          </div>

          {activeTab === 'list' && (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <input 
                type="text" 
                style={{ width: '100%', marginBottom: '12px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #eee', fontSize: '0.9rem' }}
                placeholder="Cari lokasi atau wilayah..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {Object.entries(filteredData).map(([region, items]) => (
                <div key={region} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', padding: '4px 8px', background: 'rgba(12,166,120,0.05)', borderRadius: '6px' }}>{region}</div>
                  {items.map((item, idx) => (
                    <div 
                      key={idx} onClick={() => handleSelect(item)}
                      style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.88rem', borderBottom: '1px solid #f1f3f5' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'map' && (
            <div style={{ height: '280px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
              <MapContainer 
                center={[-6.2088, 106.8456]} zoom={8} 
                style={{ height: '100%', width: '100%' }}
                whenReady={(mapInstance) => { setTimeout(() => mapInstance.target.invalidateSize(), 100); }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {allPins.map((pin, i) => (
                  <Marker key={i} position={[pin.lat, pin.lng]} icon={defaultIcon}>
                    <Popup>
                      <strong>{pin.name}</strong><br/>
                      <button type="button" onClick={() => handleSelect(pin)} style={{ marginTop: '8px', padding: '4px 10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Pilih</button>
                    </Popup>
                  </Marker>
                ))}
                {customPosition && (
                  <Marker position={[customPosition.lat, customPosition.lng]} icon={customPinIcon}>
                    <Popup>Lokasi Kustom Anda</Popup>
                  </Marker>
                )}
                <MapClickHandler onLocationSelect={handleMapClick} />
              </MapContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MapLocationSelect;
