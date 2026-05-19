import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { Web3Provider } from './context/Web3Context.jsx'
import { BambupediaProvider } from './context/BambupediaContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { MarketplaceProvider } from './context/MarketplaceContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
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
  </StrictMode>,
)
