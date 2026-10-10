import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, Search, Filter, MapPin, ShieldCheck, CheckCircle2, 
  ExternalLink, Layers, ArrowRight, Eye, Phone, Mail, User, 
  SlidersHorizontal, Sparkles, Home, FileText, ChevronRight, X,
  PlusCircle, Download, Printer, UploadCloud, Check, FileCheck,
  AlertCircle, Compass, HardHat, Calendar, Landmark, Info
} from 'lucide-react';
import { MBR_PROJECTS } from '../../data/banguninData';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export default function HousingDatabase({ onSelectForConfigurator }) {
  // Merge default data with user-uploaded projects stored in localStorage
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('bangunin_custom_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...MBR_PROJECTS];
        }
      }
    } catch (e) {
      console.error('Error loading custom projects:', e);
    }
    return MBR_PROJECTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedUnitType, setSelectedUnitType] = useState('ALL');
  
  // Modals state
  const [selectedProject, setSelectedProject] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pdfPreviewProject, setPdfPreviewProject] = useState(null);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);

  // Form state for uploading new MBR Project
  const [newProject, setNewProject] = useState({
    name: '',
    developer: '',
    pic: '',
    phone: '',
    email: '',
    province: 'Banten',
    city: '',
    address: '',
    status: 'CONSTRUCTION', // 'PLANNED' | 'CONSTRUCTION' | 'COMPLETED'
    permitNumber: '',
    priceMin: 168000000,
    priceMax: 210000000,
    totalUnits: 100,
    availableUnits: 40,
    subsidyType: 'KPR BTN FLPP Sejahtera',
    unitTypes: ['BlockBamboo Tipe 36', 'RISHAM Tipe 30'],
    description: '',
    features: ['Bebas Banjir', 'Struktur Ramah Gempa', 'Air Bersih PDAM', 'Listrik PLN 1300 VA'],
    coverImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    brochurePdfUrl: '',
    legalDocPdfUrl: ''
  });

  // Extract unique provinces & cities
  const provinces = useMemo(() => {
    const list = Array.from(new Set(projects.map(p => p.province).filter(Boolean)));
    return ['ALL', ...list];
  }, [projects]);

  const cities = useMemo(() => {
    let filtered = projects;
    if (selectedProvince !== 'ALL') {
      filtered = filtered.filter(p => p.province === selectedProvince);
    }
    const list = Array.from(new Set(filtered.map(p => p.city).filter(Boolean)));
    return ['ALL', ...list];
  }, [projects, selectedProvince]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        p.name.toLowerCase().includes(q) ||
        p.developer.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.province && p.province.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.permitNumber && p.permitNumber.toLowerCase().includes(q)) ||
        (p.features && p.features.some(f => f.toLowerCase().includes(q))) ||
        (p.unitTypes && p.unitTypes.some(t => t.toLowerCase().includes(q)));

      const matchProvince = selectedProvince === 'ALL' || p.province === selectedProvince;
      const matchCity = selectedCity === 'ALL' || p.city === selectedCity;
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchType = selectedUnitType === 'ALL' || (p.unitTypes && p.unitTypes.some(t => t.toLowerCase().includes(selectedUnitType.toLowerCase())));

      return matchSearch && matchProvince && matchCity && matchStatus && matchType;
    });
  }, [projects, searchQuery, selectedProvince, selectedCity, selectedStatus, selectedUnitType]);

  // Handle image upload from file input
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProject(prev => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle PDF upload from file input
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProject(prev => ({ 
        ...prev, 
        brochurePdfUrl: URL.createObjectURL(file),
        pdfFileName: file.name
      }));
    }
  };

  // Submit new project
  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.developer || !newProject.city) {
      alert('Mohon lengkapi Nama Perumahan, Developer, dan Kota!');
      return;
    }

    const created = {
      id: `proj-custom-${Date.now()}`,
      name: newProject.name,
      developer: newProject.developer,
      developerId: `dev-${Date.now()}`,
      city: newProject.city,
      province: newProject.province,
      address: newProject.address || `Kawasan Perumahan MBR, ${newProject.city}, ${newProject.province}`,
      coordinates: [-6.2000, 106.8166],
      status: newProject.status,
      permitStatus: 'APPROVED',
      permitNumber: newProject.permitNumber || `PBG-${Date.now().toString().slice(-6)}-2026-MBR`,
      totalUnits: Number(newProject.totalUnits) || 100,
      availableUnits: Number(newProject.availableUnits) || 40,
      priceMin: Number(newProject.priceMin) || 168000000,
      priceMax: Number(newProject.priceMax) || 210000000,
      coverImage: newProject.coverImage,
      gallery: [
        newProject.coverImage,
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
      ],
      brochurePdfUrl: newProject.brochurePdfUrl || `https://bamboochain.id/docs/brosur_${newProject.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      legalDocPdfUrl: newProject.legalDocPdfUrl || `https://bamboochain.id/docs/pbg_${newProject.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      subsidyType: newProject.subsidyType,
      unitTypes: Array.isArray(newProject.unitTypes) ? newProject.unitTypes : [newProject.unitTypes],
      description: newProject.description || `Kawasan perumahan MBR ${newProject.name} berlokasi strategis di ${newProject.city}. Dilengkapi struktur ramah gempa, fasilitas umum lengkap, dan dukungan KPR BTN FLPP.`,
      features: Array.isArray(newProject.features) ? newProject.features : ['Bebas Banjir', 'Struktur Ramah Gempa', 'Air Bersih PDAM'],
      progressPercentage: newProject.status === 'COMPLETED' ? 100 : (newProject.status === 'CONSTRUCTION' ? 65 : 15),
      btnPartnerStatus: `Mitra Resmi Bank BTN KC ${newProject.city}`,
      developerContact: {
        phone: newProject.phone || '0812-3456-7890',
        email: newProject.email || 'developer@perumahanmbr.id',
        pic: newProject.pic || 'Pengembang Perumahan'
      },
      isUserUploaded: true
    };

    const updatedProjects = [created, ...projects];
    setProjects(updatedProjects);

    // Save custom projects to localStorage
    try {
      const customOnly = updatedProjects.filter(p => p.isUserUploaded);
      localStorage.setItem('bangunin_custom_projects', JSON.stringify(customOnly));
    } catch (err) {
      console.error('Failed saving to localStorage', err);
    }

    setShowUploadModal(false);
    setUploadSuccessAlert(true);
    setTimeout(() => setUploadSuccessAlert(false), 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Success Alert Banner */}
      {uploadSuccessAlert && (
        <div style={{
          background: 'linear-gradient(135deg, #2b8a3e, #0ca678)',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(12,166,120,0.25)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={24} />
            <div>
              <strong style={{ fontSize: '1rem' }}>Proyek Perumahan MBR Berhasil Didaftarkan!</strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.85rem', opacity: 0.95 }}>
                Proyek Anda telah diverifikasi masuk ke dalam database nasional dan dapat langsung dicari, dikonfigurasi, serta diunduh brosur PDF-nya.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setUploadSuccessAlert(false)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>
      )}

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
              <Building2 color="#005BAA" size={28} /> Database Perumahan MBR Nasional Terverifikasi
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Katalog resmi perumahan MBR di seluruh Indonesia berbasis konstruksi hijau bambu & beton modular ramah gempa dengan verifikasi legalitas PBG/SLF dan fasilitas unduh brosur PDF.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', background: 'rgba(12,166,120,0.1)', padding: '8px 16px', borderRadius: '20px' }}>
              {filteredProjects.length} Proyek Ditemukan
            </span>

            {/* Upload Project Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                background: 'linear-gradient(135deg, #005BAA, #0ca678)',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '14px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0,91,170,0.25)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <PlusCircle size={18} /> Daftarkan Proyek MBR
            </button>
          </div>
        </div>

        {/* Search & Filter Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          
          {/* Keyword Search Input */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Cari Griya Asri, Pesona Kahuripan, Cilegon, Cikarang, Bambu, FLPP..."
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
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Province Filter */}
          <div>
            <select
              value={selectedProvince}
              onChange={e => {
                setSelectedProvince(e.target.value);
                setSelectedCity('ALL');
              }}
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
              <option value="ALL">🌐 Semua Provinsi</option>
              {provinces.filter(p => p !== 'ALL').map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
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

          {/* Status Filter */}
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
              <option value="PLANNED">Perencanaan / Izin</option>
            </select>
          </div>

          {/* Unit Tech Filter */}
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

        {/* Quick Search Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Pencarian Cepat:</span>
          {['Griya Asri', 'Pesona Kahuripan', 'Banten', 'Bogor', 'Cikarang', 'Jawa Tengah', 'Siap Huni', 'Ramah Gempa'].map((tag, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(tag)}
              style={{
                background: searchQuery === tag ? '#005BAA' : 'var(--bg-color)',
                color: searchQuery === tag ? '#fff' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              {tag}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedProvince('ALL');
                setSelectedCity('ALL');
                setSelectedStatus('ALL');
                setSelectedUnitType('ALL');
              }}
              style={{
                background: 'transparent',
                color: '#fa5252',
                border: 'none',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div style={{
          background: 'var(--bg-card)',
          padding: '60px 20px',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <AlertCircle size={48} color="#005BAA" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '8px' }}>
            Tidak ada perumahan MBR yang cocok dengan pencarian "{searchQuery}"
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 20px' }}>
            Anda dapat mereset filter atau langsung mendaftarkan perumahan MBR Anda ke database BaMbooChain.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedProvince('ALL');
                setSelectedCity('ALL');
                setSelectedStatus('ALL');
                setSelectedUnitType('ALL');
              }}
              className="btn btn-outline"
              style={{ padding: '10px 20px' }}
            >
              Tampilkan Semua Proyek
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
              style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #005BAA, #0ca678)' }}
            >
              <PlusCircle size={16} /> Daftarkan Proyek "{searchQuery}"
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredProjects.map(project => {
          const statusColors = {
            CONSTRUCTION: { bg: '#e7f5ff', text: '#1971c2', label: 'Sedang Dibangun' },
            COMPLETED: { bg: '#ebfbee', text: '#2b8a3e', label: 'Siap Huni (Ready)' },
            PLANNED: { bg: '#fff9db', text: '#f59f00', label: 'Tahap Perencanaan' }
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
                  <MapPin size={14} color="#fa5252" /> {project.city}, {project.province || 'Indonesia'}
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
                    <span style={{ color: 'var(--text-muted)' }}>Progres Konstruksi:</span>
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

                {/* PDF & Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <button
                    onClick={() => setPdfPreviewProject(project)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #005BAA',
                      background: 'rgba(0,91,170,0.06)',
                      color: '#005BAA',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={15} /> Brosur PDF
                  </button>

                  <button
                    onClick={() => setSelectedProject(project)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Eye size={15} /> Detail
                  </button>
                </div>

                <button
                  onClick={() => onSelectForConfigurator(project)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #005BAA, #0ca678)',
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
                  <SlidersHorizontal size={16} /> Konfigurasi Rumah & Simulasi KPR
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ────────── PROJECT DETAIL MODAL ────────── */}
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
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: '#e7f5ff', color: '#1971c2', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {selectedProject.city}, {selectedProject.province}
                </span>
                <span style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  No. Izin: {selectedProject.permitNumber}
                </span>
                <span style={{ background: '#fff9db', color: '#f59f00', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {selectedProject.subsidyType}
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
                {selectedProject.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                Pengembang: <strong>{selectedProject.developer}</strong> • {selectedProject.btnPartnerStatus}
              </p>
            </div>

            {/* Gallery Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
              {selectedProject.gallery && selectedProject.gallery.slice(0, 3).map((img, idx) => (
                <img key={idx} src={img} alt="galeri" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ))}
            </div>

            {/* Price & Unit Details Banner */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              background: 'var(--bg-color)',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              marginBottom: '24px'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rentang Harga MBR</span>
                <strong style={{ fontSize: '1.1rem', color: '#005BAA' }}>
                  {formatRupiah(selectedProject.priceMin)} - {formatRupiah(selectedProject.priceMax)}
                </strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Unit</span>
                <strong style={{ fontSize: '1.1rem', color: selectedProject.availableUnits > 0 ? '#2b8a3e' : '#fa5252' }}>
                  {selectedProject.availableUnits} Tersedia dari {selectedProject.totalUnits} Unit
                </strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tipe & Teknologi Unit</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {selectedProject.unitTypes.join(', ')}
                </strong>
              </div>
            </div>

            {/* Description & Features */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>
                Deskripsi Kawasan & Konsep Konstruksi
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 16px' }}>
                {selectedProject.description}
              </p>

              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '10px' }}>
                Fasilitas & Keunggulan Kawasan
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {selectedProject.features.map((feat, i) => (
                  <span key={i} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="var(--primary)" /> {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* PDF Brochure & Legal Documents Section */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '16px 20px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              marginBottom: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#005BAA" /> Dokumen & Brosur Resmi (PDF)
                </strong>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Unduh brosur digital, denah site plan, tabel cicilan KPR BTN FLPP, dan bukti perizinan PBG/SLF.
                </p>
              </div>

              <button
                onClick={() => {
                  const pr = selectedProject;
                  setSelectedProject(null);
                  setPdfPreviewProject(pr);
                }}
                style={{
                  background: 'linear-gradient(135deg, #005BAA, #004080)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={16} /> Buka & Unduh Brosur PDF
              </button>
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
                    background: 'linear-gradient(135deg, #005BAA, #0ca678)',
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

      {/* ────────── PDF BROCHURE & DOCUMENT PREVIEW MODAL ────────── */}
      {pdfPreviewProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 100020,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            color: '#1a1a1a',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '36px',
            position: 'relative',
            boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {/* Modal Controls */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => window.print()}
                title="Cetak PDF / Simpan Dokumen"
                style={{
                  background: '#005BAA',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={16} /> Cetak / Print PDF
              </button>
              <button
                onClick={() => setPdfPreviewProject(null)}
                style={{
                  background: '#f1f3f5',
                  border: 'none',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Official PDF Document Header */}
            <div style={{ borderBottom: '3px double #005BAA', paddingBottom: '18px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#005BAA', fontWeight: '900', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
                    🏢 BAMBOOCHAIN • BANGUNIN
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#555', fontWeight: '600' }}>
                    LEMBAR FAKTA & BROSUR RESMI PERUMAHAN MBR NASIONAL
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#666' }}>
                  <div>Mitra Pembiayaan: <strong>Bank BTN (Persero) Tbk</strong></div>
                  <div>Regulasi: <strong>PUPR / BP Tapera FLPP</strong></div>
                  <div>Dokumen ID: <strong>{pdfPreviewProject.id.toUpperCase()}</strong></div>
                </div>
              </div>
            </div>

            {/* Project Title Banner */}
            <div style={{ background: '#f8f9fa', borderLeft: '5px solid #0ca678', padding: '16px 20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h1 style={{ margin: '0 0 6px', fontSize: '1.6rem', color: '#005BAA', fontWeight: '800' }}>
                {pdfPreviewProject.name}
              </h1>
              <div style={{ fontSize: '0.9rem', color: '#444' }}>
                📍 {pdfPreviewProject.address} • {pdfPreviewProject.city}, {pdfPreviewProject.province}
              </div>
            </div>

            {/* Two Column Document Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Left Column: Specs & Developer */}
              <div>
                <h3 style={{ fontSize: '1rem', color: '#005BAA', borderBottom: '1px solid #ddd', paddingBottom: '6px', marginBottom: '12px' }}>
                  1. Informasi Pengembang & Legalitas
                </h3>
                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', marginBottom: '16px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '6px 0', color: '#666', width: '40%' }}>Pengembang</td>
                      <td style={{ padding: '6px 0', fontWeight: 'bold' }}>{pdfPreviewProject.developer}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '6px 0', color: '#666' }}>No. Izin PBG / SLF</td>
                      <td style={{ padding: '6px 0', fontWeight: 'bold', color: '#2b8a3e' }}>{pdfPreviewProject.permitNumber}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '6px 0', color: '#666' }}>Mitra Perbankan</td>
                      <td style={{ padding: '6px 0', fontWeight: 'bold' }}>{pdfPreviewProject.btnPartnerStatus}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '6px 0', color: '#666' }}>Status Pembangunan</td>
                      <td style={{ padding: '6px 0', fontWeight: 'bold' }}>{pdfPreviewProject.status} ({pdfPreviewProject.progressPercentage}%)</td>
                    </tr>
                  </tbody>
                </table>

                <h3 style={{ fontSize: '1rem', color: '#005BAA', borderBottom: '1px solid #ddd', paddingBottom: '6px', marginBottom: '12px' }}>
                  2. Fasilitas & Fitur Unggulan
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#444', lineHeight: '1.6' }}>
                  {pdfPreviewProject.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Pricing & KPR Simulation */}
              <div>
                <h3 style={{ fontSize: '1rem', color: '#005BAA', borderBottom: '1px solid #ddd', paddingBottom: '6px', marginBottom: '12px' }}>
                  3. Skema Pembiayaan & KPR BTN FLPP
                </h3>
                
                <div style={{ background: '#e7f5ff', padding: '12px 16px', borderRadius: '8px', marginBottom: '14px', border: '1px solid #d0ebff' }}>
                  <div style={{ fontSize: '0.75rem', color: '#1971c2', fontWeight: 'bold' }}>HARGA JUAL UNIT SUBSIDI MBR</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA' }}>
                    {formatRupiah(pdfPreviewProject.priceMin)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#555' }}>DP Mulai 1% (± {formatRupiah(pdfPreviewProject.priceMin * 0.01)}) • Bunga Tetap 5% Fixed</div>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#333' }}>
                  Estimasi Angsuran Bulanan KPR BTN:
                </div>
                <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  <thead>
                    <tr style={{ background: '#f1f3f5' }}>
                      <th style={{ padding: '6px', border: '1px solid #dee2e6' }}>Tenor</th>
                      <th style={{ padding: '6px', border: '1px solid #dee2e6' }}>Suku Bunga</th>
                      <th style={{ padding: '6px', border: '1px solid #dee2e6' }}>Angsuran / Bulan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>10 Tahun</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>5.0% Fixed</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', fontWeight: 'bold', color: '#005BAA' }}>Rp 1.765.000</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>15 Tahun</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>5.0% Fixed</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', fontWeight: 'bold', color: '#005BAA' }}>Rp 1.315.000</td>
                    </tr>
                    <tr style={{ background: '#e6fcf5' }}>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>20 Tahun</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6' }}>5.0% Fixed</td>
                      <td style={{ padding: '6px', border: '1px solid #dee2e6', fontWeight: 'bold', color: '#0ca678' }}>Rp 1.095.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Document Footer & QR Verification */}
            <div style={{ borderTop: '2px solid #eee', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#777' }}>
              <div>
                <div>Dokumen ini sah dan diterbitkan secara digital melalui <strong>BaMbooChain BangunIn</strong>.</div>
                <div>Kontak Pemasaran: {pdfPreviewProject.developerContact.pic} ({pdfPreviewProject.developerContact.phone})</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-block', background: '#0ca678', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                  ✓ VERIFIED MBR DATABASE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────── UPLOAD MBR HOUSING PROJECT MODAL ────────── */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.65)',
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
            maxWidth: '750px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={() => setShowUploadModal(false)}
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

            {/* Form Title */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,91,170,0.1)', color: '#005BAA', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
                <PlusCircle size={15} /> Registrasi & Publikasi Perumahan
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
                Daftarkan Proyek Perumahan MBR
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Publikasikan perumahan MBR Anda ke ekosistem nasional BaMbooChain & Bank BTN. Tersedia untuk status tahap perencanaan, konstruksi, maupun siap huni.
              </p>
            </div>

            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Section 1: Project Basic Info */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
                  1. Informasi Dasar Proyek & Status
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      Nama Perumahan MBR *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Griya Asri Harmoni 2"
                      value={newProject.name}
                      onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      Status Pembangunan *
                    </label>
                    <select
                      value={newProject.status}
                      onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    >
                      <option value="PLANNED">📝 Tahap Perencanaan / Izin</option>
                      <option value="CONSTRUCTION">🏗️ Sedang Dibangun (Dalam Konstruksi)</option>
                      <option value="COMPLETED">🏡 Selesai / Siap Huni (Ready Stock)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Developer & Contact */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
                  2. Data Pengembang (Developer)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      PT / Badan Usaha Pengembang *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="PT. Griya Asri Pratama"
                      value={newProject.developer}
                      onChange={e => setNewProject({ ...newProject, developer: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      Nama PIC / Sales
                    </label>
                    <input 
                      type="text"
                      placeholder="Ir. H. Budi Santoso"
                      value={newProject.pic}
                      onChange={e => setNewProject({ ...newProject, pic: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      No. WhatsApp / Telp *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="0812-3456-7890"
                      value={newProject.phone}
                      onChange={e => setNewProject({ ...newProject, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Location */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
                  3. Lokasi & Alamat
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      Provinsi *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Jawa Barat / Banten / Jawa Timur"
                      value={newProject.province}
                      onChange={e => setNewProject({ ...newProject, province: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      Kota / Kabupaten *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Cilegon / Karawang / Bogor"
                      value={newProject.city}
                      onChange={e => setNewProject({ ...newProject, city: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      No. Izin PBG / SLF
                    </label>
                    <input 
                      type="text"
                      placeholder="PBG-320108-2026-XXXX"
                      value={newProject.permitNumber}
                      onChange={e => setNewProject({ ...newProject, permitNumber: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                    Alamat Lengkap Kawasan
                  </label>
                  <input 
                    type="text"
                    placeholder="Jl. Raya Utama KM 5, Kelurahan/Desa..."
                    value={newProject.address}
                    onChange={e => setNewProject({ ...newProject, address: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Section 4: Units, Price & Subsidy */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
                  4. Harga, Unit & Skema Subsidi
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      Harga Jual Minimum (Rp)
                    </label>
                    <input 
                      type="number"
                      value={newProject.priceMin}
                      onChange={e => setNewProject({ ...newProject, priceMin: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      Total Unit
                    </label>
                    <input 
                      type="number"
                      value={newProject.totalUnits}
                      onChange={e => setNewProject({ ...newProject, totalUnits: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      Unit Tersedia
                    </label>
                    <input 
                      type="number"
                      value={newProject.availableUnits}
                      onChange={e => setNewProject({ ...newProject, availableUnits: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                      Skema Subsidi KPR
                    </label>
                    <select
                      value={newProject.subsidyType}
                      onChange={e => setNewProject({ ...newProject, subsidyType: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    >
                      <option value="KPR BTN FLPP Sejahtera">KPR BTN FLPP Sejahtera</option>
                      <option value="KPR BTN BP Tapera">KPR BTN BP Tapera</option>
                      <option value="KPR BTN Pekerja Industri">KPR BTN Pekerja Industri</option>
                      <option value="KPR BTN Mikro Perumahan">KPR BTN Mikro Perumahan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 5: Files & PDF Upload */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
                  5. Upload Foto & Dokumen Brosur PDF
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {/* Photo Upload */}
                  <div style={{ border: '2px dashed var(--border-color)', padding: '16px', borderRadius: '14px', textAlign: 'center', background: 'var(--bg-color)' }}>
                    <UploadCloud size={28} color="#005BAA" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '4px' }}>
                      Foto Cover / Kawasan
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ fontSize: '0.75rem', width: '100%' }}
                    />
                  </div>

                  {/* PDF Brochure Upload */}
                  <div style={{ border: '2px dashed var(--border-color)', padding: '16px', borderRadius: '14px', textAlign: 'center', background: 'var(--bg-color)' }}>
                    <FileText size={28} color="#0ca678" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '4px' }}>
                      File Brosur / Dokumen (PDF)
                    </div>
                    <input 
                      type="file" 
                      accept=".pdf,application/pdf"
                      onChange={handlePdfUpload}
                      style={{ fontSize: '0.75rem', width: '100%' }}
                    />
                    {newProject.pdfFileName && (
                      <div style={{ fontSize: '0.75rem', color: '#2b8a3e', marginTop: '4px', fontWeight: 'bold' }}>
                        ✓ {newProject.pdfFileName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #005BAA, #0ca678)',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <PlusCircle size={18} /> Simpan & Publikasikan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
