import React, { useState } from 'react';
import { AppTab, UserProfile, SavedItem } from '../types';
import { 
  Menu, Bell, User, Users, ChevronRight, MessageCircle, 
  Briefcase, FileText, Mic, Volume2, Image, Camera, 
  Languages, Shield, Crown, Sparkles, Plus, GraduationCap, Globe, Palette, Video,
  Building2, Landmark, TrendingUp, Compass, Heart
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TranslationMethodModal } from './TranslationMethodModal';
import { EducationAiModal } from './EducationAiModal';
import { DocumentAiModal } from './DocumentAiModal';
import { SmartAssistantModal } from './SmartAssistantModal';
import { SpeechStudioModal } from './SpeechStudioModal';
import { AudioTranslationModal } from './AudioTranslationModal';
import { WrittenTranslationModal } from './WrittenTranslationModal';
import { WrittenChatModal } from './WrittenChatModal';
import { ScholarshipModal } from './ScholarshipModal';
import { JobSearchModal } from './JobSearchModal';

interface EritreanPremiereViewProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  user: UserProfile;
  onUpdateUser: (user: Partial<UserProfile>) => void;
  onSaveInsight: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  onOpenUserModal: () => void;
  onOpenOnboardingModal: () => void;
  onOpenSecurityModal?: () => void;
  onOpenJobSearch?: () => void;
  onOpenScholarship?: () => void;
  onOpenLegalAdvisor?: () => void;
  onOpenMechanic?: () => void;
  onOpenHistory?: () => void;
  onOpenPremiumModal?: () => void;
  onOpenDrawer?: () => void;
  unreadNotifCount?: number;
  onOpenNotifications?: () => void;
  onOpenVideoTranslator?: () => void;
  onOpenVoiceOverlay?: () => void;
}

