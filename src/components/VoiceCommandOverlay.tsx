import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mic, MicOff, X, Sparkles, Navigation, Volume2, Shield, 
  Layers, Settings, Clock, Bell, Crown, Video, FileText, 
  Wrench, Briefcase, GraduationCap, Compass, MessageSquare, 
  ArrowRight, Check, AlertCircle, RefreshCw, Globe, HelpCircle,
  Zap, Radio, CornerDownLeft, VolumeX, Flame
} from 'lucide-react';
import { AppTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { playVoiceTriggerChime, playCommandSuccessChime, playVoiceDeactivateChime } from '../utils/audioChime';

export interface VoiceActionDefinition {
  id: string;
  category: 'navigation' | 'modals' | 'tools' | 'system';
  titleEn: string;
  titleTi: string;
  samplePhrasesEn: string[];
  samplePhrasesTi: string[];
  keywords: string[];
  icon: React.ElementType;
  execute: (context: VoiceExecutionContext) => void;
  confirmationEn: string;
  confirmationTi: string;
}

export interface VoiceExecutionContext {
  navigateTab: (tab: AppTab) => void;
  openSettings: () => void;
  openHistory: () => void;
  openNotifications: () => void;
  openSecurity: () => void;
  openPricing: () => void;
  openJobSearch: () => void;
  openScholarship: () => void;
  openLegalAdvisor: () => void;
  openMechanic: () => void;
  openVideoTranslator: () => void;
  openDrawer: () => void;
  setLanguage: (lang: 'ti' | 'en') => void;
  sendChatMessage?: (msg: string) => void;
  closeOverlay: () => void;
}

interface VoiceCommandOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: AppTab) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenNotifications: () => void;
  onOpenSecurity: () => void;
  onOpenPricing: () => void;
  onOpenJobSearch: () => void;
  onOpenScholarship: () => void;
  onOpenLegalAdvisor: () => void;
  onOpenMechanic: () => void;
  onOpenVideoTranslator: () => void;
  onOpenDrawer: () => void;
  onOpenWelcome?: () => void;
  onSetLanguage?: (lang: 'ti' | 'en') => void;
  onSendChatMessage?: (msg: string) => void;
  isAlwaysListening?: boolean;
  onToggleAlwaysListening?: () => void;
}

