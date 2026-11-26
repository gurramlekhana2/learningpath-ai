import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Flame,
  CheckCircle2,
  X,
  RefreshCw,
  GitCompare
} from 'lucide-react';
import { api } from '../services/api';

export const RoadmapDiffModal = ({ isOpen, onClose, targetRole }) => {
  const [diffData, setDiffData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadEvolutionDiff();
    }
  }, [isOpen, targetRole]);

  const loadEvolutionDiff = async () => {
    setLoading(true);
    try {
      const data = await api.getRoadmapEvolution(targetRole);
      setDiffData(data);
    } catch (err) {
      console.error('Failed to load roadmap evolution diff:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Roadmap Evolution Tracker
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  v{diffData?.previous_version || 1} → v{diffData?.current_version || 2}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Side-by-side verification: How Firecrawl market shifts & Memento memory adapt your curriculum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
              <p className="text-sm">Synthesizing roadmap diff with Memento memory & Firecrawl trends...</p>
            </div>
          ) : (
            <>
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-800/40 text-sm leading-relaxed text-violet-200">
                <div className="flex items-center gap-2 font-semibold text-violet-300 mb-1.5 text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  AI Evolution Reasoning
                </div>
                {diffData?.reasoning_summary}
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Previous Roadmap State */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Previous Version (v{diffData?.previous_version || 1})
                    </span>
                    <span className="text-[11px] text-slate-400">Archived State</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block mb-1">Superseded / Deprecated Content:</span>
                      <div className="space-y-1.5">
                        {diffData?.removed_or_superseded_skills?.map((item, idx) => (
                          <div key={idx} className="text-xs text-rose-300/80 bg-rose-950/20 border border-rose-900/30 px-2.5 py-1.5 rounded-lg line-through">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evolved Roadmap State */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-violet-800/40 shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      Active Evolved Version (v{diffData?.current_version || 2})
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium">Live Curriculum</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block mb-1">Newly Added In-Demand Skills:</span>
                      <div className="space-y-1.5">
                        {diffData?.newly_added_skills?.map((item, idx) => (
                          <div key={idx} className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-800/40 px-2.5 py-1.5 rounded-lg flex items-center justify-between font-medium">
                            <span>{item}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Firecrawl Surge</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparative Factors Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 text-xs font-semibold text-slate-300">
                  Evolution Drivers Breakdown
                </div>
                <div className="divide-y divide-slate-800/60 text-xs">
                  {diffData?.comparison_details?.map((comp, idx) => (
                    <div key={idx} className="p-3.5 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="font-semibold text-slate-200">{comp.aspect}</div>
                      <div className="text-slate-400">
                        <span className="text-[10px] uppercase text-slate-300 block">Current Focus:</span>
                        {comp.current}
                      </div>
                      <div className="text-violet-300">
                        <span className="text-[10px] uppercase text-violet-400 block">Intelligence Driver:</span>
                        {comp.driver}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Memory & Web Intelligence continuously evaluate roadmap progression.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
