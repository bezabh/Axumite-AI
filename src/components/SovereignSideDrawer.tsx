import React from 'react';
import { 
  X, Sparkles, MessageSquare, Languages, Mic, Briefcase, FileText, 
  Car, Clock, User, ShieldCheck, ChevronRight, LayoutDashboard, 
  BookmarkCheck, Globe, HelpCircle, Bot, GraduationCap, Palette, Bell, Video,
  Building2, Landmark, TrendingUp, Compass, Heart, Database, Gift, Moon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AppTab, UserProfile } from '../types';
import { isAdminOrCreator } from '../lib/permissions';
import { Axumite3DLogo } from './Axumite3DLogo';

interface SovereignSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppTab;
  onNavigateTab: (tab: AppTab) => void;
  user: UserProfile;
  onOpenUserModal: () => void;
  onOpenSecurityModal: () => void;
  onOpenPremiumModal: () => void;
  onOpenJobSearch: () => void;
  onOpenScholarship?: () => void;
  onOpenLegalAdvisor: () => void;
  onOpenMechanic: () => void;
  onOpenHistory: () => void;
  unreadNotifCount?: number;
  onOpenNotifications?: () => void;
  onOpenVideoTranslator?: () => void;
  onOpenVoiceOverlay?: () => void;
  onOpenFileVault?: () => void;
  onOpenHibernation?: () => void;
}

