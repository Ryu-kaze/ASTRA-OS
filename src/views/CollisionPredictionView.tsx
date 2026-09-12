import React, { useState } from 'react';
import { Satellite, DebrisObject, CollisionPrediction } from '../types';
import {
  Flame,
  Satellite as SatIcon,
  ShieldAlert,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  Play,
} from 'lucide-react';

interface CollisionPredictionViewProps {
  satellites: Satellite[];
  debris: DebrisObject[];
}

export const CollisionPredictionView: React.FC<CollisionPredictionViewProps> = ({
  satellites,
  debris,
}) => {
  const [selectedSatA, setSelectedSatA] = useState<string>(satellites[0]?.id || 'SAT-40037');
  const [selectedTarget, setSelectedTarget] = useState<string>(debris[11]?.id || 'DEB-80012');
  const [prediction, setPrediction] = useState<CollisionPrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/collision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          satelliteAId: selectedSatA,
          targetId: selectedTarget,
        }),
      });
      const data = await res.json();
      setPrediction(data);
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
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
              <Flame className="w-6 h-6 text-rose-500 animate-pulse" /> MODULE 3: AI COLLISION PREDICTION
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-500/30 uppercase">
              CORE ML CLASSIFIER
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            PREDICTS CONJUNCTION PROBABILITIES, TCA COUNTDOWNS, & AVOIDANCE MANEUVER DELTA-V
          </p>
        </div>
      </div>

      {/* Target Selector Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> SELECT CONJUNCTION OBJECT PAIR
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Satellite A Picker */}
          <div>
            <label className="block text-slate-400 font-mono text-xs mb-2 uppercase">
              PRIMARY SATELLITE (OBJECT A)
            </label>
            <select
              value={selectedSatA}
              onChange={(e) => setSelectedSatA(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
            >
              {satellites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (NORAD {s.noradId}) - {s.orbitType} {s.altitude}km
                </option>
              ))}
            </select>
          </div>

          {/* Target B Picker */}
          <div>
            <label className="block text-slate-400 font-mono text-xs mb-2 uppercase">
              TARGET OBJECT / DEBRIS (OBJECT B)
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
            >
              <optgroup label="TRACKED SPACE DEBRIS">
                {debris.slice(0, 30).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} (Cat #{d.catalogId}) - {d.size}
                  </option>
                ))}
              </optgroup>
              <optgroup label="OTHER ACTIVE SATELLITES">
                {satellites.slice(1, 15).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (NORAD {s.noradId})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-500 hover:from-rose-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-rose-950/50"
        >
          {loading ? (
            <span>RUNNING RANDOM FOREST ML CLASSIFIER MODEL...</span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>PREDICT CONJUNCTION & CALCULATE MANEUVER</span>
            </>
          )}
        </button>
      </div>

      {/* Prediction Results Display */}
      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Main Risk Gauge */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                  CONJUNCTION PROBABILITY (P_c)
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                  CARA / NASA Standard
                </span>
              </div>

              <div className="flex items-baseline space-x-3 mt-2">
                <span
                  className={`text-4xl sm:text-5xl font-black ${
                    prediction.riskLevel === 'CRITICAL'
                      ? 'text-rose-500'
                      : prediction.riskLevel === 'HIGH'
                      ? 'text-amber-400'
                      : prediction.riskLevel === 'MODERATE'
                      ? 'text-cyan-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {prediction.probability >= 0.001
                    ? `${prediction.probability.toFixed(3)}%`
                    : `${prediction.probability.toFixed(5)}%`}
                </span>

                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                    prediction.riskLevel === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse'
                      : prediction.riskLevel === 'HIGH'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      : prediction.riskLevel === 'MODERATE'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {prediction.riskLevel} RISK
                </span>
              </div>

              {/* Odds Ratio Calculation */}
              <div className="mt-2 text-xs font-mono text-slate-300 flex items-center space-x-2">
                <span className="text-slate-400">ESTIMATED ODDS:</span>
                <span className="font-bold text-amber-300">
                  {prediction.probability > 0
                    ? `1 in ${Math.round(100 / prediction.probability).toLocaleString()} chance`
                    : '< 1 in 1,000,000 chance'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex justify-between text-slate-400">
                <span>TIME TO CLOSEST APPROACH (TCA):</span>
                <span className="text-cyan-300 font-bold">{prediction.timeUntilEncounterSeconds} seconds</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>MINIMUM MISS DISTANCE:</span>
                <span className="text-purple-300 font-bold">
                  {prediction.minimumDistanceKm < 1
                    ? `${(prediction.minimumDistanceKm * 1000).toFixed(0)} meters (${prediction.minimumDistanceKm} km)`
                    : `${prediction.minimumDistanceKm} km`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>MODEL CONFIDENCE SCORE:</span>
                <span className="text-emerald-400 font-bold">{prediction.confidenceScore}%</span>
              </div>
            </div>
          </div>

          {/* AI Recommended Avoidance Maneuver & CARA Standards */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-cyan-400" /> AI RECOMMENDED AVOIDANCE MANEUVER
              </h3>

              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs leading-relaxed">
                <p className="font-bold text-cyan-300 mb-1">MANEUVER COMMAND:</p>
                <p className="font-sans text-sm">{prediction.recommendedManeuver}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">DELTA-V REQUIRED</span>
                  <span className="text-base font-bold text-cyan-300">{prediction.deltaVRequired} m/s</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">ESTIMATED FUEL COST</span>
                  <span className="text-base font-bold text-amber-400">{prediction.fuelCostKg} kg Hydrazine</span>
                </div>
              </div>
            </div>

            {/* Aerospace Industry Reference Note */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-300">NASA & USSF Conjunction Thresholds:</strong> In spaceflight, $P_c \ge 0.01\%$ (1 in 10,000) triggers mandatory maneuver planning. Probabilities $\ge 0.1\%$ (1 in 1,000) are emergency conjunctions requiring immediate burn execution.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
