import React from 'react';
import {
  Sparkles,
  Flame,
  Brain,
  Cpu,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Target,
  Milestone,
  ShieldCheck,
  ChevronRight,
  Layers,
  BarChart3,
  Bot
} from 'lucide-react';
import { DottedSurfaceCanvas } from '../components/DottedSurfaceCanvas';

export const LandingPage = ({ onGetStarted, onLogin }) => {
  return (
    <div className="relative min-h-screen bg-[#080808] text-slate-100 flex flex-col overflow-hidden select-none">
      {/* 3D Roaming White Balls Canvas Background from StudyGraph */}
      <DottedSurfaceCanvas opacity={1.0} interactive={true} />

      {/* Top Minimal Header */}
      <header className="relative z-20 border-b border-white/10 bg-[#080808]/40 backdrop-blur-md sticky top-0 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#141418] border border-white/10 flex items-center justify-center shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-lg text-white font-sans tracking-tight">LearningPath</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">
                AI
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onLogin}
            className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-200 px-3 py-1.5 font-medium"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="flex items-center space-x-2 bg-white text-black hover:bg-neutral-200 border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section with Interactive Roaming White Balls */}
      <section className="relative z-20 pt-20 pb-24 px-6 max-w-5xl mx-auto text-center flex-1 flex flex-col justify-center items-center pointer-events-auto">
        {/* Cinematic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-wider text-neutral-300 mb-6 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>AUTONOMOUS WORKFORCE UPSKILLING</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08] mb-6">
          Your Career Evolution,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            Intelligently Connected.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl font-normal leading-relaxed mb-10">
          Continuous workforce adaptation fusing <strong>Firecrawl</strong> real-time industry intelligence, <strong>Memento</strong> persistent learning memory, and <strong>Generative AI</strong> to continuously guide you toward the frontier.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center space-x-2.5 hover:bg-neutral-200 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Launch Upskilling Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#141418]/80 hover:bg-[#1c1c22] text-white border border-white/15 font-medium text-sm flex items-center justify-center space-x-2.5 backdrop-blur-md transition-all active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4 text-neutral-300" />
            <span>Enterprise Demo Login</span>
          </button>
        </div>

        {/* 3 Core Engines Glass Cards (Floating over waving balls) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-[#121216]/75 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-orange-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">1. Firecrawl Intelligence</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Crawls live industry job postings, certification authorities, and tech blogs in real time. Discovers what skills are demanded right now.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121216]/75 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">2. Memento Memory</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Maintains persistent bitemporal memory of completed courses, abandoned efforts, and verified skills. Never recommends what you already know.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121216]/75 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-violet-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">3. Adaptive GenAI</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fuses verified market demand with personal learning memory to generate dynamically evolving weekly roadmaps with hands-on capstone projects.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-20 py-20 px-6 bg-[#0c0c10]/80 backdrop-blur-md border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Enterprise Workforce Capabilities</h2>
            <p className="text-sm text-neutral-400 max-w-xl mx-auto">
              Built for high-performing engineering and technical organizations navigating rapid technological transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#141418]/90 border border-white/10">
              <Target className="w-6 h-6 text-violet-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1.5">Dynamic Skill Gap Engine</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Evaluates employee competencies across Beginner to Expert and maps granular learning priorities against target job roles.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#141418]/90 border border-white/10">
              <Layers className="w-6 h-6 text-cyan-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1.5">Roadmap Evolution Tracker</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Side-by-side verification showing how new Firecrawl market intelligence and Memento memory adapt your active curriculum.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#141418]/90 border border-white/10">
              <TrendingUp className="w-6 h-6 text-emerald-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1.5">Future Skill Radar</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Categorizes skills into Rapidly Growing, Emerging, Currently Demanded, and Declining with authentic citations.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#141418]/90 border border-white/10">
              <Bot className="w-6 h-6 text-violet-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1.5">AI Learning Mentor</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Contextual chatbot that answers questions citing your verified accomplishments and current market demand index.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#141418]/90 border border-white/10">
              <BarChart3 className="w-6 h-6 text-indigo-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1.5">Learning ROI Estimator</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Projects weekly learning hours, monetary resource investment, readiness score upside, and salary uplift.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#141418]/90 border border-white/10">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1.5">HR Executive Workforce Suite</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Departmental skill shortage matrix, workforce readiness index, and role-based access for talent managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-8 px-6 border-t border-white/10 text-center text-xs text-neutral-400 bg-[#080808]">
        <p>LearningPath AI – Intelligent Workforce Upskilling and Career Evolution Platform</p>
      </footer>
    </div>
  );
};
