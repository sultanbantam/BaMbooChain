import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, GraduationCap, Award, PlayCircle, Clock, ShieldCheck, DownloadCloud, Lock, User, FileText, X, Sparkles, Calendar, ChevronLeft, ChevronRight, Heart, Share2, Send, MessageSquare, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const compressImage = (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.6) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str);
  });
};

const AcademyPage = () => {
  const { user, setIsAuthModalOpen, setAuthModalInitialTab, articles, submitArticle } = useAuth();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [shareAlert, setShareAlert] = useState(null);
  
  // New States for Gifts & Writer Submissions
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(null);
  const [giftAmount, setGiftAmount] = useState("10");
  const [giftStatus, setGiftStatus] = useState("idle");
  const [isWriterModalOpen, setIsWriterModalOpen] = useState(false);
  const [newArticleForm, setNewArticleForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Sains Bambu',
    otherCategory: '', // For custom category input when 'Lainnya' is selected
    readTime: '5 Menit Baca',
    image: '', // Base64 uploaded image URL
    images: [] // Array of Base64 uploaded image URLs
  });

  const articleImageContainerRef = useRef(null);
  const [currentArticleImgIdx, setCurrentArticleImgIdx] = useState(0);

  // Reset scroll and index when selectedArticle changes
  useEffect(() => {
    if (selectedArticle) {
      setCurrentArticleImgIdx(0);
      if (articleImageContainerRef.current) {
        articleImageContainerRef.current.scrollLeft = 0;
      }
    }
  }, [selectedArticle]);

  const handleArticleImageScroll = (e) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const idx = Math.round(scrollLeft / width);
      if (idx !== currentArticleImgIdx) {
        setCurrentArticleImgIdx(idx);
      }
    }
  };

  const scrollToArticleImage = (idx) => {
    setCurrentArticleImgIdx(idx);
    if (articleImageContainerRef.current) {
      const container = articleImageContainerRef.current;
      container.scrollTo({ left: container.clientWidth * idx, behavior: 'smooth' });
    }
  };

  const handlePrevArticleImg = () => {
    const total = selectedArticle?.images?.length || 0;
    if (total <= 1) return;
    const newIdx = (currentArticleImgIdx - 1 + total) % total;
    scrollToArticleImage(newIdx);
  };

  const handleNextArticleImg = () => {
    const total = selectedArticle?.images?.length || 0;
    if (total <= 1) return;
    const newIdx = (currentArticleImgIdx + 1) % total;
    scrollToArticleImage(newIdx);
  };

  const [interactions, setInteractions] = useState({
    1: { likes: 42, liked: false, shares: 12, comments: [
      { user: "Budi Santoso", text: "Ulasan yang sangat mendalam! Ternyata kerapatan kapiler bambu berpengaruh besar pada kekuatan tarik.", date: "15 Mei 2026" },
      { user: "Siti Rahma", text: "Terima kasih Prof Hariadi atas ilmunya. Sangat bermanfaat untuk proyek villa bambu saya.", date: "16 Mei 2026" }
    ]},
    2: { likes: 58, liked: false, shares: 19, comments: [
      { user: "Kang Cecep", text: "Metode Kemiri ini terbukti Abah, di kampung saya bambu yang direndam lumpur awet puluhan tahun.", date: "12 Mei 2026" }
    ]},
    3: { likes: 95, liked: false, shares: 34, comments: [
      { user: "Dr. Adrian", text: "Sangat menarik data kuantifikasi karbon apus. Bisa menjadi dasar pengajuan kredit karbon adat.", date: "10 Mei 2026" }
    ]},
    4: { likes: 73, liked: false, shares: 25, comments: [
      { user: "Ars. Rahmat", text: "Sambungan mortar pengisi ini memecahkan masalah retak ujung bambu bulat. Solusi brilian!", date: "05 Mei 2026" }
    ]}
  });

  const handleLike = (articleId, e) => {
    if (e) e.stopPropagation();
    setInteractions(prev => {
      const current = prev[articleId] || { likes: 0, liked: false, shares: 0, comments: [] };
      return {
        ...prev,
        [articleId]: {
          ...current,
          liked: !current.liked,
          likes: current.liked ? current.likes - 1 : current.likes + 1
        }
      };
    });
  };

  const handleShare = (articleId, title, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/#/bamboochain/academy?article=${articleId}`);
    setInteractions(prev => {
      const current = prev[articleId] || { likes: 0, liked: false, shares: 0, comments: [] };
      return {
        ...prev,
        [articleId]: {
          ...current,
          shares: current.shares + 1
        }
      };
    });
    setShareAlert(articleId);
    setTimeout(() => setShareAlert(null), 2000);
  };

  const handleAddComment = (articleId) => {
    if (!newCommentText.trim()) return;
    const authorName = user?.displayName || user?.email?.split('@')[0] || "Pegiat Bambu Hijau";
    
    setInteractions(prev => {
      const current = prev[articleId] || { likes: 0, liked: false, shares: 0, comments: [] };
      return {
        ...prev,
        [articleId]: {
          ...current,
          comments: [
            ...current.comments,
            {
              user: authorName,
              text: newCommentText.trim(),
              date: "Baru saja"
            }
          ]
        }
      };
    });
    setNewCommentText("");
  };

  const handleSendGift = () => {
    setGiftStatus('processing');
    setTimeout(() => {
      setGiftStatus('success');
      if (isGiftModalOpen) {
        setInteractions(prev => {
          const current = prev[isGiftModalOpen] || { likes: 0, liked: false, shares: 0, comments: [] };
          return {
            ...prev,
            [isGiftModalOpen]: {
              ...current,
              shares: current.shares + 1 // increment as shared activity
            }
          };
        });
      }
      setTimeout(() => {
        setIsGiftModalOpen(null);
        setGiftStatus('idle');
        setGiftAmount("10");
      }, 2500);
    }, 1500);
  };

  const handleNewArticleSubmit = async () => {
    if (!newArticleForm.title || !newArticleForm.excerpt || !newArticleForm.content) {
      alert("⚠️ Harap lengkapi semua field sebelum mengirim!");
      return;
    }
    
    if (newArticleForm.category === 'Lainnya' && !newArticleForm.otherCategory.trim()) {
      alert("⚠️ Harap tentukan kategori lainnya!");
      return;
    }
    
    const finalCategory = newArticleForm.category === 'Lainnya' ? newArticleForm.otherCategory.trim() : newArticleForm.category;
    
    const articleId = 'art_' + Date.now();
    
    // Initialize interaction state dynamically
    setInteractions(prev => ({
      ...prev,
      [articleId]: {
        likes: 0,
        liked: false,
        shares: 0,
        comments: []
      }
    }));

    const articleData = {
      title: newArticleForm.title,
      excerpt: newArticleForm.excerpt,
      content: newArticleForm.content,
      category: finalCategory,
      readTime: newArticleForm.readTime,
      image: newArticleForm.image || '',
      images: newArticleForm.images || [],
      author: user?.displayName || user?.email?.split('@')[0] || "Pegiat Bambu Hijau",
      role: "Kontributor Pegiat Bambu",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${articleId}`
    };

    const success = await submitArticle(articleData);
    if (success) {
      setIsWriterModalOpen(false);
      setNewArticleForm({ title: '', excerpt: '', content: '', category: 'Sains Bambu', otherCategory: '', readTime: '5 Menit Baca', image: '', images: [] });
    }
  };
  // Mock Data untuk Kursus
  const courses = [
    { 
      id: 1, 
      title: "Masterclass: Budidaya Bambu Tepat Guna", 
      category: "Pertanian", 
      modules: 12, 
      duration: "4.5 Jam", 
      students: 1250, 
      img: "https://images.unsplash.com/photo-1542450530-5bfa5dfef006?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 2, 
      title: "Sertifikasi Konstruksi Bambu Modular (BamBu 5.0)", 
      category: "Arsitektur", 
      modules: 8, 
      duration: "6 Jam", 
      students: 840, 
      img: "https://images.unsplash.com/photo-1596417937554-6eabaac17196?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 3, 
      title: "Blockchain Bamboo: Tokenomics & Ekologi Web3", 
      category: "Teknologi", 
      modules: 15, 
      duration: "8 Jam", 
      students: 2100, 
      img: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    }
  ];

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-color)' }}>
      
      {/* HEADER SECTION */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '16px', borderRadius: '50%', color: '#f59f00' }}>
            <GraduationCap size={40} />
          </div>
        </div>
         <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.5px' }}>
          Akademi Bambu Nusantara
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Belajar, Berkarya, Berdaya. Tingkatkan kapasitas diri melalui perpustakaan ilmu pengetahuan terpadu dari pakar bambu dan ahli teknologi terkemuka.
        </p>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        
        {/* COURSES SECTION */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={28} color="var(--primary)" /> Katalog Kurikulum
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Akses semua kelas secara gratis dengan status keanggotaan Bambu Anda.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {courses.map((course) => (
              <div key={course.id} style={{ background: 'var(--bg-card)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'pointer' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                
                <div style={{ height: '200px', position: 'relative' }}>
                  <img src={course.img} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--bg-card)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {course.category}
                  </div>
                  {/* Play Button Overlay */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '12px', color: 'var(--primary)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlayCircle size={32} />
                  </div>
                </div>
                
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 16px 0', lineHeight: '1.4' }}>{course.title}</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Clock size={16} color="var(--primary)" /> {course.duration}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <BookOpen size={16} color="var(--primary)" /> {course.modules} Modul
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                      {course.students.toLocaleString()} Murid Terdaftar
                    </div>
                    <button style={{ background: '#e6fcf5', color: 'var(--primary)', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
                      Mulai Belajar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFICATION SECTION */}
        <div style={{ background: 'linear-gradient(135deg, #1b5e20, var(--primary))', borderRadius: '24px', padding: '30px', color: 'white', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '30px', boxShadow: '0 15px 40px rgba(12,166,120,0.2)', position: 'relative', overflow: 'hidden' }}>
          
          {/* Abstract background shapes */}
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', color: 'rgba(255,255,255,0.05)' }}>
            <Award size={250} />
          </div>

          <div style={{ flex: '1 1 400px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <ShieldCheck size={32} color="#fcc419" />
              <h2 style={{ fontSize: '2rem', color: 'white', margin: 0 }}>Sertifikat Blockchain</h2>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '24px', lineHeight: '1.6' }}>
              Tiap kelulusan kursus Anda di Akademi akan dianugerahi **Sertifikat NFT (Non-Fungible Token)**. Ini merupakan gelar digital kekal yang tak dapat dipalsukan, tertanam permanen di Blockchain cerdas sebagai bukti keahlian hijau Anda.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button style={{ background: 'white', color: 'var(--primary)', padding: '14px 28px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <Award size={20} /> Lihat Etalase Sertifikat
              </button>
              <button style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '14px 28px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DownloadCloud size={20} /> Verifikasi NFT
              </button>
            </div>
          </div>

          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            {/* Visualisasi Mockup Sertifikat NFT */}
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '350px', transform: 'rotate(2deg)', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
              <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '16px', marginBottom: '16px' }}>
                <Award size={48} color="#fcc419" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)' }}>Official Certification</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '8px' }}>Sabumi Green Scholar</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Diberikan kepada:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>0x82fA...91Cc</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Keahlian Tercetak:</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Master Budidaya Bambu</div>
              </div>
              <div style={{ marginTop: '20px', pt: '12px', borderTop: '1px dashed rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                <span>ID: #BMB-A491</span>
                <span>On-Chain Verified ✅</span>
              </div>
            </div>
          </div>

        </div>

        {/* PREMIUM RESOURCES SECTION */}
        <div style={{ marginTop: '80px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            <BookOpen size={28} color="var(--primary)" /> Perpustakaan & Materi Riset Premium
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {[
              {
                title: "Pedoman Konstruksi Bambu untuk Relawan",
                tag: "Pustaka Relawan Hijau",
                cover: "/assets/pedoman/cbsr.jpg",
                pdf: "/assets/pedoman/bsr.pdf",
                downloadName: "Pedoman_Konstruksi_Bambu_Relawan.pdf",
                desc: "Buku panduan praktis terlengkap yang dirancang khusus bagi para relawan, pembangun, dan pegiat lingkungan untuk memahami dasar-dasar kekuatan bambu, metode penyambungan, perawatan bahan, hingga teknik perakitan struktur modular ramah lingkungan di lapangan. Dapatkan wawasan aplikatif langsung dari para master konstruksi bambu Nusantara."
              },
              {
                title: "Rencana Bisnis Industri Bambu Terintegrasi",
                tag: "Panduan Strategis Bisnis",
                cover: "/assets/pedoman/ibt.jpeg",
                pdf: "/assets/pedoman/ibt.pdf",
                downloadName: "Rencana_Bisnis_Industri_Bambu_Terintegrasi.pdf",
                desc: "Materi Rencana Bisnis Industri Bambu Terintegrasi menjelaskan konsep pengembangan ekosistem bambu dari hulu hingga hilir, mulai dari pembibitan, penanaman, pengolahan bahan baku, hingga produk bernilai tinggi seperti bambu laminasi, strand woven bamboo, konstruksi, energi, pangan, dan tekstil. Materi ini menekankan bahwa bambu adalah “emas hijau” masa depan yang mampu mendukung ekonomi berkelanjutan, pelestarian lingkungan, serta pencapaian SDGs melalui industri berbasis masyarakat dan teknologi.\n\nKonsep ini juga memperlihatkan peluang pasar bambu dunia, inovasi produk, proses pengawetan dan manufaktur bambu modern, hingga model bisnis industri bambu terintegrasi yang menghubungkan pelestarian alam, pemberdayaan masyarakat, dan industri hijau berkelanjutan."
              },
              {
                title: "Pitchdeck Bamboo 4.0",
                tag: "Transformasi Digital & Investasi",
                cover: "/assets/pedoman/bamboo4.0.jpeg",
                pdf: "/assets/pedoman/bamboo 4.0.pdf",
                downloadName: "Pitchdeck_Bamboo_4.0.pdf",
                desc: "Materi Pitchdeck Bamboo 4.0 menjelaskan konsep transformasi industri bambu berbasis teknologi digital untuk restorasi lingkungan, pemberdayaan masyarakat adat, dan pembangunan ekonomi hijau berkelanjutan. Proyek ini mengintegrasikan bambu, teknologi 4.0, big data, IoT, drone, dan sistem digital untuk menciptakan ekosistem agroforestri bambu yang transparan, modern, dan bernilai ekonomi tinggi.\n\nPitchdeck ini juga menjelaskan masalah besar seperti deforestasi, krisis air, dan kemiskinan masyarakat adat, lalu menawarkan solusi melalui penanaman bambu digital di lahan adat Kasepuhan Cibarani seluas ±490 hektar, dengan target restorasi lingkungan, carbon credit, industri bambu terintegrasi, dan pemberdayaan petani milenial.\n\nSelain itu, materi ini memaparkan peluang pasar ekonomi hijau global, roadmap proyek 4 tahun, tim ahli, model bisnis sirkular, kebutuhan investasi Rp 8,84 miliar, hingga visi besar membangun peradaban Nusantara yang hijau, mandiri, dan berkelanjutan melalui bambu.\n\nKonsep Bamboo 4.0 sendiri sejalan dengan perkembangan Agriculture 4.0 dan smart farming yang memanfaatkan IoT, big data, drone, dan teknologi digital untuk meningkatkan efisiensi, keberlanjutan, serta transparansi rantai pasok pertanian modern."
              }
            ].map((ebook, idx) => (
              <div key={idx} style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '24px', 
                padding: '40px 30px', 
                boxShadow: '0 10px 45px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '40px',
                alignItems: 'center'
              }}>
                {/* Ebook Cover Mockup */}
                <div style={{ flexShrink: 0, position: 'relative', width: '320px', height: '210px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', background: '#ffffff' }}>
                  <img src={ebook.cover} alt={ebook.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#fa5252', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    FREE EBOOK
                  </div>
                </div>

                {/* Description & Action */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', backgroundColor: 'rgba(12,166,120,0.08)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '16px' }}>
                    <BookOpen size={14} /> {ebook.tag}
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 12px 0', lineHeight: 1.25 }}>{ebook.title}</h2>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '24px', whiteSpace: 'pre-line' }}>
                    {ebook.desc}
                  </p>

                  <div style={{ background: '#f8f9fa', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e9ecef', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status Akses Unduhan:</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        {user?.kycStatus === 'verified' ? (
                          <span style={{ color: '#12b886', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={16} /> Akun Terverifikasi (Akses Terbuka)</span>
                        ) : (
                          <span style={{ color: '#fa5252', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={16} /> Perlu KYC Terverifikasi</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (!user) {
                          if (setAuthModalInitialTab) setAuthModalInitialTab('login');
                          if (setIsAuthModalOpen) setIsAuthModalOpen(true);
                        } else if (user.kycStatus !== 'verified') {
                          alert(`⚠️ Akses Terkunci!\n\nUntuk mendownload Ebook '${ebook.title}' secara gratis, Anda harus berstatus KYC TERVERIFIKASI di sistem. Silakan selesaikan pengajuan KYC Anda di menu KYC Center pada halaman Wallet Dashboard.`);
                          window.location.hash = "/bamboochain/token-wallet"; // Redirect to wallet/KYC page
                        } else {
                          const link = document.createElement('a');
                          link.href = ebook.pdf;
                          link.download = ebook.downloadName;
                          link.click();
                        }
                      }}
                      style={{
                        background: user?.kycStatus === 'verified' ? 'var(--primary)' : 'var(--text-muted)',
                        color: 'white',
                        border: 'none',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: user?.kycStatus === 'verified' ? '0 4px 15px rgba(12,166,120,0.25)' : 'none',
                        transition: 'background 0.2s'
                      }}
                    >
                      <DownloadCloud size={18} /> {user?.kycStatus === 'verified' ? 'Unduh PDF Gratis' : 'Verifikasi KYC & Unduh'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SCIENCE & INSIGHT ARTICLES SECTION */}
        <div style={{ marginTop: '80px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '900', letterSpacing: '-0.5px' }}>
                <FileText size={28} color="var(--primary)" /> Kolom & Esai Ilmiah, Artikel & Tulisan, dari Pegiat bambu
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.05rem' }}>Eksplorasi mendalam tentang bambu langsung dari para pegiat bambu.</p>
            </div>
            
            <button
              onClick={() => {
                if (!user) {
                  if (setAuthModalInitialTab) setAuthModalInitialTab('login');
                  if (setIsAuthModalOpen) setIsAuthModalOpen(true);
                } else if (user.kycStatus !== 'verified') {
                  alert("⚠️ Akses Ditolak!\n\nAnda harus berstatus KYC TERVERIFIKASI untuk berkontribusi menulis esai, artikel, atau tulisan di kolom ini. Silakan selesaikan pengajuan KYC Anda di menu KYC Center pada halaman Wallet Dashboard.");
                } else {
                  setIsWriterModalOpen(true);
                }
              }}
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #0ca678 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(12,166,120,0.2)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Sparkles size={16} /> Tulis Artikel Baru
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {[
              {
                id: 1,
                title: "Fisiologi Aliran Air dan Struktur Pembuluh Kapiler Bambu Petung",
                author: "Prof. Dr. Ir. Hariadi Kusuma",
                role: "Pakar Silvikultur & Peneliti Utama Sabumi",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hariadi",
                excerpt: "Studi mendalam mengenai efisiensi transportasi air mikroskopis pada serat bambu Dendrocalamus asper dan implikasinya terhadap kekuatan lentur alami.",
                content: `Bambu Petung (Dendrocalamus asper) merupakan salah satu jenis bambu terbesar di dunia yang memiliki kekuatan struktural luar biasa. Secara biologis, keunggulan ini didukung oleh struktur anatomi berkas pengangkut kapiler (vascular bundles) yang sangat rapat di bagian kulit luar (cortex) dan merenggang di bagian dalam.

Aliran air (getah) kapiler pada bambu hidup bergerak sangat dinamis melalui pembuluh kayu (xylem). Ketika bambu ditebang, kelembapan kapiler ini meninggalkan rongga mikro yang sangat banyak. Jika proses pengeringan dilakukan dengan benar, rongga kapiler kosong ini bertindak sebagai peredam tekanan elastis alami yang sangat kuat.

Dari sudut pandang mekanika material, rasio kekuatan tarik terhadap berat jenis (tensile strength-to-weight ratio) dari jaringan kapiler luar bambu petung bahkan mengungguli baja struktural biasa. Pengetahuan mengenai anatomi pembuluh ini sangat krusial dalam menentukan arah pemotongan serat untuk menjaga elastisitas alami bambu saat menerima beban struktural bentang lebar.`,
                readTime: "5 Menit Baca",
                date: "12 Mei 2026",
                approved: true
              },
              {
                id: 2,
                title: "Kearifan Lokal Pengawetan Bambu Alami via Perendaman Air Mengalir",
                author: "Abah Ujang Winata",
                role: "Master Pengrajin Tradisional Kasepuhan Cibarani",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ujang",
                excerpt: "Metode tradisional warisan leluhur Sunda dalam menetralkan kadar glukosa dan pati bambu demi mencegah serangan bubuk kayu secara permanen.",
                content: `Sejak berabad-abad lalu, leluhur kami di Kasepuhan Cibarani telah menggunakan hukum alam untuk mengawetkan bambu tanpa bahan kimia beracun. Metode ini disebut 'Kemiri' or perendaman air lumpur mengalir.

Bambu segar yang baru ditebang memiliki kadar pati dan gula alami yang sangat disukai oleh kumbang bubuk (Dinoderus minutus). Jika pati ini dibiarkan, bambu akan hancur menjadi bubuk dalam waktu kurang dari dua tahun. 

Dengan merendam bambu di air lumpur pesawahan atau sungai berarus lambat selama 3 hingga 6 bulan, terjadi proses fermentasi anaerobik alami. Mikroorganisme air memakan habis kadar pati dan glukosa di dalam pori-pori bambu dan mengubahnya menjadi asam organik. Setelah masa perendaman selesai, serat bambu menjadi hambar, keras, dan tidak akan pernah lagi disentuh oleh serangga perusak selamanya.`,
                readTime: "4 Menit Baca",
                date: "08 Mei 2026",
                approved: true
              },
              {
                id: 3,
                title: "Laju Penyerapan Karbon Spesifik Rumpun Gigantochloa apus (Bambu Tali)",
                author: "Dr. Elizabeth Wong",
                role: "Pakar Ekologi Karbon Global & Konsultan ESG",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elizabeth",
                excerpt: "Kuantifikasi matematis biomassa bambu tali dalam menyerap karbon dioksida atmosfer dan kontribusinya terhadap pasar karbon internasional.",
                content: `Bambu Tali (Gigantochloa apus) bukan sekadar tanaman biasa, ia adalah mesin penyerap karbon alami tercepat di daratan. Melalui penelitian empiris tim ekologi kami di area konservasi Jawa Barat, satu hektar tanaman bambu tali mampu mengunci hingga 35-40 ton karbon dioksida (CO2) per tahun.

Kecepatan penyerapan ini didorong oleh pertumbuhan sistem rimpang (rhizome) simpodial yang eksponensial. Ketika rebung baru muncul, tanaman menyerap karbon atmosfer dengan laju luar biasa untuk membangun dinding selulosa dalam 120 hari pertama masa hidupnya.

Di pasar karbon sukarela (Voluntary Carbon Market), penanaman terkelola bambu tali menghasilkan sertifikasi kredit karbon bernilai tinggi. Investasi pada penanaman rumpun bambu ini tidak hanya merestorasi lingkungan kritis lokal, tetapi juga menghasilkan dampak finansial nyata bagi masyarakat adat mitra melalui monetisasi emisi hijau secara on-chain.`,
                readTime: "6 Menit Baca",
                date: "02 Mei 2026",
                approved: true
              },
              {
                id: 4,
                title: "Integrasi Sambungan Baut Ganda pada Konstruksi Kuda-Kuda Bambu",
                author: "Rian Hidayat, S.Ars.",
                role: "Arsitek Hijau & Pelopor Blockbamboo",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rian",
                excerpt: "Rekayasa mekanika sambungan modern untuk mengatasi kelemahan retak pecah ujung serat bambu pada konstruksi bangunan.",
                content: `Tantangan terbesar menggunakan bambu bulat dalam arsitektur modern adalah titik sambungan. Bambu memiliki kekuatan sejajar serat yang sangat tinggi, namun kekuatan tegak lurus seratnya sangat lemah, sehingga rentan pecah jika dibor dan dipasang baut secara langsung.

Solusi rekayasa modern yang kami kembangkan adalah metode 'Sambungan Mortar Pengisi'. Pada bagian ujung bambu yang akan disatukan dengan baut baja, rongga bambu diisi dengan adukan semen non-susut (non-shrink grout) berkualitas tinggi atau resin epoksi yang dicampur serat bambu halus.

Setelah mortar mengeras, lubang baut baru dibor menembus adukan tersebut. Saat konstruksi menerima beban geser, baut baja akan menekan dinding semen pengisi, bukan dinding serat bambu secara langsung. Teknik ini meningkatkan kekuatan geser sambungan hingga 400% dan memungkinkan arsitek mendesain kuda-kuda bentang lebar modern hingga 25 meter secara aman dan estetis.`,
                readTime: "5 Menit Baca",
                date: "28 April 2026",
                approved: true
              },
              ...(articles || []).filter(art => art.approved !== 'rejected')
            ].map((article) => (
              <div key={article.id} style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '24px', 
                padding: '28px', 
                boxShadow: '0 10px 45px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, border-color 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
              onClick={() => {
                if (article.approved !== false) {
                  setSelectedArticle(article);
                } else {
                  alert("ℹ️ Artikel Sedang Ditinjau Admin!\n\nEsai ilmiah ini baru saja Anda kirimkan dan saat ini sedang berada dalam antrean persetujuan admin. Anda dapat membaca rincian lengkapnya setelah disetujui.");
                }
              }}
              >
                {article.image && (
                  <div style={{ width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    color: article.approved !== false ? 'var(--primary)' : '#f59f00', 
                    backgroundColor: article.approved !== false ? 'rgba(12,166,120,0.08)' : 'rgba(245,159,0,0.08)', 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                  }}>
                    {article.approved !== false ? <Sparkles size={12} /> : <Clock size={12} />}
                    {article.approved !== false ? (article.category || 'Sains Bambu') : 'Menunggu Persetujuan Admin'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {article.readTime}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                  {article.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                  {article.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px 0', fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '10px 0' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button 
                      onClick={(e) => handleLike(article.id, e)} 
                      style={{ background: 'none', border: 'none', color: interactions[article.id]?.liked ? '#fa5252' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
                    >
                      <Heart size={15} fill={interactions[article.id]?.liked ? '#fa5252' : 'none'} /> {interactions[article.id]?.likes || 0}
                    </button>
                    <button 
                      onClick={() => { if (article.approved !== false) setSelectedArticle(article); }} 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
                    >
                      <MessageSquare size={15} /> {interactions[article.id]?.comments?.length || 0}
                    </button>
                    <button 
                      onClick={(e) => handleShare(article.id, article.title, e)} 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', padding: 0, position: 'relative' }}
                    >
                      <Share2 size={15} /> {interactions[article.id]?.shares || 0}
                      {shareAlert === article.id && (
                        <span style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#37b24d', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.65rem', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Tersalin!</span>
                      )}
                    </button>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsGiftModalOpen(article.id); }} 
                    style={{ background: 'rgba(245, 159, 0, 0.08)', border: 'none', color: '#f59f00', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 159, 0, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245, 159, 0, 0.08)'; }}
                  >
                    <Gift size={13} /> Gift
                  </button>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                  <img src={article.avatar} alt={article.author} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f3f5', border: '1px solid var(--border-color)' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{article.author}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{article.role}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '16px' }}>
                  Baca Artikel Lengkap <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULL ARTICLE MODAL READ OVERLAY */}
        {selectedArticle && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            padding: '20px'
          }}
          onClick={() => setSelectedArticle(null)}
          >
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '28px',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  border: 'none',
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  zIndex: 2
                }}
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div style={{ padding: '40px 40px 24px 40px', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(180deg, rgba(12,166,120,0.03), transparent)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', backgroundColor: 'rgba(12,166,120,0.08)', padding: '4px 12px', borderRadius: '12px', marginBottom: '16px' }}>
                  <Sparkles size={12} /> Esai Sains & Kearifan Bambu
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 20px 0', lineHeight: '1.3' }}>
                  {selectedArticle.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={selectedArticle.avatar} alt={selectedArticle.author} style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f1f3f5', border: '1px solid var(--border-color)' }} />
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{selectedArticle.author}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedArticle.role}</div>
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {selectedArticle.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {selectedArticle.readTime}</span>
                  </div>
                </div>

                {/* Social Interaction Row in Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <button 
                      onClick={(e) => handleLike(selectedArticle.id, e)} 
                      style={{ background: 'none', border: 'none', color: interactions[selectedArticle.id]?.liked ? '#fa5252' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
                    >
                      <Heart size={20} fill={interactions[selectedArticle.id]?.liked ? '#fa5252' : 'none'} /> {interactions[selectedArticle.id]?.likes || 0} Suka
                    </button>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                      <MessageSquare size={20} /> {interactions[selectedArticle.id]?.comments?.length || 0} Komentar
                    </span>
                    <button 
                      onClick={(e) => handleShare(selectedArticle.id, selectedArticle.title, e)} 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', position: 'relative' }}
                    >
                      <Share2 size={20} /> {interactions[selectedArticle.id]?.shares || 0} Bagikan
                      {shareAlert === selectedArticle.id && (
                        <span style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', background: '#37b24d', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>Tautan disalin!</span>
                      )}
                    </button>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsGiftModalOpen(selectedArticle.id); }} 
                    style={{ background: 'linear-gradient(135deg, #f59f00 0%, #e67e22 100%)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(245,159,0,0.25)', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Gift size={18} /> Kirim Gift
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div style={{ overflowY: 'auto', padding: '32px 40px', fontSize: '1.02rem', lineHeight: '1.8', color: 'var(--text-main)' }}>
                {/* Image Gallery / Slider */}
                {selectedArticle.images && selectedArticle.images.length > 1 ? (
                  <div style={{ position: 'relative', width: '100%', marginBottom: '24px' }}>
                    {/* Horizontal scroll container with scroll snap */}
                    <div 
                      ref={articleImageContainerRef}
                      onScroll={handleArticleImageScroll}
                      style={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        scrollBehavior: 'smooth',
                        borderRadius: '20px',
                        background: '#fdfdfd',
                        border: '1px solid var(--border-color)',
                        maxHeight: '480px',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                      }}
                      className="hide-scrollbar"
                    >
                      {selectedArticle.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          style={{
                            minWidth: '100%',
                            maxHeight: '480px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            scrollSnapAlign: 'start',
                            background: '#fdfdfd'
                          }}
                        >
                          <img 
                            src={img} 
                            alt={`Slide ${idx + 1}`} 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '480px', 
                              objectFit: 'contain',
                              width: 'auto',
                              height: 'auto'
                            }} 
                          />
                        </div>
                      ))}
                    </div>

                    {/* Navigation Buttons (Left/Right Arrows) */}
                    <button
                      onClick={handlePrevArticleImg}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '16px',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 10,
                        color: 'var(--text-main)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={handleNextArticleImg}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '16px',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 10,
                        color: 'var(--text-main)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Dot Indicators */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '12px'
                    }}>
                      {selectedArticle.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => scrollToArticleImage(idx)}
                          style={{
                            width: currentArticleImgIdx === idx ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: currentArticleImgIdx === idx ? 'var(--primary)' : 'rgba(0,0,0,0.15)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            padding: 0
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (selectedArticle.image || (selectedArticle.images && selectedArticle.images[0])) ? (
                  <div style={{ width: '100%', maxHeight: '480px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fdfdfd', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                    <img src={selectedArticle.image || selectedArticle.images[0]} alt={selectedArticle.title} style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain' }} />
                  </div>
                ) : null}
                {selectedArticle.content.split('\n\n').map((para, i) => (
                  <p key={i} style={{ margin: '0 0 20px 0', whiteSpace: 'pre-line' }}>{para}</p>
                ))}

                {/* Comments Section */}
                <div style={{ marginTop: '40px', borderTop: '2px solid var(--border-color)', paddingTop: '30px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={20} color="var(--primary)" /> Diskusi & Komentar ({interactions[selectedArticle.id]?.comments.length})
                  </h3>

                  {/* Comments List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                    {interactions[selectedArticle.id]?.comments.map((comm, idx) => (
                      <div key={idx} style={{ background: '#f8f9fa', borderRadius: '16px', padding: '16px 20px', border: '1px solid #e9ecef' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
                              {comm.user.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{comm.user}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comm.date}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{comm.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input Form */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f8f9fa', borderRadius: '20px', padding: '16px', border: '1px solid #e9ecef' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fa5252', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>
                      {(user?.displayName || user?.email?.charAt(0) || "P").toUpperCase()}
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Tulis ulasan ilmiah atau tanggapan Anda..."
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          border: '1px solid #dee2e6',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '0.9rem',
                          color: 'var(--text-main)',
                          background: 'white',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          outline: 'none'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleAddComment(selectedArticle.id)}
                          style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(12,166,120,0.2)'
                          }}
                        >
                          <Send size={14} /> Kirim Komentar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '20px 40px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--bg-card)' }}>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(12,166,120,0.2)'
                  }}
                >
                  Selesai Membaca
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GIFT MODAL OVERLAY */}
        {isGiftModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100005,
            padding: '20px'
          }}
          onClick={() => { if (giftStatus !== 'processing') setIsGiftModalOpen(null); }}
          >
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              maxWidth: '450px',
              width: '100%',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              {giftStatus !== 'processing' && (
                <button 
                  onClick={() => setIsGiftModalOpen(null)}
                  style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                  <X size={16} />
                </button>
              )}

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(245, 159, 0, 0.1)', color: '#f59f00', padding: '16px', borderRadius: '50%', width: 'fit-content', margin: '0 auto 16px auto' }}>
                  <Gift size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 8px 0' }}>Kirim Apresiasi Token (Gift)</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                  Berikan kontribusi BMC Token sebagai bentuk dukungan ilmiah kepada penulis artikel.
                </p>
              </div>

              {giftStatus === 'idle' && (
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '10px' }}>Pilih Jumlah Gift (BMC):</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                    {["5", "10", "20", "50"].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setGiftAmount(amt)}
                        style={{
                          background: giftAmount === amt ? 'var(--primary)' : 'rgba(0,0,0,0.02)',
                          color: giftAmount === amt ? 'white' : 'var(--text-main)',
                          border: giftAmount === amt ? 'none' : '1px solid var(--border-color)',
                          borderRadius: '10px',
                          padding: '10px 0',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Jumlah Kustom:</label>
                    <input 
                      type="number" 
                      value={giftAmount} 
                      onChange={(e) => setGiftAmount(e.target.value)}
                      placeholder="Masukkan jumlah BMC..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        background: 'white',
                        outline: 'none',
                        color: 'var(--text-main)'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSendGift}
                    style={{
                      width: '100%',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 15px rgba(12,166,120,0.2)'
                    }}
                  >
                    <Gift size={18} /> Kirim {giftAmount} BMC
                  </button>
                </div>
              )}

              {giftStatus === 'processing' && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ border: '4px solid rgba(12,166,120,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Mengamankan Transaksi On-Chain...</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Silakan tunggu beberapa saat.</p>
                </div>
              )}

              {giftStatus === 'success' && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '16px' }}>🎉</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 8px 0' }}>Transaksi Berhasil!</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Hadiah berupa <strong>{giftAmount} BMC</strong> telah sukses terkirim ke alamat dompet penulis sebagai bentuk apresiasi orisinalitas ilmiah. Terima kasih atas partisipasi aktif Anda!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WRITER SUBMISSION MODAL OVERLAY */}
        {isWriterModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100005,
            padding: '20px'
          }}
          onClick={() => setIsWriterModalOpen(false)}
          >
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '28px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => setIsWriterModalOpen(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
              >
                <X size={18} />
              </button>

              <div style={{ padding: '30px 40px 20px 40px', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(180deg, rgba(12,166,120,0.03), transparent)' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={22} color="var(--primary)" /> Buat Esai & Tulisan Pegiat Baru
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                  Bagikan hasil riset, metodologi, arsitektur modular, atau kearifan lokal Anda ke komunitas hijau dunia.
                </p>
              </div>

              {/* Scrollable Form Body */}
              <div style={{ overflowY: 'auto', padding: '30px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Judul Artikel/Esai:</label>
                  <input 
                    type="text" 
                    value={newArticleForm.title} 
                    onChange={(e) => setNewArticleForm({...newArticleForm, title: e.target.value})}
                    placeholder="Contoh: Metodologi Pengawetan Bambu Tali Modern..."
                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: 'white', color: 'var(--text-main)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Kategori:</label>
                    <select 
                      value={newArticleForm.category} 
                      onChange={(e) => setNewArticleForm({...newArticleForm, category: e.target.value})}
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: 'white', color: 'var(--text-main)' }}
                    >
                      <option value="Sains Bambu">Sains Bambu</option>
                      <option value="Arsitektur Hijau">Arsitektur Hijau</option>
                      <option value="Ekologi Karbon">Ekologi Karbon</option>
                      <option value="Kearifan Lokal">Kearifan Lokal</option>
                      <option value="Budidaya Bambu">Budidaya Bambu</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Estimasi Waktu Baca:</label>
                    <input 
                      type="text" 
                      value={newArticleForm.readTime} 
                      onChange={(e) => setNewArticleForm({...newArticleForm, readTime: e.target.value})}
                      placeholder="Contoh: 5 Menit Baca"
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: 'white', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                {newArticleForm.category === 'Lainnya' && (
                  <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Kategori Lainnya (Sebutkan):</label>
                    <input 
                      type="text" 
                      value={newArticleForm.otherCategory} 
                      onChange={(e) => setNewArticleForm({...newArticleForm, otherCategory: e.target.value})}
                      placeholder="Contoh: Kerajinan Bambu, Kebijakan Hijau, dll..."
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: 'white', color: 'var(--text-main)' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Ringkasan Singkat (Excerpt):</label>
                  <input 
                    type="text" 
                    value={newArticleForm.excerpt} 
                    onChange={(e) => setNewArticleForm({...newArticleForm, excerpt: e.target.value})}
                    placeholder="Tulis ringkasan 1-2 kalimat untuk kartu artikel..."
                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: 'white', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Konten / Isi Lengkap Tulisan:</label>
                  <textarea 
                    value={newArticleForm.content} 
                    onChange={(e) => setNewArticleForm({...newArticleForm, content: e.target.value})}
                    placeholder="Tuliskan analisis ilmiah lengkap Anda di sini per paragraf..."
                    style={{ width: '100%', minHeight: '180px', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: 'white', color: 'var(--text-main)', fontFamily: 'inherit', resize: 'vertical', marginBottom: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Foto / Gambar Pendukung (Opsional):</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => document.getElementById('article-image-upload').click()}
                        style={{
                          background: 'rgba(12,166,120,0.06)',
                          color: 'var(--primary)',
                          border: '1px dashed var(--primary)',
                          borderRadius: '12px',
                          padding: '12px 20px',
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(12,166,120,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(12,166,120,0.06)'}
                      >
                        <Sparkles size={16} /> Pilih Foto Artikel
                      </button>
                       <input 
                        id="article-image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            const newImages = [];
                            let loadedCount = 0;
                            files.forEach((file) => {
                              const reader = new FileReader();
                              reader.onload = async (uploadEvent) => {
                                const base64 = uploadEvent.target.result;
                                try {
                                  // Compress to max 800x800 and quality 0.55
                                  const compressed = await compressImage(base64, 800, 800, 0.55);
                                  newImages.push(compressed);
                                } catch (err) {
                                  newImages.push(base64);
                                }
                                loadedCount++;
                                if (loadedCount === files.length) {
                                  setNewArticleForm(prev => ({
                                    ...prev,
                                    images: [...(prev.images || []), ...newImages],
                                    image: prev.image || newImages[0]
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      {((newArticleForm.images && newArticleForm.images.length > 0) || newArticleForm.image) && (
                        <button
                          type="button"
                          onClick={() => setNewArticleForm({ ...newArticleForm, image: '', images: [] })}
                          style={{
                            background: 'rgba(250,82,82,0.08)',
                            color: '#fa5252',
                            border: '1px solid rgba(250,82,82,0.2)',
                            borderRadius: '10px',
                            padding: '6px 12px',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Hapus Semua Foto
                        </button>
                      )}
                    </div>
                    {newArticleForm.images && newArticleForm.images.length > 0 && (
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {newArticleForm.images.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#f8f9fa' }}>
                            <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = newArticleForm.images.filter((_, i) => i !== idx);
                                setNewArticleForm({
                                  ...newArticleForm,
                                  images: filtered,
                                  image: filtered.length > 0 ? filtered[0] : ''
                                });
                              }}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'rgba(250,82,82,0.85)',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div style={{ padding: '20px 40px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--bg-card)' }}>
                <button 
                  onClick={() => setIsWriterModalOpen(false)}
                  style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  onClick={handleNewArticleSubmit}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(12,166,120,0.2)' }}
                >
                  Kirim ke Admin
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AcademyPage;
