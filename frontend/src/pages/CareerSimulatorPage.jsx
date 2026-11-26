import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Zap,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CareerSimulatorPage = ({ setActiveTab }) => {
  const { user, updateUser } = useAuth();
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adoptingRole, setAdoptingRole] = useState(null);

  useEffect(() => {
    loadSimulations();
  }, [user]);

  const loadSimulations = async () => {
    setLoading(true);
    try {
      const data = await api.simulateCareerTransitions();
      setSimulations(data.simulations || []);
    } catch (err) {
      console.error('Failed to load career simulations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptRole = async (targetRole) => {
    setAdoptingRole(targetRole);
    try {
      await api.updateProfile({ target_role: targetRole });
      updateUser({ target_role: targetRole });
      await api.generateRoadmap(targetRole, true);
      setActiveTab('roadmap');
    } catch (err) {
      console.error('Failed to adopt role:', err);
    } finally {
      setAdoptingRole(null);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Accessible':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Moderate':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Challenging':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Steep':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            AI Career Evolution Simulator
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Career Transition Simulator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Model your transition from <strong>{user?.current_role || 'Developer'}</strong> into multiple future roles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Active Target:</span>
          <strong className="text-violet-300 font-bold">{user?.target_role || 'AI Engineer'}</strong>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
          <p className="text-sm">Simulating career transition pathways and competency matrices...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {simulations.map((sim, idx) => {
            const isCurrent = sim.is_current_target;

            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border space-y-5 transition-all ${
                  isCurrent
                    ? 'bg-slate-900/90 border-violet-600/60 shadow-xl shadow-violet-950/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-lg font-bold text-white">{sim.target_role}</h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white">
                          Current Focus
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{sim.description}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${getDifficultyColor(
                      sim.transition_difficulty
                    )}`}
                  >
                    {sim.transition_difficulty} Transition
                  </span>
                </div>

                {/* Readiness Before vs After Progress */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Current Compatibility:</span>
                    <span className="text-white font-bold">{sim.current_compatibility_score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${sim.current_compatibility_score}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold pt-2">
                    <span className="text-slate-400">Projected Upon Completion:</span>
                    <span className="text-emerald-400 font-bold">{sim.projected_readiness_score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${sim.projected_readiness_score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Est. Time</span>
                    <span className="font-bold text-white">{sim.estimated_weeks} weeks</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Market Demand</span>
                    <span className="font-bold text-orange-400">{sim.market_demand_index}/100</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Salary Upside</span>
                    <span className="font-bold text-emerald-400">{sim.avg_salary_uplift}</span>
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    Critical Skills to Acquire ({sim.missing_skills?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sim.missing_skills?.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {sim.missing_skills?.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{sim.missing_skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Brief */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 block mb-0.5">
                    Recommended Capstone Benchmark:
                  </span>
                  <span className="text-slate-300 font-medium">{sim.recommended_project}</span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between">
                  {isCurrent ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Active Learning Goal
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAdoptRole(sim.target_role)}
                      disabled={adoptingRole === sim.target_role}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition flex items-center gap-1.5 shadow-md shadow-violet-900/30"
                    >
                      {adoptingRole === sim.target_role ? (
                        <span>Recalibrating Roadmap...</span>
                      ) : (
                        <>
                          <span>Select Target & Evolve Roadmap</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
