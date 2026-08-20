import React from 'react';
import { Radio, Mic, X, Volume2, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AlwaysListeningFloatingIndicatorProps {
  isActive: boolean;
  onToggle: () => void;
  onOpenOverlay: () => void;
  lastPhrase?: string | null;
  lastFeedback?: { title: string; desc: string } | null;
  onClearFeedback?: () => void;
}

export const AlwaysListeningFloatingIndicator: React.FC<AlwaysListeningFloatingIndicatorProps> = ({
  isActive,
  onToggle,
  onOpenOverlay,
  lastPhrase,
  lastFeedback,
  onClearFeedback,
}) => {
  const { language } = useLanguage();

  if (!isActive && !lastFeedback) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end space-y-2 select-none">
      {/* Dynamic Command Feedback Toast */}
      {lastFeedback && (
        <div className="bg-[#120E1C]/95 border-2 border-emerald-500/80 p-3 rounded-2xl shadow-2xl text-slate-100 max-w-sm backdrop-blur-xl animate-fade-in flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <Check className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300">
                {lastFeedback.title}
              </div>
              <div className="text-[11px] text-slate-300">
                {lastFeedback.desc}
              </div>
            </div>
          </div>
          {onClearFeedback && (
            <button
              onClick={onClearFeedback}
              className="text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Persistent Hands-Free Live Voice Pill */}
      {isActive && (
        <div className="bg-[#0E0B16]/95 border-2 border-amber-500/70 p-2 sm:px-3.5 sm:py-2.5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)] flex items-center space-x-3 backdrop-blur-xl">
          {/* Pulsing Live Mic Indicator */}
          <div 
            onClick={onOpenOverlay}
            className="flex items-center space-x-2 cursor-pointer group"
            title={language === 'ti' ? 'ናይ ድምጺ ትእዛዛት HUD ክፈት' : 'Open Voice Command HUD'}
          >
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping" />
              <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Mic className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>

            <div className="text-left hidden xs:block">
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-black text-amber-200 group-hover:text-white transition-colors">
                  {language === 'ti' ? 'HANDS-FREE ድምጺ' : 'HANDS-FREE VOICE'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[9.5px] text-amber-400/80 font-mono tracking-tight">
                {lastPhrase ? `"${lastPhrase.substring(0, 20)}..."` : (language === 'ti' ? 'ይሰምዕ ኣሎ... (Listening)' : 'Listening for commands...')}
              </div>
            </div>
          </div>

          {/* Quick Toggle to Turn Off */}
          <button
            type="button"
            onClick={onToggle}
            className="px-2 py-1 bg-amber-950/80 hover:bg-rose-950/80 border border-amber-500/60 hover:border-rose-500 text-amber-200 hover:text-rose-200 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center space-x-1 active:scale-95 shadow-inner"
            title={language === 'ti' ? 'Hands-free ሁነታ ኣቋርጽ' : 'Disable Always-listening Voice'}
          >
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{language === 'ti' ? 'ኣጥፍእ' : 'OFF'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
