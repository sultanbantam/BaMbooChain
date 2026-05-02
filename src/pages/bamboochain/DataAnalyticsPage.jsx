import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Cpu, Globe, PieChart, Activity, Layers, Download, CheckCircle } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ethers } from 'ethers';
import { escrowConfig } from '../../utils/escrowConfig';

const DataAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    aum: 0,
    totalProjects: 0,
    treesFunded: 0,
    volume: 0
  });
  const [chartData, setChartData] = useState([]);

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

        // 3. Calculate metrics
        setMetrics({
          aum: balanceUsdt,
          totalProjects: projectsCount,
          treesFunded: Math.floor(balanceUsdt / 50 * 10), // Assuming 50 USDT = 10 trees
          volume: balanceUsdt * 1.5 // Mock volume based on AUM
        });

        // 4. Fetch Deposit Events for Chart
        const filter = escrowContract.filters.Deposit();
        const events = await escrowContract.queryFilter(filter);
        
        // Base historical mock data
        let data = [
          { name: 'Jan', price: 20, carbon: 10 },
          { name: 'Feb', price: 30, carbon: 25 },
          { name: 'Mar', price: 45, carbon: 40 },
          { name: 'Apr', price: 50, carbon: 55 },
          { name: 'Mei', price: 65, carbon: 80 }
        ];

        // Append real Web3 deposits to current month
        let currentMonthAUM = 65;
        let currentCarbon = 80;
        
        events.forEach(ev => {
           const amount = Number(ethers.formatUnits(ev.args[2], 18));
           currentMonthAUM += (amount / 100); // Scale down for chart demo
           currentCarbon += (amount / 500);
        });
        
        data.push({ name: 'Live (Jun)', price: currentMonthAUM, carbon: currentCarbon });

        setChartData(data);
      } catch (error) {
        console.error("Error fetching Web3 data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainData();
    
    // Auto-refresh every 5 seconds to show live updates
    const interval = setInterval(fetchBlockchainData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ paddingTop: '250px', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* HEADER SECTION */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <BackButton to="/bamboochain" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(51, 154, 240, 0.1)', padding: '16px', borderRadius: '50%', color: '#339af0' }}>
            <BarChart2 size={40} />
          </div>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.5px' }}>
          Data & Analytics bambuNUSA
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Big data untuk keputusan besar. Pangkas risiko investasi dan optimalkan hasil panen melalui kecerdasan buatan berbasis spasial dan metrik global.
        </p>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* ANALYTICS DASHBOARD */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PieChart size={24} color="#339af0" /> Analytics Dashboard
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '0.9rem', outline: 'none' }}>
                <option>Tahun Ini</option>
                <option>Tahun Lalu</option>
                <option>Keseluruhan</option>
              </select>
              <button style={{ background: '#f8f9fa', border: '1px solid #ced4da', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {[{ label: "Total AUM (Smart Contract)", val: loading ? "..." : `$${metrics.aum.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: "Live Web3", up: true },
              { label: "Rumpun Didanai", val: loading ? "..." : `${metrics.treesFunded.toLocaleString()} Rumpun`, change: "Estimasi Karbon", up: true },
              { label: "Proyek Aktif (On-Chain)", val: loading ? "..." : `${metrics.totalProjects} Transaksi`, change: "Smart Contract", up: true },
              { label: "Partisipasi Tata Kelola", val: "84.2%", change: "DAO Voting", up: true }
            ].map((stat, idx) => (
              <div key={idx} style={{ padding: '20px', background: '#f8f9fa', borderRadius: '16px', border: '1px solid #f1f3f5', position: 'relative' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>{stat.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>{stat.val}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold', color: stat.up ? 'var(--primary)' : '#e03131' }}>
                  {idx < 3 && <span style={{display: 'inline-block', width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', animation: 'pulse 1.5s infinite'}}></span>}
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Recharts Container */}
          <div style={{ position: 'relative', height: '400px', background: '#f8f9fa', borderRadius: '16px', border: '1px solid #f1f3f5', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Tren Pertumbuhan Harga BMC vs Penyerapan Karbon
                {!loading && <span style={{ fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '2px 8px', borderRadius: '12px' }}>Live Web3 Sync</span>}
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#339af0', borderRadius: '2px' }}></div> AUM / BMC Price</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }}></div> Volume Karbon (Ton)</div>
              </div>
            </div>
            
            <div style={{ flex: 1, minHeight: 0 }}>
              {loading ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>
                  Mengambil data dari Blockchain...
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
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#868e96', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#868e96', fontSize: 12}} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#339af0" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" name="AUM (Scaled)" />
                    <Area type="monotone" dataKey="carbon" stroke="#0ca678" strokeWidth={3} fillOpacity={1} fill="url(#colorCarbon)" name="Karbon (Ton)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: AI FORECAST & GIS MAPPING */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '30px' }}>
          
          {/* AI FORECAST */}
          <div style={{ background: 'linear-gradient(135deg, rgba(132,94,247,0.05), rgba(51,154,240,0.05))', borderRadius: '24px', padding: '32px', border: '1px solid rgba(132,94,247,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'rgba(132,94,247,0.1)', padding: '10px', borderRadius: '12px', color: '#845ef7' }}>
                <Cpu size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>AI Forecast</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '32px', position: 'relative', zIndex: 1 }}>Prediksi produksi biomassa bambu dan suplai *carbon offset* masa depan berdasarkan *Machine Learning* cuaca & satelit.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Proyeksi Panen (Q4 2026)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <Layers size={16} color="#845ef7" /> 2,450 Ton Plywood
                  </div>
                </div>
                <div style={{ background: '#eebefa', color: '#845ef7', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>+12% AKURASI</div>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Spot Price Karbon (End 2026)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <TrendingUp size={16} color="#339af0" /> $54.20 / Ton
                  </div>
                </div>
                <div style={{ background: '#d0ebff', color: '#339af0', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>BULLISH</div>
              </div>
            </div>

            {/* Neural Abstract Decor */}
            <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', opacity: 0.05, color: '#845ef7' }}>
              <Activity size={200} />
            </div>
          </div>

          {/* GIS MAPPING */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(12,166,120,0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Globe size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>GIS Mapping</h2>
            </div>
            
            <div style={{ flex: 1, position: 'relative', borderRadius: '16px', overflow: 'hidden', minHeight: '200px', background: '#e9ecef', border: '1px solid #dee2e6' }}>
              {/* Simulasi Peta Topografi */}
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                loading="lazy" 
                title="Topographic Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=105.5,-7.0,106.8,-6.2&layer=transportmap">
              </iframe>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '4px' }}>Analisis Topografi & Elevasi Aktif</div>
                <div style={{ color: 'var(--text-muted)' }}>Pemindaian satelit mendeteksi 4 lahan kosong potensial di wilayah Jawa Barat untuk ekspansi target 2027.</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DataAnalyticsPage;
