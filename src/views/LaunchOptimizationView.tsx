import React, { useState } from 'react';
import { OrbitType, LaunchOptimizationResult } from '../types';
import { Rocket, Calendar, Sun, CheckCircle2, AlertTriangle, Sparkles, Compass } from 'lucide-react';

export const LaunchOptimizationView: React.FC = () => {
  const [siteId, setSiteId] = useState<string>('LS-SDSC');
  const [targetOrbit, setTargetOrbit] = useState<OrbitType>('LEO');
  const [payloadMass, setPayloadMass] = useState<number>(2500);
  const [solarActivity, setSolarActivity] = useState<'Low' | 'Moderate' | 'High' | 'Severe'>('Moderate');
  const [result, setResult] = useState<LaunchOptimizationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          targetOrbit,
          payloadMassKg: payloadMass,
          solarActivityLevel: solarActivity,
          desiredDate: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-400" /> MODULE 4: LAUNCH WINDOW OPTIMIZATION
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            DELTA-V BUDGETING, ATMOSPHERIC DRAG EVALUATION & T-0 WINDOW SCHEDULING
          </p>
        </div>
      </div>

      {/* Input Parameters Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-400 uppercase mb-2">LAUNCH COMPLEX SITE</label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-cyan-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="LS-SDSC">Satish Dhawan Space Centre (ISRO, India)</option>
              <option value="LS-CCAFS">Cape Canaveral Space Force Station (USA)</option>
              <option value="LS-VSFB">Vandenberg Space Force Base (USA)</option>
              <option value="LS-CSG">Guiana Space Centre (Kourou, ESA)</option>
              <option value="LS-BAI">Baikonur Cosmodrome (Kazakhstan)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 uppercase mb-2">TARGET ORBIT TYPE</label>
            <select
              value={targetOrbit}
              onChange={(e) => setTargetOrbit(e.target.value as OrbitType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-purple-300 focus:outline-none focus:border-purple-500"
            >
              <option value="LEO">LEO (Low Earth Orbit 400km)</option>
              <option value="MEO">MEO (Navigation Belt 20,200km)</option>
              <option value="GEO">GEO (Geostationary Ring 35,786km)</option>
              <option value="HEO">HEO (Highly Elliptical / Lunar)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 uppercase mb-2">PAYLOAD MASS (KG)</label>
            <input
              type="number"
              value={payloadMass}
              onChange={(e) => setPayloadMass(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase mb-2">SOLAR WEATHER ACTIVITY</label>
            <select
              value={solarActivity}
              onChange={(e) => setSolarActivity(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-yellow-300 focus:outline-none focus:border-yellow-500"
            >
              <option value="Low">Low Solar Flux (Quiet)</option>
              <option value="Moderate">Moderate Flare Risk</option>
              <option value="High">High Solar Flare Storm</option>
              <option value="Severe">Severe Geomagnetic Storm</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOptimize}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-slate-950 font-extrabold uppercase tracking-wider transition shadow-lg shadow-purple-950/50 mt-4"
        >
          {loading ? 'COMPUTING OPTIMAL T-0 LAUNCH WINDOW...' : 'CALCULATE BEST LAUNCH WINDOW'}
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <span className="text-[10px] text-slate-500 uppercase block">OPTIMAL T-0 WINDOW</span>
            <span className="text-lg font-bold text-cyan-300 mt-1 block">{result.bestLaunchTimeUTC}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Window Duration: {result.windowDurationMinutes} mins</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <span className="text-[10px] text-slate-500 uppercase block">WEATHER FEASIBILITY</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{result.weatherFeasibility}%</span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Upper Wind Shear Nominal</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <span className="text-[10px] text-slate-500 uppercase block">ESTIMATED PROPELLANT</span>
            <span className="text-2xl font-black text-purple-300 mt-1 block">{result.fuelEstimateTons} Tons</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Delta-V: {result.deltaVBudgetMs} m/s</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <span className="text-[10px] text-slate-500 uppercase block">RISK INDEX SCORE</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">{result.riskScore} / 100</span>
            <span className="text-[10px] text-amber-400 mt-1 block">Orbital Congestion Factor</span>
          </div>

          <div className="md:col-span-2 lg:col-span-4 p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 font-sans text-xs text-cyan-200">
            <span className="font-bold text-cyan-300 font-mono block mb-1">AI MISSION ASSISTANT RECOMMENDATION:</span>
            <p className="text-sm leading-relaxed">{result.aiRecommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
