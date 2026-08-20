import React, { useState } from 'react';
import { 
  Trophy, Crown, Medal, Award, Zap, Star, Users, Flame, TrendingUp, 
  Sparkles, Search, CheckCircle2, ThumbsUp, Globe, Filter, ExternalLink, 
  ChevronRight, ArrowUpRight, ShieldCheck, RefreshCw, Gift 
} from 'lucide-react';
import { CommunityLeaderboardEntry, UserSubscription } from '../types';

interface GlobalCommunityLeaderboardProps {
  subscription: UserSubscription;
  onRewardClaimed?: (rewardAmount: number, taskTitle: string) => void;
  onSaveInsight?: (item: any) => void;
}

const INITIAL_LEADERBOARD: CommunityLeaderboardEntry[] = [
  {
    id: 'lead-1',
    rank: 1,
    name: 'Amanuel Berhane',
    handle: '@amanuel_asmara',
    location: 'Asmara, ER',
    countryCode: 'ER',
    proClickStatus: 'Pro Click Gold Sovereign',
    badgeStyle: 'gold-sovereign',
    totalTokensEarned: 185400,
    tasksCompleted: 142,
    referralsCount: 38,
    streakDays: 24,
    upvotes: 342,
    joinedDate: 'Jan 2026',
  },
  {
    id: 'lead-2',
    rank: 2,
    name: 'Saba Yohannes',
    handle: '@saba_london',
    location: 'London, UK',
    countryCode: 'GB',
    proClickStatus: 'Pro Click Diamond Champion',
    badgeStyle: 'diamond-champion',
    totalTokensEarned: 142800,
    tasksCompleted: 115,
    referralsCount: 29,
    streakDays: 18,
    upvotes: 289,
    joinedDate: 'Feb 2026',
  },
  {
    id: 'lead-3',
    rank: 3,
    name: 'Filmon Tesfay',
    handle: '@filmon_frankfurt',
    location: 'Frankfurt, DE',
    countryCode: 'DE',
    proClickStatus: 'Pro Click Gold Sovereign',
    badgeStyle: 'gold-sovereign',
    totalTokensEarned: 118200,
    tasksCompleted: 98,
    referralsCount: 24,
    streakDays: 15,
    upvotes: 215,
    joinedDate: 'Jan 2026',
  },
  {
    id: 'lead-4',
    rank: 4,
    name: 'Helen Kibreab',
    handle: '@helen_dmv',
    location: 'Washington D.C., US',
    countryCode: 'US',
    proClickStatus: 'Pro Click Master',
    badgeStyle: 'gold-master',
    totalTokensEarned: 94500,
    tasksCompleted: 82,
    referralsCount: 19,
    streakDays: 12,
    upvotes: 178,
    joinedDate: 'Mar 2026',
  },
  {
    id: 'lead-5',
    rank: 5,
    name: 'Yemane Ghebre',
    handle: '@yemane_addis',
    location: 'Addis Ababa, ET',
    countryCode: 'ET',
    proClickStatus: 'Pro Click Master',
    badgeStyle: 'gold-master',
    totalTokensEarned: 76000,
    tasksCompleted: 68,
    referralsCount: 15,
    streakDays: 9,
    upvotes: 142,
    joinedDate: 'Apr 2026',
  },
  {
    id: 'lead-6',
    rank: 6,
    name: 'Meron Tekle',
    handle: '@meron_stockholm',
    location: 'Stockholm, SE',
    countryCode: 'SE',
    proClickStatus: 'Pro Click Elite',
    badgeStyle: 'gold-elite',
    totalTokensEarned: 58200,
    tasksCompleted: 54,
    referralsCount: 12,
    streakDays: 7,
    upvotes: 119,
    joinedDate: 'May 2026',
  },
  {
    id: 'lead-curr',
    rank: 7,
    name: 'Axumite Sovereign (You)',
    handle: '@axumite_pro_user',
    location: 'Asmara, ER',
    countryCode: 'ER',
    proClickStatus: 'Pro Click Gold Sovereign',
    badgeStyle: 'gold-sovereign',
    totalTokensEarned: 42500,
    tasksCompleted: 38,
    referralsCount: 9,
    streakDays: 5,
    upvotes: 96,
    joinedDate: 'Jun 2026',
    isCurrentUser: true,
  },
  {
    id: 'lead-8',
    rank: 8,
    name: 'Daniel Haile',
    handle: '@daniel_melbourne',
    location: 'Melbourne, AU',
    countryCode: 'AU',
    proClickStatus: 'Pro Click Elite',
    badgeStyle: 'gold-elite',
    totalTokensEarned: 35400,
    tasksCompleted: 31,
    referralsCount: 8,
    streakDays: 6,
    upvotes: 84,
    joinedDate: 'Jun 2026',
  },
  {
    id: 'lead-9',
    rank: 9,
    name: 'Ruth Abraha',
    handle: '@ruth_roma',
    location: 'Rome, IT',
    countryCode: 'IT',
    proClickStatus: 'Pro Click Pioneer',
    badgeStyle: 'gold-pioneer',
    totalTokensEarned: 28900,
    tasksCompleted: 26,
    referralsCount: 5,
    streakDays: 4,
    upvotes: 62,
    joinedDate: 'Jul 2026',
  },
  {
    id: 'lead-10',
    rank: 10,
    name: 'Tewelde Gebrehiwet',
    handle: '@tewelde_kassala',
    location: 'Kassala, SD',
    countryCode: 'SD',
    proClickStatus: 'Pro Click Pioneer',
    badgeStyle: 'gold-pioneer',
    totalTokensEarned: 22100,
    tasksCompleted: 19,
    referralsCount: 4,
    streakDays: 3,
    upvotes: 45,
    joinedDate: 'Jul 2026',
  },
];

