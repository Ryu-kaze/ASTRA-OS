import React from 'react';
import { SpaceWeatherReport } from '../types';
import { Sun, Flame, ShieldAlert, Activity, AlertCircle, Sparkles } from 'lucide-react';

interface SpaceWeatherViewProps {
  weather: SpaceWeatherReport | null;
}

export const SpaceWeatherView: React.FC<SpaceWeatherViewProps> = ({ weather }) => {
  if (!weather) return <div className="text-white p-6 font-mono text-xs">Loading Space Weather Data...</div>;

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <Sun className="w-6 h-6 text-yellow-400" /> MODULE 5: SPACE WEATHER FORECASTING
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            SOLAR FLARES, GEOMAGNETIC STORMS, KP INDEX & HIGH ENERGY RADIATION BELTS
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 bg-yellow-950 text-yellow-300 border border-yellow-500/30 rounded-lg font-bold">
            KP INDEX: {weather.kpIndex} ({weather.kpStatus})
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] text-slate-500 uppercase block">SOLAR FLARE CLASS</span>
          <span className="text-3xl font-black text-rose-400 mt-1 block">{weather.solarFlareIntensity}</span>
          <span className="text-[10px] text-rose-400 mt-1 block">Sunspot AR3380 Eruption</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] text-slate-500 uppercase block">SOLAR WIND SPEED</span>
          <span className="text-3xl font-black text-amber-300 mt-1 block">{weather.solarWindSpeedKmS} km/s</span>
          <span className="text-[10px] text-amber-400 mt-1 block">Elevated Particle Flux</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] text-slate-500 uppercase block">GEOMAGNETIC STORM</span>
          <span className="text-3xl font-black text-purple-300 mt-1 block">{weather.geomagneticStormClass}</span>
          <span className="text-[10px] text-purple-400 mt-1 block">Minor Magnetosphere Disturbances</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] text-slate-500 uppercase block">IMPACTED SATELLITES</span>
          <span className="text-3xl font-black text-cyan-300 mt-1 block">{weather.impactedSatellitesCount}</span>
          <span className="text-[10px] text-cyan-400 mt-1 block">LEO Atmospheric Drag Increased</span>
        </div>
      </div>

      {/* Alerts & 24h Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Active Space Weather Advisories */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" /> ACTIVE SPACE WEATHER ADVISORIES
          </h3>

          <div className="space-y-3">
            {weather.alerts.map((alert, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed text-xs">
                ● {alert}
              </div>
            ))}
          </div>
        </div>

        {/* 24h Forecast Timeline */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> 24-HOUR GEOMAGNETIC KP FORECAST
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {weather.forecast24h.map((fc, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] text-slate-500 block">{fc.time}</span>
                <span className={`text-xl font-black block ${fc.kp >= 5 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  KP-{fc.kp}
                </span>
                <span className="text-[9px] text-slate-400 block">{fc.radiation} MeV</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
