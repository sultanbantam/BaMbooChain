import { getAssetUrl } from './assets';

export const eventsData = [
  {
    id: 'hbd-2026',
    title: 'Peringatan Hari Bambu Dunia 2026',
    date: '18-20 September 2026',
    time: '08:00 - 16:00 WIB',
    location: 'Wewengkon Adat Kasepuhan Cibarani, Lebak Banten',
    category: 'Peringatan',
    image: getAssetUrl('event/hbd.png'),
    color: '#0ca678',
    speakers: [
      { name: 'Dr. Taufikurahman', role: 'Dewan Pakar Yayasan', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { name: 'Abah Jaro', role: 'Ketua Adat Kasepuhan Cibarani', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    materials: [
      { title: 'Buku Panduan Hari Bambu Dunia', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { title: 'Peta Lokasi & Jadwal Acara', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ]
  },
  {
    id: 'fdv-2026',
    title: 'Festival Diburuan Jilid IV 2026',
    date: '18-20 September 2026',
    time: '08:00 - 16:00 WIB',
    location: 'Halaman Rumah sekitar RW. 07 Desa Cimareme, Bandung Barat',
    category: 'Festival',
    image: getAssetUrl('event/fdv.jpeg'),
    color: '#228be6',
    speakers: [
      { name: 'Sultan Bantam', role: 'Pendiri BaMbooChain', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    materials: [
      { title: 'Materi Ekonomi Sirkular', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ]
  },
  {
    id: 'hbn-2026',
    title: 'Hari Bambu Nasional 2026',
    date: '26-29 November 2026',
    time: '08:00 - 16:00 WIB',
    location: 'Kota Tangsel, Banten',
    category: 'Peringatan',
    image: getAssetUrl('event/hbn.png'),
    color: '#fab005',
    speakers: [
      { name: 'Walikota Tangsel', role: 'Pejabat Daerah', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    materials: [
      { title: 'Draft Resolusi Bambu Nasional', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ]
  },
  {
    id: 'seren-taun-2026',
    title: 'Seren Taun Kasepuhan Cibarani 2026',
    date: '26-30 Agustus 2026',
    time: '08:00 - Selesai',
    location: 'Wewengkon Adat Kasepuhan Cibarani, Lebak Banten',
    category: 'Festival',
    image: getAssetUrl('event/serentaun.png'),
    color: '#15aabf',
    speakers: [
      { name: 'Abah Jaro', role: 'Ketua Adat Kasepuhan Cibarani', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { name: 'Sultan Bantam', role: 'Penggiat Konservasi Web3', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    materials: [
      { title: 'Rangkaian Ritual Seren Taun', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ]
  }
];

export const featuredEventData = {
  id: 'fgd-rumah-modular-2026',
  title: 'Workshop & FGD Capacity Building Perancangan Prototype Rumah Modular Bambu',
  date: '1-2 Juli 2026',
  time: '08:00 - 16:00 WIB',
  location: 'Gedung Galeri Koperasi dan UKM Kota Tangerang Selatan',
  category: 'Workshop',
  image: getAssetUrl('event/bfgd.png'),
  color: '#e03131',
  speakers: [
    { name: 'Ir. Kreshnariza Harahap, S.T., M.Eng.Sc.', role: 'Direktur Pembiayaan Perumahan Perkotaan Ditjen Perkotaan Kementerian PKP', topic: 'Program Kredit Perumahan dan Potensi Rumah Subsidi', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { name: 'Kuswara, S.T., M.A.', role: 'Direktur Bina Teknik Bangunan Gedung Kementerian PU', topic: 'Uji Kelaikan dan Aspek Struktur Rumah Modular Bambu', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { name: 'Tengku Davis F. Hamid, ST. MT.', role: 'Direktur Bina Penataan Bangunan Kementerian PU', topic: 'PBG untuk Konstruksi Bangunan Bambu', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { name: 'Ir. Doddy Sudradjat Kartanegara', role: 'Narasumber', topic: 'Rumah Ramah Gempa RISHAM', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { name: 'Ir. Permana, M.T.', role: 'Narasumber', topic: 'Rumah Modular Blockwood dan BlockBamboo', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { name: 'U. Ilham, IR., S.Pd., M.Ikom. dan Erfin Setiawan, ST.', role: 'PT Bamboo Republik Indonesia', topic: 'Kesiapan Industri Bambu Laminasi untuk Mendukung Rumah Modular BlockBamboo', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { name: 'PKR Bambu dan PERPUBI', role: 'Tim Ahli & Komunitas', topic: 'Ekosistem Digital Bamboochain dan Demo Game Modular BlockBamboo Constructor v.1.0', cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  ],
  materials: [
    { title: 'Modul Perancangan Rumah Modular', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  ]
};
