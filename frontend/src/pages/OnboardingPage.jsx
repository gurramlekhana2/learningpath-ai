import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  BookOpen,
  Target,
  Briefcase,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const OnboardingPage = ({ onComplete }) => {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [department, setDepartment] = useState(user?.department || 'Engineering');
  const [currentRole, setCurrentRole] = useState(user?.current_role || 'Junior Software Developer');
  const [experienceYears, setExperienceYears] = useState(user?.experience_years || 2.0);
  const [weeklyHours, setWeeklyHours] = useState(user?.weekly_hours_available || 6);

  const [skills, setSkills] = useState([
    { name: 'Python', proficiency: 'Intermediate', category: 'Languages', years_experience: 2.0, verified: true },
    { name: 'Docker & Containerization', proficiency: 'Intermediate', category: 'DevOps', years_experience: 1.0, verified: true },
    { name: 'FastAPI', proficiency: 'Intermediate', category: 'Frameworks', years_experience: 1.5, verified: true }
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');

  const [targetRole, setTargetRole] = useState(user?.target_role || 'AI Engineer');
  const [careerInterests, setCareerInterests] = useState([
    'Generative AI',
    'RAG Systems',
    'Agentic Frameworks'
  ]);
  const [newInterest, setNewInterest] = useState('');

  const targetRoleOptions = [
    'AI Engineer',
    'Data Scientist',
    'Full Stack Developer',
    'Cloud Engineer',
    'Cybersecurity Architect'
  ];

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([
      ...skills,
      {
        name: newSkillName.trim(),
        proficiency: newSkillProficiency,
        category: newSkillCategory,
        years_experience: 1.0,
        verified: false
      }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (!careerInterests.includes(newInterest.trim())) {
      setCareerInterests([...careerInterests, newInterest.trim()]);
    }
    setNewInterest('');
  };

  const handleRemoveInterest = (item) => {
    setCareerInterests(careerInterests.filter((i) => i !== item));
  };

  const handleSubmitOnboarding = async () => {
    setLoading(true);
    try {
      const payload = {
        department,
        current_role: currentRole,
        experience_years: parseFloat(experienceYears),
        skills,
        soft_skills: ['Problem Solving', 'Team Collaboration', 'System Design'],
        career_interests: careerInterests,
        target_role: targetRole,
        weekly_hours_available: parseInt(weeklyHours)
      };

      const res = await api.submitOnboarding(payload);
      updateUser(res.profile);
      onComplete();
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8">
        {/* Wizard Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className={step >= 1 ? 'text-violet-400' : ''}>1. Background</span>
            <span className={step >= 2 ? 'text-violet-400' : ''}>2. Current Skills</span>
            <span className={step >= 3 ? 'text-violet-400' : ''}>3. Target Career</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Background */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-white">Your Professional Profile</h2>
              <p className="text-xs text-slate-400">Tell us about your current organizational position.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Job Role</label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Experience</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Weekly Learning Availability: <span className="text-violet-400 font-bold">{weeklyHours} hrs/wk</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(e.target.value)}
                  className="w-full accent-violet-600 mt-2"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold flex items-center gap-2"
              >
                <span>Next: Skill Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skills Inventory */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-white">Document Current Competencies</h2>
              <p className="text-xs text-slate-400">
                The AI will calibrate learning roadmaps to build upon these without repeating beginner basics.
              </p>
            </div>

            {/* Existing Skills List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {skills.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{s.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium">
                      {s.proficiency}
                    </span>
                    <span className="text-[10px] text-slate-400">({s.category})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-400 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Widget */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <span className="text-xs font-semibold text-slate-300">Add Technical Skill:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Skill name (e.g. PyTorch)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold flex items-center gap-2"
              >
                <span>Next: Target Ambition</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Target Ambition */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-white">Target Job Role & Interests</h2>
              <p className="text-xs text-slate-400">
                Select your intended career progression. Firecrawl will crawl market requirements for this role.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Target Role</label>
              <div className="grid grid-cols-2 gap-2.5">
                {targetRoleOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTargetRole(opt)}
                    className={`p-3 rounded-xl text-left border transition ${
                      targetRole === opt
                        ? 'bg-violet-600/20 border-violet-500 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{opt}</span>
                      {targetRole === opt && <Check className="w-4 h-4 text-violet-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Career Interests */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Career Interests</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {careerInterests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-violet-300 font-medium"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:text-red-400"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Distributed Training, LLM Evaluation"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={handleSubmitOnboarding}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-violet-900/40"
              >
                {loading ? (
                  <span>Generating Adaptive Roadmap...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