export const EritreanPremiereView: React.FC<EritreanPremiereViewProps> = ({
  setActiveTab,
  user,
  onUpdateUser,
  onSaveInsight,
  onOpenAuthModal,
  onOpenUserModal,
  onOpenHistory,
  onOpenPremiumModal,
  onOpenDrawer,
  onOpenScholarship,
  unreadNotifCount = 0,
  onOpenNotifications,
  onOpenVideoTranslator,
  onOpenVoiceOverlay,
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
  const [isAudioTranslationModalOpen, setIsAudioTranslationModalOpen] = useState(false);
  const [isWrittenTranslationModalOpen, setIsWrittenTranslationModalOpen] = useState(false);
  const [isWrittenChatModalOpen, setIsWrittenChatModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [isJobSearchModalOpen, setIsJobSearchModalOpen] = useState(false);
  const [isDocumentAiModalOpen, setIsDocumentAiModalOpen] = useState(false);
  const [isSmartAssistantModalOpen, setIsSmartAssistantModalOpen] = useState(false);
  const [isSpeechStudioModalOpen, setIsSpeechStudioModalOpen] = useState(false);
  const [speechStudioInitialMode, setSpeechStudioInitialMode] = useState<'stt' | 'tts'>('stt');

  const displayName = user.name && user.name.trim() !== '' ? user.name : 'John Doe';
  const firstName = displayName.split(' ')[0] || 'John';
  const displayRole = user.role === 'Guest' 
    ? t.standardUser 
    : user.role 
      ? (language === 'ti' ? `${user.role} ተጠቃሚ` : `${user.role} User`) 
      : t.premiumUser;

  const handleOpenSpeechStudio = (mode: 'stt' | 'tts') => {
    setSpeechStudioInitialMode(mode);
    setIsSpeechStudioModalOpen(true);
  };

  const handleNavigateToChatWithPrompt = (prompt: string) => {
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF2FA] via-[#EEF5FC] to-[#E3EDF8] text-[#0F2856] font-sans pb-28 pt-2 px-3 sm:px-4 relative overflow-x-hidden">
      
      {/* Background Soft Glow Ambience */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto space-y-3.5 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER: MENU - GREETING TITLE - LANGUAGE TOGGLE & NOTIFICATION BELL */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-2 pt-1 pb-1">
          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-2xl shadow-xs border border-slate-100 flex items-center justify-center text-slate-700 hover:text-[#194BFB] hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            title={language === 'ti' ? 'ናይ መሳርሒታት ዝርዝር (Menu)' : 'Open navigation menu & tools'}
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Centered Main Question Heading */}
          <div className="text-center px-1 flex-1">
            <h1 className="text-[15.5px] sm:text-[17px] font-bold text-[#0F2856] leading-tight tracking-tight">
              {t.premiereGreetingLine1}
            </h1>
            <h2 className="text-[15.5px] sm:text-[17px] font-bold text-[#0F2856] leading-tight tracking-tight">
              {t.premiereGreetingLine2}
            </h2>
          </div>

          {/* Right Header Controls: Language Pill + Notification Bell */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Language Switcher Pill Button (Tigrinya / English) */}
            <button
              type="button"
              onClick={toggleLanguage}
              className={`h-10 px-2.5 rounded-2xl border shadow-xs flex items-center space-x-1 transition-all active:scale-95 cursor-pointer font-bold text-xs ${
                language === 'ti'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-white text-[#194BFB] border-slate-100 hover:bg-slate-50'
              }`}
              title={language === 'ti' ? 'Switch to English' : 'ናብ ትግርኛ ቐይር (Switch to Tigrinya)'}
              aria-label="Language Toggle"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[11px] tracking-tight font-extrabold">
                {language === 'ti' ? 'ትግርኛ' : 'EN'}
              </span>
            </button>

            {/* Notification Bell Button */}
            <button
              type="button"
              onClick={onOpenNotifications || onOpenHistory}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-2xl shadow-xs border border-slate-100 flex items-center justify-center text-slate-700 hover:text-[#194BFB] hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0 relative group"
              title={language === 'ti' ? 'ማእከል ምልክታታትን ስኮላርሺፕን (Notifications)' : 'Notifications & Scholarship Alerts'}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform text-[#0F2856]" />
              {unreadNotifCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-sm animate-pulse">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              ) : (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-slate-300 rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TOP USER INFO ROW (2 CARDS)                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Your Name */}
          <div 
            onClick={onOpenUserModal}
            className="bg-white rounded-2xl p-3 shadow-xs border border-slate-100/90 flex items-center space-x-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-full bg-[#4834D4]/12 text-[#4834D4] flex items-center justify-center shrink-0">
              <User className="w-4.5 h-4.5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-[#0F2856] block leading-tight">
                {t.yourNameLabel}
              </span>
              <span className="text-xs text-slate-500 font-medium truncate block mt-0.5">
                {displayName}
              </span>
            </div>
          </div>

          {/* Card 2: User Type */}
          <div 
            onClick={onOpenPremiumModal || onOpenUserModal}
            className="bg-white rounded-2xl p-3 shadow-xs border border-slate-100/90 flex items-center space-x-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-full bg-[#194BFB]/12 text-[#194BFB] flex items-center justify-center shrink-0">
              <Users className="w-4.5 h-4.5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-[#0F2856] block leading-tight">
                {t.userTypeLabel}
              </span>
              <span className="text-xs font-bold text-[#194BFB] truncate block mt-0.5">
                {displayRole}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. GREETING & AI ASSISTANT ROW (2 CARDS)                                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Hello, John / Welcome back! */}
          <div 
            onClick={onOpenUserModal}
            className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-slate-100/90 flex items-center space-x-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-xs shrink-0 bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                alt={displayName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] sm:text-sm font-bold text-[#0F2856] leading-tight truncate">
                {t.hello}, {firstName}
              </h3>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
                {t.welcomeBack}
              </p>
            </div>
          </div>

          {/* Card 2: AI Assistant (Royal Blue Quick Chat) */}
          <div 
            onClick={() => setIsWrittenChatModalOpen(true)}
            className="bg-gradient-to-r from-[#194BFB] to-[#143DCB] text-white rounded-2xl p-2.5 sm:p-3 shadow-md shadow-blue-500/20 flex items-center justify-between cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/80 shadow-xs shrink-0 bg-blue-100">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" 
                  alt="AI Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-[13px] sm:text-sm font-bold text-white leading-tight">
                  {t.aiAssistantCardTitle}
                </h3>
                <p className="text-[11px] text-blue-100 leading-tight mt-0.5 truncate">
                  {t.chatWithAi}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/90 stroke-[2.5] shrink-0" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. FEATURED GOLD HERO: AI VOICE ASSISTANT PRO                             */}
        {/* ========================================================================= */}
        <div className="rounded-3xl p-4 sm:p-4.5 relative overflow-hidden shadow-lg shadow-amber-900/10 bg-gradient-to-r from-[#D7A23A] via-[#ECC665] to-[#C99127] text-[#1E1B10] border border-amber-300/50">
          
          {/* Golden Texture Ambient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px] opacity-10 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3 min-w-0 pr-2">
              {/* 3D Embossed Metallic Golden Mic Square */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-[#F5D880] to-[#B37F1D] p-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] shrink-0 flex items-center justify-center border border-amber-200/80">
                <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#9C7127] via-[#694412] to-[#4A2E09] flex items-center justify-center border border-[#FBE08B]/60 shadow-inner">
                  <svg className="w-6 h-6 text-[#FEEBAE] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="#FEEBAE" fillOpacity="0.3" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-[14px] sm:text-base font-black tracking-tight text-[#1E1505] truncate">
                    {t.voiceHeroTitle}
                  </h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-[#1A1406] text-[#ECC665] rounded-md font-mono shrink-0 shadow-2xs">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] sm:text-[11.5px] text-[#3E300B] font-medium mt-0.5 leading-tight">
                  {t.voiceHeroSubtitle}
                </p>
              </div>
            </div>

            {/* Actions: Voice Command HUD & Live Pro */}
            <div className="flex items-center space-x-1.5 shrink-0">
              {onOpenVoiceOverlay && (
                <button
                  type="button"
                  onClick={onOpenVoiceOverlay}
                  className="py-2 px-3 rounded-full bg-[#1A1406] hover:bg-[#2C2108] text-[#ECC665] border border-amber-400/60 font-bold text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                  title="Open Voice Command HUD Overlay"
                >
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  <span>{language === 'ti' ? 'ትእዛዝ' : 'Voice HUD'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('assistance')}
                className="py-2 px-3 sm:px-3.5 rounded-full bg-[#194BFB] hover:bg-[#133BD0] text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-900/25 active:scale-95 transition-all cursor-pointer border border-blue-400/40"
              >
                <span>{t.startVoiceBtn}</span>
                <div className="w-4 h-4 rounded-full bg-[#ECC665] text-[#1A1406] flex items-center justify-center shadow-inner">
                  <ChevronRight className="w-3 h-3 stroke-[3]" />
                </div>
              </button>
            </div>
          </div>

          {/* Fluid Dynamic Blue Waveform Ribbon */}
          <div className="mt-2.5 pt-1 relative z-10 flex items-center justify-center">
            <div className="w-full h-7 relative flex items-center">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 360 36">
                <defs>
                  <linearGradient id="voiceWaveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#194BFB" />
                    <stop offset="25%" stopColor="#00A2FF" />
                    <stop offset="50%" stopColor="#194BFB" />
                    <stop offset="75%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#194BFB" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,24 L 30,24 Q 45,24 55,16 L 70,3 L 85,28 L 105,8 L 125,24 L 140,24 L 155,2 Q 165,0 175,14 L 190,28 L 205,6 L 220,24 L 235,12 L 248,28 L 265,8 L 285,24 L 310,14 L 330,24 L 360,24"
                  fill="none"
                  stroke="url(#voiceWaveGlow)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 0,24 L 30,24 Q 45,24 55,16 L 70,3 L 85,28 L 105,8 L 125,24 L 140,24 L 155,2 Q 165,0 175,14 L 190,28 L 205,6 L 220,24 L 235,12 L 248,28 L 265,8 L 285,24 L 310,14 L 330,24 L 360,24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
              </svg>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4.5. FEATURED SCHOLARSHIPS & JOB SEARCH HERO BANNERS                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Job Search Assistant Banner */}
          <div 
            onClick={() => setIsJobSearchModalOpen(true)}
            className="bg-gradient-to-r from-[#0E2038] via-[#16355F] to-[#0A1A33] rounded-3xl p-4 text-white border border-sky-400/40 shadow-lg shadow-blue-950/20 relative overflow-hidden cursor-pointer hover:border-sky-300 transition-all active:scale-[0.99] group"
          >
            <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between relative z-10 gap-2">
              <div className="flex items-center space-x-3 min-w-0 pr-1">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-900/40 border border-blue-300/40 shrink-0 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <h3 className="text-[13.5px] sm:text-[14.5px] font-black tracking-tight text-white truncate">
                      {language === 'ti' ? 'ስራሕ ድለ (Job Search)' : 'Axumite AI Job Assistant'}
                    </h3>
                    <span className="px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-md font-mono shrink-0">
                      {language === 'ti' ? 'AI ሓጋዚ' : 'CAREER AI'}
                    </span>
                  </div>
                  <p className="text-[10.5px] sm:text-[11px] text-blue-100/90 font-medium mt-0.5 leading-tight truncate">
                    {language === 'ti' ? 'ንዓኻ ዝሰማማዕ ስራሕ ምድላይ፣ ምድላው CVን ቃለ-መሕትትን' : 'Find tailored vacancies, draft AI CVs & interview coaching'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsJobSearchModalOpen(true);
                }}
                className="py-1.5 px-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs flex items-center space-x-1 shadow-md active:scale-95 transition-all cursor-pointer shrink-0 border border-blue-300/50"
              >
                <span>{language === 'ti' ? 'ድለ' : 'Find'}</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Scholarships Banner */}
          <div 
            onClick={() => setIsScholarshipModalOpen(true)}
            className="bg-gradient-to-r from-[#0C1B33] via-[#122A54] to-[#0A182F] rounded-3xl p-4 text-white border border-amber-400/40 shadow-lg shadow-blue-950/20 relative overflow-hidden cursor-pointer hover:border-amber-300 transition-all active:scale-[0.99] group"
          >
            <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between relative z-10 gap-2">
              <div className="flex items-center space-x-3 min-w-0 pr-1">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] text-white flex items-center justify-center shadow-md shadow-amber-900/40 border border-amber-300/60 shrink-0 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <h3 className="text-[13.5px] sm:text-[14.5px] font-black tracking-tight text-[#FFF2C2] truncate">
                      {language === 'ti' ? 'ዕድላት ስኮላርሺፕ (Scholarships)' : 'Global Scholarships & Grants'}
                    </h3>
                    <span className="px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md font-mono shrink-0">
                      {language === 'ti' ? '100% ነጻ' : 'FREE'}
                    </span>
                  </div>
                  <p className="text-[10.5px] sm:text-[11px] text-blue-100/90 font-medium mt-0.5 leading-tight truncate">
                    {language === 'ti' ? 'ዓለምለኸ ናጻ ናይ ትምህርቲ ዕድላት፣ ወግዓዊ መላግቦታትን AI ደብዳበን' : 'Verified official portals, full funding, and AI SOP essay builder'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsScholarshipModalOpen(true);
                }}
                className="py-1.5 px-3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-slate-950 font-black text-xs flex items-center space-x-1 shadow-md shadow-amber-900/30 active:scale-95 transition-all cursor-pointer shrink-0 border border-amber-200"
              >
                <span>{language === 'ti' ? 'ርአ' : 'Explore'}</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. 2-COLUMN GRID OF 10 AI TOOLS (5 ROWS x 2 COLS)                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 gap-2.5">
          
          {/* Tool 1: AI Chat */}
          <div
            onClick={() => setActiveTab('chat')}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-blue-600/10 font-serif font-black text-6xl select-none pointer-events-none translate-x-1 translate-y-2">
              Aa
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white font-sans font-black text-base shadow-md shadow-blue-500/25 ring-4 ring-blue-500/10">
                Aa
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-[#194BFB] transition-colors">
                {t.toolAiChatTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolAiChatDesc}
              </p>
            </div>
          </div>

          {/* Tool 2: Smart Assistant */}
          <div
            onClick={() => setIsSmartAssistantModalOpen(true)}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-1 bottom-1 text-emerald-500/10 select-none pointer-events-none">
              <MessageCircle className="w-16 h-16 fill-current" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#059669] via-[#10B981] to-[#34D399] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-emerald-600 transition-colors">
                {t.toolSmartAssistantTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolSmartAssistantDesc}
              </p>
            </div>
          </div>

          {/* Tool 3: Document AI */}
          <div
            onClick={() => setIsDocumentAiModalOpen(true)}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-amber-500/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <Briefcase className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D97706] via-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-white shadow-md shadow-amber-500/25 ring-4 ring-amber-500/10">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-amber-600 transition-colors">
                {t.toolDocumentAiTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolDocumentAiDesc}
              </p>
            </div>
          </div>

          {/* Tool 4: AI Writer */}
          <div
            onClick={() => setActiveTab('prompt-forge')}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-purple-500/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <FileText className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-white shadow-md shadow-purple-500/25 ring-4 ring-purple-500/10">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-purple-600 transition-colors">
                {t.toolAiWriterTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolAiWriterDesc}
              </p>
            </div>
          </div>

          {/* Tool 5: Speech to Text */}
          <div
            onClick={() => handleOpenSpeechStudio('stt')}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-blue-500/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <Mic className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-500/10">
                <Mic className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-blue-600 transition-colors">
                {t.toolSpeechToTextTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolSpeechToTextDesc}
              </p>
            </div>
          </div>

          {/* Tool 6: Text to Speech */}
          <div
            onClick={() => handleOpenSpeechStudio('tts')}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-red-500/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <Volume2 className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DC2626] via-[#EF4444] to-[#F87171] flex items-center justify-center text-white shadow-md shadow-red-500/25 ring-4 ring-red-500/10">
                <Volume2 className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-red-600 transition-colors">
                {t.toolTextToSpeechTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolTextToSpeechDesc}
              </p>
            </div>
          </div>

          {/* Tool 7: Image Generator */}
          <div
            onClick={() => setActiveTab('vision')}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-pink-500/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <Image className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DB2777] via-[#EC4899] to-[#F43F5E] flex items-center justify-center text-white shadow-md shadow-pink-500/25 ring-4 ring-pink-500/10">
                <Image className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-pink-600 transition-colors">
                {t.toolImageGenTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolImageGenDesc}
              </p>
            </div>
          </div>

          {/* Tool 8: Image Analyzer */}
          <div
            onClick={() => setActiveTab('vision')}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-cyan-500/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <Camera className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0891B2] via-[#06B6D4] to-[#22D3EE] flex items-center justify-center text-white shadow-md shadow-cyan-500/25 ring-4 ring-cyan-500/10">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-cyan-600 transition-colors">
                {t.toolImageAnalyzerTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolImageAnalyzerDesc}
              </p>
            </div>
          </div>

          {/* Tool 9: Translator */}
          <div
            onClick={() => setIsTranslationModalOpen(true)}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-indigo-500/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <Languages className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4F46E5] via-[#6366F1] to-[#818CF8] flex items-center justify-center text-white shadow-md shadow-indigo-500/25 ring-4 ring-indigo-500/10">
                <Languages className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-indigo-600 transition-colors">
                {t.toolTranslatorTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolTranslatorDesc}
              </p>
            </div>
          </div>

          {/* Tool 10: AI Learning */}
          <div
            onClick={() => setActiveTab('education')}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-amber-700/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <GraduationCap className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#92400E] via-[#B45309] to-[#D97706] flex items-center justify-center text-white shadow-md shadow-amber-700/25 ring-4 ring-amber-700/10">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-amber-700 transition-colors">
                {t.toolAiLearningTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {t.toolAiLearningDesc}
              </p>
            </div>
          </div>

          {/* Tool 11: Ge'ez Calligraphy & Pattern Studio */}
          <div
            onClick={() => setActiveTab('calligraphy')}
            className="bg-gradient-to-br from-[#FFFDF7] to-[#FFF8E7] rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-amber-300/80 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-amber-500/15 font-serif font-black text-6xl select-none pointer-events-none translate-x-1 translate-y-2">
              ግዕዝ
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B45309] via-[#D97706] to-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-amber-500/30 ring-4 ring-amber-500/10">
                <Palette className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <div className="flex items-center space-x-1">
                <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-amber-600 transition-colors">
                  {language === 'ti' ? 'ኪነ-ጽሕፈት ግዕዝ' : "Ge'ez Calligraphy Studio"}
                </h4>
                <span className="text-[9px] font-black font-mono bg-amber-500/20 text-amber-800 px-1 rounded">4K</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {language === 'ti' ? 'ውቁብ ጥንታዊ ቅርጽታትን ማኅተምን ብናይ Canvas ቴክኖሎጂ' : 'Artistic talismanic seals, knotworks & mandalas'}
              </p>
            </div>
          </div>

          {/* Tool 12: Scholarships & Grants */}
          <div
            onClick={() => setIsScholarshipModalOpen(true)}
            className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-slate-100/90 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-emerald-600/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <GraduationCap className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#047857] via-[#059669] to-[#10B981] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-emerald-600 transition-colors">
                {language === 'ti' ? 'ዕድላት ትምህርቲ (Scholarships)' : 'Scholarships & Grants'}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {language === 'ti' ? 'ናጻ ናይ ትምህርቲ ዕድላት ፈትሹ' : 'Explore verified global scholarship opportunities'}
              </p>
            </div>
          </div>

          {/* Tool 13: AI Video Translator & Dubbing */}
          <div
            onClick={onOpenVideoTranslator}
            className="bg-gradient-to-br from-[#FAF5FF] via-white to-[#FDF4FF] rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-fuchsia-200/80 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-fuchsia-600/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <Video className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9333EA] via-[#A855F7] to-[#D946EF] flex items-center justify-center text-white shadow-md shadow-fuchsia-500/25 ring-4 ring-fuchsia-500/10">
                <Video className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <div className="flex items-center space-x-1">
                <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-fuchsia-600 transition-colors">
                  {language === 'ti' ? 'ተርጓሚ ቪድዮ (Video Dub)' : 'AI Video Translator'}
                </h4>
                <span className="text-[9px] font-black font-mono bg-fuchsia-500/20 text-fuchsia-800 px-1 rounded">DUB</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {language === 'ti' ? 'ናይ ቪድዮ ቀጥታዊ ትርጉም፡ ደቢንግን ሳብስክሪፕሽንን' : 'Voice dubbing & synchronized subtitles for videos'}
              </p>
            </div>
          </div>

          {/* Tool 14: AI Business Hub & Copilot */}
          <div
            onClick={() => setActiveTab('business-hub')}
            className="bg-gradient-to-br from-[#FFFBF0] via-white to-[#FFF6E5] rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-amber-300/80 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-amber-500/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <Building2 className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B45309] via-[#D97706] to-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-amber-500/25 ring-4 ring-amber-500/10">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <div className="flex items-center space-x-1">
                <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-amber-600 transition-colors">
                  {language === 'ti' ? 'AI ናይ ንግዲ ሓጋዚ (Business Hub)' : 'AI Business Assistant'}
                </h4>
                <span className="text-[9px] font-black font-mono bg-amber-500/20 text-amber-800 px-1 rounded">PRO</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {language === 'ti' ? 'ፕላን ንግዲ፡ ምርምር ዕዳጋ፡ ፋይናንስን AI ደብዳበታትን' : 'Business plans, market research, budgeting & invoices'}
              </p>
            </div>
          </div>

          {/* Tool 15: Tigray & Eritrea Cultural AI Experience */}
          <div
            onClick={() => setActiveTab('cultural-explorer')}
            className="bg-gradient-to-br from-[#F0FDF4] via-white to-[#ECFDF5] rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-emerald-300/80 relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[140px] active:scale-[0.98]"
          >
            <div className="absolute right-0 bottom-0 text-emerald-500/10 select-none pointer-events-none translate-x-1 translate-y-1">
              <Landmark className="w-16 h-16" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#059669] via-[#10B981] to-[#34D399] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10">
                <Landmark className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5 relative z-10 mt-2">
              <div className="flex items-center space-x-1">
                <h4 className="font-bold text-[#0F2856] text-sm group-hover:text-emerald-600 transition-colors">
                  {language === 'ti' ? 'ባህላዊ ውርሻ (Cultural AI)' : 'Cultural AI & Heritage'}
                </h4>
                <span className="text-[9px] font-black font-mono bg-emerald-500/20 text-emerald-800 px-1 rounded">HERITAGE</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {language === 'ti' ? 'ቅርሲታት፡ ካርታ፡ ምስላታት፡ ሙዚቃን ዲጂታል ማህደርን' : 'Historical sites, Buna ritual, proverbs, map & archive'}
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 6. UPGRADE TO PREMIUM CARD BANNER                                         */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-[#FFF5DC] to-[#FDF0D0] rounded-2xl p-3.5 sm:p-4 shadow-xs border border-amber-200/80 flex items-center justify-between gap-2.5">
          <div className="flex items-center space-x-3 min-w-0 pr-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#0F2856] leading-tight truncate">
                {t.upgradePremiumTitle}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-snug">
                {t.upgradePremiumDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPremiumModal || (() => setActiveTab('payment'))}
            className="py-2 px-3.5 rounded-full bg-[#194BFB] hover:bg-[#133BD0] text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer shrink-0 border border-blue-400/40"
          >
            <span>{t.goPremiumBtn}</span>
            <div className="w-4 h-4 rounded-full bg-[#ECC665] text-[#1A1406] flex items-center justify-center shadow-inner">
              <ChevronRight className="w-3 h-3 stroke-[3]" />
            </div>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODALS & POPUPS                                                           */}
      {/* ========================================================================= */}

      {/* Translation Method Selector Modal */}
      <TranslationMethodModal
        isOpen={isTranslationModalOpen}
        onClose={() => setIsTranslationModalOpen(false)}
        onSelectAudio={() => {
          setIsTranslationModalOpen(false);
          setIsAudioTranslationModalOpen(true);
        }}
        onSelectWritten={() => {
          setIsTranslationModalOpen(false);
          setIsWrittenTranslationModalOpen(true);
        }}
        onSelectMethod={(method) => {
          setIsTranslationModalOpen(false);
          if (method === 'audio') {
            setIsAudioTranslationModalOpen(true);
          } else {
            setIsWrittenTranslationModalOpen(true);
          }
        }}
      />

      {/* Audio Translation Modal (Language Select + Live Voice Studio) */}
      <AudioTranslationModal
        isOpen={isAudioTranslationModalOpen}
        onClose={() => setIsAudioTranslationModalOpen(false)}
        user={user}
        onSaveInsight={onSaveInsight}
        onOpenAuthModal={onOpenAuthModal}
      />

      {/* Written Translation Modal (OCR Scan + Upload + Translate Output Card) */}
      <WrittenTranslationModal
        isOpen={isWrittenTranslationModalOpen}
        onClose={() => setIsWrittenTranslationModalOpen(false)}
        user={user}
        onSaveInsight={onSaveInsight}
        onOpenAuthModal={onOpenAuthModal}
      />

      {/* Written Chat Modal ('ዕላል ብጽሑፍ' - Gual Erey / Speed Banner / ሓጺር-ነዊሕ / Floating Dock) */}
      <WrittenChatModal
        isOpen={isWrittenChatModalOpen}
        onClose={() => setIsWrittenChatModalOpen(false)}
        user={user}
        onSaveInsight={onSaveInsight}
        onOpenAuthModal={onOpenAuthModal}
      />

      {/* Education AI Tutor Modal */}
      <EducationAiModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        user={user}
        onOpenAuthModal={onOpenAuthModal}
        onNavigateToChat={(prompt) => {
          setIsEducationModalOpen(false);
          setActiveTab('chat');
        }}
      />

      {/* Document AI Modal */}
      <DocumentAiModal
        isOpen={isDocumentAiModalOpen}
        onClose={() => setIsDocumentAiModalOpen(false)}
        user={user}
        onNavigateToChat={handleNavigateToChatWithPrompt}
      />

      {/* Smart Assistant Modal */}
      <SmartAssistantModal
        isOpen={isSmartAssistantModalOpen}
        onClose={() => setIsSmartAssistantModalOpen(false)}
        user={user}
        onNavigateToChat={handleNavigateToChatWithPrompt}
      />

      {/* Speech Studio Modal (STT & TTS) */}
      <SpeechStudioModal
        isOpen={isSpeechStudioModalOpen}
        onClose={() => setIsSpeechStudioModalOpen(false)}
        initialMode={speechStudioInitialMode}
        user={user}
        onNavigateToChat={handleNavigateToChatWithPrompt}
      />

      {/* Global Scholarships & Grants Opportunities Modal */}
      <ScholarshipModal
        isOpen={isScholarshipModalOpen}
        onClose={() => setIsScholarshipModalOpen(false)}
        user={user}
        onSaveInsight={onSaveInsight}
        onOpenAuthModal={onOpenAuthModal}
        onNavigateToChat={handleNavigateToChatWithPrompt}
      />

      {/* Eritrean AI Job Search & Career Assistant Modal */}
      <JobSearchModal
        isOpen={isJobSearchModalOpen}
        onClose={() => setIsJobSearchModalOpen(false)}
        onSelectPromptForChat={handleNavigateToChatWithPrompt}
      />

    </div>
  );
};

