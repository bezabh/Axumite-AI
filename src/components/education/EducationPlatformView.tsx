import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, BookOpen, Brain, Sparkles, Award, 
  Clock, Flame, CheckCircle, Search, Filter, Plus, 
  Layers, Compass, UserCheck, Play, HelpCircle, Shield, ChevronRight
} from 'lucide-react';
import { Course, Lesson, Certificate, StudentEnrollment, StudentDashboardStats } from '../../types';
import { 
  getAllCourses, 
  getStoredEnrollments, 
  enrollInCourse, 
  getStoredCertificates,
  getStudentDashboardStats 
} from '../../services/educationService';
import { CourseCard } from './CourseCard';
import { CoursePlayerModal } from './CoursePlayerModal';
import { AiTutorChat } from './AiTutorChat';
import { HomeworkAssistant } from './HomeworkAssistant';
import { LanguageLearningLab } from './LanguageLearningLab';
import { StudyMaterialsHub } from './StudyMaterialsHub';
import { PersonalizedPathBuilder } from './PersonalizedPathBuilder';
import { QuizExamModal } from './QuizExamModal';
import { CertificateModal } from './CertificateModal';
import { TeacherAdminDashboard } from './TeacherAdminDashboard';

interface EducationPlatformViewProps {
  onOpenPricingModal?: () => void;
  isUserSubscribed?: boolean;
  preferredLanguage?: 'en' | 'ti';
}

