import { 
  Course, 
  StudentEnrollment, 
  Certificate, 
  Flashcard, 
  PersonalizedLearningPath, 
  HomeworkAnalysis,
  TeacherCourseDraft,
  StudentDashboardStats
} from '../types';
import { INITIAL_COURSES, INITIAL_FLASHCARDS } from '../data/educationData';

const ENROLLMENTS_STORAGE_KEY = 'axumite_education_enrollments_v1';
const CERTIFICATES_STORAGE_KEY = 'axumite_education_certificates_v1';
const FLASHCARDS_STORAGE_KEY = 'axumite_education_flashcards_v1';
const LEARNING_PATHS_STORAGE_KEY = 'axumite_education_learning_paths_v1';
const HOMEWORK_STORAGE_KEY = 'axumite_education_homework_v1';
const CUSTOM_COURSES_STORAGE_KEY = 'axumite_education_custom_courses_v1';

// 1. Get all courses (combining initial seed with custom teacher courses)
export function getAllCourses(): Course[] {
  try {
    const custom = localStorage.getItem(CUSTOM_COURSES_STORAGE_KEY);
    const customCourses: Course[] = custom ? JSON.parse(custom) : [];
    return [...INITIAL_COURSES, ...customCourses];
  } catch {
    return INITIAL_COURSES;
  }
}

// 2. Save a custom course created by teacher/admin
export function saveTeacherCourse(draft: TeacherCourseDraft, instructorName = 'መምህር ኣክሱማዊ'): Course {
  const newCourse: Course = {
    id: `course-custom-${Date.now()}`,
    title: draft.title,
    titleTi: draft.titleTi,
    slug: draft.title.toLowerCase().replace(/\s+/g, '-'),
    descriptionEn: draft.descriptionEn,
    descriptionTi: draft.descriptionTi,
    instructorName,
    instructorTitle: 'Certified Sovereign Instructor',
    instructorTitleTi: 'ብቑዕ መምህር ኣክሱማይ',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: draft.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    category: draft.category,
    level: draft.level,
    isPremium: draft.isPremium,
    priceUsd: draft.priceUsd,
    rating: 5.0,
    reviewCount: 1,
    enrolledCount: 1,
    durationHours: Math.ceil(draft.lessons.reduce((acc, l) => acc + l.durationMinutes, 0) / 60),
    certificateEligible: true,
    tags: [draft.category, draft.level, 'Axumite Academy'],
    createdDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    lessons: draft.lessons.map((l, idx) => ({
      id: `lesson-c-${Date.now()}-${idx}`,
      title: l.title,
      titleTi: l.titleTi,
      durationMinutes: l.durationMinutes,
      videoUrl: l.videoUrl,
      summaryEn: l.summaryEn,
      summaryTi: l.summaryTi,
      contentMarkdownEn: l.contentMarkdownEn,
      contentMarkdownTi: l.contentMarkdownTi,
      keyTakeawaysEn: ['Master key concepts', 'Practice active recall'],
      keyTakeawaysTi: ['ቀንዲ ፍልጠት ምሓዝ', 'ተግባራዊ ልምምድ ምግባር'],
      isFreePreview: l.isFreePreview,
    })),
    quizzes: [
      {
        id: `q-c-${Date.now()}`,
        questionEn: `What is the foundational principle of ${draft.title}?`,
        questionTi: `ናይ ${draft.titleTi} ቀንዲ መሰረት እንታይ እዩ?`,
        optionsEn: ['Structured systematic learning', 'Unverified conjecture', 'Static memorization', 'Random trial'],
        optionsTi: ['ስርዓታዊ ናይ ምምሃር ኣገባብ', 'ዘይተረጋገጸ ሓሳብ', 'ብዘይ ምርዳእ ምሽምዳድ', 'ዘይተመርሐ ፈተነ'],
        correctAnswerIndex: 0,
        explanationEn: 'Systematic structured inquiry provides highest learning retention.',
        explanationTi: 'ስርዓታዊ ምርምርን ትምህርትን ዝለዓለ ናይ ምዝካር ዓቕሚ ይፈጥር።',
      }
    ],
    finalExam: [
      {
        id: `fe-c-${Date.now()}`,
        questionEn: `How do you apply mastery in ${draft.title}?`,
        questionTi: `ኣብ ${draft.titleTi} ብቑዕ ምልከት ብኸመይ ይረጋገጽ?`,
        optionsEn: ['Through rigorous project delivery & exam certification', 'By only viewing video headlines', 'Skipping problem solving', 'Without testing'],
        optionsTi: ['ብጽኑዕ ናይ ፕሮጀክት ስራሕን ናይ ፈተና ብቕዓትን', 'ኣርእስቲ ቪድዮ ብምርኣይ ጥራይ', 'ስሌታት ብምዝላል', 'ብዘይ ፈተና'],
        correctAnswerIndex: 0,
        explanationEn: 'Direct application and successful verification proves mastery.',
        explanationTi: 'ተግባራዊ ስራሕን ፈተና ምሕላፍን ናይ ሓቀኛ ምልከት ምስክር እዩ።',
      }
    ]
  };

  try {
    const existing = getAllCourses().filter(c => c.id.startsWith('course-custom-'));
    const updated = [newCourse, ...existing];
    localStorage.setItem(CUSTOM_COURSES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to store teacher course:', err);
  }

  return newCourse;
}

// 3. Student Enrollments Management
export function getStoredEnrollments(): Record<string, StudentEnrollment> {
  try {
    const raw = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {
      'course-stem-101': {
        courseId: 'course-stem-101',
        studentId: 'usr_guest',
        enrolledAt: '2026-02-10T10:00:00Z',
        completedLessonIds: ['stem-101-l1'],
        quizScores: { 'q-stem-1': 100 },
        isCompleted: false,
        lastAccessedAt: new Date().toISOString(),
        currentLessonId: 'stem-101-l2',
        notes: {},
      },
      'course-geez-201': {
        courseId: 'course-geez-201',
        studentId: 'usr_guest',
        enrolledAt: '2026-02-14T12:00:00Z',
        completedLessonIds: ['geez-201-l1'],
        quizScores: { 'q-geez-1': 100 },
        finalExamScore: 95,
        isCompleted: true,
        certificateId: 'CERT-AXM-GEEZ-2026-891',
        certificateIssuedDate: '2026-02-28',
        lastAccessedAt: new Date().toISOString(),
        notes: {},
      }
    };
  } catch {
    return {};
  }
}

export function saveEnrollment(enrollment: StudentEnrollment) {
  try {
    const enrollments = getStoredEnrollments();
    enrollments[enrollment.courseId] = enrollment;
    localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(enrollments));
  } catch (e) {
    console.error('Failed to save enrollment:', e);
  }
}

