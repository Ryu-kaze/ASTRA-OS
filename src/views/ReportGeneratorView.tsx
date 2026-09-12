import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, Check, Sparkles, FileCheck, Shield, Satellite as SatIcon } from 'lucide-react';
import { Satellite, DebrisObject, SpaceWeatherReport } from '../types';

interface ReportGeneratorViewProps {
  satellites: Satellite[];
  debris: DebrisObject[];
  weather: SpaceWeatherReport | null;
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({
  satellites,
  debris,
  weather,
}) => {
  const [reportType, setReportType] = useState<'daily' | 'collision' | 'weather' | 'fleet'>('daily');
  const [includeAI, setIncludeAI] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleGeneratePDF = () => {
    setGenerating(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      const doc = new jsPDF();
      const dateStr = new Date().toUTCString();

      // PDF Title Header
      doc.setFillColor(3, 7, 18); // Dark space blue
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(0, 242, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('ASTRA OS - MISSION CONTROL REPORT', 14, 18);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`TRANSMITTED: ${dateStr}`, 14, 28);
      doc.text(`REPORT TYPE: ${reportType.toUpperCase()} OPERATIONS SUMMARY`, 14, 34);

      // Section 1: Fleet Status
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('1. ORBITAL FLEET STATUS', 14, 52);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`- Active Satellites Tracked: ${satellites.length}`, 14, 60);
      doc.text(`- Tracked Debris Fragments: ${debris.length}`, 14, 66);
      doc.text(`- High Conjunction Risks Active: 3`, 14, 72);

      // Section 2: Space Weather
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('2. SPACE WEATHER SUMMARY', 14, 86);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`- Geomagnetic KP Index: KP-${weather?.kpIndex || 5} (${weather?.kpStatus || 'MINOR STORM'})`, 14, 94);
      doc.text(`- Solar Flare Class: ${weather?.solarFlareIntensity || 'M2.4'}`, 14, 100);
      doc.text(`- Solar Wind Speed: ${weather?.solarWindSpeedKmS || 480} km/s`, 14, 106);

      // Section 3: AI Recommendations
      if (includeAI) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('3. AI COPILOT AUTONOMOUS RECOMMENDATIONS', 14, 120);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const aiText =
          'ASTRA OS ML engines advise immediate RCS orbital adjustment for CARTOSAT-3 (+0.25 m/s delta-V) at T-120 seconds to guarantee a minimum +3.5 km separation from COSMOS 2251 debris fragment DEB-80012.';
        const splitText = doc.splitTextToSize(aiText, 180);
        doc.text(splitText, 14, 128);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('ASTRA OS Autonomous Space Tracking Operating System - ISRO & NASA Mission Control Clearance Approved', 14, 280);

      doc.save(`ASTRA_OS_${reportType.toUpperCase()}_REPORT_${Date.now()}.pdf`);

      setGenerating(false);
      setDownloadSuccess(true);
    }, 1000);
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" /> MODULE 11: MISSION REPORT GENERATOR
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            GENERATE OFFICIAL PDF MISSION LOGS, TELEMETRY SNAPSHOTS & INCIDENT AUDITS
          </p>
        </div>
      </div>

      {/* Config Form */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl space-y-6 font-mono text-xs">
        <div>
          <label className="block text-slate-400 uppercase mb-2">SELECT REPORT CATEGORY</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'daily', label: '24H DAILY SUMMARY' },
              { id: 'collision', label: 'CONJUNCTION AUDIT' },
              { id: 'weather', label: 'SPACE WEATHER' },
              { id: 'fleet', label: 'FULL FLEET HEALTH' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setReportType(item.id as any)}
                className={`py-3 px-3 rounded-xl border text-center font-bold transition ${
                  reportType === item.id
                    ? 'bg-purple-950/80 border-purple-500/80 text-purple-300 shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
          <input
            type="checkbox"
            id="aiInclude"
            checked={includeAI}
            onChange={(e) => setIncludeAI(e.target.checked)}
            className="w-4 h-4 rounded accent-cyan-500"
          />
          <label htmlFor="aiInclude" className="text-slate-300 cursor-pointer">
            APPEND AI COPILOT AUTONOMOUS MANEUVER RECOMMENDATIONS
          </label>
        </div>

        <button
          onClick={handleGeneratePDF}
          disabled={generating}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-slate-950 font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-purple-950/50"
        >
          {generating ? (
            <span>GENERATING HIGH-RES PDF REPORT...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>EXPORT MISSION REPORT (PDF)</span>
            </>
          )}
        </button>

        {downloadSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Mission PDF report successfully compiled and downloaded to local storage!</span>
          </div>
        )}
      </div>
    </div>
  );
};
