import React, { useState, useEffect } from 'react';
import { ShieldCheck, UploadCloud, FileText, CheckCircle, AlertTriangle, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { ethers } from 'ethers';
import { escrowConfig } from '../../utils/escrowConfig';

const ValidatorDashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [validatorAddress, setValidatorAddress] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [inspectionNote, setInspectionNote] = useState("");

  const MILESTONES = [
    { key: 'isBibitReleased', fn: 'releaseBibit', name: 'Pemilik Bibit', percent: 16 },
    { key: 'isTanamReleased', fn: 'releaseTanam', name: 'Penanam', percent: 4 },
    { key: 'isRawatReleased', fn: 'releasePerawatan', name: 'Perawatan', percent: 10.67 },
    { key: 'isRisikoReleased', fn: 'releaseRisiko', name: 'Cadangan Risiko', percent: 13.33 },
    { key: 'isLahanReleased', fn: 'releaseLahan', name: 'Pemilik Lahan', percent: 2.67 },
    { key: 'isRoyaltiReleased', fn: 'releaseRoyalti', name: 'Royalti', percent: 6.67 },
    { key: 'isPengelolaReleased', fn: 'releasePengelola', name: 'Pengelola (YSNJ)', percent: 46.66 }
  ];

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask belum terinstal!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setValidatorAddress(await signer.getAddress());
      setWalletConnected(true);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let rpcProvider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const escrowContract = new ethers.Contract(escrowConfig.addresses.BambooEscrow, escrowConfig.escrowAbi, rpcProvider);
      
      const nextId = await escrowContract.nextProjectId();
      const count = Number(nextId) - 1;
      
      let fetchedProjects = [];
      for (let i = 1; i <= count; i++) {
        const p = await escrowContract.projects(i);
        const totalAmount = Number(ethers.formatUnits(p[0], 18));
        
        let pendingMilestones = [];
        let completedMilestones = [];
        
        MILESTONES.forEach((m, idx) => {
          if (p[idx + 1]) { // +1 because p[0] is totalAmount
            completedMilestones.push(m);
          } else {
            pendingMilestones.push(m);
          }
        });
        
        fetchedProjects.push({
          id: i,
          totalAmount,
          pendingMilestones,
          completedMilestones,
          isFullyReleased: pendingMilestones.length === 0
        });
      }
      setProjects(fetchedProjects.reverse()); // Show newest first
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          fetchProjects(); // fetch publicly if not connected
        }
      });
    } else {
      fetchProjects();
    }
  }, []);

  const openVerificationModal = (project, milestone) => {
    if (!walletConnected) return alert("Harap hubungkan MetaMask terlebih dahulu!");
    setSelectedProject(project);
    setSelectedMilestone(milestone);
    setUploadedFile(null);
    setInspectionNote("");
    setIsModalOpen(true);
  };

  const handleVerify = async () => {
    if (!uploadedFile) return alert("Bukti foto lapangan wajib diunggah!");
    
    setIsProcessing(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(escrowConfig.addresses.BambooEscrow, escrowConfig.escrowAbi, signer);
      
      console.log(`Calling ${selectedMilestone.fn}(${selectedProject.id})`);
      const tx = await escrowContract[selectedMilestone.fn](selectedProject.id);
      await tx.wait();
      
      alert(`Berhasil! Dana untuk tahap ${selectedMilestone.name} telah dicairkan ke Blockchain.`);
      setIsModalOpen(false);
      fetchProjects(); // Refresh data
    } catch (error) {
      console.error(error);
      alert("Transaksi gagal: " + (error.reason || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ paddingTop: '250px', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container">
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '12px', borderRadius: '12px', color: '#f59f00' }}>
                <ShieldCheck size={32} />
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>Portal Validator</h1>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Modul khusus verifikator lapangan untuk validasi tahapan penanaman.</p>
          </div>
          
          <div>
            {!walletConnected ? (
              <button 
                onClick={connectWallet}
                style={{ background: '#f59f00', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <AlertTriangle size={18} /> Hubungkan Wallet Validator
              </button>
            ) : (
              <div style={{ background: 'rgba(245, 159, 0, 0.1)', color: '#f59f00', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(245, 159, 0, 0.2)' }}>
                🟢 {validatorAddress.substring(0, 6)}...{validatorAddress.substring(38)}
              </div>
            )}
          </div>
        </div>

        {/* PROJECTS LIST */}
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f3f5', background: '#f8f9fa', fontWeight: 'bold', color: 'var(--text-main)' }}>
            Daftar Antrean Inspeksi On-Chain
          </div>
          
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat data dari Blockchain...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada data proyek di Escrow.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>ID PROYEK</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>NILAI DANA</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>STATUS</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>AKSI VERIFIKASI</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f3f5', transition: '0.2s', ':hover': { background: '#f8f9fa' } }}>
                    <td style={{ padding: '20px 24px', fontWeight: 'bold' }}># {p.id}</td>
                    <td style={{ padding: '20px 24px', color: 'var(--primary)', fontWeight: 'bold' }}>{p.totalAmount} USDT</td>
                    <td style={{ padding: '20px 24px' }}>
                      {p.isFullyReleased ? (
                        <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>Selesai</span>
                      ) : (
                        <span style={{ background: 'rgba(245, 159, 0, 0.1)', color: '#f59f00', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>Menunggu Inspeksi</span>
                      )}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      {p.isFullyReleased ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Semua dana tersalurkan</span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tahap berikutnya:</span>
                          <button 
                            onClick={() => openVerificationModal(p, p.pendingMilestones[0])}
                            style={{ background: '#f8f9fa', border: '1px solid #dee2e6', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--text-main)', transition: '0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#f59f00'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#f59f00'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = '#dee2e6'; }}
                          >
                            {p.pendingMilestones[0].name} <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* VERIFICATION MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>Formulir Inspeksi & Verifikasi</div>
              <button onClick={() => !isProcessing && setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '32px' }}>
              <div style={{ background: 'rgba(245, 159, 0, 0.1)', color: '#d9480f', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem', display: 'flex', gap: '12px' }}>
                <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                Anda akan mengotorisasi rilis dana sebesar <strong>{selectedMilestone.percent}%</strong> dari Proyek #{selectedProject.id} untuk tahap <strong>{selectedMilestone.name}</strong>. Aksi ini permanen di Blockchain.
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>Bukti Foto Lapangan (Wajib)</label>
                <div style={{ border: '2px dashed #dee2e6', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', background: uploadedFile ? '#f4fce3' : '#f8f9fa', transition: '0.2s' }}>
                  {uploadedFile ? (
                    <div>
                      <CheckCircle size={32} color="#40c057" style={{ marginBottom: '8px' }} />
                      <div style={{ fontWeight: 'bold', color: '#2b8a3e' }}>Foto berhasil dilampirkan</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{uploadedFile}</div>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon size={32} color="#adb5bd" style={{ marginBottom: '8px' }} />
                      <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Seret foto ke sini atau klik untuk mencari file</div>
                      <button 
                        onClick={() => setUploadedFile(`foto_lapangan_${selectedProject.id}_${Date.now()}.jpg`)}
                        style={{ background: 'white', border: '1px solid #ced4da', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Pilih File
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>Catatan Inspeksi</label>
                <textarea 
                  value={inspectionNote}
                  onChange={(e) => setInspectionNote(e.target.value)}
                  placeholder="Deskripsikan hasil pantauan di lapangan..."
                  style={{ width: '100%', padding: '16px', border: '1px solid #ced4da', borderRadius: '12px', minHeight: '100px', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
              
              <button 
                onClick={handleVerify}
                disabled={isProcessing || !uploadedFile}
                style={{ width: '100%', background: (!uploadedFile || isProcessing) ? '#ced4da' : '#f59f00', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: (!uploadedFile || isProcessing) ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: '0.2s' }}
              >
                {isProcessing ? (
                  <>Memproses Transaksi Web3...</>
                ) : (
                  <><ShieldCheck size={20} /> Otorisasi & Cairkan Dana On-Chain</>
                )}
              </button>
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ValidatorDashboardPage;
