import React from 'react';
import { Globe, Layers, Eye } from 'lucide-react';
import { ThreeEarth } from '../components/ThreeEarth';
import { Satellite, DebrisObject } from '../types';

interface Earth3DViewProps {
  satellites: Satellite[];
  debris: DebrisObject[];
}

export const Earth3DView: React.FC<Earth3DViewProps> = ({ satellites, debris }) => {
  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400" /> MODULE 12: 3D EARTH GLOBE VISUALIZATION
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            INTERACTIVE THREE.JS ORBITAL GLOBE, DEBRIS CLOUDS & REAL-TIME TRAJECTORY TRAILS
          </p>
        </div>
      </div>

      {/* Main Large 3D Earth Canvas */}
      <div className="p-2 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl">
        <ThreeEarth satellites={satellites} debris={debris} height="650px" showOrbits={true} />
      </div>
    </div>
  );
};
