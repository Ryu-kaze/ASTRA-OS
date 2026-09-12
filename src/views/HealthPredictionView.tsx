import React, { useState, useEffect } from 'react';
import { SatelliteHealth } from '../types';
import { Activity, Battery, Zap, Shield, Heart } from 'lucide-react';

export const HealthPredictionView: React.FC = () => {
  const [healthList, setHealthList] = useState<SatelliteHealth[]>([]);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealthList(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <Heart className="w-6 h-6 text-emerald-400" /> MODULE 10: SATELLITE HEALTH PREDICTION
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            REGRESSION MODELS PREDICTING BATTERY DECAY, FUEL RESERVES, & ESTIMATED REMAINING LIFETIME
          </p>
        </div>
      </div>

      {/* Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {healthList.map((h) => (
          <div key={h.satelliteId} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">{h.satelliteName}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{h.satelliteId}</p>
              </div>
              <span className="text-lg font-black text-emerald-400">{h.componentHealthScore}%</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>BATTERY REMAINING:</span>
                  <span className="text-cyan-300 font-bold">{h.batteryRemainingPct}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-cyan-400 h-full" style={{ width: `${h.batteryRemainingPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>SOLAR ARRAY EFFICIENCY:</span>
                  <span className="text-purple-300 font-bold">{h.solarArrayEfficiencyPct}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-purple-400 h-full" style={{ width: `${h.solarArrayEfficiencyPct}%` }} />
                </div>
              </div>

              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>RCS FUEL REMAINING:</span>
                <span className="text-amber-300 font-bold">{h.fuelRemainingKg} kg</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>COMM LINK QUALITY:</span>
                <span className="text-white font-bold">{h.commLinkQualityDbm} dBm</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>PREDICTED REMAINING LIFETIME:</span>
                <span className="text-emerald-400 font-bold">{h.estimatedRemainingLifetimeYears} Years</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
