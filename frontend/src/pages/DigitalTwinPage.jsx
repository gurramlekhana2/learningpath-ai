import React, { useState, useEffect } from 'react';
import {
  Cpu,
  BrainCircuit,
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Plus,
  ShieldCheck,
  Building,
  GraduationCap,
  Award,
  Zap,
  BookOpen,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Flame,
  FileText
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PROFICIENCY_PERCENT = {
  Beginner: 25,
  Intermediate: 60,
  Advanced: 85,
  Expert: 100,
};

const CATEGORIES = [
  'All',
  'Programming',
  'Artificial Intelligence',
  'Data Science',
  'Cloud Computing',
  'Database Management',
  'Communication',
  'Leadership',
  'Other',
];

export const DigitalTwinPage = () => {
  const { user } = useAuth();
  const [twin, setTwin] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Activity Update Modal State
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [activityType, setActivityType] = useState('skill_added');
  const [skillNameInput, setSkillNameInput] = useState('');
  const [newProficiencyInput, setNewProficiencyInput] = useState('Intermediate');
  const [courseTitleInput, setCourseTitleInput] = useState('');
  const [newTargetRoleInput, setNewTargetRoleInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState('');

  // What-If Simulation State
  const [simSkill, setSimSkill] = useState('Kubernetes');
  const [simProficiency, setSimProficiency] = useState('Advanced');
  const [simCert, setSimCert] = useState('CKA - Certified Kubernetes Administrator');
  const [simHours, setSimHours] = useState(10);
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    loadDigitalTwin();
  }, []);

  const loadDigitalTwin = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [twinRes, histRes] = await Promise.all([
        api.getDigitalTwinProfile(),
        api.getDigitalTwinHistory()
      ]);
      setTwin(twinRes);
      setHistoryData(histRes);
    } catch (err) {
      console.warn('Backend unavailable, activating resilient preview fallback:', err);
      setFetchError('Backend disconnected. Please start backend on port 8000.');
      // Resilient fallback synthesized profile
      setTwin({
        version: 1,
        professional_identity: {
          name: user?.full_name || 'Alex Chen',
          current_designation: user?.current_role || 'Junior Software Developer',
          department: user?.department || 'Engineering',
          experience_level: 'Mid-Level',
          experience_years: user?.experience_years || 2.5,
          target_career_role: user?.target_role || 'AI Engineer',
          career_development_status: 'Active Upskilling'
        },
        readiness: {
          target_role: user?.target_role || 'AI Engineer',
          overall_readiness_percentage: user?.readiness_score || 62.5,
          matching_skills: ['Python', 'FastAPI', 'Git'],
          partially_developed_skills: ['Docker & Containerization'],
          missing_skills: ['RAG Architecture', 'Vector Databases', 'LangChain'],
          explainable_calculation: 'Readiness of 62.5% computed by benchmarking core competency vectors against AI Engineer role requirements.',
          formula_breakdown: { total_target_competencies: 7 }
        },
        skills: [
          { name: 'Python', category: 'Programming', current_proficiency: 'Intermediate', target_proficiency: 'Advanced', industry_relevance: 95, learning_status: 'In Progress', verified: true },
          { name: 'FastAPI', category: 'Programming', current_proficiency: 'Intermediate', target_proficiency: 'Advanced', industry_relevance: 88, learning_status: 'In Progress', verified: true },
          { name: 'Docker & Containerization', category: 'Cloud Computing', current_proficiency: 'Intermediate', target_proficiency: 'Advanced', industry_relevance: 90, learning_status: 'In Progress', verified: true },
          { name: 'Git', category: 'Programming', current_proficiency: 'Advanced', target_proficiency: 'Expert', industry_relevance: 85, learning_status: 'Mastered', verified: true },
          { name: 'RAG Architecture', category: 'Artificial Intelligence', current_proficiency: 'Beginner', target_proficiency: 'Advanced', industry_relevance: 98, learning_status: 'Target Gap', verified: false },
          { name: 'Vector Databases', category: 'Database Management', current_proficiency: 'Beginner', target_proficiency: 'Advanced', industry_relevance: 92, learning_status: 'Target Gap', verified: false }
        ],
        predicted_gaps: [
          { skill_name: 'Agentic Workflows (LangGraph)', demand_nature: 'Observed Industry Demand', severity: 'Critical', rationale: 'Enterprise shift toward multi-agent coordination frameworks.', supporting_sources: ['Firecrawl: Tech Radar Q4'] },
          { skill_name: 'Vector Database Indexing (HNSW)', demand_nature: 'Observed Industry Demand', severity: 'Critical', rationale: 'Production LLM applications require sub-50ms vector query times.', supporting_sources: ['Firecrawl: AI Job Pulse'] },
          { skill_name: 'Model Fine-Tuning (LoRA/QLoRA)', demand_nature: 'Estimated Future Requirement', severity: 'Moderate', rationale: 'Domain-adapted SLMs increasingly favored for cost-effective deployment.', supporting_sources: ['LLM Projection'] }
        ]
      });
      setHistoryData({
        version_history: [
          { version: 1, updated_at: new Date().toISOString(), summary_of_changes: 'Initial Digital Twin synthesized from profile vectors.', previous_readiness: 50.0, new_readiness: 62.5 }
        ],
        memento_memories: [
          { memory_type: 'completed_course', title: 'Completed: Python Object-Oriented Programming', content: 'Finished 20-hour intensive course on Python asynchronous patterns.', created_at: new Date().toISOString(), details: { score: 95, provider: 'Coursera' } },
          { memory_type: 'abandoned_course', title: 'Abandoned: Pure Theoretical Linear Algebra', content: 'Discontinued after module 2 because content lacked applied Python coding exercises.', created_at: new Date().toISOString(), details: { reason: 'Pacing too theoretical' } }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTwin = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = {
        activity_type: activityType,
        skill_name: activityType === 'skill_added' ? skillNameInput : undefined,
        new_proficiency: activityType === 'skill_added' ? newProficiencyInput : undefined,
        completed_course_title: activityType === 'course_completed' ? courseTitleInput : undefined,
        new_target_role: activityType === 'goal_changed' ? newTargetRoleInput : undefined,
      };

      const updated = await api.updateDigitalTwin(payload);
      setTwin(updated);
      setShowUpdateModal(false);
      setUpdateSuccessMsg(`Digital Twin successfully updated to v${updated.version}! AI re-calibrated readiness.`);
      setTimeout(() => setUpdateSuccessMsg(''), 6000);
      
      // Reload history
      const hist = await api.getDigitalTwinHistory();
      setHistoryData(hist);
    } catch (err) {
      console.error('Failed to update digital twin:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    setSimLoading(true);
    try {
      const res = await api.simulateWhatIfScenario({
        skill_to_acquire: simSkill || undefined,
        target_proficiency: simProficiency,
        certification_to_complete: simCert || undefined,
        weekly_hours_budget: Number(simHours),
        scenario_name: `What-If: Acquire ${simSkill} (${simProficiency}) + ${simCert}`,
      });
      setSimResult(res);
    } catch (err) {
      console.error('Failed to run simulation:', err);
    } finally {
      setSimLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-violet-400" />
        <p className="text-sm font-semibold tracking-wide">
          Synthesizing Workforce Digital Twin from Memento & Firecrawl intelligence...
        </p>
      </div>
    );
  }

  const identity = twin?.professional_identity || {};
  const readiness = twin?.readiness || {};
  const skills = twin?.skills || [];
  const predictedGaps = twin?.predicted_gaps || [];
  const versionHistory = historyData?.version_history || [];
  const mementoMemories = historyData?.memento_memories || [];

  // Filter skills by category
  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category?.toLowerCase() === activeCategory.toLowerCase());

  // Radar Data Generation across the 8 categories
  const radarCategories = CATEGORIES.filter(c => c !== 'All');
  const radarData = radarCategories.map((cat) => {
    const catSkills = skills.filter(
      (s) => s.category?.toLowerCase() === cat.toLowerCase()
    );
    const avgScore = catSkills.length
      ? Math.round(
          catSkills.reduce((acc, s) => acc + (PROFICIENCY_PERCENT[s.current_proficiency] || 50), 0) /
            catSkills.length
        )
      : 30; // baseline latent potential
    const targetScore = catSkills.length ? 85 : 70;
    return {
      category: cat.replace(' ', '\n'),
      current: avgScore,
      target: targetScore,
      fullMark: 100,
    };
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* Page Header with Real-Time Synced Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Workforce Digital Twin Engine • Live Bitemporal Sync
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Cpu className="w-7 h-7 text-violet-400" />
            <span>My Digital Twin</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              v{twin?.version || 1}.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            A dynamic, continuously evolving digital model of your professional capabilities, learning history in Memento, and live Firecrawl industry demand benchmarking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition flex items-center gap-2 shadow-lg shadow-violet-900/40"
          >
            <Plus className="w-4 h-4" />
            <span>Record Activity & Sync Twin</span>
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Local Preview Mode:</strong> Backend server on port 8000 is currently offline. Showing synthesized preview model. Start uvicorn on port 8000 to enable live sync.
            </span>
          </div>
          <button
            onClick={loadDigitalTwin}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-bold shrink-0 transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {updateSuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{updateSuccessMsg}</span>
        </motion.div>
      )}

      {/* SECTION A: Professional Identity */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          <span>A. Professional Identity & Digital Twin Representation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Employee</span>
            <p className="text-lg font-bold text-white">{identity.name || user?.full_name}</p>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {identity.department || 'Engineering'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Designation</span>
            <p className="text-base font-semibold text-slate-200">{identity.current_designation || 'Software Developer'}</p>
            <span className="text-xs text-slate-400">
              {identity.experience_level} ({identity.experience_years || 2.5} years exp)
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Target Career Goal</span>
            <p className="text-base font-bold text-violet-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-violet-400" />
              {identity.target_career_role || 'AI Engineer'}
            </p>
            <span className="text-xs text-slate-400">Weekly Commitment: {user?.weekly_hours_available || 8} hrs/wk</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Career Status</span>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                {identity.career_development_status || 'Accelerating'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Twin Fidelity: 98% Memento Sync</p>
          </div>
        </div>
      </div>

      {/* Grid: SECTION D (Career Readiness) + What-If Simulation Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION D: Career Readiness Intelligence */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                D. Explainable Career Readiness Intelligence
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Target: {readiness.target_role}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Visual Gauge */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * (readiness.overall_readiness_percentage || 60)) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{readiness.overall_readiness_percentage || 60}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Readiness</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Calculated from {readiness.formula_breakdown?.total_target_competencies || 7} vectors</p>
            </div>

            {/* Skills Breakdown */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide block mb-1">
                  Matching Verified Skills ({readiness.matching_skills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {readiness.matching_skills?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      ✓ {s}
                    </span>
                  ))}
                  {(!readiness.matching_skills || readiness.matching_skills.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No exact matches yet</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide block mb-1">
                  Partially Developed ({readiness.partially_developed_skills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {readiness.partially_developed_skills?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      ~ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wide block mb-1">
                  Critical Gaps to Close ({readiness.missing_skills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {readiness.missing_skills?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      ✕ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Explainable Calculation Breakdown Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-violet-400 font-semibold text-[11px] uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Transparent AI Scoring Formula</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {readiness.explainable_calculation}
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-[10px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Proficient Weight: <strong>100%</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Needs Improvement Weight: <strong>50%</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Missing Weight: <strong>0%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* SECTION F: What-If Career Simulation Mini-Launcher */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/50 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Section 5 Simulation</span>
            </div>
            <h3 className="text-base font-bold text-white">What-If Career Simulator</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Forecast how acquiring a skill, certification, or altering study hours accelerates your readiness and compresses your roadmap timeline.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Hypothetical Target:</span>
              <strong className="text-indigo-300">{simSkill}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Target Proficiency:</span>
              <strong className="text-emerald-400">{simProficiency}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Weekly Investment:</span>
              <strong className="text-cyan-400">{simHours} hrs/wk</strong>
            </div>
          </div>

          <a
            href="#what-if-tool"
            className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2"
          >
            <span>Launch Simulation Lab</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* SECTION B: Skill Intelligence Map */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                B. Skill Intelligence Map (8 Professional Domains)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-dimensional benchmarking across Programming, AI, Data Science, Cloud, DB, Communication, Leadership & Other.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Charts & Skill Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Chart */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center min-h-[300px]">
            <span className="text-xs font-bold text-slate-400 mb-2">Domain Competency Radar</span>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Current" dataKey="current" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-violet-500"></div>
                <span>Current Level</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-emerald-500"></div>
                <span>Target Level</span>
              </div>
            </div>
          </div>

          {/* Categorized Skills Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto max-h-[340px] pr-1">
            {filteredSkills.map((skill, idx) => {
              const currentPercent = PROFICIENCY_PERCENT[skill.current_proficiency] || 50;
              const targetPercent = PROFICIENCY_PERCENT[skill.target_proficiency] || 85;

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-violet-500/40 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{skill.name}</h4>
                      <span className="text-[10px] text-slate-400 capitalize">{skill.category}</span>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        skill.learning_status === 'Mastered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : skill.learning_status === 'In Progress'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {skill.learning_status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Proficiency: <strong className="text-slate-200">{skill.current_proficiency}</strong></span>
                      <span>Target: <strong className="text-violet-300">{skill.target_proficiency}</strong></span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${currentPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Relevance: <strong className="text-slate-300">{skill.industry_relevance}%</strong></span>
                    <span>{skill.verified ? '✓ Verified' : 'Self-Reported'}</span>
                  </div>
                </div>
              );
            })}

            {filteredSkills.length === 0 && (
              <div className="col-span-2 py-10 text-center text-xs text-slate-400 italic">
                No skills recorded under the {activeCategory} category yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: SECTION C (Memento Timeline) + SECTION E (Firecrawl Predictions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION C: Learning Memory Timeline (Memento) */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                C. Learning Memory Timeline (Memento Integration)
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
              Bitemporal Store
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Real historical learning events, verified certifications, previous AI recommendations, and telemetry from Memento persistent memory.
          </p>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {mementoMemories.map((mem, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 hover:border-cyan-500/30 transition"
              >
                <div className="mt-0.5 w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  {mem.memory_type === 'completed_course' ? (
                    <GraduationCap className="w-3.5 h-3.5" />
                  ) : mem.memory_type === 'abandoned_course' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{mem.title}</h4>
                    <span className="text-[9px] text-slate-400">
                      {mem.created_at ? new Date(mem.created_at).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{mem.content}</p>
                  {mem.details && (
                    <div className="text-[10px] text-slate-400 pt-1 flex flex-wrap gap-2">
                      {Object.entries(mem.details).map(([k, v]) => (
                        <span key={k} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {k}: <strong>{String(v)}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Version Records from Digital Twin */}
            {versionHistory.map((v, i) => (
              <div
                key={`ver-${i}`}
                className="p-3.5 rounded-xl bg-slate-950/40 border border-violet-900/40 flex items-start gap-3"
              >
                <div className="mt-0.5 w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-violet-300">
                      Digital Twin v{v.version} Compiled
                    </h4>
                    <span className="text-[9px] text-slate-400">
                      {v.updated_at ? new Date(v.updated_at).toLocaleDateString() : 'Recorded'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{v.summary_of_changes}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold block">
                    Readiness: {v.previous_readiness}% → {v.new_readiness}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION E: Future Skill Gap Prediction (Firecrawl) */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                E. Future Skill Gap Prediction (Firecrawl Intelligence)
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20 font-bold">
              Web Crawl Synthesis
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Real-time web crawling of job descriptions, tech releases, and tech blogs.
            Clearly distinguishes <strong>Observed Demand</strong> from <strong>Estimated Future Requirements</strong>.
          </p>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {predictedGaps.map((gap, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-orange-500/30 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{gap.skill_name}</h4>
                  <div className="flex items-center gap-1.5">
                    {/* Explicit Distinction Badge */}
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        gap.demand_nature === 'Observed Industry Demand'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {gap.demand_nature}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        gap.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">{gap.rationale}</p>

                {gap.supporting_sources && gap.supporting_sources.length > 0 && (
                  <div className="pt-1 text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-slate-400">Sources:</span>
                    {gap.supporting_sources.map((src, i) => {
                      const isObj = typeof src === 'object' && src !== null;
                      const name = isObj ? (src.name || src.url) : String(src);
                      const url = isObj ? src.url : null;

                      return url ? (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                        >
                          <span>{name}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 flex items-center gap-1">
                          <span>{name}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {predictedGaps.length === 0 && (
              <div className="py-10 text-center text-xs text-slate-400 italic">
                Gathering real-time Firecrawl role benchmarks...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION F / SECTION 5: Interactive What-If Career Simulation Tool */}
      <div id="what-if-tool" className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-indigo-900/50 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Section 5 Simulation Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              What-If Career Simulation Lab
            </h2>
            <p className="text-xs text-slate-400">
              Simulate prospective upskilling paths: What if you acquire a skill, complete a certification, or allocate more hours?
            </p>
          </div>
        </div>

        <form onSubmit={handleRunSimulation} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Hypothetical Skill to Acquire</label>
            <input
              type="text"
              value={simSkill}
              onChange={(e) => setSimSkill(e.target.value)}
              placeholder="e.g. LangChain, Kubernetes, Vector DBs"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Proficiency Level</label>
            <select
              value={simProficiency}
              onChange={(e) => setSimProficiency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Optional Certification</label>
            <input
              type="text"
              value={simCert}
              onChange={(e) => setSimCert(e.target.value)}
              placeholder="e.g. AWS Certified ML Specialty"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Weekly Hours Commitment: <strong className="text-indigo-400">{simHours} hrs/wk</strong>
            </label>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={simHours}
                onChange={(e) => setSimHours(e.target.value)}
                className="w-full accent-indigo-500"
              />
              <button
                type="submit"
                disabled={simLoading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shrink-0 shadow-lg shadow-indigo-950/40"
              >
                {simLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Simulate'}
              </button>
            </div>
          </div>
        </form>

        {/* Simulation Output Card */}
        {simResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-slate-950/80 border border-indigo-800/60 space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Simulation Outcome
                </span>
                <h3 className="text-base font-bold text-white">{simResult.scenario_name}</h3>
                <span className="text-xs text-slate-400">Target Role: {simResult.target_role}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Baseline Readiness</span>
                  <span className="text-lg font-bold text-slate-300">{simResult.baseline_readiness}%</span>
                </div>
                <div className="text-2xl font-light text-slate-400">→</div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-semibold block">Projected Readiness</span>
                  <span className="text-2xl font-black text-emerald-400">{simResult.simulated_readiness}%</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                  +{simResult.readiness_delta}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Time to Readiness</span>
                <p className="text-sm font-bold text-white">{simResult.simulated_weeks_needed} weeks</p>
                <span className="text-[11px] text-cyan-400 block font-semibold">
                  Saved {simResult.weeks_saved} weeks earlier job-readiness
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Newly Closed Gaps</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {simResult.newly_covered_skills?.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-medium border border-emerald-500/20">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Market Uplift Potential</span>
                <p className="text-sm font-bold text-violet-300">
                  {simResult.roi_projection?.salary_uplift_potential || '+32% average compensation'}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  Next Focus: {simResult.roi_projection?.recommended_focus}
                </span>
              </div>
            </div>

            {/* AI Strategic Commentary */}
            <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200">
              <strong className="text-indigo-300 block mb-1">AI Strategic Advisor Note:</strong>
              <p className="text-slate-300 leading-relaxed">{simResult.ai_strategic_advice}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Record Activity / Update Digital Twin Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-violet-400" />
                Record Activity & Update Digital Twin
              </h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Submitting learning activity updates your profile, writes verified memory to Memento, prompts Firecrawl re-benchmarking, and increments your Digital Twin version.
            </p>

            <form onSubmit={handleUpdateTwin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Activity Type</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="skill_added">Acquired / Demonstrated New Skill</option>
                  <option value="course_completed">Completed Course or Certification</option>
                  <option value="goal_changed">Updated Target Career Role</option>
                </select>
              </div>

              {activityType === 'skill_added' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Skill Name</label>
                    <input
                      type="text"
                      required
                      value={skillNameInput}
                      onChange={(e) => setSkillNameInput(e.target.value)}
                      placeholder="e.g. LangChain, Vector Search, Docker"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Demonstrated Proficiency</label>
                    <select
                      value={newProficiencyInput}
                      onChange={(e) => setNewProficiencyInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </>
              )}

              {activityType === 'course_completed' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Course / Certification Title</label>
                  <input
                    type="text"
                    required
                    value={courseTitleInput}
                    onChange={(e) => setCourseTitleInput(e.target.value)}
                    placeholder="e.g. DeepLearning.AI – Multi-Agent Systems with LangGraph"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              )}

              {activityType === 'goal_changed' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">New Target Role</label>
                  <input
                    type="text"
                    required
                    value={newTargetRoleInput}
                    onChange={(e) => setNewTargetRoleInput(e.target.value)}
                    placeholder="e.g. Principal AI Architect"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold flex items-center gap-2"
                >
                  {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Synchronize Digital Twin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
