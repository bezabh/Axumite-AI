import React from 'react';
import { ShieldAlert, Clock, RefreshCw, LogOut, Lock, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axumiteEmblem from '../assets/axumite_gold_icon.jpg';

interface IdleWarningModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  formattedRemaining: string;
  onStayLoggedIn: () => void;
  onLogoutNow: () => void;
  onEnterHibernation?: () => void;
}

export const IdleWarningModal: React.FC<IdleWarningModalProps> = ({
  isOpen,
  remainingSeconds,
  formattedRemaining,
  onStayLoggedIn,
  onLogoutNow,
  onEnterHibernation,
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0E0C12] border-2 border-amber-500/70 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl relative text-slate-100 overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-lg shadow-amber-500/30 p-0.5 shrink-0 bg-gradient-to-b from-[#8E6D28] to-[#0A0805]">
            <img src={axumiteEmblem} alt="Axumite AI" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/30 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-amber-500/40">
                SECURITY AUTO-LOGOUT SHIELD
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {language === 'ti' ? 'ናይ ዘይምንቅስቓስ ደረት (Inactivity Timeout)' : 'Session Expiring Soon'}
            </h3>
          </div>
        </div>

        <div className="bg-[#171420] border border-amber-500/30 p-4 rounded-2xl space-y-2 text-center">
          <p className="text-xs text-slate-300">
            {language === 'ti'
              ? 'ንደሕንነት ሕሳብኩም ተባሂሉ፡ ብሰንኪ 30 ደቓይቕ ዘይምንቅስቓስ ኣብ ውሽጢ ዝስዕብ ግዜ ብኣውቶማቲክ ክትወጹ ኢኹም፡'
              : 'For your security, you will be automatically logged out due to 30 minutes of inactivity in:'}
          </p>
          <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400 tracking-wider">
            {formattedRemaining}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
            <div 
              className="bg-amber-400 h-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, (remainingSeconds / 60) * 100))}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          {language === 'ti'
            ? 'ኣብ ኣክሱማይት AI ንጥፈታትኩም ንምቕጻል ወይ ናብ ዕረፍቲ/ድቃስ ንምእታው ዝስዕቡ መልጎማት ጠውቑ።'
            : 'Click below to keep your active session or switch into sovereign hibernation mode.'}
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={onStayLoggedIn}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#DCA83D] to-[#F3C65D] hover:brightness-110 active:scale-[0.98] text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{language === 'ti' ? 'ንጥፈት ኣረጋግጽ (Stay In)' : 'Stay Logged In'}</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {onEnterHibernation && (
              <button
                type="button"
                onClick={onEnterHibernation}
                className="w-full py-2.5 px-3 bg-[#1B152B] hover:bg-[#281F40] border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ti' ? 'ዕረፍቲ/ድቃስ (Hibernate)' : 'Enter Hibernation'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogoutNow}
              className="w-full py-2.5 px-3 bg-[#1F1B2A] hover:bg-[#2A2538] border border-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>{language === 'ti' ? 'ሕጂ ውጻእ (Log Out)' : 'Log Out Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
