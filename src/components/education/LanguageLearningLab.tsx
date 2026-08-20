import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Volume2, Sparkles, CheckCircle2, RotateCw, 
  HelpCircle, ArrowRight, Award, Compass, Search 
} from 'lucide-react';
import { FIDEL_ALPHABET_MATRIX } from '../../data/educationData';

const ORDERS_HEADER = [
  { name: '1. ግእዝ', vowel: 'ä / e', desc: 'First Order' },
  { name: '2. ካዕብ', vowel: 'u', desc: 'Second Order' },
  { name: '3. ሳልስ', vowel: 'i', desc: 'Third Order' },
  { name: '4. ራብዕ', vowel: 'a', desc: 'Fourth Order (Long)' },
  { name: '5. ኃምስ', vowel: 'e', desc: 'Fifth Order' },
  { name: '6. ሳድስ', vowel: 'ə / none', desc: 'Sixth Order' },
  { name: '7. ሳብዕ', vowel: 'o', desc: 'Seventh Order' },
];

const GEEZ_NUMERALS = [
  { num: 1, geez: '፩', nameTi: 'ሓደ', nameEn: 'One' },
  { num: 2, geez: '፪', nameTi: 'ክልተ', nameEn: 'Two' },
  { num: 3, geez: '፫', nameTi: 'ሰለስተ', nameEn: 'Three' },
  { num: 4, geez: '፬', nameTi: 'ኣርባዕተ', nameEn: 'Four' },
  { num: 5, geez: '፭', nameTi: 'ሓሙሽተ', nameEn: 'Five' },
  { num: 6, geez: '፮', nameTi: 'ሽዱሽተ', nameEn: 'Six' },
  { num: 7, geez: '፯', nameTi: 'ሸውዓተ', nameEn: 'Seven' },
  { num: 8, geez: '፰', nameTi: 'ሸሞንተ', nameEn: 'Eight' },
  { num: 9, geez: '፱', nameTi: 'ትሽዓተ', nameEn: 'Nine' },
  { num: 10, geez: '፲', nameTi: 'ዓሰርተ', nameEn: 'Ten' },
  { num: 20, geez: '፳', nameTi: 'ዕስራ', nameEn: 'Twenty' },
  { num: 30, geez: '፴', nameTi: 'ሰላሳ', nameEn: 'Thirty' },
  { num: 50, geez: '፶', nameTi: 'ሓምሳ', nameEn: 'Fifty' },
  { num: 100, geez: '፻', nameTi: 'ሚእቲ', nameEn: 'One Hundred' },
];

