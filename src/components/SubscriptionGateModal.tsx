import React from 'react';
import { X, Crown, Sparkles, Check, ArrowRight, ShieldCheck, Zap, Video, FileText, Cpu, Lock } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useLanguage } from '../context/LanguageContext';

interface SubscriptionGateModalProps {
  onOpenPricingPlans: () => void;
}

export const SubscriptionGateModal: React.FC<SubscriptionGateModalProps> = ({
  onOpenPricingPlans,
}) => {
  const { activePaywallFeature, closePaywall } = useSubscription();
  const { language } = useLanguage();

  if (!activePaywallFeature) return null;

  const handleUpgradeClick = () => {
    closePaywall();
    onOpenPricingPlans();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#14121E] via-[#0E0D17] to-[#0A0A0F] border border-[#C5A059]/50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white">
        
        {/* Glow Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -top-10 right-0 w-36 h-36 bg-fuchsia-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={closePaywall}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 relative z-10 text-center">
          
          {/* Lock / Crown Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/25 mb-5 ring-4 ring-amber-500/20 animate-pulse">
            <Crown className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
            PRO FEATURE • ፍሉይ ናይ ፕሮ መሳርሒ
          </span>

          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white leading-tight">
            {activePaywallFeature}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
            {language === 'ti'
              ? 'እዚ መሳርሒ ኣብ ልዑላዊ AI PRO ጥራይ ይርከብ። ናይ 14 መዓልቲ ናጻ ፈተነ (Free Trial) ብምጅማር ብቕጽበት ክፈትዎ።'
              : 'Unlock full access to high-throughput neural translation, video dubbing, 4K Ge\'ez calligraphy, and legal AI.'}
          </p>

          {/* Value Highlights */}
          <div className="bg-[#191826]/80 rounded-2xl p-4 my-5 border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center space-x-2.5 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'ti' ? 'ናይ 14 መዓልቲ ናጻ ፈተነ (14-Day Free Trial - $0 Today)' : '14-Day Free Trial ($0 Today, cancel anytime)'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'ti' ? 'ቀጥታዊ ናይ ቪድዮ ደቢንግን ሳብስክሪፕሽንን' : 'Full AI Video Translator & Neural Speech Dubbing'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'ti' ? 'ዘይውዳእ ናይ ቻት ቶከናት (Gemini 3.7 Pro Deep Reasoning)' : 'Unlimited Gemini 3.7 Pro Deep Reasoning Stream'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'ti' ? 'ብGoogle Play ወይ ክሬዲት ካርድ ውሑስ ክፍሊት' : 'Instant Activation via Google Play or Card'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleUpgradeClick}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#EAB308] to-[#D97706] hover:from-[#EAB308] hover:to-[#B45309] text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{language === 'ti' ? 'ናይ 14 መዓልቲ ፈተነ ጀምር ($0/Today)' : 'Start 14-Day Free Trial ($0 Today)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={closePaywall}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-medium"
            >
              {language === 'ti' ? 'ደሓር እግበረሉ (Maybe Later)' : 'Maybe Later'}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-2 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Encrypted with Google Play Billing & Server Entitlement</span>
          </div>

        </div>
      </div>
    </div>
  );
};
