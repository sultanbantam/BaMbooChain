import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Factory, Cpu, GraduationCap, Landmark, ArrowRight, ShieldCheck, Building, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { createKnowledgeItem } from '../utils/knowledgeService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const PartnersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [userPartners, setUserPartners] = useState(() => {
    const saved = localStorage.getItem('bamboochain_user_partners');
    return saved ? JSON.parse(saved) : [];
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'komunitas', categoryLainnya: '', desc: '', file: null, fileName: '', fileUrl: '', logoFile: null, logoFileName: '', logoUrl: '' });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('bamboochain_user_partners', JSON.stringify(userPartners));
  }, [userPartners]);

  const partnerCategories_id = [
    {
      id: 'komunitas',
      title: 'Komunitas & Masyarakat Adat',
      icon: <Users size={32} />,
      color: '#0ca678',
      bgColor: 'rgba(12, 166, 120, 0.1)',
      description: 'Membangun pemberdayaan ekonomi riil yang bersinergi dengan kearifan lokal dan penjagaan alam.',
      partners: [
        { name: 'Kasepuhan Cibarani, Lebak Banten', desc: 'Menyiapkan 490 Ha - 20.000 Ha tanah adat untuk dijadikan Perkebunan Emas Hijau.' },
        { name: 'Pokdarwis Ekowisata Keranggan', desc: 'Penggerak kesadaran wisata alam dan edukasi ekologi lokal.' },
        { name: 'Komunitas Bambu Nusantara', desc: 'Jejaring penggiat dan pelestari bambu di seluruh Indonesia.' },
        { name: 'Yayasan Kinarya Anak Bangsa', desc: 'Penggerak pemberdayaan komunitas dan edukasi sosial berkelanjutan.' },
        { name: 'Kampung Konservasi RIMBUN', desc: 'Rakyat Indonesia Membangun.' }
      ]
    },
    {
      id: 'industri',
      title: 'Industri, Bisnis & Manufaktur',
      icon: <Factory size={32} />,
      color: '#f59f00',
      bgColor: 'rgba(245, 159, 0, 0.1)',
      description: 'Membuka rantai pasok hilirisasi komoditas mentah menjadi produk bernilai tinggi untuk pasar domestik dan global.',
      partners: [
        { name: 'PT. Mediasi Sarana Nusa', desc: 'Pengembangan arsitektur Rumah Modular Blockwood menjadi Blockbamboo.' },
        { name: 'Minamoto LLC, Japan', desc: 'Penetrasi bisnis dan distribusi produk bambu unggulan antara Indonesia dan Jepang.' },
        { name: 'PT. Bamboo Republik Indonesia', desc: 'Pionir dalam manufaktur dan produksi Bambu Laminasi berstandar industri.' },
        { name: 'PERPUBI', desc: 'Perkumpulan Pelaku Usaha Bambu Indonesia.' },
        { 
          name: 'PT. Inakaz Citraniaga Internasional', 
          desc: 'Mitra strategis dalam pengembangan teknologi informasi dan platform digital.',
          since: 'Mulai Kolaborasi: Agustus 2024',
          focus: 'Fokus Area: Teknologi Informasi dan Platform Digital.'
        },
        { name: 'PT. Bambu Pedoman Indonesia (BAMBUPEDIA)', desc: 'Platform pedoman dan standarisasi ekosistem bambu.' },
        { name: 'PT. Gemma Bambu Nusantara', desc: 'Inovasi pengembangan ekosistem bambu terintegrasi.' },
        { name: 'PT. Patanjala Bambu Nusa', desc: 'Pengembangan manufaktur dan produk bambu berkelanjutan.' }
      ]
    },
    {
      id: 'teknologi',
      title: 'Teknologi & Digital',
      icon: <Cpu size={32} />,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      description: 'Integrasi pemantauan presisi, digitalisasi, dan pemetaan geospasial berbasis satelit.',
      partners: [
        { name: 'PT. Inovasi Mandiri Pratama', desc: 'Pemanfaatan Teknologi Drone dan Aplikasi untuk pengawasan Perkebunan Emas Hijau di Kasepuhan Cibarani.' },
        { name: 'Skalainfo', desc: 'Penyedia infrastruktur informasi dan pengolahan data strategis.' },
        { name: 'Tokeninid', desc: 'Penyedia infrastruktur Web3 dan tokenisasi aset digital.' }
      ]
    },
    {
      id: 'akademisi',
      title: 'Akademisi & Riset',
      icon: <GraduationCap size={32} />,
      color: '#845ef7',
      bgColor: 'rgba(132, 94, 247, 0.1)',
      description: 'Meningkatkan kualitas riset benih, kultur jaringan, dan inovasi turunan berbasis ilmiah murni.',
      partners: [
        { name: 'PKR Bambu', desc: 'Pusat Kolaborasi Riset khusus untuk studi dan pengembangan spesies bambu tropis.' },
        { name: 'Universitas Pradipta', desc: 'Mitra perguruan tinggi untuk validasi akademik dan inkubator inovasi mahasiswa.' },
        { name: 'Universitas Sultan Ageng Tirtayasa (UNTIRTA)', desc: 'Pengembangan riset akademik lokal strategis.' },
        { name: 'Universitas Islam Negeri (UIN) Maulana Hasanuddin', desc: 'Sinergi riset ekologi dan pemberdayaan sosial kultural.' },
        { name: 'Universitas Indonesia (UI) Prodi Teknik Arsitektur', desc: 'Riset desain arsitektural berbasis material bambu.' },
        { name: 'Institute Teknologi Bandung (ITB) Prodi Teknik Arsitektur', desc: 'Inovasi rekayasa dan teknologi struktur bambu.' },
        { name: 'IPB University', desc: 'Pusat keunggulan riset botani dan agrikultur berkelanjutan.' }
      ]
    },
    {
      id: 'finansial',
      title: 'Finansial & Lembaga Pendanaan',
      icon: <Landmark size={32} />,
      color: '#e03131',
      bgColor: 'rgba(224, 49, 49, 0.1)',
      description: 'Dukungan aliran kapital, perbankan, dan audit finansial untuk skala operasional raksasa.',
      partners: [
        { name: 'PT. Bank Mizuho Indonesia', desc: 'Dukungan perbankan internasional dan ekosistem keuangan korporat.' },
        { name: 'BAZNAS Kota Tangerang Selatan', desc: 'Lembaga penyalur dana zakat dan CSR untuk pemberdayaan umat melalui jalur ekologi.' }
      ]
    },
    {
      id: 'pemerintah',
      title: 'Pemerintah & Regulasi',
      icon: <Building size={32} />,
      color: '#0b7285',
      bgColor: 'rgba(11, 114, 133, 0.1)',
      description: 'Penyelarasan kebijakan regulasi, dukungan birokrasi, dan legitimasi program konservasi berskala nasional.',
      partners: [
        { name: 'Pemerintah Provinsi Banten', desc: 'Dukungan regulasi tata ruang wilayah untuk pelestarian emas hijau.' },
        { name: 'Pemerintah Kota Tangerang Selatan', desc: 'Sinergi program lingkungan perkotaan dan pemberdayaan.' },
        { name: 'Pemerintah Kabupaten Tangerang', desc: 'Dukungan infrastruktur tata ruang dan konservasi lokal.' },
        { name: 'BAPPENAS', desc: 'Kementerian Perencanaan Pembangunan Nasional / Badan Perencanaan Pembangunan Nasional.' },
        { name: 'BPDLH', desc: 'Badan Pengelola Dana Lingkungan Hidup.' },
        { name: 'Badan Gizi Nasional', desc: 'Sinergi program ketahanan pangan dan gizi nasional berbasis komoditas alam.' }
      ]
    }
  ];

  const partnerCategories_en = [
    {
      id: 'komunitas',
      title: 'Community & Indigenous People',
      icon: <Users size={32} />,
      color: '#0ca678',
      bgColor: 'rgba(12, 166, 120, 0.1)',
      description: 'Building real economic empowerment that synergizes with local wisdom and nature conservation.',
      partners: [
        { name: 'Kasepuhan Cibarani, Lebak Banten', desc: 'Preparing 490 Ha - 20,000 Ha of customary land to become Green Gold Plantations.' },
        { name: 'Pokdarwis Ekowisata Keranggan', desc: 'Driver of ecotourism awareness and local ecological education.' },
        { name: 'Komunitas Bambu Nusantara', desc: 'Network of bamboo enthusiasts and conservationists across Indonesia.' },
        { name: 'Yayasan Kinarya Anak Bangsa', desc: 'Driver of community empowerment and sustainable social education.' },
        { name: 'Kampung Konservasi RIMBUN', desc: 'Indonesian People Building Conservation Village.' }
      ]
    },
    {
      id: 'industri',
      title: 'Industry, Business & Manufacturing',
      icon: <Factory size={32} />,
      color: '#f59f00',
      bgColor: 'rgba(245, 159, 0, 0.1)',
      description: 'Opening the downstream supply chain of raw commodities into high-value products for domestic and global markets.',
      partners: [
        { name: 'PT. Mediasi Sarana Nusa', desc: 'Development of Blockwood Modular House architecture into Blockbamboo.' },
        { name: 'Minamoto LLC, Japan', desc: 'Business penetration and distribution of premium bamboo products between Indonesia and Japan.' },
        { name: 'PT. Bamboo Republik Indonesia', desc: 'Pioneer in the manufacturing and production of industry-standard Laminated Bamboo.' },
        { name: 'PERPUBI', desc: 'Association of Indonesian Bamboo Business Actors.' },
        { 
          name: 'PT. Inakaz Citraniaga Internasional', 
          desc: 'Strategic partner in the development of information technology and digital platforms.',
          since: 'Collaboration Started: August 2024',
          focus: 'Focus Area: Information Technology and Digital Platforms.'
        },
        { name: 'PT. Bambu Pedoman Indonesia (BAMBUPEDIA)', desc: 'Platform for bamboo ecosystem guidelines and standardization.' },
        { name: 'PT. Gemma Bambu Nusantara', desc: 'Innovation in integrated bamboo ecosystem development.' },
        { name: 'PT. Patanjala Bambu Nusa', desc: 'Development of sustainable bamboo manufacturing and products.' }
      ]
    },
    {
      id: 'teknologi',
      title: 'Technology & Digital',
      icon: <Cpu size={32} />,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      description: 'Integration of precision monitoring, digitalization, and satellite-based geospatial mapping.',
      partners: [
        { name: 'PT. Inovasi Mandiri Pratama', desc: 'Utilization of Drone Technology and Applications for monitoring the Green Gold Plantation in Kasepuhan Cibarani.' },
        { name: 'Skalainfo', desc: 'Provider of information infrastructure and strategic data processing.' },
        { name: 'Tokeninid', desc: 'Provider of Web3 infrastructure and digital asset tokenization.' }
      ]
    },
    {
      id: 'akademisi',
      title: 'Academics & Research',
      icon: <GraduationCap size={32} />,
      color: '#845ef7',
      bgColor: 'rgba(132, 94, 247, 0.1)',
      description: 'Improving the quality of seed research, tissue culture, and purely scientific-based derivative innovations.',
      partners: [
        { name: 'PKR Bambu', desc: 'Specialized Collaborative Research Center for the study and development of tropical bamboo species.' },
        { name: 'Universitas Pradipta', desc: 'University partner for academic validation and student innovation incubator.' },
        { name: 'Universitas Sultan Ageng Tirtayasa (UNTIRTA)', desc: 'Development of strategic local academic research.' },
        { name: 'Universitas Islam Negeri (UIN) Maulana Hasanuddin', desc: 'Synergy of ecological research and socio-cultural empowerment.' },
        { name: 'Universitas Indonesia (UI) Architecture Engineering', desc: 'Research on architectural design based on bamboo material.' },
        { name: 'Institute Teknologi Bandung (ITB) Architecture Engineering', desc: 'Innovation in bamboo structural engineering and technology.' },
        { name: 'IPB University', desc: 'Center of excellence for botanical research and sustainable agriculture.' }
      ]
    },
    {
      id: 'finansial',
      title: 'Finance & Funding Institutions',
      icon: <Landmark size={32} />,
      color: '#e03131',
      bgColor: 'rgba(224, 49, 49, 0.1)',
      description: 'Capital flow support, banking, and financial audits for giant operational scales.',
      partners: [
        { name: 'PT. Bank Mizuho Indonesia', desc: 'International banking support and corporate financial ecosystem.' },
        { name: 'BAZNAS South Tangerang', desc: 'Distributor of zakat and CSR funds for community empowerment through ecological channels.' }
      ]
    },
    {
      id: 'pemerintah',
      title: 'Government & Regulation',
      icon: <Building size={32} />,
      color: '#0b7285',
      bgColor: 'rgba(11, 114, 133, 0.1)',
      description: 'Alignment of regulatory policies, bureaucratic support, and legitimacy of national-scale conservation programs.',
      partners: [
        { name: 'Banten Provincial Government', desc: 'Spatial planning regulation support for green gold preservation.' },
        { name: 'South Tangerang City Government', desc: 'Synergy of urban environmental programs and empowerment.' },
        { name: 'Tangerang Regency Government', desc: 'Support for spatial planning infrastructure and local conservation.' },
        { name: 'BAPPENAS', desc: 'Ministry of National Development Planning / National Development Planning Agency.' },
        { name: 'BPDLH', desc: 'Environmental Fund Management Agency.' },
        { name: 'National Nutrition Agency', desc: 'Synergy of national food and nutrition security programs based on natural commodities.' }
      ]
    }
  ];

  const { language } = useLanguage();
  const baseCategories = language === 'en' ? partnerCategories_en : partnerCategories_id;

  const lainnyaPartners = userPartners.filter(p => p.category === 'lainnya').map(p => ({
    ...p,
    isUserSubmitted: true
  }));

  const partnerCategories = [
    ...baseCategories.map(cat => ({
      ...cat,
      partners: [
        ...cat.partners,
        ...userPartners.filter(p => p.category === cat.id).map(p => ({
          ...p,
          isUserSubmitted: true
        }))
      ]
    })),
    ...(lainnyaPartners.length > 0 ? [{
      id: 'lainnya',
      title: 'Lainnya',
      icon: <Users size={32} />,
      color: '#495057',
      bgColor: 'rgba(73, 80, 87, 0.1)',
      description: 'Mitra dari berbagai bidang dan bentuk lembaga lainnya.',
      partners: lainnyaPartners
    }] : [])
  ];

  const handleViewProfile = (partner) => {
    if (!isAuthenticated) {
      navigate('/contact', { state: { from: 'partners', message: t('partners_login_msg') } });
      return;
    }
    setSelectedPartner(partner);
  };

  const handleEditProfile = (partner) => {
    setEditData(partner);
    setFormData({ name: partner.name, category: partner.category || 'komunitas', categoryLainnya: partner.categoryLainnya || '', desc: partner.desc || '', file: null, fileName: partner.fileName || '', fileUrl: partner.fileUrl || '', logoFile: null, logoFileName: partner.logoFileName || '', logoUrl: partner.logoUrl || '' });
    setIsEditing(true);
  };

  const handleDeleteProfile = (partnerId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mitra ini?')) {
      setUserPartners(prev => prev.filter(p => p.id !== partnerId));
    }
  };

  const handleSaveProfile = () => {
    if (editData?.isUserSubmitted) {
      setUserPartners(prev => prev.map(p => 
        p.id === editData.id ? { ...p, name: formData.name, category: formData.category, categoryLainnya: formData.categoryLainnya, desc: formData.desc, fileName: formData.fileName, fileUrl: formData.fileUrl, logoFileName: formData.logoFileName, logoUrl: formData.logoUrl } : p
      ));
    }
    setIsEditing(false);
    alert(t('partners_alert_saved') || 'Tersimpan!');
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/contact', { state: { from: 'partners', message: 'Silakan login terlebih dahulu untuk mendaftar menjadi mitra.' } });
      return;
    }
    setFormData({ name: '', category: 'komunitas', categoryLainnya: '', desc: '', file: null, fileName: '', fileUrl: '', logoFile: null, logoFileName: '', logoUrl: '' });
    setIsRegistering(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Format dokumen harus PDF.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran dokumen maksimal 10MB.');
        return;
      }
      setFormData({ ...formData, file, fileName: file.name });
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Format logo harus JPG/JPEG/PNG.');
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        alert('Ukuran logo maksimal 1MB.');
        return;
      }
      setFormData({ ...formData, logoFile: file, logoFileName: file.name });
    }
  };

  const handleRegisterSubmit = async () => {
    if (!formData.name || !formData.desc || !formData.fileName) {
      alert('Harap lengkapi semua kolom dan unggah dokumen PDF.');
      return;
    }
    if (formData.category === 'lainnya' && !formData.categoryLainnya) {
      alert('Harap isi bentuk lembaga (lainnya).');
      return;
    }
    
    setIsUploading(true);
    try {
      let finalLogoUrl = '';
      if (formData.logoFile) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const uploadData = new FormData();
        uploadData.append('file', formData.logoFile);
        uploadData.append('upload_preset', uploadPreset);
        const res = await fetch(url, { method: 'POST', body: uploadData });
        const data = await res.json();
        finalLogoUrl = data.secure_url || '';
      }

      const finalCategory = formData.category === 'lainnya' ? formData.categoryLainnya : formData.category;
      
      const docRef = await createKnowledgeItem({
        form: {
          title: formData.name,
          type: 'Mitra',
          summary: formData.desc,
          extractedText: formData.desc,
          tags: 'Mitra, ' + finalCategory,
        },
        file: formData.file,
        user: user,
      });

      // Fetch newly created doc to get fileUrl
      const docSnap = await getDoc(doc(db, 'knowledge_items', docRef.id));
      const fileUrl = docSnap.exists() ? docSnap.data().fileUrl : '';

      const newPartner = {
        id: docRef.id,
        userId: user.id,
        name: formData.name,
        category: formData.category,
        categoryLainnya: formData.categoryLainnya,
        desc: formData.desc,
        fileName: formData.fileName,
        fileUrl: fileUrl,
        logoFileName: formData.logoFileName,
        logoUrl: finalLogoUrl,
        createdAt: new Date().toISOString(),
        isUserSubmitted: true
      };
      
      setUserPartners(prev => [...prev, newPartner]);
      setIsRegistering(false);
      alert('Pendaftaran mitra berhasil disubmit dan data telah terintegrasi ke sistem Bambupedia!');
    } catch (err) {
      console.error(err);
      alert('Gagal mendaftarkan mitra: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container">
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px', animation: isVisible ? 'fadeInUp 0.8s ease-out' : 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '24px' }}>
            <ShieldCheck size={18} /> {t('partners_badge')}
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.2' }}>{t('partners_title')}</h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            {t('partners_desc')}
          </p>
          <div style={{ marginTop: '30px' }}>
            <button 
              onClick={handleRegisterClick}
              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(12, 166, 120, 0.3)', transition: '0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Plus size={20} /> Daftar Menjadi Mitra
            </button>
          </div>
        </div>

        {/* Partners Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginBottom: '100px' }}>
          {partnerCategories.map((category, index) => (
            <div 
              key={category.id} 
              style={{ 
                background: 'white', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                animation: isVisible ? `slideIn 0.6s ${index * 0.15}s both` : 'none'
              }}
            >
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px', borderBottom: '1px solid #f1f3f5' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: category.bgColor, color: category.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {category.icon}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: '0 0 8px 0' }}>{category.title}</h2>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem' }}>{category.description}</p>
                </div>
              </div>

              {/* Category Items */}
              <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {category.partners.map((partner, pIndex) => (
                  <div key={pIndex} style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', borderLeft: `4px solid ${category.color}`, transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="partner-card">
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 8px 0', lineHeight: '1.4' }}>{partner.name}</h3>
                      {partner.desc && (
                        <p style={{ color: 'var(--text-muted)', margin: '0 0 16px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>{partner.desc}</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleViewProfile(partner)}
                        style={{ background: 'white', border: `1px solid ${category.color}`, color: category.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t('partners_btn_view')}
                      </button>
                      {partner.isUserSubmitted && isAuthenticated && partner.userId === user?.id ? (
                        <>
                          <button 
                            onClick={() => handleEditProfile(partner)}
                            style={{ background: category.color, border: 'none', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProfile(partner.id)}
                            style={{ background: '#e03131', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>
                            Hapus
                          </button>
                        </>
                      ) : (
                        isAuthenticated && (user?.role === 'partner' || user?.email?.includes('admin')) && (
                          <button 
                            onClick={() => handleEditProfile(partner)}
                            style={{ background: category.color, border: 'none', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>
                            {t('partners_btn_edit')}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #087f5b 100%)', color: 'white', padding: '60px 40px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(12, 166, 120, 0.2)' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold' }}>{t('partners_cta_title')}</h2>
          <p style={{ fontSize: '1.1rem', opacity: '0.9', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            {t('partners_cta_desc')}
          </p>
          <button 
            onClick={() => navigate('/contact')} 
            style={{ background: 'white', color: 'var(--primary)', padding: '16px 40px', borderRadius: '50px', fontSize: '1.1rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: '0.2s', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {t('partners_cta_btn')} <ArrowRight size={20} />
          </button>
        </div>
        
      </div>

      {/* PARTNER PROFILE MODAL */}
      {selectedPartner && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '24px', maxWidth: '600px', width: '100%', padding: '40px', position: 'relative', animation: 'zoomIn 0.3s' }}>
            <button onClick={() => setSelectedPartner(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <div style={{ width: '80px', height: '80px', background: '#f1f3f5', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', overflow: 'hidden' }}>
                {selectedPartner.logoUrl ? (
                  <img src={selectedPartner.logoUrl} alt={selectedPartner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Building size={40} />
                )}
              </div>
              <div>
                <h2 style={{ margin: 0, color: 'var(--text-main)' }}>{selectedPartner.name}</h2>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>{t('partners_modal_verified')}</span>
              </div>
            </div>
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '10px' }}>{t('partners_modal_about')}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{selectedPartner.desc || "Deskripsi lengkap mitra strategis Yayasan Sabumi Nusantara Jaya dalam pengembangan ekosistem ekonomi hijau."}</p>
              
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '20px', marginBottom: '10px' }}>{t('partners_modal_collab')}</h3>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>{t('partners_modal_status')}</li>
                <li>{selectedPartner.since || t('partners_modal_since')}</li>
                <li>{selectedPartner.focus || t('partners_modal_focus')}</li>
              </ul>
              
              {selectedPartner.isUserSubmitted && selectedPartner.fileName && (
                <div style={{ marginTop: '20px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Dokumen Terlampir:</span>
                  <div style={{ background: '#f8f9fa', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem' }}>📄 {selectedPartner.fileName}</span>
                    {selectedPartner.fileUrl ? (
                      <a href={selectedPartner.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>Lihat / Unduh Dokumen</a>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#868e96' }}>(Tersimpan)</span>
                    )}
                  </div>
                </div>
              )}

              {selectedPartner.name.includes('Cibarani') && (
                <div style={{ marginTop: '24px', padding: '18px', background: 'rgba(12, 166, 120, 0.05)', borderRadius: '16px', border: '1px dashed var(--primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> {t('partners_modal_mou_title')}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {t('partners_modal_mou_desc')}
                  </p>
                  <a 
                    href="./assets/pedoman/moucibarani.pdf" 
                    download="moucibarani.pdf"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '8px', 
                      background: 'var(--primary)', 
                      color: 'white', 
                      padding: '12px 16px', 
                      borderRadius: '10px', 
                      textDecoration: 'none', 
                      fontWeight: 'bold', 
                      fontSize: '0.88rem',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(12,166,120,0.15)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#0b8a63'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
                  >
                    {t('partners_modal_mou_btn')}
                  </a>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSelectedPartner(null)}
              style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              {t('partners_modal_close')}
            </button>
          </div>
        </div>
      )}

      {/* REGISTER / EDIT PROFILE MODAL */}
      {(isEditing || isRegistering) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '24px', maxWidth: '600px', width: '100%', padding: '40px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '30px', color: 'var(--text-main)' }}>{isRegistering ? 'Pendaftaran Mitra Baru' : t('partners_edit_title')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Nama Mitra</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da' }} 
                  disabled={isEditing && !editData?.isUserSubmitted}
                />
              </div>
              {(isRegistering || (isEditing && editData?.isUserSubmitted)) && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Bentuk Lembaga</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da', background: 'white' }}
                    >
                      <option value="komunitas">Komunitas & Masyarakat Adat</option>
                      <option value="industri">Industri, Bisnis & Manufaktur</option>
                      <option value="teknologi">Teknologi & Digital</option>
                      <option value="akademisi">Akademisi & Riset</option>
                      <option value="finansial">Finansial & Lembaga Pendanaan</option>
                      <option value="pemerintah">Pemerintah & Regulasi</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  {formData.category === 'lainnya' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Tuliskan Bentuk Lembaga (Lainnya)</label>
                      <input 
                        type="text" 
                        value={formData.categoryLainnya} 
                        onChange={(e) => setFormData({ ...formData, categoryLainnya: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da' }} 
                        placeholder="Misal: Yayasan Sosial, NGO, dll"
                        disabled={isEditing && !editData?.isUserSubmitted}
                      />
                    </div>
                  )}
                </>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Deskripsi</label>
                <textarea 
                  rows="4" 
                  value={formData.desc} 
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da' }}
                  disabled={isEditing && !editData?.isUserSubmitted}
                ></textarea>
              </div>
              {(isRegistering || (isEditing && editData?.isUserSubmitted)) && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Dokumen Profil/MoU (PDF, max 10MB)</label>
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={handleFileChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', background: '#f8f9fa' }} 
                    />
                    {formData.fileName && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>File terpilih: {formData.fileName}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Logo Mitra (Opsional, JPG/PNG, max 1MB)</label>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={handleLogoChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', background: '#f8f9fa' }} 
                    />
                    {formData.logoFileName && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>Logo terpilih: {formData.logoFileName}</p>}
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  onClick={() => { setIsEditing(false); setIsRegistering(false); }}
                  disabled={isUploading}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #ced4da', background: 'white', cursor: 'pointer', opacity: isUploading ? 0.6 : 1 }}>
                  Batal
                </button>
                <button 
                  onClick={isRegistering ? handleRegisterSubmit : handleSaveProfile}
                  disabled={isUploading}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: isUploading ? 0.6 : 1 }}>
                  {isUploading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .partner-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          background: white !important;
        }
      `}</style>
    </div>
  );
};

export default PartnersPage;
