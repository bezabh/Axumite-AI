import React, { useState } from 'react';
import { AppTab, UserProfile } from '../types';
import { Globe, Check, Menu, Sparkles, Bell, Mic, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  savedCount: number;
  logoSrc: string;
  onOpenPwaModal?: () => void;
  user: UserProfile;
  onOpenUserModal: () => void;
  isOffline: boolean;
  onOpenOnboardingModal?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  onOpenWelcomeOverlay?: () => void;
  onOpenSecurityModal?: () => void;
  onOpenDrawer?: () => void;
  unreadNotifCount?: number;
  onOpenNotifications?: () => void;
  onOpenVoiceOverlay?: () => void;
  isAlwaysListening?: boolean;
  onToggleAlwaysListening?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  logoSrc,
  onOpenPwaModal,
  user,
  onOpenUserModal,
  isOffline,
  onOpenOnboardingModal,
  onOpenAuthModal,
  onOpenSecurityModal,
  onOpenDrawer,
  unreadNotifCount = 0,
  onOpenNotifications,
  onOpenVoiceOverlay,
  isAlwaysListening = false,
  onToggleAlwaysListening,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#8E6D28]/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Side Menu Launcher */}
          <div className="flex items-center space-x-2.5">
            {onOpenDrawer && (
              <button
                type="button"
                onClick={onOpenDrawer}
                className="p-2 sm:p-2.5 rounded-xl bg-[#121422] border border-[#8E6D28]/40 hover:border-[#C5A059] text-[#F3E5AB] hover:text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center group"
                title={language === 'ti' ? 'ናይ መሳርሒታት ዝርዝር (All Tools)' : 'All Tools & Menu'}
                aria-label="Open Tools Menu"
              >
                <Menu className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </button>
            )}

            <div id="axumite-logo-brand" className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('premiere')}>
              <div className="relative w-10 h-10 border border-[#C5A059]/60 p-0.5 rounded-xl flex items-center justify-center bg-[#0F0E13] group-hover:scale-105 transition-transform duration-300 shadow-md">
                <img 
                  src={logoSrc} 
                  alt="Emblem" 
                  className="w-full h-full rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 stela-glow opacity-60 group-hover:opacity-100 transition-opacity rounded-xl" />
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-base sm:text-lg font-black tracking-wider metallic-gold-shimmer leading-none">
                  AXUMITE AI
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono mt-0.5 font-medium">
                  {language === 'ti' ? 'ልዑላዊ AI መድረኽ' : 'Sovereign Heritage Intelligence'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action: Notifications, Management, Language Switcher, Welcome */}
          <div className="flex items-center space-x-2">
            {/* Sovereign Voice Command HUD & Always-Listening Toggle Button Group */}
            {onOpenVoiceOverlay && (
              <div className="flex items-center rounded-sm border border-amber-500/70 bg-[#120E1C] overflow-hidden shadow-md group">
                {/* Primary Voice Command HUD Launcher Button */}
                <button
                  type="button"
                  id="axumite-voice-command-nav-btn"
                  onClick={onOpenVoiceOverlay}
                  className={`p-2 hover:bg-amber-500/20 text-amber-300 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                    isAlwaysListening ? 'bg-amber-950/70 text-amber-200' : 'bg-gradient-to-r from-amber-500/15 via-[#1E192D] to-amber-500/15'
                  }`}
                  title={language === 'ti' ? 'ናይ ድምጺ ትእዛዝ መድረኽ ክፈት (Voice Command HUD)' : 'Voice Command Overlay'}
                  aria-label="Voice Command Overlay"
                >
                  <Mic className={`w-4 h-4 ${isAlwaysListening ? 'text-emerald-400 animate-bounce' : 'text-amber-400 group-hover:scale-110'}`} />
                  <span className="sr-only">Voice Commands</span>
                </button>

                {/* Secondary Always-Listening Toggle Button */}
                {onToggleAlwaysListening && (
                  <button
                    type="button"
                    id="axumite-always-listening-toggle-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAlwaysListening();
                    }}
                    className={`px-1.5 py-2 border-l border-amber-500/40 hover:bg-amber-500/25 transition-all flex items-center space-x-1 cursor-pointer select-none text-[9px] font-black uppercase tracking-wider ${
                      isAlwaysListening
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-inner'
                        : 'bg-[#181324] text-amber-400/80 hover:text-amber-200'
                    }`}
                    title={
                      isAlwaysListening
                        ? (language === 'ti' ? 'Hands-Free ሁነታ ንቑሕ ኣሎ (ጠውቕ ንምቁራጽ)' : 'Always-Listening Active (Click to pause)')
                        : (language === 'ti' ? 'Hands-Free ኩሉ ግዜ ሰማዒ ንምብራህ ጠውቕ' : 'Enable Always-Listening Hands-free Mode')
                    }
                    aria-label="Toggle Always-Listening Voice Mode"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAlwaysListening ? 'bg-emerald-400 animate-ping' : 'bg-amber-500/40'
                      }`}
                    />
                    <Radio className={`w-3 h-3 ${isAlwaysListening ? 'text-emerald-400 animate-pulse' : 'text-amber-400/60'}`} />
                    <span className="hidden sm:inline text-[8.5px]">
                      {isAlwaysListening ? 'ON' : 'AUTO'}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Push Notifications & Alerts Button */}
            {onOpenNotifications && (
              <button
                type="button"
                id="axumite-notifications-bell-btn"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-sm border border-[#C5A059]/60 hover:border-[#F3E5AB] bg-[#120E1C] text-[#F3E5AB] hover:text-white transition-all cursor-pointer shadow-md flex items-center justify-center group"
                title={language === 'ti' ? 'ማእከል ምልክታታትን ስኮላርሺፕን (Notifications & Alerts)' : 'Notifications & Scholarship Alerts'}
                aria-label="Open Notifications"
              >
                <Bell className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 border border-[#050505] flex items-center justify-center text-[9px] font-black text-white shadow-lg animate-pulse">
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </button>
            )}

            {/* Management Hub Quick Action */}
            <button
              type="button"
              onClick={() => setActiveTab('management')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                activeTab === 'management' || activeTab === 'user-management' || activeTab === 'payment-management' || activeTab === 'customer-management'
                  ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black border-[#F3E5AB] stela-glow'
                  : 'bg-[#120E1C] border-[#C5A059]/60 hover:border-[#F3E5AB] text-[#F3E5AB]'
              }`}
              title={language === 'ti' ? 'ናይ ምሕደራ ማእከል' : 'Management Hub'}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{language === 'ti' ? 'ምሕደራ' : 'Management'}</span>
            </button>

            {/* Language Switcher Control */}
            <div className="relative z-50">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#120E1C] border border-[#C5A059]/80 hover:border-[#F3E5AB] text-[#F3E5AB] font-extrabold text-[10px] uppercase tracking-wider transition-all shadow-md cursor-pointer rounded-sm"
                title={t.selectLanguage}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{language === 'ti' ? 'ትግርኛ' : 'English'}</span>
              </button>

              {/* Language Selector Dropdown Menu */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0B0912] border-2 border-[#8E6D28] rounded-xl shadow-2xl p-2 z-50 space-y-1.5 backdrop-blur-xl">
                  <div className="text-[9px] uppercase tracking-widest text-[#C5A059] font-mono px-2 py-1 border-b border-[#8E6D28]/30 font-bold">
                    {t.selectLanguage}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('ti');
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-bold rounded-lg transition-all ${
                      language === 'ti'
                        ? 'bg-amber-500/25 text-[#F3E5AB] border border-amber-400/60 shadow-lg'
                        : 'text-gray-300 hover:bg-[#181326] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>ትግርኛ (Tigrinya)</span>
                    </span>
                    {language === 'ti' && <Check className="w-4 h-4 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-bold rounded-lg transition-all ${
                      language === 'en'
                        ? 'bg-amber-500/25 text-[#F3E5AB] border border-amber-400/60 shadow-lg'
                        : 'text-gray-300 hover:bg-[#181326] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <Globe className="w-3.5 h-3.5 text-sky-400" />
                      <span>English</span>
                    </span>
                    {language === 'en' && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
