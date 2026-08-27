import React from 'react';
import { Axumite3DLogo } from './Axumite3DLogo';
import { Sparkles, Crown, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import bannerImg from '../assets/images/axumite_3d_banner_logo_1787505671345.jpg';

interface Axumite3DBrandBannerProps {
  onExplore?: () => void;
  className?: string;
  variant?: 'image' | 'render' | 'hybrid';
}

export const Axumite3DBrandBanner: React.FC<Axumite3DBrandBannerProps> = ({
  onExplore,
  className = '',
  variant = 'hybrid',
}) => {
  let isTigrinya = true;
  try {
    const { language } = useLanguage();
    isTigrinya = language === 'ti' || language === 'ti_tg';
  } catch {
    isTigrinya = true;
  }
  return (
    <div 
      className={`relative w-full rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-[#08080B] group ${className}`}
      style={{
        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.15)',
      }}
    >
      {/* Background Studio Ambience & Reflections */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121018] via-[#09080E] to-[#040406] pointer-events-none" />
      
      {/* Ambient Radial Spotlights */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Render Option 1: High Resolution Photorealistic 3D Image */}
      {variant === 'image' || variant === 'hybrid' ? (
        <div className="relative w-full aspect-[16/7.5] sm:aspect-[16/6.5] overflow-hidden flex items-center justify-center">
          <img 
            src={bannerImg} 
            alt="ኣክሱማይት AI 3D Masterpiece Emblem" 
            className="w-full h-full object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700 select-none"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Golden Vignette Border Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 border border-[#D4AF37]/30 rounded-3xl pointer-events-none" />
        </div>
      ) : (
        /* Render Option 2: Pure Dynamic CSS & SVG 3D Rendering */
        <div className="relative py-10 sm:py-14 px-4 flex flex-col items-center justify-center text-center">
          <Axumite3DLogo 
            size="lg" 
            showObeliskMedallion={true} 
            showReflection={true} 
            showSubtitle={true} 
          />
        </div>
      )}

      {/* Bottom Floating Bar with Branding Badge and Optional Action */}
      {onExplore && (
        <div className="relative z-10 px-5 py-3 bg-[#0D0B12]/90 backdrop-blur-md border-t border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-serif tracking-widest text-[#F5E6BE] font-bold">
              {isTigrinya ? 'ልዑላዊ ትግርኛ AI' : 'SOVEREIGN TIGRINYA AI'}
            </span>
          </div>

          <button
            onClick={onExplore}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-[#D4AF37]/50 text-amber-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>{isTigrinya ? 'መርምር' : 'Explore'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      )}
    </div>
  );
};
