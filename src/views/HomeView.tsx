import React from 'react';
import {
  Rocket,
  Satellite as SatIcon,
  ShieldAlert,
  Sun,
  FileText,
  Activity,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { ThreeEarth } from '../components/ThreeEarth';
import { Satellite, DebrisObject, SpaceWeatherReport } from '../types';

interface HomeViewProps {
  satellites: Satellite[];
  debris: DebrisObject[];
  weather: SpaceWeatherReport | null;
  onNavigate: (module: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  satellites,
  debris,
  weather,
  onNavigate,
}) => {
  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800/80 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTONOMOUS ORBITAL GUARDIAN PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              AUTONOMOUS SPACE TRACKING, RESPONSE & ANALYSIS OPERATING SYSTEM
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              ASTRA OS integrates real-time satellite telemetry, scikit-learn ML collision prediction models, 500+ space debris tracking fragments, and AI Copilot guidance for NASA & ISRO mission controllers.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-lg shadow-cyan-500/25"
              >
                <span>Launch Mission Control</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('satellites')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition"
              >
                <SatIcon className="w-4 h-4 text-cyan-400" />
                <span>View Satellites</span>
              </button>

              <button
                onClick={() => onNavigate('report')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Mission Reports</span>
              </button>
            </div>
          </div>

          {/* Hero 3D Earth Preview */}
          <div className="lg:col-span-5">
            <ThreeEarth
              satellites={satellites}
              debris={debris}
              height="380px"
              showOrbits={true}
            />
          </div>
        </div>
      </div>

      {/* Live Statistics Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">ACTIVE SATELLITES</span>
            <SatIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">1,248</div>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">99.1% Operational Nominal</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">TRACKED DEBRIS</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">500+</div>
          <p className="text-[10px] text-amber-400 font-mono mt-1">12 High Conjunction Risks</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">CRITICAL ALERTS</span>
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">03</div>
          <p className="text-[10px] text-rose-400 font-mono mt-1">Collision Mitigation Active</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">SPACE WEATHER</span>
            <Sun className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-yellow-300 font-mono">KP-5</div>
          <p className="text-[10px] text-yellow-400 font-mono mt-1">G1 Minor Geomagnetic Storm</p>
        </div>
      </div>

      {/* Feature Modules Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-wide font-mono flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> ASTRA OS CORE MODULES
          </h2>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
          >
            <span>Open All Modules</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('collision')}
            className="p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
              3. AI Collision Prediction
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Core ML engine powered by Random Forest models evaluating orbital proximity, delta-V avoidance costs, and TCA countdowns.
            </p>
          </div>

          <div
            onClick={() => onNavigate('weather')}
            className="p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
              5. Space Weather Forecasting
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Monitors solar flares, geomagnetic storms, and radiation belts impacting low Earth orbit satellite communication lines.
            </p>
          </div>

          <div
            onClick={() => onNavigate('copilot')}
            className="p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
              7. AI Mission Copilot
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Interactive satellite operations chatbot providing instant orbital mechanics procedures and emergency checklists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
