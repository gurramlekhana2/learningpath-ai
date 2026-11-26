import React, { useState, useEffect } from 'react';
import {
  Milestone,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  GitCompare,
  DollarSign,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const RoadmapPage = ({ onOpenDiffModal }) => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [updatingWeek, setUpdatingWeek] = useState(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    loadRoadmap();
  }, [user]);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      const data = await api.getCurrentRoadmap();
      setRoadmap(data);
      if (data?.weekly_milestones?.length > 0) {
        // Expand the first non-completed week
        const nextIncomplete = data.weekly_milestones.find((m) => m.status !== 'completed');
        if (nextIncomplete) {
          setExpandedWeek(nextIncomplete.week_number);
        }
      }
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (weekNumber, newStatus) => {
    if (!roadmap) return;
    setUpdatingWeek(weekNumber);
    try {
      const updated = await api.updateMilestoneProgress(roadmap.id, weekNumber, newStatus);
      setRoadmap(updated);
    } catch (err) {
      console.error('Failed to update milestone:', err);
    } finally {
      setUpdatingWeek(null);
    }
  };

  const handleRegenerateRoadmap = async () => {
    setRegenerating(true);
    try {
      const fresh = await api.generateRoadmap(user?.target_role, true);
      setRoadmap(fresh);
      if (onOpenDiffModal) onOpenDiffModal();
    } catch (err) {
      console.error('Failed to regenerate roadmap:', err);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
          <p className="text-sm">Synthesizing adaptive roadmap with Memento memory...</p>
        </div>
      </div>
    );
  }

  const milestones = roadmap?.weekly_milestones || [];
  const roi = roadmap?.learning_roi || {};
  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progressPct = roadmap?.progress_percentage || 0;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Milestone className="w-4 h-4" />
              Adaptive Learning Roadmap
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px]">
                v{roadmap?.version || 1} Active
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{roadmap?.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {roadmap?.estimated_duration_weeks || 8} structured weekly milestones • {roadmap?.total_estimated_hours || 60} estimated hours
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenDiffModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 transition flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4" />
              <span>Evolution Diff Tracker</span>
            </button>
            <button
              onClick={handleRegenerateRoadmap}
              disabled={regenerating}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition flex items-center gap-2"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-violet-400 ${regenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span>Overall Roadmap Completion</span>
            <span className="font-bold text-white">
              {progressPct}% ({completedCount}/{milestones.length} milestones)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Memento Memory Influences Callout */}
        {roadmap?.memento_memory_influences?.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">Memento Memory Influences: </span>
              {roadmap.memento_memory_influences.join(' ')}
            </div>
          </div>
        )}
      </div>

      {/* Differentiator B: Learning ROI Estimator Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-900 border border-indigo-800/40 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <DollarSign className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Novel Feature: Learning ROI & Career Upside Projections
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Time Investment</span>
            <span className="text-xl font-bold text-white">{roi.total_estimated_hours || 65} hrs</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">~{roi.weekly_commitment_hours || 6} hrs/week</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Readiness Upside</span>
            <span className="text-xl font-bold text-emerald-400">{roi.projected_readiness_increase || '+35% Gain'}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Validated with checkpoints</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Estimated Cost</span>
            <span className="text-xl font-bold text-cyan-400">${roi.estimated_monetary_cost_usd || 49} USD</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Open source + low-cost</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Market Compensation</span>
            <span className="text-xl font-bold text-violet-300">{roi.market_salary_upside_percentage || '+28% Upside'}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Average promotion lift</span>
          </div>
        </div>
      </div>

      {/* Weekly Milestones Timeline */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Interactive Curriculum Timeline</h2>

        <div className="space-y-4">
          {milestones.map((m) => {
            const isExpanded = expandedWeek === m.week_number;
            const isCompleted = m.status === 'completed';
            const isInProgress = m.status === 'in_progress';

            return (
              <div
                key={m.week_number}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isCompleted
                    ? 'bg-slate-900/60 border-emerald-900/40'
                    : isInProgress
                    ? 'bg-slate-900 border-violet-700/60 shadow-lg shadow-violet-950/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                {/* Milestone Header */}
                <div
                  onClick={() => setExpandedWeek(isExpanded ? null : m.week_number)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : isInProgress
                          ? 'bg-violet-600 text-white border-violet-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : `W${m.week_number}`}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{m.title}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : isInProgress
                              ? 'bg-violet-500/20 text-violet-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Focus: {m.focus_skill}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {!isCompleted ? (
                        <button
                          onClick={() => handleUpdateStatus(m.week_number, 'completed')}
                          disabled={updatingWeek === m.week_number}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Done</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(m.week_number, 'in_progress')}
                          disabled={updatingWeek === m.week_number}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      )}

                      {m.status === 'in_progress' ? (
                        <button
                          onClick={() => handleUpdateStatus(m.week_number, 'paused')}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          title="Pause learning"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : m.status === 'paused' ? (
                        <button
                          onClick={() => handleUpdateStatus(m.week_number, 'in_progress')}
                          className="p-1.5 rounded-lg bg-violet-600/30 text-violet-300 hover:bg-violet-600/50"
                          title="Resume learning"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>

                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5 bg-slate-950/40">
                    {/* Objectives */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Learning Objectives
                      </h4>
                      <ul className="space-y-1.5">
                        {m.objectives?.map((obj, oIdx) => (
                          <li key={oIdx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5"></span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Courses */}
                    {m.courses?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Verified Learning Resources
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {m.courses.map((c, cIdx) => (
                            <div
                              key={cIdx}
                              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3"
                            >
                              <div>
                                <span className="text-xs font-semibold text-white block">{c.title}</span>
                                <span className="text-[11px] text-slate-400 block">
                                  {c.provider} • {c.duration_hours} hrs • {c.difficulty}
                                </span>
                              </div>
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 text-xs font-medium hover:bg-violet-600/30 transition flex items-center gap-1 shrink-0"
                              >
                                <span>Learn</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Practical Project */}
                    {m.practical_project && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white flex items-center gap-2">
                            <Github className="w-4 h-4 text-violet-400" />
                            Practical Capstone Project: {m.practical_project.title}
                          </h4>
                          {m.practical_project.github_starter_url && (
                            <a
                              href={m.practical_project.github_starter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
                            >
                              <span>Starter Code</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {m.practical_project.description}
                        </p>
                        <div className="pt-1">
                          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Key Deliverables:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {m.practical_project.deliverables?.map((del, dIdx) => (
                              <span key={dIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {del}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Assessment Checkpoint */}
                    <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-800/30 flex items-start gap-2.5">
                      <Award className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-300">
                        <span className="font-semibold text-violet-300">Assessment Checkpoint: </span>
                        {m.assessment_checkpoint}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Certifications Section */}
      {roadmap?.certifications?.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Recommended Enterprise Certifications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{cert.name}</h4>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Issuing: {cert.issuing_organization} • Recommended at Week {cert.recommended_at_week}
                  </span>
                </div>
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition flex items-center gap-1.5 shrink-0"
                >
                  <span>Exam Details</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
