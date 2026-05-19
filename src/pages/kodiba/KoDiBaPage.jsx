import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MembershipCards from '../../components/kodiba/MembershipCards';
import { FaChartLine, FaUsers, FaLeaf, FaCoins, FaStore, FaBoxOpen, FaFilePdf, FaBookOpen } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const KoDiBaPage = () => {
  const { user, setIsAuthModalOpen, setAuthModalInitialTab, addNotification, addReward, joinKodibaTier } = useAuth();
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimCount, setClaimCount] = useState(753); // Mock initial count

  // Modal State for Joining Tier
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const checkClaim = async () => {
      if (user) {
        try {
          const q = query(collection(db, "airdrop_claims"), where("userId", "==", user.id));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setHasClaimed(true);
          }
        } catch (error) {
          console.error("Error checking airdrop claim:", error);
        }
      } else {
        setHasClaimed(false);
      }
    };
    checkClaim();
  }, [user]);

  const handleClaim = async () => {
    if (!user) {
      if(addNotification) addNotification("Silakan Login/Daftar terlebih dahulu untuk mengklaim Airdrop.", "warning");
      if (setAuthModalInitialTab) setAuthModalInitialTab('login');
      if (setIsAuthModalOpen) setIsAuthModalOpen(true);
      return;
    }

    if (hasClaimed) return;

    setIsClaiming(true);
    try {
      await addDoc(collection(db, "airdrop_claims"), {
        userId: user.id,
        userName: user.name || user.username || 'user',
        amount: 10,
        asset: 'BMC',
        timestamp: serverTimestamp()
      });
      
      // Update wallet balance using AuthContext
      if (addReward) {
        addReward(10, "Airdrop Pengguna Baru (KoDiBa)", "Earn");
      }
      
      setHasClaimed(true);
      setClaimCount(prev => prev + 1);
      if(addNotification) addNotification("Berhasil! 10 BMC Gratis telah ditambahkan ke wallet Anda.", "success");
    } catch (error) {
      console.error("Error claiming airdrop:", error);
      if(addNotification) addNotification("Gagal mengklaim Airdrop. Silakan coba lagi.", "error");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleJoinClick = (tier) => {
    if (!user) {
      if(addNotification) addNotification("Silakan Login/Daftar terlebih dahulu untuk bergabung.", "warning");
      if (setAuthModalInitialTab) setAuthModalInitialTab('login');
      if (setIsAuthModalOpen) setIsAuthModalOpen(true);
      return;
    }
    setSelectedTier(tier);
    setShowJoinModal(true);
  };

  const confirmJoin = async () => {
    if (!selectedTier || !user) return;
    setIsJoining(true);
    
    // Extract the number from requirement string (e.g. "500 BMC" -> 500)
    const amount = parseInt(selectedTier.requirement.replace(/\D/g, ''));
    
    const success = await joinKodibaTier(selectedTier.name, amount);
    if (success) {
      setShowJoinModal(false);
    }
    setIsJoining(false);
  };

  const stats = [
    { label: 'Total Anggota', value: '1.240', icon: <FaUsers size={24} color="#0ca678" /> },
    { label: 'BMC Terkumpul', value: '850.000', icon: <FaCoins size={24} color="#fab005" /> },
    { label: 'Hektar Penanaman', value: '450 Ha', icon: <FaLeaf size={24} color="#51cf66" /> },
    { label: 'Proyek Aktif', value: '12', icon: <FaChartLine size={24} color="#228be6" /> },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0a0f0a, #1a2e1a)',
      color: 'white',
      paddingTop: '240px',
      paddingBottom: '80px',
      paddingLeft: '30px',
      paddingRight: '30px',
      fontFamily: 'sans-serif'
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    hero: {
      textAlign: 'center',
      marginBottom: '80px'
    },
    badge: {
      display: 'inline-block',
      padding: '5px 15px',
      borderRadius: '20px',
      backgroundColor: 'rgba(12, 166, 120, 0.2)',
      color: '#51cf66',
      fontSize: '0.7rem',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '25px',
      border: '1px solid rgba(12, 166, 120, 0.3)'
    },
    title: {
      fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
      fontWeight: '900',
      marginBottom: '25px',
      lineHeight: '1.1',
      letterSpacing: '-2px'
    },
    highlight: {
      background: 'linear-gradient(to right, #51cf66, #fab005)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    desc: {
      color: '#adb5bd',
      fontSize: '1.2rem',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '100px'
    },
    statCard: {
      padding: '30px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.1)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    benefitBox: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '50px',
      alignItems: 'center',
      backgroundColor: 'rgba(12, 166, 120, 0.05)',
      borderRadius: '40px',
      padding: '50px',
      border: '1px solid rgba(12, 166, 120, 0.2)',
      marginTop: '100px'
    },
    benefitItem: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px'
    },
    iconCircle: {
      minWidth: '50px',
      height: '50px',
      borderRadius: '15px',
      backgroundColor: 'rgba(12, 166, 120, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    ctaSection: {
      textAlign: 'center',
      marginTop: '120px'
    },
    mainBtn: {
      padding: '20px 40px',
      backgroundColor: '#51cf66',
      color: 'black',
      border: 'none',
      borderRadius: '20px',
      fontWeight: '900',
      fontSize: '1.1rem',
      cursor: 'pointer',
      boxShadow: '0 10px 30px rgba(12, 166, 120, 0.3)'
    },
    airdropBanner: {
      background: 'linear-gradient(135deg, rgba(12, 166, 120, 0.1), rgba(250, 176, 5, 0.1))',
      border: '1px solid rgba(81, 207, 102, 0.3)',
      borderRadius: '30px',
      padding: '40px',
      textAlign: 'center',
      marginBottom: '80px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    },
    airdropBtn: {
      padding: '15px 30px',
      backgroundColor: '#fab005',
      color: 'black',
      border: 'none',
      borderRadius: '15px',
      fontWeight: '900',
      fontSize: '1.1rem',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(250, 176, 5, 0.3)',
      marginTop: '20px',
      transition: 'all 0.3s'
    },
    airdropBtnDisabled: {
      padding: '15px 30px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: '#adb5bd',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '15px',
      fontWeight: '900',
      fontSize: '1.1rem',
      cursor: 'not-allowed',
      marginTop: '20px'
    },
    progressBarBg: {
      width: '100%',
      maxWidth: '500px',
      height: '15px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '10px',
      margin: '20px auto',
      overflow: 'hidden'
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#51cf66',
      borderRadius: '10px',
      transition: 'width 1s ease-out'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <motion.div style={styles.badge} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Koperasi Digital Bambu (KoDiBa)
          </motion.div>
          <motion.h1 style={styles.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Membangun <span style={styles.highlight}>Ekonomi Hijau</span> <br /> Secara Kolektif
          </motion.h1>
          <motion.p style={styles.desc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Selamat bergabung di koperasi digital berbasis blockchain pertama untuk pegiat bambu. 
            Staking token BMC Anda untuk menjadi bagian dari revolusi ekonomi hijau.
          </motion.p>
        </div>

        {/* Airdrop Banner */}
        <motion.div style={styles.airdropBanner} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div style={{ display: 'inline-block', backgroundColor: '#51cf66', color: 'black', padding: '5px 15px', borderRadius: '20px', fontWeight: '900', fontSize: '0.8rem', marginBottom: '15px', textTransform: 'uppercase' }}>
            🎉 Spesial Pengguna Baru
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', marginBottom: '15px', color: '#ffec99' }}>
            Airdrop 10 BMC Gratis!
          </h2>
          <p style={{ color: '#adb5bd', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Dapatkan "Bibit Digital" pertama Anda secara cuma-cuma khusus untuk 1.000 pendaftar pertama yang menyelesaikan pendaftaran hari ini.
          </p>
          
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${(claimCount / 1000) * 100}%` }}></div>
          </div>
          <p style={{ color: '#51cf66', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Sisa Kuota: {1000 - claimCount} orang lagi! (Telah diklaim: {claimCount}/1000)
          </p>
          
          <button 
            style={hasClaimed || isClaiming ? styles.airdropBtnDisabled : styles.airdropBtn}
            onClick={handleClaim}
            disabled={hasClaimed || isClaiming}
          >
            {isClaiming ? 'Memproses...' : hasClaimed ? 'Airdrop Berhasil Diklaim ✅' : 'Klaim 10 BMC Sekarang'}
          </button>
        </motion.div>

        <div style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <motion.div key={i} style={styles.statCard} whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                {stat.icon}
              </div>
              <h4 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 5px 0' }}>{stat.value}</h4>
              <p style={{ color: '#5c5c5c', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div id="tier-section" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '15px' }}>Pilih Tier Keanggotaan</h2>
          <p style={{ color: '#adb5bd' }}>Setiap tier memberikan keuntungan khusus dalam ekosistem BaMbooChain.</p>
        </div>
        
        <MembershipCards user={user} onJoin={handleJoinClick} />

        {showJoinModal && selectedTier && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left', border: `1px solid ${selectedTier.popular ? '#fab005' : 'var(--border-color)'}`, display: 'flex', flexDirection: 'column' }}
            >
              <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '10px', color: selectedTier.popular ? '#fab005' : '#51cf66', textAlign: 'center' }}>Hak Istimewa {selectedTier.name}</h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Berikut adalah keuntungan yang akan Anda nikmati:</p>
              
              <div style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '30px', paddingRight: '15px' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {selectedTier.detailedBenefits && selectedTier.detailedBenefits.map((benefit, idx) => (
                    <li key={idx} style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                      <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', backgroundColor: selectedTier.popular ? 'rgba(250, 176, 5, 0.2)' : 'rgba(81, 207, 102, 0.2)', color: selectedTier.popular ? '#fab005' : '#51cf66', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {idx + 1}
                      </div>
                      <div>{benefit}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '15px', marginBottom: '30px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', marginBottom: '10px', color: 'var(--text-main)' }}>Konfirmasi Staking</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                  Anda akan melakukan staking (mengunci saldo) sebesar <strong style={{ color: selectedTier.popular ? '#fab005' : '#51cf66', fontSize: '1.1rem' }}>{selectedTier.requirement}</strong> untuk mengaktifkan fitur ini. Lanjutkan?
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: 'auto' }}>
                <button 
                  onClick={() => setShowJoinModal(false)}
                  style={{ padding: '15px 30px', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                  disabled={isJoining}
                >
                  Kembali
                </button>
                <button 
                  onClick={confirmJoin}
                  style={{ padding: '15px 30px', background: selectedTier.popular ? '#fab005' : '#51cf66', border: 'none', color: 'black', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                  disabled={isJoining}
                >
                  {isJoining ? 'Memproses...' : 'Ya, Saya Setuju & Lanjutkan'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div style={styles.benefitBox}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '40px', lineHeight: '1.2' }}>Keuntungan <br /> Menjadi Anggota</h2>
            
            <div style={styles.benefitItem}>
              <div style={styles.iconCircle}><FaLeaf color="#51cf66" /></div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: '800' }}>Bagi Hasil Koperasi (SHU)</h4>
                <p style={{ color: '#adb5bd', fontSize: '0.9rem', margin: 0 }}>Dapatkan keuntungan tahunan berupa Sisa Hasil Usaha (SHU) yang dibagikan otomatis ke dompet digital Anda.</p>
              </div>
            </div>
            
            <div style={styles.benefitItem}>
              <div style={{ ...styles.iconCircle, backgroundColor: 'rgba(250, 176, 5, 0.2)' }}><FaCoins color="#fab005" /></div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: '800' }}>Bantuan Modal Proyek</h4>
                <p style={{ color: '#adb5bd', fontSize: '0.9rem', margin: 0 }}>Kemudahan mengajukan pinjaman modal usaha untuk kebutuhan menanam atau mengolah bambu Anda.</p>
              </div>
            </div>

            <div style={styles.benefitItem}>
              <div style={{ ...styles.iconCircle, backgroundColor: 'rgba(51, 154, 240, 0.2)' }}><FaStore color="#339af0" /></div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: '800' }}>Harga Khusus Koperasi</h4>
                <p style={{ color: '#adb5bd', fontSize: '0.9rem', margin: 0 }}>Nikmati potongan harga spesial saat berbelanja bibit unggul, pupuk, hingga kebutuhan operasional lainnya.</p>
              </div>
            </div>

            <div style={styles.benefitItem}>
              <div style={{ ...styles.iconCircle, backgroundColor: 'rgba(235, 85, 105, 0.2)' }}><FaUsers color="#eb5569" /></div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: '800' }}>Pendampingan Gratis</h4>
                <p style={{ color: '#adb5bd', fontSize: '0.9rem', margin: 0 }}>Didampingi langsung oleh para pakar dan sesepuh dari tahap persiapan lahan hingga masa panen tiba.</p>
              </div>
            </div>

            <div style={styles.benefitItem}>
              <div style={{ ...styles.iconCircle, backgroundColor: 'rgba(132, 94, 247, 0.2)' }}><FaBoxOpen color="#845ef7" /></div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: '800' }}>Jaminan Serapan Panen</h4>
                <p style={{ color: '#adb5bd', fontSize: '0.9rem', margin: 0 }}>Hasil panen bambu Bapak/Ibu akan diprioritaskan untuk dibeli oleh pabrik dengan harga yang stabil & adil.</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img 
              src="/gambar/1.jpeg" 
              style={{ width: '100%', borderRadius: '30px', filter: 'grayscale(0.15)', border: '2px solid rgba(81, 207, 102, 0.3)' }} 
              alt="Desain Fasilitas Bambu YSNJ" 
            />
          </div>
        </div>

        {/* AD/ART Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1.5px solid rgba(81, 207, 102, 0.15)',
          borderRadius: '32px',
          padding: '40px 24px',
          marginBottom: '50px',
          color: 'white',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(81, 207, 102, 0.1)', color: '#51cf66', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '15px' }}>
              <FaBookOpen /> ANGGARAN DASAR & ANGGARAN RUMAH TANGGA
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.3rem)', fontWeight: '900', margin: '0 0 16px 0', letterSpacing: '-0.5px', lineHeight: '1.2' }}>Intisari AD/ART KODIBA</h2>
            <p style={{ color: '#adb5bd', maxWidth: '700px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Koperasi Digital Bambu Indonesia (KODIBA) beroperasi digital penuh berasaskan gotong royong dengan landasan Pancasila, UUD 1945, ekonomi hijau, dan teknologi yang transparan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {[
              {
                title: "1. Landasan & Tujuan Koperasi (Bab I-II)",
                desc: "KODIBA berasaskan gotong royong & Pancasila, bertujuan meningkatkan kesejahteraan anggota melalui ekonomi hijau berbasis bambu, melestarikan database bambu Nusantara, dan mempermudah simpan pinjam digital."
              },
              {
                title: "2. Kegiatan Usaha & Keanggotaan (Bab III-IV)",
                desc: "Kegiatan meliputi simpan pinjam, pendataan bibit/lahan bambu, pengumpulan karya ilmiah, pelatihan, perdagangan produk bambu, serta kemitraan dengan petani, peneliti, dosen, pengrajin, dan masyarakat adat."
              },
              {
                title: "3. Tabungan Data & Poin BMC (Bab V & ART)",
                desc: "Setiap data bambu (bibit, lokasi, riset) yang disetor diubah secara transparan menjadi kredit penghargaan internal BaMbooChain (BMC). BMC digunakan sebagai jaminan pinjaman dan belanja dalam ekosistem."
              },
              {
                title: "4. Perlindungan Data & Hak Cipta (Bab VI)",
                desc: "Kepemilikan data yang disetorkan tetap berada di tangan anggota. Koperasi hanya memiliki hak pengelolaan yang disetujui, serta menghormati penuh hak cipta dan kekayaan intelektual masyarakat adat."
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '24px',
                transition: 'all 0.3s'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', fontWeight: '800', color: '#51cf66' }}>{item.title}</h4>
                <p style={{ margin: 0, color: '#adb5bd', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(81, 207, 102, 0.05)',
            border: '1.5px dashed rgba(81, 207, 102, 0.3)',
            borderRadius: '24px',
            padding: '30px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ fontSize: '2rem' }}>📄</div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 'bold' }}>Ingin Membaca AD/ART KODIBA Selengkapnya?</h4>
              <p style={{ margin: '0 0 12px 0', color: '#adb5bd', fontSize: '0.85rem' }}>Dokumen Anggaran Dasar dan Anggaran Rumah Tangga (AD/ART) resmi tersedia dalam format PDF untuk diunduh.</p>
            </div>
            <a 
              href="/assets/pedoman/adart.pdf" 
              download="AD_ART_KODIBA.pdf"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#51cf66',
                color: 'black',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: '900',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(81, 207, 102, 0.25)',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <FaFilePdf size={16} /> Unduh Dokumen AD/ART (PDF)
            </a>
          </div>
        </div>

        <div style={styles.ctaSection}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '20px' }}>Siap Bergabung dengan Masa Depan Ekonomi Hijau?</h2>
          <p style={{ color: '#adb5bd', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>Daftarkan diri Anda sekarang, atau kunjungi Toko Koperasi untuk menikmati fasilitas Member VIP.</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              style={styles.mainBtn}
              onClick={() => {
                if (!user) {
                  if (setAuthModalInitialTab) setAuthModalInitialTab('login');
                  if (setIsAuthModalOpen) setIsAuthModalOpen(true);
                } else {
                  document.getElementById('tier-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {user && user.kodibaTier ? 'DASHBOARD MEMBER' : 'DAFTAR KODIBA SEKARANG'}
            </button>
            <a href="#/bamboochain/marketplace" style={{ ...styles.mainBtn, backgroundColor: 'transparent', border: '2px solid #fab005', color: '#fab005', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
               KUNJUNGI TOKO KOPERASI
            </a>
          </div>
          <p style={{ marginTop: '20px', color: '#5c5c5c', fontSize: '0.85rem', fontStyle: 'italic' }}>*Staking BMC memerlukan verifikasi KYC untuk keamanan koperasi.</p>
        </div>
      </div>
    </div>
  );
};

export default KoDiBaPage;
