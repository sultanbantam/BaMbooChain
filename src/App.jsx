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
import BambupediaPage from './pages/BambupediaPage';
import CareersPage from './pages/CareersPage';
import BambupediaGuidePage from './pages/BambupediaGuidePage';
import BambupediaTrackerPage from './pages/BambupediaTrackerPage';
import AdminPortalPage from './pages/AdminPortalPage';

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
import WhitepaperPage from './pages/bamboochain/WhitepaperPage';
import BcPreOrderPage from './pages/bamboochain/PreOrderPage';
import BcActivitiesPage from './pages/bamboochain/ActivitiesPage';
import FAQPage from './pages/FAQPage';
import CareCenterWidget from './components/CareCenterWidget';

// bambuNUSA Modules
import FarmerListPage from './pages/bambunusa/FarmerListPage';
import JoinFarmerPage from './pages/bambunusa/JoinFarmerPage';
import JoinValidatorPage from './pages/bambunusa/JoinValidatorPage';
import BcLifecyclePage from './pages/bambunusa/LifecyclePage';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
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
          <Route path="/bamboochain/pre-order" element={<BcPreOrderPage />} />
          <Route path="/careers" element={<CareersPage />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
          <Route path="/academy" element={<ProtectedRoute><AcademyPage /></ProtectedRoute>} />
          <Route path="/data-tools" element={<ProtectedRoute><DataToolsPage /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/bambupedia" element={<ProtectedRoute><BambupediaPage /></ProtectedRoute>} />
          <Route path="/bambupedia/tracker" element={<ProtectedRoute><BambupediaTrackerPage /></ProtectedRoute>} />
          <Route path="/bambupedia/plant" element={<ProtectedRoute><BambupediaGuidePage topic="plant" /></ProtectedRoute>} />
          <Route path="/bambupedia/plant-past" element={<ProtectedRoute><BambupediaGuidePage topic="plant-past" /></ProtectedRoute>} />
          <Route path="/bambupedia/maintain" element={<ProtectedRoute><BambupediaGuidePage topic="maintain" /></ProtectedRoute>} />
          <Route path="/bambupedia/harvest" element={<ProtectedRoute><BambupediaGuidePage topic="harvest" /></ProtectedRoute>} />
          <Route path="/bambupedia/utilize" element={<ProtectedRoute><BambupediaGuidePage topic="utilize" /></ProtectedRoute>} />
          <Route path="/bambupedia/cultivate" element={<ProtectedRoute><BambupediaGuidePage topic="cultivate" /></ProtectedRoute>} />
          <Route path="/bambupedia/taxonomy" element={<ProtectedRoute><BambupediaGuidePage topic="taxonomy" /></ProtectedRoute>} />
          <Route path="/bambupedia/history" element={<ProtectedRoute><BambupediaGuidePage topic="history" /></ProtectedRoute>} />
          
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
          <Route path="/bamboochain/activities" element={<ProtectedRoute><BcActivitiesPage /></ProtectedRoute>} />
          <Route path="/bamboochain/whitepaper" element={<ProtectedRoute><WhitepaperPage /></ProtectedRoute>} />
          
          {/* bambuNUSA Protected Routes */}
          <Route path="/bambunusa" element={<ProtectedRoute><BcLifecyclePage /></ProtectedRoute>} />
          <Route path="/bambunusa/farmers" element={<ProtectedRoute><FarmerListPage /></ProtectedRoute>} />
          <Route path="/bambunusa/join" element={<ProtectedRoute><JoinFarmerPage /></ProtectedRoute>} />
          <Route path="/bambunusa/join-farmer" element={<ProtectedRoute><JoinFarmerPage /></ProtectedRoute>} />
          <Route path="/bambunusa/join-validator" element={<ProtectedRoute><JoinValidatorPage /></ProtectedRoute>} />
          
          <Route path="/admin-portal" element={<ProtectedRoute><AdminPortalPage /></ProtectedRoute>} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
        <Footer />
        <AuthModal />
        <CareCenterWidget />
      </div>
    </AuthProvider>
  );
}

export default App;