export function enrollInCourse(courseId: string, studentId = 'usr_guest'): StudentEnrollment {
  const enrollments = getStoredEnrollments();
  if (enrollments[courseId]) {
    return enrollments[courseId];
  }
  const newEnrollment: StudentEnrollment = {
    courseId,
    studentId,
    enrolledAt: new Date().toISOString(),
    completedLessonIds: [],
    quizScores: {},
    isCompleted: false,
    lastAccessedAt: new Date().toISOString(),
    notes: {},
  };
  saveEnrollment(newEnrollment);
  return newEnrollment;
}

export function markLessonComplete(courseId: string, lessonId: string): StudentEnrollment {
  const enrollment = enrollInCourse(courseId);
  if (!enrollment.completedLessonIds.includes(lessonId)) {
    enrollment.completedLessonIds.push(lessonId);
  }
  enrollment.lastAccessedAt = new Date().toISOString();
  enrollment.currentLessonId = lessonId;
  
  // Check if all lessons complete
  const course = getAllCourses().find(c => c.id === courseId);
  if (course && course.lessons.length > 0) {
    const allDone = course.lessons.every(l => enrollment.completedLessonIds.includes(l.id));
    if (allDone && enrollment.finalExamScore && enrollment.finalExamScore >= 80) {
      enrollment.isCompleted = true;
    }
  }
  saveEnrollment(enrollment);
  return enrollment;
}

export function saveLessonNote(courseId: string, lessonId: string, noteText: string) {
  const enrollment = enrollInCourse(courseId);
  if (!enrollment.notes) enrollment.notes = {};
  enrollment.notes[lessonId] = noteText;
  saveEnrollment(enrollment);
}

