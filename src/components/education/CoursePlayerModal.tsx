import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle, Play, FileText, Award, HelpCircle, 
  ChevronRight, Volume2, Save, Download, Sparkles, BookOpen, Clock, Lock
} from 'lucide-react';
import { Course, Lesson, StudentEnrollment } from '../../types';
import { markLessonComplete, saveLessonNote } from '../../services/educationService';

interface CoursePlayerModalProps {
  course: Course;
  enrollment?: StudentEnrollment;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuiz: (quizType: 'lesson_quiz' | 'final_exam', lesson?: Lesson) => void;
  onEnrollmentUpdated: () => void;
  preferredLanguage?: 'en' | 'ti';
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  enrollment,
  isOpen,
  onClose,
  onOpenQuiz,
  onEnrollmentUpdated,
  preferredLanguage = 'ti',
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'notes' | 'summary' | 'my_notes'>('notes');
  const [personalNote, setPersonalNote] = useState('');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [lang, setLang] = useState<'en' | 'ti'>(preferredLanguage);

  const lessons = course.lessons || [];
  const currentLesson: Lesson | undefined = lessons[currentLessonIndex] || lessons[0];
  const isLessonCompleted = currentLesson && enrollment?.completedLessonIds?.includes(currentLesson.id);

  // Load personal notes for this lesson
  useEffect(() => {
    if (currentLesson && enrollment?.notes && enrollment.notes[currentLesson.id]) {
      setPersonalNote(enrollment.notes[currentLesson.id]);
    } else {
      setPersonalNote('');
    }
  }, [currentLessonIndex, currentLesson, enrollment]);

  if (!isOpen || !currentLesson) return null;

  const handleMarkComplete = () => {
    if (!currentLesson) return;
    markLessonComplete(course.id, currentLesson.id);
    onEnrollmentUpdated();
  };

  const handleSaveNote = () => {
    if (!currentLesson) return;
    saveLessonNote(course.id, currentLesson.id, personalNote);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
    onEnrollmentUpdated();
  };

  const completedCount = enrollment?.completedLessonIds?.length || 0;
  const allLessonsDone = lessons.length > 0 && lessons.every(l => enrollment?.completedLessonIds?.includes(l.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-6xl max-h-[92vh] bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          id="course-player-modal"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-zinc-100 truncate">
                  {lang === 'ti' ? course.titleTi : course.title}
                </h2>
                <p className="text-xs text-zinc-400 truncate">
                  {currentLessonIndex + 1}/{lessons.length}: {lang === 'ti' ? currentLesson.titleTi : currentLesson.title}
                </p>
              </div>
            </div>

            {/* Language switch & close button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-zinc-800/80 rounded-lg p-0.5 border border-zinc-700">
                <button
                  onClick={() => setLang('ti')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    lang === 'ti' ? 'bg-amber-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  ትግርኛ
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    lang === 'en' ? 'bg-amber-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  English
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors"
                id="close-player-modal-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left: Video Player & Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-800 overflow-y-auto">
              {/* Video Container */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`${currentLesson.videoUrl}?autoplay=0&rel=0`}
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Lesson Action Controls */}
              <div className="p-4 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkComplete}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      isLessonCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 border border-zinc-700'
                    }`}
                    id="mark-lesson-complete-btn"
                  >
                    <CheckCircle className={`w-4 h-4 ${isLessonCompleted ? 'fill-emerald-500 text-zinc-950' : ''}`} />
                    {isLessonCompleted
                      ? (lang === 'ti' ? 'ዝተወድአ ትምህርቲ' : 'Lesson Completed')
                      : (lang === 'ti' ? 'ከም ዝተወድአ ምልክት ግበር' : 'Mark as Complete')}
                  </button>

                  {course.quizzes && course.quizzes.length > 0 && (
                    <button
                      onClick={() => onOpenQuiz('lesson_quiz', currentLesson)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
                      id="launch-lesson-quiz-btn"
                    >
                      <HelpCircle className="w-4 h-4" />
                      {lang === 'ti' ? 'ናይዚ ትምህርቲ ፈተና' : 'Lesson Quiz'}
                    </button>
                  )}
                </div>

                {/* Next / Prev Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentLessonIndex === 0}
                    onClick={() => setCurrentLessonIndex(prev => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 disabled:opacity-40 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    {lang === 'ti' ? 'ቀዳማይ' : 'Previous'}
                  </button>
                  <button
                    disabled={currentLessonIndex >= lessons.length - 1}
                    onClick={() => setCurrentLessonIndex(prev => Math.min(lessons.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 disabled:opacity-40 text-xs text-zinc-950 font-bold hover:bg-amber-400 transition-colors"
                  >
                    {lang === 'ti' ? 'ቀጻሊ' : 'Next'}
                  </button>
                </div>
              </div>

              {/* Lesson Notes & Tabs */}
              <div className="p-6 space-y-4">
                <div className="flex border-b border-zinc-800 gap-4">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`pb-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                      activeTab === 'notes'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {lang === 'ti' ? 'ዝርዝር መብርሂ' : 'Lesson Notes'}
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`pb-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                      activeTab === 'summary'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {lang === 'ti' ? 'ቀንዲ ነጥብታት' : 'Key Takeaways'}
                  </button>
                  <button
                    onClick={() => setActiveTab('my_notes')}
                    className={`pb-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                      activeTab === 'my_notes'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {lang === 'ti' ? 'ናተይ ማስታወሻ' : 'My Notebook'}
                  </button>
                </div>

