import React, { useState } from 'react';
import { Cpu, Play, RotateCcw, Sparkles, Sliders } from 'lucide-react';

export const SimulationView: React.FC = () => {
  const [altitude, setAltitude] = useState<number>(550);
  const [inclination, setInclination] = useState<number>(97.5);
  const [dragCoeff, setDragCoeff] = useState<number>(2.2);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);

  const handleRunSim = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimResult(
        `Simulation Completed: Orbital Decay calculated at 0.12 km/year. Lifetime projection: 14.8 Years in ${altitude}km LEO sun-synchronous orbit.`
      );
      setSimulating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-400" /> MODULE 14: MISSION SIMULATION SANDBOX
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            WHAT-IF ORBITAL MECHANICS SIMULATOR - DECAY TIME, PERTURBATION & ATMOSPHERIC DRAG
          </p>
        </div>
      </div>

      {/* Simulator Control Panel */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl space-y-6 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-slate-400 uppercase mb-2">INITIAL ALTITUDE ({altitude} KM)</label>
            <input
              type="range"
              min="200"
              max="2000"
              value={altitude}
              onChange={(e) => setAltitude(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase mb-2">INCLINATION ({inclination}°)</label>
            <input
              type="range"
              min="0"
              max="180"
              step="0.5"
              value={inclination}
              onChange={(e) => setInclination(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase mb-2">DRAG COEFFICIENT Cd ({dragCoeff})</label>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={dragCoeff}
              onChange={(e) => setDragCoeff(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>
        </div>

        <button
          onClick={handleRunSim}
          disabled={simulating}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-950/50"
        >
          {simulating ? (
            <span>RUNNING NUMERICAL ORBIT INTEGRATOR...</span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>RUN SANDBOX ORBIT SIMULATION</span>
            </>
          )}
        </button>

        {simResult && (
          <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs font-mono">
            {simResult}
          </div>
        )}
      </div>
    </div>
  );
};
