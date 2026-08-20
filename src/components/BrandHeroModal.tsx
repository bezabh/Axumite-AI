import React, { useState } from 'react';
import { Sparkles, Copy, Check, Crown, Shield, Cpu, ChevronRight, X } from 'lucide-react';

interface BrandHeroModalProps {
  logoSrc: string;
  onClose: () => void;
}

export const BrandHeroModal: React.FC<BrandHeroModalProps> = ({ logoSrc, onClose }) => {
  const [copied, setCopied] = useState(false);

  const exactUserPrompt = `Design a luxury, minimalist, globally recognizable logo for an AI application named AXUMITE AI. The logo should combine ancient Axumite heritage with cutting-edge artificial intelligence in a timeless, iconic design.

The main symbol should be inspired by the Axum Obelisk (Stela of Axum), redesigned into a modern geometric emblem with subtle AI circuit patterns engraved into the stone. The symbol must look premium, elegant, and instantly recognizable as an app icon.

Use a black matte background with metallic gold materials, soft reflections, realistic 3D bevels, cinematic lighting, and subtle glowing highlights. The design should feel as luxurious as brands like Apple, Rolex, or Lamborghini while remaining clean and minimal.

Place the emblem inside a thin circular gold ring with balanced proportions. Avoid unnecessary decorations, clutter, or busy backgrounds.

Below the emblem, display the brand name:

AXUMITE AI

in a custom luxury serif or geometric font with metallic gold lettering.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(exactUserPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0D0C0E] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 glow-gold-lg my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#18161D] text-slate-400 hover:text-amber-300 border border-[#2D2820] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Emblem Showcase */}
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-2xl glow-gold-lg">
            <img
              src={logoSrc}
              alt="AXUMITE AI Emblem"
              className="w-full h-full rounded-full object-cover bg-black"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center justify-center space-x-2">
              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-widest text-gold-gradient">
                AXUMITE AI
              </h2>
            </div>
            <p className="text-xs text-amber-300 font-medium tracking-widest uppercase mt-1">
              THE HERITAGE OF AKSUM × FUTURE ARTIFICIAL INTELLIGENCE
            </p>
          </div>

        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="bg-[#141217] p-3.5 rounded-2xl border border-[#2A241C] space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <Crown className="w-4 h-4" />
              <span>LUXURY AESTHETIC</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Black matte backdrop, metallic gold bevels, and cinematic lighting inspired by luxury watchmakers and haute design.
            </p>
          </div>

          <div className="bg-[#141217] p-3.5 rounded-2xl border border-[#2A241C] space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>STELA GEOMETRY</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Monolithic architectural symmetry of the Great Obelisk of Axum, integrated with etched AI circuitry.
            </p>
          </div>

          <div className="bg-[#141217] p-3.5 rounded-2xl border border-[#2A241C] space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <Cpu className="w-4 h-4" />
              <span>GEMINI 3 REASONING</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Full-stack server-side intelligence powering deep reasoning, multimodal vision, and Ge'ez translation.
            </p>
          </div>
        </div>

        {/* Prompt Showcase Card */}
        <div className="bg-[#131216] border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL MASTER LOGO PROMPT</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Prompt' : 'Copy Master Prompt'}</span>
            </button>
          </div>

          <div className="bg-[#0B0B0C] p-3.5 rounded-xl border border-[#27231B] text-xs text-slate-300 font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
            {exactUserPrompt}
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <span>Enter AXUMITE AI Platform</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
