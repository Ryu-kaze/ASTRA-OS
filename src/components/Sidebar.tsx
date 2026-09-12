import React from 'react';
import {
  Globe,
  LayoutDashboard,
  Satellite as SatIcon,
  ShieldAlert,
  Flame,
  Rocket,
  Sun,
  Radio,
  Bot,
  BarChart3,
  AlertTriangle,
  Activity,
  FileText,
  Compass,
  Navigation,
  Play,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule?: (module: string) => void;
  onSelectModule?: (module: string) => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  isOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  onSelectModule,
  collapsed,
  setCollapsed,
  isOpen = true,
  onToggleSidebar,
}) => {
  const handleSelect = (id: string) => {
    if (onSelectModule) {
      onSelectModule(id);
    } else if (setActiveModule) {
      setActiveModule(id);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home Landing', icon: Globe, badge: null },
    { id: 'dashboard', label: 'Mission Control', icon: LayoutDashboard, badge: null },
    { id: 'satellites', label: '1. Live Satellites', icon: SatIcon, badge: '100' },
    { id: 'debris', label: '2. Space Debris', icon: ShieldAlert, badge: '500' },
    { id: 'collision', label: '3. AI Collision ML', icon: Flame, badge: 'HOT' },
    { id: 'launch', label: '4. Launch Window', icon: Rocket, badge: null },
    { id: 'weather', label: '5. Space Weather', icon: Sun, badge: 'G1' },
    { id: 'ground', label: '6. Ground Stations', icon: Radio, badge: '6' },
    { id: 'copilot', label: '7. AI Copilot Chat', icon: Bot, badge: 'AI' },
    { id: 'analytics', label: '8. Mission Analytics', icon: BarChart3, badge: null },
    { id: 'anomaly', label: '9. Anomaly Detection', icon: AlertTriangle, badge: '3' },
    { id: 'health', label: '10. Satellite Health', icon: Activity, badge: null },
    { id: 'report', label: '11. PDF Report Gen', icon: FileText, badge: 'PDF' },
    { id: 'earth3d', label: '12. 3D Earth Globe', icon: Compass, badge: '3D' },
    { id: 'traffic', label: '13. Orbital Traffic', icon: Navigation, badge: null },
    { id: 'simulation', label: '14. Mission Sandbox', icon: Play, badge: 'SIM' },
  ];

  // If collapsed prop is provided, use it; otherwise infer collapsed state from isOpen
  const isCollapsed = collapsed !== undefined ? collapsed : !isOpen;

  const handleToggle = () => {
    if (setCollapsed) {
      setCollapsed(!isCollapsed);
    } else if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <aside
      className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
        isOpen === false
          ? '-translate-x-full lg:translate-x-0 lg:w-16'
          : isCollapsed
          ? 'w-16'
          : 'w-64'
      }`}
    >
      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeModule === item.id ||
            (activeModule === 'ground-stations' && item.id === 'ground') ||
            (activeModule === '3d-earth' && item.id === 'earth3d');

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-slate-800'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate tracking-wide text-left flex-1 font-sans">
                  {item.label}
                </span>
              )}

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                    item.badge === 'HOT' || item.badge === '3'
                      ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      : item.badge === 'AI' || item.badge === '3D'
                      ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Glowing Indicator bar for active module */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r shadow-[0_0_10px_#00f2ff]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Collapse Toggle Button */}
      <div className="p-2 border-t border-slate-800/80 bg-slate-950/60">
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-center py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && (
            <span className="ml-2 text-xs font-mono uppercase tracking-wider">COLLAPSE SIDEBAR</span>
          )}
        </button>
      </div>
    </aside>
  );
};
