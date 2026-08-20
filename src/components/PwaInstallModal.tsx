import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, X, Shield, Globe, Layers, ArrowRight, Share2, Sparkles, Volume2, VolumeX, UserPlus, LogIn } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose, onOpenAuthModal }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
      alert('Tigrinya speech synthesis is not supported on this browser.');
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

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install on Android: Open in Chrome/Samsung Internet -> Tap 3 Dots Menu -> Select 'Install app' or 'Add to Home screen'!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#080808] border border-[#8E6D28]/40 max-w-lg w-full p-6 space-y-5 stela-glow relative circuit-pattern text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white bg-[#0D0D0E] border border-[#8E6D28]/30 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#8E6D28]/15 border border-[#8E6D28]/40 text-[#C5A059]">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold block">
              ANDROID & MOBILE PWA STANDARDS
            </span>
            <h3 className="serif-luxury text-sm font-bold text-gray-100 tracking-wider">
              MOBILE APP & TIGRINYA WELCOME
            </h3>
          </div>
        </div>

        {/* ================= TIGRINYA MOBILE WELCOME MESSAGE CARD ================= */}
        <div className="bg-[#14110B] border border-[#8E6D28] p-4 space-y-2.5 stela-glow">
          <div className="flex items-center justify-between border-b border-[#8E6D28]/30 pb-2">
            <span className="text-[10px] bg-[#8E6D28]/20 border border-[#C5A059]/50 text-[#F3E5AB] px-2 py-0.5 font-bold uppercase tracking-wider">
              ናይ ሞባይል ሰላምታ (Tigrinya Welcome)
            </span>

            {/* Audio Speech Synthesis Button */}
            <button
              onClick={playTigrinyaMobileWelcomeAudio}
              className={`flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border transition-all ${
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
          <p className="text-[11px] text-gray-400 font-sans italic">
            Welcome to AXUMITE AI Mobile! Access native Tigrinya voice assistance, Telebirr & Ethiopian bank integration, offline resilience, and fast authentication.
          </p>

          {/* Quick Registration & Login Buttons inside Welcome Card */}
          {onOpenAuthModal && (
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal('signup');
                }}
                className="flex-1 py-2 bg-[#8E6D28] hover:bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-black" />
                <span>ተመዝገብ (Register Account)</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal('login');
                }}
                className="flex-1 py-2 bg-[#080808] border border-[#8E6D28] text-[#F3E5AB] hover:bg-[#8E6D28]/20 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>ሎግ ኢን (Log In)</span>
              </button>
            </div>
          )}
        </div>

        {/* Status / Install Action */}
        <div className="bg-[#060606] p-4 border border-[#8E6D28]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F3E5AB]">Browser Standard Detection:</span>
            {isInstalled ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Installed on Device</span>
              </span>
            ) : (
              <span className="text-xs text-[#C5A059] font-mono">PWA Mobile Ready</span>
            )}
          </div>

          <button
            onClick={handleTriggerInstall}
            className="w-full py-3 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] hover:brightness-110 text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{deferredPrompt ? '1-Click Install Mobile App' : 'Install App / Add to Home Screen'}</span>
          </button>
        </div>

        {/* Installation Instructions for Platforms */}
        <div className="space-y-3 pt-2 border-t border-[#8E6D28]/15 text-xs text-gray-300">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059]">
            PLATFORM MANUAL STEPS:
          </h4>

          <div className="space-y-2">
            {/* Android */}
            <div className="bg-[#0D0D0E] p-3 border border-[#8E6D28]/20 space-y-1">
              <div className="font-bold text-[#F3E5AB] flex items-center space-x-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android (Chrome / Edge / Samsung Internet)</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Tap the <span className="text-white font-bold">⋮ 3-dots menu</span> in top right → Select <span className="text-white font-bold">'Install app'</span> or <span className="text-white font-bold">'Add to Home screen'</span>.
              </p>
            </div>

            {/* iOS */}
            <div className="bg-[#0D0D0E] p-3 border border-[#8E6D28]/20 space-y-1">
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
          <button onClick={onClose} className="text-[#C5A059] hover:underline font-bold uppercase tracking-wider">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
