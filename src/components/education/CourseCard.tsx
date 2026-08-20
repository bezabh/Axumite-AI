import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, Star, Users, Award, Play, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { Course, StudentEnrollment } from '../../types';

interface CourseCardProps {
  course: Course;
  enrollment?: StudentEnrollment;
  onSelectCourse: (course: Course) => void;
  onEnroll: (course: Course) => void;
  preferredLanguage?: 'en' | 'ti';
  isUserSubscribed?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  enrollment,
  onSelectCourse,
  onEnroll,
  preferredLanguage = 'ti',
  isUserSubscribed = false,
}) => {
  const isEnrolled = !!enrollment;
  const completedLessonsCount = enrollment?.completedLessonIds?.length || 0;
  const totalLessons = course.lessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
  const isLocked = course.isPremium && !isUserSubscribed && !isEnrolled;

  const categoryLabels: Record<string, { en: string; ti: string; color: string }> = {
    stem: { en: 'STEM & Math', ti: 'ሳይንስን ሒሳብን', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    geez_language: { en: "Ge'ez & Philology", ti: 'ግእዝን ቋንቋን', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    computer_science: { en: 'AI & Computing', ti: 'AIን ኮምፒዩተርን', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    medicine: { en: 'Medicine & Health', ti: 'ሕክምናን ጥዕናን', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    scholarships_prep: { en: 'Global Scholarships', ti: 'ዓለምለኸ ስኮላርሺፕ', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    humanities: { en: 'History & Arts', ti: 'ታሪኽን ስነ-ጥበብን', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  };

  const catMeta = categoryLabels[course.category] || { en: course.category, ti: course.category, color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-amber-500/10"
      id={`course-card-${course.id}`}
    >
      {/* Top Banner & Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {/* Category & Premium Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border backdrop-blur-md ${catMeta.color}`}>
            {preferredLanguage === 'ti' ? catMeta.ti : catMeta.en}
          </span>
          {course.isPremium ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-current" />
              {preferredLanguage === 'ti' ? 'ልዑላዊ ፕሮ' : 'PRO Tier'}
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              {preferredLanguage === 'ti' ? 'ነጻ ትምህርቲ' : 'Free Access'}
            </span>
          )}
        </div>

        {/* Quick Duration / Lessons overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300 backdrop-blur-md bg-zinc-950/60 px-3 py-1.5 rounded-lg border border-zinc-800/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {course.durationHours} hrs
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              {course.lessons.length} {preferredLanguage === 'ti' ? 'ትምህርትታት' : 'lessons'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {course.rating.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Course Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Bilingual Title */}
          <h3 className="font-bold text-lg text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {preferredLanguage === 'ti' ? course.titleTi : course.title}
          </h3>
          <p className="text-xs text-zinc-400 font-mono line-clamp-1">
            {preferredLanguage === 'ti' ? course.title : course.titleTi}
          </p>

          {/* Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {preferredLanguage === 'ti' ? course.descriptionTi : course.descriptionEn}
          </p>
        </div>

        {/* Instructor Row */}
        <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
          <img
            src={course.instructorAvatar}
            alt={course.instructorName}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-amber-500/30"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-zinc-200 truncate">{course.instructorName}</p>
            <p className="text-[11px] text-zinc-400 truncate">
              {preferredLanguage === 'ti' ? course.instructorTitleTi : course.instructorTitle}
            </p>
          </div>
          {course.certificateEligible && (
            <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20" title="Official Verified Certificate Included">
              <Award className="w-3 h-3" />
              <span>{preferredLanguage === 'ti' ? 'ሰርቲፊኬት' : 'Cert'}</span>
            </div>
          )}
        </div>

        {/* Progress Bar if enrolled */}
        {isEnrolled && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-zinc-400">{preferredLanguage === 'ti' ? 'ዕቤት' : 'Progress'}</span>
              <span className="text-amber-400">{progressPercent}% ({completedLessonsCount}/{totalLessons})</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {isEnrolled ? (
            <button
              onClick={() => onSelectCourse(course)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500 hover:to-yellow-500 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-zinc-950 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/20"
              id={`continue-btn-${course.id}`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {enrollment.isCompleted 
                ? (preferredLanguage === 'ti' ? 'ትምህርቲ ደጊምካ ርአ' : 'Review Course')
                : (preferredLanguage === 'ti' ? 'ትምህርቲ ቀጽል' : 'Continue Learning')}
            </button>
          ) : isLocked ? (
            <button
              onClick={() => onEnroll(course)}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-amber-500 text-zinc-300 hover:text-zinc-950 font-semibold text-xs border border-zinc-700 hover:border-amber-400 transition-all duration-300 flex items-center justify-center gap-2"
              id={`unlock-btn-${course.id}`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:text-zinc-950" />
              {preferredLanguage === 'ti' ? 'ብፕሮ ምረጽ ($' + (course.priceUsd || 19.99) + ')' : `Unlock with PRO ($${course.priceUsd || 19.99})`}
            </button>
          ) : (
            <button
              onClick={() => onEnroll(course)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              id={`enroll-btn-${course.id}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {preferredLanguage === 'ti' ? 'ብነጻ ተመዝገብ' : 'Enroll Free Now'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
