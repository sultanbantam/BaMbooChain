import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

// Helper for resilient lazy loading that handles chunk mismatches after deployments
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      console.warn("Chunk load mismatch detected, auto-recovering latest version...", error);
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        return { default: () => null };
      }
      throw error;
    }
  });

// Lazy-loaded pages with resilient auto-retry
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'));
const ProjectsPage = lazyWithRetry(() => import('./pages/ProjectsPage'));
const InsightPage = lazyWithRetry(() => import('./pages/InsightPage'));
const ImpactPage = lazyWithRetry(() => import('./pages/ImpactPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const PartnersPage = lazyWithRetry(() => import('./pages/PartnersPage'));
const DisclaimerPage = lazyWithRetry(() => import('./pages/DisclaimerPage'));
const PrivacyPolicyPage = lazyWithRetry(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazyWithRetry(() => import('./pages/TermsOfServicePage'));
const TransparencyPage = lazyWithRetry(() => import('./pages/TransparencyPage'));
const ProfilePage = lazyWithRetry(() => import('./pages/ProfilePage'));
const MembershipPage = lazyWithRetry(() => import('./pages/MembershipPage'));
const AcademyPage = lazyWithRetry(() => import('./pages/AcademyPage'));
const DataToolsPage = lazyWithRetry(() => import('./pages/DataToolsPage'));
const CommunityPage = lazyWithRetry(() => import('./pages/CommunityPage'));
const WanipiroPage = lazyWithRetry(() => import('./pages/WanipiroPage'));
const BambupediaPage = lazyWithRetry(() => import('./pages/bambupedia/Index'));
const BambupediaTracker = lazyWithRetry(() => import('./pages/bambupedia/Tracker'));
const BambupediaPlant = lazyWithRetry(() => import('./pages/bambupedia/Plant'));
const BambupediaPlantPast = lazyWithRetry(() => import('./pages/bambupedia/PlantPast'));
const BambupediaMaintain = lazyWithRetry(() => import('./pages/bambupedia/Maintain'));
const BambupediaHarvest = lazyWithRetry(() => import('./pages/bambupedia/Harvest'));
const BambupediaUtilize = lazyWithRetry(() => import('./pages/bambupedia/Utilize'));
const BambupediaCultivate = lazyWithRetry(() => import('./pages/bambupedia/Cultivate'));
const BambupediaTaxonomy = lazyWithRetry(() => import('./pages/bambupedia/TaxonomyAnalysis'));
const BambupediaHistory = lazyWithRetry(() => import('./pages/bambupedia/History'));
const BambupediaKnowledge = lazyWithRetry(() => import('./pages/bambupedia/KnowledgePage'));
const BambooBotPage = lazyWithRetry(() => import('./pages/bambupedia/BambooBotPage'));
const KnowledgeAdminPage = lazyWithRetry(() => import('./pages/bambupedia/KnowledgeAdminPage'));
const CareersPage = lazyWithRetry(() => import('./pages/CareersPage'));
const EventOrganizerPage = lazyWithRetry(() => import('./pages/EventOrganizerPage'));

// BambooChain Modules
const BcOverviewPage = lazyWithRetry(() => import('./pages/bamboochain/OverviewPage'));
const BcPlantationPage = lazyWithRetry(() => import('./pages/bamboochain/PlantationPage'));
const BcSupplyChainPage = lazyWithRetry(() => import('./pages/bamboochain/SupplyChainPage'));
const BcBuildPage = lazyWithRetry(() => import('./pages/bamboochain/BuildPage'));
const BcTokenWalletPage = lazyWithRetry(() => import('./pages/bamboochain/TokenWalletPage'));
const BcCarbonImpactPage = lazyWithRetry(() => import('./pages/bamboochain/CarbonImpactPage'));
const BcMarketplacePage = lazyWithRetry(() => import('./pages/bamboochain/MarketplacePage'));
const BcDaoCommunityPage = lazyWithRetry(() => import('./pages/bamboochain/DaoCommunityPage'));
const BcAcademyPage = lazyWithRetry(() => import('./pages/bamboochain/AcademyPage'));
const BcDataAnalyticsPage = lazyWithRetry(() => import('./pages/bamboochain/DataAnalyticsPage'));
const BcInvestEcosystemPage = lazyWithRetry(() => import('./pages/bamboochain/InvestEcosystemPage'));
const BcValidatorDashboardPage = lazyWithRetry(() => import('./pages/bamboochain/ValidatorDashboardPage'));
const BcCentralValidatorDashboard = lazyWithRetry(() => import('./pages/bamboochain/CentralValidatorDashboard'));
const ActivityLogPage = lazyWithRetry(() => import('./pages/bamboochain/ActivityLogPage'));
const WhitepaperPage = lazyWithRetry(() => import('./pages/bamboochain/WhitepaperPage'));
const PreOrderPage = lazyWithRetry(() => import('./pages/bamboochain/PreOrderPage'));
const KoDiBaPage = lazyWithRetry(() => import('./pages/kodiba/KoDiBaPage'));
const EventsPage = lazyWithRetry(() => import('./pages/community/EventsPage'));
const FAQPage = lazyWithRetry(() => import('./pages/FAQPage'));
const AdSpace = lazyWithRetry(() => import('./components/AdSpace'));
const CareCenterWidget = lazyWithRetry(() => import('./components/CareCenterWidget'));
const BambooMeetingPage = lazyWithRetry(() => import('./pages/bamboochain/BambooMeetingPage'));
const BcVolunteersPage = lazyWithRetry(() => import('./pages/bamboochain/VolunteersPage'));
const BcVolunteerDetailPage = lazyWithRetry(() => import('./pages/bamboochain/VolunteerDetailPage'));

// bambuNUSA Modules
const FarmerListPage = lazyWithRetry(() => import('./pages/bambunusa/FarmerListPage'));
const JoinFarmerPage = lazyWithRetry(() => import('./pages/bambunusa/JoinFarmerPage'));
const JoinValidatorPage = lazyWithRetry(() => import('./pages/bambunusa/JoinValidatorPage'));
const BcLifecyclePage = lazyWithRetry(() => import('./pages/bambunusa/LifecyclePage'));
const AdminPortalPage = lazyWithRetry(() => import('./pages/AdminPortalPage'));
const TobatEkologiDashboard = lazyWithRetry(() => import('./pages/bamboochain/TobatEkologiDashboard'));

import ScrollToTop from './components/ScrollToTop';
import GlobalToast from './components/GlobalToast';
import SocialInteractions from './components/SocialInteractions';
import PushNotificationModal from './components/PushNotificationModal';

const PublicPortfolioPage = lazyWithRetry(() => import('./pages/PublicPortfolioPage'));
const AuthorizePage = lazyWithRetry(() => import('./pages/AuthorizePage'));
const SettingsPage = lazyWithRetry(() => import('./pages/SettingsPage'));
const LoginPage = lazyWithRetry(() => import('./pages/LoginPage'));
const UgandaProjectDashboard = lazyWithRetry(() => import('./pages/consortium/UgandaProjectDashboard'));

const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '15px',
    color: '#10b981'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid rgba(16, 185, 129, 0.1)',
      borderTop: '4px solid #10b981',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    <span style={{ fontSize: '14px', fontWeight: '500', opacity: 0.8 }}>Memuat halaman...</span>
  </div>
);

const SEO_MAP = {
  '/': {
    title: 'BaMbooChain - Keberlanjutan Industri Bambu & Ekonomi Hijau',
    description: 'Potensi industri bambu global berbasis teknologi Web3 untuk restorasi ekosistem, penyerapan karbon, dan pemberdayaan masyarakat adat.'
  },
  '/projects': {
    title: 'Proyek Pelestarian & Restorasi Bambu - Sabumi Nusantara Jaya',
    description: 'Jelajahi proyek restorasi lingkungan nyata kami, termasuk Perkebunan Emas Hijau Cibarani dan Cisadane Adventure Eco Park.'
  },
  '/insight': {
    title: 'Insight & Edukasi Pasar Bambu - BaMbooChain',
    description: 'Pelajari analisis pasar global, studi kasus industri, perbandingan material ramah lingkungan, dan potensi ekonomi karbon bambu.'
  },
  '/impact': {
    title: 'Dasbor Dampak Lingkungan (Impact) - BaMbooChain',
    description: 'Pantau data real-time penanaman bibit bambu, restorasi lahan kritis, penyerapan emisi karbon CO2, dan kesejahteraan petani lokal.'
  },
  '/partners': {
    title: 'Kemitraan & Kolaborasi Hijau - Sabumi Nusantara Jaya',
    description: 'Aliansi strategis kami dengan akademisi, masyarakat adat, pelaku industri, dan pengembang teknologi digital.'
  },
  '/about': {
    title: 'Tentang Kami - Yayasan Sabumi Nusantara Jaya',
    description: 'Ketahui visi, misi, jajaran pendiri, sejarah organisasi, dan nilai-nilai keberlanjutan yang kami perjuangkan.'
  },
  '/contact': {
    title: 'Hubungi Kami - Sabumi Nusantara Jaya',
    description: 'Hubungi tim kami untuk kemitraan, kolaborasi penanaman, atau pertanyaan tentang ekosistem ekonomi hijau.'
  },
  '/transparency': {
    title: 'Dashboard Transparansi On-Chain BMC - BaMbooChain',
    description: 'Audit publik terhadap total pasokan, desimal, transaksi, dan kode smart contract token BMC secara langsung dari BSC.'
  },
  '/careers': {
    title: 'Karir & Peluang Berkontribusi - Sabumi Nusantara Jaya',
    description: 'Bergabunglah bersama kami membangun masa depan bumi yang lebih hijau. Temukan lowongan pekerjaan yang cocok untuk Anda.'
  },
  '/faq': {
    title: 'Tanya Jawab (FAQ) - BaMbooChain',
    description: 'Temukan jawaban atas pertanyaan umum seputar penanaman bambu digital, kegunaan token BMC, dan tata kelola DAO.'
  },
  '/privacy': {
    title: 'Kebijakan Privasi (Privacy Policy) - BaMbooChain',
    description: 'Kebijakan privasi aplikasi BaMbooChain mengenai perlindungan data pengguna, autentikasi Pi SDK, dan kerahasiaan geospasial.'
  },
  '/terms': {
    title: 'Ketentuan Layanan (Terms of Service) - BaMbooChain',
    description: 'Syarat dan ketentuan penggunaan platform BaMbooChain, kepatuhan eksklusivitas ekosistem Pi, dan aturan slashing validator.'
  },
  '/bambupedia': {
    title: 'Bambupedia - Pusat Pengetahuan & AI RAG',
    description: 'Akses database taksonomi bambu, pelacakan daur hidup tanaman, dan gunakan asisten AI BambooBot untuk riset terverifikasi.'
  },
  '/bamboochain': {
    title: 'Dasbor Ekosistem BaMbooChain',
    description: 'Pantau kepemilikan aset, penanaman digital, dan kontribusi data on-chain Anda dalam satu dasbor terpadu.'
  }
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const routeInfo = SEO_MAP[location.pathname] || {
      title: 'BaMbooChain - Web3 Green Bamboo Ecosystem',
      description: 'Ekosistem konservasi bambu digital berbasis blockchain untuk aksi iklim nyata dan ekonomi sirkular.'
    };
    
    // Update Title
    document.title = routeInfo.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = routeInfo.description;
  }, [location.pathname]);

  useEffect(() => {
    // 1. Check for query parameter room in standard URL (e.g. ?room=xxx) or hash URL
    const urlParams = new URLSearchParams(window.location.search);
    let room = urlParams.get('room');

    if (!room && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      room = hashParams.get('room');
    }

    if (room) {
      // Clear query parameter from browser address bar immediately to avoid loops/messy URL
      const cleanUrl = window.location.pathname + window.location.hash.split('?')[0];
      window.history.replaceState({}, document.title, cleanUrl);

      // Navigate directly to the meeting route publicly
      navigate(`/bamboochain/meeting?room=${room}`);
    }

    // Auto-redirect for OAuth /authorize or /login paths without hash
    if (window.location.pathname === '/authorize' || window.location.pathname === '/login') {
      window.location.replace('/#' + window.location.pathname + window.location.search);
    }
  }, [navigate]);

  useEffect(() => {
    // 2. Check for redirect target after successful login (for other protected paths if any)
    if (isAuthenticated) {
      const redirectTarget = sessionStorage.getItem('redirect_after_login');
      if (redirectTarget) {
        sessionStorage.removeItem('redirect_after_login');
        navigate(redirectTarget);
      }
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="App">
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/insight" element={<InsightPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/bamboochain/marketplace" element={<BcMarketplacePage />} />
            <Route path="/bamboochain/pre-order" element={<PreOrderPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/portfolio/:username" element={<PublicPortfolioPage />} />
            <Route path="/bamboochain/meeting" element={<BambooMeetingPage />} />
            <Route path="/authorize" element={<AuthorizePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/events" element={<EventsPage />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
            <Route path="/academy" element={<ProtectedRoute><AcademyPage /></ProtectedRoute>} />
            <Route path="/data-tools" element={
              <Suspense fallback={<PageLoader />}><DataToolsPage /></Suspense>
            } />
            <Route path="/wanipiro" element={
              <Suspense fallback={<PageLoader />}><WanipiroPage /></Suspense>
            } />
            <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
            <Route path="/bambupedia" element={<ProtectedRoute><BambupediaPage /></ProtectedRoute>} />
            <Route path="/bambupedia/tracker" element={<ProtectedRoute><BambupediaTracker /></ProtectedRoute>} />
            <Route path="/bambupedia/plant" element={<ProtectedRoute><BambupediaPlant /></ProtectedRoute>} />
            <Route path="/bambupedia/plant-past" element={<ProtectedRoute><BambupediaPlantPast /></ProtectedRoute>} />
            <Route path="/bambupedia/maintain" element={<ProtectedRoute><BambupediaMaintain /></ProtectedRoute>} />
            <Route path="/bambupedia/harvest" element={<ProtectedRoute><BambupediaHarvest /></ProtectedRoute>} />
            <Route path="/bambupedia/utilize" element={<ProtectedRoute><BambupediaUtilize /></ProtectedRoute>} />
            <Route path="/bambupedia/cultivate" element={<ProtectedRoute><BambupediaCultivate /></ProtectedRoute>} />
            <Route path="/bambupedia/taxonomy" element={<ProtectedRoute><BambupediaTaxonomy /></ProtectedRoute>} />
            <Route path="/bambupedia/history" element={<ProtectedRoute><BambupediaHistory /></ProtectedRoute>} />
            <Route path="/bambupedia/knowledge" element={<ProtectedRoute><BambupediaKnowledge /></ProtectedRoute>} />
            <Route path="/bambupedia/bambubot" element={<ProtectedRoute><BambooBotPage /></ProtectedRoute>} />
            
            {/* BambooChain Protected Routes */}
            <Route path="/bamboochain" element={<ProtectedRoute><BcOverviewPage /></ProtectedRoute>} />
            <Route path="/bamboochain/plantation" element={<ProtectedRoute><BcPlantationPage /></ProtectedRoute>} />
            <Route path="/bamboochain/supply-chain" element={<ProtectedRoute><BcSupplyChainPage /></ProtectedRoute>} />
            <Route path="/bamboochain/build" element={<ProtectedRoute><BcBuildPage /></ProtectedRoute>} />
            <Route path="/bamboochain/token-wallet" element={<BcTokenWalletPage />} />
            <Route path="/bamboochain/carbon-impact" element={<ProtectedRoute><BcCarbonImpactPage /></ProtectedRoute>} />
            <Route path="/bamboochain/dao" element={<ProtectedRoute><BcDaoCommunityPage /></ProtectedRoute>} />
            <Route path="/bamboochain/academy" element={<ProtectedRoute><BcAcademyPage /></ProtectedRoute>} />
            <Route path="/bamboochain/data-analytics" element={<ProtectedRoute><BcDataAnalyticsPage /></ProtectedRoute>} />
            <Route path="/bamboochain/invest" element={<ProtectedRoute><BcInvestEcosystemPage /></ProtectedRoute>} />
            <Route path="/validator" element={<ProtectedRoute><BcValidatorDashboardPage /></ProtectedRoute>} />
            <Route path="/central-validator" element={<ProtectedRoute><BcCentralValidatorDashboard /></ProtectedRoute>} />
            <Route path="/bamboochain/activities" element={<ProtectedRoute><ActivityLogPage /></ProtectedRoute>} />
            <Route path="/bamboochain/whitepaper" element={<ProtectedRoute><WhitepaperPage /></ProtectedRoute>} />
            <Route path="/bamboochain/kodiba" element={<ProtectedRoute><KoDiBaPage /></ProtectedRoute>} />
            <Route path="/bamboochain/volunteer" element={<ProtectedRoute><BcVolunteersPage /></ProtectedRoute>} />
            <Route path="/bamboochain/volunteer/:hostId" element={<ProtectedRoute><BcVolunteerDetailPage /></ProtectedRoute>} />
            {/* bambuNUSA Protected Routes */}
            <Route path="/bambunusa" element={<ProtectedRoute><BcLifecyclePage /></ProtectedRoute>} />
            <Route path="/bambunusa/farmers" element={<ProtectedRoute><FarmerListPage /></ProtectedRoute>} />
            <Route path="/bambunusa/join" element={<JoinFarmerPage />} />
            <Route path="/bambunusa/join-farmer" element={<JoinFarmerPage />} />
            <Route path="/bambunusa/join-validator" element={<JoinValidatorPage />} />
            <Route path="/admin-portal" element={<ProtectedRoute><AdminPortalPage /></ProtectedRoute>} />
            <Route path="/event-organizer" element={<ProtectedRoute><EventOrganizerPage /></ProtectedRoute>} />
            <Route path="/admin-portal/knowledge" element={<ProtectedRoute><KnowledgeAdminPage /></ProtectedRoute>} />
            <Route path="/tobat-ekologi" element={<TobatEkologiDashboard />} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/consortium/uganda" element={<ProtectedRoute><UgandaProjectDashboard /></ProtectedRoute>} />
            
            <Route path="/faq" element={<FAQPage />} />
          </Routes>
        </Suspense>
        <SocialInteractions />
        <Footer />
        <AuthModal />
        <CareCenterWidget />
        <div id="version-debug" style={{ fontSize: '10px', opacity: 0.3, textAlign: 'center', padding: '10px' }}>Build v1.0.9-InstantLoad</div>
        <GlobalToast />
        <PushNotificationModal />
      </div>
  );
}

export default App;
