import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Globe, Bell, Sparkles, Activity, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Authentic SVG Flag for Tigray (Red background, Yellow hoist triangle, Yellow star with red core)
export const TigrayFlagIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-4" }) => (
  <svg className={`${className} rounded-xs shadow-xs shrink-0`} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" fill="#D31027" />
    <polygon points="0,0 16,12 0,24" fill="#FFCC00" />
    <polygon 
      points="6,12 7.2,14.5 10,14.8 8,16.8 8.5,19.5 6,18.2 3.5,19.5 4,16.8 2,14.8 4.8,14.5" 
      fill="#D31027" 
      transform="scale(0.8) translate(0.5, 0.5)"
    />
  </svg>
);

// Authentic SVG Flag for Eritrea
export const EritreaFlagIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-4" }) => (
  <svg className={`${className} rounded-xs shadow-xs shrink-0`} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="12" fill="#00A357" />
    <rect y="12" width="36" height="12" fill="#4189DD" />
    <polygon points="0,0 36,12 0,24" fill="#EB2436" />
    <circle cx="10" cy="12" r="4.5" stroke="#FFCC00" strokeWidth="1.2" fill="none" />
    <path d="M 10 9 V 15 M 8 12 H 12" stroke="#FFCC00" strokeWidth="0.8" />
  </svg>
);

interface GreetingPhrase {
  headline: string;
  subtitle: string;
  badge?: string;
}

const GREETING_PHRASES: GreetingPhrase[] = [
  {
    headline: 'ሰላም፡ እንቋዕ ብደሓን መጻእኹም',
    subtitle: 'ኣክሱማይት AI — ልዑላዊት ስርዓተ-ኢንተለጀንስ',
    badge: 'ስርዓተ-ኢንተለጀንስ'
  },
  {
    headline: 'ብሩኽ መዓልቲ ይግበረልኩም',
    subtitle: 'ኦበሊስክ AI — ጥበብ ኣክሱምን ዘመናዊ ቴክኖሎጂን',
    badge: 'ትግርኛ AI'
  },
  {
    headline: 'ጥንታዊ ታሪክን ዲጂታል ጥበብን',
    subtitle: 'ግዕዝን ትግርኛን AI — ምሉእ ባህላዊ ውርሻ',
    badge: 'ዘመናዊ ኢንተለጀንስ'
  }
];

interface CyberHudHeroBannerProps {
  onOpenDrawer?: () => void;
  onOpenNotifications?: () => void;
  onToggleLanguage?: () => void;
  unreadNotifCount?: number;
  className?: string;
}

