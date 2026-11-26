import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Brain,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  X,
  Layers,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MemoryPage = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Memory Form
  const [newType, setNewType] = useState('completed_course');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMemories();
  }, [user]);

  const loadMemories = async () => {
    setLoading(true);
    try {
      const data = await api.getMemoryHistory();
      setMemories(data.memories || []);
      setSummary(data.summary || null);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      await api.storeMemory({
        memory_type: newType,
        title: newTitle.trim(),
        content: newContent.trim() || newTitle.trim(),
        details: { manual_user_entry: true },
        source: 'employee_action',
        confidence: 1.0
      });
      setShowAddModal(false);
      setNewTitle('');
      setNewContent('');
      await loadMemories();
    } catch (err) {
      console.error('Failed to store memory:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMemory = async (id) => {
    try {
      await api.deleteMemory(id);
      setMemories(memories.filter((m) => m.id !== id && m._id !== id));
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to reset all persistent learning history?')) {
      try {
        await api.clearAllMemories();
        await loadMemories();
      } catch (err) {
        console.error('Failed to clear memories:', err);
      }
    }
  };

  const memoryTypes = [
    { id: 'ALL', label: 'All Records' },
    { id: 'completed_course', label: 'Completed Courses' },
    { id: 'abandoned_course', label: 'Abandoned Courses' },
    { id: 'skill_demonstrated', label: 'Verified Skills' },
    { id: 'learning_preference', label: 'Preferences' }
  ];

  const filteredMemories = memories.filter((m) => {
    if (filterType === 'ALL') return true;
    return m.memory_type === filterType;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4" />
            Persistent AI Learning Memory (Memento Integration)
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Memory Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Bitemporal knowledge repository tracking valid time, course completions, and past recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-1.5 shadow-md shadow-cyan-950/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory Record</span>
          </button>
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-800/60 transition"
          >
            Reset Memory
          </button>
        </div>
      </div>

      {/* Memory Influence Explanation Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-slate-900 to-slate-900 border border-cyan-800/40 space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          How Memento Influences Roadmap Recommendations
        </div>
        <p className="text-xs text-cyan-200/90 leading-relaxed">
          When the AI generates your adaptive roadmap, it queries Memento. Because you already completed{' '}
          <strong>Python AsyncIO & Foundations</strong>, the system skips introductory syntax and advances straight to production RAG & Vector Search. Similarly, abandoned course signals inform the mentor not to suggest dry theoretical lectures.
        </p>
        {summary && (
          <div className="pt-2 flex flex-wrap gap-4 text-xs">
            <span className="text-slate-300">
              Completed Courses: <strong className="text-emerald-400">{summary.completed_courses?.length || 0}</strong>
            </span>
            <span className="text-slate-300">
              Abandoned Tracked: <strong className="text-amber-400">{summary.abandoned_courses?.length || 0}</strong>
            </span>
            <span className="text-slate-300">
              Verified Skills: <strong className="text-cyan-400">{summary.demonstrated_skills?.length || 0}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        {memoryTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterType(t.id)}
            className={`px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              filterType === t.id
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
          <p className="text-sm">Retrieving bitemporal memory graphs from Memento...</p>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="p-12 text-center text-slate-400 border border-slate-800 rounded-2xl bg-slate-900">
          <Brain className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No memory entries matching filter.</p>
          <p className="text-xs text-slate-400 mt-1">Add a new entry or mark roadmap milestones completed.</p>
        </div>
      ) : (
        /* Memory Items Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((m) => {
            const isCompleted = m.memory_type === 'completed_course';
            const isAbandoned = m.memory_type === 'abandoned_course';
            const isSkill = m.memory_type === 'skill_demonstrated';

            return (
              <div
                key={m.id || m._id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-cyan-500/30 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isAbandoned
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isSkill
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      }`}
                    >
                      {m.memory_type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">Source: {m.source}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteMemory(m.id || m._id)}
                    className="text-slate-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                    title="Delete memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{m.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{m.content}</p>
                </div>

                {/* Bitemporal Metadata */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Valid From: {m.valid_from ? m.valid_from.substring(0, 10) : 'Active'}
                  </span>
                  <span>Confidence: {(m.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                Store New Memento Memory Entry
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Memory Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="completed_course">Completed Course / Certification</option>
                  <option value="abandoned_course">Abandoned Course / Disliked Format</option>
                  <option value="skill_demonstrated">Demonstrated Technical Competency</option>
                  <option value="learning_preference">Learning Preference / Style</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Completed: DeepLearning.AI LangChain Agents"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Details & Rationale</label>
                <textarea
                  rows="3"
                  placeholder="Describe accomplishments, weaknesses found, or reasons for dropping..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  {saving ? 'Storing...' : 'Save to Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