                {/* Tab 1: Detailed Notes */}
                {activeTab === 'notes' && (
                  <div className="text-zinc-300 text-sm leading-relaxed space-y-3 font-sans">
                    <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400">
                      <p className="font-semibold text-zinc-200 mb-1">
                        {lang === 'ti' ? 'ጽሟቕ ትሕዝቶ:' : 'Overview:'}
                      </p>
                      {lang === 'ti' ? currentLesson.summaryTi : currentLesson.summaryEn}
                    </div>
                    <div className="whitespace-pre-line prose prose-invert max-w-none text-xs sm:text-sm">
                      {lang === 'ti' ? currentLesson.contentMarkdownTi : currentLesson.contentMarkdownEn}
                    </div>
                  </div>
                )}

                {/* Tab 2: Key Takeaways */}
                {activeTab === 'summary' && (
                  <div className="space-y-2">
                    {(lang === 'ti' ? currentLesson.keyTakeawaysTi : currentLesson.keyTakeawaysEn)?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                        <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-zinc-200">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Personal Notebook */}
                {activeTab === 'my_notes' && (
                  <div className="space-y-3">
                    <textarea
                      value={personalNote}
                      onChange={e => setPersonalNote(e.target.value)}
                      placeholder={lang === 'ti' ? 'ኣብዚ ናይዚ ትምህርቲ ማስታወሻኻ ጽሓፍ...' : 'Write your study notes and formulas for this lesson...'}
                      rows={5}
                      className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl p-3.5 text-xs focus:outline-none resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        {isSavedToast ? (
                          <span className="text-emerald-400 font-medium">✓ {lang === 'ti' ? 'ተዓቂቡ ኣሎ!' : 'Saved successfully!'}</span>
                        ) : (
                          lang === 'ti' ? 'ማስታወሻኻ ኣብዚ ብሮውዘር ይዕቀብ' : 'Notes are stored locally'
                        )}
                      </span>
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md"
                      >
                        {lang === 'ti' ? 'ዓቅብ' : 'Save Notes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Course Curriculum Playlist & Final Exam (4 cols) */}
            <div className="lg:col-span-4 bg-zinc-900/30 flex flex-col justify-between overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                    {lang === 'ti' ? 'ናይ ትምህርቲ መደብ' : 'Curriculum Playlist'}
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    {completedCount}/{lessons.length} {lang === 'ti' ? 'ተወዲኦም' : 'done'}
                  </span>
                </div>

                {/* Playlist list */}
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => {
                    const isCurrent = idx === currentLessonIndex;
                    const isDone = enrollment?.completedLessonIds?.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonIndex(idx)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500/50 text-zinc-100'
                            : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isDone 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                              : isCurrent 
                              ? 'bg-amber-500 text-zinc-950 font-bold' 
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">
                              {lang === 'ti' ? lesson.titleTi : lesson.title}
                            </p>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.durationMinutes} min
                            </p>
                          </div>
                        </div>

                        {isCurrent && <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Final Exam Box at bottom */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">
                      {lang === 'ti' ? 'ናይ ምስክር ወረቐት ዓቢ ፈተና' : 'Official Certification Exam'}
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      {lang === 'ti' ? '80%+ ኣምጽእ እሞ ሰርቲፊኬትካ ውሰድ' : 'Score 80%+ to unlock official credentials'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenQuiz('final_exam')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                  id="start-final-exam-btn"
                >
                  <Award className="w-4 h-4" />
                  {lang === 'ti' ? 'ናይ መወዳእታ ፈተና ጀምር' : 'Launch Final Exam'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
