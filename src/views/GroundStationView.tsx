import React, { useState, useEffect } from 'react';
import { GroundStation } from '../types';
import { Radio, Signal, Wifi, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const GroundStationView: React.FC = () => {
  const [stations, setStations] = useState<GroundStation[]>([]);

  useEffect(() => {
    fetch('/api/ground-stations')
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" /> MODULE 6: GROUND STATION MONITORING
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            GLOBAL DEEP SPACE NETWORK, SIGNAL STRENGTH (DBM), PASS SCHEDULES & TELEMETRY LINKS
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-lg">
            5 / 6 STATIONS ONLINE
          </span>
        </div>
      </div>

      {/* Ground Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {stations.map((gs) => (
          <div key={gs.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">{gs.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{gs.location}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  gs.status === 'ONLINE'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}
              >
                {gs.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>SIGNAL STRENGTH:</span>
                <span className="text-cyan-300 font-bold">{gs.signalStrengthDbm} dBm</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>FREQUENCY BAND:</span>
                <span className="text-purple-300 font-bold">{gs.frequencyBand}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ACTIVE CONTACT:</span>
                <span className="text-white font-bold">{gs.currentContactSatName || 'STANDBY'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>NEXT PASS SCHEDULE:</span>
                <span className="text-emerald-400 font-bold">{gs.nextPassTimeUTC}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
