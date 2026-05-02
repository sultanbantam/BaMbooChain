import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ExternalLink, Copy, LogOut, Coins, Wallet, Activity, RefreshCw, Users, Gift, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTokenTransactions } from '../utils/apiService';
import { formatUnits } from 'ethers';

const ProfilePage = () => {
  const { walletAddress, bmcBalance, bnbBalance, isConnected, connectWallet, disconnectWallet, BMC_CONTRACT_ADDRESS } = useWeb3();
  const [txHistory, setTxHistory] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [refCopied, setRefCopied] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    setTxLoading(true);
    getTokenTransactions(walletAddress, 1, 5)
      .then(data => setTxHistory(Array.isArray(data) ? data : []))
      .catch(() => setTxHistory([]))
      .finally(() => setTxLoading(false));
  }, [walletAddress]);

  const formatBMC = (val) => parseFloat(formatUnits(val, 18)).toLocaleString('id-ID', { maximumFractionDigits: 2 });
  const shortAddr = (addr) => addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : '';
  const formatDate = (ts) => new Date(parseInt(ts) * 1000).toLocaleDateString('id-ID', { day:'2-digit', month:'short' });
  const handleCopy = () => navigator.clipboard.writeText(walletAddress);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(`https://bambunusa.com/?ref=${walletAddress}`);
    setRefCopied(true);
    setTimeout(() => setRefCopied(false), 2000);
  };

  // Warna avatar deterministik dari alamat wallet
  const avatarColor = walletAddress
    ? `hsl(${parseInt(walletAddress.slice(2, 8), 16) % 360}, 70%, 50%)`
    : '#aaa';

  if (!isConnected) {
    return (
      <div style={{ paddingTop: '160px', minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '60px 40px', textAlign: 'center', maxWidth: '500px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <Wallet size={60} color="var(--primary)" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Hubungkan Wallet Anda</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Koneksikan wallet BSC Anda untuk melihat profil, saldo BMC, dan riwayat transaksi Anda.</p>
          <button onClick={connectWallet} className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            🔗 Hubungkan Wallet
          </button>
          <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Butuh wallet? Download <a href="https://metamask.io" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>MetaMask</a> atau <a href="https://trustwallet.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Trust Wallet</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '160px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>

        {/* Header Profil */}
        <div style={{ background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', borderRadius: '24px', padding: '40px', marginBottom: '24px', color: 'white', textAlign: 'center' }}>
          {/* Avatar */}
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: avatarColor, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            🦾
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>BSC Wallet</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '8px 16px', maxWidth: '400px', margin: '0 auto' }}>
            <code style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{walletAddress}</code>
            <button onClick={handleCopy} style={{ background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <Copy size={16} color="white" />
            </button>
          </div>
        </div>

        {/* Kartu Saldo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '1px solid #eee' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Coins size={16} color="var(--primary)" /> Saldo BMC
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>{bmcBalance ?? '...'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BEP-20 Token</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '1px solid #eee' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Wallet size={16} color="#f59f00" /> Saldo BNB
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59f00', marginBottom: '4px' }}>{bnbBalance ?? '...'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gas Fee (BSC)</div>
          </div>
        </div>

        {/* Dasbor Referral & Airdrop */}
        <div style={{ background: 'linear-gradient(135deg, #1864ab, #3bc9db)', borderRadius: '24px', padding: '32px', marginBottom: '24px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(24, 100, 171, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}><Gift size={24} /></div>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Program Referral & Airdrop</h3>
          </div>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '24px', lineHeight: '1.5' }}>
            Bagikan tautan unik Anda. Dapatkan <strong style={{ color: '#ffe066' }}>50 BMC</strong> untuk setiap teman yang mendaftar dan menghubungkan wallet mereka.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px', background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Teman Bergabung</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>12 <span style={{ fontSize: '1rem', fontWeight: 'normal', opacity: 0.8 }}>orang</span></div>
            </div>
            <div style={{ flex: 1, minWidth: '150px', background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Coins size={14} /> Estimasi Reward</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffe066' }}>600 <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'white' }}>BMC</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.1)' }}>
              <code style={{ fontSize: '0.85rem', color: '#e3fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                https://bambunusa.com/?ref={shortAddr(walletAddress)}
              </code>
              <button onClick={handleCopyRef} style={{ background: 'white', color: '#1864ab', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {refCopied ? <CheckCircle size={14} /> : <Copy size={14} />} {refCopied ? 'Tersalin!' : 'Copy Link'}
              </button>
            </div>
            <button style={{ background: '#ffe066', color: '#1864ab', border: 'none', padding: '0 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 224, 102, 0.3)', whiteSpace: 'nowrap' }}>
              Klaim Reward
            </button>
          </div>
        </div>

        {/* Aksi */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', marginBottom: '24px' }}>
          <a href={`https://bscscan.com/address/${walletAddress}`} target="_blank" rel="noreferrer"
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f3f5', color: 'var(--text-main)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
            <ExternalLink size={18} color="var(--primary)" />
            <div>
              <div style={{ fontWeight: '600' }}>Lihat di BSCScan</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Riwayat lengkap transaksi Anda</div>
            </div>
          </a>
          <a href={`https://bscscan.com/token/${BMC_CONTRACT_ADDRESS}?a=${walletAddress}`} target="_blank" rel="noreferrer"
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f3f5', color: 'var(--text-main)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
            <Coins size={18} color="var(--primary)" />
            <div>
              <div style={{ fontWeight: '600' }}>Riwayat Transaksi BMC</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Semua transfer token BMC Anda</div>
            </div>
          </a>
          <Link to="/transparency"
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f3f5', color: 'var(--text-main)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
            <Coins size={18} color="var(--primary)" />
            <div>
              <div style={{ fontWeight: '600' }}>Dashboard Transparansi On-Chain</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Data supply & info token BMC</div>
            </div>
          </Link>
          <button onClick={disconnectWallet}
            style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#e03131', textAlign: 'left' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={18} />
            <div style={{ fontWeight: '600' }}>Putuskan Koneksi Wallet</div>
          </button>
        </div>
        {/* Riwayat Transaksi BMC */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--primary)" /> 5 Transaksi BMC Terakhir
            </h3>
            <a href={`https://bscscan.com/token/${BMC_CONTRACT_ADDRESS}?a=${walletAddress}`} target="_blank" rel="noreferrer"
              style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Semua <ExternalLink size={12} />
            </a>
          </div>
          {txLoading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <RefreshCw size={16} color="var(--primary)" /> Memuat...
            </div>
          ) : txHistory.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Belum ada transaksi BMC.</div>
          ) : (
            txHistory.map((tx, i) => {
              const isSend = tx.from.toLowerCase() === walletAddress.toLowerCase();
              return (
                <div key={i} style={{ padding: '14px 20px', borderBottom: i < txHistory.length - 1 ? '1px solid #f8f9fa' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isSend ? '#fff0f0' : '#f0fff4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '1.1rem' }}>{isSend ? '📤' : '📥'}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.88rem' }}>{isSend ? `→ ${shortAddr(tx.to)}` : `← ${shortAddr(tx.from)}`}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(tx.timeStamp)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: isSend ? '#e03131' : '#2b8a3e', fontSize: '0.9rem' }}>
                      {isSend ? '-' : '+'}{formatBMC(tx.value)} BMC
                    </div>
                    <a href={`https://bscscan.com/tx/${tx.hash}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Tx ↗</a>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
