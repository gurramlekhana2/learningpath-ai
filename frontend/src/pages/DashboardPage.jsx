import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Target,
  Cpu,
  Milestone,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Brain,
  ShieldCheck,
  RefreshCw,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = ({ setActiveTab, onOpenDiffModal }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardAnalytics();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
          <p className="text-sm">Synthesizing real-time workforce intelligence...</p>
        </div>
      </div>
    );
  }

  const readinessScore = dashboardData?.career_readiness_score || 62.5;
  const roadmap = dashboardData?.active_roadmap;
  const nextAction = dashboardData?.recommended_next_action;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-900 border border-violet-800/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold mb-2 border border-violet-500/30">
            <Sparkles className="w-3 h-3 text-violet-400" />
            Adaptive Intelligence Active
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {user?.full_name || 'Engineer'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking your trajectory from <strong>{user?.current_role || 'Developer'}</strong> to{' '}
            <strong className="text-violet-300">{user?.target_role || 'AI Engineer'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('twin')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/40 transition flex items-center gap-2"
          >
            <Cpu className="w-4 h-4" />
            <span>My Digital Twin</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition flex items-center gap-2"
          >
            <span>Resume Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenDiffModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition"
          >
            Compare Evolution Diff
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Score */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Career Readiness</span>
            <Target className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{readinessScore}%</span>
            <span className="text-[11px] font-semibold text-emerald-400">+12% this month</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
              style={{ width: `${readinessScore}%` }}
            ></div>
          </div>
        </div>

        {/* Skill Score */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Skill Competency Score</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{dashboardData?.overall_skill_score || 70}%</span>
            <span className="text-[11px] text-slate-400">across target matrix</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            {dashboardData?.proficient_skills_count || 3} verified proficient skills
          </p>
        </div>

        {/* Missing Skill Gaps */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Critical Skill Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{dashboardData?.missing_skills_count || 4}</span>
            <span className="text-[11px] font-semibold text-amber-400">Requiring Attention</span>
          </div>
          <button
            onClick={() => setActiveTab('skills')}
            className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold mt-3 flex items-center gap-1"
          >
            Review granular gaps <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Roadmap Progress */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Curriculum Progress</span>
            <Milestone className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{roadmap?.progress_percentage || 0}%</span>
            <span className="text-[11px] text-slate-400">
              {roadmap?.completed_milestones || 0}/{roadmap?.total_milestones || 8} weeks
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${roadmap?.progress_percentage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Action & Emerging Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recommended Next Action & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Highlighted Recommended Action */}
          {nextAction && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-violet-800/40 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommended Next Action
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ~{nextAction.estimated_hours} hours
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{nextAction.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{nextAction.description}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition flex items-center gap-2 shadow-md shadow-violet-900/30"
                >
                  <span>Start Module Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('mentor')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  Ask AI Mentor About This
                </button>
              </div>
            </div>
          )}

          {/* Upcoming Learning Milestones */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Upcoming Learning Milestones</h3>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
              >
                View full timeline
              </button>
            </div>

            <div className="space-y-3">
              {dashboardData?.upcoming_milestones?.map((m) => (
                <div
                  key={m.week_number}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 font-bold text-xs flex items-center justify-center">
                      W{m.week_number}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{m.title}</h4>
                      <p className="text-[10px] text-slate-400">Focus: {m.focus_skill}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 capitalize">
                    {m.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Firecrawl Emerging Skills & AI Insights */}
        <div className="space-y-6">
          {/* Emerging Industry Skills (Firecrawl) */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Trending in Industry</h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-semibold">
                Firecrawl
              </span>
            </div>

            <div className="space-y-3">
              {dashboardData?.emerging_industry_skills?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">+{item.growth}%</span>
                    <span className="text-[10px] text-slate-300 block">Demand: {item.demand_score}/100</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('industry')}
              className="w-full mt-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition text-center"
            >
              Explore Live Intelligence Dashboard
            </button>
          </div>

          {/* Recent AI Insights (Fused Memory + Market) */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Memento Memory Insights</h3>
            </div>
            <div className="space-y-2.5">
              {dashboardData?.recent_ai_insights?.map((insight, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300 leading-relaxed">
                  {insight}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Retained memories:</span>
              <span className="text-cyan-400 font-bold">{dashboardData?.memento_memory_count || 4} facts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
