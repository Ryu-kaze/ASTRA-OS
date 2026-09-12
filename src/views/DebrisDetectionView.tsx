import React, { useState } from 'react';
import { DebrisObject } from '../types';
import {
  ShieldAlert,
  Search,
  Filter,
  Flame,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface DebrisDetectionViewProps {
  debris: DebrisObject[];
}

export const DebrisDetectionView: React.FC<DebrisDetectionViewProps> = ({ debris }) => {
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  const filtered = debris.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.catalogId.toString().includes(q) ||
      item.origin.toLowerCase().includes(q);

    const matchesRisk = selectedRisk === 'ALL' || item.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedDebris = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" /> MODULE 2: SPACE DEBRIS DETECTION
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            RADAR CROSS SECTION (RCS) INDEX, IMPACT PROBABILITIES & CONJUNCTION THREAT HEATMAP
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-500/30 rounded-lg">
            500 FRAGMENTS TRACKED
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Catalog ID, Debris Cluster Name, Origin..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="md:col-span-4 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedRisk}
            onChange={(e) => {
              setSelectedRisk(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">ALL RISK LEVELS</option>
            <option value="CRITICAL">CRITICAL (&gt;0.10% Prob)</option>
            <option value="HIGH">HIGH (0.01 - 0.10% Prob)</option>
            <option value="MODERATE">MODERATE (0.001 - 0.01% Prob)</option>
            <option value="LOW">LOW (&lt;0.001% Prob)</option>
          </select>
        </div>
      </div>

      {/* Debris Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase bg-slate-950/80">
                <th className="py-3 px-4">Debris Name</th>
                <th className="py-3 px-4">Catalog ID</th>
                <th className="py-3 px-4">RCS Size</th>
                <th className="py-3 px-4">Altitude</th>
                <th className="py-3 px-4">Velocity</th>
                <th className="py-3 px-4">Closest Satellite Threat</th>
                <th className="py-3 px-4">Impact Probability</th>
                <th className="py-3 px-4 text-right">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {paginatedDebris.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3 px-4 text-amber-300">{item.catalogId}</td>
                  <td className="py-3 px-4 text-slate-400">{item.size} ({item.rcs} m²)</td>
                  <td className="py-3 px-4 text-purple-300">{item.altitude} km</td>
                  <td className="py-3 px-4">{item.velocity} km/s</td>
                  <td className="py-3 px-4 text-cyan-300">{item.closestSatelliteName}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full ${
                            item.impactProbability >= 0.10
                              ? 'bg-rose-500'
                              : item.impactProbability >= 0.01
                              ? 'bg-amber-400'
                              : item.impactProbability >= 0.001
                              ? 'bg-cyan-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(5, item.impactProbability * 50))}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-300 font-mono">
                        {item.impactProbability >= 0.001
                          ? `${item.impactProbability.toFixed(3)}%`
                          : `${item.impactProbability.toFixed(4)}%`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.riskLevel === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse'
                          : item.riskLevel === 'HIGH'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 font-mono text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} Fragments
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 hover:border-amber-500/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 hover:border-amber-500/50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
