import React, { useState, useEffect } from 'react';
import { SavedItem, UserProfile } from '../types';
import { Upload, Eye, Sparkles, Image as ImageIcon, Loader2, BookmarkPlus, Copy, Check, FileSearch } from 'lucide-react';
import { checkGuestLimit, incrementGuestUsage } from '../utils/guestManager';
import { GuestLimitBanner } from './GuestLimitBanner';

interface VisionStudioProps {
  onSaveInsight: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  user?: UserProfile;
  onOpenAuthModal?: (mode?: 'login' | 'signup' | 'otp') => void;
}

export const VisionStudio: React.FC<VisionStudioProps> = ({ 
  onSaveInsight, 
  user,
  onOpenAuthModal 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [guestLimitState, setGuestLimitState] = useState(() =>
    checkGuestLimit('vision', user?.email, user?.role)
  );

  useEffect(() => {
    setGuestLimitState(checkGuestLimit('vision', user?.email, user?.role));
  }, [user]);

  // Preset sample historical artifacts for instant test drive
  const sampleArtifacts = [
    {
      name: 'Obelisk of Axum (Stela)',
      url: 'https://images.unsplash.com/photo-1548625361-182390f05f7c?auto=format&fit=crop&w=800&q=80',
      description: 'Granite monolithic obelisk constructed in the 4th century CE.'
    },
    {
      name: 'Ancient Ge\'ez Inscription',
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      description: 'Historical royal inscription etched into stone slab.'
    },
    {
      name: 'Axumite Gold Coinage',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient royal gold currency featuring wheat stalks and crescent.'
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isLoading) return;

    // Check guest limit
    const currentLimit = checkGuestLimit('vision', user?.email, user?.role);
    if (!currentLimit.allowed) {
      setGuestLimitState(currentLimit);
      setAnalysis(`⚠️ **Guest Vision Limit Reached** (${currentLimit.max}/${currentLimit.max})\n\nከም ጋሻ መጠን ዝተፈቕደልኩም ናይ ምስሊ ትንተና ደረት ተወዲኡ እዩ። ብዘይ ደረት ምስልታት ንምምርማር ተመዝገቡ ወይ እተዉ።`);
      return;
    }

    incrementGuestUsage('vision', user?.email, user?.role);
    setGuestLimitState(checkGuestLimit('vision', user?.email, user?.role));

    setIsLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch('/api/obelisk/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          prompt: prompt || 'ብትግርኛ ቋንቋ ብዛዕባ እዚ ስእሊ ወይ ቅርሲ ብዝርዝር ተንቲንካ ግለጸለይ። ጽሑፋት፡ ታሪካዊ ቦታታት፡ ሕብሪ፡ ቅርጽን ቅርሳዊ ትርጉሙን ብትግርኛ ኣብርሃለይ።',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze artifact.');
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      setAnalysis(`⚠️ **Vision Error**: ${err.message || 'Unable to inspect image artifact.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {user?.role === 'Guest' && (
        <GuestLimitBanner
          feature="vision"
          remaining={guestLimitState.remaining}
          max={guestLimitState.max}
          onOpenUpgradeOrAuth={() => {
            if (onOpenAuthModal) onOpenAuthModal('signup');
          }}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Image Upload & Preview */}
        <div className="space-y-4">
          
          {/* Main Dropzone / Image Container */}
          <div className="relative bg-[#060606] border border-dashed border-[#8E6D28]/30 hover:border-[#8E6D28] p-4 flex flex-col items-center justify-center min-h-[320px] transition-all overflow-hidden group">
            {selectedImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Artifact Preview"
                  className="max-h-[300px] w-auto border border-[#8E6D28]/30 object-contain shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => { setSelectedImage(null); setAnalysis(null); }}
                  className="absolute top-2 right-2 px-3 py-1 bg-black/80 hover:bg-black text-[#F3E5AB] text-[10px] font-semibold uppercase tracking-widest border border-[#8E6D28]/40 backdrop-blur-md"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center text-center p-6 space-y-3 w-full">
                <div className="p-4 bg-[#8E6D28]/10 border border-[#8E6D28]/30 text-[#C5A059] group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
                    Upload Artifact Image or Document
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    PNG, JPG, WEBP, or GIF up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Preset Sample Artifacts */}
          <div className="bg-[#080808] p-3.5 border border-[#8E6D28]/20 space-y-2">
            <span className="text-[10px] text-[#C5A059] font-bold tracking-[0.2em] uppercase">
              OR TEST WITH SAMPLE ARTIFACTS:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {sampleArtifacts.map((sa, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(sa.url);
                    setAnalysis(null);
                  }}
                  className="group relative h-20 overflow-hidden border border-[#8E6D28]/25 hover:border-[#8E6D28] transition-all text-left"
                >
                  <img
                    src={sa.url}
                    alt={sa.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-[#F3E5AB] truncate">
                      {sa.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Analysis Focus Prompt */}
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">
              Analysis Focus (Optional)
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Decipher script text, evaluate gold material purity, inspect architecture..."
              className="w-full bg-[#080808] border border-[#8E6D28]/30 focus:border-[#8E6D28] px-3.5 py-2 text-xs text-slate-100 placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] hover:brightness-110 disabled:opacity-40 text-black font-bold text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing Multimodal Vision Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Artifact with AXUMITE AI</span>
              </>
            )}
          </button>

        </div>

        {/* Right Column: Output Analysis Card */}
        <div className="bg-[#060606] border border-[#8E6D28]/20 p-5 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#8E6D28]/15">
            <div className="flex items-center space-x-2 text-[#C5A059] font-bold text-xs tracking-widest uppercase">
              <FileSearch className="w-4 h-4" />
              <span>VISUAL ANALYSIS REPORT</span>
            </div>

            {analysis && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-[#0D0D0E] text-gray-300 hover:text-[#C5A059] border border-[#8E6D28]/30 text-[10px] uppercase tracking-wider transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() =>
                    onSaveInsight({
                      title: 'Artifact Vision Report',
                      type: 'vision',
                      content: analysis,
                      tags: ['vision', 'artifact', 'multimodal'],
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

          <div className="mt-4 flex-1 overflow-y-auto max-h-[500px] text-xs text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
                <p className="text-xs text-[#F3E5AB] font-medium tracking-wide">
                  Scanning image pixels & historical feature vectors...
                </p>
              </div>
            ) : analysis ? (
              analysis
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-gray-500 py-12">
                <ImageIcon className="w-10 h-10 stroke-[1.5] text-gray-600" />
                <p className="text-xs font-medium text-gray-400">
                  Select or upload an image on the left to generate an Axumite Vision analysis report.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
