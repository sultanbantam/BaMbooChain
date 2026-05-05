import { getAssetUrl } from '../utils/assets';

// Gunakan import langsung agar Vite bisa memproses aset dengan pasti (Hanya untuk 2 ini dulu sebagai tes)
// import sishImg from '/gambar/sish.png'; 
// import bfcImg from '/gambar/bfc.jpeg';

export const PROJECTS = [
  {
    id: 1,
    status: 'Berjalan',
    category: 'Restorasi & Produksi',
    title: 'Perkebunan Emas Hijau Cibarani – Lebak',
    shortDesc: 'Restorasi, produksi bambu terintegrasi dan sabuk ekologis untuk melindungi hutan adat.',
    fullDesc: 'Proyek ini berfokus pada restorasi lahan seluas 490 Ha di Banten. Kami mengintegrasikan produksi bambu dengan perlindungan hutan adat dari pembalakan liar dan penambangan emas ilegal.',
    image: getAssetUrl('gambar/pehcibarani.png'),
    location: 'Banten',
    impact: '490 Ha Lindung, 100+ Tenaga Kerja'
  },
  {
    id: 2,
    status: 'Berjalan',
    category: 'Ekowisata',
    title: 'Cisadane Adventure Eco Park',
    shortDesc: 'Konservasi lingkungan, inovasi bambu, dan pengembangan ekonomi masyarakat melalui ekowisata.',
    fullDesc: 'Terletak di Tangerang Raya dengan luas 120 Ha, taman ini menggabungkan edukasi konservasi dengan rekreasi alam.',
    image: getAssetUrl('gambar/ceap.png'),
    location: 'Tangerang Raya',
    impact: '120 Ha Konservasi, Pusat Inovasi Bambu'
  },
  {
    id: 3,
    status: 'Berjalan',
    category: 'Konstruksi',
    title: 'Proyek Rumah Hunian Tetap Tipe 36',
    shortDesc: 'Hunian modular pasca bencana berbasis bambu ramah lingkungan di Sumatera.',
    fullDesc: 'Menyediakan 6.000 unit hunian modular terstandarisasi untuk korban bencana di Sumatera.',
    image: getAssetUrl('gambar/mbh.jpeg'),
    location: 'Sumatera',
    impact: '6.000 Unit Rumah, Reduksi Karbon Masif'
  },
  {
    id: 4,
    status: 'Diusulkan',
    category: 'Rantai Pasok',
    title: 'Hub Distribusi Bambu Nusantara',
    shortDesc: 'Sistem logistik terintegrasi untuk menghubungkan petani bambu desa dengan industri hilir.',
    fullDesc: 'Hub ini akan berfungsi sebagai pusat pengumpulan, pengawetan primer, dan standarisasi kualitas bambu.',
    image: getAssetUrl('gambar/bsh.jpeg'),
    location: 'Jawa Barat',
    impact: 'Efisiensi Logistik 30%, Peningkatan Harga di Petani'
  },
  {
    id: 5,
    status: 'Diusulkan',
    category: 'Teknologi',
    title: 'Platform Carbon Credit Bambu',
    shortDesc: 'Tokenisasi serapan karbon hutan bambu rakyat menggunakan teknologi blockchain.',
    fullDesc: 'Proyek digital untuk mengukur, memverifikasi, dan menjual kredit karbon dari hutan bambu.',
    image: getAssetUrl('gambar/bambu5.0..jpeg'),
    location: 'Nasional',
    impact: 'Transparansi Karbon, Pendapatan Tambahan Petani'
  },
  {
    id: 6,
    status: 'Diusulkan',
    category: 'Kawasan Terpadu',
    title: 'Sabumi Integrated Social Hub',
    shortDesc: 'Kawasan terpadu berbasis zakat yang mengintegrasikan layanan kesehatan, pendidikan, dan pemberdayaan masyarakat.',
    fullDesc: 'Sabumi Integrated Social Hub merupakan pengembangan kawasan terpadu berbasis zakat yang mengintegrasikan layanan kesehatan, pendidikan, dan pemberdayaan masyarakat.',
    image: getAssetUrl('gambar/sish.png'),
    location: 'Banten',
    impact: 'Kesehatan, Pendidikan, Pemberdayaan Masyarakat'
  },
  {
    id: 7,
    status: 'Diusulkan',
    category: 'Giga Proyek',
    title: 'Banten Floating City',
    shortDesc: 'Giga proyek kota terapung seluas 3.000 ha di Teluk Banten yang menggabungkan teknologi modern dan kearifan lokal.',
    fullDesc: 'Banten Floating City (BFC) adalah giga proyek kota terapung seluas 3.000 ha di Teluk Banten.',
    image: getAssetUrl('gambar/bfc.jpeg'),
    location: 'Teluk Banten',
    impact: 'Pusat Ekonomi Maritim, Konservasi Lingkungan, Wisata Heritage'
  }
];
