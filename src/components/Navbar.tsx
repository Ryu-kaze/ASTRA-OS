import React, { useState, useEffect } from 'react';
import {
  Clock,
  Search,
  Bell,
  Shield,
  User as UserIcon,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Menu,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onOpenAuth: () => void;
  onToggleSidebar?: () => void;
  onSearch: (query: string) => void;
  searchQuery?: string;
  activeModule?: string;
  onLiveSync?: () => void;
  isSyncingLive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onToggleSidebar,
  onSearch,
  searchQuery = '',
  activeModule = 'home',
  onLiveSync,
  isSyncingLive = false,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');
  const [missionElapsedTime, setMissionElapsedTime] = useState<string>('00:00:00:00');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // UTC Live Clock & Elapsed Mission Counter
  useEffect(() => {
    const startTime = Date.now() - 1000 * 3600 * 142; // Simulated mission start 142h ago
    const interval = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');

      const elapsedMs = Date.now() - startTime;
      const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((elapsedMs / (1000 * 60)) % 60);
      const secs = Math.floor((elapsedMs / 1000) % 60);
      setMissionElapsedTime(
        `T+${days.toString().padStart(2, '0')}d:${hours.toString().padStart(2, '0')}h:${mins.toString().padStart(2, '0')}m:${secs.toString().padStart(2, '0')}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 py-3 text-slate-100 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Mission Status Badge */}
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition flex items-center justify-center"
            title="Toggle Sidebar Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 text-lg sm:text-xl">
              ASTRA OS
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              ● NOMINAL
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden md:block">
            AUTONOMOUS SPACE TRACKING & ANALYSIS
          </p>
        </div>
      </div>

      {/* Clocks & Mission Timer */}
      <div className="hidden lg:flex items-center space-x-6 bg-slate-900/90 border border-slate-800/80 rounded-xl px-4 py-1.5 font-mono text-xs shadow-inner">
        <div className="flex items-center space-x-2 text-cyan-300">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{utcTime || 'LOADING UTC...'}</span>
        </div>
        <div className="h-4 w-[1px] bg-slate-800" />
        <div className="flex items-center space-x-2 text-purple-300">
          <span className="text-[10px] uppercase text-slate-400">MET:</span>
          <span className="font-bold tracking-wider">{missionElapsedTime}</span>
        </div>
      </div>

      {/* Search Input & Actions */}
      <div className="flex items-center space-x-3">
        {/* Live NORAD CelesTrak Sync Button */}
        {onLiveSync && (
          <button
            onClick={onLiveSync}
            disabled={isSyncingLive}
            title="Sync live orbital TLE data directly from NORAD / CelesTrak API"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono text-xs transition shadow-lg shadow-cyan-950/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncingLive ? 'animate-spin' : ''}`} />
            <span className="font-bold uppercase tracking-wider text-[10px]">
              {isSyncingLive ? 'SYNCING NORAD...' : 'LIVE SATELLITES SYNC'}
            </span>
          </button>
        )}

        {/* Universal Search */}
        <div className="relative w-36 sm:w-56 md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search NORAD, Sat, Debris..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 font-mono transition-all"
          />
        </div>

        {/* Mute Audio Alerts */}
        <button
          onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
          title={audioAlertsEnabled ? 'Disable Alarm Audio' : 'Enable Alarm Audio'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition"
        >
          {audioAlertsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 relative transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 backdrop-blur-2xl bg-slate-950/95 border border-slate-800 rounded-xl p-4 shadow-2xl shadow-cyan-950/50 z-50 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> MISSION ALERTS
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  3 ACTIVE
                </span>
              </div>
              <div className="space-y-2.5 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200">
                  <div className="font-bold text-rose-400 flex items-center justify-between">
                    <span>CRITICAL CONJUNCTION</span>
                    <span className="text-[9px] opacity-75">T-14m</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-300">
                    CARTOSAT-3 / COSMOS 2251 DEBRIS #12 (88.4% prob)
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200">
                  <div className="font-bold text-amber-400 flex items-center justify-between">
                    <span>SOLAR FLARE WARNING</span>
                    <span className="text-[9px] opacity-75">Active</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-300">
                    M2.8 Class flare from Sunspot AR3380. KP-Index = 5.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Role & Login Modal Trigger */}
        <button
          onClick={onOpenAuth}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 px-3 py-1.5 rounded-xl transition text-xs"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-bold text-[10px]">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-medium text-slate-200 leading-tight">
              {currentUser.username}
            </div>
            <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-wide">
              {currentUser.role}
            </div>
          </div>
          <Shield className="w-3.5 h-3.5 text-purple-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
};
