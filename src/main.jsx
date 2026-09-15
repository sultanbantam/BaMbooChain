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
    (/Loading chunk [\d\w]+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(errorMsg))
  ) {
    const lastReload = sessionStorage.getItem('chunk_reload_timestamp');
    const now = Date.now();
    // Throttle reload to prevent infinite loop (at most once every 10 seconds)
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      sessionStorage.setItem('chunk_reload_timestamp', now.toString());
      console.warn('🔄 Stale version detected. Reloading latest build...');
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
