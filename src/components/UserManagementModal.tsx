import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  ChevronLeft, Bell, Share2, Star, HelpCircle, Shield, FileText, 
  CreditCard, ChevronRight, LogIn, LogOut, Sparkles, Rocket, Camera,
  Check, X, HardDrive, Trash2, ShieldCheck, RefreshCw, Volume2, Mic,
  Palette, Sliders, Sun, Eye, Layers, Sparkle
} from 'lucide-react';
import { 
  useBrandingTheme, 
  GoldIntensity, 
  ThemeHue, 
  GOLD_PALETTE, 
  THEME_HUE_PALETTE 
} from '../context/BrandingThemeContext';
import { logoutFromFirebase } from '../lib/firebase';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  isOffline: boolean;
  onToggleOfflineAccess?: () => void;
  onOpenSecurityModal?: () => void;
  onOpenPaymentModal?: () => void;
  onOpenManagement?: (section?: 'users' | 'payments' | 'customers') => void;
  onPlayWelcomeAudio?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  isOffline,
  onToggleOfflineAccess,
  onOpenSecurityModal,
  onOpenPaymentModal,
  onOpenManagement,
  onPlayWelcomeAudio,
  onOpenAuthModal,
}) => {
  // Custom Branding Hook
  const { 
    branding, 
    setGoldIntensity, 
    setThemeHue, 
    setGoldShimmerEffect, 
    setBorderGlow, 
    resetToDefaultBranding,
    goldAccentColor,
    themeHueColor
  } = useBrandingTheme();

  // Toggle states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeSubModal, setActiveSubModal] = useState<
    'none' | 'branding' | 'storage' | 'privacy' | 'terms' | 'faq' | 'rate' | 'share' | 'contribute'
  >('none');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Storage Stats
  const [chatCacheSizeKb, setChatCacheSizeKb] = useState('0.0');
  const [visionCacheSizeKb, setVisionCacheSizeKb] = useState('0.0');
  const [savedInsightsSizeKb, setSavedInsightsSizeKb] = useState('0.0');
  const [dependentDataSizeKb, setDependentDataSizeKb] = useState('0.0');
  const [totalReclaimableKb, setTotalReclaimableKb] = useState('0.0');

  const calculateStorage = () => {
    try {
      const insightsRaw = localStorage.getItem('axumite_saved_insights');
      const insightsKb = insightsRaw ? insightsRaw.length / 1024 : 0;
      setSavedInsightsSizeKb(insightsKb.toFixed(1));

      let chatBytes = 0;
      ['axumite_chat_history', 'axumite_chat_cache', 'axumite_chat_conversations', 'axumite_offline_responses'].forEach((k) => {
        const v = localStorage.getItem(k);
        if (v) chatBytes += v.length;
      });
      setChatCacheSizeKb((chatBytes / 1024).toFixed(1));

      let visionBytes = 0;
      ['axumite_vision_history', 'axumite_vision_cache', 'axumite_image_prompts'].forEach((k) => {
        const v = localStorage.getItem(k);
        if (v) visionBytes += v.length;
      });
      setVisionCacheSizeKb((visionBytes / 1024).toFixed(1));

      let depBytes = 0;
      ['axumite_welcome_overlay_shown', 'axumite_temp_cache', 'axumite_audio_cache'].forEach((k) => {
        const v = localStorage.getItem(k);
        if (v) depBytes += v.length;
      });
      setDependentDataSizeKb((depBytes / 1024).toFixed(1));

      setTotalReclaimableKb(((insightsKb * 1024 + chatBytes + visionBytes + depBytes) / 1024).toFixed(1));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) calculateStorage();
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearAllStorage = () => {
    try {
      [
        'axumite_saved_insights',
        'axumite_chat_history',
        'axumite_chat_cache',
        'axumite_chat_conversations',
        'axumite_offline_responses',
        'axumite_vision_history',
        'axumite_vision_cache',
        'axumite_image_prompts',
        'axumite_welcome_overlay_shown',
        'axumite_temp_cache',
        'axumite_audio_cache',
      ].forEach((k) => localStorage.removeItem(k));
      calculateStorage();
      showToast('ዕቋር ብምሉእ ተጸሪጉ (Storage cleared)');
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ኣክሱማይት AI',
        text: 'ቀዳማይ ቋንቋ ትግርኛን ግዕዝን AI ፕላትፎርም ተጠቐሙ።',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('ሊንክ ናይ ኣፕ ተቐዲሑ (Link copied to clipboard)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#F8FAFC] min-h-screen sm:min-h-0 sm:my-6 sm:rounded-[36px] shadow-2xl p-5 sm:p-6 space-y-5 relative text-slate-800 flex flex-col justify-between"
      >
        
        <div className="space-y-4">
          
          {/* Top Header: Circular Back Button & Title */}
          <div className="relative flex items-center justify-center pt-2 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="absolute left-0 w-11 h-11 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight font-serif">
                ፕሮፋይል
              </h1>
              <div className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-widest mt-0.5 font-sans">
                USER PROFILE
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl text-center shadow-lg animate-fade-in flex items-center justify-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* User Profile Avatar & Badge Section (Matching Screenshot 2) */}
          <div className="flex flex-col items-center justify-center pt-1 pb-2">
            <div className="relative">
              {/* Blue Avatar Bubble */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20 font-serif">
                {user.name && user.name.trim().length > 0 ? user.name.charAt(0) : 'ክ'}
              </div>

              {/* Camera Icon Overlay on bottom right */}
              <button 
                type="button"
                onClick={() => {
                  const newName = prompt('ስምካ ኣእቱ (Enter your name):', user.name || 'ክቡር ዓሚል');
                  if (newName) onUpdateUser({ name: newName });
                }}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1E293B] border-2 border-white flex items-center justify-center text-white shadow-md hover:bg-black transition-all cursor-pointer"
                title="Change Name / Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Superadmin / Guest Pill Badge below Avatar */}
              {((user.email || '').trim().toLowerCase() === 'beckylove2004@gmail.com' || user.role === 'Creator') ? (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] via-[#EAB308] to-[#F59E0B] text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 border border-amber-300 flex items-center space-x-1 whitespace-nowrap">
                  <span>👑</span>
                  <span>SUPERADMIN (ልዑላዊ ኣድሚን)</span>
                </div>
              ) : (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-cyan-300 border border-cyan-500/50 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center space-x-1 whitespace-nowrap">
                  <span>👤</span>
                  <span>GUEST USER (ጋሻ ተጠቃሚ)</span>
                </div>
              )}
            </div>

            {/* Name and Email */}
            <div className="text-center mt-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight font-serif">
                {user.name || 'ክቡር ዓሚል'}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {user.email || 'No email linked'}
              </p>
            </div>
          </div>

          {/* Project Support Card (Dark Navy Hero Card Matching Screenshot 2) */}
          <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D] p-5 rounded-3xl text-white shadow-xl overflow-hidden space-y-3">
            {/* Background geometric curve */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-blue-500/10 pointer-events-none blur-2xl" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight leading-snug">
                    ደገፍኩም ንፕሮጀክትና
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium">
                    ንዕቤትና ኣተባብዑ
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal pt-1">
                ከም ማሕበረሰብ ምስ ግዜ ንምስጓም፡ ዝተረቐቐ ቴክኖሎጂ ክህልወና ኣገዳሲ እዩ። ነዚ ተጀሚሩ ዘሎ ዕዮ ብዝበለጸ ንምቕጻልን ናብ ዝለዓለ ደረጃ ንምብጻሕን ሓገዝኩም የድልየና።
              </p>

              <button
                type="button"
                onClick={() => {
                  if (onOpenPaymentModal) onOpenPaymentModal();
                  else setActiveSubModal('contribute');
                }}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#CA8A04] hover:brightness-105 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>ኣበርክቶኹም ንፕሮጀክትና</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>

          {/* Section 1: ACCOUNT & SETTINGS (Screenshot 2) */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              ኣካውንትን ቅጥዕታትን (ACCOUNT & SETTINGS)
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
              
              {/* Item 1: Subscription / PRO */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenPaymentModal) onOpenPaymentModal();
                  else showToast('PRO Membership Active');
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ክፍሊት (Subscription)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Manage your PRO status
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-[10px] font-black uppercase font-mono tracking-wider">
                  PRO
                </span>
              </button>

              {/* Item 2: Custom Branding & Metallic Gold Theme */}
              <button
                type="button"
                onClick={() => setActiveSubModal('branding')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-amber-50/50 transition-colors text-left cursor-pointer bg-gradient-to-r from-amber-50/20 via-transparent to-transparent"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs border"
                    style={{ 
                      backgroundColor: `${goldAccentColor}20`,
                      borderColor: `${goldAccentColor}60`,
                      color: goldAccentColor
                    }}
                  >
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>ብሕታዊ ቅዲን ሕብርን (Custom Branding)</span>
                      <span 
                        className="text-[9px] font-black px-1.5 py-0.2 rounded uppercase"
                        style={{ 
                          backgroundColor: goldAccentColor,
                          color: '#0F172A'
                        }}
                      >
                        {branding.goldIntensity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Metallic Gold Intensity & UI Theme Hue
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* Item 3: Notifications Switch */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      መተሓሳሰቢ (Notifications)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Alerts & Updates
                    </div>
                  </div>
                </div>

                {/* Toggle switch matching screenshot */}
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    notificationsEnabled ? 'bg-blue-600 justify-end' : 'bg-stone-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-5 h-5 rounded-full shadow-md" />
                </button>
              </div>

              {/* Item 3: Admin & Operations Management Suite */}
              {onOpenManagement && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenManagement('users');
                  }}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-amber-50/60 transition-colors text-left cursor-pointer bg-gradient-to-r from-amber-50/30 to-transparent"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>ምሕደራ (Management Suite)</span>
                        <span className="text-[9px] bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded">ADMIN</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        User, Payment & Customer Management
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              )}

              {/* Item 4: Storage Manager */}
              <button
                type="button"
                onClick={() => setActiveSubModal('storage')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ዕቋርን ኣሴትን (Asset & Storage)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Local Cache: {totalReclaimableKb} KB
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* Item 5: Security Center */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenSecurityModal) onOpenSecurityModal();
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ደሕንነትን ቫልትን (Security Center)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      PIN, Biometrics & Panic Wipe
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* Item 6: Tigrinya Audio Greeting & Mic Tester */}
              {onPlayWelcomeAudio && (
                <button
                  type="button"
                  onClick={() => {
                    onPlayWelcomeAudio();
                    showToast('🔊 Tigrinya Audio Greeting Activated');
                  }}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-amber-50/60 transition-colors text-left cursor-pointer bg-amber-50/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/30 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300/60 shadow-xs">
                      <Volume2 className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>ናይ እንቋዕ መጻእኹም ድምጺ (Audio Greeting)</span>
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono">TIGRINYA</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Synthesized Tigrinya Greeting & Mic Audio Check
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-700 text-xs font-bold">
                    <span>ስምዕ</span>
                    <ChevronRight className="w-4 h-4 text-amber-600" />
                  </div>
                </button>
              )}

            </div>
          </div>

          {/* Section 2: SUPPORT & MORE (Screenshot 1) */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              ሓገዝን ካልእን (SUPPORT & MORE)
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
              
              {/* 1. Share App */}
              <button
                type="button"
                onClick={handleShareApp}
                className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ኣካፍል (Share App)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Invite friends & family
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* 2. Rate Us */}
              <button
                type="button"
                onClick={() => setActiveSubModal('rate')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ገምግም (Rate Us)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Leave a review on the store
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* 3. Support & FAQ */}
              <button
                type="button"
                onClick={() => setActiveSubModal('faq')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ሓገዝ (Support & FAQ)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Get help with the app
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* 4. Privacy Policy */}
              <button
                type="button"
                onClick={() => setActiveSubModal('privacy')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ፖሊሲ ብሕትውና (Privacy Policy)
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* 5. Terms of Service */}
              <button
                type="button"
                onClick={() => setActiveSubModal('terms')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ውዕል ኣገልግሎት (Terms of Service)
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

            </div>
          </div>

        </div>

        {/* Bottom Actions: Log in/Log out button & Version text (Screenshot 1) */}
        <div className="pt-4 space-y-4">
          <button
            type="button"
            onClick={async () => {
              if (!user.isLoggedIn && onOpenAuthModal) {
                onClose();
                onOpenAuthModal('login');
              } else {
                await logoutFromFirebase();
                onUpdateUser({ 
                  isLoggedIn: false,
                  id: 'usr_guest_001',
                  name: 'ጋሻ (Guest User)',
                  email: 'guest@axumite.ai',
                  role: 'Guest'
                });
                showToast('Signed out of Firebase Session');
              }
            }}
            className="w-full py-3.5 px-4 bg-white hover:bg-blue-50 border border-blue-200 text-blue-600 font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-[0.98]"
          >
            {user.isLoggedIn ? (
              <>
                <LogOut className="w-4 h-4" />
                <span>ውጻእ (Log Out)</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>እቶ / ተመዝገብ (Log In)</span>
              </>
            )}
          </button>

          <div className="text-center text-[11px] text-stone-400 font-mono">
            ኣክሱማይት AI v1.0.0
          </div>
        </div>

      </div>

      {/* ================= SUB MODAL DIALOGS ================= */}
      {activeSubModal !== 'none' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl relative text-slate-800 animate-slide-up"
          >
            <button
              onClick={() => setActiveSubModal('none')}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sub-Modal 0: Custom Branding & Metallic Gold */}
            {activeSubModal === 'branding' && (
              <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                <div className="flex items-center space-x-2 text-slate-900 font-black text-lg font-serif">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: goldAccentColor, color: '#0F172A' }}
                  >
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      ብሕታዊ ቅዲን ሕብርን (Custom Branding)
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans font-medium">
                      Personalize Metallic Gold Intensity & UI Theme Hue
                    </p>
                  </div>
                </div>

                {/* 1. Metallic Gold Accent Intensity */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>ጽዓት ወርቂ (Metallic Gold Intensity)</span>
                    </label>
                    <span 
                      className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ backgroundColor: `${goldAccentColor}30`, color: '#92400E' }}
                    >
                      {branding.goldIntensity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(['soft', 'balanced', 'rich', 'pure-axum'] as GoldIntensity[]).map((intensity) => {
                      const isSelected = branding.goldIntensity === intensity;
                      const pal = GOLD_PALETTE[intensity];
                      const labels: Record<GoldIntensity, { ti: string; en: string; desc: string }> = {
                        soft: { ti: 'ልዙብ (Soft Sheen)', en: '60% Champagne', desc: 'Subtle metallic luster' },
                        balanced: { ti: 'ሚዛናዊ (Balanced)', en: '100% 24K Royal', desc: 'Standard sovereign gold' },
                        rich: { ti: 'ደማቕ (Rich Glow)', en: '140% Radiance', desc: 'Vibrant Imperial gold' },
                        'pure-axum': { ti: 'ንጹህ ኣክሱም (Pure Axum)', en: '180% Ultra Gold', desc: 'High intensity metallic' },
                      };

                      return (
                        <button
                          key={intensity}
                          type="button"
                          onClick={() => {
                            setGoldIntensity(intensity);
                            showToast(`Gold Intensity: ${intensity.toUpperCase()}`);
                          }}
                          className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                            isSelected 
                              ? 'border-amber-400 shadow-md ring-2 ring-amber-400/40 bg-amber-50/60' 
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div 
                              className="w-5 h-5 rounded-full shadow-inner border border-white"
                              style={{ 
                                backgroundColor: pal.primary, 
                                boxShadow: `0 0 10px ${pal.glow}` 
                              }}
                            />
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-amber-600 font-black" />
                            )}
                          </div>
                          <div className="text-[11px] font-black text-slate-900 leading-tight">
                            {labels[intensity].ti}
                          </div>
                          <div className="text-[9px] text-slate-500 font-medium">
                            {labels[intensity].en}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. UI Theme Hue Selector */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      <span>ቀንዲ ሕብሪ መንገዲ (UI Theme Hue)</span>
                    </label>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {branding.themeHue}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Object.keys(THEME_HUE_PALETTE) as ThemeHue[]).map((hueKey) => {
                      const hue = THEME_HUE_PALETTE[hueKey];
                      const isSelected = branding.themeHue === hueKey;

                      return (
                        <button
                          key={hueKey}
                          type="button"
                          onClick={() => {
                            setThemeHue(hueKey);
                            showToast(`Theme Hue: ${hue.nameEn}`);
                          }}
                          className={`p-2.5 rounded-2xl border text-left transition-all flex items-center space-x-3 cursor-pointer ${
                            isSelected 
                              ? 'border-blue-500 shadow-md ring-2 ring-blue-500/30 bg-blue-50/40' 
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-xl shadow-xs shrink-0 flex items-center justify-center text-white text-[10px] font-black"
                            style={{ backgroundColor: hue.primary }}
                          >
                            {isSelected ? '✓' : ''}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {hue.nameTi}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {hue.nameEn}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Toggles & Visual FX */}
                <div className="space-y-2 pt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        ናይ ወርቂ ብልጭታ (Metallic Shimmer Effect)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Dynamic animated metallic reflection on cards
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGoldShimmerEffect(!branding.goldShimmerEffect)}
                      className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        branding.goldShimmerEffect ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="bg-white w-4.5 h-4.5 rounded-full shadow-sm" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        ብሩህ ደረት (Border Accent Glow)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Subtle radiant borders for sovereign components
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBorderGlow(!branding.borderGlow)}
                      className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        branding.borderGlow ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="bg-white w-4.5 h-4.5 rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>

                {/* 4. Live Branded Component Preview */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ቀጥታዊ ናይ ምርኢት መርኣያ (Live Preview)
                  </div>
                  <div 
                    className="p-4 rounded-2xl text-white space-y-3 relative overflow-hidden shadow-lg"
                    style={{ backgroundColor: themeHueColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: goldAccentColor }}
                        />
                        <span className="text-xs font-black tracking-wide font-serif">
                          AXUMITE SOVEREIGN AI
                        </span>
                      </div>
                      <span 
                        className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                        style={{ backgroundColor: goldAccentColor, color: '#0F172A' }}
                      >
                        {branding.goldIntensity} Gold
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-light leading-relaxed">
                      እዚ ሕብሪ እዚ ኣብ መላእ ፕላትፎርም፡ ቻት፡ ትርጉምን ባጆችን ብቐጻልነት ክትግበር እዩ።
                    </p>

                    <button
                      type="button"
                      className="w-full py-2 px-3 rounded-xl font-black text-xs shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                      style={{ 
                        backgroundColor: goldAccentColor, 
                        color: '#0F172A',
                        boxShadow: `0 4px 14px ${goldAccentColor}40`
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ምሳሌያዊ ወርቃዊ ባተን (Sample Button)</span>
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetToDefaultBranding();
                      showToast('Reset to Axumite Royal Standard');
                    }}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ናብ ቀደሙ ምለስ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('✨ Custom Branding Saved Globally!');
                      setActiveSubModal('none');
                    }}
                    className="flex-1 py-2.5 px-4 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                    style={{ 
                      backgroundColor: goldAccentColor, 
                      color: '#0F172A' 
                    }}
                  >
                    <Check className="w-4 h-4" />
                    <span>ኣጽድቕን ዕጾን (Save & Close)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Sub-Modal 1: Storage Manager */}
            {activeSubModal === 'storage' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-amber-600 font-black text-lg font-serif">
                  <HardDrive className="w-5 h-5" />
                  <span>ዕቋርን ኣሴትን (Storage Manager)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="text-stone-400 text-[10px]">Chat Cache</div>
                    <div className="font-bold text-slate-800">{chatCacheSizeKb} KB</div>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="text-stone-400 text-[10px]">Vision History</div>
                    <div className="font-bold text-slate-800">{visionCacheSizeKb} KB</div>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="text-stone-400 text-[10px]">Bookmarks</div>
                    <div className="font-bold text-slate-800">{savedInsightsSizeKb} KB</div>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="text-stone-400 text-[10px]">Temporary Data</div>
                    <div className="font-bold text-slate-800">{dependentDataSizeKb} KB</div>
                  </div>
                </div>

                <button
                  onClick={handleClearAllStorage}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ዕቋር ብምሉእ ኣጽሪ ({totalReclaimableKb} KB)</span>
                </button>
              </div>
            )}

            {/* Sub-Modal 2: Privacy Policy */}
            {activeSubModal === 'privacy' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-black text-lg font-serif">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>ፖሊሲ ብሕትውና (Privacy Policy)</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed max-h-60 overflow-y-auto pr-1">
                  AXUMITE AI App values your privacy above all. User chat transcripts, voice audio, and image prompts are processed through secured neural models and encrypted locally on your device. We do not sell your personal data or speech recordings. For your security, active sessions are protected with a 30-minute inactivity auto-logout shield to prevent unauthorized device access.
                </p>
                <button
                  onClick={() => setActiveSubModal('none')}
                  className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
                >
                  ተረዲአዮ (Understood)
                </button>
              </div>
            )}

            {/* Sub-Modal 3: Terms of Service */}
            {activeSubModal === 'terms' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-black text-lg font-serif">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span>ውዕል ኣገልግሎት (Terms of Service)</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed max-h-60 overflow-y-auto pr-1">
                  By using the ኣክሱማይት AI platform, you agree to utilize natural language translation, conversational intelligence, and multimodal generative tools responsibly and in compliance with international digital ethics.
                </p>
                <button
                  onClick={() => setActiveSubModal('none')}
                  className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
                >
                  ተረዲአዮ (Accept & Close)
                </button>
              </div>
            )}

            {/* Sub-Modal 4: Rate Us */}
            {activeSubModal === 'rate' && (
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 mx-auto flex items-center justify-center">
                  <Star className="w-6 h-6 fill-pink-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  ገምግም (Rate Us 5 Stars)
                </h3>
                <p className="text-xs text-stone-500">
                  ነዚ ኣፕ ብምግምጋም ንዕቤት ቋንቋ ትግርኛን ባህልናን ኣብ ዲጂታል ዓለም ደግፉ!
                </p>
                <div className="flex justify-center space-x-2 py-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        showToast(`Thanks for the ${s}-star rating!`);
                        setActiveSubModal('none');
                      }}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star className="w-7 h-7 fill-amber-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Modal 5: Support & FAQ */}
            {activeSubModal === 'faq' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sky-600 font-black text-lg font-serif">
                  <HelpCircle className="w-5 h-5" />
                  <span>ሓገዝ (Support & FAQ)</span>
                </div>
                <div className="text-xs text-stone-600 space-y-2 max-h-60 overflow-y-auto">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="font-bold text-slate-900">ብድምጺ ከመይ ገይረ ይዛረብ?</div>
                    <div className="text-stone-500 mt-0.5">ኣብ Obelisk Chat ወይ Live Pro ቀጥታዊ ናይ ማይክራፎን ምልክት ጠውቑ።</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="font-bold text-slate-900">ብዘይ ኢንተርነት ይሰርሕ ድዩ?</div>
                    <div className="text-stone-500 mt-0.5">እወ! ዝተዓቀበ ታሪክን መዝገበ ቃላትን ብዘይ ኢንተርነት (Offline) ይሰርሕ።</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubModal('none')}
                  className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
                >
                  ዕጾ (Close)
                </button>
              </div>
            )}

            {/* Sub-Modal 6: Contribute */}
            {activeSubModal === 'contribute' && (
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  ኣበርክቶኹም ንፕሮጀክትና
                </h3>
                <p className="text-xs text-stone-600">
                  ንቐጻሊ ምዕባለ ቋንቋ ትግርኛን ቴክኖሎጂን ዝውዕል ደገፍ ንምግባር፡ ናይ ቴሌግራም ወይ ቀጥታዊ ኣበርክቶ መንገዲ ተጠቐሙ።
                </p>
                <button
                  onClick={() => {
                    showToast('Thank you for supporting our project!');
                    setActiveSubModal('none');
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs"
                >
                  ደገፍ ኣበርክት (Contribute)
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