export const CyberHudHeroBanner: React.FC<CyberHudHeroBannerProps> = ({
  onOpenDrawer,
  onOpenNotifications,
  onToggleLanguage,
  unreadNotifCount = 9,
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isHibernating, setIsHibernating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Rolling text cycle timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % GREETING_PHRASES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Periodic Hibernation Glow Pulse cycle (sleep-wake neon breathing)
  useEffect(() => {
    const hibernationInterval = setInterval(() => {
      setIsHibernating(true);
      setTimeout(() => {
        setIsHibernating(false);
      }, 2200);
    }, 6000);

    return () => clearInterval(hibernationInterval);
  }, []);

  const currentPhrase = GREETING_PHRASES[currentPhraseIndex];

  return (
    <div 
      className={`relative w-full overflow-hidden select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ========================================================================= */}
      {/* 1. OUTER AMBIENT GLOWS & NEON AURORAS                                     */}
      {/* ========================================================================= */}
      <div 
        className={`absolute -top-12 left-1/2 -translate-x-1/2 w-4/5 h-28 bg-cyan-500/25 blur-3xl pointer-events-none rounded-full transition-all duration-1000 ${
          isHibernating ? 'opacity-90 scale-110 bg-cyan-400/35' : 'opacity-50 scale-100'
        }`} 
      />
      <div className="absolute top-1/2 right-2 w-36 h-36 bg-purple-600/25 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-4 w-40 h-40 bg-teal-500/20 blur-3xl pointer-events-none rounded-full" />

      {/* ========================================================================= */}
      {/* 2. MAIN HUD MOTHERBOARD CHASSIS                                          */}
      {/* ========================================================================= */}
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#050E17]/95 backdrop-blur-2xl border-2 border-cyan-500/50 p-4 sm:p-6 shadow-[0_0_40px_rgba(6,182,212,0.3),inset_0_0_25px_rgba(6,182,212,0.15)] transition-all">
        
        {/* Futuristic HUD Inset Border */}
        <div className="absolute inset-1.5 sm:inset-2.5 rounded-[22px] sm:rounded-[30px] border border-cyan-400/30 pointer-events-none" />

        {/* Top Notch Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-[3px] bg-gradient-to-r from-transparent via-[#C084FC] to-transparent shadow-[0_0_14px_#C084FC]" />
        
        {/* Bottom Notch Accent Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-[3px] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_14px_#38BDF8]" />

        {/* ========================================================================= */}
        {/* 3. DETAILED PCB MOTHERBOARD & CIRCUITRY OVERLAY (Matches 1787577153809)   */}
        {/* ========================================================================= */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-45 sm:opacity-70"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 700 340"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cyberCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="cyberPurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Top Left PCB IC Chip & Bus Traces */}
          <rect x="25" y="30" width="40" height="25" rx="3" fill="#082032" stroke="#22D3EE" strokeWidth="1" />
          <line x1="30" y1="25" x2="30" y2="30" stroke="#22D3EE" strokeWidth="1" />
          <line x1="40" y1="25" x2="40" y2="30" stroke="#22D3EE" strokeWidth="1" />
          <line x1="50" y1="25" x2="50" y2="30" stroke="#22D3EE" strokeWidth="1" />
          <line x1="60" y1="25" x2="60" y2="30" stroke="#22D3EE" strokeWidth="1" />
          
          <path d="M 65 42 H 140 L 165 67 V 95" fill="none" stroke="url(#cyberCyan)" strokeWidth="1.2" />
          <circle cx="165" cy="95" r="2.5" fill="#22D3EE" className={isHibernating ? 'animate-ping' : ''} />

          {/* Top Right Dense Circuit Bus */}
          <path d="M 520 28 H 610 L 645 63 V 110" fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="5 2" />
          <path d="M 490 42 H 580 L 615 77 V 130" fill="none" stroke="#38BDF8" strokeWidth="1.2" />
          <path d="M 460 56 H 550 L 585 91 V 150" fill="none" stroke="#818CF8" strokeWidth="1" />
          
          <circle cx="490" cy="42" r="2" fill="#22D3EE" />
          <circle cx="585" cy="150" r="2.5" fill="#38BDF8" />
          <circle cx="645" cy="110" r="3" fill="#22D3EE" className="animate-pulse" />

          {/* Bottom Left Dense Motherboard Traces & SMD Pads */}
          <path d="M 180 310 H 90 L 45 265 V 195" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeDasharray="6 3" />
          <path d="M 210 295 H 120 L 75 250 V 180" fill="none" stroke="#38BDF8" strokeWidth="1.2" />
          <path d="M 240 280 H 150 L 105 235 V 165" fill="none" stroke="#C084FC" strokeWidth="1" />
          
          <circle cx="210" cy="295" r="2.5" fill="#2DD4BF" />
          <circle cx="45" cy="195" r="2.5" fill="#2DD4BF" />

          {/* Bottom Center IC Chip */}
          <rect x="320" y="305" width="60" height="20" rx="3" fill="#082032" stroke="#38BDF8" strokeWidth="1" />
          <line x1="335" y1="300" x2="335" y2="305" stroke="#38BDF8" strokeWidth="1" />
          <line x1="350" y1="300" x2="350" y2="305" stroke="#38BDF8" strokeWidth="1" />
          <line x1="365" y1="300" x2="365" y2="305" stroke="#38BDF8" strokeWidth="1" />

          {/* Bottom Right Diagonal Traces */}
          <line x1="560" y1="300" x2="600" y2="260" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="575" y1="305" x2="615" y2="265" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="590" y1="310" x2="630" y2="270" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="605" y1="315" x2="645" y2="275" stroke="#38BDF8" strokeWidth="1.5" />
        </svg>

        {/* 4-Point Corner Sparkle Flare */}
        <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 pointer-events-none animate-pulse">
          <Sparkles className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_10px_#67E8F9]" />
        </div>

        {/* Rolling Status / Hibernation Pulse Indicator */}
        <div className="absolute top-3 left-4 sm:top-3.5 sm:left-6 flex items-center space-x-1.5 pointer-events-none opacity-75">
          <div className={`w-2 h-2 rounded-full transition-all duration-700 ${
            isHibernating 
              ? 'bg-purple-400 shadow-[0_0_8px_#C084FC] scale-125' 
              : 'bg-cyan-400 shadow-[0_0_8px_#22D3EE]'
          }`} />
          <span className="text-[9px] font-mono tracking-wider text-cyan-300/80 font-bold uppercase">
            {isHibernating ? 'HIBERNATION PULSE' : 'CORE ACTIVE'}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 4. MAIN CONTENT LAYOUT                                                   */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 py-2 mt-1">
          
          {/* ========================================================================= */}
          {/* LEFT: Cyber HUD Menu Button (≡)                                          */}
          {/* ========================================================================= */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start">
            <button
              type="button"
              onClick={onOpenDrawer}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0B2233]/90 hover:bg-[#0E2E44] border-2 border-cyan-400/70 hover:border-cyan-300 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4),inset_0_0_12px_rgba(34,211,238,0.2)] flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 active:scale-95 cursor-pointer group shrink-0"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <div className="w-5 sm:w-6 h-[2.5px] bg-cyan-300 rounded-full group-hover:bg-white shadow-[0_0_8px_#22D3EE] transition-colors" />
              <div className="w-5 sm:w-6 h-[2.5px] bg-cyan-300 rounded-full group-hover:bg-white shadow-[0_0_8px_#22D3EE] transition-colors" />
              <div className="w-5 sm:w-6 h-[2.5px] bg-cyan-300 rounded-full group-hover:bg-white shadow-[0_0_8px_#22D3EE] transition-colors" />
            </button>

            {/* Responsive Actions: Language Toggle & Notifications (Single Unified Block) */}
            <div className="flex md:hidden items-center space-x-1.5">
              <button
                type="button"
                onClick={onToggleLanguage}
                className="h-11 px-2.5 rounded-2xl bg-gradient-to-r from-[#0C1F38] via-[#16173B] to-[#120F2B] border-2 border-purple-400/80 text-white shadow-[0_0_15px_rgba(192,132,252,0.35)] flex items-center space-x-1.5 active:scale-95 cursor-pointer"
                title="Switch Language"
              >
                <Globe className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-black tracking-wide text-cyan-100">
                  {language === 'ti' || language === 'ti_tg' ? 'ትግርኛ' : language === 'de' ? 'DE' : 'EN'}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenNotifications}
                className="w-11 h-11 rounded-2xl bg-[#0B2233]/90 border-2 border-cyan-400/70 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.35)] flex items-center justify-center relative active:scale-95 cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-cyan-300" />
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-[#07131D] shadow-[0_0_8px_rgba(249,115,22,0.8)]">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CENTER: 3D ROLLING & HIBERNATION NEON TYPOGRAPHY CAROUSEL                */}
          {/* ========================================================================= */}
          <div className="flex-1 text-center py-1 sm:py-2 px-2 flex flex-col items-center justify-center min-h-[110px] sm:min-h-[130px] overflow-hidden">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhraseIndex}
                initial={{ 
                  opacity: 0, 
                  y: 20, 
                  rotateX: -30, 
                  scale: 0.96,
                  filter: 'blur(3px)'
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0, 
                  scale: isHibernating ? 1.02 : 1,
                  filter: 'blur(0px)'
                }}
                exit={{ 
                  opacity: 0, 
                  y: -20, 
                  rotateX: 30, 
                  scale: 0.96,
                  filter: 'blur(3px)'
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="flex flex-col items-center justify-center transform perspective-1000 space-y-1.5"
              >
                {/* Main Headline */}
                <motion.h1 
                  animate={{
                    textShadow: isHibernating
                      ? '0 0 20px rgba(94, 234, 212, 1), 0 0 40px rgba(34, 211, 238, 0.9), 0 0 60px rgba(6, 182, 212, 0.7)'
                      : '0 0 12px rgba(94, 234, 212, 0.9), 0 0 24px rgba(34, 211, 238, 0.6), 0 0 36px rgba(6, 182, 212, 0.4)'
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                  className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-[#5EEAD4] sm:text-[#67E8F9] leading-tight"
                >
                  {currentPhrase.headline}
                </motion.h1>

                {/* Subtitle / System Identity */}
                <motion.div 
                  animate={{
                    textShadow: isHibernating
                      ? '0 0 16px rgba(233, 213, 255, 1), 0 0 32px rgba(192, 132, 252, 0.85)'
                      : '0 0 10px rgba(233, 213, 255, 0.75), 0 0 20px rgba(192, 132, 252, 0.5)'
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                  className="text-sm sm:text-base md:text-lg font-bold tracking-normal text-[#E9D5FF] leading-snug font-sans"
                >
                  {currentPhrase.subtitle}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Rolling Phrase Dots indicator */}
            <div className="flex items-center space-x-1.5 mt-2.5">
              {GREETING_PHRASES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhraseIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentPhraseIndex 
                      ? 'w-5 bg-cyan-300 shadow-[0_0_8px_#22D3EE]' 
                      : 'w-1.5 bg-cyan-900/60 hover:bg-cyan-700'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT (Desktop): Language Switcher & Bell                                 */}
          {/* ========================================================================= */}
          <div className="hidden md:flex items-center space-x-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleLanguage}
              className="h-12 px-3.5 rounded-2xl bg-gradient-to-r from-[#0C1F38] via-[#16173B] to-[#120F2B] hover:from-[#132A4D] hover:to-[#1B1440] border-2 border-purple-400/80 hover:border-purple-300 text-white shadow-[0_0_20px_rgba(192,132,252,0.4),inset_0_0_10px_rgba(192,132,252,0.2)] flex items-center space-x-2 transition-all duration-300 active:scale-95 cursor-pointer group"
              title="Switch Language"
            >
              <Globe className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span 
                className="text-xs font-black tracking-wide text-cyan-100 group-hover:text-white"
                style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.8)' }}
              >
                {language === 'ti' || language === 'ti_tg' ? 'ትግርኛ' : language === 'de' ? 'DE' : 'EN'}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenNotifications}
              className="w-12 h-12 rounded-2xl bg-[#0B2233]/90 hover:bg-[#0E2E44] border-2 border-cyan-400/70 hover:border-cyan-300 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4),inset_0_0_10px_rgba(34,211,238,0.2)] flex items-center justify-center relative transition-all duration-300 active:scale-95 cursor-pointer group shrink-0"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_#22D3EE]" />
              <span 
                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-gradient-to-r from-[#FF5722] via-[#F97316] to-[#EF4444] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-[#07131D] shadow-[0_0_12px_rgba(249,115,22,0.95)] animate-pulse font-sans"
              >
                {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
