import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Target,
  Milestone,
  Radar,
  Globe2,
  BrainCircuit,
  Compass,
  MessageSquareCode,
  TrendingUp,
  Users2,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout, role, quickDemoLogin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'AI Dashboard', icon: LayoutDashboard },
    { id: 'twin', label: 'My Digital Twin', icon: Cpu, badge: 'Twin' },
    { id: 'skills', label: 'Skill Gap Analyzer', icon: Target },
    { id: 'roadmap', label: 'Adaptive Roadmap', icon: Milestone },
    { id: 'radar', label: 'Future Skill Radar', icon: Radar, badge: 'Live' },
    { id: 'industry', label: 'Industry Intelligence', icon: Globe2, badge: 'Firecrawl' },
    { id: 'memory', label: 'AI Memory Center', icon: BrainCircuit, badge: 'Memento' },
    { id: 'simulator', label: 'Career Simulator', icon: Compass },
    { id: 'mentor', label: 'AI Learning Mentor', icon: MessageSquareCode, badge: 'AI' },
    { id: 'analytics', label: 'Progress & Analytics', icon: TrendingUp },
    { id: 'hr', label: 'HR Workforce Suite', icon: Users2, roleRestricted: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Platform Branding */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/30 text-white font-bold">
          <Sparkles className="w-5 h-5 text-violet-200" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-white">LearningPath</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              AI
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Workforce Evolution</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
          Intelligence & Learning
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHR = item.id === 'hr';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Firecrawl'
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : item.badge === 'Memento'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isHR && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    HR
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Role Switcher Demo Tool */}
      <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium mb-1.5 px-1">
          <span>Demo Role Switcher</span>
          <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => quickDemoLogin('employee')}
            className={`py-1 text-[11px] rounded font-medium transition ${
              role === 'employee'
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => quickDemoLogin('hr_manager')}
            className={`py-1 text-[11px] rounded font-medium transition ${
              role === 'hr_manager'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            HR Mgr
          </button>
          <button
            onClick={() => quickDemoLogin('learning_admin')}
            className={`py-1 text-[11px] rounded font-medium transition ${
              role === 'learning_admin'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* User Status Footnote */}
      <div className="p-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
            {user?.full_name ? user.full_name.charAt(0) : 'U'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.full_name || 'User'}</p>
            <p className="text-[10px] text-slate-400 capitalize truncate">{role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
