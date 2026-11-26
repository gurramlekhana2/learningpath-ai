import React, { useState, useEffect } from 'react';
import {
  Flame,
  Globe2,
  Search,
  RefreshCw,
  ExternalLink,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const IndustryPage = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.target_role || 'AI Engineer');
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadIntelligence();
  }, [selectedRole]);

  const loadIntelligence = async () => {
    setLoading(true);
    try {
      const data = await api.getIndustryTrends(selectedRole);
      setIntel(data);
    } catch (err) {
      console.error('Failed to load industry intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.refreshIndustryIntelligence();
      await loadIntelligence();
      setToastMessage('Firecrawl crawler refreshed live industry knowledge base!');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Failed to refresh:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await api.searchIndustry(searchQuery.trim());
      setSearchResults(res);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            Live Industry Intelligence Engine (Firecrawl)
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Industry Intelligence & Trends</h1>
          <p className="text-xs text-slate-400 mt-1">
            Continuous real-time web extraction from job portals, technology research, and certification standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
          >
            <option value="AI Engineer">AI Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Cloud Engineer">Cloud Engineer</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Crawler</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Live Firecrawl Search Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-orange-400" />
            Live Firecrawl Web Crawler Search
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Query public tech blogs, documentation, and salary portals to extract verified skill demand.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. LangGraph vs CrewAI demand 2026, AWS Bedrock certification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-orange-950/30"
          >
            {searching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5" />}
            <span>Crawl Live Web</span>
          </button>
        </form>

        {/* Live Search Results */}
        {searchResults && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2">
              <span>Extracted Intelligence for: "{searchResults.query}"</span>
              <span className="text-[10px] text-orange-400 font-bold">{searchResults.source_type}</span>
            </div>
            <div className="space-y-2.5">
              {searchResults.results?.map((res, rIdx) => (
                <div key={rIdx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-white hover:text-orange-400 transition flex items-center gap-1.5"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-[10px] text-slate-300">{res.collected_at}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{res.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-400" />
          <p className="text-sm">Fetching verified industry telemetry for {selectedRole}...</p>
        </div>
      ) : (
        <>
          {/* Trending Technologies Grid */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Trending Technologies for {selectedRole}</h3>
                <p className="text-xs text-slate-400">Quarterly growth percentage & enterprise demand index</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
                Live Market Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {intel?.trending_skills?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 hover:border-orange-500/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className="text-xs font-extrabold text-emerald-400">+{item.growth}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Category: {item.category}</span>
                    <span className="font-semibold text-slate-300">Demand: {item.demand_score}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                      style={{ width: `${item.demand_score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discovered Learning Resources & Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Certifications */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Required Industry Certifications</h3>
              </div>
              <div className="space-y-3">
                {intel?.top_certifications?.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{c.organization}</p>
                    </div>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Courses */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Discovered Learning Resources</h3>
              </div>
              <div className="space-y-3">
                {intel?.learning_resources?.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{res.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {res.provider} • {res.duration_hours} hrs • {res.difficulty}
                      </p>
                    </div>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 text-xs font-semibold hover:bg-violet-600/30 transition flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transparent Source Citations */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Globe2 className="w-4 h-4 text-orange-400" />
              Empirical Research Citations & Source URLs
            </div>
            <p className="text-xs text-slate-400">
              In accordance with strict verification rules, all crawled industry intelligence is cited with genuine source links and collection timestamps.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {intel?.sources?.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition block text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white truncate">{s.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                  </div>
                  <span className="text-[10px] text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Indexed: {s.date}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