export const EducationPlatformView: React.FC<EducationPlatformViewProps> = ({
  onOpenPricingModal,
  isUserSubscribed = false,
  preferredLanguage = 'ti',
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'courses' | 'tutor' | 'homework' | 'language' | 'flashcards' | 'paths' | 'teacher'
  >('dashboard');

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, StudentEnrollment>>({});
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [filterPricing, setFilterPricing] = useState<'all' | 'free' | 'premium'>('all');

  // Modal States
  const [selectedCourseForPlayer, setSelectedCourseForPlayer] = useState<Course | null>(null);
  const [quizModalState, setQuizModalState] = useState<{
    isOpen: boolean;
    course: Course | null;
    quizType: 'lesson_quiz' | 'final_exam';
    lesson?: Lesson;
  }>({
    isOpen: false,
    course: null,
    quizType: 'lesson_quiz',
  });
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const refreshData = () => {
    const allC = getAllCourses();
    setCourses(allC);
    setEnrollments(getStoredEnrollments());
    setCertificates(getStoredCertificates());
    setStats(getStudentDashboardStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseForPlayer(course);
  };

  const handleEnrollCourse = (course: Course) => {
    if (course.isPremium && !isUserSubscribed) {
      if (onOpenPricingModal) {
        onOpenPricingModal();
        return;
      }
    }
    enrollInCourse(course.id);
    refreshData();
    setSelectedCourseForPlayer(course);
  };

  const handleOpenQuiz = (quizType: 'lesson_quiz' | 'final_exam', lesson?: Lesson) => {
    if (!selectedCourseForPlayer) return;
    setQuizModalState({
      isOpen: true,
      course: selectedCourseForPlayer,
      quizType,
      lesson,
    });
  };

  const handleCertificateEarned = (cert: Certificate) => {
    setActiveCertificate(cert);
    setIsCertModalOpen(true);
    refreshData();
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.titleTi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || c.level === selectedLevel;
    const matchesPricing = 
      filterPricing === 'all' || 
      (filterPricing === 'free' && !c.isPremium) || 
      (filterPricing === 'premium' && c.isPremium);

    return matchesSearch && matchesCategory && matchesLevel && matchesPricing;
  });

  const enrolledCourseIds = Object.keys(enrollments);
  const myEnrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6" id="education-platform-view">
      {/* Sovereign Education Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#18140a] border border-amber-500/40 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{preferredLanguage === 'ti' ? 'ኣክሱማዊ AI ናይ ትምህርቲ ማእከል' : 'Axumite AI Sovereign Educational Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500">
              {preferredLanguage === 'ti' ? 'ተማሃር፡ ተለማመድ፡ ብ AI ተዓወት' : 'Learn, Practice & Master with AI'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {preferredLanguage === 'ti'
                ? 'ናይ ሒሳብን ሳይንስን ካልኩለስ፡ ጥንታዊ ቋንቋ ግእዝ፡ AI ኢንጂነሪንግ፡ ሕክምናን ዓለምለኸ ስኮላርሺፕን ብደረጃ ዝምህር ልዑላዊ መድረኽ።'
                : 'Socratic AI Tutoring, STEM problem solving, Ge\'ez epigraphy, full-stack AI engineering, interactive quizzes, and verified credentials.'}
            </p>
          </div>

          {/* Quick Metrics Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-2xl text-center space-y-0.5 shadow-md">
                <span className="text-[11px] text-zinc-400 font-medium">{preferredLanguage === 'ti' ? 'ተመዝጊበ' : 'Enrolled'}</span>
                <p className="text-lg font-bold text-amber-400">{stats.totalCoursesEnrolled}</p>
              </div>
              <div className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-2xl text-center space-y-0.5 shadow-md">
                <span className="text-[11px] text-zinc-400 font-medium">{preferredLanguage === 'ti' ? 'ሰዓታት' : 'Hours'}</span>
                <p className="text-lg font-bold text-cyan-400">{stats.totalStudyHours}h</p>
              </div>
              <div className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-2xl text-center space-y-0.5 shadow-md col-span-2 sm:col-span-1">
                <span className="text-[11px] text-zinc-400 font-medium">{preferredLanguage === 'ti' ? 'ሰርቲፊኬት' : 'Certs'}</span>
                <p className="text-lg font-bold text-emerald-400">{stats.certificatesEarnedCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-800">
        {[
          { id: 'dashboard', labelEn: 'Student Dashboard', labelTi: 'ናተይ ደሽቦርድ', icon: GraduationCap },
          { id: 'courses', labelEn: 'Course Catalog', labelTi: 'ዝርዝር ኮርሳት', icon: BookOpen },
          { id: 'tutor', labelEn: 'AI Master Tutor', labelTi: 'AI መምህር', icon: Brain },
          { id: 'homework', labelEn: 'Homework Solver', labelTi: 'መፍቲሒ ናይ ገዛ ዕዮ', icon: HelpCircle },
          { id: 'language', labelEn: "Ge'ez & Fidel Lab", labelTi: 'ላቦራቶሪ ግእዝ', icon: Compass },
          { id: 'flashcards', labelEn: 'Flashcards & Notes', labelTi: 'ካርታታትን ጽሟቕን', icon: Layers },
          { id: 'paths', labelEn: 'Learning Paths', labelTi: 'ናይ ትምህርቲ መደብ', icon: Sparkles },
          { id: 'teacher', labelEn: 'Teacher Studio', labelTi: 'ናይ መምህራን ስቱድዮ', icon: UserCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              id={`edu-tab-${tab.id}`}
            >
              <Icon className="w-4 h-4" />
              <span>{preferredLanguage === 'ti' ? tab.labelTi : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: STUDENT DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Active Courses in Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-400" />
                {preferredLanguage === 'ti' ? 'ዝጀመርካዮም ትምህርትታት' : 'Continue Learning (In Progress)'}
              </h2>
              <button
                onClick={() => setActiveTab('courses')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>{preferredLanguage === 'ti' ? 'ኩሎም ኮርሳት ርአ' : 'Browse All Courses'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {myEnrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEnrolledCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrollment={enrollments[course.id]}
                    onSelectCourse={handleSelectCourse}
                    onEnroll={handleEnrollCourse}
                    preferredLanguage={preferredLanguage}
                    isUserSubscribed={isUserSubscribed}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-zinc-500 mx-auto" />
                <p className="text-sm font-semibold text-zinc-300">
                  {preferredLanguage === 'ti' ? 'ዝተመዝገብካሉ ኮርስ የለን' : 'No Enrolled Courses Yet'}
                </p>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md inline-flex items-center gap-2"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{preferredLanguage === 'ti' ? 'ኮርሳት ምረጽ' : 'Explore Course Catalog'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Earned Certificates Grid */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                {preferredLanguage === 'ti' ? 'ዝተዓደልካዮም ወግዓዊ ምስክር ወረቐትታት' : 'Earned Verified Credentials'}
              </h2>
            </div>

            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map(cert => (
                  <div
                    key={cert.id}
                    className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-xl hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-zinc-100 truncate">
                          {preferredLanguage === 'ti' ? cert.courseTitleTi : cert.courseTitleEn}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate">
                          Score: <strong className="text-amber-400">{cert.scorePercent}%</strong> • {cert.issueDate}
                        </p>
                        <span className="text-[10px] font-mono text-zinc-500 truncate block">
                          ID: {cert.certificateNumber}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveCertificate(cert);
                        setIsCertModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 border border-amber-500/30 text-xs font-bold transition-all shrink-0"
                    >
                      {preferredLanguage === 'ti' ? 'ሰርቲፊኬት ርአ' : 'View Cert'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl text-center text-xs text-zinc-400">
                {preferredLanguage === 'ti'
                  ? 'ዝኾነ ኮርስ ወዲእካ 80%+ እንተኣምጺእካ ወግዓዊ ሰርቲፊኬት ኣብዚ ይወሃበካ።'
                  : 'Complete all lessons of a course and score 80%+ on the final exam to earn official credentials.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: COURSE CATALOG */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Search & Filter Controls */}
          <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={preferredLanguage === 'ti' ? 'ኮርስ ብኣርእስቲ ወይ መምህር ድለ...' : 'Search courses by title, topic, or instructor...'}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
              >
                <option value="all">{preferredLanguage === 'ti' ? 'ኩሎም ዓውድታት' : 'All Categories'}</option>
                <option value="stem">STEM & Mathematics</option>
                <option value="geez_language">Ge'ez & Semitic</option>
                <option value="computer_science">AI & Computer Science</option>
                <option value="medicine">Medicine & Health</option>
                <option value="scholarships_prep">Global Scholarships</option>
              </select>

              <select
                value={filterPricing}
                onChange={e => setFilterPricing(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
              >
                <option value="all">{preferredLanguage === 'ti' ? 'ኩሉ ዋጋ' : 'All Access'}</option>
                <option value="free">{preferredLanguage === 'ti' ? 'ነጻ ጥራይ' : 'Free Access'}</option>
                <option value="premium">{preferredLanguage === 'ti' ? 'ልዑላዊ ፕሮ' : 'PRO Tier'}</option>
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                enrollment={enrollments[course.id]}
                onSelectCourse={handleSelectCourse}
                onEnroll={handleEnrollCourse}
                preferredLanguage={preferredLanguage}
                isUserSubscribed={isUserSubscribed}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16 text-zinc-500 text-sm">
              {preferredLanguage === 'ti' ? 'ዝተረኽበ ኮርስ የለን። ፍለሻኻ ኣስተኻኽል።' : 'No courses matching your filter criteria.'}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: AI SOCRATIC TUTOR */}
      {activeTab === 'tutor' && <AiTutorChat preferredLanguage={preferredLanguage} />}

      {/* VIEW 4: HOMEWORK & PROBLEM SOLVER */}
      {activeTab === 'homework' && <HomeworkAssistant preferredLanguage={preferredLanguage} />}

      {/* VIEW 5: GEEZ & FIDEL LAB */}
      {activeTab === 'language' && <LanguageLearningLab preferredLanguage={preferredLanguage} />}

      {/* VIEW 6: FLASHCARDS & STUDY MATERIALS */}
      {activeTab === 'flashcards' && <StudyMaterialsHub preferredLanguage={preferredLanguage} />}

      {/* VIEW 7: PERSONALIZED LEARNING PATHS */}
      {activeTab === 'paths' && <PersonalizedPathBuilder preferredLanguage={preferredLanguage} />}

      {/* VIEW 8: TEACHER & ADMIN STUDIO */}
      {activeTab === 'teacher' && (
        <TeacherAdminDashboard
          courses={courses}
          onCourseCreated={newC => {
            refreshData();
          }}
          preferredLanguage={preferredLanguage}
        />
      )}

      {/* Course Player Modal */}
      {selectedCourseForPlayer && (
        <CoursePlayerModal
          course={selectedCourseForPlayer}
          enrollment={enrollments[selectedCourseForPlayer.id]}
          isOpen={!!selectedCourseForPlayer}
          onClose={() => setSelectedCourseForPlayer(null)}
          onOpenQuiz={handleOpenQuiz}
          onEnrollmentUpdated={refreshData}
          preferredLanguage={preferredLanguage}
        />
      )}

      {/* Quiz & Exam Modal */}
      {quizModalState.isOpen && quizModalState.course && (
        <QuizExamModal
          isOpen={quizModalState.isOpen}
          onClose={() => setQuizModalState(prev => ({ ...prev, isOpen: false }))}
          course={quizModalState.course}
          quizType={quizModalState.quizType}
          lesson={quizModalState.lesson}
          onCertificateEarned={handleCertificateEarned}
          preferredLanguage={preferredLanguage}
        />
      )}

      {/* Official Certificate Modal */}
      <CertificateModal
        certificate={activeCertificate}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        preferredLanguage={preferredLanguage}
      />
    </div>
  );
};
