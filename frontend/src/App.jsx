import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { RoadmapDiffModal } from './components/RoadmapDiffModal';
import { DottedSurfaceCanvas } from './components/DottedSurfaceCanvas';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { IndustryPage } from './pages/IndustryPage';
import { MemoryPage } from './pages/MemoryPage';
import { RadarPage } from './pages/RadarPage';
import { CareerSimulatorPage } from './pages/CareerSimulatorPage';
import { MentorPage } from './pages/MentorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HRDashboardPage } from './pages/HRDashboardPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold">Initializing LearningPath AI Platform...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated Flow
  if (!isAuthenticated) {
    if (showAuthModal) {
      // onAuthenticated: close the auth modal; isAuthenticated will flip to true
      // from AuthContext's setUser(), which will naturally re-render the app.
      return <AuthPage onAuthenticated={() => setShowAuthModal(false)} />;
    }
    return (
      <LandingPage
        onGetStarted={() => setShowAuthModal(true)}
        onLogin={() => setShowAuthModal(true)}
      />
    );
  }

  // Onboarding Wizard for new users
  if (!user?.onboarding_completed) {
    return <OnboardingPage onComplete={() => setActiveTab('dashboard')} />;
  }

  // Main Authenticated Application with StudyGraph Ambient 3D Dotted Canvas
  return (
    <div className="relative min-h-screen bg-[#080808] text-slate-100 flex flex-col md:flex-row antialiased overflow-x-hidden">
      {/* Roaming White Balls Canvas Background (Ambient Depth) */}
      <DottedSurfaceCanvas opacity={0.35} interactive={true} />

      {/* Sidebar Navigation */}
      <div className="relative z-20">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        <Navbar onOpenDiffModal={() => setShowDiffModal(true)} />

        <main className="flex-1 pb-12 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              setActiveTab={setActiveTab}
              onOpenDiffModal={() => setShowDiffModal(true)}
            />
          )}
          {activeTab === 'twin' && <DigitalTwinPage />}
          {activeTab === 'skills' && <SkillGapPage setActiveTab={setActiveTab} />}
          {activeTab === 'roadmap' && (
            <RoadmapPage onOpenDiffModal={() => setShowDiffModal(true)} />
          )}
          {activeTab === 'industry' && <IndustryPage />}
          {activeTab === 'memory' && <MemoryPage />}
          {activeTab === 'radar' && <RadarPage />}
          {activeTab === 'simulator' && <CareerSimulatorPage setActiveTab={setActiveTab} />}
          {activeTab === 'mentor' && <MentorPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'hr' && <HRDashboardPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Novel Roadmap Evolution Tracker Modal */}
      <RoadmapDiffModal
        isOpen={showDiffModal}
        onClose={() => setShowDiffModal(false)}
        targetRole={user?.target_role}
      />
    </div>
  );
}

export default App;
