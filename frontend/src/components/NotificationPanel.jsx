import React from 'react';
import {
  Bell,
  Check,
  Flame,
  AlertTriangle,
  BrainCircuit,
  Milestone,
  X
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const NotificationPanel = ({ onClose }) => {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'market_trend':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'obsolescence':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'achievement':
        return <BrainCircuit className="w-4 h-4 text-cyan-400" />;
      case 'roadmap':
        return <Milestone className="w-4 h-4 text-violet-400" />;
      default:
        return <Bell className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-white">Intelligent Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] bg-violet-500/20 text-violet-300 font-bold px-1.5 py-0.5 rounded-full border border-violet-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium"
            >
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">No active notifications.</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-3.5 transition cursor-pointer hover:bg-slate-800/40 flex items-start gap-3 ${
                notif.unread ? 'bg-slate-800/20' : ''
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-800/80 shrink-0 mt-0.5 border border-slate-700/60">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{notif.message}</p>
              </div>
              {notif.unread && (
                <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-1.5"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
