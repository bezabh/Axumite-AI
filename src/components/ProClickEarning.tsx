import React, { useState, useMemo, useEffect } from 'react';
import { 
  MousePointerClick, Gift, Share2, Sparkles, Check, Copy, DollarSign, Award, 
  ArrowRight, Zap, Trophy, ShieldCheck, Play, RefreshCw, ExternalLink, 
  BarChart3, Calendar, Wallet, Send, History, Flame, ArrowUpRight, Clock, CheckCircle2, AlertCircle, TrendingUp, Layers, FileDown, UserPlus
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { ProClickTask, UserSubscription, ProClickDailyMetric, UserProfile } from '../types';
import { generateProClickPdfReport } from '../utils/proClickPdfReport';

const GENERATE_30_DAY_PERFORMANCE = (): ProClickDailyMetric[] => {
  const days: ProClickDailyMetric[] = [];
  let runningTokens = 12500;
  
  const baseClicksPattern = [
    12, 18, 24, 15, 30, 42, 38,
    20, 28, 32, 18, 35, 50, 45,
    25, 30, 40, 22, 38, 55, 48,
    30, 36, 42, 28, 45, 62, 58,
    42, 52
  ];

  for (let i = 0; i < 30; i++) {
    const dayNum = i + 1;
    const clicks = baseClicksPattern[i] || 25;
    const dailyTokens = clicks * 150 + (i % 3 === 0 ? 600 : 200);
    const referralBonus = i % 4 === 0 ? Math.floor(900 + (i * 35)) : Math.floor(150 + Math.random() * 200);
    const totalDaily = dailyTokens + referralBonus;
    runningTokens += totalDaily;
    const usdValue = parseFloat((runningTokens * 0.0002).toFixed(2));

    days.push({
      day: `Day ${dayNum}`,
      date: `Jul ${dayNum < 10 ? '0' + dayNum : dayNum}`,
      clicks,
      dailyTokens,
      referralBonus,
      totalDaily,
      cumulativeTokens: runningTokens,
      usdValue,
    });
  }

  return days;
};

const PRO_CLICK_30_DAY_DATA = GENERATE_30_DAY_PERFORMANCE();

interface ProClickEarningProps {
  subscription: UserSubscription;
  onRewardClaimed: (rewardAmount: number, taskTitle: string) => void;
  onSaveInsight?: (item: any) => void;
  user?: UserProfile;
  onOpenAuthModal?: (mode: 'login' | 'signup' | 'verify', reason?: string) => void;
}

interface WithdrawalRequest {
  id: string;
  amountTokens: number;
  usdEquivalent: number;
  method: 'mobile-money' | 'crypto-wallet' | 'bank-wire' | 'axum-gold-pass';
  recipientDetails: string;
  status: 'pending' | 'processing' | 'completed';
  date: string;
}

interface ActivityLog {
  id: string;
  title: string;
  tokens: number;
  category: string;
  timestamp: string;
  type: 'click' | 'referral' | 'daily-streak' | 'withdrawal';
}

const SAMPLE_CLICK_TASKS: ProClickTask[] = [
  {
    id: 't1',
    title: 'Daily Pro Click Bonus',
    titleTigrinya: 'ናይ መዓልቲ ፕሮ ክሊክ ቦነስ',
    description: 'Claim your daily 1,000 neural token reward for logging into AXUMITE AI.',
    tokenReward: 1000,
    category: 'daily',
    cooldownHours: 24,
  },
  {
    id: 't2',
    title: 'Explore UNESCO Asmara Art-Deco Showcase',
    titleTigrinya: 'ኣርኪቴክቸር ኣስመራ ጐብንይ',
    description: 'Visit the architectural archive of Asmara landmarks to earn tokens.',
    tokenReward: 1500,
    category: 'learning',
    clickUrl: 'https://whc.unesco.org/en/list/1550',
  },
  {
    id: 't3',
    title: 'Tigrinya Proverb Mastery Challenge',
    titleTigrinya: 'ምሳሌታት ትግርኛ ኣጽንዕ',
    description: 'Read and bookmark 3 ancient Tigrinya proverbs in the Axumite Heritage Hub.',
    tokenReward: 2000,
    category: 'learning',
  },
  {
    id: 't4',
    title: 'Watch 15s AXUMITE AI Sovereign Tech Demo',
    titleTigrinya: 'ናይ 15 ሰከንድ ቴክኖሎጂ ቪድዮ ርአ',
    description: 'Watch the high-speed neural architecture demonstration.',
    tokenReward: 2500,
    category: 'partner',
  },
  {
    id: 't5',
    title: 'Share Referral Link on WhatsApp / Socials',
    titleTigrinya: 'ሊንክካ ንኣዕሩኽትካ ሓብር',
    description: 'Earn 3,000 tokens for every friend who joins via your referral link.',
    tokenReward: 3000,
    category: 'social',
  },
];

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'a1',
    title: 'Daily Login Reward Claimed',
    tokens: 1000,
    category: 'Daily Bonus',
    timestamp: 'Today, 10:14 AM',
    type: 'daily-streak',
  },
  {
    id: 'a2',
    title: 'Referral Click Conversion (Asmara User)',
    tokens: 2500,
    category: 'Affiliate',
    timestamp: 'Yesterday, 04:30 PM',
    type: 'referral',
  },
  {
    id: 'a3',
    title: 'Tigrinya Dictionary Exploration',
    tokens: 1500,
    category: 'Learning',
    timestamp: 'Jul 28, 2026',
    type: 'click',
  },
  {
    id: 'a4',
    title: 'Referral Click Conversion (London User)',
    tokens: 2500,
    category: 'Affiliate',
    timestamp: 'Jul 27, 2026',
    type: 'referral',
  },
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'WDR-9021',
    amountTokens: 10000,
    usdEquivalent: 2.00,
    method: 'mobile-money',
    recipientDetails: '+291 7 123 456 (E-Nakfa)',
    status: 'completed',
    date: 'Jul 25, 2026',
  },
  {
    id: 'WDR-8814',
    amountTokens: 15000,
    usdEquivalent: 3.00,
    method: 'crypto-wallet',
    recipientDetails: '0x71C...4a89 (USDT TRC20)',
    status: 'completed',
    date: 'Jul 19, 2026',
  },
];

const CustomProClickTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProClickDailyMetric;
    return (
      <div className="bg-[#0D0B07] border-2 border-[#C5A059] p-3 shadow-[0_0_20px_rgba(197,160,89,0.4)] space-y-2 text-xs min-w-[200px]">
        <div className="flex items-center justify-between border-b border-[#8E6D28]/40 pb-1.5">
          <span className="font-bold text-[#F3E5AB]">{data.date} ({data.day})</span>
          <span className="text-[9px] px-1.5 py-0.5 bg-[#8E6D28]/30 border border-[#C5A059]/40 text-amber-200 font-mono">
            Pro Click Record
          </span>
        </div>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex justify-between items-center text-[#F3E5AB]">
            <span className="text-gray-400">Cumulative Vault:</span>
            <span className="font-bold text-[#F3E5AB]">+{data.cumulativeTokens.toLocaleString()} Tokens</span>
          </div>
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-gray-400">USD Value:</span>
            <span className="font-bold">${data.usdValue.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between items-center text-amber-300">
            <span className="text-gray-400">Daily Clicks Executed:</span>
            <span className="font-bold">{data.clicks} clicks</span>
          </div>
          <div className="flex justify-between items-center text-cyan-300">
            <span className="text-gray-400">Daily Token Output:</span>
            <span className="font-bold">+{data.totalDaily.toLocaleString()} Tokens</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ProClickEarning: React.FC<ProClickEarningProps> = ({
  subscription,
  onRewardClaimed,
  onSaveInsight,
  user,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'tracker' | 'withdraw'>('tasks');
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulatingClick, setSimulatingClick] = useState(false);
  const [activeTaskProcessing, setActiveTaskProcessing] = useState<string | null>(null);

  // Activity & Withdrawal State
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  // Sync stored registration bonus activities from localStorage on mount/update
  useEffect(() => {
    try {
      const savedActivities = localStorage.getItem('axumite_pro_click_activities');
      if (savedActivities) {
        const parsed = JSON.parse(savedActivities);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActivityLogs(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to sync stored activity logs:', e);
    }
  }, []);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  
  // Withdrawal Form State
  const [withdrawTokens, setWithdrawTokens] = useState<string>('5000');
  const [withdrawMethod, setWithdrawMethod] = useState<'mobile-money' | 'crypto-wallet' | 'bank-wire' | 'axum-gold-pass'>('mobile-money');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // 30-Day Pro Click Recharts Performance State
  const [chartTimeframe, setChartTimeframe] = useState<'30d' | '14d' | '7d'>('30d');
  const [chartMetricMode, setChartMetricMode] = useState<'cumulative' | 'dailyClicks' | 'dailyTokens'>('cumulative');

  const filteredChartData = useMemo(() => {
    if (chartTimeframe === '7d') return PRO_CLICK_30_DAY_DATA.slice(-7);
    if (chartTimeframe === '14d') return PRO_CLICK_30_DAY_DATA.slice(-14);
    return PRO_CLICK_30_DAY_DATA;
  }, [chartTimeframe]);

  const chartKPIs = useMemo(() => {
    const totalClicks = filteredChartData.reduce((acc, curr) => acc + curr.clicks, 0);
    const totalMined = filteredChartData.reduce((acc, curr) => acc + curr.totalDaily, 0);
    const peakClicks = Math.max(...filteredChartData.map((d) => d.clicks));
    const peakTokens = Math.max(...filteredChartData.map((d) => d.totalDaily));
    const avgClicks = Math.round(totalClicks / filteredChartData.length);
    const latestCumulativeUSD = filteredChartData[filteredChartData.length - 1]?.usdValue || 0;

    return {
      totalClicks,
      totalMined,
      peakClicks,
      peakTokens,
      avgClicks,
      latestCumulativeUSD,
    };
  }, [filteredChartData]);

  const handleDownloadPdfSummary = () => {
    generateProClickPdfReport(
      PRO_CLICK_30_DAY_DATA,
      subscription,
      chartKPIs
    );
    if (onSaveInsight) {
      onSaveInsight({
        title: `Exported Pro Click 30-Day PDF Summary Report`,
        type: 'payment',
        content: `Exported PDF financial ledger: 30 days history (${chartKPIs.totalClicks.toLocaleString()} total clicks, ${chartKPIs.totalMined.toLocaleString()} tokens mined, $${chartKPIs.latestCumulativeUSD.toFixed(2)} USD valuation).`,
        tags: ['pdf-export', 'pro-click-summary', 'record-keeping'],
      });
    }
  };

  const referralCode = subscription.referralCode || 'AXUM-ERITREA-PRO';
  const referralLink = `https://axumite.ai/join?ref=${referralCode}`;
  const totalEarnings = subscription.totalClickEarnings || 8500;
  const currentAvailableTokens = subscription.tokensRemaining || 25000;

  // Sound Chime feedback on token gain
  const triggerRewardChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2); // C6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Audio fallback
    }
  };

  const handleClaimTask = (task: ProClickTask) => {
    if (claimedIds.includes(task.id)) return;

    setActiveTaskProcessing(task.id);
    setTimeout(() => {
      setClaimedIds((prev) => [...prev, task.id]);
      setActiveTaskProcessing(null);
      triggerRewardChime();
      onRewardClaimed(task.tokenReward, task.title);

      // Add to activity logs
      const newLog: ActivityLog = {
        id: `a-${Date.now()}`,
        title: task.title,
        tokens: task.tokenReward,
        category: task.category,
        timestamp: 'Just now',
        type: 'click',
      };
      setActivityLogs((prev) => [newLog, ...prev]);

      if (onSaveInsight) {
        onSaveInsight({
          title: `[Pro Earning Claimed] ${task.title}`,
          type: 'payment',
          content: `Earned +${task.tokenReward.toLocaleString()} Neural Tokens.\nTask: ${task.title}\nCategory: ${task.category}`,
          tags: ['pro-click-earning', 'tokens-reward', task.category],
        });
      }
    }, 700);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateReferralClick = () => {
    setSimulatingClick(true);
    setTimeout(() => {
      setSimulatingClick(false);
      triggerRewardChime();
      onRewardClaimed(2500, 'Referral Link Click Conversion');

      const newLog: ActivityLog = {
        id: `ref-${Date.now()}`,
        title: 'Referral Click Conversion (+2,500 Tokens)',
        tokens: 2500,
        category: 'Affiliate',
        timestamp: 'Just now',
        type: 'referral',
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    }, 900);
  };

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(withdrawTokens, 10);
    if (isNaN(amountNum) || amountNum < 5000) {
      alert('Minimum withdrawal amount is 5,000 Neural Tokens ($1.00 USD).');
      return;
    }

    if (amountNum > currentAvailableTokens) {
      alert(`Insufficient balance! Your current available balance is ${currentAvailableTokens.toLocaleString()} tokens.`);
      return;
    }

    if (!recipientAddress.trim()) {
      alert('Please provide your recipient phone number, wallet address, or email.');
      return;
    }

    setIsSubmittingWithdraw(true);

    setTimeout(() => {
      setIsSubmittingWithdraw(false);
      const usdValue = parseFloat((amountNum * 0.0002).toFixed(2));
      const newWdr: WithdrawalRequest = {
        id: `WDR-${Math.floor(1000 + Math.random() * 9000)}`,
        amountTokens: amountNum,
        usdEquivalent: usdValue,
        method: withdrawMethod,
        recipientDetails: recipientAddress,
        status: 'pending',
        date: 'Just now',
      };

      setWithdrawals((prev) => [newWdr, ...prev]);
      setWithdrawSuccessMsg(`Withdrawal request ${newWdr.id} submitted! Payout of $${usdValue} USD is now processing.`);
      setRecipientAddress('');

      if (onSaveInsight) {
        onSaveInsight({
          title: `[Withdrawal Requested] ${newWdr.id}`,
          type: 'payment',
          content: `Requested Payout of $${usdValue} USD (${amountNum.toLocaleString()} Tokens)\nMethod: ${withdrawMethod}\nRecipient: ${recipientAddress}`,
          tags: ['withdrawal', 'payout-request', withdrawMethod],
        });
      }

      setTimeout(() => setWithdrawSuccessMsg(null), 5000);
    }, 1200);
  };

  // 7-day visual chart mockup data
  const weekDays = [
    { day: 'Mon', tokens: 1500, heightPct: 40 },
    { day: 'Tue', tokens: 2500, heightPct: 65 },
    { day: 'Wed', tokens: 1000, heightPct: 30 },
    { day: 'Thu', tokens: 3000, heightPct: 80 },
    { day: 'Fri', tokens: 2000, heightPct: 55 },
    { day: 'Sat', tokens: 4500, heightPct: 100 },
    { day: 'Sun (Today)', tokens: 3500, heightPct: 88 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* International Header Banner */}
      <div className="bg-[#080808] border border-[#8E6D28]/40 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#8E6D28]/20 border border-[#C5A059] text-[#F3E5AB] text-[10px] font-bold tracking-[0.2em] uppercase">
                INTERNATIONAL PRO EARNING DASHBOARD
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                Live Monetization Engine
              </span>
            </div>

            <h1 className="serif-luxury text-2xl sm:text-3xl font-bold tracking-[0.15em] text-slate-100 uppercase gold-gradient">
              PRO CLICK EARNINGS & WITHDRAWAL VAULT
            </h1>

            <p className="text-xs text-gray-300 leading-relaxed">
              Track daily click activities, monitor total lifetime affiliate payouts, and cash out accumulated neural tokens directly via Mobile Money, Crypto, or Bank Transfer.
            </p>
          </div>

          {/* Earning Balance Card */}
          <div className="bg-[#0E0C08] border border-[#8E6D28] p-5 space-y-3 text-right min-w-[240px] stela-glow flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                Available Cashout Balance
              </div>
              <div className="serif-luxury text-2xl font-bold text-[#F3E5AB] gold-gradient">
                {currentAvailableTokens.toLocaleString()} <span className="text-xs text-[#C5A059]">Tokens</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-end space-x-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>≈ ${(currentAvailableTokens * 0.0002).toFixed(2)} USD Available</span>
              </div>
            </div>

            <button
              onClick={handleDownloadPdfSummary}
              className="w-full px-3 py-2 bg-[#8E6D28] hover:bg-[#C5A059] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-black" />
              <span>Download Summary (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Registration Status & Pro Click Welcome Earning Banner */}
      <div className="bg-gradient-to-r from-[#18140B] via-[#211A0D] to-[#0F0C06] border-2 border-[#C5A059] p-5 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-4 relative z-10">
          <div className="p-3.5 bg-gradient-to-br from-[#8E6D28]/40 to-[#C5A059]/30 border border-[#C5A059] rounded-2xl text-amber-300 shrink-0 shadow-lg">
            <Gift className="w-7 h-7 icon-gold-glow animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="serif-luxury text-sm sm:text-base font-extrabold text-[#F3E5AB] uppercase tracking-wider">
                {user?.isLoggedIn ? 'PRO CLICK REGISTRATION EARNING BONUS ACTIVE' : 'PRO CLICK REGISTRATION EARNING BONUS AVAILABLE'}
              </h3>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold rounded-full">
                +5,000 Tokens ($1.00 USD)
              </span>
            </div>
            <p className="text-xs text-gray-300 pt-1.5 leading-relaxed">
              {user?.isLoggedIn ? (
                <>
                  Welcome registered member <strong className="text-[#F3E5AB]">{user.name || 'Sovereign Member'}</strong>! Your registration reward of <strong>5,000 Neural Tokens ($1.00 USD value)</strong> is active in your Pro Click vault balance.
                </>
              ) : (
                <>
                  Register an account today to receive an instant <strong className="text-[#F3E5AB]">+5,000 Neural Token Welcome Bonus</strong> ($1.00 USD value) credited directly to your Pro Click vault!
                </>
              )}
            </p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          {user?.isLoggedIn ? (
            <div className="flex items-center space-x-2 bg-[#080808] border border-emerald-500/50 px-4 py-2.5 rounded-2xl text-emerald-400 text-xs font-bold font-mono shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Registration Bonus Active ✓</span>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal?.('signup', 'Register an account now to claim your +5,000 Pro Click Welcome Bonus!')}
              className="px-5 py-3 bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black font-extrabold text-xs uppercase tracking-wider rounded-full shadow-xl hover:brightness-110 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-black" />
              <span>Register & Claim +5,000 Tokens</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Dashboard Navigation Tabs */}
      <div className="flex border-b border-[#8E6D28]/30 bg-[#080808]">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-all ${
            activeTab === 'tasks'
              ? 'border-[#C5A059] text-[#F3E5AB] bg-[#14110B]'
              : 'border-transparent text-gray-400 hover:text-slate-200 hover:bg-[#0D0D0D]'
          }`}
        >
          <MousePointerClick className="w-4 h-4 text-[#C5A059]" />
          <span>Pro Click Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex-1 py-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-all ${
            activeTab === 'tracker'
              ? 'border-[#C5A059] text-[#F3E5AB] bg-[#14110B]'
              : 'border-transparent text-gray-400 hover:text-slate-200 hover:bg-[#0D0D0D]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Daily Activity Tracker</span>
        </button>

        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-all ${
            activeTab === 'withdraw'
              ? 'border-[#C5A059] text-[#F3E5AB] bg-[#14110B] stela-glow'
              : 'border-transparent text-gray-400 hover:text-slate-200 hover:bg-[#0D0D0D]'
          }`}
        >
          <Wallet className="w-4 h-4 text-amber-300" />
          <span>Withdrawal Request Vault</span>
        </button>
      </div>

      {/* TAB 1: PRO CLICK TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Referral Link & Pro Affiliate Bar */}
          <div className="bg-[#080808] border border-[#8E6D28]/30 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Your International Referral Link
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Earn <strong>+2,500 Tokens</strong> instantly whenever a user clicks your link.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSimulateReferralClick}
                  disabled={simulatingClick}
                  className="px-3 py-2 bg-[#14110B] border border-[#C5A059] hover:bg-[#8E6D28]/30 text-[#F3E5AB] text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-all"
                  title="Test referral click reward generation"
                >
                  <MousePointerClick className={`w-3.5 h-3.5 text-[#C5A059] ${simulatingClick ? 'animate-bounce' : ''}`} />
                  <span>{simulatingClick ? 'Processing Click...' : 'Test Referral Click (+2,500)'}</span>
                </button>
              </div>
            </div>

            {/* Input Copy Box */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 bg-[#050505] border border-[#8E6D28]/40 p-2.5 text-xs text-slate-200 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyReferral}
                className="px-4 py-2.5 bg-[#8E6D28] text-black hover:bg-[#F3E5AB] text-xs font-bold uppercase tracking-wider flex items-center space-x-1 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Pro Click Tasks Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#8E6D28]/20 pb-2">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-[#C5A059]" />
                <h2 className="serif-luxury text-base font-bold text-[#F3E5AB] uppercase tracking-wider">
                  Available Pro Click Tasks & Rewards
                </h2>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {SAMPLE_CLICK_TASKS.length - claimedIds.length} Available Tasks
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_CLICK_TASKS.map((task) => {
                const isClaimed = claimedIds.includes(task.id);
                const isProcessing = activeTaskProcessing === task.id;

                return (
                  <div
                    key={task.id}
                    className={`p-5 border transition-all flex flex-col justify-between space-y-4 relative ${
                      isClaimed
                        ? 'bg-[#050505] border-gray-800 opacity-70'
                        : 'bg-[#080808] border-[#8E6D28]/30 hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#8E6D28]/15 border border-[#8E6D28]/30 text-[9px] uppercase font-mono text-[#F3E5AB]">
                          {task.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>+{task.tokenReward.toLocaleString()} Tokens</span>
                        </span>
                      </div>

                      <h3 className="serif-luxury text-lg font-bold text-slate-100">
                        {task.title}
                      </h3>

                      {task.titleTigrinya && (
                        <p className="text-xs font-serif text-[#C5A059]">
                          {task.titleTigrinya}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#8E6D28]/20 flex items-center justify-between">
                      {task.clickUrl ? (
                        <a
                          href={task.clickUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#C5A059] hover:underline flex items-center space-x-1"
                        >
                          <span>Visit Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono">Instant Claim</span>
                      )}

                      <button
                        onClick={() => handleClaimTask(task)}
                        disabled={isClaimed || isProcessing}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                          isClaimed
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                            : 'bg-[#14110B] border border-[#8E6D28] hover:bg-[#8E6D28] hover:text-black text-[#F3E5AB]'
                        }`}
                      >
                        {isClaimed ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Claimed</span>
                          </>
                        ) : isProcessing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <MousePointerClick className="w-3.5 h-3.5" />
                            <span>Click & Claim</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY ACTIVITY TRACKER & ANALYTICS */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Top Streak & Stat Summary (4 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#080808] border border-[#8E6D28]/30 p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Total Period Clicks</span>
                <MousePointerClick className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div className="serif-luxury text-2xl font-bold text-[#F3E5AB]">
                {chartKPIs.totalClicks.toLocaleString()} <span className="text-xs text-amber-400">Clicks</span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">
                Avg {chartKPIs.avgClicks} clicks/day
              </div>
            </div>

            <div className="bg-[#080808] border border-[#8E6D28]/30 p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Tokens Mined ({chartTimeframe})</span>
                <Trophy className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div className="serif-luxury text-2xl font-bold text-emerald-400">
                +{chartKPIs.totalMined.toLocaleString()} <span className="text-xs text-gray-400">Tokens</span>
              </div>
              <div className="text-[10px] text-emerald-500/80 font-mono">
                ≈ ${(chartKPIs.totalMined * 0.0002).toFixed(2)} USD Output
              </div>
            </div>

            <div className="bg-[#080808] border border-[#8E6D28]/30 p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>30-Day Cumulative Vault</span>
                <TrendingUp className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="serif-luxury text-2xl font-bold text-slate-100">
                ${chartKPIs.latestCumulativeUSD.toFixed(2)} <span className="text-xs text-emerald-400">USD</span>
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                +48.2% Growth Velocity
              </div>
            </div>

            <div className="bg-[#080808] border border-[#8E6D28]/30 p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Peak Day Performance</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="serif-luxury text-2xl font-bold text-amber-300">
                {chartKPIs.peakClicks} <span className="text-xs text-gray-400">Max Clicks</span>
              </div>
              <div className="text-[10px] text-amber-400/80 font-mono">
                Peak: +{chartKPIs.peakTokens.toLocaleString()} Tokens
              </div>
            </div>
          </div>

          {/* 30-DAY PRO CLICK PERFORMANCE CHART (RECHARTS) */}
          <div className="bg-[#080808] border border-[#8E6D28]/40 p-5 sm:p-6 space-y-5 shadow-2xl stela-glow">
            
            {/* Chart Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#8E6D28]/30 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="serif-luxury text-lg font-bold text-[#F3E5AB] uppercase tracking-wider">
                    PRO CLICK 30-DAY PERFORMANCE & EARNINGS GROWTH
                  </h3>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  Interactive Recharts visualization of neural token mining velocity and daily engagement levels over 30 days.
                </p>
              </div>

              {/* Timeframe & View Mode Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* View Mode Buttons */}
                <div className="flex bg-[#050505] border border-[#8E6D28]/40 p-0.5">
                  <button
                    onClick={() => setChartMetricMode('cumulative')}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
                      chartMetricMode === 'cumulative'
                        ? 'bg-[#8E6D28] text-black shadow-sm'
                        : 'text-gray-400 hover:text-slate-200'
                    }`}
                  >
                    Cumulative Vault
                  </button>
                  <button
                    onClick={() => setChartMetricMode('dailyClicks')}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
                      chartMetricMode === 'dailyClicks'
                        ? 'bg-[#8E6D28] text-black shadow-sm'
                        : 'text-gray-400 hover:text-slate-200'
                    }`}
                  >
                    Daily Clicks
                  </button>
                  <button
                    onClick={() => setChartMetricMode('dailyTokens')}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
                      chartMetricMode === 'dailyTokens'
                        ? 'bg-[#8E6D28] text-black shadow-sm'
                        : 'text-gray-400 hover:text-slate-200'
                    }`}
                  >
                    Daily Output
                  </button>
                </div>

                {/* Timeframe Buttons */}
                <div className="flex bg-[#050505] border border-[#8E6D28]/40 p-0.5">
                  <button
                    onClick={() => setChartTimeframe('7d')}
                    className={`px-2 py-1 text-[10px] font-mono font-bold ${
                      chartTimeframe === '7d' ? 'bg-[#C5A059] text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    7D
                  </button>
                  <button
                    onClick={() => setChartTimeframe('14d')}
                    className={`px-2 py-1 text-[10px] font-mono font-bold ${
                      chartTimeframe === '14d' ? 'bg-[#C5A059] text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    14D
                  </button>
                  <button
                    onClick={() => setChartTimeframe('30d')}
                    className={`px-2 py-1 text-[10px] font-mono font-bold ${
                      chartTimeframe === '30d' ? 'bg-[#C5A059] text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    30D
                  </button>
                </div>

                {/* PDF Report Export Button */}
                <button
                  onClick={handleDownloadPdfSummary}
                  className="px-3 py-1 bg-[#8E6D28]/20 border border-[#C5A059] hover:bg-[#8E6D28] text-[#F3E5AB] hover:text-black text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-all cursor-pointer"
                  title="Export full 30-Day Pro Click earnings chart & history as PDF report"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Export 30-Day PDF</span>
                </button>

              </div>
            </div>

            {/* Recharts Main Stage */}
            <div className="w-full h-72 sm:h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartMetricMode === 'cumulative' ? (
                  <AreaChart data={filteredChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C5A059" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1F1B14" strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#8E6D28" 
                      tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis 
                      stroke="#8E6D28" 
                      tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }}
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomProClickTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="cumulativeTokens" 
                      name="Cumulative Tokens" 
                      stroke="#F3E5AB" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#goldGradient)" 
                    />
                  </AreaChart>
                ) : chartMetricMode === 'dailyClicks' ? (
                  <BarChart data={filteredChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#1F1B14" strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#8E6D28" 
                      tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis 
                      stroke="#8E6D28" 
                      tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <Tooltip content={<CustomProClickTooltip />} />
                    <Bar 
                      dataKey="clicks" 
                      name="Daily Clicks" 
                      fill="#C5A059" 
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <BarChart data={filteredChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="amberBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FBBF24" stopOpacity={1} />
                        <stop offset="100%" stopColor="#8E6D28" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1F1B14" strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#8E6D28" 
                      tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis 
                      stroke="#8E6D28" 
                      tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }}
                      tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
                    />
                    <Tooltip content={<CustomProClickTooltip />} />
                    <Bar 
                      dataKey="totalDaily" 
                      name="Daily Output Tokens" 
                      fill="url(#amberBarGrad)" 
                      radius={[3, 3, 0, 0]} 
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Performance Insights Legend & Footer */}
            <div className="border-t border-[#8E6D28]/20 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-[#F3E5AB]">
                  <span className="w-2.5 h-2.5 bg-[#C5A059] inline-block rounded-full" />
                  <span>Cumulative Vault Tokens</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 bg-emerald-500 inline-block rounded-full" />
                  <span>USD Valuation Rate ($0.0002/token)</span>
                </span>
              </div>

              <div className="text-gray-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>30-Day Projected Output: <strong className="text-emerald-400">${(chartKPIs.latestCumulativeUSD + 15).toFixed(2)} USD</strong></span>
              </div>
            </div>

          </div>

          {/* Recent Activity Logs */}
          <div className="bg-[#080808] border border-[#8E6D28]/30 p-5 space-y-3">
            <div className="flex items-center space-x-2 border-b border-[#8E6D28]/20 pb-2">
              <History className="w-4 h-4 text-[#C5A059]" />
              <h3 className="serif-luxury text-sm font-bold text-slate-100 uppercase tracking-wider">
                Recent Earnings History
              </h3>
            </div>

            <div className="divide-y divide-[#8E6D28]/10">
              {activityLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200 flex items-center space-x-2">
                      <span>{log.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-[#8E6D28]/20 border border-[#8E6D28]/40 text-[#F3E5AB]">
                        {log.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">{log.timestamp}</div>
                  </div>

                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    +{log.tokens.toLocaleString()} Tokens
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WITHDRAWAL REQUEST VAULT */}
      {activeTab === 'withdraw' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Withdrawal Request Form */}
            <div className="bg-[#080808] border border-[#8E6D28]/40 p-6 space-y-5">
              <div className="flex items-center space-x-2 border-b border-[#8E6D28]/20 pb-3">
                <Wallet className="w-5 h-5 text-[#C5A059]" />
                <h3 className="serif-luxury text-base font-bold text-[#F3E5AB] uppercase tracking-wider">
                  Request Payout / Cashout
                </h3>
              </div>

              {withdrawSuccessMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{withdrawSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleRequestWithdrawal} className="space-y-4">
                
                {/* Payout Method Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider">
                    Select Payout Method:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('mobile-money')}
                      className={`p-3 border text-left space-y-1 transition-all ${
                        withdrawMethod === 'mobile-money'
                          ? 'bg-[#14110B] border-[#C5A059] text-[#F3E5AB]'
                          : 'bg-[#050505] border-gray-800 text-gray-400'
                      }`}
                    >
                      <div className="text-xs font-bold">Horn Mobile Money</div>
                      <div className="text-[10px] text-gray-400">E-Nakfa / Telebirr / M-Pesa</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('crypto-wallet')}
                      className={`p-3 border text-left space-y-1 transition-all ${
                        withdrawMethod === 'crypto-wallet'
                          ? 'bg-[#14110B] border-[#C5A059] text-[#F3E5AB]'
                          : 'bg-[#050505] border-gray-800 text-gray-400'
                      }`}
                    >
                      <div className="text-xs font-bold">Web3 Crypto Wallet</div>
                      <div className="text-[10px] text-gray-400">USDT (TRC20 / ERC20)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('bank-wire')}
                      className={`p-3 border text-left space-y-1 transition-all ${
                        withdrawMethod === 'bank-wire'
                          ? 'bg-[#14110B] border-[#C5A059] text-[#F3E5AB]'
                          : 'bg-[#050505] border-gray-800 text-gray-400'
                      }`}
                    >
                      <div className="text-xs font-bold">International Wire</div>
                      <div className="text-[10px] text-gray-400">SWIFT / Credit Card</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('axum-gold-pass')}
                      className={`p-3 border text-left space-y-1 transition-all ${
                        withdrawMethod === 'axum-gold-pass'
                          ? 'bg-[#14110B] border-[#C5A059] text-[#F3E5AB]'
                          : 'bg-[#050505] border-gray-800 text-gray-400'
                      }`}
                    >
                      <div className="text-xs font-bold">Axum Sovereign Pass</div>
                      <div className="text-[10px] text-gray-400">Convert to Membership</div>
                    </button>
                  </div>
                </div>

                {/* Amount Tokens Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider">
                      Withdrawal Token Amount:
                    </label>
                    <button
                      type="button"
                      onClick={() => setWithdrawTokens(currentAvailableTokens.toString())}
                      className="text-[10px] text-[#C5A059] hover:underline uppercase font-bold"
                    >
                      Withdraw Max ({currentAvailableTokens.toLocaleString()})
                    </button>
                  </div>

                  <input
                    type="number"
                    value={withdrawTokens}
                    onChange={(e) => setWithdrawTokens(e.target.value)}
                    min={5000}
                    step={1000}
                    className="w-full bg-[#050505] border border-[#8E6D28]/40 p-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-[#C5A059]"
                    placeholder="Min 5,000 Tokens"
                  />

                  <div className="text-[11px] text-emerald-400 font-mono flex items-center justify-between">
                    <span>Rate: 5,000 Tokens = $1.00 USD</span>
                    <span>Payout: ${((parseInt(withdrawTokens, 10) || 0) * 0.0002).toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Recipient Details Input */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider">
                    Recipient Phone Number / Wallet Address:
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    required
                    className="w-full bg-[#050505] border border-[#8E6D28]/40 p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-[#C5A059]"
                    placeholder={
                      withdrawMethod === 'mobile-money'
                        ? '+291 7 XXX XXX (E-Nakfa Mobile)'
                        : withdrawMethod === 'crypto-wallet'
                        ? '0x... or TR7NH...'
                        : 'IBAN / Account Number'
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingWithdraw}
                  className="w-full py-3 bg-[#8E6D28] text-black hover:bg-[#F3E5AB] text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all stela-glow"
                >
                  {isSubmittingWithdraw ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Withdrawal Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Withdrawal History Vault */}
            <div className="bg-[#080808] border border-[#8E6D28]/30 p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#8E6D28]/20 pb-3">
                <History className="w-5 h-5 text-[#C5A059]" />
                <h3 className="serif-luxury text-base font-bold text-[#F3E5AB] uppercase tracking-wider">
                  Withdrawal Status & History
                </h3>
              </div>

              <div className="space-y-3">
                {withdrawals.map((wdr) => (
                  <div key={wdr.id} className="p-4 bg-[#050505] border border-[#8E6D28]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#F3E5AB] font-bold">{wdr.id}</span>
                      <span className={`text-[9px] px-2 py-0.5 border uppercase font-mono ${
                        wdr.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      }`}>
                        {wdr.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{wdr.date}</span>
                      <span className="font-mono text-emerald-400 font-bold">${wdr.usdEquivalent.toFixed(2)} USD</span>
                    </div>

                    <div className="text-[10px] text-gray-500 font-mono border-t border-gray-900 pt-1.5 flex items-center justify-between">
                      <span>{wdr.recipientDetails}</span>
                      <span className="uppercase">{wdr.method}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
