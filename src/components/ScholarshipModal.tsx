import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, GraduationCap, Globe, ExternalLink, Search, Sparkles, 
  CheckCircle2, BookOpen, Award, Filter, DollarSign, Calendar, 
  FileText, Send, Loader2, Copy, Check, ChevronRight, HelpCircle,
  Building2, Layers, BookmarkPlus, ArrowUpRight, Compass, Shield,
  Clock, Flame, AlertTriangle, Timer, Hourglass, CalendarClock,
  ArrowUpDown, CheckCircle, Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile, SavedItem } from '../types';

export type DeadlineUrgency = 'urgent' | 'approaching' | 'upcoming' | 'rolling';

export interface Scholarship {
  id: string;
  title: string;
  titleTi: string;
  provider: string;
  country: string;
  countryTi: string;
  degreeLevel: 'Bachelor' | 'Master' | 'PhD' | 'All' | 'Postdoc';
  fundingType: 'Fully Funded' | 'Partial' | 'Tuition Waiver';
  fundingTypeTi: string;
  coverage: string[];
  coverageTi: string[];
  officialUrl: string;
  deadline: string;
  deadlineDate?: string; // ISO format e.g. '2026-09-30'
  urgency: DeadlineUrgency;
  urgencyLabel?: string;
  urgencyLabelTi?: string;
  description: string;
  descriptionTi: string;
  eligibility: string[];
  eligibilityTi: string[];
  tags: string[];
}

export interface DeadlineInfo {
  urgency: DeadlineUrgency;
  badgeClass: string;
  dotClass: string;
  borderClass: string;
  bgGlow: string;
  daysRemaining: number | null;
  hoursRemaining: number | null;
  formattedCountdown: string;
  formattedCountdownTi: string;
  statusLabel: string;
  statusLabelTi: string;
  progressPercent: number;
}

export function calculateDeadlineInfo(sch: Scholarship, now = new Date()): DeadlineInfo {
  if (sch.urgency === 'rolling' || !sch.deadlineDate) {
    return {
      urgency: 'rolling',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      dotClass: 'bg-emerald-400',
      borderClass: 'border-emerald-500/30',
      bgGlow: 'from-emerald-950/20 to-transparent',
      daysRemaining: null,
      hoursRemaining: null,
      formattedCountdown: 'Open Year-Round',
      formattedCountdownTi: 'ዓመቱን ምሉእ ክፉት እዩ',
      statusLabel: 'Rolling Admissions',
      statusLabelTi: 'ቀጻሊ ምዝገባ (Rolling)',
      progressPercent: 100,
    };
  }

  const target = new Date(sch.deadlineDate);
  const diffMs = target.getTime() - now.getTime();
  const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  if (totalDays <= 45 && totalDays > 0) {
    return {
      urgency: 'urgent',
      badgeClass: 'bg-rose-500/25 text-rose-200 border-rose-500/60 shadow-xs shadow-rose-950/40',
      dotClass: 'bg-rose-400 animate-ping',
      borderClass: 'border-rose-500/50',
      bgGlow: 'from-rose-950/30 to-transparent',
      daysRemaining: totalDays,
      hoursRemaining: totalHours,
      formattedCountdown: `${totalDays}d ${totalHours}h remaining`,
      formattedCountdownTi: `${totalDays} መዓልትን ${totalHours} ሰዓትን ተሪፉ`,
      statusLabel: `Closing Soon (${totalDays} Days Left)`,
      statusLabelTi: `ቀልጢፍካ መልክት (${totalDays} መዓልቲ ተሪፉ)`,
      progressPercent: Math.max(15, Math.min(95, 100 - (totalDays / 45) * 80)),
    };
  } else if (totalDays <= 90 && totalDays > 45) {
    return {
      urgency: 'approaching',
      badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-500/50',
      dotClass: 'bg-amber-400',
      borderClass: 'border-amber-500/40',
      bgGlow: 'from-amber-950/20 to-transparent',
      daysRemaining: totalDays,
      hoursRemaining: totalHours,
      formattedCountdown: `${totalDays} days left`,
      formattedCountdownTi: `${totalDays} መዓልታት ተሪፉ`,
      statusLabel: `Open Now (${totalDays} Days Left)`,
      statusLabelTi: `ክፉት ኣሎ (${totalDays} መዓልቲ)`,
      progressPercent: Math.max(20, Math.min(75, 100 - (totalDays / 90) * 60)),
    };
  } else {
    return {
      urgency: 'upcoming',
      badgeClass: 'bg-sky-500/20 text-sky-200 border-sky-500/50',
      dotClass: 'bg-sky-400',
      borderClass: 'border-sky-500/30',
      bgGlow: 'from-sky-950/20 to-transparent',
      daysRemaining: totalDays > 0 ? totalDays : null,
      hoursRemaining: totalHours,
      formattedCountdown: totalDays > 0 ? `${totalDays} days to deadline` : 'Upcoming Cycle',
      formattedCountdownTi: totalDays > 0 ? `ኣብ ${totalDays} መዓልቲ ይዕጾ` : 'ቀጻሊ ዙር ምዝገባ',
      statusLabel: 'Upcoming Cycle',
      statusLabelTi: 'ቀጻሊ ዙር (Upcoming)',
      progressPercent: 25,
    };
  }
}

export interface ChecklistItem {
  id: string;
  title: string;
  titleTi: string;
  category: 'core' | 'academic' | 'identity' | 'optional';
  categoryLabel: string;
  categoryLabelTi: string;
  description: string;
  descriptionTi: string;
  tips: string;
  tipsTi: string;
  importance: 'mandatory' | 'recommended';
}

export const SCHOLARSHIP_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'transcripts',
    title: 'Academic Transcripts & Degree Certificates',
    titleTi: 'ናይ ትምህርቲ ሰነዳትን ትራንስክሪፕትን (Transcripts & Degrees)',
    category: 'academic',
    categoryLabel: 'Academic Records',
    categoryLabelTi: 'ናይ ትምህርቲ ሰነዳት',
    description: 'Official high school or university transcripts in English, notarized and stamped with grading rubric.',
    descriptionTi: 'ናይ 12 ክፍሊ ሰርቲፊኬት ወይ ናይ ኮሌጅ/ዩኒቨርሲቲ ኦፊሽያል ትራንስክሪፕት ብእንግሊዝኛ ዝተተርጎመን ብማሕተም ዝተረጋገጸን።',
    tips: 'Include clear conversion tables if your university uses non-standard GPA scales.',
    tipsTi: 'ናይ GPA መለክዒ ፎርሙላ እንተተተሓሒዙ ተመራጺ እዩ።',
    importance: 'mandatory',
  },
  {
    id: 'sop',
    title: 'Statement of Purpose / Motivation Essay',
    titleTi: 'ናይ ድራኸ ደብዳበ (Statement of Purpose / SOP)',
    category: 'core',
    categoryLabel: 'Essays & Pitch',
    categoryLabelTi: 'ናይ ድራኸ ጽሑፋት',
    description: 'A 500–1000 word tailored narrative articulating academic motivations, research interests, and community return plan.',
    descriptionTi: 'ስለምንታይ ነዚ ዓውዲ መሪጽኩም፧ ንመጻኢ ሃገርኩምን ማሕበረሰብኩምን ብኸመይ ትጠቕሙ፧ ዘብርህ ውልቃዊ ድርሳን።',
    tips: 'Use our AI SOP Drafter tab to generate a tailored outline for your specific program.',
    tipsTi: 'ኣብዚ ሞዳል ዘሎ ናይ AI SOP Drafter ተጠቒምኩም ድርሳንኩም ኣዳልዉ።',
    importance: 'mandatory',
  },
  {
    id: 'lor',
    title: '2–3 Recommendation Letters (LOR)',
    titleTi: 'ናይ መምህራን ምስክርነት (Letters of Recommendation)',
    category: 'academic',
    categoryLabel: 'Endorsements',
    categoryLabelTi: 'ምስክርነት መምህራን',
    description: 'Confidential reference letters on institutional letterhead signed by professors or direct workplace supervisors.',
    descriptionTi: 'ካብ 2 ክሳብ 3 መምህራን ወይ ናይ ስራሕ ሓለፍቲ ዝወሃብ ንጸባይኩምን ብቕዓትኩምን ዝምስክር ደብዳበ (LOR)።',
    tips: 'Request letters at least 3-4 weeks ahead of the deadline.',
    tipsTi: 'ቅድሚ ምዕጻው ዕለት ብውሑዱ 3-4 ሳምንታት ኣቐዲምኩም ንመምህራንኩም ሕተቱ።',
    importance: 'mandatory',
  },
  {
    id: 'cv',
    title: 'Academic CV / Europass Resume',
    titleTi: 'ሞያዊ CV / Resume (Europass / Standard)',
    category: 'core',
    categoryLabel: 'Profile',
    categoryLabelTi: 'ሞያዊ መግለጺ',
    description: 'A structured 1–2 page resume detailing educational background, volunteer initiatives, publications, and awards.',
    descriptionTi: 'ናይ ትምህርቲ፣ ስራሕ፣ ፍቓደኝነትን (Volunteer) ኣድላይነት ዘለዎም ስልጠናታትን ዘጠቓለለ ንጹር CV።',
    tips: 'Quantify leadership experiences with measurable outcomes and project titles.',
    tipsTi: 'ዘካየድኩምዎም ፕሮጀክትታትን መሪሕነታዊ ተሳትፎን ብግልጺ ጥቐሱ።',
    importance: 'mandatory',
  },
  {
    id: 'language',
    title: 'English Proficiency (IELTS / TOEFL / MOI Letter)',
    titleTi: 'ናይ ቋንቋ እንግሊዝ መረጋገጺ (English Proficiency / MOI)',
    category: 'academic',
    categoryLabel: 'Language',
    categoryLabelTi: 'ቋንቋ',
    description: 'Valid IELTS/TOEFL score certificate or official "Medium of Instruction (MOI)" English verification letter.',
    descriptionTi: 'IELTS / TOEFL ወይ ካብ ዩኒቨርሲቲኹም "English as Medium of Instruction (MOI)" ዝብል ወግዓዊ ደብዳበ።',
    tips: 'Many European and Asian programs waive test scores if your degree was taught in English.',
    tipsTi: 'ቀዳማይ ዲግሪኹም ብእንግሊዝኛ እንተተማሂርኩም ብ MOI ወረቐት ክቕበሉኹም ይኽእሉ እዮም።',
    importance: 'mandatory',
  },
  {
    id: 'passport',
    title: 'Valid International Passport',
    titleTi: 'ፓስፖርት (Valid Passport)',
    category: 'identity',
    categoryLabel: 'Identity & Travel',
    categoryLabelTi: 'መንነትን ፓስፖርትን',
    description: 'Color scan of personal information and photo pages with at least 6 months validity from intake date.',
    descriptionTi: 'እንተወሓደ 6 ወርሒ ወይ ልዕሊኡ ዝጸንሕ ዘበነ-ዕድመ ዘለዎ ዓለምለኸ ፓስፖርት።',
    tips: 'Ensure all 4 corners of the bio page are clearly visible with zero glare.',
    tipsTi: 'ናይቲ ፓስፖርት ኣርባዕቲኡ ጫፍ ብንጹር ዝረአ ምዃኑ ኣረጋግጹ።',
    importance: 'mandatory',
  },
  {
    id: 'portfolio',
    title: 'Research Proposal or Creative Portfolio',
    titleTi: 'ናይ ምርምር ሓሳብ ወይ ፖርትፎልዮ (Research Proposal / Portfolio)',
    category: 'optional',
    categoryLabel: 'Research & Work',
    categoryLabelTi: 'ምርምርን ስራሕን',
    description: 'Required for PhD / Research Master applicants and Arts/Architecture disciplines.',
    descriptionTi: 'ንዶክተርነት (PhD) ወይ ምርምር ንዝመሃሩ ተመሃሮ ዘድሊ ናይ መጽናዕቲ ውጥን ወይ ናይ ስነ-ጥበብ ስራሓት።',
    tips: 'Align your research questions with faculty mentors listed at the target institution.',
    tipsTi: 'ኣብቲ ዩኒቨርሲቲ ካብ ዘለዉ ፕሮፌሰራት ምርምር ምስ ዘካይድ ምትእስሳር ፍጠሩ።',
    importance: 'recommended',
  },
  {
    id: 'financial',
    title: 'Financial Need Affidavit / Declaration',
    titleTi: 'ናይ ቁጠባዊ ደገፍ መግለጺ (Financial Need Statement)',
    category: 'optional',
    categoryLabel: 'Financial Eligibility',
    categoryLabelTi: 'ቁጠባዊ ደገፍ',
    description: 'Demonstrates economic background or humanitarian displacement status for need-based grants (e.g. Mastercard Foundation, DAFI).',
    descriptionTi: 'ብፍላይ ንMastercard Foundationን DAFIን ዘድሊ ናይ ስድራቤት ቁጠባዊ ኲነታት ወይ ናይ ስደተኛ መረጋገጺ።',
    tips: 'Provide clear, verifiable context regarding financial obstacles.',
    tipsTi: 'ናይ ቁጠባዊ ጸገምኩም ብግልጺ ዘብርህ ሰነድ ኣተሓሕዙ።',
    importance: 'recommended',
  },
];

