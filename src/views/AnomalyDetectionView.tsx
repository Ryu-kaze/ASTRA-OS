import React, { useState, useEffect } from 'react';
import { AnomalyRecord } from '../types';
import { AlertTriangle, ShieldAlert, Cpu, Zap, CheckCircle2, Flame } from 'lucide-react';

export const AnomalyDetectionView: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>([]);

  useEffect(() => {
    fetch('/api/anomaly')
      .then((res) => res.json())
      .then((data) => setAnomalies(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-500" /> MODULE 9: ANOMALY DETECTION
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            ISOLATION FOREST OUTLIER ENGINE - DETECTS DRIFT, THERMAL SPIKES & BATTERY DEGRADATION
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 bg-rose-950 text-rose-300 border border-rose-500/30 rounded-lg">
            3 CRITICAL ANOMALIES LOGGED
          </span>
        </div>
      </div>

      {/* Anomaly Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {anomalies.map((anom) => (
          <div
            key={anom.id}
            className={`p-6 rounded-2xl border backdrop-blur-xl space-y-4 ${
              anom.severity === 'Critical'
                ? 'bg-rose-950/20 border-rose-500/40'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">{anom.satelliteName}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{anom.id}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  anom.severity === 'Critical'
                    ? 'bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}
              >
                {anom.severity}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>ANOMALY TYPE:</span>
                <span className="text-rose-400 font-bold">{anom.type}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ISOLATION SCORE:</span>
                <span className="text-cyan-300 font-bold">{anom.score} / 1.0</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>TELEMETRY METRIC:</span>
                <span className="text-amber-300 font-bold">{anom.metricValue} (Expected: {anom.expectedValue})</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">ROOT CAUSE:</span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{anom.rootCause}</p>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">RECOMMENDED MITIGATION:</span>
              <p className="text-[11px] text-cyan-200 font-sans leading-relaxed">{anom.recommendedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
