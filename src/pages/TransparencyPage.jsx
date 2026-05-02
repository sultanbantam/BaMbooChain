import React, { useEffect, useState } from 'react';
import { JsonRpcProvider, Contract, formatUnits } from 'ethers';
import { ExternalLink, Shield, Coins, BarChart2, Activity, RefreshCw, Layers } from 'lucide-react';

const BMC_CONTRACT = '0x812d9709f0A53982606b823Ee61d5CA216F7F9c0';
const BSC_RPCS = [
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed.binance.org/',
  'https://binance.llamarpc.com',
  'https://1rpc.io/bsc'
];

const TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
];

const TransparencyPage = () => {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [activeRpc, setActiveRpc] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    let success = false;

    for (const rpcUrl of BSC_RPCS) {
      if (success) break;
      try {
        console.log(`Mencoba menghubungkan ke RPC: ${rpcUrl}`);
        const provider = new JsonRpcProvider(rpcUrl, 56); // Explicitly set chainId 56 for BSC
        const contract = new Contract(BMC_CONTRACT, TOKEN_ABI, provider);

        const [name, symbol, decimals, totalSupply, block] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
          contract.totalSupply(),
          provider.getBlockNumber(),
        ]);

        setTokenData({
          name,
          symbol,
          decimals: decimals.toString(),
          totalSupply: parseFloat(formatUnits(totalSupply, decimals)).toLocaleString('id-ID'),
          rawSupply: totalSupply,
        });
        setBlockNumber(block.toLocaleString('id-ID'));
        setActiveRpc(rpcUrl);
        success = true;
      } catch (err) {
        console.warn(`Gagal terhubung ke RPC ${rpcUrl}:`, err.message);
      }
    }

    if (!success) {
      setError('Gagal terhubung ke jaringan BSC setelah mencoba beberapa jalur. Periksa koneksi internet Anda atau gunakan VPN.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const StatCard = ({ icon, label, value, sub, color = 'var(--primary)' }) => (
    <div className="glass" style={{ padding: '28px', textAlign: 'center', border: '1px solid #eee' }}>
      <div style={{ display: 'inline-flex', padding: '14px', background: `${color}18`, borderRadius: '50%', marginBottom: '16px' }}>
        {icon}
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: '800', color, marginBottom: '6px', wordBreak: 'break-word' }}>
        {loading ? <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} /> : value}
      </div>
      <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', fontSize: '0.9rem' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ paddingTop: '160px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12,166,120,0.1)', padding: '6px 16px', borderRadius: '20px', marginBottom: '20px' }}>
            <Shield size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>
              Live On-Chain · BSC Mainnet · Block #{blockNumber ?? '...'}
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '16px' }}>Dashboard Transparansi On-Chain</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Data token BMC dibaca langsung dari jaringan BSC menggunakan RPC publik — tanpa perantara, transparan, dan tidak dapat dimanipulasi.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #ffc9c9', borderRadius: '12px', padding: '20px', marginBottom: '30px', textAlign: 'center', color: '#c92a2a' }}>
            <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>⚠️ {error}</div>
            <button 
              onClick={fetchData} 
              style={{ background: '#c92a2a', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RefreshCw size={16} /> Hubungkan Ulang
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <StatCard
            icon={<Coins size={26} color="var(--primary)" />}
            label="Nama Token"
            value="BaMbooChain"
            sub={`Symbol: ${tokenData?.symbol ?? 'BMC'}`}
          />
          <StatCard
            icon={<BarChart2 size={26} color="#f59f00" />}
            label="Total Pasokan"
            value={tokenData?.totalSupply ?? '—'}
            sub="Token BEP-20 di BSC"
            color="#f59f00"
          />
          <StatCard
            icon={<Layers size={26} color="#6741d9" />}
            label="Desimal"
            value={tokenData?.decimals ?? '18'}
            sub="Presisi token BMC"
            color="#6741d9"
          />
          <StatCard
            icon={<Activity size={26} color="#2b8a3e" />}
            label="Jaringan"
            value="BSC"
            sub="BNB Smart Chain (BEP-20)"
            color="#2b8a3e"
          />
        </div>

        {/* Alamat Kontrak */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #eee' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--primary)" /> Smart Contract BMC (BEP-20)
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <code style={{ background: '#f1f3f5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', flex: 1, wordBreak: 'break-all' }}>
              {BMC_CONTRACT}
            </code>
            <a href={`https://bscscan.com/token/${BMC_CONTRACT}`} target="_blank" rel="noreferrer"
              className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <ExternalLink size={15} /> BSCScan
            </a>
          </div>
        </div>

        {/* Link ke BSCScan */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eee', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExternalLink size={18} color="var(--primary)" /> Verifikasi & Data Lanjutan
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {[
              { label: '📊 Riwayat Transaksi BMC', url: `https://bscscan.com/token/${BMC_CONTRACT}#transfers` },
              { label: '👥 Daftar Holder Token', url: `https://bscscan.com/token/${BMC_CONTRACT}#balances` },
              { label: '📜 Kode Smart Contract', url: `https://bscscan.com/address/${BMC_CONTRACT}#code` },
              { label: '🔍 Token Overview BSCScan', url: `https://bscscan.com/token/${BMC_CONTRACT}` },
            ].map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noreferrer"
                style={{ padding: '14px', background: '#f8f9fa', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', color: 'var(--text-main)', border: '1px solid #eee', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(12,166,120,0.06)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.borderColor = '#eee'; }}>
                <span style={{ fontWeight: '500', fontSize: '0.88rem' }}>{item.label}</span>
                <ExternalLink size={14} color="var(--primary)" />
              </a>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            { title: '🔍 Dapat Diverifikasi', desc: 'Semua transaksi token BMC tercatat permanen di blockchain BSC dan dapat dilihat oleh siapapun di BSCScan.' },
            { title: '🔒 Tidak Dapat Dimanipulasi', desc: 'Data on-chain tidak dapat diubah setelah dikonfirmasi. Ini menjamin transparansi penuh kepada mitra dan komunitas.' },
            { title: '⚡ Langsung dari Blockchain', desc: 'Data dibaca menggunakan RPC publik BSC secara langsung — tanpa server perantara, tanpa API berbayar.' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '22px', border: '1px solid #eee' }}>
              <h4 style={{ marginBottom: '10px' }}>{item.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TransparencyPage;
