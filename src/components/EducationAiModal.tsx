import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, GraduationCap, BookOpen, Brain, Sparkles, Send, CheckCircle2, 
  HelpCircle, Lightbulb, Calculator, Globe, Code, History, Atom, 
  Volume2, ArrowRight, Award, Flame, RefreshCw
} from 'lucide-react';
import { UserProfile } from '../types';
import { checkGuestLimit, incrementGuestUsage } from '../utils/guestManager';
import { GuestLimitBanner } from './GuestLimitBanner';

interface EducationAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChat?: (initialPrompt: string) => void;
  user?: UserProfile;
  onOpenAuthModal?: (mode?: 'login' | 'signup' | 'otp') => void;
}

interface Subject {
  id: string;
  name: string;
  nameTi: string;
  icon: any;
  color: string;
  bgColor: string;
  sampleQuestion: string;
  sampleQuestionTi: string;
}

const SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    nameTi: 'ሒሳብ',
    icon: Calculator,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15 border-amber-500/30',
    sampleQuestion: 'Solve 2x + 15 = 45 and explain step by step.',
    sampleQuestionTi: 'ሒሳብ 2x + 15 = 45 ብደረጃ ኣረድኣኒ።',
  },
  {
    id: 'science',
    name: 'Science & Physics',
    nameTi: 'ሳይንስን ፊዚክስን',
    icon: Atom,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15 border-emerald-500/30',
    sampleQuestion: 'Explain photosynthesis in simple terms with key steps.',
    sampleQuestionTi: 'ፎቶሲንተሲስ (photosynthesis) ብቐሊሉ መብርሂ ሃበኒ።',
  },
  {
    id: 'english',
    name: 'English Grammar',
    nameTi: 'ቋንቋ እንግሊዝ',
    icon: Globe,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15 border-blue-500/30',
    sampleQuestion: 'What is the difference between "affect" and "effect"?',
    sampleQuestionTi: 'ኣብ መንጎ "past tense" ን "present perfect" ዘሎ ፍልልይ እንታይ እዩ?',
  },
  {
    id: 'tigrinya',
    name: 'Tigrinya Language',
    nameTi: 'ትግርኛ ቋንቋን ሰዋስውን',
    icon: BookOpen,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15 border-purple-500/30',
    sampleQuestion: 'Teach me Ge\'ez numbers from 1 to 10 and their Tigrinya meaning.',
    sampleQuestionTi: 'ናይ ግእዝ ቁጽርታት ካብ ፩ ክሳብ ፲ ምስ ኣጸሓሕፍኦም ግለጸለይ።',
  },
  {
    id: 'history',
    name: 'History & Culture',
    nameTi: 'ታሪኽን ባህልን',
    icon: History,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/15 border-rose-500/30',
    sampleQuestion: 'What is the history of the ancient Kingdom of Aksum?',
    sampleQuestionTi: 'ዛንታን ስልጣነን ጥንታዊት መንግስቲ ኣክሱም እንታይ ይመስል?',
  },
  {
    id: 'scholarship',
    name: 'Scholarships & SOP',
    nameTi: 'ስኮላርሺፕን ድርሳንን',
    icon: GraduationCap,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15 border-amber-500/30',
    sampleQuestion: 'How do I write a winning Statement of Purpose (SOP) for a master scholarship?',
    sampleQuestionTi: 'ንናጻ ትምህርቲ (Scholarship) ዝኸውን ጽፉፍ ናይ ደብዳበ ድርሳን (SOP) ከመይ ገይረ የዳልው?',
  },
  {
    id: 'coding',
    name: 'Coding & AI',
    nameTi: 'ኮዲንግን ቴክኖሎጂን',
    icon: Code,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/15 border-cyan-500/30',
    sampleQuestion: 'Explain Python variables and loops for beginners.',
    sampleQuestionTi: 'መሰረታዊ ናይ Python ኮዲንግ ንጀመርቲ ብቐሊሉ ኣረድኣኒ።',
  },
];

