import React, { useState } from 'react';
import { PromptForgeResult, SavedItem } from '../types';
import { Wand2, Sparkles, Copy, Check, BookmarkPlus, Loader2, Layers, Cpu, Compass } from 'lucide-react';

interface PromptForgeProps {
  onSaveInsight: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  logoSrc: string;
}

export const PromptForge: React.FC<PromptForgeProps> = ({ onSaveInsight, logoSrc }) => {
  const [concept, setConcept] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('Midjourney v6');
  const [stylePreset, setStylePreset] = useState('Luxury Black & Gold 3D');
  const [result, setResult] = useState<PromptForgeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleForge = async (customConcept?: string) => {
    const activeConcept = customConcept || concept;
    if (!activeConcept.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/obelisk/prompt-forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: activeConcept,
          targetPlatform,
          stylePreset,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate prompt.');
      }

      setResult(data.promptData);
    } catch (err: any) {
      console.error('Prompt Forge error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: 'Axum Obelisk AI Emblem', concept: 'Luxury minimalist logo for AXUMITE AI with metallic gold obelisk geometry and subtle AI circuits on matte black background.' },
    { label: 'Futuristic Obsidian Palace', concept: 'An ultra-luxury architectural sanctuary inspired by ancient Aksumite stone masonry, glowing gold energy conduits, cinematic golden hour.' },
    { label: 'Cybernetic Queen Sheba', concept: 'A futuristic cybernetic portrait of Queen Sheba adorned with gold filigree armor, holographic Ge\'ez scripts, photorealistic 8K.' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Inputs */}
        <div className="space-y-4">
          
          <div className="bg-[#060606] border border-[#8E6D28]/20 p-5 space-y-4">
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-200 flex items-center justify-between">
                <span>Core Concept / Idea</span>
                <span className="text-[#C5A059]">Required</span>
              </label>
              <textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Describe your visual vision (e.g. A luxury gold and obsidian obelisk logo, futuristic AI crown, high-tech Axumite monolith)..."
                className="w-full bg-[#080808] border border-[#8E6D28]/30 focus:border-[#8E6D28] p-3 text-xs text-slate-100 placeholder-gray-500 focus:outline-none min-h-[90px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-300">Target Model</label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                  className="w-full bg-[#080808] border border-[#8E6D28]/30 text-gray-200 text-xs p-2.5 focus:outline-none"
                >
                  <option value="Midjourney v6">Midjourney v6</option>
                  <option value="Flux 1.1 Pro">Flux 1.1 Pro</option>
                  <option value="Sora Video AI">Sora Video AI</option>
                  <option value="Gemini Flash Image">Gemini Flash Image</option>
                  <option value="DALL-E 3">DALL-E 3</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-300">Style Aesthetic</label>
                <select
                  value={stylePreset}
                  onChange={(e) => setStylePreset(e.target.value)}
                  className="w-full bg-[#080808] border border-[#8E6D28]/30 text-gray-200 text-xs p-2.5 focus:outline-none"
                >
                  <option value="Luxury Black & Gold 3D">Luxury Black & Gold 3D</option>
                  <option value="Photorealistic Cinematic 8K">Photorealistic Cinematic 8K</option>
                  <option value="Ancient Axum Engraving">Ancient Axum Engraving</option>
                  <option value="Futuristic Cyberpunk Obsidian">Futuristic Cyberpunk Obsidian</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => handleForge()}
              disabled={!concept.trim() || isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] hover:brightness-110 disabled:opacity-40 text-black font-bold text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Forging Ultra-Detailed Prompt...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Forge Luxury Prompt</span>
                </>
              )}
            </button>

          </div>

          {/* Quick Concept Presets */}
          <div className="bg-[#080808] p-4 border border-[#8E6D28]/20 space-y-2">
            <span className="text-[10px] text-[#C5A059] font-bold tracking-[0.2em] uppercase">
              QUICK CONCEPTS:
            </span>
            <div className="space-y-1.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setConcept(p.concept);
                    handleForge(p.concept);
                  }}
                  className="w-full text-left p-2.5 bg-[#0D0D0E] hover:bg-[#15120C] border border-[#8E6D28]/20 hover:border-[#8E6D28] text-xs text-gray-300 transition-all flex items-center justify-between group"
                >
                  <span className="font-medium text-[#F3E5AB] group-hover:text-amber-200">
                    {p.label}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Output Card */}
        <div className="bg-[#060606] border border-[#8E6D28]/20 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#8E6D28]/15">
              <span className="serif-luxury text-xs font-bold text-[#C5A059] tracking-widest uppercase flex items-center space-x-1.5">
                <Compass className="w-4 h-4" />
                <span>FORGED PROMPT MATRIX</span>
              </span>

              {result && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(result.promptText)}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-[#0D0D0E] text-gray-300 hover:text-[#C5A059] border border-[#8E6D28]/30 text-[10px] uppercase tracking-wider transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Prompt' : 'Copy Prompt'}</span>
                  </button>

                  <button
                    onClick={() =>
                      onSaveInsight({
                        title: result.title || 'Forged AI Prompt',
                        type: 'prompt',
                        content: result.promptText,
                        tags: ['prompt-forge', targetPlatform],
                        metadata: result,
                      })
                    }
                    className="flex items-center space-x-1 px-2.5 py-1 bg-[#8E6D28]/15 text-[#F3E5AB] hover:bg-[#8E6D28]/30 border border-[#8E6D28]/40 text-[10px] uppercase tracking-wider transition-colors"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3 text-center">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
                <p className="text-xs text-gray-400 font-medium tracking-wide">
                  Crafting 3D lighting, material textures, and camera angles...
                </p>
              </div>
            ) : result ? (
              <div className="mt-4 space-y-4">
                
                <div>
                  <h3 className="serif-luxury text-sm font-bold text-[#F3E5AB]">
                    {result.title}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2 text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                    <span className="px-1.5 py-0.5 bg-[#8E6D28]/15 text-[#F3E5AB] border border-[#8E6D28]/30">
                      Aspect Ratio: {result.aspectRatioSuggestion}
                    </span>
                    <span>•</span>
                    <span>{targetPlatform}</span>
                  </div>
                </div>

                {/* Primary Prompt Text Box */}
                <div className="bg-[#0B0B0C] p-3.5 border border-[#8E6D28]/30 text-xs text-[#F3E5AB] font-mono leading-relaxed relative group stela-glow">
                  <p className="whitespace-pre-wrap">{result.promptText}</p>
                </div>

                {/* Negative Prompt */}
                <div className="bg-[#0A0A0B] p-3 border border-[#8E6D28]/20 text-[11px] text-gray-400 space-y-1">
                  <span className="font-bold text-rose-400 uppercase tracking-widest text-[9px]">
                    Negative Prompt (Elements to avoid):
                  </span>
                  <p>{result.negativePrompt}</p>
                </div>

                {/* Style Notes */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-300">
                    Style & Material Instructions:
                  </span>
                  <ul className="space-y-1 text-xs text-gray-400">
                    {result.styleNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-[#C5A059]">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {result.sampleTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#0D0D0E] text-gray-300 border border-[#8E6D28]/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-2 text-gray-500">
                <Wand2 className="w-10 h-10 stroke-[1.5] text-gray-600" />
                <p className="text-xs font-medium text-gray-400">
                  Enter your core idea on the left and click "Forge Luxury Prompt"
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
