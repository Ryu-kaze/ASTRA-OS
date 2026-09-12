import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AnalyticsView: React.FC = () => {
  // Line Chart Data: Conjunction Alert Trends
  const lineData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'LEO Conjunction Risk Index',
        data: [12, 19, 25, 42, 38, 55, 30],
        borderColor: '#00f2ff',
        backgroundColor: 'rgba(0, 242, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Debris Density Factor',
        data: [8, 14, 18, 22, 30, 28, 24],
        borderColor: '#7000ff',
        backgroundColor: 'rgba(112, 0, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Bar Chart Data: Propellant Fuel Reserves by Orbit
  const barData = {
    labels: ['LEO Satellites', 'MEO Navigation', 'GEO Communications', 'HEO Space Probes'],
    datasets: [
      {
        label: 'Avg Hydrazine Reserve (kg)',
        data: [180, 320, 410, 290],
        backgroundColor: ['rgba(0, 242, 255, 0.7)', 'rgba(112, 0, 255, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)'],
        borderColor: ['#00f2ff', '#7000ff', '#10b981', '#f59e0b'],
        borderWidth: 1,
      },
    ],
  };

  // Doughnut Data: Fleet Operational Availability
  const doughnutData = {
    labels: ['Nominal / Active (92%)', 'Warning State (6%)', 'Critical / Maintenance (2%)'],
    datasets: [
      {
        data: [92, 6, 2],
        backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
        borderColor: '#030712',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'monospace', size: 10 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      y: {
        ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" /> MODULE 8: MISSION ANALYTICS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            FLEET AVAILABILITY GAUGES, PROPELLANT BURN HISTOGRAMS & ORBITAL CONGESTION TRENDS
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] text-slate-500 uppercase block">FLEET AVAILABILITY RATE</span>
          <span className="text-3xl font-black text-emerald-400 mt-1 block">99.1%</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Nominal Operation</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] text-slate-500 uppercase block">MISSION SUCCESS RATE</span>
          <span className="text-3xl font-black text-cyan-300 mt-1 block">98.4%</span>
          <span className="text-[10px] text-cyan-400 mt-1 block">Station-keeping verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] text-slate-500 uppercase block">AVG FUEL BURNT / MONTH</span>
          <span className="text-3xl font-black text-purple-300 mt-1 block">18.4 kg</span>
          <span className="text-[10px] text-purple-400 mt-1 block">Reaction Control System</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] text-slate-500 uppercase block">CONGESTION INDEX</span>
          <span className="text-3xl font-black text-amber-300 mt-1 block">82 / 100</span>
          <span className="text-[10px] text-amber-400 mt-1 block">LEO Shell Alpha Density</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart: Orbital Congestion */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> 24-HOUR CONJUNCTION RISK TREND
          </h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions as any} />
          </div>
        </div>

        {/* Doughnut Chart: Fleet Availability */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-400" /> SATELLITE FLEET STATUS
          </h3>
          <div className="h-52 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'monospace', size: 10 } } } } }} />
          </div>
        </div>

        {/* Bar Chart: Propellant Reserves */}
        <div className="lg:col-span-12 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" /> PROPELLANT FUEL RESERVES BY ORBIT REGION
          </h3>
          <div className="h-60">
            <Bar data={barData} options={chartOptions as any} />
          </div>
        </div>
      </div>
    </div>
  );
};
