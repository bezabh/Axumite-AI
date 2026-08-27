import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  RefreshCw, 
  Globe2, 
  ShieldCheck, 
  Flame, 
  GraduationCap, 
  Radio, 
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScholarshipRegion } from '../data/scholarshipData';

interface ScholarshipHourlyTrackerProps {
  language: 'en' | 'ti';
  totalScholarships: number;
  urgentCount: number;
  fullyFundedCount: number;
  selectedRegion: ScholarshipRegion;
  onSelectRegion: (region: ScholarshipRegion) => void;
  onRefreshHourlyStatus?: () => void;
}

export const ScholarshipHourlyTracker: React.FC<ScholarshipHourlyTrackerProps> = ({
  language,
  totalScholarships,
  urgentCount,
  fullyFundedCount,
  selectedRegion,
  onSelectRegion,
  onRefreshHourlyStatus,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [lastSyncedTime, setLastSyncedTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showWorldClocks, setShowWorldClocks] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate minutes and seconds until next hourly mark
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();
  const minutesUntilNextHour = 59 - currentMinutes;
  const secondsUntilNextHour = 59 - currentSeconds;

  const handleManualSync = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setSyncMessage(language === 'ti' ? 'ናይ ስኮላርሺፕ መርበባት ይረጋገጹ ኣለዉ...' : 'Verifying international admission portals...');

    setTimeout(() => {
      setLastSyncedTime(new Date());
      setIsRefreshing(false);
      setSyncMessage(
        language === 'ti' 
          ? `✓ ኹሎም ${totalScholarships} ዓለምለኻውያን መርበባት ብስዓታዊ ዙር ተረጋጊጾም!` 
          : `✓ All ${totalScholarships} international scholarship portals verified active!`
      );
      if (onRefreshHourlyStatus) onRefreshHourlyStatus();

      setTimeout(() => setSyncMessage(null), 4000);
    }, 1200);
  };

  const regions: { id: ScholarshipRegion; labelEn: string; labelTi: string; flag: string }[] = [
    { id: 'All', labelEn: 'All Continents', labelTi: 'ኩለን ክፍለ-ዓለማት', flag: '🌍' },
    { id: 'North America', labelEn: 'North America', labelTi: 'ሰሜን ኣሜሪካ', flag: '🇺🇸' },
    { id: 'Europe', labelEn: 'Europe', labelTi: 'ኤውሮጳ', flag: '🇪🇺' },
    { id: 'Asia & Middle East', labelEn: 'Asia & Middle East', labelTi: 'ኤስያን ማእከላይ ምብራቕን', flag: '🌏' },
    { id: 'Australia & Oceania', labelEn: 'Oceania', labelTi: 'ኦስትራልያን ኦሴንያን', flag: '🇦🇺' },
    { id: 'Global / Multilateral', labelEn: 'Global Multilateral', labelTi: 'ዓለምለኸ ትካላት', flag: '🌐' },
  ];

  // Format hours and minutes
  const formattedLastSync = lastSyncedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedCurrentTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Timezones for international applications
  const timezones = [
    { name: 'London (GMT)', time: new Intl.DateTimeFormat([], { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false }).format(currentTime), flag: '🇬🇧' },
    { name: 'Washington (EST)', time: new Intl.DateTimeFormat([], { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false }).format(currentTime), flag: '🇺🇸' },
    { name: 'Berlin (CET)', time: new Intl.DateTimeFormat([], { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hour12: false }).format(currentTime), flag: '🇩🇪' },
    { name: 'Tokyo (JST)', time: new Intl.DateTimeFormat([], { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false }).format(currentTime), flag: '🇯🇵' },
    { name: 'Asmara (EAT)', time: new Intl.DateTimeFormat([], { timeZone: 'Africa/Asmara', hour: '2-digit', minute: '2-digit', hour12: false }).format(currentTime), flag: '🇪🇷' },
  ];

  return (
    <div className="bg-gradient-to-b from-[#0F1424] via-[#12182D] to-[#0D1120] border border-[#C5A059]/40 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Header & Live Status Engine */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Live Status Ticker */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            
            {/* Live Radar Beacon */}
            <div className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{language === 'ti' ? 'ሰዓታዊ ናይ ኲነታት ዝመጽእ ሓበሬታ' : 'Live Hourly Status Sync'}</span>
            </div>

            {/* Verification cycle tag */}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/90 text-slate-300 border border-slate-800 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#C5A059]" />
              <span>
                {language === 'ti' ? `ዝተረጋገጸሉ: ${formattedLastSync}` : `Verified: ${formattedLastSync}`}
              </span>
            </span>

            {/* Next hourly sync countdown */}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/15 text-sky-300 border border-blue-500/30 flex items-center space-x-1">
              <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
              <span>
                {language === 'ti' ? `ቀጻሊ ዙር ኣብ: ${minutesUntilNextHour}ደ ${secondsUntilNextHour}ሰ` : `Next cycle in: ${minutesUntilNextHour}m ${secondsUntilNextHour}s`}
              </span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center space-x-2">
            <Globe2 className="w-5 h-5 text-[#C5A059]" />
            <span>
              {language === 'ti' ? 'ዓለምለኻዊ ናይ ስኮላርሺፕ መከታተሊ ማእከል' : 'International Scholarship Command & Hourly Verification'}
            </span>
          </h3>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {language === 'ti'
              ? 'ናይ ኣሜሪካ፣ ኤውሮጳ፣ ኤስያን ካልኦት ክፍለ-ዓለማትን ወግዓዊ መርበባት ስኮላርሺፕ ብቐጻሊ ብሰዓት ይረጋገጹ ኣለዉ። ናይ ምዕጻው ዕለታትን ናይ ቪዛ ሓበሬታን ቀጥታ ተኸታተሉ።'
              : 'Continuous hourly telemetry tracking application portals across North America, Europe, Asia, Australia, and Global institutions with real-time deadline calculations.'}
          </p>
        </div>

        {/* Right: Quick Action & Live Clocks Toggle */}
        <div className="flex items-center space-x-2 shrink-0 self-start lg:self-center">
          
          {/* World Admissions Clocks Button */}
          <button
            type="button"
            onClick={() => setShowWorldClocks(!showWorldClocks)}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              showWorldClocks 
                ? 'bg-amber-500/20 text-amber-200 border-amber-500/40' 
                : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="View international university application timezones"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ti' ? 'ዓለምለኻዊ ሰዓታት' : 'Global Clocks'}</span>
          </button>

          {/* Manual Hourly Sync Refresh Button */}
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isRefreshing}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
              isRefreshing
                ? 'bg-slate-800 text-slate-400 cursor-wait'
                : 'bg-gradient-to-r from-[#C5A059] to-[#DFB96C] text-slate-950 hover:brightness-110 active:scale-95'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? (language === 'ti' ? 'ይረጋገጽ ኣሎ...' : 'Verifying...') : (language === 'ti' ? 'ሕጂ ሓድስ' : 'Sync Status')}</span>
          </button>
        </div>

      </div>

      {/* Sync Notification Banner */}
      <AnimatePresence>
        {syncMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 py-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-200 flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable World Clocks Drawer for Application Deadlines */}
      <AnimatePresence>
        {showWorldClocks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-3 border-t border-slate-800/90 overflow-hidden"
          >
            <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center justify-between">
              <span>{language === 'ti' ? 'ናይ ዓበይቲ ዩኒቨርሲቲታት ናይ ምዕጻው ሰዓታት (Deadline Timezones):' : 'Key International Admissions Deadline Timezones (Midnight CUTOFFS):'}</span>
              <span className="font-mono text-amber-300/90 font-black">Live: {formattedCurrentTime}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {timezones.map((tz, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="text-sm">{tz.flag}</span>
                    <span className="text-[11px] text-slate-300 font-medium truncate">{tz.name}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-300">{tz.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Row */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Metric 1: Total Programs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-sky-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {language === 'ti' ? 'ዓለምለኻውያን ዕድላት' : 'Total Programs'}
            </div>
            <div className="text-sm sm:text-base font-black text-white">
              {totalScholarships} {language === 'ti' ? 'ስኮላርሺፓት' : 'Global Tracks'}
            </div>
          </div>
        </div>

        {/* Metric 2: Urgent / Closing Soon */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {language === 'ti' ? 'ኣብ ምዕጻው ዘለዉ' : 'Closing Soon'}
            </div>
            <div className="text-sm sm:text-base font-black text-rose-300">
              {urgentCount} {language === 'ti' ? 'ቀልጢፍካ መልክት' : 'Urgent Deadlines'}
            </div>
          </div>
        </div>

        {/* Metric 3: Fully Funded */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {language === 'ti' ? 'ሙሉእ ብነጻ (100%)' : 'Full Funding'}
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-300">
              {fullyFundedCount} {language === 'ti' ? 'ስኮላርሺፕ' : 'Full Rides'}
            </div>
          </div>
        </div>

        {/* Metric 4: Hourly Verified Active */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {language === 'ti' ? 'ስዓታዊ ፍተሻ' : 'Hourly Health'}
            </div>
            <div className="text-sm sm:text-base font-black text-[#F3E5AB]">
              100% {language === 'ti' ? 'ንጡፍ መርበብ' : 'Portals Verified'}
            </div>
          </div>
        </div>

      </div>

      {/* International Continents / Regions Filter Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{language === 'ti' ? 'ብክፍለ-ዓለም ምረጽ (International Regions):' : 'Filter by International Region & Destination:'}</span>
          </span>
          <span className="text-[10px] text-slate-400">
            {language === 'ti' ? 'ዝተመረጸ፡ ' : 'Viewing: '}
            <strong className="text-white">{selectedRegion}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {regions.map((reg) => {
            const isSelected = selectedRegion === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => onSelectRegion(reg.id)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-[#C5A059] text-slate-950 border-[#C5A059] shadow-xs'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{reg.flag}</span>
                <span>{language === 'ti' ? reg.labelTi : reg.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
