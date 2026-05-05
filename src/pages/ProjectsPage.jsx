import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { PROJECTS } from '../data/projectsData';
import { MapPin, Lock, Unlock, ArrowRight, X, Info, Coins } from 'lucide-react';
import BackButton from '../components/BackButton';

const ProjectsPage = () => {
  const { isConnected, rawBmcBalance, connectWallet } = useWeb3();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showLockModal, setShowLockModal] = useState(false);

  const REQUIRED_BMC = 10;
  const hasAccess = isConnected && rawBmcBalance >= REQUIRED_BMC;

  const handleViewDetail = (project) => {
    if (hasAccess) {
      setSelectedProject(project);
    } else {
      setShowLockModal(true);
    }
  };

  return (
    <div style={{ 
      paddingTop: 'var(--navbar-height)', 
      paddingBottom: '100px',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #fdfdfd, #f4f7f4)'
    }}>
      <div className="container">
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <BackButton to="/" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '16px' }}>Proyek YSNJ</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Menjelajahi inisiatif berkelanjutan untuk masa depan hijau.</p>
          </div>
          
          <div className="glass" style={{ padding: '15px 25px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              background: hasAccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: hasAccess ? '#16a34a' : '#dc2626'
            }}>
              {hasAccess ? <Unlock size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status Akses Detail</div>
              <div style={{ fontWeight: '800', color: hasAccess ? '#16a34a' : '#dc2626' }}>
                {hasAccess ? 'AKSES TERBUKA' : 'TERKUNCI (Min. 10 BMC)'}
              </div>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {PROJECTS.map((project) => (
            <div 
              key={project.id}
              className="glass animate-fade-in"
              style={{ 
                borderRadius: '24px', 
                overflow: 'hidden', 
                background: 'white',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image with Badge */}
              <div style={{ position: 'relative', height: '220px' }}>
                <div style={{ 
                  width: '100%', height: '100%', 
                  background: `url("${project.image}") center/cover no-repeat` 
                }} />
                <div style={{ 
                  position: 'absolute', top: '20px', left: '20px',
                  padding: '6px 14px', borderRadius: '30px',
                  background: project.status === 'Berjalan' ? '#16a34a' : '#f59e0b',
                  color: 'white', fontSize: '0.75rem', fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                  {project.status.toUpperCase()}
                </div>
                <div style={{ 
                  position: 'absolute', bottom: '15px', right: '15px',
                  padding: '6px 12px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                  color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 'bold'
                }}>
                  {project.category}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  <MapPin size={14} /> {project.location}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '15px', color: 'var(--text-main)', lineHeight: '1.3' }}>
                  {project.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
                  {project.shortDesc}
                </p>
                
                <button 
                  onClick={() => handleViewDetail(project)}
                  style={{ 
                    width: '100%', padding: '14px', borderRadius: '14px',
                    border: 'none', background: 'var(--text-main)', color: 'white',
                    fontWeight: 'bold', cursor: 'pointer', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {hasAccess ? 'LIHAT DETAIL PROYEK' : 'AKSES TERKUNCI'}
                  {hasAccess ? <ArrowRight size={18} /> : <Lock size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL (PROTECTED) */}
      {selectedProject && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div className="animate-scale-in" style={{ 
            background: 'white', width: '100%', maxWidth: '800px', 
            borderRadius: '30px', overflow: 'hidden', position: 'relative',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <button 
              onClick={() => setSelectedProject(null)}
              style={{ 
                position: 'absolute', top: '20px', right: '20px', zIndex: 10,
                width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ height: '300px', background: `url("${selectedProject.image}") center/cover no-repeat` }} />
            
            <div style={{ padding: '40px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span style={{ padding: '4px 12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>{selectedProject.status}</span>
                <span style={{ padding: '4px 12px', background: '#f0f0f0', color: '#666', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>{selectedProject.category}</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px' }}>{selectedProject.title}</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px', padding: '20px', background: '#f8fbf8', borderRadius: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Lokasi</div>
                  <div style={{ fontWeight: 'bold' }}>{selectedProject.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Dampak Utama</div>
                  <div style={{ fontWeight: 'bold' }}>{selectedProject.impact}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Deskripsi Lengkap</h3>
              <p style={{ color: '#444', lineHeight: '1.8', fontSize: '1.1rem' }}>
                {selectedProject.fullDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LOCK MODAL */}
      {showLockModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
          padding: '20px'
        }}>
          <div className="animate-scale-in" style={{ 
            background: 'white', width: '100%', maxWidth: '450px', 
            borderRadius: '24px', padding: '40px', textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Lock size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px' }}>Akses Detail Terbatas</h2>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>
              Anda memerlukan minimal <strong>10 BMC</strong> di dompet Anda untuk mengakses informasi detail mengenai proyek strategis YSNJ.
            </p>

            {!isConnected ? (
              <button 
                onClick={connectWallet}
                style={{ 
                  width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                  background: 'var(--primary)', color: 'white', fontWeight: 'bold',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
              >
                HUBUNGKAN DOMPET
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '15px', background: '#fff5f5', borderRadius: '12px', color: '#c53030', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Saldo Anda: {rawBmcBalance} BMC
                </div>
                <a 
                  href="https://pancakeswap.finance" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    padding: '16px', borderRadius: '12px', border: '2px solid #eee',
                    color: 'var(--text-main)', fontWeight: 'bold', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}
                >
                  BELI BMC DI PANCAKESWAP <ArrowRight size={18} />
                </a>
              </div>
            )}

            <button 
              onClick={() => setShowLockModal(false)}
              style={{ marginTop: '20px', background: 'none', border: 'none', color: '#888', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Mungkin Nanti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
