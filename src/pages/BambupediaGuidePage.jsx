import React from 'react';
import { ArrowRight, BookOpen, History, Leaf, Recycle, Scissors, Search, Shovel, Sprout, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

const guideContent = {
  plant: {
    title: 'Panduan Penanaman Bambu',
    icon: Sprout,
    color: 'var(--primary)',
    summary: 'Tahapan memilih bibit, menyiapkan lubang tanam, dan memastikan tanaman awal bertahan.',
    points: ['Gunakan bibit sehat dari rumpun produktif', 'Jaga drainase agar akar tidak tergenang', 'Tanam saat awal musim hujan untuk mengurangi stres air'],
  },
  'plant-past': {
    title: 'Riwayat Penanaman',
    icon: History,
    color: '#845ef7',
    summary: 'Catatan penanaman menjadi dasar validasi, estimasi karbon, dan proyeksi panen.',
    points: ['Simpan tanggal tanam dan lokasi GPS', 'Foto kondisi bibit saat tanam', 'Update kondisi minimal setiap bulan'],
  },
  maintain: {
    title: 'Pemeliharaan Rumpun',
    icon: Wrench,
    color: '#339af0',
    summary: 'Perawatan rutin menjaga pertumbuhan, kelembaban, dan kesehatan rumpun bambu.',
    points: ['Bersihkan gulma di sekitar rumpun', 'Tambahkan pupuk organik berkala', 'Pantau hama, jamur, dan kekeringan'],
  },
  harvest: {
    title: 'Pemanenan Lestari',
    icon: Scissors,
    color: '#f59f00',
    summary: 'Pemanenan selektif menjaga regenerasi alami dan memastikan batang siap olah.',
    points: ['Panen batang matang umur 3-5 tahun', 'Jangan tebang semua batang dalam satu rumpun', 'Utamakan musim kemarau untuk kadar air rendah'],
  },
  utilize: {
    title: 'Pemanfaatan Bambu',
    icon: Recycle,
    color: '#0ca678',
    summary: 'Bambu dapat diolah menjadi material konstruksi, interior, pangan, tekstil, dan energi biomassa.',
    points: ['Sortir batang berdasarkan diameter dan umur', 'Lakukan treatment anti hama sebelum konstruksi', 'Catat output produksi untuk traceability'],
  },
  cultivate: {
    title: 'Budidaya Komersial',
    icon: Shovel,
    color: '#2b8a3e',
    summary: 'Budidaya skala ekonomi membutuhkan perencanaan lahan, rantai pasok, dan pasar hilir.',
    points: ['Tentukan spesies sesuai target produk', 'Bangun jadwal panen bertahap', 'Hubungkan petani, pengolahan, dan pembeli B2B'],
  },
  taxonomy: {
    title: 'Taksonomi Bambu',
    icon: Search,
    color: '#1c7ed6',
    summary: 'Identifikasi spesies membantu menentukan nilai ekonomi, pola tanam, dan pemanfaatan akhir.',
    points: ['Catat bentuk ruas dan percabangan', 'Ukur diameter, ketebalan, dan warna batang', 'Validasi nama lokal dengan nama ilmiah'],
  },
  history: {
    title: 'Sejarah Bambu Nusantara',
    icon: BookOpen,
    color: '#7048e8',
    summary: 'Bambu telah menjadi bagian dari arsitektur, pangan, alat musik, dan ekonomi desa di Indonesia.',
    points: ['Terhubung dengan budaya agraris dan rumah tradisional', 'Digunakan untuk kerajinan, konstruksi, dan konservasi air', 'Kini berkembang menuju material hijau dan ekonomi karbon'],
  },
};

const BambupediaGuidePage = ({ topic = 'plant' }) => {
  const guide = guideContent[topic] || guideContent.plant;
  const Icon = guide.icon;

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ marginBottom: '28px' }}>
        <BackButton to="/bambupedia" />
      </div>
      <div className="container" style={{ maxWidth: '940px' }}>
        <div style={{ background: 'white', borderRadius: '28px', padding: '42px', border: '1px solid #edf2f7', boxShadow: '0 12px 34px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '22px', background: `${guide.color}16`, color: guide.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
            <Icon size={34} />
          </div>
          <h1 style={{ fontSize: '2.6rem', color: 'var(--text-main)', marginBottom: '14px' }}>{guide.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '30px' }}>{guide.summary}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px', marginBottom: '32px' }}>
            {guide.points.map((point, index) => (
              <div key={point} style={{ background: '#f8f9fa', borderRadius: '18px', padding: '20px', border: '1px solid #edf2f7' }}>
                <div style={{ color: guide.color, fontWeight: '900', marginBottom: '10px' }}>0{index + 1}</div>
                <p style={{ color: 'var(--text-main)', fontWeight: '700', lineHeight: 1.5 }}>{point}</p>
              </div>
            ))}
          </div>

          <Link to="/bambupedia/tracker" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 24px' }}>
            Buka Tracker Bambu <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BambupediaGuidePage;