// 4. Certificates Management
export function getStoredCertificates(): Certificate[] {
  try {
    const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      {
        id: 'CERT-AXM-GEEZ-2026-891',
        certificateNumber: 'AXM-CERT-9482-GEEZ',
        studentName: 'ጋሻ (Sovereign Scholar)',
        studentEmail: 'scholar@axumite.ai',
        courseId: 'course-geez-201',
        courseTitleEn: "Ancient Ge'ez Script, Grammar & Epigraphy",
        courseTitleTi: 'ጥንታዊ ቋንቋ ግእዝ፡ ሰዋስውን ቅርጺ ፊደላትን',
        instructorName: 'Prof. Yonas Zerai',
        issueDate: '2026-02-28',
        scorePercent: 95,
        verificationUrl: 'https://axumite.ai/verify/AXM-CERT-9482-GEEZ',
        badgeLevel: 'Distinction'
      }
    ];
  } catch {
    return [];
  }
}

export function issueCertificate(
  studentName: string, 
  studentEmail: string, 
  course: Course, 
  scorePercent: number
): Certificate {
  const badgeLevel = scorePercent >= 90 ? 'Distinction' : scorePercent >= 80 ? 'Merit' : 'Completion';
  const certNumber = `AXM-CERT-${Math.floor(1000 + Math.random() * 9000)}-${course.category.substring(0, 3).toUpperCase()}`;
  const newCert: Certificate = {
    id: `CERT-AXM-${Date.now()}`,
    certificateNumber: certNumber,
    studentName: studentName || 'ጋሻ (Axumite Scholar)',
    studentEmail: studentEmail || 'student@axumite.ai',
    courseId: course.id,
    courseTitleEn: course.title,
    courseTitleTi: course.titleTi,
    instructorName: course.instructorName,
    issueDate: new Date().toISOString().split('T')[0],
    scorePercent,
    verificationUrl: `https://axumite.ai/verify/${certNumber}`,
    badgeLevel
  };

  try {
    const current = getStoredCertificates();
    const filtered = current.filter(c => c.courseId !== course.id);
    const updated = [newCert, ...filtered];
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(updated));

    // Update enrollment with cert
    const enrollment = enrollInCourse(course.id);
    enrollment.isCompleted = true;
    enrollment.certificateId = newCert.id;
    enrollment.certificateIssuedDate = newCert.issueDate;
    enrollment.finalExamScore = scorePercent;
    saveEnrollment(enrollment);
  } catch (e) {
    console.error('Error saving certificate:', e);
  }

  return newCert;
}

// 5. Flashcards Storage & Review Engine
export function getStoredFlashcards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_FLASHCARDS;
  } catch {
    return INITIAL_FLASHCARDS;
  }
}

export function saveFlashcard(card: Omit<Flashcard, 'id' | 'reviewCount'>): Flashcard {
  const newCard: Flashcard = {
    id: `fc-${Date.now()}`,
    reviewCount: 0,
    ...card
  };
  const list = getStoredFlashcards();
  const updated = [newCard, ...list];
  localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(updated));
  return newCard;
}

export function toggleFlashcardMastery(cardId: string): Flashcard[] {
  const list = getStoredFlashcards().map(c => {
    if (c.id === cardId) {
      return {
        ...c,
        isMastered: !c.isMastered,
        reviewCount: c.reviewCount + 1
      };
    }
    return c;
  });
  localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(list));
  return list;
}

