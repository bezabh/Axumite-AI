import React from 'react';
import { ShieldAlert, Sparkles, UserPlus, ArrowRight, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GuestLimitBannerProps {
  feature: 'chat' | 'vision' | 'translation' | 'tutor';
  remaining: number;
  max: number;
  onOpenUpgradeOrAuth: () => void;
}

export const GuestLimitBanner: React.FC<GuestLimitBannerProps> = ({
  feature,
  remaining,
  max,
  onOpenUpgradeOrAuth,
}) => {
  const { language } = useLanguage();

  const featureLabels = {
    chat: { ti: 'ናይ ዕላል ሕቶታት (AI Chat)', en: 'AI Chat Queries' },
    vision: { ti: 'ናይ ምስሊ ትንተና (Vision Analysis)', en: 'Vision Analysis' },
    translation: { ti: 'ናይ ቋንቋ ትርጉም (Translations)', en: 'Translations' },
    tutor: { ti: 'ናይ ትምህርቲ AI (Tutor Questions)', en: 'Tutor Questions' },
  };

  const isExhausted = remaining <= 0;

  return (
    <div className={`p-3 rounded-2xl border transition-all ${
      isExhausted
        ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
        : remaining <= 2
        ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
        : 'bg-[#121422] border-slate-700/60 text-slate-300'
    } shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 my-2`}>
      <div className="flex items-center space-x-2.5 min-w-0">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          isExhausted ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
        }`}>
          {isExhausted ? <Lock className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold flex items-center space-x-1.5 flex-wrap">
            <span className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold">
              GUEST MODE
            </span>
            <span>{featureLabels[feature][language === 'ti' ? 'ti' : 'en']}</span>
          </div>
          <p className="text-[11px] opacity-80 mt-0.5">
            {isExhausted
              ? (language === 'ti' 
                  ? `ናይ ጋሻ ናጻ ደረትኩም (${max}/${max}) ተወዲኡ እዩ። ምሉእ ዕድል ንምርካብ ተመዝገቡ ወይ እተዉ።`
                  : `Guest limit reached (${max}/${max}). Register or sign in for unlimited access.`)
              : (language === 'ti'
                  ? `ዝተረፈኩም ናይ ጋሻ ሕቶታት፡ ${remaining} ካብ ${max}`
                  : `Guest queries remaining: ${remaining} of ${max}`)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenUpgradeOrAuth}
        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer shadow-sm ${
          isExhausted
            ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
            : 'bg-gradient-to-r from-[#DCA83D] to-[#F3C65D] hover:brightness-110 text-black'
        }`}
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>{language === 'ti' ? 'ተመዝገብ / እቶ' : 'Sign Up / Login'}</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
