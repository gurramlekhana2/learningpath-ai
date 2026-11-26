import React, { useState, useEffect } from 'react';
import {
  Users2,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  Send,
  ShieldCheck,
  Building,
  CheckCircle2,
  RefreshCw,
  Plus,
  Cpu,
  Layers,
  Flame,
  FileSpreadsheet,
  Download,
  Filter,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const HRDashboardPage = () => {
  const { user, role, quickDemoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('digital-twin'); // 'overview' | 'digital-twin'
  const [hrData, setHrData] = useState(null);
  const [workforceTwin, setWorkforceTwin] = useState(null);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [initiativeTitle, setInitiativeTitle] = useState('GenAI & RAG Workforce Upskilling Sprint 2026');
  const [initiativeDept, setInitiativeDept] = useState('Engineering');
  const [dispatchSuccess, setDispatchSuccess] = useState('');

  const isHROrAdmin = role === 'hr_manager' || role === 'learning_admin';

  useEffect(() => {
    if (isHROrAdmin) {
      loadHRData();
    } else {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (isHROrAdmin) {
      loadWorkforceTwin(selectedDept);
    }
  }, [selectedDept]);

  const loadHRData = async () => {
    setLoading(true);
    try {
      const [dash, empList, twin] = await Promise.all([
        api.getHRDashboard(),
        api.getHREmployees(),
        api.getWorkforceDigitalTwin('ALL')
      ]);
      setHrData(dash);
      setEmployees(empList.employees || []);
      setWorkforceTwin(twin);
    } catch (err) {
      console.error('Failed to load HR data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkforceTwin = async (dept) => {
    try {
      const twin = await api.getWorkforceDigitalTwin(dept);
      setWorkforceTwin(twin);
    } catch (err) {
      console.error('Failed to filter workforce twin:', err);
    }
  };

  const handleDispatchInitiative = async (e) => {
    e.preventDefault();
    try {
      const res = await api.recommendHRProgram({
        initiative_title: initiativeTitle,
        department: initiativeDept
      });
      setShowRecommendModal(false);
      setDispatchSuccess(res.message);
      setTimeout(() => setDispatchSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to dispatch recommendation:', err);
    }
  };

  if (!isHROrAdmin) {
    return (
      <div className="p-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">HR & Leadership Authorization Required</h2>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed">
          The HR Management Suite displays department-wide competency shortages, organization readiness scores, and workforce analytics. You are currently logged in as an <strong>Employee</strong>.
        </p>
        <button
          onClick={() => quickDemoLogin('hr_manager')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/40"
        >
          Switch to HR Manager Profile (Sarah Jenkins)
        </button>
      </div>
    );
  }

  const summary = hrData?.summary || {};
  const deptGaps = hrData?.department_skill_gaps || [];

  const twinSummary = workforceTwin?.summary || {};
  const skillDist = workforceTwin?.skill_distribution || [];
  const heatmap = workforceTwin?.department_heatmap || [];
  const skillGapMatrix = workforceTwin?.skill_gap_matrix || [];
  const readinessDist = workforceTwin?.readiness_distribution || [];

  const getHeatmapColor = (score) => {
    if (score >= 85) return 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40';
    if (score >= 70) return 'bg-cyan-500/25 text-cyan-300 border-cyan-500/30';
    if (score >= 50) return 'bg-amber-500/25 text-amber-300 border-amber-500/30';
    return 'bg-rose-500/25 text-rose-300 border-rose-500/30';
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users2 className="w-4 h-4" />
            HR Workforce Suite & Talent Analytics
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organization Workforce Health</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor organizational skill shortages, employee progress, and analyze the Enterprise Workforce Digital Twin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sub-tab Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('digital-twin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'digital-twin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Workforce Digital Twin</span>
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Overview & Telemetry</span>
            </button>
          </div>

          <button
            onClick={() => setShowRecommendModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-2 shadow-lg shadow-emerald-950/30"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Recommend Initiative</span>
          </button>
        </div>
      </div>

      {dispatchSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{dispatchSuccess}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
          <p className="text-sm">Aggregating enterprise talent competencies...</p>
        </div>
      ) : activeTab === 'digital-twin' ? (
        /* ================= SECTION 4: ORGANIZATIONAL WORKFORCE DIGITAL TWIN ================= */
        <div className="space-y-6">
          {/* Controls: Department Filter */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Department Slice Filter:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Departments (Entire Organization)</option>
                <option value="Engineering">Engineering</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Product Management">Product Management</option>
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Monitored: <strong className="text-white">{twinSummary.total_monitored_workforce || 18} employees</strong></span>
              <span>•</span>
              <span>Avg Readiness: <strong className="text-emerald-400">{twinSummary.average_organizational_readiness || 64.5}%</strong></span>
            </div>
          </div>

          {/* Department Competency Heatmap Matrix (Section 4 core requirement) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Department Skill Competency Heatmap
                </h3>
                <p className="text-xs text-slate-400">
                  Matrix of department capabilities against the 8 primary professional skill domains (0-100% density).
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/50"></span> &gt;85%</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-cyan-500/50"></span> 70-84%</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/50"></span> 50-69%</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/50"></span> &lt;50%</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="text-left pb-3 pl-2">Department</th>
                    <th className="pb-3">Programming</th>
                    <th className="pb-3">AI & ML</th>
                    <th className="pb-3">Data Science</th>
                    <th className="pb-3">Cloud Comp.</th>
                    <th className="pb-3">DB Mgmt</th>
                    <th className="pb-3">Communication</th>
                    <th className="pb-3">Leadership</th>
                    <th className="pb-3 pr-2">Overall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {heatmap.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20 transition">
                      <td className="text-left py-3.5 pl-2 font-bold text-white flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{row.department}</span>
                      </td>
                      <td className="py-2.5 px-1">
                        <div className={`p-2 rounded-lg border text-xs font-bold ${getHeatmapColor(row.Programming)}`}>
                          {row.Programming}%
                        </div>
                      </td>
                      <td className="py-2.5 px-1">
                        <div className={`p-2 rounded-lg border text-xs font-bold ${getHeatmapColor(row.Artificial_Intelligence)}`}>
                          {row.Artificial_Intelligence}%
                        </div>
                      </td>
                      <td className="py-2.5 px-1">
                        <div className={`p-2 rounded-lg border text-xs font-bold ${getHeatmapColor(row.Data_Science)}`}>
                          {row.Data_Science}%
                        </div>
                      </td>
                      <td className="py-2.5 px-1">
                        <div className={`p-2 rounded-lg border text-xs font-bold ${getHeatmapColor(row.Cloud_Computing)}`}>
                          {row.Cloud_Computing}%
                        </div>
                      </td>
                      <td className="py-2.5 px-1">
                        <div className={`p-2 rounded-lg border text-xs font-bold ${getHeatmapColor(row.Database_Management)}`}>
                          {row.Database_Management}%
                        </div>
                      </td>
                      <td className="py-2.5 px-1">
                        <div className={`p-2 rounded-lg border text-xs font-bold ${getHeatmapColor(row.Communication)}`}>
                          {row.Communication}%
                        </div>
                      </td>
                      <td className="py-2.5 px-1">
                        <div className={`p-2 rounded-lg border text-xs font-bold ${getHeatmapColor(row.Leadership)}`}>
                          {row.Leadership}%
                        </div>
                      </td>
                      <td className="py-2.5 px-1 pr-2">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-extrabold text-emerald-400">
                          {row.avg_readiness}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grid: Workforce Skill Distribution + Readiness Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Employee Skill Distribution Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Total Employee Skill Distribution</h3>
                  <p className="text-xs text-slate-400">Aggregated coverage across technical and professional categories</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillDist} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="category"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Bar dataKey="count" name="Verified Skills" radius={[4, 4, 0, 0]}>
                      {skillDist.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? '#10b981' : '#8b5cf6'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Workforce Readiness Distribution */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Workforce Readiness Distribution</h3>
                <p className="text-xs text-slate-400">Anonymized readiness status breakdown</p>
              </div>

              <div className="space-y-3">
                {readinessDist.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-semibold text-white">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-200">{item.count} staff</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold block mb-0.5">Anonymized Privacy Guard:</span>
                Individual employee names are masked in organizational aggregate reports.
              </div>
            </div>
          </div>

          {/* Organizational Skill Gap Matrix */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Organizational Skill Gap Matrix</h3>
                <p className="text-xs text-slate-400">Identified talent shortages across company workforce</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Critical Competency Gap</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Severity</th>
                    <th className="pb-3">Org Shortage %</th>
                    <th className="pb-3">Affected Employees</th>
                    <th className="pb-3 pr-2">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {skillGapMatrix.map((gap, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 pl-2 font-bold text-white">{gap.skill}</td>
                      <td className="py-3.5 text-slate-300">{gap.category}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            gap.severity === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {gap.severity}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-rose-400">{gap.shortage_pct}%</td>
                      <td className="py-3.5 text-slate-300">{gap.affected_staff} team members</td>
                      <td className="py-3.5 pr-2">
                        <button
                          onClick={() => {
                            setInitiativeTitle(`Corporate Sprint: ${gap.skill}`);
                            setShowRecommendModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition font-semibold text-[11px] border border-emerald-500/30"
                        >
                          Launch Upskill Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= OVERVIEW & INITIATIVES (Existing) ================= */
        <>
          {/* Executive Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Workforce Monitored</span>
              <span className="text-3xl font-extrabold text-white">{summary.total_employees_monitored || 18}</span>
              <span className="text-[11px] text-slate-400 block mt-1">across technical teams</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Avg Workforce Readiness</span>
              <span className="text-3xl font-extrabold text-emerald-400">{summary.average_workforce_readiness || 64.2}%</span>
              <span className="text-[11px] text-slate-400 block mt-1">+8.4% since Q1</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Active Programs</span>
              <span className="text-3xl font-extrabold text-cyan-400">{summary.active_learning_programs || 5}</span>
              <span className="text-[11px] text-slate-400 block mt-1">Targeted roadmaps</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Critical Skill Shortages</span>
              <span className="text-3xl font-extrabold text-amber-400">{summary.skills_at_risk_count || 4}</span>
              <span className="text-[11px] text-slate-400 block mt-1">Requiring talent initiatives</span>
            </div>
          </div>

          {/* Department-Level Skill Shortage Matrix */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Department-Level Skill Shortage Matrix</h3>
                <p className="text-xs text-slate-400">Critical gaps requiring targeted learning interventions</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Department</th>
                    <th className="pb-3">Critical Skill Shortage</th>
                    <th className="pb-3">Severity Level</th>
                    <th className="pb-3">Affected Staff</th>
                    <th className="pb-3 pr-2">Dept Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {deptGaps.map((dept, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 pl-2 font-bold text-white flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dept.department}</span>
                      </td>
                      <td className="py-3.5 font-semibold text-slate-200">{dept.critical_shortage}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dept.shortage_level === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : dept.shortage_level === 'High'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {dept.shortage_level}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-300">{dept.affected_employees} employees</td>
                      <td className="py-3.5 pr-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full"
                              style={{ width: `${dept.readiness}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] font-bold text-white">{dept.readiness}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monitored Employee Roster Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Employee Upskilling Telemetry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Employee</th>
                    <th className="pb-3">Current Role</th>
                    <th className="pb-3">Target Role</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Weekly Commitment</th>
                    <th className="pb-3 pr-2">Readiness Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {employees.map((emp) => (
                    <tr key={emp.id || emp._id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 pl-2 font-bold text-white">
                        {emp.full_name}
                        <span className="text-[10px] text-slate-400 block font-normal">{emp.email}</span>
                      </td>
                      <td className="py-3.5 text-slate-300">{emp.current_role}</td>
                      <td className="py-3.5 font-semibold text-violet-300">{emp.target_role}</td>
                      <td className="py-3.5 text-slate-400">{emp.department}</td>
                      <td className="py-3.5 text-slate-300">{emp.weekly_hours_available || 6} hrs/wk</td>
                      <td className="py-3.5 pr-2">
                        <span className="px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 font-bold border border-violet-500/30">
                          {emp.readiness_score || 62.5}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Recommend Initiative Modal */}
      {showRecommendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Deploy Targeted Upskilling Initiative
            </h3>
            <p className="text-xs text-slate-400">
              Notify employees in the selected department to enroll in this adaptive learning track.
            </p>

            <form onSubmit={handleDispatchInitiative} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initiative Title</label>
                <input
                  type="text"
                  required
                  value={initiativeTitle}
                  onChange={(e) => setInitiativeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Department</label>
                <select
                  value={initiativeDept}
                  onChange={(e) => setInitiativeDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Product Management">Product Management</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecommendModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Deploy Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
