import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { DashboardView } from './views/DashboardView';
import { SatelliteTrackingView } from './views/SatelliteTrackingView';
import { DebrisDetectionView } from './views/DebrisDetectionView';
import { CollisionPredictionView } from './views/CollisionPredictionView';
import { LaunchOptimizationView } from './views/LaunchOptimizationView';
import { SpaceWeatherView } from './views/SpaceWeatherView';
import { GroundStationView } from './views/GroundStationView';
import { CopilotView } from './views/CopilotView';
import { AnalyticsView } from './views/AnalyticsView';
import { AnomalyDetectionView } from './views/AnomalyDetectionView';
import { HealthPredictionView } from './views/HealthPredictionView';
import { ReportGeneratorView } from './views/ReportGeneratorView';
import { Earth3DView } from './views/Earth3DView';
import { TrafficManagementView } from './views/TrafficManagementView';
import { SimulationView } from './views/SimulationView';

import { User, Satellite, DebrisObject, SpaceWeatherReport } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'U-9021',
    username: 'Commander_Kaze',
    email: 'kaze.mission@astra.space',
    role: 'Operator',
  });

  const [activeModule, setActiveModule] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Global State fetched from Express API
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [debris, setDebris] = useState<DebrisObject[]>([]);
  const [weather, setWeather] = useState<SpaceWeatherReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);

  const fetchTelemetry = async () => {
    try {
      const [satsRes, debRes, wxRes] = await Promise.all([
        fetch('/api/satellites?limit=200'),
        fetch('/api/debris?limit=500'),
        fetch('/api/space-weather'),
      ]);

      const satsData = await satsRes.json();
      const debData = await debRes.json();
      const wxData = await wxRes.json();

      const satArray = Array.isArray(satsData)
        ? satsData
        : Array.isArray(satsData?.satellites)
        ? satsData.satellites
        : [];

      const debArray = Array.isArray(debData)
        ? debData
        : Array.isArray(debData?.debris)
        ? debData.debris
        : [];

      setSatellites(satArray);
      setDebris(debArray);
      setWeather(wxData);
    } catch (err) {
      console.error('Error fetching telemetry data from Express server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleLiveSync = async () => {
    setIsSyncingLive(true);
    try {
      const res = await fetch('/api/satellites/sync', { method: 'POST' });
      const data = await res.json();
      if (data.satellites && Array.isArray(data.satellites)) {
        setSatellites(data.satellites);
      } else {
        await fetchTelemetry();
      }
    } catch (err) {
      console.error('Live sync error:', err);
    } finally {
      setIsSyncingLive(false);
    }
  };

  const handleSearchSubmit = (query: string) => {
    setGlobalSearch(query);
    setActiveModule('satellites');
  };

  const renderActiveView = () => {
    switch (activeModule) {
      case 'home':
        return (
          <HomeView
            satellites={satellites}
            debris={debris}
            weather={weather}
            onNavigate={(mod) => setActiveModule(mod)}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            satellites={satellites}
            debris={debris}
            weather={weather}
            onNavigate={(mod) => setActiveModule(mod)}
          />
        );
      case 'satellites':
        return (
          <SatelliteTrackingView
            satellites={satellites}
            searchQuery={globalSearch}
            onLiveSync={handleLiveSync}
            isSyncingLive={isSyncingLive}
          />
        );
      case 'debris':
        return <DebrisDetectionView debris={debris} />;
      case 'collision':
        return <CollisionPredictionView satellites={satellites} debris={debris} />;
      case 'launch':
        return <LaunchOptimizationView />;
      case 'weather':
        return <SpaceWeatherView weather={weather} />;
      case 'ground':
      case 'ground-stations':
        return <GroundStationView />;
      case 'copilot':
        return <CopilotView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'anomaly':
        return <AnomalyDetectionView />;
      case 'health':
        return <HealthPredictionView />;
      case 'report':
        return (
          <ReportGeneratorView satellites={satellites} debris={debris} weather={weather} />
        );
      case 'earth3d':
      case '3d-earth':
        return <Earth3DView satellites={satellites} debris={debris} />;
      case 'traffic':
        return <TrafficManagementView />;
      case 'simulation':
        return <SimulationView />;
      default:
        return (
          <HomeView
            satellites={satellites}
            debris={debris}
            weather={weather}
            onNavigate={(mod) => setActiveModule(mod)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Mission Control Header Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearch={handleSearchSubmit}
        searchQuery={globalSearch}
        activeModule={activeModule}
        onLiveSync={handleLiveSync}
        isSyncingLive={isSyncingLive}
      />

      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(mod) => setActiveModule(mod)}
          isOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Application Workspace Content Area */}
        <main
          className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full ${
            isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4 font-mono text-cyan-400">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm uppercase tracking-widest">
                ESTABLISHING TELEMETRY LINK TO ASTRA OS MISSION CONTROL...
              </p>
            </div>
          ) : (
            renderActiveView()
          )}
        </main>
      </div>

      {/* Role-Based Authentication Clearance Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}

export default App;