export const SovereignSideDrawer: React.FC<SovereignSideDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigateTab,
  user,
  onOpenUserModal,
  onOpenSecurityModal,
  onOpenPremiumModal,
  onOpenJobSearch,
  onOpenScholarship,
  onOpenLegalAdvisor,
  onOpenMechanic,
  onOpenHistory,
  unreadNotifCount = 0,
  onOpenNotifications,
  onOpenVideoTranslator,
  onOpenVoiceOverlay,
  onOpenFileVault,
  onOpenHibernation,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const isTigrinya = language === 'ti' || language === 'ti_tg';

  if (!isOpen) return null;

  const handleSelectTool = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10 sm:pr-16">
        <div 
          className="w-screen max-w-md bg-[#0C0E17] border-r border-[#8E6D28]/30 text-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-left duration-300"
          style={{
            background: 'linear-gradient(180deg, #0E101D 0%, #0A0C16 100%)',
          }}
        >
          
          {/* Top Header */}
          <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-amber-500/20 bg-[#090A12]">
            {/* Title: ኣክሱማይት AI with 3D styling */}
            <div className="cursor-pointer" onClick={() => handleSelectTool(() => onNavigateTab('premiere'))}>
              <Axumite3DLogo size="xs" showObeliskMedallion={true} showReflection={false} />
            </div>

            {/* Circular Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#1C1F2E] border border-slate-700/60 hover:bg-[#252A3D] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
            
            {/* Axumite AI Workspace Master Card */}
            <button
              onClick={() => handleSelectTool(() => onNavigateTab('premiere'))}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#C5A059] bg-gradient-to-r from-[#2A1D0B] via-[#452E10] to-[#2A1D0B] text-[#F3E5AB] hover:text-white flex items-center justify-between transition-all shadow-[0_0_25px_rgba(197,160,89,0.3)] hover:shadow-[0_0_35px_rgba(197,160,89,0.5)] cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-amber-300">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="font-black text-sm tracking-wide text-[#FFF4D0] group-hover:text-white font-sans">
                    ኣክሱማይት AI (Workspace)
                  </div>
                  <div className="text-[10px] text-amber-200/80 font-medium">
                    {language === 'ti' ? 'ቀንዲ ናይ መድረኽ ዕዮ' : 'Primary AI Dashboard'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* SECTION 1: ALL TOOLS */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                {language === 'ti' ? "ኩሎም መሳርሒታት (ALL TOOLS)" : "ALL TOOLS"}
              </div>

              <div className="space-y-2">
                {/* 0. Voice Command HUD Overlay */}
                {onOpenVoiceOverlay && (
                  <button
                    onClick={() => handleSelectTool(onOpenVoiceOverlay)}
                    className="w-full bg-gradient-to-r from-amber-500/15 via-[#1E192E] to-amber-500/15 hover:from-amber-500/25 hover:to-amber-500/25 border border-amber-500/50 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-md"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/90 border border-amber-400/60 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        <Mic className="w-5 h-5 text-amber-400 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-amber-200 group-hover:text-white transition-colors flex items-center space-x-1.5">
                          <span>ትእዛዝ ድምጺ (Voice HUD)</span>
                          <span className="text-[9px] bg-amber-500/30 text-amber-200 font-mono px-1 rounded">HOT</span>
                        </div>
                        <div className="text-[10.5px] text-amber-300/70">
                          Hands-Free Voice Navigation & Actions
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}


                {/* 1. Chat */}
                <button
                  onClick={() => handleSelectTool(() => onNavigateTab('chat'))}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ዕላል (Chat)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 2. Translate */}
                <button
                  onClick={() => handleSelectTool(() => onNavigateTab('translator'))}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-950/70 border border-blue-500/40 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Languages className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ትርጉም (Translate)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 2.55 AI Education & Sovereign Academy */}
                <button
                  onClick={() => handleSelectTool(() => onNavigateTab('education'))}
                  className="w-full bg-gradient-to-r from-amber-950/40 via-[#1C1728] to-amber-950/40 hover:from-amber-950/60 hover:to-amber-950/60 border border-amber-500/50 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-md"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/90 border border-amber-400/60 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <GraduationCap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-200 group-hover:text-white transition-colors flex items-center space-x-1.5">
                        <span>{language === 'ti' ? 'ማእከል ትምህርትን AI መምህርን' : 'AI Education & Academy'}</span>
                        <span className="text-[9px] bg-amber-500/30 text-amber-200 font-mono px-1 rounded">NEW</span>
                      </div>
                      <div className="text-[10.5px] text-amber-300/70">
                        {language === 'ti' ? 'Socratic AI Tutor, STEM Solver & Fidel' : 'AI Tutoring, Fidel Lab, Quizzes & Certs'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2.56 AI Business Hub & Copilot */}
                <button
                  onClick={() => handleSelectTool(() => onNavigateTab('business-hub'))}
                  className="w-full bg-gradient-to-r from-amber-950/50 via-[#1B1925] to-amber-900/30 hover:from-amber-900/60 hover:to-amber-900/60 border border-amber-500/60 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-md"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-950/90 border border-amber-400/70 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Building2 className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-200 group-hover:text-white transition-colors flex items-center space-x-1.5">
                        <span>{language === 'ti' ? 'AI ናይ ንግድን ቢዝነስን ሓጋዚ' : 'AI Business Assistant & Hub'}</span>
                        <span className="text-[9px] bg-amber-500/30 text-amber-200 font-mono px-1 rounded">PRO</span>
                      </div>
                      <div className="text-[10.5px] text-amber-300/70">
                        {language === 'ti' ? 'ፕላን ንግዲ፡ ዕዳጋ፡ ፋይናንስን ሰነዳትን' : 'Business Plans, Market Research, Invoices & Copilot'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2.57 Tigray & Eritrea Cultural AI Experience */}
                <button
                  onClick={() => handleSelectTool(() => onNavigateTab('cultural-explorer'))}
                  className="w-full bg-gradient-to-r from-emerald-950/40 via-[#131E1E] to-amber-950/40 hover:from-emerald-900/50 hover:to-amber-900/50 border border-emerald-500/50 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-md"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-950 to-amber-950/90 border border-emerald-400/60 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Landmark className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-200 group-hover:text-white transition-colors flex items-center space-x-1.5">
                        <span>{language === 'ti' ? 'ባህላዊ ውርሻ ትግራይ' : 'Tigray Cultural AI'}</span>
                        <span className="text-[9px] bg-emerald-500/30 text-emerald-300 font-mono px-1 rounded">HERITAGE</span>
                      </div>
                      <div className="text-[10.5px] text-amber-300/70">
                        {language === 'ti' ? 'ቅርሲታት፡ ምስላታት፡ ባህላዊ ሙዚቃን ዛንታን' : 'Monuments, Proverbs, Buna Ritual, Map & Archive'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2.58 Rewards & Cash Bonuses ($10 Payout Hub) */}
                <button
                  onClick={() => handleSelectTool(() => onNavigateTab('rewards'))}
                  className="w-full bg-gradient-to-r from-[#1A162B] via-[#261E3D] to-[#1A162B] hover:from-[#241B3E] hover:to-[#241B3E] border border-amber-500/50 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-md"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-[#352554] border border-[#E1C47D]/60 text-[#E1C47D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Gift className="w-5 h-5 text-[#E1C47D]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-200 group-hover:text-white transition-colors flex items-center space-x-1.5">
                        <span>{language === 'ti' ? 'ዓስብን ቦነስን (Rewards & Cash)' : 'Rewards & Cash Bonuses'}</span>
                        <span className="text-[9px] bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black font-mono px-1.5 py-0.2 rounded-full shadow-xs">$10</span>
                      </div>
                      <div className="text-[10.5px] text-amber-300/70">
                        {language === 'ti' ? 'ዕማማት ፈጽም እሞ ገንዘብ ረከብ (Payout)' : 'Complete tasks & earn money with $10 payout'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2.5 AI Video Translator & Dubbing Studio */}
                {onOpenVideoTranslator && (
                  <button
                    onClick={() => handleSelectTool(onOpenVideoTranslator)}
                    className="w-full bg-gradient-to-r from-[#1A122B]/90 via-[#2A173B]/90 to-[#1A122B]/90 hover:from-[#251842] hover:to-[#251842] border border-fuchsia-500/40 hover:border-fuchsia-400 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-md"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-fuchsia-950/80 border border-fuchsia-400/50 text-fuchsia-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-fuchsia-100 group-hover:text-white transition-colors flex items-center space-x-1.5">
                          <span>ተርጓሚ ቪድዮን ደቢንግን</span>
                          <span className="text-[9px] bg-fuchsia-500/30 text-fuchsia-200 font-mono px-1 rounded">AI DUB</span>
                        </div>
                        <div className="text-[10.5px] text-fuchsia-300/70">
                          Video Dubbing & Sync Subtitles
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-fuchsia-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                {/* 3. Ge'ez Calligraphy & Pattern Studio */}
                <button
                  onClick={() => handleSelectTool(() => onNavigateTab('calligraphy'))}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-950/90 to-yellow-950/90 border border-amber-500/60 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors flex items-center space-x-1.5">
                        <span>ኪነ-ጽሕፈት ግዕዝ (Calligraphy)</span>
                        <span className="text-[9px] bg-amber-500/30 text-amber-300 font-mono px-1 rounded">4K</span>
                      </div>
                      <div className="text-[10.5px] text-slate-400">
                        Sacred Talisman & Harag Patterns
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 4. Live Pro */}
                <button
                  onClick={() => handleSelectTool(() => onNavigateTab('assistance'))}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ቀጥታዊ ድምጺ (Live Pro)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 4. Job Search */}
                <button
                  onClick={() => handleSelectTool(onOpenJobSearch)}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-950/70 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ሓጋዚ ስራሕ (Job Search)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 5. Scholarships & Grants */}
                <button
                  onClick={() => handleSelectTool(onOpenScholarship || onOpenJobSearch)}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ዕድላት ስኮላርሺፕ (Scholarships)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 6. Legal */}
                <button
                  onClick={() => handleSelectTool(onOpenLegalAdvisor)}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ኣማኻሪ ሕጊ (Legal)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 7. Mechanic */}
                <button
                  onClick={() => handleSelectTool(onOpenMechanic)}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Car className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ክእለ መካኒክ (Mechanic)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>
              </div>
            </div>

            {/* SECTION 2: ACCOUNT, NOTIFICATIONS & HISTORY */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                {language === 'ti' ? "ምልክታታት፡ ታሪኽን ኣካውንትን" : "NOTIFICATIONS & ACCOUNT"}
              </div>

              <div className="space-y-2">
                {/* 0. Push Notifications & Alert Center */}
                {onOpenNotifications && (
                  <button
                    onClick={() => handleSelectTool(onOpenNotifications)}
                    className="w-full bg-[#1A132C]/90 hover:bg-[#251A3E] border border-amber-500/40 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-md"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner relative">
                        <Bell className="w-5 h-5" />
                        {unreadNotifCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-black flex items-center justify-center border border-black">
                            {unreadNotifCount}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#F3E5AB] group-hover:text-white transition-colors flex items-center space-x-1.5">
                          <span>{language === 'ti' ? 'ማእከል ምልክታታትን ስኮላርሺፕን' : 'Notifications & Alerts'}</span>
                          {unreadNotifCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950 font-mono">
                              {unreadNotifCount} {language === 'ti' ? 'ሓደሽቲ' : 'New'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] text-amber-200/70">
                          {language === 'ti' ? 'ስኮላርሺፕን ወሳኒ ናይ ስርዓት ዜናታትን' : 'Bilingual Scholarships & Updates'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                {/* 1. History */}
                <button
                  onClick={() => handleSelectTool(onOpenHistory)}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ታሪኽ ዕላል (History)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 2. Profile */}
                <button
                  onClick={() => handleSelectTool(onOpenUserModal)}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-600/40 text-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ፕሮፋይል (Profile)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 3. Security Center */}
                <button
                  onClick={() => handleSelectTool(onOpenSecurityModal)}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-yellow-950/50 border border-yellow-500/40 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ደሕንነትን ሻልትን (Security Center)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* 4. Sovereign Hibernation Standby Mode */}
                {onOpenHibernation && (
                  <button
                    onClick={() => handleSelectTool(onOpenHibernation)}
                    className="w-full bg-[#171226]/90 hover:bg-[#231A3B] border border-amber-500/40 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                          ዕረፍቲ / ድቃስ (Hibernation Standby)
                        </div>
                        <div className="text-[10px] text-amber-300/80">
                          {language === 'ti' ? 'ጸዓት ምዕቃብን ናይ ድቃስ ስርዓትን' : 'Energy saving & sovereign breathing emblem'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* SECTION 3: SYSTEM & OPERATIONS */}
            <div className="space-y-2.5 pb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                {language === 'ti' ? "ካልእ (SYSTEM)" : "SYSTEM & OPERATIONS"}
              </div>

              <div className="space-y-2">
                {/* Management Suite (Admin & Creator) */}
                {(isAdminOrCreator(user) || user?.role === 'Admin' || user?.role === 'Creator') && (
                  <button
                    onClick={() => handleSelectTool(() => onNavigateTab('management'))}
                    className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-indigo-500/40 hover:border-[#C5A059] rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                          {language === 'ti' ? 'ምሕደራ ተጠቃሚን ክፍሊትን (Management Suite)' : 'Enterprise User & Payment Hub'}
                        </div>
                        <div className="text-[10px] text-indigo-300/80">
                          {language === 'ti' ? 'ዝኣተዉ ተጠቀምቲ፡ ክፍሊታትን RBACን' : 'Active logins, transaction audits, RBAC'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-[#C5A059] text-black font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      SUPER
                    </span>
                  </button>
                )}

                {/* Saved Vault */}
                <button
                  onClick={() => handleSelectTool(() => onNavigateTab('saved'))}
                  className="w-full bg-[#131624]/90 hover:bg-[#1B1E30] border border-slate-800/80 hover:border-[#C5A059]/50 rounded-2xl p-3 flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-600/30 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <BookmarkCheck className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      ተዓቂቡ (Saved Vault)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>

                {/* Language Selector */}
                <div className="bg-[#131624]/90 border border-slate-800/80 rounded-2xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-100">
                          {isTigrinya ? 'ቋንቋ (Language)' : 'Language Selection'}
                        </div>
                        <div className="text-[11px] text-amber-300/80 font-medium">
                          {language === 'ti' || language === 'ti_tg'
                            ? 'ትግርኛ (Tigrinya)'
                            : language === 'de'
                            ? '🇩🇪 Deutsch'
                            : '🇬🇧 English (Intl)'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3-way language selection: Tigrinya, English, Deutsch */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setLanguage('ti')}
                      className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        language === 'ti' || language === 'ti_tg'
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60 shadow-sm'
                          : 'bg-[#181B2A] text-slate-400 hover:text-slate-200 hover:bg-[#202538]'
                      }`}
                    >
                      <span className="text-xs">📜</span>
                      <span className="truncate">ትግርኛ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        language === 'en'
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60 shadow-sm'
                          : 'bg-[#181B2A] text-slate-400 hover:text-slate-200 hover:bg-[#202538]'
                      }`}
                    >
                      <span>🇬🇧</span>
                      <span className="truncate">English</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('de')}
                      className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        language === 'de'
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60 shadow-sm'
                          : 'bg-[#181B2A] text-slate-400 hover:text-slate-200 hover:bg-[#202538]'
                      }`}
                    >
                      <span>🇩🇪</span>
                      <span className="truncate">Deutsch</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Footer Info */}
          <div className="p-4 border-t border-slate-800/80 bg-[#090A12] flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[10px] text-slate-400">AXUMITE v2.8 PRO</span>
            <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Sovereign Node Online</span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
