import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import InsightPage from './pages/InsightPage';
import ImpactPage from './pages/ImpactPage';
import ContactPage from './pages/ContactPage';
import PartnersPage from './pages/PartnersPage';
import DisclaimerPage from './pages/DisclaimerPage';
import TransparencyPage from './pages/TransparencyPage';
import ProfilePage from './pages/ProfilePage';
import MembershipPage from './pages/MembershipPage';
import AcademyPage from './pages/AcademyPage';
import DataToolsPage from './pages/DataToolsPage';
import CommunityPage from './pages/CommunityPage';
import BambupediaPage from './pages/bambupedia/Index';
import BambupediaTracker from './pages/bambupedia/Tracker';
import BambupediaPlant from './pages/bambupedia/Plant';
import BambupediaPlantPast from './pages/bambupedia/PlantPast';
import BambupediaMaintain from './pages/bambupedia/Maintain';
import BambupediaHarvest from './pages/bambupedia/Harvest';
import BambupediaUtilize from './pages/bambupedia/Utilize';
import BambupediaCultivate from './pages/bambupedia/Cultivate';
import BambupediaTaxonomy from './pages/bambupedia/TaxonomyAnalysis';
import BambupediaHistory from './pages/bambupedia/History';
import CareersPage from './pages/CareersPage';

// BambooChain Modules
import BcOverviewPage from './pages/bamboochain/OverviewPage';
import BcPlantationPage from './pages/bamboochain/PlantationPage';
import BcSupplyChainPage from './pages/bamboochain/SupplyChainPage';
import BcBuildPage from './pages/bamboochain/BuildPage';
import BcTokenWalletPage from './pages/bamboochain/TokenWalletPage';
import BcCarbonImpactPage from './pages/bamboochain/CarbonImpactPage';
import BcMarketplacePage from './pages/bamboochain/MarketplacePage';
import BcDaoCommunityPage from './pages/bamboochain/DaoCommunityPage';
import BcAcademyPage from './pages/bamboochain/AcademyPage';
import BcDataAnalyticsPage from './pages/bamboochain/DataAnalyticsPage';
import BcInvestEcosystemPage from './pages/bamboochain/InvestEcosystemPage';
import BcValidatorDashboardPage from './pages/bamboochain/ValidatorDashboardPage';
import ActivityLogPage from './pages/bamboochain/ActivityLogPage';
import WhitepaperPage from './pages/bamboochain/WhitepaperPage';
import PreOrderPage from './pages/bamboochain/PreOrderPage';
import FAQPage from './pages/FAQPage';
import AdSpace from './components/AdSpace';
import CareCenterWidget from './components/CareCenterWidget';

// bambuNUSA Modules
import FarmerListPage from './pages/bambunusa/FarmerListPage';
import JoinFarmerPage from './pages/bambunusa/JoinFarmerPage';
import JoinValidatorPage from './pages/bambunusa/JoinValidatorPage';
import BcLifecyclePage from './pages/bambunusa/LifecyclePage';
import AdminPortalPage from './pages/AdminPortalPage';

import ScrollToTop from './components/ScrollToTop';
import GlobalToast from './components/GlobalToast';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ScrollToTop />
        <Navbar />
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
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/bamboochain/marketplace" element={<BcMarketplacePage />} />
          <Route path="/bamboochain/pre-order" element={<PreOrderPage />} />
          <Route path="/careers" element={<CareersPage />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
          <Route path="/academy" element={<ProtectedRoute><AcademyPage /></ProtectedRoute>} />
          <Route path="/data-tools" element={<ProtectedRoute><DataToolsPage /></ProtectedRoute>} />
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
          
          {/* BambooChain Protected Routes */}
          <Route path="/bamboochain" element={<ProtectedRoute><BcOverviewPage /></ProtectedRoute>} />
          <Route path="/bamboochain/plantation" element={<ProtectedRoute><BcPlantationPage /></ProtectedRoute>} />
          <Route path="/bamboochain/supply-chain" element={<ProtectedRoute><BcSupplyChainPage /></ProtectedRoute>} />
          <Route path="/bamboochain/build" element={<ProtectedRoute><BcBuildPage /></ProtectedRoute>} />
          <Route path="/bamboochain/token-wallet" element={<ProtectedRoute><BcTokenWalletPage /></ProtectedRoute>} />
          <Route path="/bamboochain/carbon-impact" element={<ProtectedRoute><BcCarbonImpactPage /></ProtectedRoute>} />
          <Route path="/bamboochain/dao" element={<ProtectedRoute><BcDaoCommunityPage /></ProtectedRoute>} />
          <Route path="/bamboochain/academy" element={<ProtectedRoute><BcAcademyPage /></ProtectedRoute>} />
          <Route path="/bamboochain/data-analytics" element={<ProtectedRoute><BcDataAnalyticsPage /></ProtectedRoute>} />
          <Route path="/bamboochain/invest" element={<ProtectedRoute><BcInvestEcosystemPage /></ProtectedRoute>} />
          <Route path="/validator" element={<ProtectedRoute><BcValidatorDashboardPage /></ProtectedRoute>} />
          <Route path="/bamboochain/activities" element={<ProtectedRoute><ActivityLogPage /></ProtectedRoute>} />
          <Route path="/bamboochain/whitepaper" element={<ProtectedRoute><WhitepaperPage /></ProtectedRoute>} />
          
          {/* bambuNUSA Protected Routes */}
          <Route path="/bambunusa" element={<ProtectedRoute><BcLifecyclePage /></ProtectedRoute>} />
          <Route path="/bambunusa/farmers" element={<ProtectedRoute><FarmerListPage /></ProtectedRoute>} />
          <Route path="/bambunusa/join" element={<JoinFarmerPage />} />
          <Route path="/bambunusa/join-farmer" element={<JoinFarmerPage />} />
          <Route path="/bambunusa/join-validator" element={<JoinValidatorPage />} />
          <Route path="/admin-portal" element={<ProtectedRoute><AdminPortalPage /></ProtectedRoute>} />
          
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
        <Footer />
        <AuthModal />
        <CareCenterWidget />
        <div id="version-debug" style={{ fontSize: '10px', opacity: 0.3, textAlign: 'center', padding: '10px' }}>Build v1.0.7-Recovered</div>
        <GlobalToast />
      </div>
    </AuthProvider>
  );
}

export default App;
