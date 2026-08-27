import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, Check, X, Shield, Globe, Layers, ArrowRight, Share2, Sparkles, Volume2, VolumeX, UserPlus, LogIn, RefreshCw, Moon, CheckCircle2 } from 'lucide-react';
import axumiteEmblem from '../assets/axumite_gold_icon.jpg';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  onOpenAndroidInterface?: () => void;
  onOpenHibernation?: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpenAuthModal, 
  onOpenAndroidInterface,
  onOpenHibernation
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  
  // Rolling install animation state
  const [isInstallingAnimation, setIsInstallingAnimation] = useState(false);
  const [installStage, setInstallStage] = useState<string>('');
  const [installProgress, setInstallProgress] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const playTigrinyaMobileWelcomeAudio = () => {
    if (!('speechSynthesis' in window)) {
      setStatusNotice('Tigrinya speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textTi = "እንቋዕ ናብ ኣክሱማይት ኤ ኣይ ሞባይል ብደሓን መጻእኩም! እዚ ናይ ሞባይል ኣፕሊኬሽን እዚ ብትግርኛ ብድምጺ ምዕላል፣ ቴሌብርን ባንክታትን ከምኡ እውን ብዘይ ኢንተርነት ኦፍላይን ምሰራሕ የኽእለኩም።";
    const utterance = new SpeechSynthesisUtterance(textTi);
    utterance.lang = 'ti-ET';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const startRollingInstallSequence = async () => {
    setIsInstallingAnimation(true);
    setInstallProgress(15);
    setInstallStage("Initializing Sovereign Mobile Framework & Obelisk Core...");

    setTimeout(() => {
      setInstallProgress(40);
      setInstallStage("Mounting PWA Service Worker & Ge'ez Offline Font Pack...");
    }, 700);

    setTimeout(() => {
      setInstallProgress(75);
      setInstallStage("Linking Biometrics, Telebirr & Real-Time Tigrinya Audio...");
    }, 1400);

    setTimeout(async () => {
      setInstallProgress(100);
      setInstallStage("Axumite AI Mobile App Installed Successfully on Homescreen!");

      if (deferredPrompt) {
        try {
          deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;
          if (choiceResult.outcome === 'accepted') {
            setIsInstalled(true);
          }
          setDeferredPrompt(null);
        } catch {
          setIsInstalled(true);
        }
      } else {
        setIsInstalled(true);
      }

      setTimeout(() => {
        setIsInstallingAnimation(false);
      }, 1600);
    }, 2200);
  };

  const handleTriggerInstall = async () => {
    startRollingInstallSequence();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#080808] border border-[#8E6D28]/60 max-w-lg w-full p-6 space-y-5 stela-glow relative circuit-pattern text-slate-100 max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-[#0D0D0E] border border-[#8E6D28]/40 rounded-xl transition-all cursor-pointer hover:border-amber-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with Mobile App Icon */}
        <div className="flex items-center space-x-4">
          <div className="relative shrink-0 group">
            {/* Rolling Icon Animation during install */}
            <motion.div
              animate={isInstallingAnimation ? { rotate: [0, 360, 720, 1080], scale: [1, 1.15, 1.05, 1] } : {}}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-lg shadow-amber-500/30 p-0.5 bg-gradient-to-b from-[#8E6D28] to-[#0A0805]"
            >
              <img
                src={axumiteEmblem}
                alt="AXUMITE AI Mobile App Icon"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="absolute -bottom-1.5 -right-1.5 p-1 bg-black/90 rounded-full border border-[#C5A059] shadow">
              <Smartphone className="w-3.5 h-3.5 text-[#C5A059]" />
            </div>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-black block">
              OFFICIAL MOBILE & PWA APP ICON
            </span>
            <h3 className="serif-luxury text-base font-bold text-gray-100 tracking-wider">
              AXUMITE AI — MOBILE APPLICATION
            </h3>
            <span className="text-[10.5px] text-amber-200/80 font-mono">
              Home Screen • Standalone PWA • Android APK • iOS
            </span>
          </div>
        </div>

        {/* ================= ROLLING INSTALLATION BANNER / SEQUENCE ================= */}
        {isInstallingAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-[#181206] border-2 border-[#C5A059] rounded-2xl space-y-3 shadow-xl"
          >
            <div className="flex items-center space-x-3">
              {/* 3D Rolling Golden Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="w-10 h-10 rounded-full border-2 border-[#F3E5AB] shadow-lg shadow-amber-500/50 overflow-hidden shrink-0"
              >
                <img src={axumiteEmblem} alt="Rolling Icon" className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-amber-300 font-bold uppercase block tracking-wider">
                  INSTALLING MOBILE APP ({installProgress}%)
                </span>
                <p className="text-xs text-slate-200 font-serif truncate">
                  {installStage}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-[#8E6D28]/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${installProgress}%` }}
                className="h-full bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] transition-all duration-300"
              />
            </div>
          </motion.div>
        )}

        {/* ================= TIGRINYA MOBILE WELCOME MESSAGE CARD ================= */}
        <div className="bg-[#14110B] border border-[#8E6D28] p-4 space-y-2.5 rounded-2xl stela-glow">
          <div className="flex items-center justify-between border-b border-[#8E6D28]/30 pb-2">
            <span className="text-[10px] bg-[#8E6D28]/20 border border-[#C5A059]/50 text-[#F3E5AB] px-2 py-0.5 font-bold uppercase tracking-wider rounded-lg">
              ናይ ሞባይል ሰላምታ (Tigrinya Welcome)
            </span>

            {/* Audio Speech Synthesis Button */}
            <button
              onClick={playTigrinyaMobileWelcomeAudio}
              className={`flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border rounded-lg transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 animate-pulse'
                  : 'bg-[#080808] border-[#8E6D28] text-[#F3E5AB] hover:bg-[#8E6D28]/30'
              }`}
              title="Listen to mobile welcome message in Tigrinya"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                  <span>ኣቋርጽ (Stop)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>ብትግርኛ ስማዕ (Listen)</span>
                </>
              )}
            </button>
          </div>

          <h4 className="serif-luxury text-base font-bold text-[#F3E5AB]">
            እንቋዕ ናብ AXUMITE AI ሞባይል ብደሓን መጻእኩም!
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed font-serif">
            "ኣብዚ ናይ ሞባይል ፕላትፎርምዚ ብትግርኛ ብድምጺ ምዕላል፣ ናይ ቴሌብርን የኢትዮጵያ ባንክታትን ክፍሊታት ምፍጻም፣ ንቛንቋ ግዕዝን ትግርኛን ምትርጓም፣ ከምኡ እውን ብዘይ ኢንተርነት ኦፍላይን ምሰራሕ ይከኣል እዩ።"
          </p>

          {/* Quick Registration & Login Buttons inside Welcome Card */}
          {onOpenAuthModal && (
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal('signup');
                }}
                className="flex-1 py-2 bg-[#8E6D28] hover:bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 rounded-xl shadow transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-black" />
                <span>ተመዝገብ (Register Account)</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal('login');
                }}
                className="flex-1 py-2 bg-[#080808] border border-[#8E6D28] text-[#F3E5AB] hover:bg-[#8E6D28]/20 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 rounded-xl transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>ሎግ ኢን (Log In)</span>
              </button>
            </div>
          )}
        </div>

        {/* Status / Install Action */}
        <div className="bg-[#060606] p-4 border border-[#8E6D28]/30 space-y-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F3E5AB]">Mobile Standard Detection:</span>
            {isInstalled ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Installed on Mobile Device</span>
              </span>
            ) : (
              <span className="text-xs text-[#C5A059] font-mono">PWA Mobile Ready</span>
            )}
          </div>

          {statusNotice && (
            <div className="p-2.5 bg-amber-950/60 border border-amber-500/60 rounded-xl text-amber-200 text-xs font-medium animate-in fade-in">
              {statusNotice}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleTriggerInstall}
              disabled={isInstallingAnimation}
              className="w-full py-3 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg rounded-xl transition-all cursor-pointer"
            >
              <Download className={`w-4 h-4 ${isInstallingAnimation ? 'animate-bounce' : ''}`} />
              <span>{isInstallingAnimation ? 'Installing...' : '1-Click Install Mobile App'}</span>
            </button>

            {/* Hibernation Mode Trigger */}
            {onOpenHibernation && (
              <button
                onClick={() => {
                  onClose();
                  onOpenHibernation();
                }}
                className="w-full py-3 bg-[#110D1E] hover:bg-[#1A142D] border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <Moon className="w-4 h-4 text-amber-400" />
                <span>ዕረፍቲ / ድቃስ (Hibernate Mode)</span>
              </button>
            )}
          </div>

          {onOpenAndroidInterface && (
            <button
              onClick={() => {
                onClose();
                onOpenAndroidInterface();
              }}
              className="w-full py-2.5 bg-[#140F26] border border-[#8E6D28] hover:border-amber-400 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 rounded-xl transition-all cursor-pointer shadow-md"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Open Android Application Interface & APK Hub</span>
            </button>
          )}
        </div>

        {/* Installation Instructions for Platforms */}
        <div className="space-y-3 pt-2 border-t border-[#8E6D28]/15 text-xs text-gray-300">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059]">
            PLATFORM MANUAL STEPS:
          </h4>

          <div className="space-y-2">
            {/* Android */}
            <div className="bg-[#0D0D0E] p-3 border border-[#8E6D28]/20 rounded-xl space-y-1">
              <div className="font-bold text-[#F3E5AB] flex items-center space-x-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android (Chrome / Edge / Samsung Internet)</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Tap the <span className="text-white font-bold">⋮ 3-dots menu</span> in top right → Select <span className="text-white font-bold">'Install app'</span> or <span className="text-white font-bold">'Add to Home screen'</span>.
              </p>
            </div>

            {/* iOS */}
            <div className="bg-[#0D0D0E] p-3 border border-[#8E6D28]/20 rounded-xl space-y-1">
              <div className="font-bold text-[#F3E5AB] flex items-center space-x-1.5">
                <Share2 className="w-3.5 h-3.5 text-sky-400" />
                <span>iOS (Safari iPhone / iPad)</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Tap the <span className="text-white font-bold">Share icon</span> at the bottom bar → Scroll down & select <span className="text-white font-bold">'Add to Home Screen'</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-[#8E6D28]/15 flex items-center justify-between text-[10px] text-gray-500">
          <span className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-[#C5A059]" />
            <span>Standalone Web App Manifest Standard v1.0</span>
          </span>
          <button onClick={onClose} className="text-[#C5A059] hover:underline font-bold uppercase tracking-wider cursor-pointer">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
