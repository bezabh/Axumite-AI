import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Axumite3DLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showObeliskMedallion?: boolean;
  showReflection?: boolean;
  showSubtitle?: boolean;
  customSubtitle?: string;
  className?: string;
  onClick?: () => void;
}

export const Axumite3DLogo: React.FC<Axumite3DLogoProps> = ({
  size = 'md',
  showObeliskMedallion = true,
  showReflection = true,
  showSubtitle = false,
  customSubtitle,
  className = '',
  onClick,
}) => {
  let isTigrinya = true;
  try {
    const { language } = useLanguage();
    isTigrinya = language === 'ti' || language === 'ti_tg';
  } catch {
    isTigrinya = true;
  }
  // Dimension scaling
  const textScale = {
    xs: 'text-lg sm:text-xl tracking-wider',
    sm: 'text-2xl sm:text-3xl tracking-wider',
    md: 'text-3xl sm:text-4xl lg:text-5xl tracking-widest',
    lg: 'text-4xl sm:text-5xl lg:text-6xl tracking-widest',
    xl: 'text-5xl sm:text-6xl lg:text-7xl tracking-[0.15em]',
    hero: 'text-5xl sm:text-7xl md:text-8xl tracking-[0.18em]',
  }[size];

  const obeliskSize = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    hero: 'w-24 h-24',
  }[size];

  return (
    <div 
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* 3D Extruded Letters Container */}
      <div className="relative flex items-center justify-center font-bold">
        
        {/* ========================================================================= */}
        {/* 1. PRIMARY 3D CHROMATIC LETTERS: 'ኣክሱማይት AI'                             */}
        {/* ========================================================================= */}
        <div className={`flex items-baseline font-black ${textScale}`}>
          {/* 'ኣ' - Electric Royal Violet / Indigo */}
          <span 
            className="inline-block relative transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #B28DFF 0%, #7E42F5 45%, #4A1FB8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 0 #2A086B) drop-shadow(0 4px 6px rgba(126,66,245,0.4))',
            }}
          >
            ኣ
          </span>

          {/* 'ክ' - Deep Magenta Purple */}
          <span 
            className="inline-block relative transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #D47BFA 0%, #A238E8 45%, #6B12A8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 0 #460A70) drop-shadow(0 4px 6px rgba(162,56,232,0.4))',
            }}
          >
            ክ
          </span>

          {/* 'ሱ' - Vivid Hot Magenta Pink */}
          <span 
            className="inline-block relative transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #F871BA 0%, #E62A82 45%, #9E0A4E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 0 #61042E) drop-shadow(0 4px 6px rgba(230,42,130,0.45))',
            }}
          >
            ሱ
          </span>

          {/* 'ማ' - Coral Vermilion / Sunset Rose */}
          <span 
            className="inline-block relative transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #FB927B 0%, #EA583B 45%, #AC2910 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 0 #701402) drop-shadow(0 4px 6px rgba(234,88,59,0.45))',
            }}
          >
            ማ
          </span>

          {/* 'ይ' - Sunset Ember Orange */}
          <span 
            className="inline-block relative transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #FCA756 0%, #F97316 45%, #B44503 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 0 #7A2800) drop-shadow(0 4px 6px rgba(249,115,22,0.45))',
            }}
          >
            ይ
          </span>

          {/* 'ት' - Warm Amber Gold */}
          <span 
            className="inline-block relative transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #FED766 0%, #F59E0B 45%, #B45309 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 0 #78350F) drop-shadow(0 4px 6px rgba(245,158,11,0.45))',
            }}
          >
            ት
          </span>

          {/* Space between Tigrinya & AI */}
          <span className="inline-block w-2 sm:w-3 md:w-4" />

          {/* 'AI' - 3D Solid Beveled 24K Polished Yellow Gold */}
          <span 
            className="inline-block relative font-serif tracking-wider transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #FFF6BD 0%, #FDE047 30%, #D4AF37 55%, #996515 85%, #6B4405 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 0 #543403) drop-shadow(0 4px 8px rgba(212,175,55,0.5))',
            }}
          >
            AI
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. GOLDEN CIRCULAR OBELISK MEDALLION (CENTER BOTTOM)                      */}
      {/* ========================================================================= */}
      {showObeliskMedallion && (
        <div className="relative mt-2 sm:mt-3 flex items-center justify-center">
          {/* Subtle Golden Ambient Flare */}
          <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full pointer-events-none" />

          {/* Gold Obelisk Vector Emblem */}
          <svg 
            className={`${obeliskSize} text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]`}
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Circular Golden Ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              stroke="url(#medallionGoldRing)" 
              strokeWidth="2.2" 
            />

            {/* Stepped Pedestal Base */}
            <path 
              d="M 30 84 L 70 84 L 66 79 L 34 79 Z" 
              fill="url(#medallionGoldFill)" 
              stroke="#D4AF37" 
              strokeWidth="0.8" 
            />
            <path 
              d="M 36 79 L 64 79 L 61 74 L 39 74 Z" 
              fill="url(#medallionGoldFill)" 
              stroke="#D4AF37" 
              strokeWidth="0.8" 
            />
            <path 
              d="M 41 74 L 59 74 L 57 70 L 43 70 Z" 
              fill="url(#medallionGoldFill)" 
              stroke="#D4AF37" 
              strokeWidth="0.8" 
            />

            {/* Obelisk Tapering Pillar Shaft */}
            <path 
              d="M 44 70 L 47 22 C 47 18, 53 18, 53 22 L 56 70 Z" 
              fill="url(#medallionGoldFill)" 
              stroke="#D4AF37" 
              strokeWidth="1" 
            />

            {/* Semicircular Rounded Apex Crown */}
            <path 
              d="M 47 22 C 47 16, 53 16, 53 22 Z" 
              fill="#FFF4B8" 
              stroke="#B45309" 
              strokeWidth="0.8" 
            />

            {/* Carved False Windows / Tiered Storeys */}
            <rect x="48" y="27" width="4" height="3" rx="0.5" fill="#1C1402" stroke="#ECC461" strokeWidth="0.5" />
            <rect x="47.5" y="34" width="5" height="3.5" rx="0.5" fill="#1C1402" stroke="#ECC461" strokeWidth="0.5" />
            <rect x="47" y="42" width="6" height="4" rx="0.5" fill="#1C1402" stroke="#ECC461" strokeWidth="0.5" />
            <rect x="46.5" y="50" width="7" height="4.5" rx="0.5" fill="#1C1402" stroke="#ECC461" strokeWidth="0.5" />
            <rect x="46" y="58" width="8" height="5" rx="0.5" fill="#1C1402" stroke="#ECC461" strokeWidth="0.5" />

            {/* Entrance Portal */}
            <rect x="47" y="65" width="6" height="5" fill="#0A0601" stroke="#FDE047" strokeWidth="0.6" />

            <defs>
              <linearGradient id="medallionGoldRing" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF4B8" />
                <stop offset="40%" stopColor="#EAB308" />
                <stop offset="70%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <linearGradient id="medallionGoldFill" x1="50" y1="18" x2="50" y2="84" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF7C2" />
                <stop offset="30%" stopColor="#FACC15" />
                <stop offset="70%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GLOSSY DARK STUDIO REFLECTION (BOTTOM MIRROR EFFECT)                   */}
      {/* ========================================================================= */}
      {showReflection && (
        <div 
          className="relative overflow-hidden pointer-events-none opacity-40 select-none -scale-y-100 blur-[1px] mt-0.5 sm:mt-1 mask-linear-gradient"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 80%)',
          }}
          aria-hidden="true"
        >
          <div className={`flex items-baseline font-black ${textScale}`}>
            <span style={{ background: 'linear-gradient(180deg, #7E42F5 0%, #B28DFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ኣ</span>
            <span style={{ background: 'linear-gradient(180deg, #A238E8 0%, #D47BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ክ</span>
            <span style={{ background: 'linear-gradient(180deg, #E62A82 0%, #F871BA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ሱ</span>
            <span style={{ background: 'linear-gradient(180deg, #EA583B 0%, #FB927B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ማ</span>
            <span style={{ background: 'linear-gradient(180deg, #F97316 0%, #FCA756 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ይ</span>
            <span style={{ background: 'linear-gradient(180deg, #F59E0B 0%, #FED766 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ት</span>
            <span className="inline-block w-2 sm:w-3 md:w-4" />
            <span className="font-serif" style={{ background: 'linear-gradient(180deg, #D4AF37 0%, #FFF6BD 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </div>
        </div>
      )}

      {/* Subtitle */}
      {showSubtitle && (
        <div className="mt-3 text-center">
          <p className="text-[11px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] text-amber-300/90 uppercase font-semibold">
            {customSubtitle || (isTigrinya ? 'ልዑላዊ ናይ ቅርሲ ብልሒ' : 'SOVEREIGN HERITAGE INTELLIGENCE')}
          </p>
        </div>
      )}
    </div>
  );
};
