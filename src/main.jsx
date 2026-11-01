import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { Web3Provider } from './context/Web3Context.jsx'
import { BambupediaProvider } from './context/BambupediaContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { MarketplaceProvider } from './context/MarketplaceContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

// Auto-recover from stale chunks / vite build deployment mismatches
const handleChunkError = (errorMsg) => {
  if (
    errorMsg &&
    (/Loading chunk [\d\w]+ failed|Failed to fetch dynamically imported module|Importing a module script failed|Unexpected token/i.test(errorMsg))
  ) {
    const lastReload = sessionStorage.getItem('chunk_reload_timestamp');
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
      sessionStorage.setItem('chunk_reload_timestamp', now.toString());
      console.warn('🔄 Stale version detected. Reloading latest build automatically...');
      window.location.reload();
    }
  }
};

window.addEventListener('error', (e) => handleChunkError(e?.message));
window.addEventListener('unhandledrejection', (e) => handleChunkError(e?.reason?.message));

// Global Error Boundary
class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Uncaught Error:', error, errorInfo);
    handleChunkError(error?.message);
  }

  render() {
    if (this.state.hasError) {
      const isChunkMismatch = this.state.error?.message && (
        /Loading chunk [\d\w]+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(this.state.error.message)
      );

      if (isChunkMismatch) {
        return (
          <div style={{
            minHeight: '100vh',
            backgroundColor: '#0a0f0a',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            <h2 style={{ color: '#51cf66', marginBottom: '10px' }}>BaMbooChain Memuat Versi Terbaru...</h2>
            <p style={{ color: '#adb5bd', maxWidth: '450px', marginBottom: '25px', lineHeight: '1.5' }}>
              Aplikasi sedang memperbarui berkas sistem ke versi teranyar.
            </p>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.reload();
              }}
              style={{
                padding: '12px 28px',
                backgroundColor: '#51cf66',
                color: 'black',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(81, 207, 102, 0.3)'
              }}
            >
              Muat Ulang Halaman
            </button>
          </div>
        );
      }

      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0a0f0a',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h2 style={{ color: '#ff6b6b', marginBottom: '10px' }}>Terjadi Kendala Memuat Halaman</h2>
          <p style={{ color: '#adb5bd', maxWidth: '480px', marginBottom: '20px', lineHeight: '1.5' }}>
            Halaman mengalami kendala tak terduga. Silakan muat ulang atau kembali ke beranda.
          </p>
          {this.state.error?.message && (
            <div style={{
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: '#ff8787',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              maxWidth: '520px',
              wordBreak: 'break-word',
              marginBottom: '22px',
              fontFamily: 'monospace'
            }}>
              {this.state.error.message}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                padding: '10px 24px',
                backgroundColor: '#51cf66',
                color: 'black',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Muat Ulang
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '#/';
                window.location.reload();
              }}
              style={{
                padding: '10px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Ke Beranda
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider>
                <Web3Provider>
                  <BambupediaProvider>
                    <MarketplaceProvider>
                      <App />
                    </MarketplaceProvider>
                  </BambupediaProvider>
                </Web3Provider>
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </HashRouter>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
)
