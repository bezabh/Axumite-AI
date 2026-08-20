import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, BookOpen, Users, DollarSign, TrendingUp, 
  Video, FileText, CheckCircle2, Award, Sparkles, Trash2, Eye 
} from 'lucide-react';
import { Course, TeacherCourseDraft } from '../../types';
import { saveTeacherCourse } from '../../services/educationService';

interface TeacherAdminDashboardProps {
  courses: Course[];
  onCourseCreated: (course: Course) => void;
  preferredLanguage?: 'en' | 'ti';
}

export const TeacherAdminDashboard: React.FC<TeacherAdminDashboardProps> = ({
  courses,
  onCourseCreated,
  preferredLanguage = 'ti',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'create' | 'students' | 'analytics'>('courses');
  
  // New Course Draft State
  const [titleEn, setTitleEn] = useState('');
  const [titleTi, setTitleTi] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descTi, setDescTi] = useState('');
  const [category, setCategory] = useState<'stem' | 'geez_language' | 'computer_science' | 'medicine' | 'scholarships_prep'>('computer_science');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isPremium, setIsPremium] = useState(false);
  const [priceUsd, setPriceUsd] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  // Lessons Draft State
  const [lessonsDraft, setLessonsDraft] = useState<Array<{
    title: string;
    titleTi: string;
    durationMinutes: number;
    videoUrl: string;
    summaryEn: string;
    summaryTi: string;
    contentMarkdownEn: string;
    contentMarkdownTi: string;
    isFreePreview: boolean;
  }>>([
    {
      title: 'Course Introduction & Foundations',
      titleTi: 'መእተዊ ትምህርትን መሰረታዊ ፍልጠትን',
      durationMinutes: 20,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      summaryEn: 'Comprehensive overview of course objectives and prerequisites.',
      summaryTi: 'ናይዚ ኮርስ ቀንዲ ዕላማታትን ዘድልዩ ፍልጠታትን ምልላይ።',
      contentMarkdownEn: '### Lesson 1 Objectives\nMaster core foundational frameworks and practical paradigms.',
      contentMarkdownTi: '### ዕላማታት ትምህርቲ 1\nቀንዲ መትከላትን ኣሰራርዓታትን ብዕምቆት ምምሃር።',
      isFreePreview: true,
    }
  ]);

  const handleAddLessonDraft = () => {
    setLessonsDraft(prev => [
      ...prev,
      {
        title: `Lesson ${prev.length + 1}: Core Deep Dive`,
        titleTi: `ትምህርቲ ${prev.length + 1}: ዓሚቝ ፍልጠት`,
        durationMinutes: 25,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summaryEn: 'Detailed analytical problem solving and case study.',
        summaryTi: 'ዝርዝር ጸገማት ምፍታሕን ኣብነታትን።',
        contentMarkdownEn: '### Core Principles\nDerivations and proofs.',
        contentMarkdownTi: '### ቀንዲ መትከላት\nስሌታትን መረጋገጽን።',
        isFreePreview: false,
      }
    ]);
  };

  const handleRemoveLessonDraft = (index: number) => {
    setLessonsDraft(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !titleTi.trim()) return;

    const draft: TeacherCourseDraft = {
      title: titleEn,
      titleTi: titleTi,
      descriptionEn: descEn || 'Comprehensive course by verified instructor.',
      descriptionTi: descTi || 'ብመምህር ዝተዳለወ ምሉእ ኮርስ።',
      category,
      level,
      isPremium,
      priceUsd: isPremium ? priceUsd : 0,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      lessons: lessonsDraft,
    };

    const saved = saveTeacherCourse(draft, 'መምህር ኣክሱማዊ (Instructor)');
    onCourseCreated(saved);
    setActiveSubTab('courses');

    // Reset form
    setTitleEn('');
    setTitleTi('');
    setDescEn('');
    setDescTi('');
    setThumbnailUrl('');
  };

  // Mock student roster for instructor review
  const mockStudents = [
    { name: 'Becky Love', email: 'beckylove2004@gmail.com', enrolledCourses: 3, completed: 2, avgScore: '96%', status: 'Active' },
    { name: 'Dr. Tedros M.', email: 'tedros@gmail.com', enrolledCourses: 2, completed: 1, avgScore: '92%', status: 'Active' },
    { name: 'Selamawit G.', email: 'selam@axumite.ai', enrolledCourses: 4, completed: 3, avgScore: '94%', status: 'Graduated' },
    { name: 'Mussie K.', email: 'mussie@outlook.com', enrolledCourses: 1, completed: 0, avgScore: '88%', status: 'Active' },
  ];

  return (
    <div className="space-y-6" id="teacher-admin-dashboard">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/5 to-transparent p-6 rounded-2xl border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-100">
              {preferredLanguage === 'ti' ? 'ናይ መምህራንን ኣመሓዳሪን ስቱድዮ' : 'Teacher & Instructor Studio'}
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              Course Creator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            {preferredLanguage === 'ti'
              ? 'ሓደስቲ ኮርሳት ምፍጣር፡ ቪድዮታት ምዕራፍ፡ ተመሃሮ ምምሕዳርን ናይ ትምህርቲ ክፍሊት ምርኣይን።'
              : 'Create & publish video courses, manage curriculum, monitor student exam scores, and view tuition revenue.'}
          </p>
        </div>

        {/* Subtab navigation */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'courses' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {preferredLanguage === 'ti' ? 'ኮርሳት' : 'Courses'}
          </button>
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'create' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {preferredLanguage === 'ti' ? '+ ሓዲሽ ፍጠር' : '+ Create Course'}
          </button>
          <button
            onClick={() => setActiveSubTab('students')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'students' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {preferredLanguage === 'ti' ? 'ተመሃሮ' : 'Students'}
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'analytics' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {preferredLanguage === 'ti' ? 'ስታቲስቲክስ' : 'Analytics'}
          </button>
        </div>
      </div>

      {/* Subtab 1: Course list overview */}
      {activeSubTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100">
              {preferredLanguage === 'ti' ? 'ዝተሓተሙ ኮርሳት' : 'Published Courses'} ({courses.length})
            </h3>
            <button
              onClick={() => setActiveSubTab('create')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{preferredLanguage === 'ti' ? 'ሓዲሽ ኮርስ ወስኽ' : 'Add Course'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div
                key={course.id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold">
                      {course.category.toUpperCase()}
                    </span>
                    <span className="text-zinc-400 font-mono">
                      {course.isPremium ? `$${course.priceUsd}` : 'Free'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-100 line-clamp-1">
                    {preferredLanguage === 'ti' ? course.titleTi : course.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {preferredLanguage === 'ti' ? course.descriptionTi : course.descriptionEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {course.enrolledCount} {preferredLanguage === 'ti' ? 'ተመሃሮ' : 'students'}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.lessons.length} {preferredLanguage === 'ti' ? 'ትምህርትታት' : 'lessons'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Create Course Form */}
      {activeSubTab === 'create' && (
        <form onSubmit={handlePublishCourse} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-6 max-w-4xl mx-auto shadow-2xl">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {preferredLanguage === 'ti' ? 'ሓዲሽ ናይ ቪድዮ ኮርስ ምድላው' : 'Architect New Interactive Course'}
            </h3>
            <p className="text-xs text-zinc-400">
              {preferredLanguage === 'ti'
                ? 'ናይ ኮርስ ኣርእስቲ፡ ትሕዝቶ፡ ናይ ቪድዮ ሊንክን ማስታወሻታትን ኣእቱ።'
                : 'Define bilingual course metadata, upload video lesson modules, and set pricing.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Course Title (English)</label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={e => setTitleEn(e.target.value)}
                placeholder="e.g. Modern Ge'ez Epigraphy & Quantum Computing"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">ናይ ኮርስ ኣርእስቲ (ትግርኛ)</label>
              <input
                type="text"
                required
                value={titleTi}
                onChange={e => setTitleTi(e.target.value)}
                placeholder="ንኣብነት: ጥንታዊ ቋንቋ ግእዝን ኳንተም ኮምፒዩቲንግን"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Description (English)</label>
              <textarea
                rows={3}
                value={descEn}
                onChange={e => setDescEn(e.target.value)}
                placeholder="Deep theoretical and applied curriculum..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">መግለጺ (ትግርኛ)</label>
              <textarea
                rows={3}
                value={descTi}
                onChange={e => setDescTi(e.target.value)}
                placeholder="ዓሚቝ ፍልጠትን ተግባራዊ ስራሕን ዘጠቓልል..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="computer_science">AI & Computer Science</option>
                <option value="stem">STEM & Mathematics</option>
                <option value="geez_language">Ge'ez & Philology</option>
                <option value="medicine">Medicine & Health</option>
                <option value="scholarships_prep">Global Scholarships</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Access Model</label>
              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={e => setIsPremium(e.target.checked)}
                    className="rounded bg-zinc-800 border-zinc-700 text-amber-500"
                  />
                  <span>PRO Paid ($19.99)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Lessons Draft Manager */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-200">
                Curriculum Modules & Lessons ({lessonsDraft.length})
              </h4>
              <button
                type="button"
                onClick={handleAddLessonDraft}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lesson</span>
              </button>
            </div>

            <div className="space-y-3">
              {lessonsDraft.map((lesson, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Lesson {idx + 1}</span>
                    {lessonsDraft.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLessonDraft(idx)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={e => {
                        const copy = [...lessonsDraft];
                        copy[idx].title = e.target.value;
                        setLessonsDraft(copy);
                      }}
                      placeholder="Lesson Title (English)"
                      className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200"
                    />
                    <input
                      type="text"
                      value={lesson.titleTi}
                      onChange={e => {
                        const copy = [...lessonsDraft];
                        copy[idx].titleTi = e.target.value;
                        setLessonsDraft(copy);
                      }}
                      placeholder="ናይ ትምህርቲ ኣርእስቲ (ትግርኛ)"
                      className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={lesson.videoUrl}
                      onChange={e => {
                        const copy = [...lessonsDraft];
                        copy[idx].videoUrl = e.target.value;
                        setLessonsDraft(copy);
                      }}
                      placeholder="YouTube Embed URL (e.g. https://www.youtube.com/embed/...)"
                      className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200"
                    />
                    <input
                      type="number"
                      value={lesson.durationMinutes}
                      onChange={e => {
                        const copy = [...lessonsDraft];
                        copy[idx].durationMinutes = Number(e.target.value);
                        setLessonsDraft(copy);
                      }}
                      placeholder="Duration (Minutes)"
                      className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('courses')}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              Publish Course to Academy
            </button>
          </div>
        </form>
      )}

      {/* Subtab 3: Student Roster */}
      {activeSubTab === 'students' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100">
              {preferredLanguage === 'ti' ? 'ዝተመዝገቡ ተመሃሮ' : 'Active Student Enrolled Roster'}
            </h3>
            <span className="text-xs text-zinc-400">Total: {mockStudents.length} Students</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Enrolled Courses</th>
                  <th className="pb-3">Completed</th>
                  <th className="pb-3">Exam Avg</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {mockStudents.map((st, idx) => (
                  <tr key={idx} className="hover:bg-zinc-850/40">
                    <td className="py-3 font-semibold text-zinc-100">{st.name}</td>
                    <td className="py-3 text-zinc-400 font-mono">{st.email}</td>
                    <td className="py-3">{st.enrolledCourses}</td>
                    <td className="py-3 text-emerald-400">{st.completed}</td>
                    <td className="py-3 font-bold text-amber-400">{st.avgScore}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 4: Analytics */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs font-semibold text-zinc-400">Total Enrolled Scholars</span>
            <div className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              <span>12,810</span>
            </div>
            <p className="text-[11px] text-emerald-400">+14% this month</p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs font-semibold text-zinc-400">Course Completion Rate</span>
            <div className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span>88.4%</span>
            </div>
            <p className="text-[11px] text-zinc-400">High exam retention</p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs font-semibold text-zinc-400">Certificates Awarded</span>
            <div className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <span>3,490</span>
            </div>
            <p className="text-[11px] text-zinc-400">Verified QR Credentials</p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs font-semibold text-zinc-400">Est. Subscription Tuition</span>
            <div className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-cyan-400" />
              <span>$24,850</span>
            </div>
            <p className="text-[11px] text-cyan-400">Google Play & Nakfa Pay</p>
          </div>
        </div>
      )}
    </div>
  );
};