export const GlobalCommunityLeaderboard: React.FC<GlobalCommunityLeaderboardProps> = ({
  subscription,
  onRewardClaimed,
  onSaveInsight,
}) => {
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboard, setLeaderboard] = useState<CommunityLeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [cheeredIds, setCheeredIds] = useState<string[]>([]);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostMessage, setBoostMessage] = useState<string | null>(null);

  // Sync user's tokens into the currentUser entry
  const userTotalEarnings = (subscription.totalClickEarnings || 8500) + 34000;

  // Sound Chime Feedback
  const triggerAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.25); // E6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      // Audio fallback
    }
  };

  const handleCheerContributor = (entry: CommunityLeaderboardEntry) => {
    if (cheeredIds.includes(entry.id)) return;
    setCheeredIds((prev) => [...prev, entry.id]);
    triggerAudioChime();

    setLeaderboard((prev) =>
      prev.map((item) =>
        item.id === entry.id ? { ...item, upvotes: item.upvotes + 1 } : item
      )
    );
  };

  const handleBoostStanding = () => {
    setIsBoosting(true);
    setTimeout(() => {
      setIsBoosting(false);
      triggerAudioChime();
      const rewardAmt = 2000;

      if (onRewardClaimed) {
        onRewardClaimed(rewardAmt, 'Leaderboard Community Boost Bonus');
      }

      setLeaderboard((prev) =>
        prev.map((item) =>
          item.isCurrentUser
            ? {
                ...item,
                totalTokensEarned: item.totalTokensEarned + rewardAmt,
                tasksCompleted: item.tasksCompleted + 1,
                upvotes: item.upvotes + 5,
              }
            : item
        )
      );

      setBoostMessage('⭐ Community Boost Granted! +2,000 Neural Tokens added to your Sovereign Balance.');

      if (onSaveInsight) {
        onSaveInsight({
          title: '[Leaderboard Community Boost] +2,000 Tokens',
          type: 'payment',
          content: 'Claimed Daily Community Leaderboard Standing Boost. New Total Earnings updated in Gold Tier Record.',
          tags: ['leaderboard', 'community-boost', 'gold-tier'],
        });
      }

      setTimeout(() => setBoostMessage(null), 5000);
    }, 800);
  };

  // Filtered leaderboard
  const filteredLeaderboard = leaderboard.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.proClickStatus.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const topThree = filteredLeaderboard.slice(0, 3);
  const currentUserEntry = leaderboard.find((item) => item.isCurrentUser);

  // Helper for rendering gold-tier badge styling
  const renderProClickBadge = (status: string, badgeStyle: string) => {
    switch (badgeStyle) {
      case 'gold-sovereign':
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-[#8E6D28] via-[#F3E5AB] to-[#C5A059] text-black font-extrabold text-[10px] tracking-widest uppercase rounded-sm shadow-[0_0_12px_rgba(197,160,89,0.5)] border border-[#FFF8DC] flex items-center space-x-1.5 inline-flex">
            <Crown className="w-3 h-3 text-black animate-pulse" />
            <span>{status}</span>
          </span>
        );

      case 'diamond-champion':
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-amber-200 via-amber-400 to-[#C5A059] text-black font-extrabold text-[10px] tracking-widest uppercase rounded-sm shadow-[0_0_12px_rgba(251,191,36,0.4)] border border-amber-100 flex items-center space-x-1.5 inline-flex">
            <Sparkles className="w-3 h-3 text-black" />
            <span>{status}</span>
          </span>
        );

      case 'gold-master':
        return (
          <span className="px-2.5 py-0.5 bg-[#1B160B] border border-[#C5A059] text-[#F3E5AB] font-bold text-[10px] tracking-wider uppercase rounded-sm shadow-[0_0_8px_rgba(197,160,89,0.3)] flex items-center space-x-1 inline-flex">
            <Trophy className="w-3 h-3 text-[#C5A059]" />
            <span>{status}</span>
          </span>
        );

      case 'gold-elite':
        return (
          <span className="px-2.5 py-0.5 bg-[#14110B] border border-[#8E6D28] text-[#E1C47D] font-semibold text-[10px] tracking-wider uppercase rounded-sm flex items-center space-x-1 inline-flex">
            <Medal className="w-3 h-3 text-[#C5A059]" />
            <span>{status}</span>
          </span>
        );

      default:
        return (
          <span className="px-2.5 py-0.5 bg-[#0D0B07] border border-[#8E6D28]/60 text-amber-200 text-[10px] tracking-wider uppercase rounded-sm flex items-center space-x-1 inline-flex">
            <Award className="w-3 h-3 text-[#C5A059]" />
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Leaderboard Header Banner */}
      <div className="bg-[#080808] border border-[#8E6D28]/50 p-6 sm:p-8 relative overflow-hidden shadow-2xl stela-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#8E6D28]/30 border border-[#C5A059] text-[#F3E5AB] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center space-x-1">
                <Globe className="w-3 h-3 text-[#C5A059]" />
                <span>GLOBAL COMMUNITY LEADERBOARD • ዓለምለኻዊ መራሒ ወንበር</span>
              </span>
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/40 text-amber-300 text-[10px] font-mono">
                Live Gold-Tier Rankings
              </span>
            </div>

            <h1 className="serif-luxury text-2xl sm:text-3xl font-bold tracking-[0.15em] text-slate-100 uppercase gold-gradient">
              PRO CLICK TOP CONTRIBUTORS & GOLD STANDING
            </h1>

            <p className="text-xs text-gray-300 leading-relaxed">
              Recognizing the top neural contributors, affiliate champions, and sovereign prompt architects across the AXUMITE AI network worldwide.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-[#0E0C08] border border-[#8E6D28] p-5 space-y-2 text-right min-w-[220px]">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
              Total Community Tokens Mined
            </div>
            <div className="serif-luxury text-2xl font-bold text-[#F3E5AB] gold-gradient">
              808,000+ <span className="text-xs text-[#C5A059]">Tokens</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-end space-x-1">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>1,240 Active Gold Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Standing Bar */}
      {currentUserEntry && (
        <div className="bg-gradient-to-r from-[#14110B] via-[#1B160B] to-[#0A0805] border-2 border-[#C5A059] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(197,160,89,0.25)]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#8E6D28]/30 border-2 border-[#C5A059] rounded-full flex items-center justify-center font-bold text-[#F3E5AB] text-lg shadow-[0_0_10px_rgba(197,160,89,0.4)]">
              #{currentUserEntry.rank}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Your Current Community Rank
                </span>
                {renderProClickBadge(currentUserEntry.proClickStatus, currentUserEntry.badgeStyle)}
              </div>
              <p className="text-[11px] text-gray-300 font-mono">
                Total Lifetime Earnings: <strong className="text-emerald-400">+{currentUserEntry.totalTokensEarned.toLocaleString()} Tokens</strong> • {currentUserEntry.tasksCompleted} Tasks Done • {currentUserEntry.upvotes} Cheers Received
              </p>
            </div>
          </div>

          <button
            onClick={handleBoostStanding}
            disabled={isBoosting}
            className="px-4 py-2.5 bg-gradient-to-r from-[#8E6D28] via-[#F3E5AB] to-[#C5A059] text-black font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-[0_0_12px_rgba(197,160,89,0.4)] hover:scale-105 transition-all flex-shrink-0"
          >
            {isBoosting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Flame className="w-4 h-4 fill-black" />
            )}
            <span>{isBoosting ? 'Boosting Ranking...' : 'Claim Community Boost (+2,000)'}</span>
          </button>
        </div>
      )}

      {boostMessage && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center space-x-2 animate-fade-in font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{boostMessage}</span>
        </div>
      )}

      {/* TOP 3 PODIUM SECTION */}
      {topThree.length >= 3 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#8E6D28]/30 pb-2">
            <Trophy className="w-5 h-5 text-[#C5A059]" />
            <h2 className="serif-luxury text-base font-bold text-[#F3E5AB] uppercase tracking-wider">
              Hall of Sovereignty • Top 3 Gold Contributors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* 2ND PLACE */}
            <div className="bg-[#080808] border border-[#8E6D28]/40 p-5 flex flex-col justify-between space-y-4 relative group hover:border-[#C5A059] transition-all">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-800 border border-slate-600 text-slate-300 text-[10px] font-bold font-mono">
                RANK #2
              </div>
              <div className="space-y-3 text-center">
                <div className="w-16 h-16 mx-auto bg-[#14110B] border-2 border-amber-300 rounded-full flex items-center justify-center relative shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  <Medal className="w-8 h-8 text-amber-300" />
                </div>
                <div>
                  <h3 className="serif-luxury text-lg font-bold text-slate-100">{topThree[1].name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{topThree[1].handle} • {topThree[1].location}</p>
                </div>
                <div className="pt-1">
                  {renderProClickBadge(topThree[1].proClickStatus, topThree[1].badgeStyle)}
                </div>
              </div>

              <div className="border-t border-[#8E6D28]/20 pt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Total Tokens</span>
                <span className="text-emerald-400 font-bold">+{topThree[1].totalTokensEarned.toLocaleString()}</span>
              </div>
            </div>

            {/* 1ST PLACE GOLD CHAMPION */}
            <div className="bg-gradient-to-b from-[#18130B] via-[#0D0B07] to-[#080808] border-2 border-[#C5A059] p-6 flex flex-col justify-between space-y-4 relative shadow-[0_0_30px_rgba(197,160,89,0.4)] transform md:-translate-y-2">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-[#8E6D28] via-[#F3E5AB] to-[#C5A059] text-black text-[10px] font-extrabold uppercase tracking-widest shadow-md flex items-center space-x-1">
                <Crown className="w-3.5 h-3.5 text-black" />
                <span>GOLD SOVEREIGN CHAMPION</span>
              </div>

              <div className="space-y-3 text-center pt-2">
                <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-[#8E6D28] via-[#F3E5AB] to-[#C5A059] p-0.5 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.6)]">
                  <div className="w-full h-full bg-[#080808] rounded-full flex items-center justify-center">
                    <Crown className="w-10 h-10 text-[#F3E5AB] animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="serif-luxury text-xl font-bold text-[#F3E5AB] gold-gradient">{topThree[0].name}</h3>
                  <p className="text-xs text-amber-200/80 font-mono">{topThree[0].handle} • {topThree[0].location}</p>
                </div>
                <div className="pt-1">
                  {renderProClickBadge(topThree[0].proClickStatus, topThree[0].badgeStyle)}
                </div>
              </div>

              <div className="border-t border-[#8E6D28]/40 pt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300">Total Tokens Mined</span>
                <span className="text-emerald-400 font-bold text-sm">+{topThree[0].totalTokensEarned.toLocaleString()}</span>
              </div>
            </div>

            {/* 3RD PLACE */}
            <div className="bg-[#080808] border border-[#8E6D28]/40 p-5 flex flex-col justify-between space-y-4 relative group hover:border-[#C5A059] transition-all">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-950 border border-amber-700 text-amber-300 text-[10px] font-bold font-mono">
                RANK #3
              </div>
              <div className="space-y-3 text-center">
                <div className="w-16 h-16 mx-auto bg-[#14110B] border-2 border-amber-600 rounded-full flex items-center justify-center relative shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                  <Award className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="serif-luxury text-lg font-bold text-slate-100">{topThree[2].name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{topThree[2].handle} • {topThree[2].location}</p>
                </div>
                <div className="pt-1">
                  {renderProClickBadge(topThree[2].proClickStatus, topThree[2].badgeStyle)}
                </div>
              </div>

              <div className="border-t border-[#8E6D28]/20 pt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Total Tokens</span>
                <span className="text-emerald-400 font-bold">+{topThree[2].totalTokensEarned.toLocaleString()}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#080808] border border-[#8E6D28]/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Timeframe Buttons */}
        <div className="flex items-center space-x-1 w-full sm:w-auto">
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              timeframe === 'all'
                ? 'bg-[#8E6D28] text-black'
                : 'bg-[#14110B] text-gray-400 border border-[#8E6D28]/30 hover:text-slate-200'
            }`}
          >
            All-Time Leaderboard
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              timeframe === 'monthly'
                ? 'bg-[#8E6D28] text-black'
                : 'bg-[#14110B] text-gray-400 border border-[#8E6D28]/30 hover:text-slate-200'
            }`}
          >
            Monthly Sprint
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              timeframe === 'weekly'
                ? 'bg-[#8E6D28] text-black'
                : 'bg-[#14110B] text-gray-400 border border-[#8E6D28]/30 hover:text-slate-200'
            }`}
          >
            Weekly Fast Track
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contributor, handle, or country..."
            className="w-full bg-[#050505] border border-[#8E6D28]/40 pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* FULL LEADERBOARD TABLE / CARDS */}
      <div className="bg-[#080808] border border-[#8E6D28]/30 overflow-hidden">
        <div className="p-4 border-b border-[#8E6D28]/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#C5A059]" />
            <h3 className="serif-luxury text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
              Global Community Rankings ({filteredLeaderboard.length} Contributors)
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">Updated Real-Time</span>
        </div>

        <div className="divide-y divide-[#8E6D28]/15">
          {filteredLeaderboard.map((item) => {
            const hasCheered = cheeredIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  item.isCurrentUser
                    ? 'bg-[#14110B] border-l-4 border-l-[#C5A059]'
                    : 'hover:bg-[#0E0D09]'
                }`}
              >
                {/* Left: Rank & Contributor Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[#050505] border border-[#8E6D28]/40 font-mono font-bold text-xs text-[#F3E5AB]">
                    #{item.rank}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`font-semibold text-sm ${item.isCurrentUser ? 'text-[#F3E5AB] font-bold' : 'text-slate-100'}`}>
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{item.handle}</span>
                      <span className="text-[10px] text-gray-400 px-2 py-0.5 bg-[#050505] border border-gray-800 font-mono">
                        📍 {item.location}
                      </span>
                    </div>

                    <div className="pt-0.5">
                      {renderProClickBadge(item.proClickStatus, item.badgeStyle)}
                    </div>
                  </div>
                </div>

                {/* Right: Earnings & Interactive Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-gray-900">
                  <div className="text-left md:text-right font-mono">
                    <div className="text-emerald-400 font-bold text-sm">
                      +{item.totalTokensEarned.toLocaleString()} Tokens
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {item.tasksCompleted} Tasks • {item.referralsCount} Referrals • {item.streakDays}d Streak
                    </div>
                  </div>

                  {/* Cheer / Upvote Button */}
                  <button
                    onClick={() => handleCheerContributor(item)}
                    disabled={hasCheered}
                    className={`px-3 py-1.5 text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                      hasCheered
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 cursor-default'
                        : 'bg-[#050505] border-[#8E6D28]/40 text-gray-300 hover:border-[#C5A059] hover:text-[#F3E5AB]'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasCheered ? 'text-amber-400 fill-amber-400' : 'text-[#C5A059]'}`} />
                    <span>{item.upvotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRO CLICK GOLD TIER THRESHOLDS GUIDE */}
      <div className="bg-[#080808] border border-[#8E6D28]/30 p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#8E6D28]/20 pb-3">
          <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
          <h3 className="serif-luxury text-base font-bold text-[#F3E5AB] uppercase tracking-wider">
            Pro Click Gold-Tier Recognition Criteria
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#050505] border border-[#8E6D28]/20 space-y-2">
            <div className="text-xs font-bold text-[#F3E5AB] flex items-center space-x-1">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>Pro Click Pioneer</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Complete initial daily clicks & earn 5,000+ Neural Tokens.
            </p>
          </div>

          <div className="p-4 bg-[#050505] border border-[#8E6D28]/20 space-y-2">
            <div className="text-xs font-bold text-[#E1C47D] flex items-center space-x-1">
              <Medal className="w-4 h-4 text-[#C5A059]" />
              <span>Pro Click Elite</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Earn 25,000+ Tokens & recruit 5 active referrals.
            </p>
          </div>

          <div className="p-4 bg-[#050505] border border-[#8E6D28]/20 space-y-2">
            <div className="text-xs font-bold text-[#F3E5AB] flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-[#C5A059]" />
              <span>Pro Click Master</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Earn 50,000+ Tokens & sustain a 7-day daily streak.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-[#1B160B] to-[#080808] border border-[#C5A059] space-y-2 shadow-[0_0_15px_rgba(197,160,89,0.3)]">
            <div className="text-xs font-extrabold text-[#F3E5AB] flex items-center space-x-1 uppercase tracking-wider">
              <Crown className="w-4 h-4 text-[#F3E5AB] animate-pulse" />
              <span className="gold-gradient">Gold Sovereign</span>
            </div>
            <p className="text-[11px] text-gray-300">
              Earn 100,000+ Tokens. Unlock VIP withdrawal priority & custom gold badge.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
