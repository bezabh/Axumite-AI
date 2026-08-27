import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Gift, Sparkles, Trophy, Zap, Lock, Star, Link2, 
  CheckCircle2, Clock, RotateCcw, RefreshCw, DollarSign, Wallet, 
  ChevronRight, ExternalLink, Share2, HelpCircle, ShieldCheck, 
  Smartphone, CreditCard, Building2, Send, Check, X, AlertCircle, 
  Coins, MessageSquare, BookOpen, Languages, Palette, Landmark, 
  Flame, Award, Eye
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AppTab, UserProfile } from '../types';
import { playGoldenNotificationChime } from '../services/notificationService';

interface RewardsViewProps {
  onBack?: () => void;
  onNavigateTab?: (tab: AppTab) => void;
  user?: UserProfile;
}

interface TaskItem {
  id: string;
  title: string;
  titleTi: string;
  description: string;
  descriptionTi: string;
  reward: number; // in USD (e.g. 0.05)
  category: 'chat' | 'education' | 'translator' | 'calligraphy' | 'vision' | 'culture' | 'daily' | 'referral';
  targetTab?: AppTab;
  completed: boolean;
  repeatable: boolean;
  iconType: 'link' | 'chat' | 'book' | 'translate' | 'palette' | 'culture' | 'flame' | 'share';
}

interface PayoutRequestRecord {
  id: string;
  amount: number;
  currency: string;
  method: 'telebirr' | 'cbe-birr' | 'nakfa-pay' | 'stripe' | 'paypal' | 'crypto';
  recipientName: string;
  recipientAccount: string;
  status: 'pending' | 'processing' | 'completed';
  timestamp: string;
  referenceCode: string;
}

const STORAGE_KEY_REWARDS = 'axumite_rewards_data_v1';