const SAMPLE_QUIZZES = [
  {
    question: 'ዋና ከተማ ጥንታዊት መንግስቲ ኣክሱም እንታይ ነበረት?',
    options: ['ኣክሱም', 'ኣድሊስ', 'ቆሃይቶ', 'መተራ'],
    correct: 0,
    explanation: 'ኣክሱም እታ ቀንዲ ማእከል ንግድን ስልጣነን ዝነበረት ጥንታዊት ከተማ እያ።',
  },
  {
    question: 'ናይ ሒሳብ ሕቶ፡ 12 × 12 ክንደይ እዩ?',
    options: ['124', '144', '132', '156'],
    correct: 1,
    explanation: '12 × 12 = 144 እዩ።',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
    explanation: 'Mars is called the Red Planet because of iron oxide on its surface.',
  },
];

export const EducationAiModal: React.FC<EducationAiModalProps> = ({
  isOpen,
  onClose,
  onNavigateToChat,
  user,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<'tutor' | 'homework' | 'quiz'>('tutor');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(SUBJECTS[0]);
  const [questionInput, setQuestionInput] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const [guestLimitState, setGuestLimitState] = useState(() =>
    checkGuestLimit('tutor', user?.email, user?.role)
  );

  useEffect(() => {
    setGuestLimitState(checkGuestLimit('tutor', user?.email, user?.role));
  }, [user]);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleAskQuestion = (promptText?: string) => {
    const textToAsk = promptText || questionInput;
    if (!textToAsk.trim()) return;

    // Check guest limit
    const currentLimit = checkGuestLimit('tutor', user?.email, user?.role);
    if (!currentLimit.allowed) {
      setGuestLimitState(currentLimit);
      setAiAnswer(`⚠️ **Guest Tutor Limit Reached** (${currentLimit.max}/${currentLimit.max})\n\nከም ጋሻ መጠን ዝተፈቕደልኩም ናይ ትምህርቲ AI ሕቶታት ተወዲኡ እዩ። ምሉእ ግልጋሎት ንምርካብ ተመዝገቡ ወይ እተዉ።`);
      return;
    }

    incrementGuestUsage('tutor', user?.email, user?.role);
    setGuestLimitState(checkGuestLimit('tutor', user?.email, user?.role));

    setIsAnswering(true);
    setAiAnswer(null);

    setTimeout(() => {
      setIsAnswering(false);
      let simulated = '';
      if (selectedSubject.id === 'math') {
        simulated = `📐 **ናይ ሒሳብ መፍትሒ (Step-by-Step Solution):**\n\n**ሕቶ:** ${textToAsk}\n\n1. **ደረጃ 1:** 2x + 15 = 45\n2. **ደረጃ 2:** ካብ ክልቲኡ ወገን 15 ነጉድል:\n   2x = 45 - 15\n   2x = 30\n3. **ደረጃ 3:** ንክልቲኡ ብ 2 ንመቅሎ:\n   x = 30 / 2\n   **x = 15** ✓\n\n💡 **ምኽሪ:** ውጽኢትኩም ንምርግጋጽ x ኣብ ቦትኡ ኣእትዩ ፈትኑ (2(15) + 15 = 30 + 15 = 45).`;
      } else if (selectedSubject.id === 'science') {
        simulated = `🌱 **ናይ ሳይንስ መብርሂ (Scientific Explanation):**\n\n**ሕቶ:** ${textToAsk}\n\n**ፎቶሲንተሲስ (Photosynthesis)** ማለት ተክሊታት ብሓገዝ ጸሓይ፡ ማይን ካርቦን ዳይኦክሳይድን ተጠቒሞም ናይ ገዛእ ርእሶም ምግቢ (ግሉኮስ) ዘዳልዉሉ መስርሕ እዩ።\n\n- **ዘድልዩ ነገራት:** ብርሃን ጸሓይ + CO₂ + ማይ\n- **ዝወጽእ ውጽኢት:** ኦክሲጅን (ንሕና እንተንፍሶ) + ግሉኮስ (ምግቢ ተክሊ)\n\nፎርሙላ: 6CO₂ + 6H₂O + ብርሃን ➔ C₆H₁₂O₆ + 6O₂`;
      } else if (selectedSubject.id === 'scholarship') {
        simulated = `🎓 **ናይ ስኮላርሺፕን ድርሳንን ምኽሪ (Scholarship & SOP Guide):**\n\n**ሕቶ:** ${textToAsk}\n\n1. **ሓያል መእተዊ (Compelling Hook):** ናብቲ ዓውዲ ዘእተወኩም ናይ ብሓቂ ተመክሮ ግለጹ።\n2. **ትምህርታውን ሞያውን ድሕረ-ባይታ:** ኣብ ዩኒቨርሲቲ ወይ ስራሕ ዝገበርኩምዎ ዓበይቲ ዓወታት።\n3. **ስለምንታይ እዚ ዩኒቨርሲቲ/ሃገር:** ስለምንታይ እቲ ፕሮግራም ንዓኻትኩም ከም ዝሰማማዕ ብንጹር ምግላጽ።\n4. **ናይ መጻኢ ውጥን (Future Impact):** ምስ ተመረቕኩም ኣብ ሃገርኩምን ማሕበረሰብኩምን እንታይ ኣበርክቶ ክትገብሩ ከም ዝሓሰብኩም ዘብርህ።\n\n💡 *ምኽሪ:* ኣብቲ ናይ መተግበሪና **ዕድላት ስኮላርሺፕ** ገጽ ብምኻድ ንዓለምለኸ ናጻ ስኮላርሺፖታት ዝኸውን ናይ AI ድርሳን ብቐሊሉ ኣዳልዉ!`;
      } else {
        simulated = `🎓 **ትምህርታዊ መብርሂ (Educational Insight):**\n\n**ሕቶ:** ${textToAsk}\n\nንትምህርቲ ${selectedSubject.nameTi} ብዝምልከት፡ ትክክለኛን ቅልጡፍን መልሲ ኣብ ታሕቲ ቀሪቡ ኣሎ:\n\n• **ቀንዲ ነጥቢ:** እዚ ርእሰ ጉዳይ ንተመሃሮ ኣዝዩ ኣገዳሲ ኮይኑ ኣብ መዓልታዊ ትምህርቲ ዝሕግዝ እዩ።\n• **ተወሳኺ ምኽሪ:** ኣብ ዝኾነ ሰዓት ካልእ ሕቶታት እንተለኩም ብድምጺ ወይ ብጽሑፍ ክትሓቱ ትኽእሉ ኢኹም።`;
      }
      setAiAnswer(simulated);
    }, 900);
  };

  const handleQuizAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setShowQuizResult(true);
    if (optionIndex === SAMPLE_QUIZZES[currentQuizIndex].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setShowQuizResult(false);
    if (currentQuizIndex < SAMPLE_QUIZZES.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setCurrentQuizIndex(0);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg bg-[#0E101B] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* Top Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0C1524] via-[#101E33] to-[#0C1524] border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-md">
                <GraduationCap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-1.5">
                  <span>Education AI</span>
                  <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-1.5 py-0.5 rounded-full font-mono">
                    TUTOR
                  </span>
                </h3>
                <p className="text-xs text-emerald-300/80">
                  AI tutor, homework help & quizzes
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="p-2.5 bg-[#0A0C16] border-b border-slate-800 flex rounded-none gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('tutor')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'tutor'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>ናይ ትምህርቲ ሓጋዚ</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('homework')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'homework'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Homework Solver</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>ፈተናን ኩይዝን ({quizScore})</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1">
            {user?.role === 'Guest' && (
              <GuestLimitBanner
                feature="tutor"
                remaining={guestLimitState.remaining}
                max={guestLimitState.max}
                onOpenUpgradeOrAuth={() => {
                  onClose();
                  if (onOpenAuthModal) onOpenAuthModal('signup');
                }}
              />
            )}
            {activeTab !== 'quiz' && (
              <>
                {/* Subject Selector Pills */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    ርእሰ ጉዳይ ምረጽ (Select Subject):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {SUBJECTS.map((sub) => {
                      const Icon = sub.icon;
                      const isSelected = selectedSubject.id === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setSelectedSubject(sub);
                            setQuestionInput(sub.sampleQuestionTi);
                          }}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-md'
                              : 'bg-[#131627] border-slate-800 text-slate-300 hover:bg-[#181C30]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <Icon className={`w-4 h-4 ${sub.color}`} />
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          </div>
                          <span className="text-[11px] font-bold truncate">{sub.nameTi}</span>
                          <span className="text-[9px] text-slate-400 truncate">{sub.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sample Prompt Chips */}
                <div className="bg-[#121526] p-3 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>ኣብነታዊ ሕቶ (Sample Question):</span>
                    <button
                      type="button"
                      onClick={() => setQuestionInput(selectedSubject.sampleQuestionTi)}
                      className="text-amber-400 hover:underline text-[10px] font-semibold cursor-pointer"
                    >
                      ብትግርኛ ተጠቀም
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAskQuestion(selectedSubject.sampleQuestionTi)}
                    className="w-full text-left p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs text-amber-200 border border-amber-500/20 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <span className="line-clamp-1">{selectedSubject.sampleQuestionTi}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                  </button>
                </div>

                {/* Question Input Box */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    ዝኾነ ሕቶ ወይ ናይ ገዛ ዕዮ ጽሓፍ (Ask Tutor):
                  </label>
                  <div className="relative">
                    <textarea
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      placeholder="ንኣብነት፡ ሒሳብ 3x + 12 = 30 ኣረድኣኒ..."
                      rows={3}
                      className="w-full bg-[#131627] border border-slate-800 focus:border-emerald-500/80 rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAskQuestion()}
                      disabled={isAnswering || !questionInput.trim()}
                      className="absolute right-2.5 bottom-2.5 py-1.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 disabled:opacity-50 text-black font-bold text-xs rounded-xl flex items-center space-x-1 cursor-pointer transition-all shadow-md"
                    >
                      {isAnswering ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <span>ሕተት</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Answer Card */}
                {aiAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D111E] border border-emerald-500/40 text-slate-200 text-xs sm:text-[13px] leading-relaxed space-y-2 shadow-xl whitespace-pre-line"
                  >
                    {aiAnswer}
                  </motion.div>
                )}
              </>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-amber-200">
                      ሕቶ {currentQuizIndex + 1} ካብ {SAMPLE_QUIZZES.length}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ነጥቢ፡ {quizScore}
                  </span>
                </div>

                {/* Quiz Question */}
                <div className="bg-[#131627] border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {SAMPLE_QUIZZES[currentQuizIndex].question}
                  </h4>

                  <div className="space-y-2 pt-2">
                    {SAMPLE_QUIZZES[currentQuizIndex].options.map((opt, idx) => {
                      const isChosen = selectedOption === idx;
                      const isCorrect = idx === SAMPLE_QUIZZES[currentQuizIndex].correct;
                      let btnStyle = 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800';

                      if (showQuizResult) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200';
                        } else if (isChosen) {
                          btnStyle = 'bg-rose-950/80 border-rose-400 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuizAnswer(idx)}
                          disabled={showQuizResult}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {showQuizResult && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResult && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                      <div className="font-bold">መብርሂ (Explanation):</div>
                      <p>{SAMPLE_QUIZZES[currentQuizIndex].explanation}</p>
                    </div>
                  )}
                </div>

                {showQuizResult && (
                  <button
                    type="button"
                    onClick={handleNextQuiz}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs rounded-xl flex items-center justify-center space-x-1 shadow-lg hover:brightness-110 cursor-pointer"
                  >
                    <span>ቀጻሊ ሕቶ (Next Question)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-3 bg-[#0A0C16] border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Axumite AI Education Engine 2026
            </span>
            {onNavigateToChat && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToChat('ሰላም፡ ኣብ ትምህርተይ ክትሕግዘኒ ደልየ።');
                }}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>ናብ ሙሉእ ዕላል ኪድ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
