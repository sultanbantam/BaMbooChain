import React from 'react';
import { motion } from 'framer-motion';
import { FaGem, FaMedal, FaAward } from 'react-icons/fa';

const MembershipCards = ({ user, onJoin }) => {
  const tiers = [
    {
      name: 'Silver Member',
      icon: <FaMedal size={30} color="#adb5bd" />,
      requirement: '100 BMC',
      benefits: ['Akses Pasar & Pembeli', 'Diskon Bibit Unggul', 'Info Harga Terbaru'],
      detailedBenefits: [
        'Bantuan mencarikan pembeli atau akses langsung ke pasar bagi hasil panen bambu Anda.',
        'Mendapatkan potongan harga khusus saat membeli bibit bambu berkualitas dari koperasi.',
        'Menerima kabar rutin tentang harga bambu di pasaran agar tidak tertipu.'
      ],
      gradient: 'linear-gradient(135deg, #dee2e6, #adb5bd)',
      shadow: 'rgba(173, 181, 189, 0.4)'
    },
    {
      name: 'Gold Member',
      icon: <FaAward size={30} color="#fab005" />,
      requirement: '500 BMC',
      benefits: ['Hak Silver +', 'Pendampingan Ahli', 'Bagi Hasil (SHU)', 'Prioritas Pinjaman'],
      detailedBenefits: [
        'Mendapatkan semua kemudahan yang ada di keanggotaan Silver.',
        'Bisa bertanya dan didampingi langsung oleh ahli bambu untuk masalah kebun atau produksi Anda.',
        'Ikut menikmati pembagian keuntungan (Sisa Hasil Usaha) rutin dari koperasi KoDiBa.',
        'Didahulukan jika Anda membutuhkan pinjaman alat atau dana modal usaha bambu.'
      ],
      gradient: 'linear-gradient(135deg, #ffe066, #fab005)',
      shadow: 'rgba(250, 176, 5, 0.4)',
      popular: true
    },
    {
      name: 'Platinum Member',
      icon: <FaGem size={30} color="#4dabf7" />,
      requirement: '1000 BMC',
      benefits: ['Hak Gold +', 'Pendanaan Proyek Penuh', 'Akses VIP Sesepuh', 'SHU Maksimal'],
      detailedBenefits: [
        'Mendapatkan semua hak istimewa yang ada di keanggotaan Gold.',
        'Koperasi dapat memodali 100% ide atau proyek bambu Anda yang berpotensi.',
        'Akses pertemuan khusus dengan tokoh besar, akademisi, dan sesepuh bambu Nusantara.',
        'Mendapatkan porsi pembagian keuntungan (SHU) yang paling besar dan prioritas investasi.'
      ],
      gradient: 'linear-gradient(135deg, #74c0fc, #228be6)',
      shadow: 'rgba(34, 139, 230, 0.4)'
    }
  ];

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      padding: '40px 0'
    },
    card: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '30px',
      padding: '40px',
      border: '1px solid rgba(255,255,255,0.1)',
      textAlign: 'center',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    },
    popularBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: '#fab005',
      color: 'black',
      padding: '5px 15px',
      borderRadius: '0 0 0 15px',
      fontSize: '0.7rem',
      fontWeight: '900',
      textTransform: 'uppercase'
    },
    iconBox: {
      width: '70px',
      height: '70px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '25px'
    },
    tierName: {
      fontSize: '1.6rem',
      fontWeight: '900',
      margin: '0 0 10px 0'
    },
    req: {
      color: '#51cf66',
      fontSize: '0.85rem',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      marginBottom: '30px'
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 40px 0',
      textAlign: 'left',
      width: '100%'
    },
    listItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#ced4da',
      fontSize: '0.9rem',
      marginBottom: '12px'
    },
    btn: {
      width: '100%',
      padding: '15px',
      borderRadius: '15px',
      border: 'none',
      fontWeight: '900',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      cursor: 'pointer',
      marginTop: 'auto',
      transition: 'all 0.2s'
    }
  };

  return (
    <div style={styles.grid}>
      {tiers.map((tier, i) => (
        <motion.div 
          key={i} 
          style={{ ...styles.card, boxShadow: `0 20px 50px ${tier.shadow}` }}
          whileHover={{ transform: 'translateY(-10px)', borderColor: tier.popular ? '#fab005' : 'white' }}
        >
          {tier.popular && <div style={styles.popularBadge}>Terpopuler</div>}
          
          <div style={{ ...styles.iconBox, background: tier.gradient }}>
            {tier.icon}
          </div>
          
          <h3 style={styles.tierName}>{tier.name}</h3>
          <p style={styles.req}>REQ: {tier.requirement} STAKING</p>
          
          <ul style={styles.list}>
            {tier.benefits.map((b, idx) => (
              <li key={idx} style={styles.listItem}>
                <span style={{ color: '#51cf66' }}>✓</span> {b}
              </li>
            ))}
          </ul>
          
          <button 
            onClick={() => onJoin(tier)}
            disabled={user?.kodibaTier === tier.name}
            style={{ 
              ...styles.btn, 
              backgroundColor: user?.kodibaTier === tier.name ? '#51cf66' : (tier.popular ? '#fab005' : 'rgba(255,255,255,0.1)'),
              color: user?.kodibaTier === tier.name ? 'black' : (tier.popular ? 'black' : 'white'),
              cursor: user?.kodibaTier === tier.name ? 'default' : 'pointer'
            }}
          >
            {user?.kodibaTier === tier.name ? 'Telah Aktif ✓' : `Join ${tier.name}`}
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default MembershipCards;
