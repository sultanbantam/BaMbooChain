import React from 'react';
import { FileText } from 'lucide-react';
import BackButton from '../../components/BackButton';

const WhitepaperPage = () => {
  return (
    <div style={{ paddingTop: '150px', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* Back Navigation */}
      <div className="container" style={{ marginBottom: '20px' }}>
        <BackButton to="/bamboochain/token-wallet" />
      </div>

      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>Whitepaper bambuNUSA (BMC)</h1>
        <iframe
          src={`${import.meta.env.BASE_URL}whitepaper-bmc.pdf`}
          title="Whitepaper BMC"
          style={{ width: '100%', height: '80vh', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
      </div>
    </div>
  );
};

export default WhitepaperPage;
