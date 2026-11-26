import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  Flame,
  Brain,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MentorPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.full_name || 'there'}! I am your AI Learning Mentor.\n\nI have loaded your profile (${user?.current_role} targeting ${user?.target_role}), your Memento learning history (courses completed & preferences), and the latest live Firecrawl industry trends.\n\nHow can I help advance your career today?`,
      memory_retrieved: true,
      market_data_referenced: true
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const starterPrompts = [
    'What should I learn next?',
    'Why is Python important for my career?',
    'Which skills am I missing for AI Engineer?',
    'Suggest projects for my current skill level',
    'How do I bridge from Software Developer to AI Engineer?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendChatMessage(
        text.trim(),
        messages.map((m) => ({ role: m.role, content: m.content }))
      );

      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: response.reply,
          memory_retrieved: response.memory_retrieved,
          market_data_referenced: response.market_data_referenced,
          source: response.source
        }
      ]);
    } catch (err) {
      console.error('Failed to send chat message:', err);
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: 'I encountered an error retrieving context. Please try again.',
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              AI Learning Mentor
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Context-Aware
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Personalized career guidance grounded in your Memento history & Firecrawl market data.
            </p>
          </div>
        </div>

        {/* Live Context Indicators */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1 text-cyan-400">
            <Brain className="w-3.5 h-3.5" /> Memento Memory
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-orange-400">
            <Flame className="w-3.5 h-3.5" /> Firecrawl Intel
          </span>
        </div>
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';

          return (
            <div key={idx} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-violet-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Context Badges on Assistant Messages */}
                {!isUser && (m.memory_retrieved || m.market_data_referenced) && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span>Grounding:</span>
                    {m.memory_retrieved && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        Memento History
                      </span>
                    )}
                    {m.market_data_referenced && (
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20">
                        Firecrawl Signals
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 font-bold text-xs uppercase">
                  {user?.full_name ? user.full_name.charAt(0) : 'U'}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-400" />
              <span>Analyzing memory graphs and industry requisitions...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Suggestions:</span>
        {starterPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition whitespace-nowrap shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask your mentor about skills, project ideas, or roadmap updates..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500 transition shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-violet-900/30"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
