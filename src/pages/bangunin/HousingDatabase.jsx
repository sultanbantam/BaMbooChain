import React, { useState, useMemo } from 'react';
import { 
  Building2, Search, Filter, MapPin, ShieldCheck, CheckCircle2, 
  ExternalLink, Layers, ArrowRight, Eye, Phone, Mail, User, 
  SlidersHorizontal, Sparkles, Home, FileText, ChevronRight, X
} from 'lucide-react';
import { MBR_PROJECTS } from '../../data/banguninData';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export default function HousingDatabase({ onSelectForConfigurator }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedUnitType, setSelectedUnitType] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  const cities = useMemo(() => {
    const list = Array.from(new Set(MBR_PROJECTS.map(p => p.city)));
    return ['ALL', ...list];
  }, []);

  const filteredProjects = useMemo(() => {
    return MBR_PROJECTS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCity = selectedCity === 'ALL' || p.city === selectedCity;
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchType = selectedUnitType === 'ALL' || p.unitTypes.some(t => t.toLowerCase().includes(selectedUnitType.toLowerCase()));
      return matchSearch && matchCity && matchStatus && matchType;
    });
  }, [searchQuery, selectedCity, selectedStatus, selectedUnitType]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header & Filter Controls */}
      <div style={{ 
        background: 'var(--bg-card)', 
        padding: '24px', 
        borderRadius: '20px', 
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 color="#005BAA" size={28} /> Database Perumahan MBR Terverifikasi
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Katalog resmi perumahan MBR berbasis konstruksi hijau bambu dan beton modular ramah gempa dengan verifikasi legalitas PBG/SLF.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', background: 'rgba(12,166,120,0.1)', padding: '6px 14px', borderRadius: '20px' }}>
              {filteredProjects.length} Proyek Ditemukan
            </span>
          </div>
        </div>

        {/* Search & Filter Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Cari nama perumahan, developer, kota, atau kata kunci..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">📍 Semua Kota / Kab</option>
              {cities.filter(c => c !== 'ALL').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">🏗️ Semua Status Progres</option>
              <option value="CONSTRUCTION">Sedang Dibangun (Konstruksi)</option>
              <option value="COMPLETED">Siap Huni (Completed)</option>
              <option value="PLANNED">Rencana / Tahap Izin</option>
            </select>
          </div>

          <div>
            <select
              value={selectedUnitType}
              onChange={e => setSelectedUnitType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">🏡 Semua Teknologi Unit</option>
              <option value="BlockBamboo">BlockBamboo (Bambu Laminasi)</option>
              <option value="RISHAM">RISHAM (Beton Modular)</option>
              <option value="Hybrid">Hybrid Eco-Bambu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredProjects.map(project => {
          const statusColors = {
            CONSTRUCTION: { bg: '#e7f5ff', text: '#1971c2', label: 'Sedang Dibangun' },
            COMPLETED: { bg: '#ebfbee', text: '#2b8a3e', label: 'Siap Huni (Ready)' },
            PLANNED: { bg: '#fff9db', text: '#f59f00', label: 'Tahap Rencana' }
          }[project.status] || { bg: '#f1f3f5', text: '#495057', label: project.status };

          return (
            <div 
              key={project.id}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
                transition: 'transform 0.25s, box-shadow 0.25s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.04)';
              }}
            >
              {/* Image & Badges */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={project.coverImage} 
                  alt={project.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ 
                    background: statusColors.bg, 
                    color: statusColors.text, 
                    fontSize: '0.75rem', 
                    fontWeight: '800', 
                    padding: '4px 10px', 
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {statusColors.label}
                  </span>
                  <span style={{ 
                    background: 'rgba(0,0,0,0.7)', 
                    color: '#fff', 
                    fontSize: '0.72rem', 
                    fontWeight: '600', 
                    padding: '4px 10px', 
                    borderRadius: '20px',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {project.subsidyType}
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                  <span style={{ 
                    background: 'rgba(12,166,120,0.9)', 
                    color: '#fff', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    padding: '4px 10px', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backdropFilter: 'blur(4px)'
                  }}>
                    <ShieldCheck size={14} /> Legal PBG/SLF
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <MapPin size={14} color="#fa5252" /> {project.city}, {project.province}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 8px', lineHeight: '1.3' }}>
                  {project.name}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 16px', lineHeight: '1.5', flex: 1 }}>
                  {project.description.slice(0, 110)}...
                </p>

                {/* Progress Bar for construction */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progres Pembangunan:</span>
                    <span style={{ color: 'var(--primary)' }}>{project.progressPercentage}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${project.progressPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #005BAA, #0ca678)', borderRadius: '4px' }} />
                  </div>
                </div>

                {/* Units & Price */}
                <div style={{ 
                  background: 'var(--bg-color)', 
                  padding: '12px 14px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Harga Mulai Dari</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#005BAA' }}>
                      {formatRupiah(project.priceMin)}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Unit Tersedia</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: project.availableUnits > 0 ? '#2b8a3e' : '#fa5252' }}>
                      {project.availableUnits} / {project.totalUnits}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedProject(project)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Eye size={16} /> Detail Proyek
                  </button>

                  <button
                    onClick={() => onSelectForConfigurator(project)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #005BAA, #004080)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <SlidersHorizontal size={16} /> Konfigurasi
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100010,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--bg-color)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: '#e7f5ff', color: '#1971c2', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {selectedProject.city}, {selectedProject.province}
                </span>
                <span style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  No. Izin: {selectedProject.permitNumber}
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
                {selectedProject.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                Dikembangkan oleh: <strong>{selectedProject.developer}</strong> ({selectedProject.btnPartnerStatus})
              </p>
            </div>

            {/* Gallery Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
              {selectedProject.gallery.slice(0, 3).map((img, idx) => (
                <img key={idx} src={img} alt="galeri" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ))}
            </div>

            {/* Description & Features */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>
                Deskripsi Kawasan & Masterplan
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 16px' }}>
                {selectedProject.description}
              </p>

              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '10px' }}>
                Fasilitas & Keunggulan Kawasan
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProject.features.map((feat, i) => (
                  <span key={i} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="var(--primary)" /> {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Developer Contact & Booking CTA */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,91,170,0.05), rgba(12,166,120,0.08))',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Kontak PIC Developer:</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  {selectedProject.developerContact.pic} ({selectedProject.developerContact.phone})
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`https://wa.me/62${selectedProject.developerContact.phone.replace(/[^0-9]/g, '').slice(1)}?text=Halo%20saya%20tertarik%20dengan%20proyek%20${encodeURIComponent(selectedProject.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: '#25D366',
                    color: '#fff',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Phone size={16} /> Hubungi Developer
                </a>

                <button
                  onClick={() => {
                    const pr = selectedProject;
                    setSelectedProject(null);
                    onSelectForConfigurator(pr);
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: '#005BAA',
                    color: '#fff',
                    fontWeight: 'bold',
                    border: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <SlidersHorizontal size={18} /> Konfigurasi Rumah Ini <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
