import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle, AlertCircle, Award, Clock, ArrowRight, 
  RotateCw, Sparkles, HelpCircle, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import { Course, QuizQuestion, Lesson, Certificate } from '../../types';
import { issueCertificate, enrollInCourse } from '../../services/educationService';

interface QuizExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  quizType: 'lesson_quiz' | 'final_exam';
  lesson?: Lesson;
  onCertificateEarned: (certificate: Certificate) => void;
  preferredLanguage?: 'en' | 'ti';
}

export const QuizExamModal: React.FC<QuizExamModalProps> = ({
  isOpen,
  onClose,
  course,
  quizType,
  lesson,
  onCertificateEarned,
  preferredLanguage = 'ti',
}) => {
  const isFinalExam = quizType === 'final_exam';
  const questions: QuizQuestion[] = isFinalExam
    ? (course.finalExam && course.finalExam.length > 0 ? course.finalExam : course.quizzes || [])
    : (course.quizzes || []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(isFinalExam ? 15 * 60 : 5 * 60); // 15 mins for final, 5 mins for quiz
  const [issuedCert, setIssuedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCurrentIdx(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setTimeLeft(isFinalExam ? 15 * 60 : 5 * 60);
      setIssuedCert(null);
    }
  }, [isOpen, isFinalExam]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (isFinalExam && score >= 80) {
      const cert = issueCertificate('ጋሻ (Axumite Scholar)', 'scholar@axumite.ai', course, score);
      setIssuedCert(cert);
      onCertificateEarned(cert);
    }
  };

  const score = calculateScore();
  const passed = score >= 80;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden"
          id="quiz-exam-modal"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isFinalExam ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}>
                {isFinalExam ? <Award className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-100">
                  {isFinalExam 
                    ? (preferredLanguage === 'ti' ? 'ናይ መደምደምታ ዓቢ ፈተና (Certification Exam)' : 'Official Certification Exam')
                    : (preferredLanguage === 'ti' ? 'ናይ ትምህርቲ ፈተና (Lesson Quiz)' : 'Lesson Knowledge Check')}
                </h3>
                <p className="text-xs text-zinc-400">
                  {preferredLanguage === 'ti' ? course.titleTi : course.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isSubmitted && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                </div>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isSubmitted ? (
            /* Active Quiz Interface */
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                <span className="text-amber-400">
                  {preferredLanguage === 'ti' ? 'ሕቶ' : 'Question'} {currentIdx + 1} / {questions.length}
                </span>
                <span>
                  {Object.keys(selectedAnswers).length} / {questions.length} {preferredLanguage === 'ti' ? 'ተመሊሶም' : 'answered'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-bold text-zinc-100 leading-snug">
                  {preferredLanguage === 'ti' ? currentQ.questionTi : currentQ.questionEn}
                </h4>
                <p className="text-xs text-zinc-400 font-mono">
                  {preferredLanguage === 'ti' ? currentQ.questionEn : currentQ.questionTi}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {(preferredLanguage === 'ti' ? currentQ.optionsTi : currentQ.optionsEn).map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs text-zinc-300 transition-colors"
                >
                  {preferredLanguage === 'ti' ? 'ቀዳማይ' : 'Previous'}
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md"
                  >
                    {preferredLanguage === 'ti' ? 'ቀጻሊ' : 'Next'}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs transition-all shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {preferredLanguage === 'ti' ? 'ፈተና መደምድም' : 'Submit Exam'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6 text-center py-4">
              <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
                passed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black text-zinc-100">
                  {score}%
                </h4>
                <p className="text-sm font-bold text-zinc-200">
                  {passed
                    ? (preferredLanguage === 'ti' ? 'እንቋዕ ሓጎሰካ! ብዓወት ሓሊፍካዮ ኣለኻ!' : 'Congratulations! You have passed the assessment!')
                    : (preferredLanguage === 'ti' ? 'ንሕልፊ 80%+ የድሊ። ደጊምካ ፈትን!' : 'Passing score is 80%+. Please review the lessons and retake!')}
                </p>
              </div>

              {/* Certificate Alert Banner if passed final exam */}
              {isFinalExam && passed && issuedCert && (
                <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{preferredLanguage === 'ti' ? 'ናይ ብቕዓት ምስክር ወረቐት ተዓዲልካ ኣሎ!' : 'Official Certificate Issued!'}</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    {preferredLanguage === 'ti'
                      ? `ናይ ምስክር ወረቐት ቁጽሪ: ${issuedCert.certificateNumber} ምስ 95%+ ብቕዓት ተመዝጊቡ ኣሎ።`
                      : `Certificate Number: ${issuedCert.certificateNumber} is cryptographically recorded in your student profile.`}
                  </p>
                </div>
              )}

              {/* Question Review Breakdown */}
              <div className="text-left space-y-3 max-h-60 overflow-y-auto p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {preferredLanguage === 'ti' ? 'ዝርዝር መልስታት:' : 'Question Review & Explanations:'}
                </h5>
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctAnswerIndex;
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-200">
                          {idx + 1}. {preferredLanguage === 'ti' ? q.questionTi : q.questionEn}
                        </span>
                        <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[11px]">
                        {preferredLanguage === 'ti' ? q.explanationTi : q.explanationEn}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedAnswers({});
                    setTimeLeft(isFinalExam ? 15 * 60 : 5 * 60);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{preferredLanguage === 'ti' ? 'ደጊምካ ፈትን' : 'Retake'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md"
                >
                  {preferredLanguage === 'ti' ? 'ዕጾ' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
