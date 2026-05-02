import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { Web3Provider } from './context/Web3Context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <LanguageProvider>
        <Web3Provider>
          <App />
        </Web3Provider>
      </LanguageProvider>
    </HashRouter>
  </StrictMode>,
)
