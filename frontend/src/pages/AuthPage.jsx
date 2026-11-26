import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Users,
  GraduationCap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DottedSurfaceCanvas } from '../components/DottedSurfaceCanvas';

export const AuthPage = ({ onAuthenticated }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('employee');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [currentRole, setCurrentRole] = useState('Software Developer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          email,
          password,
          full_name: fullName,
          role,
          department,
          current_role: currentRole
        });
      } else {
        await login(email, password);
      }
      onAuthenticated();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      await quickDemoLogin(demoRole);
      onAuthenticated();
    } catch (err) {
      setError('Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080808] flex flex-col justify-center items-center p-6 select-none overflow-hidden">
      {/* 3D Roaming White Balls Canvas Background from StudyGraph */}
      <DottedSurfaceCanvas opacity={0.9} interactive={true} />

      <div className="w-full max-w-md bg-[#121216]/85 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden p-8 relative z-20">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#18181f] border border-white/10 flex items-center justify-center shadow-lg text-white font-bold mx-auto mb-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#22c55e]" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isRegister ? 'Join LearningPath AI' : 'Sign in to LearningPath AI'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Enterprise AI Workforce Upskilling Platform
          </p>
        </div>

        {/* Demo Quick Logins */}
        <div className="mb-6 p-3.5 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-300 mb-2">
            <span>One-Click Demonstration Logins:</span>
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-300" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('employee')}
              className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/20 transition text-center"
            >
              Alex (Dev)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('hr_manager')}
              className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition text-center"
            >
              Sarah (HR)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('learning_admin')}
              className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition text-center"
            >
              David (Admin)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Application Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'employee', label: 'Employee', icon: User },
                    { id: 'hr_manager', label: 'HR Mgr', icon: Users },
                    { id: 'learning_admin', label: 'Admin', icon: GraduationCap }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border flex flex-col items-center gap-1 transition ${
                        role === r.id
                          ? 'bg-white/20 border-white/30 text-white'
                          : 'bg-black/50 border-white/10 text-neutral-400 hover:border-white/20'
                      }`}
                    >
                      <r.icon className="w-3.5 h-3.5" />
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Current Role</label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Corporate Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.chen@enterprise.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-white text-black hover:bg-neutral-200 shadow-lg transition flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-neutral-400 hover:text-white font-medium"
          >
            {isRegister
              ? 'Already have an enterprise account? Sign in'
              : "Don't have an account? Register new employee"}
          </button>
        </div>
      </div>
    </div>
  );
};
