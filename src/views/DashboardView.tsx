import React from 'react';
import {
  Satellite as SatIcon,
  ShieldAlert,
  Flame,
  Sun,
  Activity,
  Sparkles,
  TrendingUp,
  Clock,
  Radio,
  ArrowUpRight,
} from 'lucide-react';
import { Satellite, DebrisObject, SpaceWeatherReport } from '../types';

interface DashboardViewProps {
  satellites: Satellite[];
  debris: DebrisObject[];
  weather: SpaceWeatherReport | null;
  onNavigate: (module: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  satellites,
  debris,
  weather,
  onNavigate,
}) => {
  const activeSats = satellites.filter((s) => s.status === 'Active' || s.status === 'Nominal');
  const criticalSats = satellites.filter((s) => s.status === 'Critical' || s.status === 'Warning');
  const criticalDebris = debris.filter((d) => d.riskLevel === 'CRITICAL');

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-mono">
              MISSION CONTROL DASHBOARD
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              ● REAL-TIME TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            MONITORING 1,248 SATELLITES & 500+ TRACKED CONJUNCTION FRAGMENTS
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={() => onNavigate('collision')}
            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold flex items-center space-x-2 transition"
          >
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>3 Critical Threats</span>
          </button>
          <button
            onClick={() => onNavigate('copilot')}
            className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold flex items-center space-x-2 transition"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('satellites')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition shadow-xl group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">ACTIVE SATELLITES</span>
            <SatIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{activeSats.length}</div>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">
            {satellites.length} Total Registered
          </p>
        </div>

        <div
          onClick={() => onNavigate('debris')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition shadow-xl group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">OBJECTS IN ORBIT</span>
            <ShieldAlert className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-black text-amber-300 font-mono">{debris.length}</div>
          <p className="text-[10px] text-amber-400 font-mono mt-1">
            {criticalDebris.length} High Risk Fragments
          </p>
        </div>

        <div
          onClick={() => onNavigate('collision')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition shadow-xl group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">COLLISION ALERTS</span>
            <Flame className="w-4 h-4 text-rose-500 animate-pulse group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono">03</div>
          <p className="text-[10px] text-rose-400 font-mono mt-1">
            Action Recommended T-120s
          </p>
        </div>

        <div
          onClick={() => onNavigate('weather')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-yellow-500/50 cursor-pointer transition shadow-xl group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">SOLAR WEATHER</span>
            <Sun className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-black text-yellow-300 font-mono">
            KP-{weather ? weather.kpIndex : 5}
          </div>
          <p className="text-[10px] text-yellow-400 font-mono mt-1">
            {weather ? weather.kpStatus : 'MINOR STORM'}
          </p>
        </div>
      </div>

      {/* AI Recommendations & Live Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Recommendations Feed */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> AI MISSION RECOMMENDATIONS
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              AUTONOMOUS ML
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span>CARTOSAT-3 Avoidance</span>
                <span className="text-[10px] text-rose-400">CRITICAL</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Fire RCS thrusters (+0.25 m/s) at T-120s to increase clearance from COSMOS 2251 debris by +3.5 km.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-purple-300 font-bold">
                <span>INSAT-3DR Thermal Management</span>
                <span className="text-[10px] text-amber-400">MODERATE</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Re-orient solar array pitch angle by -12° to offset thermal solar flare radiation spike.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span>ISTRAC Ground Pass</span>
                <span className="text-[10px] text-emerald-400">NOMINAL</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                S-Band telemetry link with Bengaluru station opening in T-12 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Live Telemetry Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> LIVE SATELLITE TELEMETRY FEED
              </h3>
            </div>
            <button
              onClick={() => onNavigate('satellites')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              <span>View All 100</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Satellite Name</th>
                  <th className="py-2.5 px-3">NORAD ID</th>
                  <th className="py-2.5 px-3">Altitude</th>
                  <th className="py-2.5 px-3">Velocity</th>
                  <th className="py-2.5 px-3">Battery</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {satellites.slice(0, 7).map((sat) => (
                  <tr key={sat.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                      <SatIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{sat.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{sat.noradId}</td>
                    <td className="py-2.5 px-3">{sat.altitude} km</td>
                    <td className="py-2.5 px-3">{sat.velocity} km/s</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full ${
                              sat.batteryLevel < 40 ? 'bg-rose-500' : 'bg-cyan-400'
                            }`}
                            style={{ width: `${sat.batteryLevel}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">{sat.batteryLevel}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sat.status === 'Critical'
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse'
                            : sat.status === 'Warning'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {sat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
