import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ChevronRight, ChevronLeft, Check, Sparkles, X, Globe, MessageSquareText, BookOpen, Wifi, Smartphone, Award, Play, Square } from 'lucide-react';

interface TigrinyaOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
}

interface OnboardingStep {
  step: number;
  titleEn: string;
  titleTi: string;
  descEn: string;
  descTi: string;
  narrationTi: string;
  icon: React.ReactNode;
  highlightFeature: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    step: 1,
    titleEn: "Welcome to AXUMITE AI (ኣክሱማይት AI)",
    titleTi: "እንቋዕ ናብ AXUMITE AI ብደሓን መጻእኩም!",
    descEn: "Experience the premier Horn of Africa artificial intelligence platform, fusing ancient Axumite & Ge'ez cultural legacy with modern neural intelligence.",
    descTi: "እዚ ፕላትፎርምዚ ጥንታዊ ታሪክን ቅርጽን ኣክሱምን ግዕዝን ምስ ዘመናዊ ኣርቲፊሻል ኢንተለጀንስ ኣወሃሂዱ ዝሰርሕ ናይ መጀመሪያ ኣክሱማይት AI እዩ።",
    narrationTi: "እንቋዕ ናብ ኣክሱማይት ኤ ኣይ ብደሓን መጻእኩም! እዚ ፕላትፎርምዚ ጥንታዊ ታሪክን ባህልን ኤርትራን ግዕዝን ምስ ዘመናዊ ቴክኖሎጂ ኣወሃሂዱ ዝሰርሕ ፍሉይ ናይ ቋንቋ ትግርኛ ኢንተለጀንስ እዩ።",
    icon: <Sparkles className="w-6 h-6 text-[#C5A059]" />,
    highlightFeature: "Ancient Heritage & Modern Neural Intelligence",
  },
  {
    step: 2,
    titleEn: "Tigrinya Voice & Obelisk Chat",
    titleTi: "ብትግርኛ ብድምጽን ብጽሑፍን ምዕላል",
    descEn: "Speak naturally in Tigrinya (Eritrean dialect ti-ER or ti-ET). Speech synthesis converts AI responses into fluent Tigrinya audio.",
    descTi: "ብትግርኛ ብድምጽካ ተዛረብ፤ ኤ ኣይ ድማ ብትግርኛ መልሲ ይህበካ። መልሲ ብድምጺ ክትሰምዖን ርእይቶ ክትህበሉን ትኽእል።",
    narrationTi: "ኣብ Obelisk Chat ብትግርኛ ብድምጽካ ክትዛረብ ትኽእል እያ። Speech-to-text ብትክክል ይቕበሎ፣ AI ድማ ብትግርኛ ድምጺ ይምልሰልካ።",
    icon: <MessageSquareText className="w-6 h-6 text-[#C5A059]" />,
    highlightFeature: "Tigrinya Audio Synthesis & Voice Recognition",
  },
  {
    step: 3,
    titleEn: "Axumite Heritage Hub & Dictionary",
    titleTi: "ትግርኛ AI Hub ን መዝገበ ቃላትን",
    descEn: "Explore 100+ offline Tigrinya dictionary words, proverbs, grammar notes, and historical landmarks.",
    descTi: "መዝገበ ቃላት ትግርኛ፣ ባህላዊ ምሳሌታትን ታሪካዊ ቦታታትን ብዝርዝር ኣጽንዕ።",
    narrationTi: "ኣብ ትግርኛ AI Hub ናይ ትግርኛ መዝገበ ቃላት፣ ባህላዊ ምሳሌታትን ታሪካዊ ቦታታትን ብዝርዝር ክትረክብ ትኽእል።",
    icon: <BookOpen className="w-6 h-6 text-[#C5A059]" />,
    highlightFeature: "Interactive Dictionary & Landmark Heritage",
  },
  {
    step: 4,
    titleEn: "Offline Storage & Cache Resilience",
    titleTi: "ብዘይ ኢንተርነት ምሰራሕ (Offline System)",
    descEn: "Internet down? No problem! AXUMITE AI seamlessly transitions into offline mode using device local cache storage.",
    descTi: "ኢንተርነት ኣብ ዘይብሉ እዋን እውን ቢልኩም ክትሰርሑ ትኽእሉ። መዝገበ ቃላትን ዝተዓቀቡ ሓበሬታታትን ብዘይ ኢንተርነት ይሰርሑ።",
    narrationTi: "ኢንተርነት ኣብ ዘይብሉ እዋን እውን ፕላትፎርም ብዘይ ጸገም ብዘይ ኢንተርነት ኦፍላይን ይሰርሕ። ዝተዓቀበ ታሪክካ ኣብ ውሽጢ ተለፎንካ ይዕቀብ።",
    icon: <Wifi className="w-6 h-6 text-[#C5A059]" />,
    highlightFeature: "Offline Fallback & Cache Management",
  },
  {
    step: 5,
    titleEn: "Android App & Saved Insights",
    titleTi: "ናብ ሞባይል ምጽዓንን ሓበሬታ ምዕቃብን",
    descEn: "Install as a native Progressive Web App on your Android device for instant home-screen access.",
    descTi: "ብቀጥታ ኣብ ሞባይልካ (PWA App) ብምጽዓን ብቐሊሉ ተጠቀም። ብሉጻት ሓበሬታታት ድማ ኣብ Saved Insights ዓቅቦም።",
    narrationTi: "እዚ ፕላትፎርምዚ ናብ ኣንድሮይድ ተለፎንካ ብቀጥታ ከም ኣፕሊኬሽን ክትጽዕኖ ትኽእል እያ። የቐንየልና፤ ሕጂ ምጅማር ትኽእል!",
    icon: <Smartphone className="w-6 h-6 text-[#C5A059]" />,
    highlightFeature: "PWA Mobile Installation & Offline Vault",
  },
];

