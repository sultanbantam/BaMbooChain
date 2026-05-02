import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Factory, Cpu, GraduationCap, Landmark, ArrowRight, ShieldCheck, Building } from 'lucide-react';

const PartnersPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const partnerCategories = [
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
        { name: 'PT. Inakaz Internasional', desc: 'Mitra strategis dalam pengembangan dan distribusi logistik komoditas.' },
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

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container">
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px', animation: isVisible ? 'fadeInUp 0.8s ease-out' : 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '24px' }}>
            <ShieldCheck size={18} /> Aliansi Strategis
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.2' }}>Kolaborasi Membangun Peradaban Hijau</h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Transformasi ekologi tidak bisa dilakukan sendirian. Kami bangga didukung oleh konsorsium lintas sektoral: mulai dari Kasepuhan adat, raksasa teknologi, institusi riset, hingga jaringan perbankan internasional.
          </p>
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
                  <div key={pIndex} style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', borderLeft: `4px solid ${category.color}`, transition: 'transform 0.2s' }} className="partner-card">
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 8px 0', lineHeight: '1.4' }}>{partner.name}</h3>
                    {partner.desc && (
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>{partner.desc}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #087f5b 100%)', color: 'white', padding: '60px 40px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(12, 166, 120, 0.2)' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold' }}>Jadilah Bagian dari Sejarah</h2>
          <p style={{ fontSize: '1.1rem', opacity: '0.9', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            Kami membuka pintu selebar-lebarnya bagi perusahaan, akademisi, dan investor untuk berkolaborasi dalam rantai pasok industri bambu bernilai miliaran dolar.
          </p>
          <button 
            onClick={() => navigate('/contact')} 
            style={{ background: 'white', color: 'var(--primary)', padding: '16px 40px', borderRadius: '50px', fontSize: '1.1rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: '0.2s', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Hubungi Kami Sekarang <ArrowRight size={20} />
          </button>
        </div>
        
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
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
