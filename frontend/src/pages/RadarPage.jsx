import React, { useState, useEffect } from 'react';
import {
  Radar as RadarIcon,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Globe2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { api } from '../services/api';

export const RadarPage = () => {
  const [radarData, setRadarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    loadRadar();
  }, []);

  const loadRadar = async () => {
    setLoading(true);
    try {
      const res = await api.getFutureRadar();
      setRadarData(res.radar || []);
    } catch (err) {
      console.error('Failed to load radar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Trajectories' },
    { id: 'Rapidly Growing', label: 'Rapidly Growing' },
    { id: 'Currently Demanded', label: 'Currently Demanded' },
    { id: 'Emerging', label: 'Emerging (Edge/SLM)' },
    { id: 'Declining', label: 'Declining / At-Risk' }
  ];

  const filteredItems = radarData.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.status === activeCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Rapidly Growing':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Currently Demanded':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
      case 'Emerging':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Declining':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  // Prepare Scatter Chart Data
  const chartPoints = radarData.map((item, idx) => ({
    name: item.name,
    growth: item.growth_rate,
    relevance: item.market_relevance,
    status: item.status,
    forecast: item.forecast_type
  }));

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">
            <RadarIcon className="w-4 h-4" />
            Empirical Market Horizon Scanning
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Future Skill Radar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesized from Firecrawl crawl telemetry, Stanford AI Index 2026, and enterprise hiring requisitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real-Time Indexing Active</span>
          </div>
        </div>
      </div>

      {/* Distinction Callout */}
      <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-800/30 text-xs text-violet-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-violet-300">Methodology Notice: </span>
          The Radar clearly separates <strong>Observed Market Demand</strong> (derived directly from real-time job requisitions indexed by Firecrawl) from <strong>AI-Generated Forecasts</strong> (predictive trend extrapolations based on research papers and venture capital deployment).
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeCategory === c.id
                ? 'bg-violet-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
          <p className="text-sm">Calculating market relevance vectors and trend vectors...</p>
        </div>
      ) : (
        <>
          {/* Radar Horizon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item, idx) => {
              const isDeclining = item.status === 'Declining';

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative group hover:border-violet-500/30 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-300 px-2 py-0.5 rounded bg-slate-950 font-medium border border-slate-800">
                          {item.forecast_type}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      <p className="text-[11px] text-slate-400">{item.category}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1">
                        {isDeclining ? (
                          <TrendingDown className="w-4 h-4 text-rose-400" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                        )}
                        <span
                          className={`text-sm font-extrabold ${
                            isDeclining ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {item.growth_rate > 0 ? `+${item.growth_rate}%` : `${item.growth_rate}%`}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-300 block">
                        Relevance: {item.market_relevance}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>

                  {/* Supporting Sources */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-semibold text-slate-300 block mb-1">
                      Supporting Verification Sources:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.supporting_sources?.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                        >
                          <span>{src.name}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
