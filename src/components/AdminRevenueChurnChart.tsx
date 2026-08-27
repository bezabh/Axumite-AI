import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  BarChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  Activity,
  Bell,
  RefreshCw,
  Download,
  Info,
  Calendar,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { triggerChurnAlert } from '../services/notificationService';

export interface RevenueChurnDataPoint {
  month: string;
  monthTi: string;
  mrr: number;
  mrrErn: number;
  newMrr: number;
  expansionMrr: number;
  churnedMrr: number;
  churnRate: number;
  netRetention: number;
  activeSubscribers: number;
  churnedSubscribers: number;
  avgRevenuePerUser: number;
}

const SIX_MONTH_TREND_DATA: RevenueChurnDataPoint[] = [
  {
    month: 'Mar 2026',
    monthTi: 'መጋቢት 2026',
    mrr: 14200,
    mrrErn: 213000,
    newMrr: 3200,
    expansionMrr: 800,
    churnedMrr: 600,
    churnRate: 4.2,
    netRetention: 108.5,
    activeSubscribers: 380,
    churnedSubscribers: 16,
    avgRevenuePerUser: 37.36,
  },
  {
    month: 'Apr 2026',
    monthTi: 'ሚያዝያ 2026',
    mrr: 16800,
    mrrErn: 252000,
    newMrr: 3800,
    expansionMrr: 1100,
    churnedMrr: 700,
    churnRate: 3.8,
    netRetention: 111.2,
    activeSubscribers: 460,
    churnedSubscribers: 18,
    avgRevenuePerUser: 36.52,
  },
  {
    month: 'May 2026',
    monthTi: 'ግንቦት 2026',
    mrr: 19500,
    mrrErn: 292500,
    newMrr: 4100,
    expansionMrr: 1250,
    churnedMrr: 650,
    churnRate: 3.3,
    netRetention: 113.8,
    activeSubscribers: 540,
    churnedSubscribers: 18,
    avgRevenuePerUser: 36.11,
  },
  {
    month: 'Jun 2026',
    monthTi: 'ሰነ 2026',
    mrr: 22400,
    mrrErn: 336000,
    newMrr: 4400,
    expansionMrr: 1500,
    churnedMrr: 600,
    churnRate: 2.7,
    netRetention: 116.4,
    activeSubscribers: 630,
    churnedSubscribers: 17,
    avgRevenuePerUser: 35.55,
  },
  {
    month: 'Jul 2026',
    monthTi: 'ሓምለ 2026',
    mrr: 25100,
    mrrErn: 376500,
    newMrr: 4200,
    expansionMrr: 1600,
    churnedMrr: 550,
    churnRate: 2.2,
    netRetention: 118.6,
    activeSubscribers: 720,
    churnedSubscribers: 16,
    avgRevenuePerUser: 34.86,
  },
  {
    month: 'Aug 2026',
    monthTi: 'ነሓሰ 2026',
    mrr: 28750,
    mrrErn: 431250,
    newMrr: 5100,
    expansionMrr: 1900,
    churnedMrr: 500,
    churnRate: 1.8,
    netRetention: 122.1,
    activeSubscribers: 840,
    churnedSubscribers: 15,
    avgRevenuePerUser: 34.22,
  },
];

interface AdminRevenueChurnChartProps {
  customThreshold?: number;
  onNavigateTab?: (tab: string) => void;
}

