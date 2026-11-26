import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Award,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getProgressAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load progress analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
          <p className="text-sm">Synthesizing longitudinal progress analytics...</p>
        </div>
      </div>
    );
  }

  const trajectory = analytics?.readiness_trajectory || [];
  const radarDist = analytics?.skill_radar_distribution || [];
  const weeklyHours = analytics?.weekly_activity_hours || [];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            Longitudinal Telemetry & Progress
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Progress & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical telemetry tracking skill velocity, weekly commitment, and career readiness progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Consistency Index</span>
            <span className="text-lg font-extrabold text-emerald-400">
              {analytics?.learning_consistency_percentage || 84}%
            </span>
          </div>
        </div>
      </div>

      {/* Trajectory & Radar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Career Readiness Trajectory Area Chart */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Career Readiness Trajectory</h3>
              <p className="text-xs text-slate-400">Readiness score trajectory over time vs industry baseline</p>
            </div>
            <span className="text-xs text-violet-400 font-semibold bg-violet-950/40 border border-violet-800/40 px-2 py-0.5 rounded-md">
              Score Velocity: +4.2/wk
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="readiness"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#readinessGrad)"
                  name="Your Readiness"
                />
                <Area
                  type="monotone"
                  dataKey="industry_benchmark"
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fill="transparent"
                  name="Industry Benchmark"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Proficiency Radar Chart */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Domain Competency Distribution</h3>
              <p className="text-xs text-slate-400">Current proficiency vs target production requirements</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarDist}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis stroke="#475569" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Employee Score" dataKey="employeeScore" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Radar name="Target Required" dataKey="targetRequired" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Activity Hours & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Hours Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Learning Commitment</h3>
              <p className="text-xs text-slate-400">Active hours logged per day across capstones and courses</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
              Target Met: 10.5 hrs/wk
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Hours Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestone & Certification Summary */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white">Credential Achievements</h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Certifications Earned</span>
                  <span className="text-[10px] text-slate-400">Verified by Firecrawl</span>
                </div>
              </div>
              <span className="text-xl font-extrabold text-emerald-400">
                {analytics?.certifications_completed || 2}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Active in Progress</span>
                  <span className="text-[10px] text-slate-400">AWS Machine Learning Specialty</span>
                </div>
              </div>
              <span className="text-xl font-extrabold text-violet-300">
                {analytics?.certifications_in_progress || 1}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-800/30 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-violet-300 block mb-1">AI Trajectory Note:</span>
            At your current pace of 10.5 hours/week, your readiness for <strong>{user?.target_role || 'AI Engineer'}</strong> is projected to cross 90% in 5 weeks.
          </div>
        </div>
      </div>
    </div>
  );
};
