import React, { useState, useEffect } from 'react';
import { 
  X, CreditCard, Truck, Users, CheckCircle, Package, 
  MapPin, Clock, ChevronRight, ArrowRight, ShieldCheck,
  Smartphone, Wallet, Info, Activity
} from 'lucide-react';

const ConstructionCheckout = ({ isOpen, onClose, design, inputs }) => {
  const [step, setStep] = useState(1); // 1: Method, 2: Shipping, 3: Confirmation, 4: Tracking
  const [paymentMethod, setPaymentMethod] = useState('bmc');
  const [shippingType, setShippingType] = useState('truck');
  const [useAssembly, setUseAssembly] = useState(true);
  const [payoutRate, setPayoutRate] = useState(450000); // Default Rp 450k/m2
  
  if (!isOpen || !design) return null;

  const area = parseInt(inputs.area) || design.minArea;
  const assemblyCost = useAssembly ? area * payoutRate : 0;
  const totalPrice = design.basePrice + assemblyCost;
  
  const estimatedDelivery = shippingType === 'truck' ? '2-3 Hari' : '5-7 Hari';

  const handleNext = () => setStep(step + 1);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100001, padding: '20px'
    }}>
      <div style={{
        background: 'white', width: '100%', maxWidth: '500px',
        borderRadius: '32px', boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden', position: 'relative'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: '900' }}>Order Construction</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{design.name} • {area} m²</p>
          </div>
          <button onClick={onClose} style={{ background: '#f8f9fa', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Stepper */}
        <div style={{ display: 'flex', padding: '16px 24px', background: '#f8f9fa', gap: '8px' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ 
              flex: 1, height: '4px', borderRadius: '2px', 
              background: step >= s ? 'var(--primary)' : '#dee2e6' 
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto' }}>
          
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4 style={{ margin: 0 }}>Pilih Metode Pembayaran</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div 
                  onClick={() => setPaymentMethod('bmc')}
                  style={{ 
                    padding: '16px', borderRadius: '16px', border: paymentMethod === 'bmc' ? '2px solid var(--primary)' : '1px solid #dee2e6',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', background: paymentMethod === 'bmc' ? 'rgba(12,166,120,0.05)' : 'white'
                  }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Wallet size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>BMC Token (Wallet Hub)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instan & Gasless via Smart Contract</div>
                  </div>
                </div>
                <div 
                  onClick={() => setPaymentMethod('bank')}
                  style={{ 
                    padding: '16px', borderRadius: '16px', border: paymentMethod === 'bank' ? '2px solid var(--primary)' : '1px solid #dee2e6',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', background: paymentMethod === 'bank' ? 'rgba(12,166,120,0.05)' : 'white'
                  }}>
                  <div style={{ width: '40px', height: '40px', background: '#1864ab', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <CreditCard size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>Bank Transfer (Sabumi Pay)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Konfirmasi manual via WhatsApp</div>
                  </div>
                </div>
              </div>
              <button onClick={handleNext} style={{ width: '100%', padding: '16px', background: 'var(--text-main)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '12px' }}>Lanjut ke Pengiriman</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ margin: '0 0 16px 0' }}>Logistik & Jasa Rakit</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <div 
                    onClick={() => setShippingType('truck')}
                    style={{ 
                      padding: '16px', borderRadius: '16px', border: shippingType === 'truck' ? '2px solid var(--primary)' : '1px solid #dee2e6',
                      cursor: 'pointer', textAlign: 'center', background: shippingType === 'truck' ? 'rgba(12,166,120,0.05)' : 'white'
                    }}>
                    <Truck size={24} style={{ marginBottom: '8px', color: shippingType === 'truck' ? 'var(--primary)' : '#adb5bd' }} />
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Truck</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2-3 Hari</div>
                  </div>
                  <div 
                    onClick={() => setShippingType('container')}
                    style={{ 
                      padding: '16px', borderRadius: '16px', border: shippingType === 'container' ? '2px solid var(--primary)' : '1px solid #dee2e6',
                      cursor: 'pointer', textAlign: 'center', background: shippingType === 'container' ? 'rgba(12,166,120,0.05)' : 'white'
                    }}>
                    <Package size={24} style={{ marginBottom: '8px', color: shippingType === 'container' ? 'var(--primary)' : '#adb5bd' }} />
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Cargo</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5-7 Hari</div>
                  </div>
                </div>

                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Users size={20} color="var(--primary)" />
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Jasa Perakitan (Tukang)</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bantuan ahli BlockBamboo</div>
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input type="checkbox" checked={useAssembly} onChange={e => setUseAssembly(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ 
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                        background: useAssembly ? 'var(--primary)' : '#ccc', borderRadius: '34px', transition: '.4s' 
                      }}>
                        <span style={{ 
                          position: 'absolute', height: '18px', width: '18px', left: useAssembly ? '22px' : '4px', bottom: '3px',
                          background: 'white', borderRadius: '50%', transition: '.4s'
                        }} />
                      </span>
                    </label>
                  </div>
                  
                  {useAssembly && (
                    <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '12px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Pilih Kategori Tukang (Rp/m²)</label>
                      <select 
                        value={payoutRate} 
                        onChange={e => setPayoutRate(parseInt(e.target.value))}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
                      >
                        <option value={200000}>Basic (Rp 200rb/m²)</option>
                        <option value={450000}>Professional (Rp 450rb/m²)</option>
                        <option value={1000000}>Master Artisan (Rp 1jt/m²)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={handleNext} style={{ width: '100%', padding: '16px', background: 'var(--text-main)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Konfirmasi Order</button>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h4 style={{ margin: 0 }}>Review Order Anda</h4>
              </div>
              
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Harga Bangunan</span>
                  <span style={{ fontWeight: 'bold' }}>Rp {design.basePrice.toLocaleString('id-ID')}</span>
                </div>
                {useAssembly && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Jasa Perakitan ({area}m²)</span>
                    <span style={{ fontWeight: 'bold' }}>+ Rp {assemblyCost.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pengiriman ({shippingType})</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>GRATIS</span>
                </div>
                <div style={{ borderTop: '2px dashed #dee2e6', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                  <span style={{ fontWeight: '900' }}>TOTAL</span>
                  <span style={{ fontWeight: '900', color: 'var(--primary)' }}>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                <ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Pembayaran diamankan oleh Escrow Sabumi Smart Contract.
              </div>

              <button onClick={handleNext} style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>BAYAR SEKARANG</button>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: '#e6fcf5', color: 'var(--primary)', padding: '16px', borderRadius: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                🎉 Pembayaran Berhasil!
              </div>

              <div>
                <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Activity size={18} color="var(--primary)" /> Lacak Pesanan: #ORD-{Math.floor(Math.random()*9000)+1000}
                </h4>
                
                <div style={{ position: 'relative', paddingLeft: '32px' }}>
                  <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', background: '#dee2e6' }} />
                  
                  {[
                    { title: 'Pesanan Diterima', time: 'Baru saja', done: true },
                    { title: 'Pembayaran Diverifikasi', time: 'Baru saja', done: true },
                    { title: 'Persiapan Material & Fabrikasi', time: 'Estimasi: 2 Hari', current: true },
                    { title: 'Pengiriman Unit Modular', time: `Estimasi: ${estimatedDelivery}`, future: true },
                    { title: 'Proses Perakitan di Lokasi', time: 'Oleh: Tim Tukang Sabumi', future: true },
                  ].map((track, i) => (
                    <div key={i} style={{ marginBottom: '24px', position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%',
                        background: track.done ? 'var(--primary)' : track.current ? 'var(--primary)' : '#dee2e6',
                        border: track.current ? '4px solid #e6fcf5' : 'none',
                        zIndex: 1
                      }} />
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: track.future ? '#adb5bd' : 'var(--text-main)' }}>{track.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#adb5bd' }}>{track.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {useAssembly && (
                <div style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(245, 159, 0, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Info size={18} color="#f59f00" />
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#f59f00' }}>Notifikasi Tukang Terkirim</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a06900' }}>
                    Sistem telah mengirimkan misi ke 12 tukang bersertifikat di sekitar lokasi Anda. Dana jasa (Rp {assemblyCost.toLocaleString('id-ID')}) telah dikunci dan akan otomatis cair ke saldo tukang setelah Anda melakukan verifikasi "Misi Selesai".
                  </div>
                </div>
              )}

              <button onClick={onClose} style={{ width: '100%', padding: '16px', background: '#f8f9fa', color: 'var(--text-main)', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Tutup Dashboard Pesanan</button>
            </div>
          )}

        </div>

        {/* Footer info for Step 1-3 */}
        {step < 4 && (
          <div style={{ padding: '20px 32px', background: '#f8f9fa', borderTop: '1px solid #f1f3f5', display: 'flex', justifyContent: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#adb5bd' }}>
               <Smartphone size={14} /> Keamanan Transaksi End-to-End
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstructionCheckout;