export const RewardsView: React.FC<RewardsViewProps> = ({
  onBack,
  onNavigateTab,
  user,
}) => {
  const { language } = useLanguage();
  const isTigrinya = language === 'ti' || language === 'ti_tg';

  // Initial State matching exact screenshot defaults ($10.00, 200 tasks done, Payout requested)
  const [unpaidBalance, setUnpaidBalance] = useState<number>(10.00);
  const [tasksDone, setTasksDone] = useState<number>(200);
  const [payoutRequested, setPayoutRequested] = useState<boolean>(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [floatingReward, setFloatingReward] = useState<{ amount: number; title: string; id: number } | null>(null);

  // Payout Form State
  const [payoutMethod, setPayoutMethod] = useState<'telebirr' | 'cbe-birr' | 'nakfa-pay' | 'stripe' | 'paypal' | 'crypto'>('telebirr');
  const [recipientName, setRecipientName] = useState(user?.name || 'Axumite Sovereign User');
  const [recipientAccount, setRecipientAccount] = useState(user?.phoneNumber || '+251 91 123 4567');
  const [payoutHistory, setPayoutHistory] = useState<PayoutRequestRecord[]>([
    {
      id: 'pay_req_9921',
      amount: 10.00,
      currency: 'USD',
      method: 'telebirr',
      recipientName: 'Axumite User',
      recipientAccount: '+251 91 123 4567',
      status: 'pending',
      timestamp: '2026-08-23 18:42',
      referenceCode: 'AXM-PAY-884920'
    }
  ]);

  // Task list definitions matching screenshot exactly + Axumite AI integrations
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task_visit_ai',
      title: 'Visit the AI Assistant',
      titleTi: 'ናብ AI ሓጋዚ ኪድ',
      description: 'Engage in a session with the Obelisk AI Assistant.',
      descriptionTi: 'ምስ ኦበሊስክ AI ሓጋዚ ዕላል ጀምር።',
      reward: 0.05,
      category: 'chat',
      targetTab: 'chat',
      completed: false,
      repeatable: true,
      iconType: 'link',
    },
    {
      id: 'task_open_lesson',
      title: 'Open a lesson',
      titleTi: 'ትምህርቲ ክፈት',
      description: 'Explore a Socratic AI lesson or Tigrinya Fidel tutorial.',
      descriptionTi: 'ናይ ፊደል ወይ ናይ ቋንቋ ትምህርቲ ጀምር።',
      reward: 0.05,
      category: 'education',
      targetTab: 'education',
      completed: false,
      repeatable: true,
      iconType: 'link',
    },
    {
      id: 'task_translate_phrase',
      title: 'Translate a phrase',
      titleTi: 'ሓረግ ተርጉም',
      description: 'Use the Ge\'ez & Tigrinya Neural Translator to convert text.',
      descriptionTi: 'ብተርጓሚ ግዕዝን ትግርኛን ጽሑፍ ተርጉም።',
      reward: 0.05,
      category: 'translator',
      targetTab: 'translator',
      completed: false,
      repeatable: true,
      iconType: 'link',
    },
    {
      id: 'task_calligraphy',
      title: 'Try Ge\'ez Calligraphy Studio',
      titleTi: 'ኪነ-ጽሕፈት ግዕዝ ፈትን',
      description: 'Generate sacred Harag calligraphy illuminated manuscripts.',
      descriptionTi: 'ቅዱስ ሓረግን ስነ-ጽሕፈት ግዕዝን ኣመንጭው።',
      reward: 0.05,
      category: 'calligraphy',
      targetTab: 'calligraphy',
      completed: false,
      repeatable: true,
      iconType: 'link',
    },
    {
      id: 'task_vision_art',
      title: 'Generate an AI Vision Masterpiece',
      titleTi: 'ናይ AI ስእሊ ኣመንጭው',
      description: 'Render high-resolution Tigray & Eritrea cultural artifacts in 4K.',
      descriptionTi: 'ናይ ባህላዊ ውርሻታት 4K ስእሊ ብ AI ኣመንጭው።',
      reward: 0.05,
      category: 'vision',
      targetTab: 'vision',
      completed: false,
      repeatable: true,
      iconType: 'link',
    },
    {
      id: 'task_culture_explore',
      title: 'Explore Cultural Heritage Monuments',
      titleTi: 'ታሪኻዊ ቅርሲታት ጐብንይ',
      description: 'Discover Axum Obelisks, Debre Damo, and ancient Geez scrolls.',
      descriptionTi: 'ሓወልቲ ኣክሱም፡ ደብረ ዳሞን ጥንታዊ ጽሑፋትን ጐብንይ።',
      reward: 0.05,
      category: 'culture',
      targetTab: 'cultural-explorer',
      completed: false,
      repeatable: true,
      iconType: 'link',
    },
    {
      id: 'task_daily_checkin',
      title: 'Daily Active Check-in',
      titleTi: 'ናይ መዓልቲ ተሳትፎ ቦነስ',
      description: 'Claim your daily loyalty reward for learning with Axumite AI.',
      descriptionTi: 'ናይ መዓልታዊ ምብጻሕ ቐጻልነት ዓስብኻ ተቐበል።',
      reward: 0.10,
      category: 'daily',
      completed: false,
      repeatable: true,
      iconType: 'flame',
    },
    {
      id: 'task_refer_friend',
      title: 'Invite a Friend to Axumite AI',
      titleTi: 'ንፈታዊኻ ዓድም',
      description: 'Share Axumite AI with friends or diaspora community members.',
      descriptionTi: 'ንፈተውትኻ ናብ ኣክሱማይት AI ብምዕዳም $1.00 ረከብ።',
      reward: 1.00,
      category: 'referral',
      completed: false,
      repeatable: true,
      iconType: 'share',
    },
  ]);

  // Load persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REWARDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.unpaidBalance === 'number') setUnpaidBalance(parsed.unpaidBalance);
        if (typeof parsed.tasksDone === 'number') setTasksDone(parsed.tasksDone);
        if (typeof parsed.payoutRequested === 'boolean') setPayoutRequested(parsed.payoutRequested);
        if (Array.isArray(parsed.payoutHistory)) setPayoutHistory(parsed.payoutHistory);
      }
    } catch (e) {
      console.warn('Failed to parse saved rewards data', e);
    }
  }, []);

  // Save persistence
  const persistState = (newBalance: number, newDone: number, newRequested: boolean, newHistory?: PayoutRequestRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_REWARDS, JSON.stringify({
        unpaidBalance: newBalance,
        tasksDone: newDone,
        payoutRequested: newRequested,
        payoutHistory: newHistory || payoutHistory,
      }));
    } catch (e) {
      console.warn('Failed to save rewards data', e);
    }
  };

  const payoutThreshold = 10.00;
  const progressPercent = Math.min(100, Math.round((unpaidBalance / payoutThreshold) * 100));

  // Handle task execution & earning
  const handleExecuteTask = (task: TaskItem) => {
    playGoldenNotificationChime();
    const newBalance = parseFloat((unpaidBalance + task.reward).toFixed(2));
    const newDone = tasksDone + 1;
    setUnpaidBalance(newBalance);
    setTasksDone(newDone);
    persistState(newBalance, newDone, payoutRequested);

    // Show floating reward celebration
    setFloatingReward({
      amount: task.reward,
      title: isTigrinya ? task.titleTi : task.title,
      id: Date.now()
    });
    setTimeout(() => {
      setFloatingReward(null);
    }, 2800);

    // If task has a target tab, give user option or navigate smoothly
    if (task.targetTab && onNavigateTab) {
      setTimeout(() => {
        onNavigateTab(task.targetTab!);
      }, 600);
    }
  };

  // Submit Payout Request
  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (unpaidBalance < payoutThreshold) return;

    playGoldenNotificationChime();
    const refCode = `AXM-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: PayoutRequestRecord = {
      id: `pay_req_${Date.now()}`,
      amount: unpaidBalance,
      currency: 'USD',
      method: payoutMethod,
      recipientName,
      recipientAccount,
      status: 'pending',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      referenceCode: refCode,
    };

    const newHistory = [newRecord, ...payoutHistory];
    setPayoutHistory(newHistory);
    setPayoutRequested(true);
    persistState(unpaidBalance, tasksDone, true, newHistory);
    setIsWithdrawModalOpen(false);
  };

  // Quick Demo Simulator to test states
  const handleSetSampleBalance = (val: number, req: boolean) => {
    setUnpaidBalance(val);
    setPayoutRequested(req);
    persistState(val, tasksDone, req);
  };

  return (
    <div className="min-h-screen bg-[#07060E] text-white selection:bg-[#E1C47D] selection:text-black font-sans pb-24">
      
      {/* Floating Reward Celebration Particle */}
      {floatingReward && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black font-black text-sm shadow-[0_0_25px_rgba(243,229,171,0.8)] border border-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-black animate-spin" />
            <span>+${floatingReward.amount.toFixed(2)} EARNED!</span>
            <span className="text-xs font-bold text-slate-800">({floatingReward.title})</span>
          </div>
        </div>
      )}

      {/* Top App Bar Header */}
      <div className="max-w-md mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center space-x-3 mb-2">
          {/* Back Button */}
          <button
            onClick={() => {
              if (onBack) {
                onBack();
              } else if (onNavigateTab) {
                onNavigateTab('premiere');
              }
            }}
            className="w-10 h-10 rounded-2xl bg-[#171328] hover:bg-[#251E3D] border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
            title="Go Back"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Gift className="w-6 h-6 text-[#E1C47D] shrink-0" />
              <h1 className="text-2xl font-black text-white tracking-tight">
                {isTigrinya ? 'ዓስብን ቦነስን (Rewards)' : 'Rewards'}
              </h1>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#E1C47D]" />
              <span>{isTigrinya ? 'ዕማማት ፈጽም እሞ ገንዘብ ረከብ' : 'Complete tasks and earn money'}</span>
            </div>
          </div>

          {/* History / Info Button */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="p-2 rounded-xl bg-[#171328] border border-slate-700/60 text-slate-400 hover:text-[#E1C47D] transition-all cursor-pointer"
            title="Payout History & Details"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Container (Mobile-first Framed Card) */}
      <div className="max-w-md mx-auto px-4 space-y-4">
        
        {/* ========================================================================= */}
        {/* 1. HERO REWARDS CARD (Matches Reference Image Pixel-for-Pixel)            */}
        {/* ========================================================================= */}
        <div 
          className="rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#131B32] via-[#0E1528] to-[#0A0E1C] border border-[#23355A] shadow-[0_12px_40px_rgba(7,14,30,0.8)] relative overflow-hidden group"
          style={{
            boxShadow: '0 0 35px rgba(22, 45, 90, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Unpaid Balance & Tasks Done */}
          <div className="grid grid-cols-2 gap-4 items-start mb-6">
            
            {/* Left Metric: UNPAID BALANCE */}
            <div>
              <div className="flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 font-mono mb-1">
                <Trophy className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>{isTigrinya ? 'ዘይተኸፍለ ሚዛን' : 'UNPAID BALANCE'}</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-[#E5C158] tracking-tight font-sans">
                ${unpaidBalance.toFixed(2)}
              </div>
            </div>

            {/* Right Metric: TASKS DONE */}
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 font-mono mb-1">
                <Zap className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>{isTigrinya ? 'ዝተፈጸሙ ዕማማት' : 'TASKS DONE'}</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
                {tasksDone}
              </div>
            </div>
          </div>

          {/* Progress Bar Row */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">
                {isTigrinya ? `ናብ $${payoutThreshold.toFixed(2)} ክፍሊት` : `Toward $${payoutThreshold.toFixed(2)} payout`}
              </span>
              <span className="text-[#E5C158] font-bold font-mono">
                {progressPercent}%
              </span>
            </div>

            {/* Glowing Golden Bar */}
            <div className="w-full h-2 rounded-full bg-[#18233D] overflow-hidden p-[1px] border border-[#2B3E68]/60">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#E1C47D] shadow-[0_0_12px_rgba(243,229,171,0.6)] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Payout Requested / Status Pill */}
          <div className="pt-1">
            {payoutRequested ? (
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#141F38]/90 hover:bg-[#1C2C4E] border border-[#8E6D28]/60 text-[#E1C47D] text-xs font-bold flex items-center space-x-2 cursor-pointer transition-all shadow-md active:scale-95 group/pill"
                title="View payout request status"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#E1C47D] group-hover/pill:rotate-180 transition-transform duration-500" />
                <span>{isTigrinya ? 'ክፍሊት ተሓቲቱ ኣሎ' : 'Payout requested'}</span>
              </button>
            ) : unpaidBalance >= payoutThreshold ? (
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center space-x-2 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isTigrinya ? 'ንምውጻእ ድሉው' : 'Ready to withdraw ($10.00)'}</span>
              </button>
            ) : (
              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>
                  {isTigrinya 
                    ? `ንምውጻእ ተወሳኺ $${(payoutThreshold - unpaidBalance).toFixed(2)} የድሊ` 
                    : `Earn $${(payoutThreshold - unpaidBalance).toFixed(2)} more to unlock withdrawal`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. WITHDRAW CALL-TO-ACTION BAR (Locked / Action Bar)                       */}
        {/* ========================================================================= */}
        <div className="w-full">
          {unpaidBalance < payoutThreshold ? (
            <div className="w-full py-3.5 px-4 rounded-2xl bg-[#140F24] border border-[#3A2A56] text-slate-300 font-bold text-sm flex items-center justify-center space-x-2.5 shadow-md">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>
                {isTigrinya 
                  ? `ንምውጻእ ናብ $${payoutThreshold.toFixed(2)} ብጻሕ` 
                  : `Reach $${payoutThreshold.toFixed(2)} to withdraw`}
              </span>
            </div>
          ) : payoutRequested ? (
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#17122B] via-[#2A1D45] to-[#17122B] hover:from-[#251A40] hover:to-[#251A40] border border-[#8E6D28]/60 hover:border-[#C5A059] text-[#F3E5AB] font-bold text-sm flex items-center justify-center space-x-2.5 shadow-lg cursor-pointer transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-[#E1C47D]" />
              <span>{isTigrinya ? 'ክፍሊት ተሓቲቱ ($10.00) • ኩነታት ርአ' : 'Payout Requested ($10.00) • View Status'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] hover:brightness-110 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2.5 shadow-xl shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
            >
              <DollarSign className="w-5 h-5 text-black" />
              <span>{isTigrinya ? 'ክፍሊት ሕተት ($10.00)' : 'Request $10.00 Payout Now'}</span>
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. TASKS SECTION                                                          */}
        {/* ========================================================================= */}
        <div className="pt-2 space-y-3">
          
          {/* Section Header with Star & Divider Line */}
          <div className="flex items-center space-x-2.5 py-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <h2 className="text-base font-extrabold text-white tracking-wide">
              {isTigrinya ? 'ዕማማት (Tasks)' : 'Tasks'}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-800/80" />
          </div>

          {/* Task Cards List */}
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="w-full p-3.5 rounded-2xl bg-[#120F24] hover:bg-[#181430] border border-slate-800/80 hover:border-[#8E6D28]/40 transition-all flex items-center justify-between shadow-md group"
              >
                {/* Left: Purple Box with Icon */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#231B3D] border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    {task.iconType === 'flame' ? (
                      <Flame className="w-5 h-5 text-amber-400" />
                    ) : task.iconType === 'share' ? (
                      <Share2 className="w-5 h-5 text-sky-400" />
                    ) : (
                      <Link2 className="w-5 h-5 text-purple-300" />
                    )}
                  </div>

                  {/* Middle: Title & Subtitle */}
                  <div>
                    <div className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                      {isTigrinya ? task.titleTi : task.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {isTigrinya ? task.descriptionTi : task.description}
                    </div>
                  </div>
                </div>

                {/* Right: Golden Pill Earn Button */}
                <button
                  onClick={() => handleExecuteTask(task)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#A58235] via-[#C9A24C] to-[#B38D38] hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs tracking-wide shadow-md transition-all flex items-center space-x-1 cursor-pointer shrink-0 ml-2"
                >
                  <span>{isTigrinya ? `ረከብ $${task.reward.toFixed(2)}` : `Earn $${task.reward.toFixed(2)}`}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Demo State Testing Sandbox Banner (For Verification & Quick Testing) */}
        <div className="mt-8 p-3 rounded-2xl bg-[#0F0D1C] border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Rewards Demo Testing Suite</span>
            </span>
            <span className="text-amber-400/80">Simulator</span>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-1.5">
            <button
              onClick={() => handleSetSampleBalance(10.00, true)}
              className="px-2.5 py-1 rounded-lg bg-[#1B162E] hover:bg-[#251F3D] border border-[#8E6D28]/40 text-[#F3E5AB] text-[11px] font-bold cursor-pointer"
            >
              Set $10.00 (Requested)
            </button>
            <button
              onClick={() => handleSetSampleBalance(10.00, false)}
              className="px-2.5 py-1 rounded-lg bg-[#1B162E] hover:bg-[#251F3D] border border-emerald-500/40 text-emerald-300 text-[11px] font-bold cursor-pointer"
            >
              Set $10.00 (Ready to Withdraw)
            </button>
            <button
              onClick={() => handleSetSampleBalance(4.50, false)}
              className="px-2.5 py-1 rounded-lg bg-[#1B162E] hover:bg-[#251F3D] border border-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
            >
              Set $4.50 (Locked)
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. WITHDRAWAL & PAYOUT MODAL                                              */}
      {/* ========================================================================= */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F0C1E] border border-[#8E6D28]/60 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-[#E1C47D]" />
                <h3 className="text-lg font-black text-white">
                  {isTigrinya ? 'ክፍሊት ምውጻእ' : 'Request Payout'}
                </h3>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#181329] text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#151028] border border-[#8E6D28]/30 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 uppercase font-mono">Withdrawal Amount</div>
                <div className="text-2xl font-black text-[#E1C47D]">${unpaidBalance.toFixed(2)} USD</div>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                100% REACHED
              </div>
            </div>

            <form onSubmit={handleSubmitPayout} className="space-y-4">
              {/* Payout Method Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Choose Payout Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'telebirr', name: 'Telebirr (ETB)', icon: Smartphone },
                    { id: 'cbe-birr', name: 'CBE Birr', icon: Building2 },
                    { id: 'nakfa-pay', name: 'Nakfa Mobile Pay', icon: Coins },
                    { id: 'stripe', name: 'Stripe / Bank Wire', icon: CreditCard },
                    { id: 'paypal', name: 'PayPal (Global)', icon: Send },
                    { id: 'crypto', name: 'USDT (TRC20)', icon: Sparkles },
                  ].map(m => {
                    const IconComponent = m.icon;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPayoutMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                          payoutMethod === m.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-[#151028] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 text-[#E1C47D]" />
                        <span className="text-xs font-bold">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Beneficiary Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Beneficiary Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16112C] border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Abebe Bikila"
                />
              </div>

              {/* Account / Phone / Wallet */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Phone / Account / Wallet Address</label>
                <input
                  type="text"
                  required
                  value={recipientAccount}
                  onChange={e => setRecipientAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16112C] border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. +251 91 123 4567 or Email"
                />
              </div>

              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Processed securely via Axumite Financial Clearinghouse within 24 hours.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-black font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 cursor-pointer"
              >
                Confirm & Request ${unpaidBalance.toFixed(2)} Payout
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PAYOUT STATUS & HISTORY MODAL                                          */}
      {/* ========================================================================= */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F0C1E] border border-[#8E6D28]/60 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-5 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#E1C47D]" />
                <h3 className="text-lg font-black text-white">
                  {isTigrinya ? 'ታሪኽ ክፍሊትን ኩነታትን' : 'Payout Status & History'}
                </h3>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#181329] text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Payout Request Tracker */}
            {payoutRequested && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17122B] via-[#24173D] to-[#17122B] border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-200 uppercase font-mono">Current Request</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold font-mono">
                    IN REVIEW
                  </span>
                </div>
                <div className="text-2xl font-black text-[#F3E5AB]">
                  ${unpaidBalance.toFixed(2)} USD
                </div>
                <div className="text-xs text-slate-300">
                  Beneficiary: <span className="text-white font-semibold">{recipientName}</span> ({recipientAccount})
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                  <span>Ref: AXM-PAY-884920</span>
                  <span>•</span>
                  <span>Telebirr / Mobile Money</span>
                </div>
              </div>
            )}

            {/* Historical Ledger List */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Past Transactions</div>
              {payoutHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">No past payouts yet.</div>
              ) : (
                payoutHistory.map(rec => (
                  <div key={rec.id} className="p-3 rounded-xl bg-[#141026] border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">${rec.amount.toFixed(2)} {rec.currency}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{rec.timestamp} • {rec.referenceCode}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                      {rec.status.toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setIsHistoryModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#1C1733] hover:bg-[#282147] border border-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
