import React, { useState } from 'react';
import { ShieldCheck, MapPin, CheckCircle, ArrowRight, User, Phone, Wallet, Award, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { ethers } from 'ethers';
import { escrowConfig } from '../../utils/escrowConfig';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

const JoinValidatorPage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isCheckingToken, setIsCheckingToken] = useState(false);

  const MIN_TOKEN_REQUIRED = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const connectWalletAndCheckBalance = async () => {
    if (!window.ethereum) return alert("MetaMask belum terinstal di browser Anda!");
    
    setIsCheckingToken(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setWalletConnected(true);

      // Mengecek saldo Token (Simulasi menggunakan MockUSDT di jaringan lokal)
      const usdtContract = new ethers.Contract(escrowConfig.addresses.MockUSDT, escrowConfig.usdtAbi, provider);
      const balanceWei = await usdtContract.balanceOf(address);
      const balanceVal = Number(ethers.formatUnits(balanceWei, 18));
      
      setTokenBalance(balanceVal);
    } catch (err) {
      console.error(err);
      alert("Gagal membaca dompet: " + (err.reason || err.message));
    } finally {
      setIsCheckingToken(false);
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ paddingTop: '150px', paddingBottom: '80px' }}>
        <div className="container" style={{ marginBottom: '24px' }}>
          <BackButton to="/bambunusa/farmers" />
        </div>

        <div className="container" style={{ maxWidth: '800px' }}>
          {!isSubmitted ? (
            <div style={{ background: 'white', borderRadius: '32px', padding: '50px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ background: 'rgba(245, 159, 0, 0.1)', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#f59f00' }}>
                  <ShieldCheck size={36} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>Perekrutan Validator Lapangan</h1>
                <p style={{ color: 'var(--text-muted)' }}>Jadilah penjaga ekosistem Web3 bambuNUSA. Verifikasi keaslian proyek dan lindungi dana investor.</p>
              </div>

              {/* Progress Bar */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ flex: 1, height: '6px', background: i <= step ? '#f59f00' : '#e9ecef', borderRadius: '3px', transition: 'all 0.3s' }}></div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                
                {/* STEP 1: WEB3 GATING */}
                {step === 1 && (
                  <div style={{ animation: 'slideIn 0.3s' }}>
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={20} color="#f59f00" /> 1. Autentikasi Syarat Staking Token
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      Untuk memastikan komitmen dan mencegah penipuan, setiap Validator diwajibkan memiliki <strong>Stake minimal {MIN_TOKEN_REQUIRED} Token</strong> di dalam dompet Web3 mereka. Dompet yang tidak memenuhi syarat tidak dapat melanjutkan pendaftaran.
                    </p>
                    
                    <div style={{ background: '#f8f9fa', padding: '32px', borderRadius: '16px', border: '1px solid #dee2e6', textAlign: 'center', marginBottom: '32px' }}>
                      {!walletConnected ? (
                        <>
                          <div style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>Silakan hubungkan dompet MetaMask Anda.</div>
                          <button 
                            type="button"
                            onClick={connectWalletAndCheckBalance}
                            disabled={isCheckingToken}
                            style={{ background: '#f59f00', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                          >
                            {isCheckingToken ? 'Memeriksa Saldo...' : <><Wallet size={20} /> Hubungkan Web3 Wallet</>}
                          </button>
                        </>
                      ) : (
                        <div>
                          <div style={{ background: 'white', padding: '12px 24px', borderRadius: '12px', display: 'inline-block', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px', border: '1px solid #ced4da' }}>
                            {walletAddress.substring(0, 8)}...{walletAddress.substring(36)}
                          </div>
                          
                          {tokenBalance >= MIN_TOKEN_REQUIRED ? (
                            <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '20px', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                              <CheckCircle size={32} style={{ margin: '0 auto 12px' }} />
                              <h4 style={{ margin: '0 0 8px 0' }}>Syarat Terpenuhi!</h4>
                              <p style={{ margin: 0, fontSize: '0.9rem' }}>Anda memiliki {tokenBalance.toLocaleString()} Token (Syarat Minimal: {MIN_TOKEN_REQUIRED}). Akses formulir pendaftaran dibuka.</p>
                            </div>
                          ) : (
                            <div style={{ background: 'rgba(250, 82, 82, 0.1)', color: '#e03131', padding: '20px', borderRadius: '12px', border: '1px solid rgba(250, 82, 82, 0.2)' }}>
                              <AlertTriangle size={32} style={{ margin: '0 auto 12px' }} />
                              <h4 style={{ margin: '0 0 8px 0' }}>Syarat Tidak Terpenuhi</h4>
                              <p style={{ margin: 0, fontSize: '0.9rem' }}>Anda hanya memiliki {tokenBalance.toLocaleString()} Token. Silakan lakukan Top Up/Staking minimal {MIN_TOKEN_REQUIRED} Token untuk menjadi Validator.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setStep(2)} 
                      disabled={tokenBalance < MIN_TOKEN_REQUIRED}
                      style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: tokenBalance >= MIN_TOKEN_REQUIRED ? '#f59f00' : '#e9ecef', color: tokenBalance >= MIN_TOKEN_REQUIRED ? 'white' : '#adb5bd', fontWeight: 'bold', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.2s', cursor: tokenBalance >= MIN_TOKEN_REQUIRED ? 'pointer' : 'not-allowed' }}
                    >
                      {tokenBalance >= MIN_TOKEN_REQUIRED ? <><Unlock size={20} /> Lanjut ke Formulir Biodata</> : <><Lock size={20} /> Formulir Terkunci</>}
                    </button>
                  </div>
                )}

                {/* STEP 2: IDENTITAS */}
                {step === 2 && (
                  <div style={{ animation: 'slideIn 0.3s' }}>
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>2. Identitas & Latar Belakang</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><User size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Nama Lengkap (Sesuai KTP)</label>
                        <input type="text" placeholder="Masukkan nama lengkap Anda..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><Phone size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Nomor WhatsApp Aktif</label>
                        <input type="tel" placeholder="0812..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><Award size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Latar Belakang Profesi / Sertifikasi</label>
                        <select style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required>
                          <option value="">-- Pilih Latar Belakang --</option>
                          <option>Ahli Botani / Kehutanan</option>
                          <option>LSM Lingkungan</option>
                          <option>Penyuluh Pertanian</option>
                          <option>Mahasiswa / Akademisi Kehutanan</option>
                          <option>Lainnya</option>
                        </select>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #dee2e6', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Kembali</button>
                        <button type="button" onClick={() => setStep(3)} style={{ flex: 2, padding: '16px', background: '#f59f00', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>Lanjut <ArrowRight size={20} /></button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: AREA CAKUPAN */}
                {step === 3 && (
                  <div style={{ animation: 'slideIn 0.3s' }}>
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>3. Area Cakupan Inspeksi</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>Validator hanya akan mendapatkan tugas verifikasi proyek di wilayah yang disanggupi. Sistem akan mendistribusikan notifikasi pengerjaan proyek ke dompet Anda secara acak berdasarkan wilayah ini.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><MapPin size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Provinsi Operasional</label>
                        <select style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required>
                          <option value="">-- Pilih Provinsi --</option>
                          <option>Banten</option>
                          <option>Jawa Barat</option>
                          <option>Jawa Tengah</option>
                          <option>Jawa Timur</option>
                          <option>Lainnya</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Radius Jangkauan Maksimal (dari domisili)</label>
                        <select style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required>
                          <option>Kurang dari 25 KM</option>
                          <option>25 - 50 KM</option>
                          <option>50 - 100 KM</option>
                          <option>Bersedia ke seluruh wilayah provinsi</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                        <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #dee2e6', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Kembali</button>
                        <button type="button" onClick={() => setStep(4)} style={{ flex: 2, padding: '16px', background: '#f59f00', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>Lanjut <ArrowRight size={20} /></button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: PAKTA INTEGRITAS */}
                {step === 4 && (
                  <div style={{ animation: 'slideIn 0.3s' }}>
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>4. Pakta Integritas Validator Independen</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ background: 'rgba(245, 159, 0, 0.05)', padding: '24px', borderRadius: '16px', border: '1px dashed #f59f00' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                          Saya dengan ini menyatakan bersedia menjadi Validator Independen untuk proyek bambuNUSA. Saya akan melakukan verifikasi fisik lahan penanaman dengan <strong>jujur, objektif, dan tanpa rekayasa</strong>.<br/><br/>
                          Jika ditemukan indikasi kecurangan atau kolusi dengan petani, saya bersedia dompet Web3 saya di-<em>blacklist</em> dari jaringan Smart Contract dan Token jaminan saya berisiko terkena penalti (<em>Slashing</em>).
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '10px' }}>
                        <input type="checkbox" id="agree" required style={{ width: '20px', height: '20px', marginTop: '2px' }} />
                        <label htmlFor="agree" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Saya menyetujui seluruh ketentuan dan siap bertanggung jawab atas laporan inspeksi yang saya tandatangani secara digital (On-Chain).</label>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                        <button type="button" onClick={() => setStep(3)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #dee2e6', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Kembali</button>
                        <button type="submit" style={{ flex: 2, padding: '16px', background: '#f59f00', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Kirim Pengajuan Validator</button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '32px', padding: '60px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ width: '100px', height: '100px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <CheckCircle size={60} />
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px' }}>Pengajuan Sedang Ditinjau!</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                Data Anda telah masuk ke panel admin YSNJ. Setelah lolos proses wawancara singkat, dompet Web3 Anda akan resmi diaktifkan sebagai Validator di dalam Smart Contract!
              </p>
              <button onClick={() => window.location.href = '/bambunusa/farmers'} style={{ background: '#f59f00', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Kembali ke Komunitas</button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JoinValidatorPage;
