import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, Sparkles, CheckCircle2, Clock, Calendar, 
  ArrowRight, BookOpen, Target, Plus, Check
} from 'lucide-react';
import { PersonalizedLearningPath } from '../../types';
import { 
  getStoredLearningPaths, 
  saveLearningPath, 
  toggleMilestoneCompletion, 
  generateLearningPathAi 
} from '../../services/educationService';

export const PersonalizedPathBuilder: React.FC<{ preferredLanguage?: 'en' | 'ti' }> = ({
  preferredLanguage = 'ti',
}) => {
  const [paths, setPaths] = useState<PersonalizedLearningPath[]>([]);
  const [targetGoal, setTargetGoal] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science & AI');
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePathId, setActivePathId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getStoredLearningPaths();
    setPaths(loaded);
    if (loaded.length > 0 && !activePathId) {
      setActivePathId(loaded[0].id);
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetGoal.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const newPath = await generateLearningPathAi(targetGoal, fieldOfStudy, skillLevel, weeklyHours);
      saveLearningPath(newPath);
      const updated = getStoredLearningPaths();
      setPaths(updated);
      setActivePathId(newPath.id);
      setTargetGoal('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleMilestone = (pathId: string, milestoneId: string) => {
    const updatedPath = toggleMilestoneCompletion(pathId, milestoneId);
    if (updatedPath) {
      setPaths(getStoredLearningPaths());
    }
  };

  const activePath = paths.find(p => p.id === activePathId) || paths[0];

  return (
    <div className="space-y-6" id="personalized-path-builder">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-100">
              {preferredLanguage === 'ti' ? 'ናተይ ፍሉይ ናይ ትምህርቲ መደብ (AI Path)' : 'Personalized AI Learning Paths'}
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              Goal-Driven
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            {preferredLanguage === 'ti'
              ? 'ሸቶኻ ምረጽ እሞ AI ንዓኻ ዝኸውን ናይ 4-ሰሙን ናይ መጽናዕቲ ካርታን ስጉምትታትን የዳልወልካ።'
              : 'Define your career or academic target; Gemini AI constructs a tailored multi-week study roadmap with milestone tracking.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Path Generator Form (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <form onSubmit={handleGenerate} className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              {preferredLanguage === 'ti' ? 'ሓዲሽ ናይ ትምህርቲ ሸቶ ምድላው' : 'Create New Learning Roadmap'}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                {preferredLanguage === 'ti' ? 'ናይ መወዳእታ ሸቶኻ' : 'Target Academic / Career Goal'}
              </label>
              <input
                type="text"
                required
                value={targetGoal}
                onChange={e => setTargetGoal(e.target.value)}
                placeholder={preferredLanguage === 'ti' ? 'ንኣብነት: Full-Stack AI Engineer, Ge\'ez Scholar' : 'e.g. Master AI Engineering & Gemini SDK'}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                {preferredLanguage === 'ti' ? 'ዓውዲ ትምህርቲ' : 'Field of Study'}
              </label>
              <select
                value={fieldOfStudy}
                onChange={e => setFieldOfStudy(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Computer Science & AI">Computer Science & AI</option>
                <option value="STEM & Calculus">Mathematics & Theoretical Physics</option>
                <option value="Ge'ez & Semitic Philology">Ge'ez & Semitic Philology</option>
                <option value="Medical Sciences">Clinical Medicine & Pathology</option>
                <option value="Global Scholarships">Global Scholarships & Research</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {preferredLanguage === 'ti' ? 'ደረጃኻ' : 'Current Level'}
                </label>
                <select
                  value={skillLevel}
                  onChange={e => setSkillLevel(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {preferredLanguage === 'ti' ? 'ናይ ሰሙን ሰዓታት' : 'Hours/Week'}
                </label>
                <input
                  type="number"
                  min={2}
                  max={40}
                  value={weeklyHours}
                  onChange={e => setWeeklyHours(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!targetGoal.trim() || isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? (preferredLanguage === 'ti' ? 'ይዳሎ ኣሎ...' : 'Architecting Roadmap...') : (preferredLanguage === 'ti' ? 'መደብ ብ AI ኣዳልው' : 'Generate Roadmap')}</span>
            </button>
          </form>

          {/* Existing Paths List */}
          {paths.length > 0 && (
            <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {preferredLanguage === 'ti' ? 'ዝተዳለዉ መደባትካ' : 'My Active Roadmaps'}
              </span>
              <div className="space-y-1.5">
                {paths.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePathId(p.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      activePath?.id === p.id
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 font-semibold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span className="truncate">{preferredLanguage === 'ti' ? p.targetGoalTi : p.targetGoalEn}</span>
                    <span className="text-zinc-500 font-mono shrink-0 ml-2">{p.progressPercent}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Active Path Timeline (8 cols) */}
        <div className="lg:col-span-8">
          {activePath ? (
            <div className="bg-zinc-900/90 rounded-2xl border border-amber-500/30 p-6 space-y-6 shadow-2xl">
              {/* Path Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">
                    {preferredLanguage === 'ti' ? activePath.targetGoalTi : activePath.targetGoalEn}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {activePath.weeklyHours} hrs/week
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {activePath.totalWeeks} Weeks Timeline
                    </span>
                  </div>
                </div>

                {/* Progress Circle / Bar */}
                <div className="flex items-center gap-3 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800">
                  <div className="text-right">
                    <div className="text-xs font-bold text-zinc-200">
                      {preferredLanguage === 'ti' ? 'ዕቤት መደብ' : 'Roadmap Progress'}
                    </div>
                    <div className="text-xs text-amber-400 font-mono">{activePath.progressPercent}% Completed</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-400">
                    {activePath.progressPercent}%
                  </div>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-4">
                {activePath.milestones.map((m, idx) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                      m.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleMilestone(activePath.id, m.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          m.completed
                            ? 'bg-emerald-500 text-zinc-950'
                            : 'bg-zinc-800 border border-zinc-700 hover:border-amber-400'
                        }`}
                      >
                        {m.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            {preferredLanguage === 'ti' ? `ሰሙን ${m.weekNumber}` : `Week ${m.weekNumber}`}
                          </span>
                          <h4 className={`text-xs sm:text-sm font-bold truncate ${m.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                            {preferredLanguage === 'ti' ? m.titleTi : m.titleEn}
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {preferredLanguage === 'ti' ? m.descriptionTi : m.descriptionEn}
                        </p>
                        <div className="text-[11px] text-cyan-400 font-medium pt-1">
                          👉 {preferredLanguage === 'ti' ? m.actionItemTi : m.actionItemEn}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <Compass className="w-10 h-10 text-zinc-500" />
              <p className="text-sm font-semibold text-zinc-300">
                {preferredLanguage === 'ti' ? 'ፍሉይ ናይ ትምህርቲ መደብ ኣዳልው' : 'No Active Learning Roadmap'}
              </p>
              <p className="text-xs text-zinc-500 max-w-sm">
                {preferredLanguage === 'ti'
                  ? 'ሸቶኻ ብምምራጽ ብ AI ዝተዳለወ ናይ 4-ሰሙን ናይ ትምህርቲ ስጉምትታት ረኸብ።'
                  : 'Specify your academic objective in the form to generate a structured milestone timeline.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