export const LanguageLearningLab: React.FC<{ preferredLanguage?: 'en' | 'ti' }> = ({
  preferredLanguage = 'ti',
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'numerals' | 'practice'>('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>('ሀ');
  const [practiceQuestionIdx, setPracticeQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredMatrix = FIDEL_ALPHABET_MATRIX.filter(
    row => row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           row.translit.toLowerCase().includes(searchQuery.toLowerCase()) ||
           row.orders.some(o => o.includes(searchQuery))
  );

  const speakLetter = (letter: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(letter);
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const practiceDrills = [
    {
      questionEn: 'Which letter represents the 4th order (ራብዕ) of "መ"?',
      questionTi: 'ናይ "መ" ራብዓይ ድምጺ (ራብዕ) ኣየናይ እዩ?',
      options: ['ሙ', 'ሚ', 'ማ', 'ሜ'],
      correctIndex: 2,
      explanation: 'ማ (/ma/) is the 4th order of letter May (መ).'
    },
    {
      questionEn: 'What is the Ge\'ez numeral for the number 7?',
      questionTi: 'ናይ ቁጽሪ ሸውዓተ (7) ናይ ግእዝ ምልክት ኣየናይ እዩ?',
      options: ['፭', '፮', '፯', '፰'],
      correctIndex: 2,
      explanation: '፯ represents the numeral 7 in ancient Ge\'ez script.'
    },
    {
      questionEn: 'What vocalic sound does the 2nd order (ካዕብ) produce?',
      questionTi: 'ካልኣይ ድምጺ (ካዕብ) እንታይ ዓይነት ናይ ድምጺ ለውጢ የርኢ?',
      options: ['/u/ sound (as in ሁ)', '/i/ sound (as in ሂ)', '/e/ sound (as in ሄ)', '/o/ sound (as in ሆ)'],
      correctIndex: 0,
      explanation: 'The 2nd order produces the /u/ vowel sound.'
    }
  ];

  const currentQ = practiceDrills[practiceQuestionIdx];

  const handleSelectPracticeAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === currentQ.correctIndex) {
      setPracticeScore(prev => prev + 1);
    }
  };

  const handleNextPracticeQ = () => {
    if (practiceQuestionIdx < practiceDrills.length - 1) {
      setPracticeQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetPractice = () => {
    setPracticeQuestionIdx(0);
    setSelectedAnswer(null);
    setPracticeScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6" id="language-learning-lab">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-100">
              {preferredLanguage === 'ti' ? 'ናይ ቋንቋ ግእዝን ፊደላትን ላቦራቶሪ' : "Ge'ez Script & Philology Lab"}
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              Interactive Fidel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            {preferredLanguage === 'ti'
              ? 'ሸውዓተ ኣገባባት ፊደላት ግእዝ፡ ስነ-ድምጺ፡ ናይ ቁጽርታት ኣሰራርዓን ናይ ሰዋስው ልምምድን።'
              : 'Interactive 7-order Ethiopic syllable matrix, audio pronunciation drills, and ancient numeral converter.'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'matrix' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {preferredLanguage === 'ti' ? 'ፊደላት (Matrix)' : 'Fidel Matrix'}
          </button>
          <button
            onClick={() => setActiveTab('numerals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'numerals' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {preferredLanguage === 'ti' ? 'ቁጽርታት ግእዝ' : 'Ge\'ez Numerals'}
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'practice' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {preferredLanguage === 'ti' ? 'ናይ ፈተና ልምምድ' : 'Active Drills'}
          </button>
        </div>
      </div>

      {/* Tab 1: 7-Order Fidel Matrix Explorer */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={preferredLanguage === 'ti' ? 'ፊደል ወይ ድምጺ ድለ...' : 'Search fidel by letter, name, or transliteration...'}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-xs text-zinc-400">
              {preferredLanguage === 'ti' ? 'ጠውቕ እሞ ድምጹ ስማዕ' : 'Click any syllable to listen and study'}
            </div>
          </div>

          <div className="overflow-x-auto bg-zinc-900/80 rounded-2xl border border-zinc-800 p-4 shadow-xl">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-amber-400">
                  <th className="p-3 text-left font-bold text-zinc-300">ፊደል (Name)</th>
                  {ORDERS_HEADER.map((ord, idx) => (
                    <th key={idx} className="p-3 font-semibold">
                      <div>{ord.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">({ord.vowel})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-sm">
                {filteredMatrix.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="p-3 text-left">
                      <div className="font-bold text-zinc-200">{row.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{row.translit}</div>
                    </td>
                    {row.orders.map((letter, oIdx) => {
                      const isSelected = selectedLetter === letter;
                      return (
                        <td key={oIdx} className="p-1 sm:p-2">
                          <button
                            onClick={() => {
                              setSelectedLetter(letter);
                              speakLetter(letter);
                            }}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-base sm:text-lg font-bold flex flex-col items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-amber-500 text-zinc-950 scale-110 shadow-lg shadow-amber-500/20'
                                : 'bg-zinc-950/80 text-zinc-200 hover:bg-amber-500/20 hover:text-amber-300 border border-zinc-800/80'
                            }`}
                            title={`Play sound for ${letter}`}
                          >
                            <span>{letter}</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Ge'ez Numerals */}
      {activeTab === 'numerals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {GEEZ_NUMERALS.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 cursor-pointer shadow-lg"
                onClick={() => speakLetter(item.nameTi)}
              >
                <span className="text-3xl font-bold text-amber-400">{item.geez}</span>
                <span className="text-xs font-semibold text-zinc-200">{item.num}</span>
                <div className="text-[11px] text-zinc-400 font-medium">
                  {preferredLanguage === 'ti' ? item.nameTi : item.nameEn}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Numeral Converter */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {preferredLanguage === 'ti' ? 'ስርዓት ኣሃዛት ግእዝ' : 'Ancient Ethiopic Numeral System'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {preferredLanguage === 'ti'
                ? 'ኣብ ጥንታዊ ግእዝ ዜሮ (0) ዝበሃል ምልክት የለን። ቁጽርታት ካብ ፩ ክሳብ ፱ ብቀጥታ ድሕሪኡ ድማ ፲ (10)፡ ፳ (20)፡ ፴ (30) እናተባህሉ ይጸሓፉ። ንኣብነት: 15 ዝበሃል ፲፭ ተባሂሉ ይወሃሃድ።'
                : 'Ge\'ez numerals do not utilize a zero digit. Multiples of ten are combined additively (e.g. 15 is ፲፭). Upper and lower strokes symbolize the sacred seal of antiquity.'}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Practice Drills */}
      {activeTab === 'practice' && (
        <div className="max-w-2xl mx-auto bg-zinc-900/90 rounded-2xl border border-amber-500/30 p-6 space-y-6 shadow-2xl">
          {!quizFinished ? (
            <>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {preferredLanguage === 'ti' ? 'ሕቶ' : 'Question'} {practiceQuestionIdx + 1} / {practiceDrills.length}
                </span>
                <span className="text-xs text-zinc-400">
                  {preferredLanguage === 'ti' ? 'ውጽኢት:' : 'Current Score:'} {practiceScore}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-zinc-100">
                  {preferredLanguage === 'ti' ? currentQ.questionTi : currentQ.questionEn}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === currentQ.correctIndex;
                    const showResult = selectedAnswer !== null;

                    let btnStyle = 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-amber-500/50';
                    if (showResult) {
                      if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                      else if (isSelected) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectPracticeAnswer(idx)}
                        className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1"
                  >
                    <span className="font-bold text-amber-400">
                      {selectedAnswer === currentQ.correctIndex ? '✓ Correct!' : '✗ Not quite:'}
                    </span>
                    <p>{currentQ.explanation}</p>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={selectedAnswer === null}
                  onClick={handleNextPracticeQ}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-bold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <span>{preferredLanguage === 'ti' ? 'ቀጻሊ ሕቶ' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100">
                {preferredLanguage === 'ti' ? 'ልምምድ ተወዲኡ!' : 'Drill Session Completed!'}
              </h3>
              <p className="text-xs text-zinc-400">
                {preferredLanguage === 'ti'
                  ? `ካብ ${practiceDrills.length} ሕቶታት ${practiceScore} መሊስካ።`
                  : `You scored ${practiceScore} out of ${practiceDrills.length} on this Fidel drill.`}
              </p>
              <button
                onClick={handleResetPractice}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md inline-flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>{preferredLanguage === 'ti' ? 'ደጊምካ ፈትን' : 'Practice Again'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