export const SCHOLARSHIPS_DATA: Scholarship[] = [
  {
    id: 'fulbright',
    title: 'Fulbright Foreign Student Program',
    titleTi: 'ፉልብራይት ናይ ኣሜሪካ መንግስቲ ስኮላርሺፕ (Fulbright)',
    provider: 'U.S. Department of State',
    country: 'United States (USA)',
    countryTi: 'ሕቡራት መንግስታት ኣሜሪካ (USA)',
    degreeLevel: 'Master',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['100% Tuition Fees', 'Monthly Living Stipend', 'Round-trip Airfare', 'Health Insurance', 'Book Allowance'],
    coverageTi: ['ሙሉእ ክፍሊት ትምህርቲ (100%)', 'ናይ ወርሒ ናብራ መነባበሪ ገንዘብ', 'ናይ ነፋሪት ትኬት (መመለሲ ሓዊሱ)', 'ናይ ጥዕና መድሕን', 'ናይ መጻሕፍቲ ደገፍ'],
    officialUrl: 'https://foreign.fulbrightonline.org/',
    deadline: 'Annually (Feb - Oct by Country)',
    deadlineDate: '2026-10-15',
    urgency: 'urgent',
    urgencyLabel: 'Closing Soon (Country Tracks)',
    urgencyLabelTi: 'ቀልጢፍካ መልክት (Closing Soon)',
    description: 'Enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.',
    descriptionTi: 'ንብቑዓት ተመሃሮን ሰብ ሞያን ኣብ ሕቡራት መንግስታት ኣሜሪካ ካልኣይ ዲግሪ (Master) ንምምሃር ዝወሃብ ዓለምለኸ ዝኸበረ ናይ መንግስቲ ኣሜሪካ ስኮላርሺፕ እዩ።',
    eligibility: ['Bachelor’s degree completed', 'Strong academic record', 'Leadership potential', 'English proficiency'],
    eligibilityTi: ['ቀዳማይ ዲግሪ ዝወደአ', 'ጽቡቕ ናይ ትምህርቲ ውጽኢት (GPA)', 'ናይ መሪሕነት ክእለት', 'ናይ እንግሊዝኛ ቋንቋ ክእለት'],
    tags: ['USA', 'Fully Funded', 'Masters', 'Prestigious', 'Global'],
  },
  {
    id: 'chevening',
    title: 'Chevening Scholarships',
    titleTi: 'ቼቨኒንግ ናይ ዓባይ ብሪጣንያ መንግስቲ ስኮላርሺፕ (Chevening UK)',
    provider: 'UK Foreign, Commonwealth & Development Office (FCDO)',
    country: 'United Kingdom (UK)',
    countryTi: 'ዓባይ ብሪጣንያ (United Kingdom)',
    degreeLevel: 'Master',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['Full University Tuition Fees', 'Monthly Living Allowance', 'Travel to/from UK', 'Arrival Allowance', 'Visa Cost Reimbursement'],
    coverageTi: ['ሙሉእ ናይ ዩኒቨርሲቲ ክፍሊት', 'ናይ ወርሒ ናይ መነባበሪ ኣበል', 'ናብ ዓባይ ብሪጣንያ ናይ ነፋሪት ወጻኢታት', 'ናይ ቪዛ ክፍሊት ምምላስ'],
    officialUrl: 'https://www.chevening.org/scholarships/',
    deadline: 'August – November Annually',
    deadlineDate: '2026-11-05',
    urgency: 'approaching',
    urgencyLabel: 'Open Now (Closes Nov 5)',
    urgencyLabelTi: 'ክፉት ኣሎ (Open Now)',
    description: 'The UK government’s global scholarship programme, funded by the FCDO and partner organizations, for one-year master’s degrees at any UK university.',
    descriptionTi: 'ኣብ ዝኾነ ናይ ዓባይ ብሪጣንያ ዩኒቨርሲቲ ናይ ሓደ ዓመት ካልኣይ ዲግሪ (Master’s) ንምምሃር ብመንግስቲ ዩናይትድ ኪንግደም ዝወሃብ ዝኸበረ ዕድል እዩ።',
    eligibility: ['Undergraduate degree (2:1 or equivalent)', 'Minimum 2 years work experience (2,800 hours)', 'Commitment to return to home country for min 2 years'],
    eligibilityTi: ['ቀዳማይ ዲግሪ ዘለዎ', 'እንተወሓደ 2 ዓመት ናይ ስራሕ ተመኩሮ', 'ናይ መሪሕነት ራእይ ዘለዎ'],
    tags: ['UK', 'Fully Funded', 'Masters', 'Leadership', 'All Majors'],
  },
  {
    id: 'daad-epos',
    title: 'DAAD Development-Related Postgraduate Courses (EPOS)',
    titleTi: 'ዳኣድ ናይ ጀርመን መንግስቲ ስኮላርሺፕ (DAAD Germany)',
    provider: 'German Academic Exchange Service (DAAD)',
    country: 'Germany',
    countryTi: 'ጀርመን (Germany)',
    degreeLevel: 'Master',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['Monthly stipend (€934 - €1,300)', 'Tuition fully free', 'Health & accident insurance', 'Travel allowance', 'Study & research subsidies'],
    coverageTi: ['ናይ ወርሒ ኣበል (€934 - €1,300)', 'ናጻ ክፍሊት ትምህርቲ', 'ናይ ጥዕናን ሓደጋን መድሕን', 'ናይ ጉዕዞ ነፋሪት ክፍሊት'],
    officialUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    deadline: 'August – October (Varies by Course)',
    deadlineDate: '2026-09-30',
    urgency: 'urgent',
    urgencyLabel: 'Urgent: Course Deadlines',
    urgencyLabelTi: 'ቀልጢፍካ መልክት (Urgent)',
    description: 'Supports professionals from developing and transition countries to pursue development-related Master or PhD courses at top German state universities.',
    descriptionTi: 'ኣብ ፍሉጣት ናይ ጀርመን ዩኒቨርሲቲታት ብእንግሊዝኛ ወይ ጀርመንኛ ካልኣይ ዲግሪ ንምስራሕ ዝወሃብ ምሉእ ደገፍ ዘለዎ ናይ ጀርመን መንግስቲ ስኮላርሺፕ።',
    eligibility: ['Bachelor’s degree (not older than 6 years)', 'At least 2 years of professional experience', 'Academic motivation'],
    eligibilityTi: ['ቀዳማይ ዲግሪ (ካብ 6 ዓመት ዘይበለጸ)', 'እንተወሓደ 2 ዓመት ሞያዊ ተመኩሮ', 'ሓያል ናይ ትምህርቲ ድራኸ'],
    tags: ['Germany', 'Europe', 'Masters', 'PhD', 'Engineering', 'Economics'],
  },
  {
    id: 'mastercard-fdn',
    title: 'Mastercard Foundation Scholars Program',
    titleTi: 'ማስተርካርድ ፋውንዴሽን ስኮላርሺፕ (Mastercard Foundation)',
    provider: 'Mastercard Foundation & Global Partner Universities',
    country: 'Global (USA, UK, Canada, Africa, France)',
    countryTi: 'ዓለምለኸ (ኣሜሪካ፣ ካናዳ፣ ዓባይ ብሪጣንያ፣ ኣፍሪቃ)',
    degreeLevel: 'All',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Comprehensive)',
    coverage: ['Full Tuition & Living Expenses', 'Books & Learning Materials', 'Accommodation & Laptop', 'Mentorship & Career Placement', 'Airfare'],
    coverageTi: ['ሙሉእ ክፍሊት ትምህርትን መነባበሪን', 'መጻሕፍትን ላፕቶፕን', 'ናይ መንበሪ ቦታ', 'ሞያዊ ስልጠናን ናይ ነፋሪት ወጻኢን'],
    officialUrl: 'https://mastercardfdn.org/all/scholars/',
    deadline: 'Varies by Partner University (Sep - Feb)',
    deadlineDate: '2026-12-15',
    urgency: 'approaching',
    urgencyLabel: 'Fall Window Open',
    urgencyLabelTi: 'ናይ ቀውዒ ዙር ክፉት',
    description: 'Enables bright young African and global leaders with high economic need to complete undergraduate and graduate education worldwide.',
    descriptionTi: 'ንጎበዛት መንእሰያት ኣብ ፍሉጣት ዓለምለኻውያን ዩኒቨርሲቲታት (Oxford, Edinburgh, McGill, UC Berkeley, AIMS) ቀዳማይን ካልኣይን ዲግሪ ንኽመሃሩ ዝወሃብ ዓቢ ዕድል እዩ።',
    eligibility: ['Academic talent', 'Demonstrated financial need', 'Commitment to community giveback across Africa'],
    eligibilityTi: ['ብሉጽ ናይ ትምህርቲ ውጽኢት', 'ናይ ፋይናንስ ደገፍ ዘድልዮም ተመሃሮ', 'ንማሕበረሰብ ናይ ምግልጋል ራእይ'],
    tags: ['Undergraduate', 'Masters', 'Fully Funded', 'Africa', 'Global'],
  },
  {
    id: 'erasmus-mundus',
    title: 'Erasmus Mundus Joint Masters Scholarships (EMJM)',
    titleTi: 'ኢራስመስ ሙንዱስ ናይ ኤውሮጳ ሕብረት ስኮላርሺፕ (Erasmus Mundus EU)',
    provider: 'European Commission (European Union)',
    country: 'European Union (Multiple EU Countries)',
    countryTi: 'ሕብረት ኤውሮጳ (ኣብ ዝተፈላለያ ሃገራት ኤውሮጳ)',
    degreeLevel: 'Master',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['Full Tuition Fee Waiver', '€1,400 Monthly Living Allowance', 'Travel & Visa Allowance', 'Full Comprehensive Insurance', 'Study in 2-3 different European countries'],
    coverageTi: ['ሙሉእ ናጻ ክፍሊት ትምህርቲ', 'ናይ ወርሒ €1,400 ናይ መነባበሪ ገንዘብ', 'ናይ ጉዕዞን ቪዛን ኣበል', 'ኣብ 2 ወይ 3 ዝተፈላለያ ናይ ኤውሮጳ ሃገራት ናይ ምምሃር ዕድል'],
    officialUrl: 'https://erasmus-plus.ec.europa.eu/opportunities/individuals/students',
    deadline: 'October – January / February Annually',
    deadlineDate: '2027-01-15',
    urgency: 'upcoming',
    urgencyLabel: 'Opens Oct / Closes Jan',
    urgencyLabelTi: 'ቀጻሊ ዙር (Opens Oct)',
    description: 'High-level integrated master programmes delivered by international consortia of higher education institutions across Europe.',
    descriptionTi: 'ኣብ ብዙሓት ናይ ኤውሮጳ ሃገራት (ፈረንሳ፣ ኢጣልያ፣ ስጳኛ፣ ጀርመን ወዘተ) እናተዘዋወርካ ዝስራሕ ፍሉይ ናይ ኤውሮጳ ሕብረት ስኮላርሺፕ እዩ።',
    eligibility: ['Bachelor’s degree or equivalent', 'No previous Erasmus Mundus scholarship', 'Academic excellence'],
    eligibilityTi: ['ቀዳማይ ዲግሪ ዝወደአ', 'ቅድሚ ሕጂ ናይ ኢራስመስ ስኮላርሺፕ ዘይወሰደ', 'ብሉጽ ናይ ትምህርቲ ውጽኢት'],
    tags: ['Europe', 'EU', 'Masters', 'Fully Funded', 'Multi-Country'],
  },
  {
    id: 'turkiye-burslari',
    title: 'Türkiye Scholarships (Türkiye Bursları)',
    titleTi: 'ቱርክየ ቡርስላሪ ናይ ቱርኪ መንግስቲ ስኮላርሺፕ (Türkiye Bursları)',
    provider: 'Government of Republic of Türkiye',
    country: 'Turkey',
    countryTi: 'ቱርኪ (Türkiye)',
    degreeLevel: 'All',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['Full University Placement & Tuition', 'Monthly Stipend (Undergrad, Master, PhD)', 'Free University Dormitory Accommodation', 'Round-trip Flight Ticket', '1-Year Turkish Language Course', 'Health Insurance'],
    coverageTi: ['ሙሉእ ዩኒቨርሲቲን ክፍሊትን', 'ናይ ወርሒ ደሞዝ/ኣበል', 'ናጻ ናይ ዩኒቨርሲቲ መንበሪ ደምበ (Dormitory)', 'ናይ ነፋሪት መመለሲ ትኬት', 'ናይ 1 ዓመት ናጻ ናይ ቱርክኛ ቋንቋ ስልጠና', 'ናይ ጥዕና መድሕን'],
    officialUrl: 'https://www.turkiyeburslari.gov.tr/',
    deadline: 'January 10 – February 20 Annually',
    deadlineDate: '2027-02-20',
    urgency: 'upcoming',
    urgencyLabel: 'Jan 2027 Cycle',
    urgencyLabelTi: 'ናይ ጥሪ 2027 ዙር',
    description: 'Government-funded higher education scholarship program for international students from all countries for Bachelor, Master, and PhD degrees.',
    descriptionTi: 'ካብ ቀዳማይ ዲግሪ ክሳብ ዶክተርነት (PhD) ኣብ ቱርኪ ብነጻ ንምምሃር ብመንግስቲ ቱርኪ ዝወሃብ ዓመታዊ ዓለምለኸ ስኮላርሺፕ።',
    eligibility: ['Undergraduate: Minimum 70% GPA', 'Master & PhD: Minimum 75% GPA', 'Health Sciences: Minimum 90% GPA'],
    eligibilityTi: ['ቀዳማይ ዲግሪ፡ እንተወሓደ 70% ውጽኢት', 'ካልኣይ ዲግሪን ፒኤችዲን፡ እንተወሓደ 75% ውጽኢት', 'ሕክምና፡ እንተወሓደ 90% ውጽኢት'],
    tags: ['Turkey', 'Undergraduate', 'Masters', 'PhD', 'Fully Funded'],
  },
  {
    id: 'mext-japan',
    title: 'MEXT Japanese Government Scholarships',
    titleTi: 'ሜክስት ናይ ጃፓን መንግስቲ ስኮላርሺፕ (MEXT Japan)',
    provider: 'Ministry of Education, Culture, Sports, Science and Technology (Japan)',
    country: 'Japan',
    countryTi: 'ጃፓን (Japan)',
    degreeLevel: 'All',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['100% Tuition and Examination Fees', 'Monthly Allowance (143,000 - 145,000 JPY)', 'Round-trip Air Transportation', 'Preparatory Japanese Language Course'],
    coverageTi: ['100% ናጻ ክፍሊት መርመራን ትምህርትን', 'ናይ ወርሒ ኣበል (143,000 - 145,000 የን)', 'ናይ ነፋሪት መመለሲ ትኬት', 'ናይ ጃፓንኛ ቋንቋ ምድላው ስልጠና'],
    officialUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/',
    deadline: 'April – June (Embassy Track) / Oct – Dec (University Track)',
    deadlineDate: '2026-11-30',
    urgency: 'approaching',
    urgencyLabel: 'University Track Open',
    urgencyLabelTi: 'ናይ ዩኒቨርሲቲ መስመር ክፉት',
    description: 'Offers international students the opportunity to study in Japanese universities at undergraduate, master, and doctoral levels.',
    descriptionTi: 'ኣብ ፍሉጣት ናይ ጃፓን ዩኒቨርሲቲታት ኣብ ዝተፈላለየ ሞያታት ብነጻ ንምምሃር ዝወሃብ ናይ ጃፓን መንግስቲ ስኮላርሺፕ።',
    eligibility: ['Undergraduate: 17–25 years old', 'Research/Graduate: Under 35 years old', 'Willingness to learn Japanese'],
    eligibilityTi: ['ቀዳማይ ዲግሪ፡ ዕድመ 17–25 ዓመት', 'ካልኣይ ዲግሪ/ምርምር፡ ትሕቲ 35 ዓመት', 'ጃፓንኛ ንምምሃር ድሌት ዘለዎ'],
    tags: ['Japan', 'Asia', 'Undergraduate', 'Masters', 'PhD', 'STEM'],
  },
  {
    id: 'swedish-institute',
    title: 'Swedish Institute Scholarships for Global Professionals (SISGP)',
    titleTi: 'ስዊዲሽ ኢንስትቲዩት ስኮላርሺፕ (Swedish Institute - Sweden)',
    provider: 'Swedish Institute / Government of Sweden',
    country: 'Sweden',
    countryTi: 'ስዊድን (Sweden)',
    degreeLevel: 'Master',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['Full Tuition Fees paid directly to Swedish University', 'Monthly Living Stipend (SEK 12,000)', 'Travel Grant (SEK 15,000)', 'Health & Accident Insurance', 'Membership in SI Network for Future Global Leaders'],
    coverageTi: ['ሙሉእ ክፍሊት ዩኒቨርሲቲ ስዊድን', 'ናይ ወርሒ ናይ መነባበሪ ኣበል (12,000 ክሮነር)', 'ናይ ጉዕዞ ደገፍ (15,000 ክሮነር)', 'ናይ ጥዕናን ሓደጋን መድሕን'],
    officialUrl: 'https://si.se/en/apply/scholarships/',
    deadline: 'February Annually',
    deadlineDate: '2027-02-15',
    urgency: 'upcoming',
    urgencyLabel: 'Opens Autumn / Closes Feb',
    urgencyLabelTi: 'ቀጻሊ ዙር',
    description: 'Develops global leaders by funding full master’s degree studies in Sweden, covering tuition fees and monthly living expenses.',
    descriptionTi: 'ኣብ ስዊድን ካልኣይ ዲግሪ ብእንግሊዝኛ ንምምሃር ንሞያውያንን መራሕትን ብመንግስቲ ስዊድን ዝወሃብ ምሉእ ስኮላርሺፕ።',
    eligibility: ['Min 3,000 hours of documented work experience', 'Demonstrated leadership experience', 'Admitted to an eligible master’s programme in Sweden'],
    eligibilityTi: ['እንተወሓደ 3,000 ሰዓታት ናይ ስራሕ ተመኩሮ', 'ናይ መሪሕነት ታሪኽ ዘለዎ', 'ኣብ ስዊድን ዩኒቨርሲቲ ቅቡልነት ዝረኸበ'],
    tags: ['Sweden', 'Europe', 'Masters', 'Leadership', 'Fully Funded'],
  },
  {
    id: 'gates-cambridge',
    title: 'Gates Cambridge Scholarships',
    titleTi: 'ጌትስ ካምብሪጅ ስኮላርሺፕ (Gates Cambridge - UK)',
    provider: 'Bill & Melinda Gates Foundation & University of Cambridge',
    country: 'United Kingdom (University of Cambridge)',
    countryTi: 'ዓባይ ብሪጣንያ (University of Cambridge)',
    degreeLevel: 'PhD',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Elite Full Funding)',
    coverage: ['Full University Composition Fee', 'Maintenance Allowance (£20,000/year)', 'Inbound & Outbound Airfare', 'Visa & Immigration Health Surcharge', 'Academic Development Funding (up to £2,000)'],
    coverageTi: ['ሙሉእ ናይ ካምብሪጅ ዩኒቨርሲቲ ክፍሊት', 'ናይ ዓመት £20,000 ናይ መነባበሪ ገንዘብ', 'ናይ ነፋሪት ምሉእ ወጻኢታት', 'ናይ ቪዛን ጥዕናን ክፍሊት', 'ናይ ምርምርን ጉባኤታትን ደገፍ (£2,000)'],
    officialUrl: 'https://www.gatescambridge.org/',
    deadline: 'October (US Citizens) / December - January (International)',
    deadlineDate: '2026-12-02',
    urgency: 'approaching',
    urgencyLabel: 'Open for 2027 Intake',
    urgencyLabelTi: 'ን2027 ክፉት ዘሎ',
    description: 'Prestigious, highly competitive scholarships for outstanding applicants from countries outside the UK to pursue a full-time postgraduate degree at the University of Cambridge.',
    descriptionTi: 'ኣብ ዓለም ካብ ዘለዋ ዝበለጻ ዩኒቨርሲቲታት ሓንቲ ኣብ ዝኾነት ዩኒቨርሲቲ ካምብሪጅ ዶክተርነት ወይ ካልኣይ ዲግሪ ንምስራሕ ዝወሃብ ዝለዓለ ስኮላርሺፕ።',
    eligibility: ['Outstanding intellectual ability', 'Reasons for choice of course', 'A commitment to improving the lives of others', 'Leadership capacity'],
    eligibilityTi: ['ብሉጽ ናይ ኣእምሮን ትምህርትን ብቕዓት', 'ንማሕበረሰብ ዓለም ናይ ምልዋጥ ተወፋይነት', 'ናይ መሪሕነት ክእለት'],
    tags: ['UK', 'Cambridge', 'PhD', 'Masters', 'Prestigious', 'Fully Funded'],
  },
  {
    id: 'dafi-unhcr',
    title: 'UNHCR DAFI Tertiary Refugee Scholarship Programme',
    titleTi: 'ዲኤኤፍኣይ ናይ ስደተኛታትን ዲያስፖራን ስኮላርሺፕ (DAFI UNHCR)',
    provider: 'UNHCR & German Government',
    country: 'Global / Regional (Africa, Middle East, Asia)',
    countryTi: 'ዓለምለኸ (ኣፍሪቃ፣ ማእከላይ ምብራቕ፣ ኤስያ)',
    degreeLevel: 'Bachelor',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Refugee & Tertiary Support)',
    coverage: ['Tuition Fees and Registration', 'Study Materials and Books', 'Food, Housing and Transportation Allowance', 'Academic Prep & Language Classes'],
    coverageTi: ['ናይ ዩኒቨርሲቲ ምዝገባን ክፍሊትን', 'መጻሕፍትን ናይ ትምህርቲ ኣቑሑትን', 'ናይ መግቢ፣ መንበሪን መጓዓዝያን ኣበል', 'ናይ ቋንቋ ስልጠናታት'],
    officialUrl: 'https://www.unhcr.org/dafi-scholarships.html',
    deadline: 'Ongoing / Country Specific Announcements',
    urgency: 'rolling',
    urgencyLabel: 'Rolling / Year-Round',
    urgencyLabelTi: 'ቀጻሊ ምዝገባ (Rolling)',
    description: 'Enables refugee students and displaced youth to pursue higher education, university degrees, and professional certifications globally.',
    descriptionTi: 'ንተመዛበልትን ስደተኛታትን መንእሰያት ኣብ ዝተፈላለያ ሃገራት ኣብ ዩኒቨርሲቲ ቀዳማይ ዲግሪ ንኽመሃሩ ብUNHCRን መንግስቲ ጀርመንን ዝወሃብ ዓቢ ዕድል እዩ።',
    eligibility: ['Recognized refugee or asylum seeker status', 'High school diploma with good marks', 'Under 28 years old for undergraduate studies'],
    eligibilityTi: ['ናይ ስደተኛ ወይ ዑቕባ መሰል ዘለዎ', 'ናይ 12 ክፍሊ ዲፕሎማ ጽቡቕ ውጽኢት ዘለዎ', 'ዕድመ ትሕቲ 28 ዓመት'],
    tags: ['Refugee', 'Diaspora', 'Undergraduate', 'Fully Funded', 'UNHCR'],
  },
  {
    id: 'kaust-fellowship',
    title: 'KAUST Discovery Fellowship & Graduate Scholarships',
    titleTi: 'ካውስት ናይ ሳይንስን ቴክኖሎጂን ስኮላርሺፕ (KAUST Fellowship)',
    provider: 'King Abdullah University of Science and Technology',
    country: 'Saudi Arabia',
    countryTi: 'ስዑዲ ዓረብ (Saudi Arabia)',
    degreeLevel: 'Master',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ ($20,000 - $30,000/yr)',
    coverage: ['Full Tuition Support', 'Monthly Living Allowance ($20,000 - $30,000 annually)', 'Private On-campus Housing', 'Medical and Dental Coverage', 'Relocation and Annual Flight Support'],
    coverageTi: ['100% ናጻ ክፍሊት ትምህርቲ', 'ናይ ዓመት $20,000 ክሳብ $30,000 መነባበሪ ደሞዝ', 'ናጻ ዘመናዊ ናይ ውልቂ መንበሪ ገዛ', 'ናይ ጥዕናን ስንን ምሉእ መድሕን', 'ናይ ነፋሪት ወጻኢታት'],
    officialUrl: 'https://www.kaust.edu.sa/en/study/fellowship',
    deadline: 'October – January (Spring/Fall Intake)',
    deadlineDate: '2027-01-15',
    urgency: 'upcoming',
    urgencyLabel: 'Spring/Fall Cycle',
    urgencyLabelTi: 'ናይ ጽድያ/ቀውዒ ዙር',
    description: 'All admitted graduate students (Master & PhD) in STEM fields receive full fellowship support at one of the top research universities in the world.',
    descriptionTi: 'ኣብ ዓውደ ሳይንስ፣ ኮምፒዩተር፣ AI፣ ባዮሎጂን ኢንጅነሪንግን ካልኣይ ዲግሪ ወይ ፒኤችዲ ንዝመሃሩ ተመሃሮ ዝወሃብ ዝለዓለ ናጻ ናይ ገንዘብን መንበሪን ደገፍ ዘለዎ ስኮላርሺፕ።',
    eligibility: ['Degree in Science, Tech, Engineering, or Math (STEM)', 'Strong GPA and academic transcript', 'TOEFL (79+) or IELTS (6.5+)'],
    eligibilityTi: ['ናይ STEM (ሳይንስ፣ ቴክኖሎጂ፣ ኢንጅነሪንግ፣ ሒሳብ) ዲግሪ', 'ጽቡቕ ውጽኢት GPA', 'ናይ እንግሊዝኛ ፈተና ውጽኢት'],
    tags: ['STEM', 'Engineering', 'AI', 'Masters', 'PhD', 'Fully Funded'],
  },
  {
    id: 'australia-awards',
    title: 'Australia Awards Scholarships',
    titleTi: 'ኦስትራልያ ኣዋርድስ ስኮላርሺፕ (Australia Awards)',
    provider: 'Department of Foreign Affairs and Trade (DFAT Australia)',
    country: 'Australia',
    countryTi: 'ኦስትራልያ (Australia)',
    degreeLevel: 'Master',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['Full Tuition Fees', 'Return Air Travel', 'Establishment Allowance', 'Contribution to Living Expenses (CLE)', 'Overseas Student Health Cover (OSHC)'],
    coverageTi: ['ሙሉእ ናይ ዩኒቨርሲቲ ክፍሊት', 'ናይ መመለሲ ነፋሪት ትኬት', 'ናይ ምቛም/ምጅማር ኣበል', 'ናይ ወርሒ ናይ መነባበሪ ገንዘብ', 'ናይ ጥዕና ምሉእ መድሕን'],
    officialUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards',
    deadline: 'February – April 30 Annually',
    deadlineDate: '2027-04-30',
    urgency: 'upcoming',
    urgencyLabel: 'Opens Feb 2027',
    urgencyLabelTi: 'ናይ ለካቲት 2027 ዙር',
    description: 'Long-term awards administered by the Department of Foreign Affairs and Trade for full-time undergraduate or postgraduate study in Australia.',
    descriptionTi: 'ኣብ ፍሉጣት ናይ ኦስትራልያ ዩኒቨርሲቲታት ኣብ ዝተፈላለየ ናይ ምዕባለ ዓውድታት ብምሉእ ወጻኢታት መንግስቲ ኦስትራልያ ንምምሃር ዝወሃብ ዕድል።',
    eligibility: ['Citizen of an eligible country', 'Minimum 18 years of age', 'Committed to contributing to home country development'],
    eligibilityTi: ['ናይ ተጠቀምቲ ሃገራት ዜጋ', 'ዕድመ ካብ 18 ንላዕሊ', 'ንሃገርካ ንምግልጋል ተወፋይነት ዘለዎ'],
    tags: ['Australia', 'Masters', 'Undergraduate', 'Fully Funded'],
  },
  {
    id: 'world-bank-scholarship',
    title: 'Joint Japan/World Bank Graduate Scholarship Program (JJ/WBGSP)',
    titleTi: 'ወርልድ ባንክ ስኮላርሺፕ (World Bank & Japan)',
    provider: 'World Bank & Government of Japan',
    country: 'Global (USA, Europe, Japan, Africa)',
    countryTi: 'ዓለምለኸ (ኣሜሪካ፣ ኤውሮጳ፣ ጃፓን)',
    degreeLevel: 'Master',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['Full Tuition for 27+ Partner Master Programs', 'Economy Class Air Travel', 'Travel Allowance ($500)', 'Monthly Living Stipend', 'Health Insurance'],
    coverageTi: ['ሙሉእ ክፍሊት ትምህርቲ ኣብ መሻርኽቲ ዩኒቨርሲቲታት', 'ናይ ነፋሪት ትኬት', 'ናይ ጉዕዞ ኣበል ($500)', 'ናይ ወርሒ መነባበሪ ደሞዝ', 'ናይ ጥዕና መድሕን'],
    officialUrl: 'https://www.worldbank.org/en/programs/scholarships',
    deadline: 'Window 1: Jan - Feb / Window 2: March - May',
    deadlineDate: '2027-02-28',
    urgency: 'upcoming',
    urgencyLabel: 'Window 1 Opens Jan',
    urgencyLabelTi: 'ዙር 1 ኣብ ጥሪ ይኽፈት',
    description: 'Open to citizens of developing countries with relevant professional experience and a history of supporting their countries’ development efforts.',
    descriptionTi: 'ኣብ ዓበይቲ ዩኒቨርሲቲታት (Harvard, Columbia, Oxford ወዘተ) ኣብ ናይ ምዕባለ፣ ቁጠባ፣ ህዝባዊ ፖሊሲ ካልኣይ ዲግሪ ንምምሃር ብወርልድ ባንክ ዝወሃብ ዕድል።',
    eligibility: ['Bachelor’s degree (earned at least 3 years prior)', 'Minimum 3 years of development-related work experience', 'Admitted to a preferred partner university program'],
    eligibilityTi: ['ቀዳማይ ዲግሪ ካብ ዝተወድአ 3 ዓመት ዝገበረ', 'እንተወሓደ 3 ዓመት ናይ ስራሕ ተመኩሮ', 'ኣብ ተመራጺ መደብ ትምህርቲ ቅቡልነት ዝረኸበ'],
    tags: ['World Bank', 'Economics', 'Policy', 'Masters', 'Fully Funded'],
  },
  {
    id: 'commonwealth-uk',
    title: 'Commonwealth Scholarships for Developing Countries',
    titleTi: 'ኮመንዌልዝ ስኮላርሺፕ (Commonwealth UK)',
    provider: 'Commonwealth Scholarship Commission (CSC UK)',
    country: 'United Kingdom',
    countryTi: 'ዓባይ ብሪጣንያ (United Kingdom)',
    degreeLevel: 'PhD',
    fundingType: 'Fully Funded',
    fundingTypeTi: 'ሙሉእ ብነጻ (Fully Funded)',
    coverage: ['Full Tuition and Exam Fees', 'Monthly Stipend (£1,347 - £1,652)', 'Approved Airfare', 'Warm Clothing Allowance', 'Study Travel Grant'],
    coverageTi: ['ምሉእ ክፍሊት ትምህርትን መርመራን', 'ናይ ወርሒ ኣበል (£1,347 - £1,652)', 'ናይ ነፋሪት ወጻኢታት', 'ናይ ክዳውንቲ ኣበል', 'ናይ ምርምር ደገፍ'],
    officialUrl: 'https://cscuk.fcdo.gov.uk/apply/',
    deadline: 'September – December Annually',
    deadlineDate: '2026-10-18',
    urgency: 'urgent',
    urgencyLabel: 'Opening Sep / Closes Oct',
    urgencyLabelTi: 'ቀልጢፍካ መልክት',
    description: 'Aimed at talented and motivated individuals with the potential to make a positive impact on the global stage through PhD and Master study in the UK.',
    descriptionTi: 'ኣብ ዓባይ ብሪጣንያ ዶክተርነት (PhD) ወይ ካልኣይ ዲግሪ ንምስራሕ ብኮመንዌልዝ ዝወሃብ ምሉእ ናጻ ስኮላርሺፕ።',
    eligibility: ['Citizen or permanent resident of a Commonwealth developing country', 'First degree of at least upper second class (2:1)', 'Clear research proposal'],
    eligibilityTi: ['ጽቡቕ ናይ ቀዳማይ ዲግሪ ውጽኢት', 'ንጹር ናይ ምርምር ፕሮፖዛል (Research Proposal)'],
    tags: ['UK', 'Commonwealth', 'PhD', 'Masters', 'Research', 'Fully Funded'],
  },
];

