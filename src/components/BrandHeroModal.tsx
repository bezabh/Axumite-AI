import React, { useState } from 'react';
import { Sparkles, Copy, Check, Crown, Shield, Cpu, ChevronRight, X } from 'lucide-react';
import { Axumite3DLogo } from './Axumite3DLogo';

interface BrandHeroModalProps {
  logoSrc: string;
  onClose: () => void;
}

export const BrandHeroModal: React.FC<BrandHeroModalProps> = ({ logoSrc, onClose }) => {
  const [copied, setCopied] = useState(false);

  const exactUserPrompt = `Design a luxury, minimalist, globally recognizable logo for an AI application named AXUMITE AI (ኣክሱማይት AI). The logo combines ancient Axumite heritage with cutting-edge artificial intelligence in a timeless, iconic design.

The main symbol features bold 3D extruded lettering for "ኣክሱማይት AI" with an iridescent chromatic gradient (electric indigo, royal violet, magenta pink, sunset coral, and amber gold) terminating in solid polished 24K yellow gold for "AI".

Centered below the lettering sits a minimalist circular gold ring medallion framing the monolithic Great Obelisk of Axum with stone steps. The dark obsidian floor below casts soft glossy studio reflections.`;

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
          className="absolute top-4 right-4 p-2 rounded-full bg-[#18161D] text-slate-400 hover:text-amber-300 border border-[#2D2820] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Emblem Showcase */}
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          
          <div className="w-full py-4 flex flex-col items-center justify-center bg-gradient-to-b from-[#14101A] to-[#0A090E] rounded-2xl border border-amber-500/30 p-4">
            <Axumite3DLogo 
              size="md" 
              showObeliskMedallion={true} 
              showReflection={true} 
              showSubtitle={true} 
            />
          </div>

        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="bg-[#141217] p-3.5 rounded-2xl border border-[#2A241C] space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <Crown className="w-4 h-4" />
              <span>3D CHROMATIC LUXURY</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Vibrant violet-to-amber 3D extruded lettering paired with polished 24K solid gold beveled AI typography.
            </p>
          </div>

          <div className="bg-[#141217] p-3.5 rounded-2xl border border-[#2A241C] space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>GREAT OBELISK CREST</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Monolithic architectural symmetry of the Great Obelisk of Axum framed within a golden medallion ring.
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
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
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