export const VoiceCommandOverlay: React.FC<VoiceCommandOverlayProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenSettings,
  onOpenHistory,
  onOpenNotifications,
  onOpenSecurity,
  onOpenPricing,
  onOpenJobSearch,
  onOpenScholarship,
  onOpenLegalAdvisor,
  onOpenMechanic,
  onOpenVideoTranslator,
  onOpenDrawer,
  onOpenWelcome,
  onSetLanguage,
  onSendChatMessage,
  isAlwaysListening = false,
  onToggleAlwaysListening,
}) => {
  const { language, setLanguage } = useLanguage();
  const effectiveSetLanguage = onSetLanguage || setLanguage;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [matchedAction, setMatchedAction] = useState<VoiceActionDefinition | null>(null);
  const [executionCountdown, setExecutionCountdown] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [customInputText, setCustomInputText] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [activeTabCategory, setActiveTabCategory] = useState<'all' | 'navigation' | 'modals' | 'tools'>('all');

  const recognitionRef = useRef<any>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Available Actions Map & NLP Intents
  const actions: VoiceActionDefinition[] = useMemo(() => [
    {
      id: 'settings',
      category: 'modals',
      titleEn: 'Open Settings & Profile',
      titleTi: 'ናይ ፕሮፋይልን ቅጥዕታትን ገጽ ክፈት (Settings)',
      samplePhrasesEn: ['Open Settings', 'Go to Settings', 'Show Profile', 'Account Preferences'],
      samplePhrasesTi: ['ክፈት ሴቲንግ', 'ናብ ቅጥዕታት ኪድ', 'ፕሮፋይለይ ክፈት', 'ኣካውንተይ ርአ'],
      keywords: ['setting', 'settings', 'profile', 'account', 'preferences', 'config', 'user', 'ሴቲንግ', 'ቅጥዕታት', 'ፕሮፋይል', 'ኣካውንት'],
      icon: Settings,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openSettings();
      },
      confirmationEn: 'Opening Settings and Profile Preferences...',
      confirmationTi: 'ናይ ፕሮፋይልን ቅጥዕታትን ገጽ ይኽፈት ኣሎ...',
    },
    {
      id: 'history',
      category: 'modals',
      titleEn: 'Show History & Saved Chats',
      titleTi: 'ናይ ዝሓለፈ ምይይጥ ታሪክ ኣርእየኒ (History)',
      samplePhrasesEn: ['Show History', 'Open History', 'Past Conversations', 'Saved Chats'],
      samplePhrasesTi: ['ክፈት ታሪክ', 'ታሪከይ ኣርእየኒ', 'ዝሓለፈ ምይይጥ', 'ዝተዓቀበ ቻት'],
      keywords: ['history', 'saved', 'past', 'chats', 'archive', 'records', 'conversations', 'ታሪክ', 'ዝሓለፈ', 'ዝተዓቀበ', 'ታሪከይ'],
      icon: Clock,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openHistory();
      },
      confirmationEn: 'Opening Conversation History and Archive...',
      confirmationTi: 'ናይ ዝሓለፈ ምይይጥ ታሪክ ይኽፈት ኣሎ...',
    },
    {
      id: 'notifications',
      category: 'modals',
      titleEn: 'Show Notifications & Alerts',
      titleTi: 'ምልክታታትን ሓደስቲ ዜናታትን ርአ (Notifications)',
      samplePhrasesEn: ['Show Notifications', 'Open Alerts', 'Scholarship Updates', 'New Notices'],
      samplePhrasesTi: ['ክፈት ምልክታታት', 'ሓበሬታ ርአ', 'ናይ ስኮላርሺፕ ምልክታ', 'ሓደስቲ ዜና'],
      keywords: ['notification', 'notifications', 'alert', 'alerts', 'notice', 'notices', 'bell', 'ምልክታ', 'ምልክታታት', 'ሓበሬታ', 'ዜና'],
      icon: Bell,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openNotifications();
      },
      confirmationEn: 'Opening Notifications and System Alerts Center...',
      confirmationTi: 'ናይ ምልክታታትን ሓበሬታን ማእከል ይኽፈት ኣሎ...',
    },
    {
      id: 'pricing',
      category: 'modals',
      titleEn: 'Open Pricing & Subscriptions',
      titleTi: 'ናይ ፕሮ ክፍሊትን ፕላናትን ክፈት (Pricing)',
      samplePhrasesEn: ['Open Pricing', 'Upgrade to Pro', 'Subscription Plans', 'Google Play Payment'],
      samplePhrasesTi: ['ክፈት ክፍሊት', 'ናብ ፕሮ ኣዕቢ', 'ፕላናት ርአ', 'ናይ ኣባልነት ክፍሊት'],
      keywords: ['pricing', 'price', 'plan', 'plans', 'upgrade', 'pro', 'subscribe', 'subscription', 'payment', 'pay', 'trial', 'ክፍሊት', 'ፕላን', 'ፕላናት', 'ፕሮ', 'ምዕባለ'],
      icon: Crown,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openPricing();
      },
      confirmationEn: 'Opening Pricing Plans and Subscription Management...',
      confirmationTi: 'ናይ ክፍሊትን ፕላናትን ማእከል ይኽፈት ኣሎ...',
    },
    {
      id: 'video-translator',
      category: 'tools',
      titleEn: 'Open AI Video Translator & Dubbing',
      titleTi: 'ናይ ቪድዮ ትርጉምን ደቢንግን ክፈት (Video AI)',
      samplePhrasesEn: ['Open Video Translator', 'Translate Video', 'AI Speech Dubbing', 'Video Studio'],
      samplePhrasesTi: ['ክፈት ቪድዮ', 'ቪድዮ ተርጉም', 'ናይ ቪድዮ ስቱድዮ', 'ደቢንግ ቪድዮ'],
      keywords: ['video', 'dub', 'dubbing', 'subtitle', 'subtitles', 'translate video', 'video translator', 'ቪድዮ', 'ደቢንግ', 'ትርጉም ቪድዮ'],
      icon: Video,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openVideoTranslator();
      },
      confirmationEn: 'Launching AI Video Translator and Neural Dubbing Studio...',
      confirmationTi: 'ናይ ቪድዮ ትርጉምን ደቢንግን ስቱድዮ ይኽፈት ኣሎ...',
    },
    {
      id: 'chat',
      category: 'navigation',
      titleEn: 'Go to Obelisk AI Chat',
      titleTi: 'ናብ Obelisk AI ቻት ኪድ (Chat)',
      samplePhrasesEn: ['Open Chat', 'Go to Chat', 'Talk with Obelisk AI', 'Start Conversation'],
      samplePhrasesTi: ['ክፈት ቻት', 'ናብ ቻት ኪድ', 'ምስ AI ተዛረብ', 'ሓድሽ ምይይጥ'],
      keywords: ['chat', 'talk', 'conversation', 'obelisk', 'ai', 'ask', 'message', 'ቻት', 'ምይይጥ', 'ተዛረብ', 'ኦበሊስክ'],
      icon: MessageSquare,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.navigateTab('chat');
      },
      confirmationEn: 'Navigating to Obelisk AI Chat Console...',
      confirmationTi: 'ናብ Obelisk AI ቻት ገጽ ይወስደኩም ኣሎ...',
    },
    {
      id: 'translator',
      category: 'navigation',
      titleEn: 'Go to Ge\'ez & Tigrinya Translator',
      titleTi: 'ናብ ናይ ትግርኛን ግዕዝን ትርጉም ኪድ (Translator)',
      samplePhrasesEn: ['Open Translator', 'Translate Text', 'Language Translation', 'Ge\'ez Translator'],
      samplePhrasesTi: ['ክፈት ትርጉም', 'ናብ ትርጉም ኪድ', 'ጽሑፍ ተርጉም', 'ግዕዝ ተርጉም'],
      keywords: ['translator', 'translate', 'translation', 'dictionary', 'geez', 'tigrinya', 'ትርጉም', 'ተርጉም', 'መተርጎሚ', 'ግዕዝ'],
      icon: Globe,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.navigateTab('translator');
      },
      confirmationEn: 'Opening Ge\'ez and Tigrinya AI Translation Studio...',
      confirmationTi: 'ናብ ናይ ትግርኛን ግዕዝን ናይ ትርጉም ገጽ ይወስደኩም ኣሎ...',
    },
    {
      id: 'calligraphy',
      category: 'navigation',
      titleEn: 'Go to 4K Ge\'ez Calligraphy Studio',
      titleTi: 'ናብ 4K ግዕዝ ከሊግራፊ ስቱድዮ ኪድ (Calligraphy)',
      samplePhrasesEn: ['Open Calligraphy', 'Ge\'ez Studio', 'Mandala Art', 'Ancient Script Design'],
      samplePhrasesTi: ['ክፈት ከሊግራፊ', 'ግዕዝ ጽሕፈት', 'ማንዳላ ስእሊ', 'ጥንታዊ ፊደል'],
      keywords: ['calligraphy', 'fidel', 'script', 'mandala', 'art studio', 'calligraphy studio', 'ከሊግራፊ', 'ማንዳላ', 'ፊደል', 'ጽሕፈት'],
      icon: Sparkles,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.navigateTab('calligraphy');
      },
      confirmationEn: 'Opening 4K Ge\'ez Calligraphy & Mandala Studio...',
      confirmationTi: 'ናብ 4K ግዕዝ ከሊግራፊ ስቱድዮ ይወስደኩም ኣሎ...',
    },
    {
      id: 'vision',
      category: 'navigation',
      titleEn: 'Go to Multimodal Vision Studio',
      titleTi: 'ናብ ናይ ምስሊ መርመራ ስቱድዮ ኪድ (Vision)',
      samplePhrasesEn: ['Open Vision Studio', 'Analyze Image', 'Photo OCR', 'Visual Intelligence'],
      samplePhrasesTi: ['ክፈት ምስሊ', 'ስእሊ መርምር', 'ናይ ካሜራ ትንታነ', 'ቪዥን ስቱድዮ'],
      keywords: ['vision', 'image', 'photo', 'camera', 'visual', 'ocr', 'scan', 'ምስሊ', 'ስእሊ', 'ካሜራ', 'ቪዥን'],
      icon: Layers,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.navigateTab('vision');
      },
      confirmationEn: 'Opening Multimodal Vision and Visual Intelligence Studio...',
      confirmationTi: 'ናብ ናይ ምስሊ መርመራ ስቱድዮ ይወስደኩም ኣሎ...',
    },
    {
      id: 'education',
      category: 'navigation',
      titleEn: 'Open AI Education & Tutoring Platform',
      titleTi: 'ናይ ትምህርትን AI መምህርን ማእከል ክፈት (Education)',
      samplePhrasesEn: ['Open Education', 'AI Tutor', 'Homework Solver', 'Learn Ge\'ez', 'Course Catalog'],
      samplePhrasesTi: ['ክፈት ትምህርቲ', 'መምህር ኣክሱማዊ', 'ናይ ገዛ ዕዮ ፍታሕ', 'ግእዝ ተምሃር', 'ኮርሳት ርአ'],
      keywords: ['education', 'tutor', 'course', 'courses', 'homework', 'learn', 'academy', 'school', 'study', 'fidel', 'quiz', 'exam', 'ትምህርቲ', 'መምህር', 'ኮርስ', 'ኮርሳት', 'ናይ ገዛ ዕዮ', 'ፈተና'],
      icon: GraduationCap,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.navigateTab('education');
      },
      confirmationEn: 'Opening Axumite Sovereign AI Education and Tutoring Platform...',
      confirmationTi: 'ናይ ትምህርትን AI መምህርን ማእከል ይኽፈት ኣሎ...',
    },
    {
      id: 'prompt-forge',
      category: 'navigation',
      titleEn: 'Go to Prompt Forge AI Art Studio',
      titleTi: 'ናብ Prompt Forge ስእሊ ፈጣሪ ኪድ (Prompt Forge)',
      samplePhrasesEn: ['Open Prompt Forge', 'AI Art Engine', 'Generate Image Prompts', 'Midjourney Prompt'],
      samplePhrasesTi: ['ክፈት ፎርጅ', 'ስእሊ ፍጠር', 'ናይ Midjourney ፕሮምፕት', 'ፕሮምፕት ፎርጅ'],
      keywords: ['forge', 'prompt forge', 'art', 'midjourney', 'generate prompt', 'creative', 'ፎርጅ', 'ፕሮምፕት'],
      icon: Flame,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.navigateTab('prompt-forge');
      },
      confirmationEn: 'Opening Prompt Forge 8K Photorealistic Studio...',
      confirmationTi: 'ናብ Prompt Forge ስእሊ ፈጣሪ ስቱድዮ ይወስደኩም ኣሎ...',
    },
    {
      id: 'security',
      category: 'modals',
      titleEn: 'Open Security & Vault Center',
      titleTi: 'ናይ ደሕንነትን ቫልትን ማእከል ክፈት (Security)',
      samplePhrasesEn: ['Open Security', 'Vault Settings', 'Device Encryption', 'Biometric Lock'],
      samplePhrasesTi: ['ክፈት ደሕንነት', 'ቫልት ክፈት', 'ምስጢራዊ ቁልፊ', 'ደሕንነት መርምር'],
      keywords: ['security', 'vault', 'encryption', 'biometric', 'pin', 'lock', 'safe', 'ደሕንነት', 'ቫልት', 'ቁልፊ'],
      icon: Shield,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openSecurity();
      },
      confirmationEn: 'Opening Device Security and Sovereign Vault Center...',
      confirmationTi: 'ናይ ደሕንነትን ምስጢራዊ ቫልትን ማእከል ይኽፈት ኣሎ...',
    },
    {
      id: 'scholarship',
      category: 'tools',
      titleEn: 'Open Global Scholarships & Grants',
      titleTi: 'ዓለምለኸ ናጻ ናይ ትምህርቲ ዕድላት ክፈት (Scholarships)',
      samplePhrasesEn: ['Open Scholarships', 'Find Grants', 'Study Abroad Fellowships', 'University Aid'],
      samplePhrasesTi: ['ክፈት ስኮላርሺፕ', 'ትምህርቲ ዕድል ድለ', 'ናጻ ናይ ወጻኢ ትምህርቲ', 'ስኮላርሺፕ ርአ'],
      keywords: ['scholarship', 'scholarships', 'grant', 'grants', 'fellowship', 'study abroad', 'university', 'tuition', 'ስኮላርሺፕ', 'ትምህርቲ', 'ዕድል'],
      icon: GraduationCap,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openScholarship();
      },
      confirmationEn: 'Opening Global Scholarships and Research Grants Directory...',
      confirmationTi: 'ናይ ዓለምለኸ ስኮላርሺፕ ማእከል ይኽፈት ኣሎ...',
    },
    {
      id: 'job-search',
      category: 'tools',
      titleEn: 'Open Job Search & Career Assistant',
      titleTi: 'ናይ ስራሕ ዕድላትን ሞያን ሓጋዚ ክፈት (Jobs)',
      samplePhrasesEn: ['Open Job Search', 'Find Jobs', 'Career Opportunities', 'Remote Work'],
      samplePhrasesTi: ['ክፈት ስራሕ', 'ስራሕ ድለ', 'ናይ ስራሕ ዕድላት', 'ሞያ ሓጋዚ'],
      keywords: ['job', 'jobs', 'career', 'employment', 'work', 'hiring', 'vacancy', 'ስራሕ', 'ሞያ', 'ቆጻሪ'],
      icon: Briefcase,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openJobSearch();
      },
      confirmationEn: 'Opening Job Opportunities and Career Intelligence Hub...',
      confirmationTi: 'ናይ ስራሕ ዕድላትን ሞያን ሓጋዚ ይኽፈት ኣሎ...',
    },
    {
      id: 'legal-advisor',
      category: 'tools',
      titleEn: 'Open Legal & Civic Rights Advisor',
      titleTi: 'ሕጋዊ ምኽርን ሲቪክ መሰላትን ክፈት (Legal AI)',
      samplePhrasesEn: ['Open Legal Advisor', 'Civic Rights', 'Contract Analysis', 'Law Assistance'],
      samplePhrasesTi: ['ክፈት ሕጊ', 'ሕጋዊ ምኽሪ', 'ናይ መሰላት ሕጊ', 'ጠበቓ AI'],
      keywords: ['legal', 'law', 'lawyer', 'rights', 'civic', 'court', 'contract', 'ሕጊ', 'ሕጋዊ', 'ጠበቓ', 'መሰላት'],
      icon: FileText,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openLegalAdvisor();
      },
      confirmationEn: 'Opening Legal & Civic Rights Advisory Intelligence...',
      confirmationTi: 'ናይ ሕጋዊ ምኽርን ሲቪክ መሰላትን AI ይኽፈት ኣሎ...',
    },
    {
      id: 'mechanic',
      category: 'tools',
      titleEn: 'Open Auto Mechanic & Car Diagnostics',
      titleTi: 'ናይ መኪና ጸገም መርማሪ ክፈት (Auto Mechanic)',
      samplePhrasesEn: ['Open Mechanic', 'Car Diagnosis', 'Engine Trouble', 'Vehicle Repair'],
      samplePhrasesTi: ['ክፈት መካኒክ', 'ናይ መኪና ጸገም', 'ሞተር ተበላሽዩ', 'መኪና ምርመራ'],
      keywords: ['mechanic', 'car', 'vehicle', 'engine', 'diagnostic', 'diagnostics', 'repair', 'auto', 'መካኒክ', 'መኪና', 'ሞተር'],
      icon: Wrench,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openMechanic();
      },
      confirmationEn: 'Opening Auto Mechanic and Vehicle Diagnostics Tool...',
      confirmationTi: 'ናይ መኪና ምርመራን ቴክኒካዊ ሓጋዝን ይኽፈት ኣሎ...',
    },
    {
      id: 'drawer',
      category: 'modals',
      titleEn: 'Open Tools Menu & Drawer',
      titleTi: 'ናይ ኩሎም መሳርሒታት ዝርዝር ክፈት (Menu / Drawer)',
      samplePhrasesEn: ['Open Menu', 'Show Tools Drawer', 'All Features', 'Side Panel'],
      samplePhrasesTi: ['ክፈት ሜኑ', 'መሳርሒታት ርአ', 'ናይ ጎኒ ዝርዝር', 'ዝርዝር መሳርሒ'],
      keywords: ['menu', 'drawer', 'tools', 'sidebar', 'all tools', 'list', 'features', 'ሜኑ', 'መሳርሒታት', 'ዝርዝር'],
      icon: Compass,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.openDrawer();
      },
      confirmationEn: 'Opening Sovereign Side Navigation Drawer...',
      confirmationTi: 'ናይ ኩሎም መሳርሒታት ዝርዝር ገጽ ይኽፈት ኣሎ...',
    },
    {
      id: 'home',
      category: 'navigation',
      titleEn: 'Go to Main Home & Premiere',
      titleTi: 'ናብ መበገሲ ገጽ ተመለስ (Home / Premiere)',
      samplePhrasesEn: ['Go Home', 'Main Screen', 'Dashboard', 'Premiere View'],
      samplePhrasesTi: ['ናብ ሆም', 'መበገሲ ገጽ', 'ናብ ዋና ገጽ', 'ሆም'],
      keywords: ['home', 'main', 'premiere', 'start', 'dashboard', 'ሆም', 'መበገሲ', 'ዋና ገጽ'],
      icon: Navigation,
      execute: (ctx) => {
        ctx.closeOverlay();
        ctx.navigateTab('premiere');
      },
      confirmationEn: 'Navigating to Main Home Premiere View...',
      confirmationTi: 'ናብ መበገሲ ዋና ገጽ ይወስደኩም ኣሎ...',
    },
    {
      id: 'switch-lang-ti',
      category: 'system',
      titleEn: 'Switch Language to Tigrinya',
      titleTi: 'ቋንቋ ናብ ትግርኛ ቀይር',
      samplePhrasesEn: ['Switch to Tigrinya', 'Change language to Tigrinya', 'Tigrinya mode'],
      samplePhrasesTi: ['ቋንቋ ናብ ትግርኛ ቀይር', 'ብትግርኛ ግበሮ', 'ናብ ትግርኛ'],
      keywords: ['switch to tigrinya', 'change to tigrinya', 'language tigrinya', 'ናብ ትግርኛ', 'ብትግርኛ ግበሮ'],
      icon: Globe,
      execute: (ctx) => {
        ctx.setLanguage('ti');
        ctx.closeOverlay();
      },
      confirmationEn: 'App language switched to Tigrinya!',
      confirmationTi: 'ቋንቋ መተግበሪ ናብ ትግርኛ ተቐይሩ ኣሎ!',
    },
    {
      id: 'switch-lang-en',
      category: 'system',
      titleEn: 'Switch Language to English',
      titleTi: 'ቋንቋ ናብ እንግሊዝኛ ቀይር',
      samplePhrasesEn: ['Switch to English', 'Change language to English', 'English mode'],
      samplePhrasesTi: ['ቋንቋ ናብ እንግሊዝኛ ቀይር', 'ብእንግሊዝኛ ግበሮ', 'ናብ እንግሊዝኛ'],
      keywords: ['switch to english', 'change to english', 'language english', 'ናብ እንግሊዝኛ', 'ብእንግሊዝኛ ግበሮ'],
      icon: Globe,
      execute: (ctx) => {
        ctx.setLanguage('en');
        ctx.closeOverlay();
      },
      confirmationEn: 'App language switched to English!',
      confirmationTi: 'ቋንቋ መተግበሪ ናብ እንግሊዝኛ ተቐይሩ ኣሎ!',
    },
  ], []);

  // Text-to-speech audio feedback in Tigrinya
  const speakFeedback = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ti-ER';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const hornVoice = voices.find(
        (v) =>
          v.lang.startsWith('ti') ||
          v.lang.startsWith('am') ||
          v.name.toLowerCase().includes('tigrinya') ||
          v.name.toLowerCase().includes('amharic')
      );
      if (hornVoice) {
        utterance.voice = hornVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  // Intent parsing algorithm with scoring
  const detectIntent = (inputText: string): VoiceActionDefinition | null => {
    if (!inputText || inputText.trim().length === 0) return null;
    const clean = inputText.toLowerCase().trim();

    let bestAction: VoiceActionDefinition | null = null;
    let maxScore = 0;

    for (const act of actions) {
      let score = 0;

      // Check sample phrases exact match
      for (const phrase of [...act.samplePhrasesEn, ...act.samplePhrasesTi]) {
        const pClean = phrase.toLowerCase().trim();
        if (clean === pClean) {
          score += 100;
        } else if (clean.includes(pClean)) {
          score += 60;
        }
      }

      // Check keywords
      for (const kw of act.keywords) {
        const kwClean = kw.toLowerCase().trim();
        if (clean === kwClean) {
          score += 40;
        } else if (clean.includes(kwClean)) {
          score += 25;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestAction = act;
      }
    }

    // Minimum threshold for matching
    return maxScore >= 25 ? bestAction : null;
  };

  // Execution Handler
  const executeActionNow = (actionToRun: VoiceActionDefinition) => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    // Play crisp golden success confirmation chime
    playCommandSuccessChime();

    const confirmText = language === 'ti' ? actionToRun.confirmationTi : actionToRun.confirmationEn;
    setStatusMessage(confirmText);
    speakFeedback(confirmText);

    setTimeout(() => {
      actionToRun.execute({
        navigateTab: onNavigateTab,
        openSettings: onOpenSettings,
        openHistory: onOpenHistory,
        openNotifications: onOpenNotifications,
        openSecurity: onOpenSecurity,
        openPricing: onOpenPricing,
        openJobSearch: onOpenJobSearch,
        openScholarship: onOpenScholarship,
        openLegalAdvisor: onOpenLegalAdvisor,
        openMechanic: onOpenMechanic,
        openVideoTranslator: onOpenVideoTranslator,
        openDrawer: onOpenDrawer,
        setLanguage: effectiveSetLanguage,
        sendChatMessage: onSendChatMessage,
        closeOverlay: onClose,
      });
    }, 450);
  };

  // Handle transcript change and intent auto-execution
  const processInputText = (text: string) => {
    setTranscript(text);
    const matched = detectIntent(text);

    if (matched) {
      setMatchedAction(matched);
      setStatusMessage(language === 'ti' ? `ተለልዩ፡ "${matched.titleTi}"` : `Detected Action: "${matched.titleEn}"`);

      // Start 1.2s auto-execute countdown
      setExecutionCountdown(1);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

      countdownTimerRef.current = setTimeout(() => {
        executeActionNow(matched);
      }, 1100);
    } else {
      setMatchedAction(null);
      setExecutionCountdown(null);
      if (text.length > 2) {
        setStatusMessage(
          language === 'ti' 
            ? 'ትእዛዝ ኣይተረኽበን። በጃኹም ካብቶም ኣብ ታሕቲ ዘለዉ ምረጹ ወይ ደጊምኩም ተዛረቡ።'
            : 'Unrecognized command. Try saying "Open Settings", "Show History", or pick below.'
        );
      }
    }
  };

  // Audio wave visualizer setup
  const startAudioVisualizer = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkAudio = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(avg / 128); // 0 to 1 scale

        animationFrameRef.current = requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err: any) {
      console.warn('Audio Visualizer stream error:', err);
    }
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    setAudioLevel(0);
  };

  // Speech Recognition Initializer
  const startListening = () => {
    setMicPermissionError(null);
    setTranscript('');
    setInterimTranscript('');
    setMatchedAction(null);
    setStatusMessage(language === 'ti' ? 'ይሰምዕ ኣሎ... ተዛረቡ' : 'Listening... Speak your command');

    // Play subtle voice trigger chime
    playVoiceTriggerChime();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicPermissionError(
        language === 'ti'
          ? 'እዚ ብራውዘር Speech Recognition ኣይድግፍን። ኣብ ታሕቲ ዘለዉ ናይ 1-ጠውቂ ትእዛዛት ተጠቐሙ።'
          : 'Speech Recognition not supported in this browser. Please type or tap any command below.'
      );
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'ti' ? 'en-US' : 'en-US'; // English handles phonetics and Latin Tigrinya commands seamlessly

      recognition.onstart = () => {
        setIsListening(true);
        startAudioVisualizer();
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalStr = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalStr += item[0].transcript + ' ';
          } else {
            currentInterim += item[0].transcript;
          }
        }

        const fullText = (finalStr || currentInterim).trim();
        setInterimTranscript(currentInterim);

        if (fullText) {
          processInputText(fullText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicPermissionError(
            language === 'ti'
              ? 'ፍቓድ ማይክሮፎን ተኸልኪሉ ኣሎ። ኣብ ብራውዘርኩም ማይክሮፎን ፍቐዱ።'
              : 'Microphone permission denied. Please allow microphone access in your browser.'
          );
        }
        setIsListening(false);
        stopAudioVisualizer();
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioVisualizer();
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    stopAudioVisualizer();
  };

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      return;
    }

    // Auto-start listening on open
    startListening();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        if (isListening) stopListening();
        else startListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopListening();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredSuggestions = actions.filter((act) => {
    if (activeTabCategory === 'all') return true;
    return act.category === activeTabCategory;
  });

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in text-white select-none">
      
      {/* Top Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main HUD Modal Container */}
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#13121C] via-[#0E0D17] to-[#0A0910] border-2 border-[#C5A059]/60 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.25)] flex flex-col max-h-[92vh]">
        
        {/* Top HUD Header */}
        <div className="p-4 sm:p-5 bg-[#171626]/80 border-b border-[#8E6D28]/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black font-cinzel text-white tracking-wide">
                  {language === 'ti' ? 'ናይ ድምጺ ትእዛዛት (Voice Command HUD)' : 'Sovereign Voice Command Overlay'}
                </h2>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>LIVE AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ti' ? 'ብድምጽኹም "Open Settings" ወይ "Show History" ኢልኩም ተዛረቡ' : 'Navigate anywhere or trigger actions with natural language voice commands.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Always-Listening Hands-Free Toggle Button */}
            {onToggleAlwaysListening && (
              <button
                type="button"
                onClick={onToggleAlwaysListening}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer select-none ${
                  isAlwaysListening
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#181324] text-slate-300 border-[#8E6D28]/40 hover:border-amber-400'
                }`}
                title={
                  isAlwaysListening
                    ? (language === 'ti' ? 'Hands-Free ሁነታ ንቑሕ ኣሎ (ጠውቕ ንምቁራጽ)' : 'Always-Listening Hands-Free Mode Active (Click to disable)')
                    : (language === 'ti' ? 'Hands-Free ኩሉ ግዜ ሰማዒ ንምብራህ ጠውቕ' : 'Enable Always-Listening Hands-Free Voice Mode')
                }
              >
                <span className={`w-2 h-2 rounded-full ${isAlwaysListening ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                <Radio className={`w-3.5 h-3.5 ${isAlwaysListening ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="hidden xs:inline text-[11px]">
                  {isAlwaysListening
                    ? (language === 'ti' ? 'Hands-Free: ንቑሕ' : 'Always-On: LIVE')
                    : (language === 'ti' ? 'Hands-Free' : 'Always-On')}
                </span>
              </button>
            )}

            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                speechEnabled 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
              title={speechEnabled ? 'Mute AI Voice Feedback' : 'Enable AI Voice Feedback'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* ========================================================================= */}
          {/* SECTION 1: PULSATING MICROPHONE & LIVE AUDIO VISUALIZER                   */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
            
            {/* Microphone Orb with Multi-Layer Ripple Waves */}
            <div className="relative flex items-center justify-center">
              
              {/* Outer Pulsing Wave Rings */}
              {isListening && (
                <>
                  <div 
                    className="absolute w-36 h-36 rounded-full bg-amber-500/20 animate-ping pointer-events-none"
                    style={{ animationDuration: '2s' }}
                  />
                  <div 
                    className="absolute w-48 h-48 rounded-full border border-amber-400/30 animate-pulse pointer-events-none"
                    style={{ transform: `scale(${1 + audioLevel * 0.4})`, transition: 'transform 0.1s ease-out' }}
                  />
                  <div 
                    className="absolute w-60 h-60 rounded-full border border-amber-500/15 pointer-events-none"
                    style={{ transform: `scale(${1 + audioLevel * 0.7})`, transition: 'transform 0.1s ease-out' }}
                  />
                </>
              )}

              {/* Center Clickable Mic Button */}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 text-slate-950 ring-4 ring-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.5)]'
                    : 'bg-[#1D1B2E] border-2 border-[#C5A059]/60 text-amber-400 hover:border-amber-400 hover:bg-[#25223A]'
                }`}
                title={isListening ? 'Tap to Stop Listening' : 'Tap to Start Listening'}
              >
                {isListening ? (
                  <>
                    <Mic className="w-9 h-9 animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">LISTENING</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-8 h-8 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-300 mt-1">TAP TO TALK</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Message / Transcript Live Bubble */}
            <div className="w-full max-w-xl space-y-2">
              <div className="min-h-[50px] p-3.5 bg-[#151424]/90 border border-[#8E6D28]/40 rounded-2xl flex items-center justify-center shadow-inner">
                {transcript || interimTranscript ? (
                  <div className="flex items-center space-x-2 text-sm sm:text-base font-semibold text-white">
                    <Radio className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                    <span>&quot;{transcript || interimTranscript}&quot;</span>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-400 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{statusMessage || (language === 'ti' ? 'ተዛረቡ፡ ንኣብነት "Open Settings" ወይ "Show History"' : 'Say a command like "Open Settings" or "Show History"...')}</span>
                  </p>
                )}
              </div>

              {/* Mic Permission / Browser Warning Notice */}
              {micPermissionError && (
                <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-center space-x-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{micPermissionError}</span>
                </div>
              )}
            </div>

            {/* Matched Action Confirmation Pill / Execution Card */}
            {matchedAction && (
              <div className="w-full max-w-md p-4 bg-gradient-to-r from-[#1E1B33] via-[#241E3D] to-[#1E1B33] border-2 border-emerald-500/80 rounded-2xl shadow-xl flex items-center justify-between animate-slide-up">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <matchedAction.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400">
                      MATCHED COMMAND
                    </span>
                    <h4 className="font-bold text-white text-sm">
                      {language === 'ti' ? matchedAction.titleTi : matchedAction.titleEn}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => executeActionNow(matchedAction)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-transform active:scale-95 cursor-pointer flex items-center space-x-1.5 shadow-lg"
                >
                  <span>Execute</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: MANUAL TEXT COMMAND FALLBACK INPUT                             */}
          {/* ========================================================================= */}
          <div className="bg-[#11101C] p-3 sm:p-4 rounded-2xl border border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customInputText.trim()) {
                  processInputText(customInputText.trim());
                  setCustomInputText('');
                }
              }}
              className="flex items-center space-x-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  placeholder={language === 'ti' ? 'ወይ ብጽሑፍ ትእዛዝ ኣእትዉ (ንኣብነት፡ Open Settings, Show History...)' : 'Or type a command (e.g., Open Settings, Show History, Translate...)'}
                  className="w-full bg-[#181728] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>Run</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: CATEGORIZED 1-TAP QUICK COMMAND CHIPS                          */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ti' ? 'ዝተዳለዉ ናይ 1-ጠውቂ ትእዛዛት (Quick Command Suggestions)' : 'Quick Voice Command Suggestions'}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tap any command chip below to execute immediately or speak aloud.
                </p>
              </div>

              {/* Category Pills Switcher */}
              <div className="flex items-center space-x-1 bg-[#161524] p-1 rounded-xl border border-slate-800 text-[11px]">
                {(['all', 'navigation', 'modals', 'tools'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTabCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                      activeTabCategory === cat
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Command Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredSuggestions.map((action) => {
                const IconComponent = action.icon;
                const samplePh = language === 'ti' ? action.samplePhrasesTi[0] : action.samplePhrasesEn[0];

                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      processInputText(samplePh);
                      executeActionNow(action);
                    }}
                    className="p-3 rounded-2xl bg-[#141322] hover:bg-[#1C1A30] border border-slate-800/80 hover:border-amber-500/50 text-left transition-all group cursor-pointer flex items-center justify-between space-x-2.5 active:scale-98"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#201D36] group-hover:bg-amber-500/20 border border-slate-700/80 group-hover:border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                          &quot;{samplePh}&quot;
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {language === 'ti' ? action.titleTi : action.titleEn}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 shrink-0 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-3.5 sm:p-4 bg-[#141322] border-t border-[#8E6D28]/30 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[10px]">Space</span>
            <span>Toggle Mic</span>
            <span className="text-slate-600">•</span>
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[10px]">Esc</span>
            <span>Close</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
          >
            {language === 'ti' ? 'ዕጸው (Close HUD)' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