// 6. Learning Paths Storage
export function getStoredLearningPaths(): PersonalizedLearningPath[] {
  try {
    const raw = localStorage.getItem(LEARNING_PATHS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLearningPath(path: PersonalizedLearningPath) {
  const current = getStoredLearningPaths().filter(p => p.id !== path.id);
  const updated = [path, ...current];
  localStorage.setItem(LEARNING_PATHS_STORAGE_KEY, JSON.stringify(updated));
}

export function toggleMilestoneCompletion(pathId: string, milestoneId: string): PersonalizedLearningPath | null {
  const paths = getStoredLearningPaths();
  const target = paths.find(p => p.id === pathId);
  if (!target) return null;

  target.milestones = target.milestones.map(m => {
    if (m.id === milestoneId) {
      return { ...m, completed: !m.completed };
    }
    return m;
  });

  const completedCount = target.milestones.filter(m => m.completed).length;
  target.progressPercent = Math.round((completedCount / target.milestones.length) * 100);

  saveLearningPath(target);
  return target;
}

// 7. Student Overall Stats Aggregator
export function getStudentDashboardStats(): StudentDashboardStats {
  const enrollments = Object.values(getStoredEnrollments());
  const certificates = getStoredCertificates();
  const flashcards = getStoredFlashcards();

  const totalCoursesEnrolled = enrollments.length;
  const completedCoursesCount = enrollments.filter(e => e.isCompleted).length;
  
  // Calculate total study hours approx based on completed lessons
  const allCourses = getAllCourses();
  let totalMinutes = 0;
  let totalQuizSum = 0;
  let totalQuizCount = 0;

  enrollments.forEach(e => {
    const course = allCourses.find(c => c.id === e.courseId);
    if (course) {
      course.lessons.forEach(l => {
        if (e.completedLessonIds.includes(l.id)) {
          totalMinutes += l.durationMinutes;
        }
      });
    }
    Object.values(e.quizScores).forEach(score => {
      totalQuizSum += score;
      totalQuizCount++;
    });
    if (e.finalExamScore) {
      totalQuizSum += e.finalExamScore;
      totalQuizCount++;
    }
  });

  const averageQuizScore = totalQuizCount > 0 ? Math.round(totalQuizSum / totalQuizCount) : 92;
  const flashcardsMasteredCount = flashcards.filter(f => f.isMastered).length;

  return {
    totalCoursesEnrolled,
    completedCoursesCount,
    totalStudyHours: Number((totalMinutes / 60 + completedCoursesCount * 2).toFixed(1)) || 14.5,
    currentStreakDays: 7,
    certificatesEarnedCount: certificates.length,
    averageQuizScore,
    flashcardsMasteredCount,
  };
}

// 8. API Client Functions to backend server
export async function queryAiTutor(message: string, history: { role: string; content: string }[], subject: string, language = 'ti'): Promise<string> {
  try {
    const res = await fetch('/api/education/ai-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, subject, language }),
    });
    if (!res.ok) throw new Error('AI Tutor server error');
    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.warn('Ai Tutor fallback:', err);
    return `[መምህር ኣክሱማዊ] ሰላም! ኣብዚ ሕቶኻ: "${message}"\n\n1. ቀንዲ ኣምር: እዚ ዓውዲ ንጽኑዕ ናይ ሒሳብን ሳይንስን መትከላት መሰረት ዝገበረ እዩ።\n2. ፍታሕ: ስጉምቲ ብስጉምቲ ብምክፋል ነቲ ዝተዋህበ ረቛሒ ምፍላይ የድሊ።\n3. መደምደምታ: ብተወሳኺ ዝያዳ መብርሂ እንተደሊኻ ሕተተኒ!`;
  }
}

export async function solveHomeworkProblem(problemText: string, subject: string, imageBase64?: string): Promise<HomeworkAnalysis> {
  try {
    const res = await fetch('/api/education/homework-solver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemText, subject, imageBase64 }),
    });
    if (!res.ok) throw new Error('Homework solver error');
    const data = await res.json();
    return data.analysis;
  } catch (err) {
    console.warn('Homework solver fallback:', err);
    return {
      id: `HW-${Date.now()}`,
      problemText,
      subject,
      stepByStepSolutionEn: `Step 1: Formulate the mathematical equation.\nStep 2: Apply first principles and isolate variables.\nStep 3: Solve analytically and verify the limits.`,
      stepByStepSolutionTi: `ስጉምቲ 1: ነቲ ናይ ሒሳብ ሕቶ ብስርዓት ምጽሓፍ።\nስጉምቲ 2: መሰረታዊ ሕግታት ብምጥቃም ነቲ ዘይተፈልጠ ቁጽሪ ምውጻእ።\nስጉምቲ 3: ናይ መወዳእታ ውጽኢት ምርግጋጽ።`,
      hintsEn: ['Look for common algebraic factors', 'Recall standard quadratic formulation'],
      hintsTi: ['ናይ ሓባር ረቛሒታት ኣለልይ', 'ቀንዲ ናይ ሒሳብ ሕግታት ተዘከር'],
      formulasUsed: ['Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)'],
      keyConceptsEn: ['Algebraic Symmetry', 'Empirical Verification'],
      keyConceptsTi: ['ሒሳባዊ ምምዕርራይ', 'ጭቡጥ ምርግጋጽ'],
      createdDate: new Date().toISOString(),
    };
  }
}

export async function generateStudyMaterialAi(topic: string, materialType = 'flashcards', difficulty = 'intermediate') {
  try {
    const res = await fetch('/api/education/generate-study-material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, materialType, difficulty }),
    });
    if (!res.ok) throw new Error('Study material error');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Study material fallback:', err);
    return {
      summaryEn: `Mastery overview for ${topic}: Explore core derivations, standard proofs, and real-world system architecture.`,
      summaryTi: `ናይ ${topic} ጽሟቕ ትሕዝቶ: ቀንዲ መትከላትን ተግባራዊ ኣጠቓቕማን ብዕምቆት ምምሃር።`,
      keyFormulasOrTerms: ['Formula α + β = γ', 'Axumite Law of Conservation'],
      flashcards: [
        {
          topic,
          frontEn: `Define the core principle of ${topic}`,
          backEn: `Fundamental theoretical mechanism describing system behavior.`,
          frontTi: `ናይ ${topic} ቀንዲ መትከል እንታይ እዩ?`,
          backTi: `ንናይቲ ስርዓት ምንቅስቓስ ዝገልጽ መሰረታዊ ሕጊ እዩ።`,
          category: difficulty,
        }
      ]
    };
  }
}

