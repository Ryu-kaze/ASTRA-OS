import React, { useState } from 'react';
import { Satellite, OrbitType } from '../types';
import {
  Satellite as SatIcon,
  Search,
  Filter,
  Info,
  Radio,
  Battery,
  Flame,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface SatelliteTrackingViewProps {
  satellites: Satellite[];
  searchQuery: string;
  onLiveSync?: () => void;
  isSyncingLive?: boolean;
}

export const SatelliteTrackingView: React.FC<SatelliteTrackingViewProps> = ({
  satellites,
  searchQuery,
  onLiveSync,
  isSyncingLive = false,
}) => {
  const [selectedOrbit, setSelectedOrbit] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedSat, setSelectedSat] = useState<Satellite | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  const query = (localSearch || searchQuery).toLowerCase();

  const filtered = satellites.filter((sat) => {
    const matchesSearch =
      sat.name.toLowerCase().includes(query) ||
      sat.noradId.toString().includes(query) ||
      sat.operator.toLowerCase().includes(query) ||
      sat.country.toLowerCase().includes(query);

    const matchesOrbit = selectedOrbit === 'ALL' || sat.orbitType === selectedOrbit;
    const matchesStatus = selectedStatus === 'ALL' || sat.status === selectedStatus;

    return matchesSearch && matchesOrbit && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedSats = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <SatIcon className="w-6 h-6 text-cyan-400" /> MODULE 1: LIVE SATELLITE TRACKING
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            REAL-TIME TELEMETRY, NORAD TLE INDEX, ORBITAL INCLINATIONS & STATUS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {onLiveSync && (
            <button
              onClick={onLiveSync}
              disabled={isSyncingLive}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold flex items-center space-x-2 transition shadow-lg shadow-cyan-950/50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingLive ? 'animate-spin' : ''}`} />
              <span>{isSyncingLive ? 'FETCHING CELESTRAK...' : 'PULL LIVE NORAD TLE DATA'}</span>
            </button>
          )}

          <span className="px-3.5 py-2 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded-xl font-bold">
            TOTAL ACTIVE: {satellites.length}
          </span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter by Name, NORAD ID, Country, Operator..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-3 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedOrbit}
            onChange={(e) => {
              setSelectedOrbit(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">ALL ORBIT TYPES</option>
            <option value="LEO">LEO (Low Earth Orbit)</option>
            <option value="MEO">MEO (Medium Earth Orbit)</option>
            <option value="GEO">GEO (Geostationary Orbit)</option>
            <option value="HEO">HEO (High Earth Orbit)</option>
          </select>
        </div>

        <div className="md:col-span-4 flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="Active">Active / Nominal</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Satellite Data Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase bg-slate-950/80">
                <th className="py-3 px-4">Satellite</th>
                <th className="py-3 px-4">NORAD ID</th>
                <th className="py-3 px-4">Orbit</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4">Altitude</th>
                <th className="py-3 px-4">Velocity</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {paginatedSats.map((sat) => (
                <tr key={sat.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                    <SatIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{sat.name}</span>
                  </td>
                  <td className="py-3 px-4 text-cyan-300">{sat.noradId}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">
                      {sat.orbitType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {sat.latitude > 0 ? `${sat.latitude}°N` : `${Math.abs(sat.latitude)}°S`},{' '}
                    {sat.longitude > 0 ? `${sat.longitude}°E` : `${Math.abs(sat.longitude)}°W`}
                  </td>
                  <td className="py-3 px-4 text-purple-300">{sat.altitude} km</td>
                  <td className="py-3 px-4">{sat.velocity} km/s</td>
                  <td className="py-3 px-4 text-slate-400">{sat.operator}</td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedSat(sat)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[10px] font-bold transition"
                    >
                      TELEMETRY
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 font-mono text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} Satellites
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 hover:border-cyan-500/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 hover:border-cyan-500/50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Satellite Telemetry Drawer Modal */}
      {selectedSat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative font-sans text-slate-100">
            <button
              onClick={() => setSelectedSat(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <SatIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">{selectedSat.name}</h2>
                <p className="text-xs font-mono text-cyan-400">
                  NORAD ID: {selectedSat.noradId} | {selectedSat.operator} ({selectedSat.country})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs mb-6">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">ORBIT TYPE</span>
                <span className="text-sm font-bold text-purple-300">{selectedSat.orbitType}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">ALTITUDE</span>
                <span className="text-sm font-bold text-cyan-300">{selectedSat.altitude} km</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">VELOCITY</span>
                <span className="text-sm font-bold text-white">{selectedSat.velocity} km/s</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">INCLINATION</span>
                <span className="text-sm font-bold text-white">{selectedSat.inclination}°</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">BATTERY HEALTH</span>
                <span className="text-sm font-bold text-emerald-400">{selectedSat.batteryLevel}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">RCS FUEL REMAINING</span>
                <span className="text-sm font-bold text-amber-400">{selectedSat.fuelLevel} kg</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>ESTIMATED LIFE REMAINING:</span>
                <span className="text-cyan-300 font-bold">{selectedSat.estimatedLifeRemainingMonths} Months</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>THERMAL PROTECTION TEMP:</span>
                <span className="text-white font-bold">{selectedSat.temperature} °C</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
