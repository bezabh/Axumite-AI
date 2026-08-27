import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, GraduationCap, Globe, ExternalLink, Search, Sparkles, 
  CheckCircle2, BookOpen, Award, Filter, DollarSign, Calendar, 
  FileText, Send, Loader2, Copy, Check, ChevronRight, HelpCircle,
  Building2, Layers, BookmarkPlus, ArrowUpRight, Compass, Shield,
  Clock, Flame, AlertTriangle, Timer, Hourglass, CalendarClock,
  ArrowUpDown, CheckCircle, Info, Radio, RefreshCw, MapPin
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile, SavedItem } from '../types';
import { 
  Scholarship, 
  ScholarshipRegion, 
  DeadlineInfo, 
  DeadlineUrgency,
  calculateDeadlineInfo, 
  INTERNATIONAL_SCHOLARSHIPS_DATA, 
  SCHOLARSHIP_CHECKLIST_ITEMS, 
  ChecklistItem 
} from '../data/scholarshipData';
import { ScholarshipHourlyTracker } from './ScholarshipHourlyTracker';

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
  const [selectedRegion, setSelectedRegion] = useState<ScholarshipRegion>('All');
  const [selectedDegree, setSelectedDegree] = useState<string>('All');
  const [selectedFunding, setSelectedFunding] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [sortByDeadline, setSortByDeadline] = useState<boolean>(true);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Real-time hourly tick clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // 30s re-eval of deadline diffs
    return () => clearInterval(timer);
  }, []);

  // Auto-select initial scholarship if provided
  useEffect(() => {
    if (isOpen && initialScholarshipId) {
      const match = INTERNATIONAL_SCHOLARSHIPS_DATA.find(
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
  const urgentCount = INTERNATIONAL_SCHOLARSHIPS_DATA.filter(s => s.urgency === 'urgent').length;
  const approachingCount = INTERNATIONAL_SCHOLARSHIPS_DATA.filter(s => s.urgency === 'approaching').length;
  const upcomingCount = INTERNATIONAL_SCHOLARSHIPS_DATA.filter(s => s.urgency === 'upcoming').length;
  const rollingCount = INTERNATIONAL_SCHOLARSHIPS_DATA.filter(s => s.urgency === 'rolling').length;
  const fullyFundedCount = INTERNATIONAL_SCHOLARSHIPS_DATA.filter(s => s.fundingType === 'Fully Funded').length;

  // Filter scholarships
  let filteredScholarships = INTERNATIONAL_SCHOLARSHIPS_DATA.filter((sch) => {
    const matchesSearch = 
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.titleTi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.countryTi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = selectedRegion === 'All' || sch.region === selectedRegion;
    const matchesDegree = selectedDegree === 'All' || sch.degreeLevel === selectedDegree || sch.degreeLevel === 'All';
    const matchesFunding = selectedFunding === 'All' || sch.fundingType === selectedFunding;
    const matchesUrgency = selectedUrgency === 'All' || sch.urgency === selectedUrgency;

    return matchesSearch && matchesRegion && matchesDegree && matchesFunding && matchesUrgency;
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
      const prompt = `You are a world-class academic advisor and international scholarship mentor. Write a compelling, highly competitive, and authentic Statement of Purpose / Motivation Letter for an international scholarship application.

Target Scholarship / University: ${targetProgram}
Field of Study / Major: ${fieldOfStudy}
Applicant Academic Background: ${academicBackground || 'Bachelor degree with high academic standing'}
Future Goals & Community Impact: ${careerGoals || 'Apply specialized knowledge to solve critical development and technology challenges in home country and globally'}

Structure the letter professionally:
1. Formal Salutation & Captivating Hook / Introduction
2. Academic Background, Research Experience & Key Milestones
3. Exact Alignment: Why this specific International Scholarship and Host Country
4. Concrete Career Vision & Global / Local Development Contribution
5. Polished Professional Closing & Sign-off

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
🌍 ሃገር: ${sch.countryFlag} ${sch.country} (${sch.region})
🎓 ደረጃ: ${sch.degreeLevel}
💰 ደገፍ: ${sch.fundingTypeTi}
🔗 ወግዓዊ መርበብ: ${sch.officialUrl}
📅 ናይ ምዝገባ ዕለት: ${sch.deadline}

መግለጺ:
${sch.descriptionTi}

ዘጠቓልሎም ወጻኢታት:
${sch.coverageTi.join('\n- ')}`,
      tags: ['scholarship', sch.degreeLevel, sch.country, sch.region],
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0B0F19] border border-[#C5A059]/40 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh] relative"
      >
        
        {/* ========================================================================= */}
        {/* MODAL HEADER: BRANDING & GLOBAL TELEMETRY                                */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-[#121626] via-[#161B2E] to-[#121626] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] text-white flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-300/40 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-[#FFF2C2] tracking-tight truncate">
                  {language === 'ti' ? 'ዓለምለኻዊ ናይ ስኮላርሺፕ መከታተሊ (International Scholarships)' : 'International Scholarships & Hourly Status Command'}
                </h3>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Hourly Synced</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {language === 'ti' 
                  ? 'ናይ ሰሜን ኣሜሪካ፣ ኤውሮጳ፣ ኤስያን ዓለምለኸ ትካላትን ናጻ ትምህርቲ ዕድላት ምስ ሰዓታዊ ኲነታትን AI ደብዳበን' 
                  : 'Real-time hourly telemetry for North America, Europe, Asia & global fully funded fellowships'}
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
        {/* SUB NAVIGATION TABS                                                       */}
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
            <span>{language === 'ti' ? 'ዓለምለኻዊ ዝርዝር (Browse All)' : 'International Portals'}</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 text-current font-mono">
              {INTERNATIONAL_SCHOLARSHIPS_DATA.length}
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
            <span>{language === 'ti' ? 'ብ AI ናይ ስኮላርሺፕ ደብዳበ (AI SOP Drafter)' : 'AI Statement of Purpose Drafter'}</span>
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
            <span>{language === 'ti' ? 'ናይ ሰነዳት ቼክሊስት (Checklist)' : 'Document Readiness Checklist'}</span>
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
            
            {/* Live Hourly Status Sync Tracker Banner */}
            <ScholarshipHourlyTracker
              language={language}
              totalScholarships={INTERNATIONAL_SCHOLARSHIPS_DATA.length}
              urgentCount={urgentCount}
              fullyFundedCount={fullyFundedCount}
              selectedRegion={selectedRegion}
              onSelectRegion={(reg) => setSelectedRegion(reg)}
            />

            {/* Search & Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2">
              
              {/* Search input */}
              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ti' ? 'ብሽም ስኮላርሺፕ፣ ሃገር፣ ዓውዲ ድለ...' : 'Search USA, UK, Germany, Canada, Japan, Major...'}
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
                  <option value="urgent">{language === 'ti' ? '🔴 ቀልጢፍካ መልክት (Urgent / Closing Soon)' : '🔴 Urgent: Closing Soon (<45d)'}</option>
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
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-black/30 ml-0.5 font-mono">{INTERNATIONAL_SCHOLARSHIPS_DATA.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUrgency(selectedUrgency === 'urgent' ? 'All' : 'urgent')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                    selectedUrgency === 'urgent'
                      ? 'bg-rose-500/30 text-rose-200 border border-rose-500/80 shadow-xs'
                      : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/25'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'ti' ? 'ቀልጢፍካ መልክት' : 'Urgent / Closing Soon'}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-200 ml-0.5 font-mono">{urgentCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUrgency(selectedUrgency === 'approaching' ? 'All' : 'approaching')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                    selectedUrgency === 'approaching'
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-500/80 shadow-xs'
                      : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/25'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ti' ? 'ክፉት ኣሎ' : 'Open Now'}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-200 ml-0.5 font-mono">{approachingCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUrgency(selectedUrgency === 'upcoming' ? 'All' : 'upcoming')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                    selectedUrgency === 'upcoming'
                      ? 'bg-sky-500/30 text-sky-200 border border-sky-500/80 shadow-xs'
                      : 'bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/25'
                  }`}
                >
                  <CalendarClock className="w-3.5 h-3.5 text-sky-400" />
                  <span>{language === 'ti' ? 'ቀጻሊ ዙር' : 'Upcoming'}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-sky-950/60 border border-sky-500/40 text-sky-200 ml-0.5 font-mono">{upcomingCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUrgency(selectedUrgency === 'rolling' ? 'All' : 'rolling')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                    selectedUrgency === 'rolling'
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/80 shadow-xs'
                      : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/25'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ti' ? 'ቀጻሊ ምዝገባ' : 'Rolling'}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 ml-0.5 font-mono">{rollingCount}</span>
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
              <span>
                {language === 'ti' 
                  ? `ዝተረኽቡ ዓለምለኻውያን ዕድላት: ${filteredScholarships.length}` 
                  : `Matching International Programs: ${filteredScholarships.length}`}
              </span>
              <span className="text-amber-400/90 font-medium flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>
                  {language === 'ti' 
                    ? 'ቀይሕ ምልክት ዘለዎም ቀልጢፍኩም መልክቱ' 
                    : 'Real-time hourly countdown active'}
                </span>
              </span>
            </div>

            {/* Scholarships Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredScholarships.map((sch) => {
                const deadlineInfo = calculateDeadlineInfo(sch, currentTime);
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
                          
                          {/* Tags row + Flag + Visual Urgency Countdown Badge */}
                          <div className="flex items-center justify-between space-x-1.5 flex-wrap gap-y-1.5 mb-1.5">
                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                              <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                {sch.fundingTypeTi}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/15 text-sky-300 border border-blue-500/30">
                                {sch.degreeLevel}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-800 text-slate-200 flex items-center space-x-1">
                                <span>{sch.countryFlag}</span>
                                <span>{sch.country}</span>
                              </span>
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                {sch.region}
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

                      {/* Hourly Telemetry Strip */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800/80">
                        <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                          <Radio className="w-2.5 h-2.5 animate-pulse" />
                          <span>{language === 'ti' ? sch.portalStatusLabelTi : sch.portalStatusLabel}</span>
                        </span>
                        <span className="font-mono text-slate-400">
                          {language === 'ti' ? 'ስዓታዊ ፍተሻ: ድሉው' : 'Hourly Check: Verified'}
                        </span>
                      </div>

                      {/* Deadline Countdown & Application Timeline Strip */}
                      <div className={`mt-2 p-2 rounded-xl border flex flex-col space-y-1.5 ${
                        isUrgent
                          ? 'bg-rose-950/25 border-rose-500/30'
                          : sch.urgency === 'approaching'
                          ? 'bg-amber-950/20 border-amber-500/25'
                          : sch.urgency === 'rolling'
                          ? 'bg-emerald-950/20 border-emerald-500/20'
                          : 'bg-slate-900/90 border-slate-800/90'
                      }`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center space-x-1 text-slate-300 font-medium truncate">
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
                  {language === 'ti' ? 'በጃኹም ካልእ ቃል ተጠቒምኩም ፈትኑ ወይ ፍልተር ቀይሩ።' : 'Try adjusting your region, search query, or reset your degree filters.'}
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedRegion('All'); setSelectedDegree('All'); setSelectedFunding('All'); setSelectedUrgency('All'); }}
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
          const detailDeadlineInfo = calculateDeadlineInfo(selectedScholarship, currentTime);
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
                <span>{language === 'ti' ? 'ናብ ዝርዝር ስኮላርሺፕ ተመለስ' : 'Back to International Scholarships'}</span>
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
                  <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 flex items-center space-x-1">
                    <span>{selectedScholarship.countryFlag}</span>
                    <span>{selectedScholarship.country}</span>
                  </span>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    🌍 {selectedScholarship.region}
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

              {/* Deadline & Hourly Telemetry Live Countdown Alert Card */}
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
                        <span>{language === 'ti' ? 'ናይ ምዕጻው ዕለት ቆጸራ (Hourly Status & Countdown)' : 'Real-time Hourly Deadline Countdown'}</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {isUrgent 
                          ? (language === 'ti' ? '⚡ እዚ ስኮላርሺፕ ኣብ ቀረባ እዋን ይዕጾ ኣሎ! ናይ ቋንቋን ደብዳበን ሰነዳትኩም ኣዳልዉ።' : '⚡ High Urgency: This deadline is approaching fast. Submit before midnight host university timezone.')
                          : (language === 'ti' ? '📌 መመልከቲ ወግዓዊ መርበብን ቀጻሊ ዙርን ተኸታተሉ።' : '📌 Verified portal ingestion active with hourly check cycles.')}
                      </p>
                    </div>
                  </div>

                  {/* Countdown Ticker Box */}
                  <div className={`px-3 py-1.5 rounded-xl border text-right shrink-0 ${detailDeadlineInfo.badgeClass}`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80 font-mono">
                      {language === 'ti' ? 'ዝተረፈ ግዜ' : 'Time Left'}
                    </span>
                    <span className="text-xs sm:text-sm font-black font-mono">
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
                  : 'Enter your target international scholarship, study field, and background to generate a competitive, structured motivation letter.'}
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
                  placeholder="e.g., Fulbright USA, Chevening UK, DAAD Germany, Knight-Hennessy Stanford, Erasmus Mundus, KAUST..."
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
                    placeholder="e.g., Computer Science & AI, Public Health, Civil Engineering, Economics, MBA..."
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
                    placeholder="e.g., BSc in Computer Engineering, 3.85 GPA, 2 published research papers..."
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
                  placeholder="e.g., Intend to build AI educational tools for rural schools, return to teach university courses, and collaborate on global research..."
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
                    <span>{language === 'ti' ? 'ናይ ስኮላርሺፕ ሰነዳት ምድላው መከታተሊ' : 'International Scholarship Readiness Tracker'}</span>
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    {language === 'ti'
                      ? 'ዘድልዩ ሰነዳት ምስ ኣዳለኹም ነጥብታት ብምምራጽ ዕዉት ምድላውኩምን ዘለኩም ድልውነትን ብቐጥታ ተኸታተሉ።'
                      : 'Check off required and recommended documents to track your international scholarship preparation in real time.'}
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
            <span>{language === 'ti' ? 'ኩሎም መላግቦታት ወግዓዊን ውሑስን እዮም' : 'All links route directly to official international portals'}</span>
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