export async function generateLearningPathAi(targetGoal: string, fieldOfStudy: string, currentSkillLevel: any, weeklyHours: number): Promise<PersonalizedLearningPath> {
  try {
    const res = await fetch('/api/education/generate-learning-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetGoal, fieldOfStudy, currentSkillLevel, weeklyHours }),
    });
    if (!res.ok) throw new Error('Learning path error');
    const data = await res.json();
    return data.learningPath;
  } catch (err) {
    console.warn('Learning path fallback:', err);
    return {
      id: `PATH-${Date.now()}`,
      studentId: 'usr_guest',
      targetGoalEn: targetGoal,
      targetGoalTi: `ናይ ${targetGoal} ናይ ትምህርቲ መደብ`,
      fieldOfStudy,
      currentSkillLevel,
      totalWeeks: 4,
      weeklyHours,
      progressPercent: 0,
      generatedDate: new Date().toISOString(),
      milestones: [
        {
          id: 'ms-1',
          weekNumber: 1,
          titleEn: 'Foundations & Mathematical Setup',
          titleTi: 'መሰረታዊ ፍልጠትን ናይ ሒሳብ መእተውን',
          descriptionEn: 'Establish foundational principles and study definitions.',
          descriptionTi: 'መሰረታዊ ሕግታትን ትርጉማትን ምሓዝ።',
          actionItemEn: 'Review starter modules and complete initial quiz',
          actionItemTi: 'መእተዊ ሞድዩላት ምውዳእ',
          completed: false,
        },
        {
          id: 'ms-2',
          weekNumber: 2,
          titleEn: 'Deep Problem Solving & Case Studies',
          titleTi: 'ዓሚቝ ጸገማት ምፍታሕን ኣብነታትን',
          descriptionEn: 'Tackle complex multi-step problems and hands-on exercises.',
          descriptionTi: 'ዝተሓላለኹ ጸገማትን ተግባራዊ ስራሓትን ምፍታሕ።',
          actionItemEn: 'Submit homework assignments',
          actionItemTi: 'ናይ ገዛ ዕዮ ምውዳእ',
          completed: false,
        },
        {
          id: 'ms-3',
          weekNumber: 3,
          titleEn: 'Practical Synthesis & Project Construction',
          titleTi: 'ተግባራዊ ፕሮጀክት ምህናጽ',
          descriptionEn: 'Synthesize learning into a tangible portfolio submission.',
          descriptionTi: 'ዝተማሃርካዮ ብተግባር ምስራሕ።',
          actionItemEn: 'Build working project',
          actionItemTi: 'ፕሮጀክት ምፍጻም',
          completed: false,
        },
        {
          id: 'ms-4',
          weekNumber: 4,
          titleEn: 'Certification Exam & Graduation',
          titleTi: 'ናይ መወዳእታ ፈተናን ምስክር ወረቐትን',
          descriptionEn: 'Pass the final proctored exam and receive official credentials.',
          descriptionTi: 'ናይ መወዳእታ ፈተና ብዓወት ምሕላፍ።',
          actionItemEn: 'Score 80%+ on final exam',
          actionItemTi: 'ኣብ ናይ መወዳእታ ፈተና 80%+ ምምጻእ',
          completed: false,
        }
      ]
    };
  }
}
