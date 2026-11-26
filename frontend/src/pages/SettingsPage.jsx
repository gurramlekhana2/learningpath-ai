import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Cpu,
  Flame,
  Brain,
  Database,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [department, setDepartment] = useState(user?.department || 'Engineering');
  const [currentRole, setCurrentRole] = useState(user?.current_role || 'Software Developer');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'AI Engineer');
  const [weeklyHours, setWeeklyHours] = useState(user?.weekly_hours_available || 6);

  const [notifMarket, setNotifMarket] = useState(true);
  const [notifObsolescence, setNotifObsolescence] = useState(true);
  const [notifRoadmap, setNotifRoadmap] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [healthInfo, setHealthInfo] = useState(null);

  useEffect(() => {
    api.getHealth().then(setHealthInfo).catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = {
        full_name: fullName,
        department,
        current_role: currentRole,
        target_role: targetRole,
        weekly_hours_available: parseInt(weeklyHours)
      };
      const updatedUser = await api.updateProfile(updates);
      updateUser(updatedUser);
      setSaveSuccess('Profile and preferences updated successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">
            <SettingsIcon className="w-4 h-4" />
            Platform & Preferences
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, notification triggers, and inspect AI integrations.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Main Profile & Preferences Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-violet-400" />
            Employee Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Corporate Email</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Job Role</label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Career Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Weekly Learning Commitment:{' '}
              <span className="text-violet-400 font-bold">{weeklyHours} hours/week</span>
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(e.target.value)}
              className="w-full accent-violet-600"
            />
          </div>
        </div>

        {/* Notifications Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-violet-400" />
            Intelligent Notification Triggers
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Market Trend Surges (Firecrawl)</span>
                <span className="text-[11px] text-slate-400">
                  Notify me when a new skill surges over 100% in quarterly requisitions
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifMarket}
                onChange={(e) => setNotifMarket(e.target.checked)}
                className="w-4 h-4 accent-violet-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Skill Obsolescence Warnings</span>
                <span className="text-[11px] text-slate-400">
                  Alert me when a skill I possess begins experiencing market contraction
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifObsolescence}
                onChange={(e) => setNotifObsolescence(e.target.checked)}
                className="w-4 h-4 accent-violet-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Roadmap Evolution Nudges</span>
                <span className="text-[11px] text-slate-400">
                  Notify when completed milestones make next-level certifications available
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifRoadmap}
                onChange={(e) => setNotifRoadmap(e.target.checked)}
                className="w-4 h-4 accent-violet-600"
              />
            </label>
          </div>
        </div>

        {/* Integration Status Cards */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            Core AI Integrations & Telemetry
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Firecrawl */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" /> Firecrawl Web Crawler
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {healthInfo?.firecrawl_live_connected ? 'Live API Active' : 'Verified Corpus Mode'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connects to https://api.firecrawl.dev/v1. Extracts public certifications, job posts, and tech benchmarks.
              </p>
            </div>

            {/* Memento */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-cyan-400" /> Memento Memory Layer
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                  Bitemporal Hybrid
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Persistent graph memory tracking valid time vs transaction time, completed modules, and prior advice.
              </p>
            </div>

            {/* LLM Engine */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-violet-400" /> GenAI Reasoning Engine
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                  {healthInfo?.llm_cloud_connected ? 'Cloud LLM Active' : 'Adaptive Domain Engine'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Fuses Firecrawl market signals with Memento memory to generate evolving roadmaps and power the AI Mentor.
              </p>
            </div>

            {/* Database */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-400" /> Database Engine
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {healthInfo?.database_mode || 'Persistent DocumentDB'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Stores persistent employee profiles, skill records, weekly milestones, and learning history.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-violet-900/40"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
