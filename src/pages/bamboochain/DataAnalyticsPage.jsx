import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Cpu, Globe, PieChart, Activity, Layers, Download, CheckCircle } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ethers } from 'ethers';
import { escrowConfig } from '../../utils/escrowConfig';
import { useWeb3 } from '../../context/Web3Context';
import { usePlantationDonations } from '../../hooks/useFirestoreQueries';

import { useLanguage } from '../../context/LanguageContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DataAnalyticsPage = () => {
  const { t } = useLanguage();
  const { isConnected, walletAddress } = useWeb3();
  const { data: allDonations = [] } = usePlantationDonations();
  const [toast, setToast] = useState({ show: false, message: '' });
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    aum: 0,
    totalProjects: 0,
    treesFunded: 0,
    volume: 0
  });
  const [chartData, setChartData] = useState([]);
  const [aiData, setAiData] = useState({
    harvest: 2450,
    carbonPrice: 54.20,
    accuracy: 94.2,
    signal: 'BULLISH',
    scanStatus: 'Scanning Wilayah Jawa Barat...'
  });

  // Simulasi Update AI & GIS secara real-time
  useEffect(() => {
    const aiInterval = setInterval(() => {
      setAiData(prev => {
        const newHarvest = prev.harvest + (Math.random() * 2 - 1);
        const newPrice = prev.carbonPrice + (Math.random() * 0.1 - 0.05);
        const statuses = [
          t('da_status_1'), 
          t('da_status_2'), 
          t('da_status_3'),
          t('da_status_4')
        ];
        return {
          harvest: parseFloat(newHarvest.toFixed(0)),
          carbonPrice: parseFloat(newPrice.toFixed(2)),
          accuracy: parseFloat((94 + Math.random()).toFixed(1)),
          signal: Math.random() > 0.8 ? 'STRONG BUY' : 'BULLISH',
          scanStatus: statuses[Math.floor(Math.random() * statuses.length)]
        };
      });
    }, 4000);
    return () => clearInterval(aiInterval);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        // Connect to local node (no metamask required for reading public data)
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const escrowContract = new ethers.Contract(escrowConfig.addresses.BambooEscrow, escrowConfig.escrowAbi, provider);
        const usdtContract = new ethers.Contract(escrowConfig.addresses.MockUSDT, escrowConfig.usdtAbi, provider);

        // 1. Fetch Total AUM (USDT Balance of Escrow)
        const balanceWei = await usdtContract.balanceOf(escrowConfig.addresses.BambooEscrow);
        const balanceUsdt = Number(ethers.formatUnits(balanceWei, 18));

        // 2. Fetch Total Projects
        const nextProjectId = await escrowContract.nextProjectId();
        const projectsCount = Number(nextProjectId) - 1;

        // Calculate totals from firestore donations
        const activeDonations = allDonations.filter(d => d.status === 'verified' || d.status === 'active');
        const firestoreAUM = activeDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
        
        // Rumpun ditanam hanya dihitung jika misi penanaman disahkan
        const firestoreTrees = activeDonations.reduce((sum, d) => {
          return sum + (d.milestones?.tanam?.released ? Number(d.amount || 0) : 0);
        }, 0);
        
        // Karbon diserap hanya dihitung jika misi perawatan disahkan
        const treesMaintained = activeDonations.reduce((sum, d) => {
          return sum + (d.milestones?.rawat?.released ? Number(d.amount || 0) : 0);
        }, 0);

        // 3. Calculate metrics (Mulai dari Nol, murni dari data donasi)
        setMetrics({
          aum: balanceUsdt + firestoreAUM,
          totalProjects: projectsCount + activeDonations.length,
          treesFunded: Math.floor(balanceUsdt / 50 * 10) + firestoreTrees, // Web3 + Web2
          volume: (balanceUsdt + firestoreAUM) * 1.5 // Mock volume
        });

        // 4. Fetch Deposit Events for Chart
        const filter = escrowContract.filters.Deposit();
        const events = await escrowContract.queryFilter(filter);
        
        // Data mulai dari 0 untuk chart
        let data = [];
        let currentMonthAUM = firestoreAUM;
        let currentCarbon = treesMaintained * 0.5; // 0.5 ton per pohon
        
        events.forEach(ev => {
           const amount = Number(ethers.formatUnits(ev.args[2], 18));
           currentMonthAUM += amount;
           currentCarbon += (amount * 0.5); // Simplifikasi
        });
        
        data.push({ name: 'Saat Ini', price: currentMonthAUM, carbon: currentCarbon });
        setChartData(data);
      } catch (error) {
        console.error("Web3 connection failed, using fallback/simulated data:", error);
        
        const activeDonations = allDonations.filter(d => d.status === 'verified' || d.status === 'active');
        const firestoreAUM = activeDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
        
        const firestoreTrees = activeDonations.reduce((sum, d) => {
          return sum + (d.milestones?.tanam?.released ? Number(d.amount || 0) : 0);
        }, 0);
        
        const treesMaintained = activeDonations.reduce((sum, d) => {
          return sum + (d.milestones?.rawat?.released ? Number(d.amount || 0) : 0);
        }, 0);
        
        // Real data fallback
        setMetrics({
          aum: firestoreAUM,
          totalProjects: activeDonations.length,
          treesFunded: firestoreTrees,
          volume: firestoreAUM * 1.5
        });
        
        setChartData([
          { name: 'Sebelumnya', price: 0, carbon: 0 },
          { name: 'Saat Ini', price: firestoreAUM, carbon: treesMaintained * 0.5 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainData();
    
    // Auto-refresh every 5 seconds to show live updates
    const interval = setInterval(fetchBlockchainData, 5000);
    return () => clearInterval(interval);
  }, [allDonations]);

  const handleExport = () => {
    let msg = "";
    if (!isConnected) {
      msg = t('da_toast_demo');
    } else {
      msg = `${t('da_toast_export')} ${walletAddress.substring(0, 8)}...`;
    }
    
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);

    // Create a dummy CSV file for download
    const csvContent = "data:text/csv;charset=utf-8,Date,AUM,Carbon\n2026-01-01,120000,100\n2026-02-01,125000,110";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bambuNUSA_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isMobile = windowWidth <= 768;

  return (
    <div style={{ paddingTop: isMobile ? '80px' : 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-color)' }}>
      
      {/* HEADER SECTION */}
      <div className="container" style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px', padding: isMobile ? '0 20px' : '0' }}>
        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <BackButton to="/bamboochain" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(51, 154, 240, 0.1)', padding: isMobile ? '12px' : '16px', borderRadius: '50%', color: '#339af0' }}>
            <BarChart2 size={isMobile ? 32 : 40} />
          </div>
        </div>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          {t('da_title')}
        </h1>
        <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          {t('da_desc')}
        </p>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '40px', padding: isMobile ? '0 15px' : '0' }}>
        
        {/* ANALYTICS DASHBOARD */}
        <div style={{ background: 'var(--bg-card)', borderRadius: isMobile ? '20px' : '24px', padding: isMobile ? '20px' : '32px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '32px', gap: '20px' }}>
            <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PieChart size={isMobile ? 20 : 24} color="#339af0" /> {t('da_dashboard')}
            </h2>
            <div style={{ display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto' }}>
              <select style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '0.85rem', outline: 'none' }}>
                <option>{t('da_filter_year')}</option>
                <option>{t('da_filter_last')}</option>
                <option>{t('da_filter_all')}</option>
              </select>
              <button 
                onClick={handleExport}
                style={{ background: '#f8f9fa', border: '1px solid #ced4da', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#333' }}>
                <Download size={16} /> {t('da_export')}
              </button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '32px' }}>
            {[{ label: t('da_metric_aum'), val: loading ? "..." : `$${metrics.aum.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: t('da_change_live'), up: true },
              { label: t('da_metric_trees'), val: loading ? "..." : `${metrics.treesFunded.toLocaleString()} ${t('da_unit_trees')}`, change: t('da_change_carbon'), up: true },
              { label: t('da_metric_projects'), val: loading ? "..." : `${metrics.totalProjects} ${t('da_unit_tx')}`, change: t('da_change_sc'), up: true },
              { label: t('da_metric_gov'), val: "84.2%", change: t('da_change_dao'), up: true }
            ].map((stat, idx) => (
              <div key={idx} style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>{stat.label}</div>
                <div style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>{stat.val}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: stat.up ? 'var(--primary)' : '#e03131' }}>
                  {idx < 3 && <span style={{display: 'inline-block', width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', animation: 'pulse 1.5s infinite'}}></span>}
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Recharts Container */}
          <div style={{ position: 'relative', height: isMobile ? '350px' : '450px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: isMobile ? '15px' : '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: '24px', gap: '10px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.8rem' : '1rem' }}>
                {t('da_chart_title')}
                {!loading && <span style={{ fontSize: '0.65rem', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '2px 8px', borderRadius: '12px' }}>{t('da_chart_live')}</span>}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', background: '#339af0', borderRadius: '2px' }}></div> {t('da_chart_aum')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '2px' }}></div> {t('da_chart_carbon')}</div>
              </div>
            </div>
            
            <div style={{ flex: 1, minHeight: 0 }}>
              {loading ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', fontSize: '0.9rem' }}>
                  {t('da_chart_loading')}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#339af0" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#339af0" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ca678" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ca678" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#868e96', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#868e96', fontSize: 10}} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '0.8rem' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#339af0" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" name="AUM (Scaled)" />
                    <Area type="monotone" dataKey="carbon" stroke="#0ca678" strokeWidth={3} fillOpacity={1} fill="url(#colorCarbon)" name={t('da_chart_carbon')} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: AI FORECAST & GIS MAPPING */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: isMobile ? '20px' : '30px' }}>
          
          {/* AI FORECAST */}
          <div style={{ background: 'linear-gradient(135deg, rgba(132,94,247,0.05), rgba(51,154,240,0.05))', borderRadius: isMobile ? '20px' : '24px', padding: isMobile ? '20px' : '32px', border: '1px solid rgba(132,94,247,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'rgba(132,94,247,0.1)', padding: '10px', borderRadius: '12px', color: '#845ef7' }}>
                <Cpu size={isMobile ? 20 : 24} />
              </div>
              <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: 'var(--text-main)', margin: 0 }}>{t('da_ai_title')}</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px', position: 'relative', zIndex: 1 }}>{t('da_ai_desc')}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{t('da_ai_harvest')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 'bold' }}>
                    <Layers size={14} color="#845ef7" /> {aiData.harvest.toLocaleString()} {t('da_ai_plywood')}
                  </div>
                </div>
                <div style={{ background: '#eebefa', color: '#845ef7', padding: '3px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 'bold' }}>+{aiData.accuracy}% {t('da_ai_acc')}</div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{t('da_ai_spot')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 'bold' }}>
                    <TrendingUp size={14} color="#339af0" /> ${aiData.carbonPrice.toFixed(2)} / Ton
                  </div>
                </div>
                <div style={{ background: aiData.signal === 'STRONG BUY' ? '#d3f9d8' : '#d0ebff', color: aiData.signal === 'STRONG BUY' ? '#2b8a3e' : '#339af0', padding: '3px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 'bold' }}>{aiData.signal}</div>
              </div>
            </div>

            <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', opacity: 0.05, color: '#845ef7' }}>
              <Activity size={isMobile ? 120 : 200} />
            </div>
          </div>

          {/* GIS MAPPING */}
          <div style={{ background: 'var(--bg-card)', borderRadius: isMobile ? '20px' : '24px', padding: isMobile ? '20px' : '32px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(12,166,120,0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Globe size={isMobile ? 20 : 24} />
              </div>
              <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: 'var(--text-main)', margin: 0 }}>{t('da_gis_title')}</h2>
            </div>
            
            <div style={{ flex: 1, position: 'relative', borderRadius: '16px', overflow: 'hidden', minHeight: '250px', background: '#e9ecef', border: '1px solid #dee2e6' }}>
              <MapContainer 
                center={[-6.5, 106.4]} 
                zoom={9} 
                style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {allDonations.filter(d => d.status === 'verified' || d.status === 'active').map((don, idx) => {
                  let lat = -6.5, lng = 106.4;
                  if (don.location?.id === 'cibarani') { lat = -6.6200; lng = 106.2800; }
                  else if (don.location?.id === 'cisadane') { lat = -6.4000; lng = 106.6000; }
                  else if (don.location?.lat) { lat = don.location.lat; lng = don.location.lng; }
                  else {
                    // pseudo-random offset based on id so it stays consistent
                    const offset = (don.id.charCodeAt(0) % 10) * 0.02;
                    lat = -6.5 + offset; lng = 106.4 - offset;
                  }
                  
                  return (
                    <Marker key={don.id} position={[lat, lng]}>
                      <Popup>
                        <strong>{don.location?.name || 'Proyek Penanaman'}</strong><br/>
                        Didukung oleh: {don.name || don.username}<br/>
                        Jumlah: {don.amount} USDT
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '10px', borderRadius: '12px', fontSize: '0.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid var(--primary)' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', background: 'red', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
                  {t('da_gis_status')}
                </div>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.4, fontWeight: '500' }}>{aiData.scanStatus}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOCAL TOAST NOTIFICATION */}
      {toast.show && (
        <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#333', color: 'white', padding: '12px 24px', borderRadius: '30px', fontSize: '0.9rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 100000, display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideUp 0.3s ease' }}>
          <Download size={18} color="var(--primary)" />
          {toast.message}
        </div>
      )}

      <style>
        {`
          @keyframes slideUp {
            from { transform: translate(-50%, 50px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default DataAnalyticsPage;
