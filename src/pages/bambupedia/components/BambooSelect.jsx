import React, { useState, useRef, useEffect } from 'react';
import { bambooSpecies } from '../../../utils/bambooData';

function BambooSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(value && !value.includes('(') ? value : '');
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

  const handleSelect = (common, scientific, region) => {
    const formattedStr = `${common} (${scientific})`;
    onChange(formattedStr);
    setIsCustom(false);
    setIsOpen(false);
    setSearch('');
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    onChange(customValue);
    setIsOpen(false);
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange(val);
  };

  const keyword = search.toLowerCase();
  const filteredData = {};

  Object.entries(bambooSpecies).forEach(([group, items]) => {
    const filteredItems = items.filter(item => 
      item.common.toLowerCase().includes(keyword) || 
      item.scientific.toLowerCase().includes(keyword)
    );
    if (filteredItems.length > 0) {
      filteredData[group] = filteredItems;
    }
  });

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {!isCustom ? (
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', background: 'white', fontSize: '0.95rem'
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value || "-- Pilih Jenis Bambu --"}
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>▼</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="text" 
            style={{ 
              flex: 1, padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', background: 'white', fontSize: '0.95rem'
            }}
            value={customValue}
            onChange={handleCustomChange}
            placeholder="Masukkan jenis bambu kustom..."
            required
          />
          <button 
            type="button" 
            onClick={() => { setIsCustom(false); onChange(''); }}
            style={{ padding: '12px', borderRadius: '12px', border: '1px solid #dee2e6', background: '#f8f9fa', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {isOpen && !isCustom && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, 
          marginTop: '8px', padding: '12px', 
          backgroundColor: 'white', 
          border: '1px solid #eee', 
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <input 
            type="text" 
            style={{ 
              width: '100%', marginBottom: '12px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #eee', fontSize: '0.9rem'
            }}
            placeholder="Cari berdasarkan nama atau nama ilmiah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          {Object.entries(filteredData).map(([group, items]) => (
            <div key={group} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', padding: '4px 8px', backgroundColor: 'rgba(12,166,120,0.05)', borderRadius: '6px', marginBottom: '4px' }}>
                {group}
              </div>
              {items.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelect(item.common, item.scientific, item.region)}
                  style={{ 
                    padding: '8px 12px', cursor: 'pointer', fontSize: '0.88rem', borderRadius: '8px', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.common}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <em>{item.scientific}</em>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div 
            onClick={handleCustomSelect}
            style={{ 
              padding: '12px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--primary)', textAlign: 'center', borderTop: '1px solid #eee', marginTop: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            + Spesies Bambu Lainnya (Input Manual)
          </div>
        </div>
      )}
    </div>
  );
}

export default BambooSelect;
