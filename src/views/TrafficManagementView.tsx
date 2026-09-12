import React from 'react';
import { Compass, ShieldAlert, Navigation, ArrowUpRight, Flame } from 'lucide-react';

export const TrafficManagementView: React.FC = () => {
  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" /> MODULE 13: ORBITAL TRAFFIC MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            SPACE TRAFFIC LANES, CONGESTION SHELLS & AUTONOMOUS ROUTING CORRIDORS
          </p>
        </div>
      </div>

      {/* Traffic Shell Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">LEO SHELL ALPHA (400-600KM)</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-500/40">
              HIGH CONGESTION
            </span>
          </div>
          <div className="space-y-2 text-slate-400">
            <div className="flex justify-between">
              <span>ACTIVE SATELLITES:</span>
              <span className="text-white font-bold">842 Objects</span>
            </div>
            <div className="flex justify-between">
              <span>DEBRIS DENSITY:</span>
              <span className="text-amber-300 font-bold">14.2 / km³</span>
            </div>
            <div className="flex justify-between">
              <span>RECOMMENDED ACTION:</span>
              <span className="text-rose-400 font-bold">Altitude Slot Shift +5km</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">MEO SHELL BETA (20,200KM)</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              NOMINAL
            </span>
          </div>
          <div className="space-y-2 text-slate-400">
            <div className="flex justify-between">
              <span>ACTIVE SATELLITES:</span>
              <span className="text-white font-bold">128 Objects</span>
            </div>
            <div className="flex justify-between">
              <span>DEBRIS DENSITY:</span>
              <span className="text-emerald-400 font-bold">1.1 / km³</span>
            </div>
            <div className="flex justify-between">
              <span>RECOMMENDED ACTION:</span>
              <span className="text-emerald-400 font-bold">Maintain Slot</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">GEO RING CHARLIE (35,786KM)</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-500/40">
              MODERATE
            </span>
          </div>
          <div className="space-y-2 text-slate-400">
            <div className="flex justify-between">
              <span>ACTIVE SATELLITES:</span>
              <span className="text-white font-bold">278 Objects</span>
            </div>
            <div className="flex justify-between">
              <span>DEBRIS DENSITY:</span>
              <span className="text-amber-300 font-bold">4.8 / km³</span>
            </div>
            <div className="flex justify-between">
              <span>RECOMMENDED ACTION:</span>
              <span className="text-amber-300 font-bold">East-West Station Keep</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
