import React, { useState, useEffect } from 'react';
import {
  Target,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  ExternalLink,
  BookOpen,
  Filter,
  CheckCircle2,
  RefreshCw,
  Flame,
  ArrowRight
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const SkillGapPage = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.target_role || 'AI Engineer');
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [obsolescenceAlerts, setObsolescenceAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const roleOptions = [
    'AI Engineer',
    'Data Scientist',
    'Full Stack Developer',
    'Cloud Engineer'
  ];

  useEffect(() => {
    loadSkillData();
  }, [selectedRole]);

  const loadSkillData = async () => {
    setLoading(true);
    try {
      const [analysis, obs] = await Promise.all([
        api.analyzeSkills(selectedRole),
        api.getSkillObsolescence()
      ]);
      setGapAnalysis(analysis);
      setObsolescenceAlerts(obs.alerts || []);
    } catch (err) {
      console.error('Failed to load skill gap data:', err);
    } finally {
      setLoading(false);
    }
  };

  const gaps = gapAnalysis?.gaps || [];
  const filteredGaps = gaps.filter((g) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'MISSING') return g.gap_status === 'Missing';
    if (filterStatus === 'IN_PROGRESS') return g.gap_status === 'Needs Improvement';
    if (filterStatus === 'PROFICIENT') return g.gap_status === 'Proficient';
    return true;
  });

  // Prepare Chart Data
  const proficiencyWeights = { None: 0, Beginner: 25, Intermediate: 60, Advanced: 85, Expert: 100 };
  const chartData = gaps.map((g) => ({
    skill: g.skill_name.length > 16 ? g.skill_name.substring(0, 14) + '...' : g.skill_name,
    Employee: proficiencyWeights[g.employee_level] || 0,
    Target: proficiencyWeights[g.target_level] || 85,
    Demand: g.industry_demand_score
  }));

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header and Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            Dynamic Skill Gap Intelligence Engine
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Skill Gap Analyzer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Comparing verified profile competencies against live market requisitions indexed by Firecrawl.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Target Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
          <p className="text-sm">Calculating skill gap vectors against {selectedRole} standards...</p>
        </div>
      ) : (
        <>
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Target Readiness</span>
              <span className="text-3xl font-extrabold text-white">{gapAnalysis?.readiness_score || 0}%</span>
              <span className="text-[11px] text-slate-400 block mt-1">Overall role alignment</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Missing Competencies</span>
              <span className="text-3xl font-extrabold text-rose-400">{gapAnalysis?.missing_skills_count || 0}</span>
              <span className="text-[11px] text-slate-400 block mt-1">Require immediate acquisition</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">In Progress</span>
              <span className="text-3xl font-extrabold text-amber-400">{gapAnalysis?.skills_in_progress_count || 0}</span>
              <span className="text-[11px] text-slate-400 block mt-1">Need higher proficiency</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Verified Proficient</span>
              <span className="text-3xl font-extrabold text-emerald-400">{gapAnalysis?.proficient_skills_count || 0}</span>
              <span className="text-[11px] text-slate-400 block mt-1">Meets production standards</span>
            </div>
          </div>

          {/* Interactive Recharts Radar / Comparison Chart */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Competency Benchmark vs Target Requirement</h3>
                <p className="text-xs text-slate-400">Employee current level (0-100) compared to target requirement score</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-violet-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span> Current Level
                </span>
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Target Requirement
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <XAxis dataKey="skill" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="Employee" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Your Level" />
                  <Bar dataKey="Target" fill="#6366f1" radius={[4, 4, 0, 0]} name="Role Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Granular Gaps Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">Prioritized Learning Order</h3>
                <p className="text-xs text-slate-400">Structured by critical priority and real-time market demand</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                {['ALL', 'MISSING', 'IN_PROGRESS', 'PROFICIENT'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      filterStatus === st
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Order</th>
                    <th className="pb-3">Skill / Category</th>
                    <th className="pb-3">Your Level</th>
                    <th className="pb-3">Target Level</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Demand</th>
                    <th className="pb-3 pr-2">Recommended Course</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredGaps.map((g) => (
                    <tr key={g.skill_name} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 pl-2 font-bold text-violet-400">#{g.learning_order}</td>
                      <td className="py-3.5">
                        <span className="font-semibold text-white block">{g.skill_name}</span>
                        <span className="text-[10px] text-slate-400">{g.category}</span>
                      </td>
                      <td className="py-3.5 font-medium text-slate-300">{g.employee_level}</td>
                      <td className="py-3.5 font-semibold text-violet-300">{g.target_level}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            g.gap_status === 'Proficient'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : g.gap_status === 'Needs Improvement'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {g.gap_status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`font-semibold text-[11px] ${
                            g.priority === 'Critical'
                              ? 'text-rose-400'
                              : g.priority === 'High'
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {g.priority}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-400 rounded-full"
                              style={{ width: `${g.industry_demand_score}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-slate-400">{g.industry_demand_score}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-2">
                        {g.recommended_courses?.[0] ? (
                          <a
                            href={g.recommended_courses[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1 text-[11px] truncate max-w-[200px]"
                          >
                            <span className="truncate">{g.recommended_courses[0].title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Differentiator A: Skill Obsolescence Alert */}
          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <TrendingDown className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Novel Feature: Skill Obsolescence Alerts
              </h3>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Based on empirical job post contractions and technology radar publications collected via Firecrawl. Alerts you when skills you may possess or consider are declining in industry relevance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {obsolescenceAlerts.map((alert, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{alert.skill_name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      -{alert.market_drop_percentage}% demand
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{alert.recommendation}</p>
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">Modern Alternatives:</span>
                    <div className="flex flex-wrap gap-1">
                      {alert.replacement_skills?.map((rep, rIdx) => (
                        <span key={rIdx} className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-medium">
                          {rep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