export const AdminRevenueChurnChart: React.FC<AdminRevenueChurnChartProps> = ({
  customThreshold = 3.0,
  onNavigateTab,
}) => {
  const { language } = useLanguage();
  const [chartMode, setChartMode] = useState<'composed' | 'breakdown' | 'subscribers'>('composed');
  const [currency, setCurrency] = useState<'USD' | 'ERN'>('USD');
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);

  // Latest stats (August 2026)
  const currentMonth = SIX_MONTH_TREND_DATA[SIX_MONTH_TREND_DATA.length - 1];
  const previousMonth = SIX_MONTH_TREND_DATA[SIX_MONTH_TREND_DATA.length - 2];
  const firstMonth = SIX_MONTH_TREND_DATA[0];

  const mrrGrowthMoM = Number((((currentMonth.mrr - previousMonth.mrr) / previousMonth.mrr) * 100).toFixed(1));
  const mrrTotalGrowth6Mo = Number((((currentMonth.mrr - firstMonth.mrr) / firstMonth.mrr) * 100).toFixed(1));
  const churnImprovement = Number((firstMonth.churnRate - currentMonth.churnRate).toFixed(1));

  // Trigger test alert notification
  const handleTriggerChurnTestAlert = () => {
    // Simulate threshold breach notification
    const testRate = 3.8;
    triggerChurnAlert({
      churnRate: testRate,
      threshold: customThreshold,
      period: 'August 2026 (Rolling 30 Days)',
      lostMRR: 750,
      affectedSubscribers: 22,
    });

    setAlertFeedback(
      language === 'ti' 
        ? 'ናይ ፑሽ ምልክታ (Churn Alert) ብትክክል ተላኢኹ ኣሎ!' 
        : 'Automated Push Notification sent to active admin devices!'
    );
    setTimeout(() => setAlertFeedback(null), 3500);
  };

  // Custom Tooltip Component
  const CustomRevenueChurnTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data: RevenueChurnDataPoint = payload[0].payload;

    return (
      <div className="bg-[#0F0B1A] border-2 border-[#8E6D28] rounded-2xl p-4 shadow-2xl text-slate-100 text-xs space-y-2.5 min-w-[240px]">
        <div className="flex items-center justify-between border-b border-[#281D3C] pb-2">
          <span className="font-extrabold text-[#F3E5AB] text-sm">
            {language === 'ti' ? data.monthTi : data.month}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
            {data.activeSubscribers} Active Subs
          </span>
        </div>

        <div className="space-y-1.5 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E1C47D]" />
              <span>MRR Total:</span>
            </span>
            <span className="font-mono font-bold text-[#F3E5AB]">
              {currency === 'USD' ? `$${data.mrr.toLocaleString()}` : `${data.mrrErn.toLocaleString()} ERN`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>New MRR:</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">+${data.newMrr.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Expansion MRR:</span>
            </span>
            <span className="font-mono text-sky-400 font-bold">+${data.expansionMrr.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Churned MRR:</span>
            </span>
            <span className="font-mono text-rose-400 font-bold">-${data.churnedMrr.toLocaleString()}</span>
          </div>

          <div className="pt-2 border-t border-[#251A3B] flex items-center justify-between">
            <span className="text-gray-300 font-bold flex items-center space-x-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              <span>Churn Rate:</span>
            </span>
            <span className={`font-mono font-extrabold px-2 py-0.5 rounded text-xs ${
              data.churnRate > customThreshold
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {data.churnRate}%
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>Net Revenue Retention:</span>
            <span className="font-mono font-bold text-amber-300">{data.netRetention}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#110D1D] via-[#0E0A1A] to-[#08060F] border-2 border-[#8E6D28]/60 rounded-[28px] p-5 sm:p-7 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(197,160,89,0.15)] text-slate-100 relative overflow-hidden">
      
      {/* Decorative Gold Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      
      {/* ========================================================================= */}
      {/* HEADER & CONTROLS                                                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2B1F42] pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 shadow-md">
              <TrendingUp className="w-5 h-5 text-[#E1C47D]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-black font-cinzel text-white tracking-wide">
                  {language === 'ti' 
                    ? 'ናይ ወርሓዊ እቶት (MRR) ከምኡ ውን ናይ ምቁራጽ (Churn Rate) ናይ 6 ኣዋርሕ ትንተና' 
                    : '6-Month MRR & Subscription Churn Rate Trends'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 hidden sm:inline-block">
                  Mar 2026 – Aug 2026
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                {language === 'ti'
                  ? 'ናይ ወርሓዊ ቀጻሊ እቶት፡ ናይ ኣባላት ምቁራጽ ደረትን ናይ ዓማዊል ዕቃበን ዝርዝር መዐቀኒታት'
                  : 'Dual-axis financial trajectory, monthly recurring revenue velocity, and churn threshold monitoring'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Mode Toggles */}
          <div className="flex items-center bg-[#181226] border border-[#3A2A54] rounded-xl p-1 text-xs">
            <button
              onClick={() => setChartMode('composed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                chartMode === 'composed'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Dual-Axis (MRR + Churn)
            </button>
            <button
              onClick={() => setChartMode('breakdown')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                chartMode === 'breakdown'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              MRR Dynamics
            </button>
            <button
              onClick={() => setChartMode('subscribers')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                chartMode === 'subscribers'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Subscriber Flow
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center bg-[#181226] border border-[#3A2A54] rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'USD' ? 'bg-[#2A1D44] text-[#F3E5AB] border border-[#8E6D28]' : 'text-gray-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('ERN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'ERN' ? 'bg-[#2A1D44] text-[#F3E5AB] border border-[#8E6D28]' : 'text-gray-400 hover:text-white'
              }`}
            >
              ERN (Nakfa)
            </button>
          </div>

          {/* Test Churn Push Notification */}
          <button
            onClick={handleTriggerChurnTestAlert}
            className="px-3.5 py-2 rounded-xl bg-[#241738] hover:bg-[#342252] border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md active:scale-95"
            title="Test push notification for churn rate threshold breach"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ti' ? 'ናይ ፑሽ ፈተነ ስደድ' : 'Test Churn Push Alert'}</span>
          </button>
        </div>
      </div>

      {alertFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 flex items-center space-x-2 animate-fade-in shadow-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">{alertFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6 TOP-LEVEL FINANCIAL & CHURN KPIS                                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* KPI 1: Current MRR */}
        <div className="bg-[#140F24] border border-[#2F2147] hover:border-[#8E6D28]/60 rounded-2xl p-3.5 space-y-1 transition-all shadow-md">
          <div className="text-[10.5px] uppercase font-bold text-gray-400 flex items-center justify-between">
            <span>August MRR</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-[#F3E5AB]">
            {currency === 'USD' ? `$${currentMonth.mrr.toLocaleString()}` : `${currentMonth.mrrErn.toLocaleString()} ERN`}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center space-x-0.5 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{mrrGrowthMoM}% MoM</span>
          </div>
        </div>

        {/* KPI 2: Churn Rate */}
        <div className="bg-[#140F24] border border-[#2F2147] hover:border-rose-500/40 rounded-2xl p-3.5 space-y-1 transition-all shadow-md">
          <div className="text-[10.5px] uppercase font-bold text-gray-400 flex items-center justify-between">
            <span>Active Churn</span>
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-white">
            {currentMonth.churnRate}%
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center space-x-0.5 font-bold">
            <ArrowDownRight className="w-3 h-3" />
            <span>-{churnImprovement}% vs Mar (Ceiling: {customThreshold}%)</span>
          </div>
        </div>

        {/* KPI 3: Net Revenue Retention (NRR) */}
        <div className="bg-[#140F24] border border-[#2F2147] hover:border-[#8E6D28]/60 rounded-2xl p-3.5 space-y-1 transition-all shadow-md">
          <div className="text-[10.5px] uppercase font-bold text-gray-400 flex items-center justify-between">
            <span>Net Retention</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-amber-300">
            {currentMonth.netRetention}%
          </div>
          <div className="text-[10px] text-emerald-400 font-bold">
            Expansion &gt; Churn
          </div>
        </div>

        {/* KPI 4: Active Subscribers */}
        <div className="bg-[#140F24] border border-[#2F2147] hover:border-[#8E6D28]/60 rounded-2xl p-3.5 space-y-1 transition-all shadow-md">
          <div className="text-[10.5px] uppercase font-bold text-gray-400 flex items-center justify-between">
            <span>Paying Subs</span>
            <Users className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-white">
            {currentMonth.activeSubscribers}
          </div>
          <div className="text-[10px] text-sky-400 font-bold">
            +120 accounts in Aug
          </div>
        </div>

        {/* KPI 5: 6-Month MRR Growth */}
        <div className="bg-[#140F24] border border-[#2F2147] hover:border-[#8E6D28]/60 rounded-2xl p-3.5 space-y-1 transition-all shadow-md">
          <div className="text-[10.5px] uppercase font-bold text-gray-400 flex items-center justify-between">
            <span>6-Mo Growth</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-400">
            +{mrrTotalGrowth6Mo}%
          </div>
          <div className="text-[10px] text-gray-400">
            From $14.2k to $28.75k
          </div>
        </div>

        {/* KPI 6: ARPU (Average Revenue per User) */}
        <div className="bg-[#140F24] border border-[#2F2147] hover:border-[#8E6D28]/60 rounded-2xl p-3.5 space-y-1 transition-all shadow-md">
          <div className="text-[10.5px] uppercase font-bold text-gray-400 flex items-center justify-between">
            <span>Avg ARPU</span>
            <Layers className="w-3.5 h-3.5 text-[#E1C47D]" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-[#F3E5AB]">
            ${currentMonth.avgRevenuePerUser}
          </div>
          <div className="text-[10px] text-gray-400">
            Per active subscriber
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MAIN RECHARTS DATA VISUALIZATION CANVAS                                   */}
      {/* ========================================================================= */}
      <div className="bg-[#0B0816] border border-[#251A3B] rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
        
        {/* Chart Legend & Context Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#1E152E] pb-3">
          <div className="flex items-center space-x-4 flex-wrap">
            {chartMode === 'composed' && (
              <>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded bg-[#E1C47D]" />
                  <span className="font-bold text-gray-300">Monthly Recurring Revenue (MRR $)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-1 bg-rose-500 rounded" />
                  <span className="font-bold text-rose-300">Churn Rate (%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-0.5 border-t-2 border-dashed border-amber-400" />
                  <span className="font-mono text-amber-300">Target Ceiling ({customThreshold}%)</span>
                </div>
              </>
            )}

            {chartMode === 'breakdown' && (
              <>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-400" />
                  <span className="font-bold text-emerald-300">New MRR</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded bg-sky-400" />
                  <span className="font-bold text-sky-300">Expansion MRR</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded bg-rose-500" />
                  <span className="font-bold text-rose-300">Churned MRR (Lost)</span>
                </div>
              </>
            )}

            {chartMode === 'subscribers' && (
              <>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded bg-amber-400" />
                  <span className="font-bold text-amber-300">Active Paying Subscribers</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded bg-rose-500" />
                  <span className="font-bold text-rose-300">Cancelled / Churned Accounts</span>
                </div>
              </>
            )}
          </div>

          <div className="text-[11px] text-gray-400 font-mono">
            {language === 'ti' ? 'ቀጻሊ ናይ 6 ኣዋርሕ መረዳእታ' : 'Rolling 6-Month Dataset'}
          </div>
        </div>

        {/* Dynamic Recharts Chart Container */}
        <div className="w-full h-80 sm:h-96 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'composed' ? (
              <ComposedChart data={SIX_MONTH_TREND_DATA} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="goldMrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E1C47D" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#8E6D28" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#251A3B" vertical={false} />
                <XAxis dataKey="month" stroke="#7A6F8B" fontSize={11} tickLine={false} />
                
                {/* Left Y-Axis: MRR in USD */}
                <YAxis
                  yAxisId="left"
                  stroke="#E1C47D"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => currency === 'USD' ? `$${(val / 1000).toFixed(0)}k` : `${(val / 1000).toFixed(0)}k ERN`}
                  domain={[10000, 32000]}
                />

                {/* Right Y-Axis: Churn Rate % */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#F43F5E"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                  domain={[0, 6]}
                />

                <Tooltip content={<CustomRevenueChurnTooltip />} />

                {/* Reference line for custom alert threshold */}
                <ReferenceLine
                  yAxisId="right"
                  y={customThreshold}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Ceiling (${customThreshold}%)`,
                    fill: '#FCD34D',
                    fontSize: 10,
                    position: 'top',
                  }}
                />

                {/* MRR Area Fill */}
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="mrr"
                  name="Monthly Recurring Revenue"
                  stroke="#F5D77F"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#goldMrrGradient)"
                />

                {/* Churn Rate Line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="churnRate"
                  name="Subscription Churn Rate"
                  stroke="#F43F5E"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#F43F5E', stroke: '#FFE4E6', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#E11D48', stroke: '#FFF', strokeWidth: 2 }}
                />
              </ComposedChart>
            ) : chartMode === 'breakdown' ? (
              <BarChart data={SIX_MONTH_TREND_DATA} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#251A3B" vertical={false} />
                <XAxis dataKey="month" stroke="#7A6F8B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#E1C47D"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomRevenueChurnTooltip />} />
                <Bar dataKey="newMrr" name="New MRR" fill="#34D399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expansionMrr" name="Expansion MRR" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churnedMrr" name="Churned MRR" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <ComposedChart data={SIX_MONTH_TREND_DATA} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#251A3B" vertical={false} />
                <XAxis dataKey="month" stroke="#7A6F8B" fontSize={11} tickLine={false} />
                <YAxis stroke="#E1C47D" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomRevenueChurnTooltip />} />
                <Area type="monotone" dataKey="activeSubscribers" name="Active Subscribers" stroke="#F5D77F" fill="#C5A059" fillOpacity={0.3} />
                <Bar dataKey="churnedSubscribers" name="Churned Accounts" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RETENTION HEALTH & PUSH ALERT NOTIFICATION SUMMARY BAR                     */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[#140F24] border border-[#2D2146] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl border ${
            currentMonth.churnRate <= customThreshold
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {currentMonth.churnRate <= customThreshold
                  ? (language === 'ti' ? '✓ ደረት ምቁራጽ ኣብ ትሕቲ ሓደጋ ዘይብሉ መጠን ኣሎ' : '✓ Retention Health: Optimal (Within Target)')
                  : (language === 'ti' ? '⚠️ መጠንቀቕታ፡ ምቁራጽ ካብቲ ዝተመደበ ደረት በሊጹ ኣሎ' : '⚠️ Alert: Churn Rate Exceeds Safety Target')}
              </span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                currentMonth.churnRate <= customThreshold ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {currentMonth.churnRate}% vs Ceiling {customThreshold}%
              </span>
            </div>
            <p className="text-[11.5px] text-gray-400 font-sans">
              {language === 'ti'
                ? `ዝተመደበ ናይ መጠንቀቕታ ደረት ${customThreshold}% ኮይኑ፡ ምቁራጽ ካብዚ ምስ ዝበልጽ ናብ ኩሎም ሓለፍቲ ኣውቶማቲክ ፑሽ ምልክታ ይለኣኽ።`
                : `Configured push notification ceiling is ${customThreshold}%. The notification service triggers real-time alerts whenever churn rate breaches this limit.`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('analytics')}
              className="px-3.5 py-2 rounded-xl bg-[#1C142E] hover:bg-[#281D42] border border-[#8E6D28] text-amber-300 font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <span>{language === 'ti' ? 'ቅጥዒ ደረት ኣዐሪ' : 'Configure Churn Alert Threshold'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
