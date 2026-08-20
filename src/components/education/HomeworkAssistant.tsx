import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Upload, Sparkles, CheckCircle2, Lightbulb, 
  Calculator, Image as ImageIcon, ArrowRight, HelpCircle, Copy, Check
} from 'lucide-react';
import { HomeworkAnalysis } from '../../types';
import { solveHomeworkProblem } from '../../services/educationService';

export const HomeworkAssistant: React.FC<{ preferredLanguage?: 'en' | 'ti' }> = ({
  preferredLanguage = 'ti',
}) => {
  const [problemText, setProblemText] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<HomeworkAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleProblems = [
    {
      subject: 'Mathematics',
      titleEn: 'Quadratic Optimization',
      titleTi: 'ኳድራቲክ ስሌት',
      text: 'Find the critical points of f(x) = 2x³ - 9x² + 12x + 5 and determine their local extrema.'
    },
    {
      subject: 'Physics',
      titleEn: 'Kinetic Energy & Work',
      titleTi: 'ናይ ሓይሊ ስሌት',
      text: 'A 1200kg electric vehicle accelerates from 0 to 100 km/h in 3.2 seconds. Calculate the net average power output in kilowatts.'
    },
    {
      subject: 'Ge\'ez Philology',
      titleEn: 'Verb Conjugation Paradigm',
      titleTi: 'ኣሰራርዓ ግእዝ ግሲ',
      text: 'Conjugate the root verb ቀተለ (Qatala) in past, present subjunctive, and imperative moods with subject suffixes.'
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!problemText && !selectedImage) return;
    setIsLoading(true);
    try {
      const result = await solveHomeworkProblem(problemText, subject, selectedImage || undefined);
      setAnalysis(result);
    } catch (err) {
      console.error('Homework error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    const text = `${analysis.stepByStepSolutionEn}\n\n---\n${analysis.stepByStepSolutionTi}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="homework-assistant-section">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-100">
              {preferredLanguage === 'ti' ? 'ናይ ገዛ ዕዮን ሒሳብን መፍቲሒ' : 'AI Homework & Problem Solver'}
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              Step-by-Step
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            {preferredLanguage === 'ti'
              ? 'ናይ ሒሳብ፡ ፊዚክስ ወይ ቋንቋ ሕቶታት ብምጽሓፍ ወይ ፎቶ ብምስዳድ ዝርዝር ፍታሕ ረኸብ።'
              : 'Upload problem photos or paste complex STEM questions for instant pedagogical proofs.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 space-y-4">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {preferredLanguage === 'ti' ? 'ዓውዲ ትምህርቲ' : 'Academic Subject'}
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-xl p-3 focus:outline-none focus:border-amber-500"
              >
                <option value="Mathematics">Mathematics (ሒሳብን ካልኩለስን)</option>
                <option value="Physics">Physics (ፊዚክስ)</option>
                <option value="Chemistry">Chemistry (ኬሚስትሪ)</option>
                <option value="Computer Science">Computer Science & AI (ኮምፒዩተር)</option>
                <option value="Ge'ez & Semitic">Ge'ez & Semitic Philology (ግእዝ)</option>
                <option value="Medicine">Medicine & Biology (ሕክምና)</option>
              </select>
            </div>

            {/* Problem text area */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {preferredLanguage === 'ti' ? 'ሕቶኻ ኣብዚ ጽሓፍ' : 'Problem Statement / Equation'}
              </label>
              <textarea
                rows={5}
                value={problemText}
                onChange={e => setProblemText(e.target.value)}
                placeholder={
                  preferredLanguage === 'ti'
                    ? 'ንኣብነት: 2x² - 8x + 6 = 0 ፍታሕ...'
                    : 'e.g. Solve the integral ∫ x·e^(2x) dx using integration by parts...'
                }
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-xl p-3.5 focus:outline-none focus:border-amber-500 resize-none font-mono"
              />
            </div>

            {/* Photo upload dropzone */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>{preferredLanguage === 'ti' ? 'ናይ ወረቐት ፎቶ ስደድ (Photo)' : 'Attach Problem Photo'}</span>
                {selectedImage && (
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    {preferredLanguage === 'ti' ? 'ኣልግስ' : 'Remove Image'}
                  </button>
                )}
              </label>

              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-amber-500/40 aspect-video max-h-40 bg-zinc-950">
                  <img src={selectedImage} alt="Uploaded problem" className="w-full h-full object-contain" />
                </div>
              ) : (
                <label className="cursor-pointer border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-zinc-950/50 transition-colors">
                  <Upload className="w-5 h-5 text-amber-400" />
                  <span className="text-xs text-zinc-400 text-center">
                    {preferredLanguage === 'ti' ? 'ፎቶ ምረጽ ወይ ናብዚ ጎትት' : 'Upload photo or screenshot of textbook'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSolve}
              disabled={(!problemText.trim() && !selectedImage) || isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs sm:text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              id="solve-homework-btn"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{preferredLanguage === 'ti' ? 'ይፈትሕ ኣሎ...' : 'Decomposing Problem...'}</span>
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  <span>{preferredLanguage === 'ti' ? 'ስጉምቲ ብስጉምቲ ፍታሕ' : 'Solve Step-by-Step'}</span>
                </>
              )}
            </button>
          </div>

          {/* Sample problem presets */}
          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-2">
            <p className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              {preferredLanguage === 'ti' ? 'ናሙና ሕቶታት ፈትን:' : 'Try Sample Problems:'}
            </p>
            <div className="space-y-1.5">
              {sampleProblems.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setProblemText(sp.text);
                    setSubject(sp.subject);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-950/70 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-amber-300 truncate transition-all flex items-center justify-between"
                >
                  <span className="truncate">{preferredLanguage === 'ti' ? sp.titleTi : sp.titleEn}</span>
                  <ArrowRight className="w-3 h-3 shrink-0 ml-2 text-zinc-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Solution Breakdown Card (7 cols) */}
        <div className="lg:col-span-7">
          {analysis ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/90 rounded-2xl border border-amber-500/30 p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-100">
                      {preferredLanguage === 'ti' ? 'ዝተረኽበ ሒሳባዊ ፍታሕ' : 'Pedagogical Solution Breakdown'}
                    </h3>
                    <p className="text-xs text-zinc-400">{analysis.subject}</p>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (preferredLanguage === 'ti' ? 'ተቐዲሑ!' : 'Copied!') : (preferredLanguage === 'ti' ? 'ቅዳሕ' : 'Copy')}</span>
                </button>
              </div>

              {/* Hints Box */}
              {analysis.hintsEn && analysis.hintsEn.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>{preferredLanguage === 'ti' ? 'ሓጋዚ ምልክታት (Hints)' : 'Intuitive Hints'}</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1">
                    {(preferredLanguage === 'ti' ? analysis.hintsTi : analysis.hintsEn)?.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formulas Used */}
              {analysis.formulasUsed && analysis.formulasUsed.length > 0 && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {preferredLanguage === 'ti' ? 'ዝተጠቕምናሎም ፎርሙላታት' : 'Key Formulas Applied'}
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {analysis.formulasUsed.map((formula, i) => (
                      <code key={i} className="px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-800 text-amber-300 rounded font-mono">
                        {formula}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Step by step solution in Tigrinya and English */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {preferredLanguage === 'ti' ? 'ስጉምቲ ብስጉምቲ ዝተጻሕፈ ፍታሕ (ትግርኛ)' : 'Tigrinya Explanation'}
                  </h4>
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs sm:text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                    {analysis.stepByStepSolutionTi}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {preferredLanguage === 'ti' ? 'ናይ እንግሊዝኛ ምሉእ ስሌት' : 'English Mathematical Derivation'}
                  </h4>
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs sm:text-sm text-zinc-300 whitespace-pre-line leading-relaxed font-mono">
                    {analysis.stepByStepSolutionEn}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[380px] bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                <HelpCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-300">
                {preferredLanguage === 'ti' ? 'ፍታሕ ንምርኣይ ሕቶኻ ኣብ ጸጋም ኣእቱ' : 'No Problem Solved Yet'}
              </p>
              <p className="text-xs text-zinc-500 max-w-sm">
                {preferredLanguage === 'ti'
                  ? 'ናይ ሒሳብ ሕቶ ጽሓፍ ወይ ፎቶ ስደድ እሞ "ስጉምቲ ብስጉምቲ ፍታሕ" ዝብል ጠውቕ።'
                  : 'Enter an equation or upload an image to receive rigorous step-by-step proofs and explanations.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