interface ScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  onSaveInsight?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  onOpenAuthModal?: (mode?: 'login' | 'signup' | 'otp') => void;
  onNavigateToChat?: (prompt: string) => void;
  initialScholarshipId?: string;
}

export const ScholarshipModal: React.FC<ScholarshipModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveInsight,
  onOpenAuthModal,
  onNavigateToChat,
  initialScholarshipId,
}) => {
  const { language } = useLanguage();
  
  // Navigation Tabs: 'browse' | 'ai-drafter' | 'guide'
  const [activeTab, setActiveTab] = useState<'browse' | 'ai-drafter' | 'guide'>('browse');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegree, setSelectedDegree] = useState<string>('All');
  const [selectedFunding, setSelectedFunding] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [sortByDeadline, setSortByDeadline] = useState<boolean>(true);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Auto-select initial scholarship if provided
  React.useEffect(() => {
    if (isOpen && initialScholarshipId) {
      const match = SCHOLARSHIPS_DATA.find(
        (s) => s.id === initialScholarshipId || s.id.includes(initialScholarshipId) || initialScholarshipId.includes(s.id)
      );
      if (match) {
        setSelectedScholarship(match);
        setActiveTab('browse');
      }
    }
  }, [isOpen, initialScholarshipId]);

  // AI Essay / Statement of Purpose Generator State
  const [targetProgram, setTargetProgram] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [academicBackground, setAcademicBackground] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [generatedEssay, setGeneratedEssay] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedEssay, setCopiedEssay] = useState(false);

  // Document Checklist Prepared State with LocalStorage Persistence
  const [preparedDocs, setPreparedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('asmera_scholarship_checklist');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    // Default initial checked items (academic transcripts & bio passport common)
    return {
      transcripts: true,
      passport: true,
    };
  });

  const toggleDocumentPrepared = (id: string) => {
    setPreparedDocs(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('asmera_scholarship_checklist', JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });
  };

  const handleResetChecklist = () => {
    const emptyState: Record<string, boolean> = {};
    setPreparedDocs(emptyState);
    try {
      localStorage.setItem('asmera_scholarship_checklist', JSON.stringify(emptyState));
    } catch {
      // Fallback
    }
  };

  const handleSelectAllChecklist = () => {
    const fullState: Record<string, boolean> = {};
    SCHOLARSHIP_CHECKLIST_ITEMS.forEach(item => {
      fullState[item.id] = true;
    });
    setPreparedDocs(fullState);
    try {
      localStorage.setItem('asmera_scholarship_checklist', JSON.stringify(fullState));
    } catch {
      // Fallback
    }
  };

  // Calculate Progress Stats
  const totalChecklistItems = SCHOLARSHIP_CHECKLIST_ITEMS.length;
  const completedChecklistCount = SCHOLARSHIP_CHECKLIST_ITEMS.filter(item => !!preparedDocs[item.id]).length;
  const checklistProgressPercent = Math.round((completedChecklistCount / totalChecklistItems) * 100);

  const mandatoryItems = SCHOLARSHIP_CHECKLIST_ITEMS.filter(item => item.importance === 'mandatory');
  const completedMandatoryCount = mandatoryItems.filter(item => !!preparedDocs[item.id]).length;
  const mandatoryComplete = completedMandatoryCount === mandatoryItems.length;

  if (!isOpen) return null;

  // Counts by urgency status for quick pill filters
  const urgentCount = SCHOLARSHIPS_DATA.filter(s => s.urgency === 'urgent').length;
  const approachingCount = SCHOLARSHIPS_DATA.filter(s => s.urgency === 'approaching').length;
  const upcomingCount = SCHOLARSHIPS_DATA.filter(s => s.urgency === 'upcoming').length;
  const rollingCount = SCHOLARSHIPS_DATA.filter(s => s.urgency === 'rolling').length;

  // Filter scholarships
  let filteredScholarships = SCHOLARSHIPS_DATA.filter((sch) => {
    const matchesSearch = 
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.titleTi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDegree = selectedDegree === 'All' || sch.degreeLevel === selectedDegree || sch.degreeLevel === 'All';
    const matchesFunding = selectedFunding === 'All' || sch.fundingType === selectedFunding;
    const matchesUrgency = selectedUrgency === 'All' || sch.urgency === selectedUrgency;

    return matchesSearch && matchesDegree && matchesFunding && matchesUrgency;
  });

  // Sort by deadline urgency if enabled
  if (sortByDeadline) {
    filteredScholarships = [...filteredScholarships].sort((a, b) => {
      const urgencyRank: Record<DeadlineUrgency, number> = {
        urgent: 0,
        approaching: 1,
        upcoming: 2,
        rolling: 3,
      };
      const rankDiff = urgencyRank[a.urgency] - urgencyRank[b.urgency];
      if (rankDiff !== 0) return rankDiff;
      if (a.deadlineDate && b.deadlineDate) {
        return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime();
      }
      return 0;
    });
  }

  // Handle AI Statement of Purpose Generation
  const handleGenerateEssay = async () => {
    if (!targetProgram.trim() || !fieldOfStudy.trim()) return;

    setIsGenerating(true);
    setGeneratedEssay('');

    try {
      const prompt = `You are a world-class academic advisor and scholarship mentor. Write a compelling, highly competitive, and authentic Statement of Purpose / Motivation Letter for a scholarship application.

Target Scholarship / University: ${targetProgram}
Field of Study / Major: ${fieldOfStudy}
Applicant Academic Background: ${academicBackground || 'Bachelor degree with strong academic record'}
Future Goals & Community Impact: ${careerGoals || 'Apply knowledge to solve critical challenges and empower community development'}

Structure the letter professionally:
1. Formal Salutation & Captivating Introduction
2. Academic Background & Relevant Achievements
3. Why this specific Scholarship / University is the ideal match
4. Long-term Vision & Contribution to Society / Home Country
5. Strong Closing & Sign-off

Include both the English master version and a concise Tigrinya summary/translation so the applicant fully understands every nuance.`;

      const res = await fetch('/api/obelisk/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: 'general' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate essay');

      setGeneratedEssay(data.result || data.reply || '');
    } catch (err: any) {
      console.error('Scholarship AI Generator error:', err);
      setGeneratedEssay('ይቕሬታ፣ ናይ ስኮላርሺፕ ደብዳበ ንምድላው ጸገም ተፈጢሩ። በጃኹም ደጊምኩም ፈትኑ። (Failed to generate essay. Please retry.)');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Generated Essay
  const handleCopyEssay = () => {
    if (!generatedEssay) return;
    navigator.clipboard.writeText(generatedEssay);
    setCopiedEssay(true);
    setTimeout(() => setCopiedEssay(false), 2000);
  };

  // Save to Insight Vault
  const handleSaveScholarship = (sch: Scholarship) => {
    if (!onSaveInsight) return;
    onSaveInsight({
      title: `ስኮላርሺፕ: ${sch.title}`,
      type: 'general',
      content: `📌 ስኮላርሺፕ: ${sch.title} (${sch.titleTi})
🏢 ኣዳላዊ: ${sch.provider}
🌍 ሃገር: ${sch.country}
🎓 ደረጃ: ${sch.degreeLevel}
💰 ደገፍ: ${sch.fundingTypeTi}
🔗 ወግዓዊ መርበብ: ${sch.officialUrl}
📅 ናይ ምዝገባ ዕለት: ${sch.deadline}

መግለጺ:
${sch.descriptionTi}

ዘጠቓልሎም ወጻኢታት:
${sch.coverageTi.join('\n- ')}`,
      tags: ['scholarship', sch.degreeLevel, sch.country],
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0B0F19] border border-[#C5A059]/40 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh] relative"
      >
        
        {/* ========================================================================= */}
        {/* MODAL HEADER: BRANDING & TABS                                             */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-[#121626] via-[#161B2E] to-[#121626] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] text-white flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-300/40 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-[#FFF2C2] tracking-tight truncate">
                  {language === 'ti' ? 'ዕድላት ስኮላርሺፕ (Scholarships & Grants)' : 'Global Scholarships & Grants Hub'}
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 rounded-md border border-amber-400/30 font-mono">
                  100% Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {language === 'ti' 
                  ? 'ናጻ ናይ ትምህርቲ ዕድላት፣ ወግዓዊ መላግቦታትን ናይ AI ደብዳበ ጸሓፍን' 
                  : 'Official portals, fully funded opportunities, and AI Statement of Purpose drafter'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SUB NAVIGATION TABS: BROWSE | AI ESSAY DRAFTER | APPLICATION GUIDE        */}
        {/* ========================================================================= */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#0E1220] border-b border-slate-800/80 flex items-center space-x-2 shrink-0 overflow-x-auto scrollbar-none">
          {/* Tab 1: Browse Scholarships */}
          <button
            type="button"
            onClick={() => { setActiveTab('browse'); setSelectedScholarship(null); }}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'browse'
                ? 'bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-[#0F1422] shadow-md shadow-amber-900/20 font-black'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'ti' ? 'ዝርዝር ስኮላርሺፕ (Browse Opportunities)' : 'Browse Opportunities'}</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 text-current">
              {SCHOLARSHIPS_DATA.length}
            </span>
          </button>

          {/* Tab 2: AI Motivation Letter Drafter */}
          <button
            type="button"
            onClick={() => setActiveTab('ai-drafter')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai-drafter'
                ? 'bg-gradient-to-r from-[#194BFB] to-[#3B82F6] text-white shadow-md shadow-blue-900/30'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'ti' ? 'ብ AI ናይ ስኮላርሺፕ ደብዳበ (AI SOP Drafter)' : 'AI Motivation Essay Drafter'}</span>
          </button>

          {/* Tab 3: Application Guide & Interactive Checklist with Progress Badge */}
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-[#059669] to-[#10B981] text-white shadow-md shadow-emerald-900/30 font-black'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{language === 'ti' ? 'ናይ ምድላው ቼክሊስት (Checklist)' : 'Document Checklist'}</span>
            <span className={`ml-1 px-2 py-0.5 text-[10px] font-black rounded-full transition-all ${
              checklistProgressPercent === 100
                ? 'bg-emerald-400 text-slate-950 animate-pulse'
                : activeTab === 'guide'
                ? 'bg-black/25 text-white'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {completedChecklistCount}/{totalChecklistItems} ({checklistProgressPercent}%)
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: BROWSE SCHOLARSHIPS                                                */}
        {/* ========================================================================= */}
        {activeTab === 'browse' && !selectedScholarship && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            
            {/* Search & Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              
              {/* Search input */}
              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ti' ? 'ብሽም ስኮላርሺፕ፣ ሃገር፣ ዓውዲ ድለ...' : 'Search by scholarship name, country, major...'}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Urgency Filter Dropdown */}
              <div className="sm:col-span-3">
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500/60 cursor-pointer font-medium"
                >
                  <option value="All">{language === 'ti' ? '📅 ኩሉ እዋን (All Deadlines)' : '📅 All Deadline Statuses'}</option>
                  <option value="urgent">{language === 'ti' ? '🔴 ቀልጢፍካ መልክት (Urgent / Closing)' : '🔴 Urgent: Closing Soon (<45d)'}</option>
                  <option value="approaching">{language === 'ti' ? '🟡 ክፉት ኣሎ (Open Now)' : '🟡 Open Now (Approaching)'}</option>
                  <option value="upcoming">{language === 'ti' ? '🔵 ቀጻሊ ዙር (Upcoming Cycle)' : '🔵 Upcoming Intake Cycle'}</option>
                  <option value="rolling">{language === 'ti' ? '🟢 ቀጻሊ ምዝገባ (Rolling)' : '🟢 Year-Round / Rolling'}</option>
                </select>
              </div>

              {/* Degree Level Filter */}
              <div className="sm:col-span-2">
                <select
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500/60 cursor-pointer"
                >
                  <option value="All">{language === 'ti' ? 'ደረጃታት' : 'All Degrees'}</option>
                  <option value="Bachelor">{language === 'ti' ? 'ቀዳማይ ዲግሪ' : 'Bachelor'}</option>
                  <option value="Master">{language === 'ti' ? 'ካልኣይ ዲግሪ' : 'Master'}</option>
                  <option value="PhD">{language === 'ti' ? 'ዶክተርነት' : 'PhD'}</option>
                </select>
              </div>

              {/* Funding Type Filter */}
              <div className="sm:col-span-3">
                <select
                  value={selectedFunding}
                  onChange={(e) => setSelectedFunding(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500/60 cursor-pointer"
                >
                  <option value="All">{language === 'ti' ? 'ኩሉ ዓይነት ደገፍ' : 'All Funding'}</option>
                  <option value="Fully Funded">{language === 'ti' ? 'ሙሉእ ብነጻ (Fully Funded)' : '100% Fully Funded'}</option>
                  <option value="Partial">{language === 'ti' ? 'ከፊል ደገፍ (Partial)' : 'Partial / Waiver'}</option>
                </select>
              </div>
            </div>

            {/* Quick Urgency Filter Chips & Deadline Sort Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedUrgency('All')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                    selectedUrgency === 'All'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{language === 'ti' ? 'ኩሎም' : 'All'}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-black/30 ml-0.5">{SCHOLARSHIPS_DATA.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUrgency(selectedUrgency === 'urgent' ? 'All' : 'urgent')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                    selectedUrgency === 'urgent'
                      ? 'bg-rose-500/30 text-rose-200 border border-rose-500/80 shadow-xs'
                      : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/25'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'ti' ? 'ቀልጢፍካ መልክት' : 'Urgent / Closing Soon'}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-200 ml-0.5">{urgentCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUrgency(selectedUrgency === 'approaching' ? 'All' : 'approaching')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                    selectedUrgency === 'approaching'
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-500/80 shadow-xs'
                      : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/25'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ti' ? 'ክፉት ኣሎ' : 'Open Now'}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-200 ml-0.5">{approachingCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUrgency(selectedUrgency === 'upcoming' ? 'All' : 'upcoming')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                    selectedUrgency === 'upcoming'
                      ? 'bg-sky-500/30 text-sky-200 border border-sky-500/80 shadow-xs'
                      : 'bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/25'
                  }`}
                >
                  <CalendarClock className="w-3.5 h-3.5 text-sky-400" />
                  <span>{language === 'ti' ? 'ቀጻሊ ዙር' : 'Upcoming'}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-sky-950/60 border border-sky-500/40 text-sky-200 ml-0.5">{upcomingCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUrgency(selectedUrgency === 'rolling' ? 'All' : 'rolling')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                    selectedUrgency === 'rolling'
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/80 shadow-xs'
                      : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/25'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ti' ? 'ቀጻሊ ምዝገባ' : 'Rolling'}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 ml-0.5">{rollingCount}</span>
                </button>
              </div>

              {/* Sort by deadline urgency toggle */}
              <button
                type="button"
                onClick={() => setSortByDeadline(!sortByDeadline)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shrink-0 ${
                  sortByDeadline 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>
                  {sortByDeadline 
                    ? (language === 'ti' ? 'ቀዳምነት: ዕለተ ምዕጻው' : 'Sorted: Urgent First') 
                    : (language === 'ti' ? 'ደረጃዊ ኣሰካኽዓ' : 'Default Order')}
                </span>
              </button>
            </div>

            {/* Results Count Banner */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>{language === 'ti' ? `ዝተረኽቡ ዕድላት: ${filteredScholarships.length}` : `Available Programs: ${filteredScholarships.length}`}</span>
              <span className="text-amber-400/90 font-medium flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>
                  {language === 'ti' 
                    ? 'ቀይሕ ምልክት ዘለዎም ቀልጢፍኩም መልክቱ' 
                    : 'Red badges indicate closing soon — prepare documents early'}
                </span>
              </span>
            </div>

            {/* Scholarships Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredScholarships.map((sch) => {
                const deadlineInfo = calculateDeadlineInfo(sch);
                const isUrgent = sch.urgency === 'urgent';

                return (
                  <div
                    key={sch.id}
                    className={`bg-[#111524] hover:bg-[#151A2E] border rounded-2xl p-4 transition-all flex flex-col justify-between group shadow-sm relative overflow-hidden ${
                      isUrgent 
                        ? 'border-rose-500/40 hover:border-rose-400 ring-1 ring-rose-500/20' 
                        : 'border-slate-800 hover:border-[#C5A059]/60'
                    }`}
                  >
                    {/* Top Glow bar for urgent scholarships */}
                    {isUrgent && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse" />
                    )}

                    {/* Top Header of Card */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          
                          {/* Tags row + Visual Urgency Countdown Badge */}
                          <div className="flex items-center justify-between space-x-1.5 flex-wrap gap-y-1.5 mb-1.5">
                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                              <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                {sch.fundingTypeTi}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/15 text-sky-300 border border-blue-500/30">
                                {sch.degreeLevel}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-800 text-slate-300">
                                {sch.country}
                              </span>
                            </div>

                            {/* Color-Coded Deadline & Urgency Badge */}
                            <div className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center space-x-1.5 shrink-0 ${deadlineInfo.badgeClass}`}>
                              {isUrgent && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                                </span>
                              )}
                              {!isUrgent && sch.urgency === 'approaching' && (
                                <Clock className="w-3 h-3 text-amber-300" />
                              )}
                              {!isUrgent && sch.urgency === 'upcoming' && (
                                <CalendarClock className="w-3 h-3 text-sky-300" />
                              )}
                              {!isUrgent && sch.urgency === 'rolling' && (
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                              )}
                              <span className="tracking-tight font-extrabold">
                                {language === 'ti' ? deadlineInfo.statusLabelTi : deadlineInfo.statusLabel}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-[#F3E5AB] transition-colors leading-snug">
                            {language === 'ti' ? sch.titleTi : sch.title}
                          </h4>
                          <p className="text-xs text-amber-300/80 font-medium mt-0.5">
                            {sch.provider}
                          </p>
                        </div>
                      </div>

                      {/* Brief description */}
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {language === 'ti' ? sch.descriptionTi : sch.description}
                      </p>

                      {/* Deadline Countdown & Application Timeline Strip */}
                      <div className={`mt-3 p-2 rounded-xl border flex flex-col space-y-1.5 ${
                        isUrgent
                          ? 'bg-rose-950/25 border-rose-500/30'
                          : sch.urgency === 'approaching'
                          ? 'bg-amber-950/20 border-amber-500/25'
                          : sch.urgency === 'rolling'
                          ? 'bg-emerald-950/20 border-emerald-500/20'
                          : 'bg-slate-900/90 border-slate-800/90'
                      }`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center space-x-1 text-slate-300 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{sch.deadline}</span>
                          </span>
                          <span className={`font-black flex items-center space-x-1 shrink-0 ${
                            isUrgent ? 'text-rose-300' : sch.urgency === 'approaching' ? 'text-amber-300' : sch.urgency === 'rolling' ? 'text-emerald-300' : 'text-sky-300'
                          }`}>
                            <Timer className="w-3 h-3 shrink-0" />
                            <span>{language === 'ti' ? deadlineInfo.formattedCountdownTi : deadlineInfo.formattedCountdown}</span>
                          </span>
                        </div>

                        {/* Urgency Progress Bar */}
                        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isUrgent 
                                ? 'bg-gradient-to-r from-rose-500 to-red-400' 
                                : sch.urgency === 'approaching'
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                : sch.urgency === 'rolling'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : 'bg-gradient-to-r from-sky-500 to-blue-400'
                            }`}
                            style={{ width: `${deadlineInfo.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Coverage Highlights */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {(language === 'ti' ? sch.coverageTi : sch.coverage).slice(0, 3).map((cov, idx) => (
                          <span key={idx} className="text-[11px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{cov}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      
                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedScholarship(sch)}
                        className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                        <span>{language === 'ti' ? 'ዝርዝር ርአ' : 'View Details'}</span>
                      </button>

                      {/* Open Official Website Portal Button */}
                      <a
                        href={sch.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`py-1.5 px-3.5 rounded-xl text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs active:scale-95 ${
                          isUrgent
                            ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-rose-900/30 ring-1 ring-rose-400/40'
                            : 'bg-[#194BFB] hover:bg-[#133BD0] shadow-blue-500/20'
                        }`}
                      >
                        <span>{language === 'ti' ? 'ወግዓዊ መርበብ ኽፈት' : 'Official Portal'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>

            {filteredScholarships.length === 0 && (
              <div className="text-center py-12 bg-[#111524] rounded-2xl border border-slate-800 p-6">
                <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-200">
                  {language === 'ti' ? 'ስኮላርሺፕ ኣይተረኽበን' : 'No scholarships matched your filters'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {language === 'ti' ? 'በጃኹም ካልእ ቃል ተጠቒምኩም ፈትኑ ወይ ፍልተር ቀይሩ።' : 'Try adjusting your search query or reset your degree filters.'}
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedDegree('All'); setSelectedFunding('All'); setSelectedUrgency('All'); }}
                  className="mt-4 py-2 px-4 rounded-xl bg-[#C5A059] text-slate-950 text-xs font-bold cursor-pointer"
                >
                  {language === 'ti' ? 'ፍልተራት ጽረግ (Reset)' : 'Reset Filters'}
                </button>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* DETAIL VIEW FOR A SINGLE SCHOLARSHIP                                      */}
        {/* ========================================================================= */}
        {activeTab === 'browse' && selectedScholarship && (() => {
          const detailDeadlineInfo = calculateDeadlineInfo(selectedScholarship);
          const isUrgent = selectedScholarship.urgency === 'urgent';

          return (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
              
              {/* Back Button to List */}
              <button
                type="button"
                onClick={() => setSelectedScholarship(null)}
                className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center space-x-1.5 border border-slate-800 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>{language === 'ti' ? 'ናብ ዝርዝር ስኮላርሺፕ ተመለስ' : 'Back to Scholarships List'}</span>
              </button>

              {/* Title & Metadata Header */}
              <div className="bg-[#12172B] border border-[#C5A059]/40 rounded-3xl p-5 relative overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {selectedScholarship.fundingTypeTi}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/20 text-sky-300 border border-blue-500/40">
                    {selectedScholarship.degreeLevel} Degree
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300">
                    🌍 {selectedScholarship.country}
                  </span>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-black border flex items-center space-x-1.5 ${detailDeadlineInfo.badgeClass}`}>
                    {isUrgent && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping inline-block" />}
                    <span>{language === 'ti' ? detailDeadlineInfo.statusLabelTi : detailDeadlineInfo.statusLabel}</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-[#FFF4D0] leading-snug">
                  {language === 'ti' ? selectedScholarship.titleTi : selectedScholarship.title}
                </h2>
                <p className="text-sm text-amber-300/90 font-medium mt-1">
                  {selectedScholarship.provider}
                </p>

                {/* Deadline & Official Action */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-300 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-100">{language === 'ti' ? 'ናይ ምዝገባ እዋን:' : 'Application Deadline:'} </span>
                      <span className="text-slate-300">{selectedScholarship.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSaveScholarship(selectedScholarship)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <BookmarkPlus className="w-4 h-4 text-amber-400" />
                      <span>{language === 'ti' ? 'ኣብ ቫልት ዓቅብ' : 'Save'}</span>
                    </button>

                    <a
                      href={selectedScholarship.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`py-2 px-4 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-md active:scale-95 ${
                        isUrgent 
                          ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 ring-1 ring-rose-400/40 shadow-rose-900/40' 
                          : 'bg-gradient-to-r from-[#194BFB] to-[#3B82F6] hover:from-[#143DCB] hover:to-[#2563EB] shadow-blue-500/20'
                      }`}
                    >
                      <span>{language === 'ti' ? 'ናብ ወግዓዊ መርበብ ኪድ' : 'Open Official Portal'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Deadline & Time Management Countdown Alert Card */}
              <div className={`rounded-2xl border p-4 sm:p-5 relative overflow-hidden ${
                isUrgent
                  ? 'bg-gradient-to-br from-rose-950/40 via-[#161224] to-[#121626] border-rose-500/50 shadow-md shadow-rose-950/30'
                  : selectedScholarship.urgency === 'approaching'
                  ? 'bg-gradient-to-br from-amber-950/30 via-[#161424] to-[#121626] border-amber-500/40'
                  : selectedScholarship.urgency === 'rolling'
                  ? 'bg-gradient-to-br from-emerald-950/30 via-[#101924] to-[#121626] border-emerald-500/40'
                  : 'bg-gradient-to-br from-sky-950/30 via-[#121828] to-[#121626] border-sky-500/30'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                      isUrgent 
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' 
                        : selectedScholarship.urgency === 'approaching'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : selectedScholarship.urgency === 'rolling'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                    }`}>
                      {isUrgent ? <Flame className="w-5 h-5 animate-pulse" /> : <Timer className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                        <span>{language === 'ti' ? 'ናይ ምዕጻው ዕለት ቆጸራ (Deadline Countdown)' : 'Application Timeline & Countdown'}</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {isUrgent 
                          ? (language === 'ti' ? '⚡ እዚ ስኮላርሺፕ ኣብ ቀረባ እዋን ይዕጾ ኣሎ! ናይ ቋንቋን ደብዳበን ሰነዳትኩም ኣዳልዉ።' : '⚡ High Priority: This deadline is fast approaching. Finalize your recommendation letters and SOP promptly.')
                          : (language === 'ti' ? '📌 መመልከቲ ወግዓዊ መርበብን ቀጻሊ ዙርን ተኸታተሉ።' : '📌 Current status and submission timeline for this funding cycle.')}
                      </p>
                    </div>
                  </div>

                  {/* Countdown Ticker Box */}
                  <div className={`px-3 py-1.5 rounded-xl border text-right shrink-0 ${detailDeadlineInfo.badgeClass}`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                      {language === 'ti' ? 'ዝተረፈ ግዜ' : 'Time Remaining'}
                    </span>
                    <span className="text-xs sm:text-sm font-black">
                      {language === 'ti' ? detailDeadlineInfo.formattedCountdownTi : detailDeadlineInfo.formattedCountdown}
                    </span>
                  </div>
                </div>

                {/* Progress bar in detail card */}
                <div className="mt-3 w-full bg-slate-800/90 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isUrgent 
                        ? 'bg-gradient-to-r from-rose-500 to-red-400' 
                        : selectedScholarship.urgency === 'approaching'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : selectedScholarship.urgency === 'rolling'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-sky-500 to-blue-400'
                    }`}
                    style={{ width: `${detailDeadlineInfo.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#111524] rounded-2xl border border-slate-800 p-4 space-y-2">
                <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ti' ? 'መብርሂ ብዛዕባ ስኮላርሺፕ' : 'About this Scholarship'}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'ti' ? selectedScholarship.descriptionTi : selectedScholarship.description}
                </p>
              </div>

              {/* Benefits & Coverage */}
              <div className="bg-[#111524] rounded-2xl border border-slate-800 p-4 space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ti' ? 'ዘጠቓልሎም ወጻኢታት (Financial Benefits & Coverage)' : 'Coverage & Financial Benefits'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(language === 'ti' ? selectedScholarship.coverageTi : selectedScholarship.coverage).map((cov, idx) => (
                    <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-start space-x-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{cov}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Requirements */}
              <div className="bg-[#111524] rounded-2xl border border-slate-800 p-4 space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>{language === 'ti' ? 'ዘድልዩ ረቋሒታት (Eligibility Requirements)' : 'Eligibility & Requirements'}</span>
                </h4>
                <div className="space-y-2">
                  {(language === 'ti' ? selectedScholarship.eligibilityTi : selectedScholarship.eligibility).map((req, idx) => (
                    <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-start space-x-2 text-xs text-slate-200">
                      <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Readiness & Checklist Progress Mini-Card */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-[#101F1F] to-[#121626] border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-slate-100">
                      {language === 'ti' ? 'ናይ ሰነዳት ድልውነት መከታተሊ (Document Checklist)' : 'Required Documents Checklist'}
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {completedChecklistCount}/{totalChecklistItems} ({checklistProgressPercent}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {language === 'ti'
                      ? `${completedChecklistCount} ካብ ${totalChecklistItems} ሰነዳት ኣዳልዮም ኣለዉ።`
                      : `You have prepared ${completedChecklistCount} of ${totalChecklistItems} standard scholarship documents.`}
                  </p>
                  
                  {/* Animated Mini Progress Bar */}
                  <div className="w-full max-w-md bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${checklistProgressPercent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('guide')}
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shrink-0 shadow-md flex items-center space-x-1.5 self-start sm:self-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'ti' ? 'ቼክሊስት ርአ (Open Checklist)' : 'Open Checklist'}</span>
                </button>
              </div>

              {/* One-click Button to Draft SOP with AI */}
              <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-blue-950/70 border border-blue-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{language === 'ti' ? 'ናይዚ ስኮላርሺፕ ደብዳበ (Motivation Letter) ብ AI ኣዳልው' : 'Draft Motivation Letter with AI'}</span>
                  </h4>
                  <p className="text-xs text-blue-200 mt-0.5">
                    {language === 'ti' ? 'ብቐጥታ ብስማዕታን ብቕዓትንኩም ዝተሰነየ ብሉጽ ደብዳበ የዳልወልኩም' : 'Automatically customizes an essay for this exact program'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTargetProgram(selectedScholarship.title);
                    setActiveTab('ai-drafter');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white text-[#0F1422] hover:bg-amber-100 text-xs font-black transition-all cursor-pointer shrink-0 active:scale-95 shadow-md"
                >
                  {language === 'ti' ? 'ደብዳበ ጽሓፍ (Draft Now)' : 'Draft Letter Now'}
                </button>
              </div>

            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* TAB 2: AI MOTIVATION ESSAY / STATEMENT OF PURPOSE DRAFTER                  */}
        {/* ========================================================================= */}
        {activeTab === 'ai-drafter' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            <div className="bg-[#121626] border border-[#C5A059]/30 rounded-2xl p-4">
              <h3 className="text-sm sm:text-base font-bold text-[#FFF2C2] flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{language === 'ti' ? 'ናይ ስኮላርሺፕ ድርሳንን ደብዳበን ጸሓፊ (AI SOP Drafter)' : 'AI Scholarship Statement of Purpose Drafter'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ti' 
                  ? 'ዝርዝር ሓበሬታኹም ኣእትዉ እሞ ንስኮላርሺፕ ዘእምን ብሉጽ ናይ እንግሊዝኛ ደብዳበ (Statement of Purpose / Motivation Letter) ብ AI የዳልወልኩም።'
                  : 'Enter your target scholarship, study field, and background to generate a competitive, structured motivation letter.'}
              </p>
            </div>

            {/* Input Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'ti' ? 'ዝመልክቱሉ ስኮላርሺፕ ወይ ዩኒቨርሲቲ (Target Scholarship / University):' : 'Target Scholarship / University:'}
                </label>
                <input
                  type="text"
                  value={targetProgram}
                  onChange={(e) => setTargetProgram(e.target.value)}
                  placeholder="e.g., Fulbright Scholarship, DAAD Germany, Chevening UK, Erasmus Mundus..."
                  className="w-full py-2.5 px-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {language === 'ti' ? 'ዓውዲ ትምህርቲ / Major (Field of Study):' : 'Field of Study / Major:'}
                  </label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g., Computer Science & AI, Public Health, Civil Engineering, MBA..."
                    className="w-full py-2.5 px-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {language === 'ti' ? 'ናይ ትምህርቲ ድሕረ-ባይታ (Academic Background):' : 'Academic Background & GPA:'}
                  </label>
                  <input
                    type="text"
                    value={academicBackground}
                    onChange={(e) => setAcademicBackground(e.target.value)}
                    placeholder="e.g., BSc in Engineering, 3.8 GPA, 2 years research experience..."
                    className="w-full py-2.5 px-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'ti' ? 'ናይ መጻኢ ራእይን ማሕበረሰባዊ ረብሓን (Career Goals & Community Impact):' : 'Career Goals & Community Impact:'}
                </label>
                <textarea
                  rows={3}
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  placeholder="e.g., Intend to develop renewable energy solutions for rural communities, return to teach at university..."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerateEssay}
                disabled={isGenerating || !targetProgram.trim() || !fieldOfStudy.trim()}
                className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                  isGenerating || !targetProgram.trim() || !fieldOfStudy.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#194BFB] via-[#3B82F6] to-[#194BFB] hover:brightness-110 text-white shadow-blue-500/25 active:scale-98'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{language === 'ti' ? 'ደብዳበ ይዳሎ ኣሎ...' : 'Drafting tailored Statement of Purpose...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{language === 'ti' ? 'ብ AI ናይ ስኮላርሺፕ ደብዳበ ኣዳልው (Generate SOP)' : 'Generate Statement of Purpose'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Output Card */}
            {generatedEssay && (
              <div className="mt-4 bg-[#111524] border border-[#C5A059]/40 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm font-bold text-slate-200">
                      {language === 'ti' ? 'ዝተዳለወ ደብዳበ (Generated SOP)' : 'Generated Motivation Letter'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleCopyEssay}
                      className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1"
                    >
                      {copiedEssay ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{language === 'ti' ? 'ተቐዲሑ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{language === 'ti' ? 'ኮፒ ግበር' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-xs sm:text-sm text-slate-200 leading-relaxed max-h-[360px] overflow-y-auto p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 select-text font-sans">
                  {generatedEssay}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: APPLICATION CHECKLIST & INTERACTIVE DOCUMENT TRACKER               */}
        {/* ========================================================================= */}
        {activeTab === 'guide' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            
            {/* Top Interactive Progress & Application Readiness Dashboard Card */}
            <div className="bg-gradient-to-br from-[#0F1D1C] via-[#121A28] to-[#151226] border border-emerald-500/40 rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-xl shadow-black/40">
              
              {/* Background ambient lighting */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left Title & Status Overview */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'ti' ? 'ናይ ሰነዳት ምድላው መለክዒ' : 'Application Readiness'}</span>
                    </span>
                    {mandatoryComplete && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {language === 'ti' ? '✓ ግዱድ ሰነዳት ተማሊኦም' : '✓ Mandatory Docs Ready'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center space-x-2">
                    <span>{language === 'ti' ? 'ናይ ስኮላርሺፕ ሰነዳት ምድላው መከታተሊ' : 'Scholarship Application Readiness Tracker'}</span>
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    {language === 'ti'
                      ? 'ዘድልዩ ሰነዳት ምስ ኣዳለኹም ነጥብታት ብምምራጽ ዕዉት ምድላውኩምን ዘለኩም ድልውነትን ብቐጥታ ተኸታተሉ።'
                      : 'Check off required and recommended documents to track your preparation progress in real time.'}
                  </p>
                </div>

                {/* Right Progress Counter Block */}
                <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shrink-0 shadow-md">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {language === 'ti' ? 'ዝተዳለዉ ሰነዳት' : 'Prepared Documents'}
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-white">
                      <span className="text-emerald-400">{completedChecklistCount}</span>
                      <span className="text-slate-500 text-sm"> / {totalChecklistItems}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-black text-sm">
                    {checklistProgressPercent}%
                  </div>
                </div>

              </div>

              {/* Animated Main Progress Bar */}
              <div className="mt-5 space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <span>{language === 'ti' ? 'ዕብየት ምድላው ሰነዳት' : 'Overall Completion Progress'}</span>
                    {checklistProgressPercent === 100 && (
                      <span className="text-emerald-400 font-black flex items-center space-x-1">
                        <span>🎉 {language === 'ti' ? '100% ተማሊኡ!' : 'Ready to Apply!'}</span>
                      </span>
                    )}
                  </span>
                  <span className="text-emerald-300 font-mono font-black">{checklistProgressPercent}% Complete</span>
                </div>

                {/* Outer Progress Track */}
                <div className="w-full bg-slate-950/80 rounded-full h-3.5 p-0.5 border border-slate-800/90 shadow-inner overflow-hidden">
                  {/* Motion-animated Inner Fill */}
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${checklistProgressPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    {/* Animated light reflection shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-shimmer" />
                  </motion.div>
                </div>

                {/* Progress helper mini chips */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{language === 'ti' ? `ግዱዳት: ${completedMandatoryCount}/${mandatoryItems.length}` : `Mandatory: ${completedMandatoryCount}/${mandatoryItems.length}`}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{language === 'ti' ? `ተወሳኺ: ${completedChecklistCount - completedMandatoryCount}/${totalChecklistItems - mandatoryItems.length}` : `Recommended: ${completedChecklistCount - completedMandatoryCount}/${totalChecklistItems - mandatoryItems.length}`}</span>
                  </div>

                  {/* Batch Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSelectAllChecklist}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
                    >
                      {language === 'ti' ? 'ኩሎም ምረጽ' : 'Select All'}
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={handleResetChecklist}
                      className="text-xs text-slate-400 hover:text-rose-400 font-medium transition-colors cursor-pointer"
                    >
                      {language === 'ti' ? 'ጽረግ' : 'Reset'}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Checklist Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {SCHOLARSHIP_CHECKLIST_ITEMS.map((item, index) => {
                const isChecked = !!preparedDocs[item.id];
                const isMandatory = item.importance === 'mandatory';

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleDocumentPrepared(item.id)}
                    className={`rounded-2xl p-4 transition-all border cursor-pointer select-none flex flex-col justify-between group relative overflow-hidden ${
                      isChecked
                        ? 'bg-[#111F1C] border-emerald-500/50 shadow-sm shadow-emerald-950/20'
                        : 'bg-[#111524] border-slate-800/90 hover:border-slate-700 hover:bg-[#151A2E]'
                    }`}
                  >
                    {/* Top status & category header */}
                    <div>
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start space-x-3 min-w-0">
                          
                          {/* Interactive Custom Checkbox */}
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 mt-0.5 border ${
                            isChecked
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm shadow-emerald-500/30'
                              : 'bg-slate-900 border-slate-700 group-hover:border-emerald-500/50 text-transparent'
                          }`}>
                            <Check className={`w-4 h-4 stroke-[3] ${isChecked ? 'scale-100' : 'scale-0'} transition-transform`} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                                {index + 1}. {language === 'ti' ? item.categoryLabelTi : item.categoryLabel}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                isMandatory
                                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                  : 'bg-blue-500/15 text-sky-300 border border-blue-500/30'
                              }`}>
                                {isMandatory ? (language === 'ti' ? 'ግዱድ (Required)' : 'Required') : (language === 'ti' ? 'ተወሳኺ (Optional)' : 'Recommended')}
                              </span>
                            </div>

                            <h4 className={`font-bold text-xs sm:text-sm transition-colors leading-snug ${
                              isChecked ? 'text-emerald-200' : 'text-slate-100 group-hover:text-white'
                            }`}>
                              {language === 'ti' ? item.titleTi : item.title}
                            </h4>
                          </div>
                        </div>

                        {/* Prepared Status Pill */}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 border transition-all ${
                          isChecked
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}>
                          {isChecked 
                            ? (language === 'ti' ? '✓ ተዳልዩ' : '✓ Prepared') 
                            : (language === 'ti' ? 'ኣይተዳለወን' : 'Pending')}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 mt-2.5 leading-relaxed pl-9">
                        {language === 'ti' ? item.descriptionTi : item.description}
                      </p>
                    </div>

                    {/* Pro-tip footer strip */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 pl-9 flex items-center justify-between text-[11px] text-amber-300/80">
                      <span className="flex items-center space-x-1 truncate">
                        <Sparkles className="w-3 h-3 shrink-0 text-amber-400" />
                        <span className="truncate">{language === 'ti' ? item.tipsTi : item.tips}</span>
                      </span>

                      {item.id === 'sop' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('ai-drafter');
                          }}
                          className="ml-2 px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold shrink-0 shadow-xs cursor-pointer"
                        >
                          {language === 'ti' ? 'ብ AI ጽሓፍ' : 'Draft SOP'}
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Preparation Summary Note */}
            <div className="bg-[#111524] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-200">
                    {language === 'ti' ? 'ምኽሪ: ሰነዳትኩም ብዲጂታል ፎርማት (PDF) ኣቐምጡ' : 'Tip: Keep all documents saved in clean, searchable PDF scans'}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'ti' 
                      ? 'እዞም ሰነዳት ኣብዚ መሳርሒኹም ተዓቒቦም ይጸንሑኹም እዮም። ዝተዳለወ ሰነድኩም ምልክት ግበሩ።' 
                      : 'Your checklist status is saved locally in this browser so you can resume your application workflow anytime.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setActiveTab('browse'); setSelectedScholarship(null); }}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold whitespace-nowrap cursor-pointer shrink-0"
              >
                {language === 'ti' ? 'ስኮላርሺፕ ድለ' : 'Browse Scholarships'}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* FOOTER BAR                                                                */}
        {/* ========================================================================= */}
        <div className="p-3 sm:p-4 bg-[#0A0D17] border-t border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{language === 'ti' ? 'ኩሎም መላግቦታት ወግዓዊን ውሑስን እዮም' : 'All links route directly to official portals'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            {language === 'ti' ? 'ዕጸው (Close)' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