export const TigrinyaOnboardingModal: React.FC<TigrinyaOnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSynth, setSpeechSynth] = useState<SpeechSynthesisUtterance | null>(null);

  const activeStep = ONBOARDING_STEPS[currentStepIndex];

  // Stop audio when modal closes or step changes
  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    stopAudio();
  }, [currentStepIndex, isOpen]);

  if (!isOpen) return null;

  const playTigrinyaNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tigrinya speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeStep.narrationTi);
    utterance.lang = 'ti-ET';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setSpeechSynth(utterance);
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    stopAudio();
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    stopAudio();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    stopAudio();
    try {
      localStorage.setItem('axumite_onboarding_completed', 'true');
    } catch (e) {
      console.error('Failed to set onboarding completion state:', e);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#080808] border border-[#8E6D28] w-full max-w-xl p-6 sm:p-8 space-y-6 relative shadow-2xl overflow-hidden">
        
        {/* Top Gold Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8E6D28]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#8E6D28]/30 pb-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 border border-[#C5A059] bg-[#14110B] flex items-center justify-center stela-glow">
              {activeStep.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.2em] font-mono">
                Tigrinya Onboarding Guide &bull; Step {activeStep.step} of {ONBOARDING_STEPS.length}
              </span>
              <h2 className="serif-luxury text-lg font-bold text-slate-100 uppercase tracking-widest gold-gradient">
                {activeStep.titleEn}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="text-gray-400 hover:text-white p-1"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center space-x-2">
          {ONBOARDING_STEPS.map((s, idx) => (
            <div
              key={s.step}
              onClick={() => {
                stopAudio();
                setCurrentStepIndex(idx);
              }}
              className={`flex-1 h-1.5 cursor-pointer transition-all ${
                idx === currentStepIndex
                  ? 'bg-[#C5A059] stela-glow scale-y-125'
                  : idx < currentStepIndex
                  ? 'bg-[#8E6D28]'
                  : 'bg-[#181818]'
              }`}
              title={`Step ${s.step}: ${s.titleEn}`}
            />
          ))}
        </div>

        {/* Step Body Content */}
        <div className="space-y-4 relative z-10">
          
          {/* Tigrinya Main Title Card */}
          <div className="bg-[#14110B] border border-[#8E6D28]/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-[#8E6D28]/20 border border-[#C5A059]/40 text-[#F3E5AB] px-2 py-0.5 font-bold uppercase tracking-wider">
                መሪሕ ሓበሬታ (Tigrinya Instruction)
              </span>

              {/* Tigrinya Audio Narration Button */}
              <button
                onClick={playTigrinyaNarration}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 animate-pulse'
                    : 'bg-[#080808] border-[#8E6D28] text-[#F3E5AB] hover:bg-[#8E6D28]/30'
                }`}
                title="Listen to audio narration in Tigrinya"
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

            <h3 className="serif-luxury text-xl font-bold text-[#F3E5AB]">
              {activeStep.titleTi}
            </h3>

            <p className="text-sm text-slate-200 leading-relaxed font-serif">
              "{activeStep.descTi}"
            </p>
          </div>

          {/* English Explanatory Context */}
          <div className="bg-[#050505] p-3.5 border border-[#8E6D28]/20 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
              English Platform Summary:
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {activeStep.descEn}
            </p>
          </div>

          {/* Feature Highlight Pill */}
          <div className="flex items-center space-x-2 text-[11px] text-[#C5A059] font-mono bg-[#080808] p-2 border border-[#8E6D28]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
            <span>Capability: <strong>{activeStep.highlightFeature}</strong></span>
          </div>

        </div>

        {/* Modal Action Controls */}
        <div className="pt-4 border-t border-[#8E6D28]/30 flex items-center justify-between relative z-10">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-1 px-3.5 py-2 border border-[#8E6D28]/30 text-xs text-gray-400 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ተመለስ (Back)</span>
          </button>

          <div className="text-xs text-gray-400 font-mono">
            {currentStepIndex + 1} / {ONBOARDING_STEPS.length}
          </div>

          {currentStepIndex < ONBOARDING_STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-5 py-2 bg-[#14110B] border border-[#8E6D28] hover:bg-[#8E6D28] hover:text-black text-[#F3E5AB] text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>ቀጽል (Next)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-1.5 px-5 py-2 bg-[#8E6D28] text-black hover:bg-[#F3E5AB] text-xs font-bold uppercase tracking-widest transition-all stela-glow"
            >
              <Check className="w-4 h-4" />
              <span>ጀምር (Get Started)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
