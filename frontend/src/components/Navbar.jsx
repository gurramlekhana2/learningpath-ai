import React, { useState } from 'react';
import {
  Bell,
  Search,
  Sparkles,
  Flame,
  Brain,
  Cpu,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { NotificationPanel } from './NotificationPanel';
import { api } from '../services/api';

export const Navbar = ({ onOpenDiffModal }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');

  const handleGlobalRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.refreshIndustryIntelligence();
      setRefreshMessage('Industry intelligence updated via Firecrawl!');
      setTimeout(() => setRefreshMessage(''), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Target Role & Department Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
          <span className="text-slate-400">Target Role:</span>
          <span className="font-semibold text-violet-300">{user?.target_role || 'AI Engineer'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span>Dept:</span>
          <span className="text-slate-200 font-medium">{user?.department || 'Engineering'}</span>
        </div>

        {refreshMessage && (
          <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md animate-fade-in flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {refreshMessage}
          </span>
        )}
      </div>

      {/* Integration Badges & Controls */}
      <div className="flex items-center gap-3">
        {/* Core Integration Indicators */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <div className="flex items-center gap-1.5 text-orange-400" title="Firecrawl Live Crawler Connected">
            <Flame className="w-3.5 h-3.5" />
            <span className="font-medium text-[11px]">Firecrawl</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-cyan-400" title="Memento Persistent Memory Adapter Active">
            <Brain className="w-3.5 h-3.5" />
            <span className="font-medium text-[11px]">Memento</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-violet-400" title="Generative LLM Reasoning Engine Online">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-medium text-[11px]">GenAI</span>
          </div>
        </div>

        {/* Refresh Industry Intelligence Button */}
        <button
          onClick={handleGlobalRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-violet-500/50 transition"
          title="Trigger live Firecrawl crawl refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Intel</span>
        </button>

        {/* Roadmap Evolution Modal Opener */}
        {onOpenDiffModal && (
          <button
            onClick={onOpenDiffModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Roadmap Evolution</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
        </div>
      </div>
    </header>
  );
};
