import React, { useState, useEffect } from 'react';
import { 
  Quote, Share2, RefreshCw, Volume2, VolumeX, Bookmark, Check, 
  Sparkles, BookOpen, Info, Copy, ExternalLink, Download, ChevronDown, ChevronUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  AxumiteWisdomQuote, 
  AXUMITE_MANUSCRIPT_QUOTES, 
  getDailyWisdomQuote, 
  getRandomAxumiteQuote 
} from '../data/axumiteManuscriptQuotes';
import { SavedItem } from '../types';

interface DailyWisdomCardProps {
  onSaveInsight?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  className?: string;
}

export const DailyWisdomCard: React.FC<DailyWisdomCardProps> = ({
  onSaveInsight,
  className = '',
}) => {
  const { language } = useLanguage();
  const [quote, setQuote] = useState<AxumiteWisdomQuote>(() => getDailyWisdomQuote());
  const [isShuffling, setIsShuffling] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleNextRandomQuote = () => {
    setIsShuffling(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setTimeout(() => {
      const nextQuote = getRandomAxumiteQuote(quote.id);
      setQuote(nextQuote);
      setIsShuffling(false);
      setIsSaved(false);
      setShowContext(false);
    }, 250);
  };

  const formattedShareText = `📜 Axumite Daily Wisdom | ጥበብ ኣክሱም:\n\n« ${quote.geez} »\n\n🇪🇷 ትግርኛ: ${quote.tigrinya}\n🇬🇧 English: "${quote.english}"\n\n🏛️ ምንጪ (Source): ${quote.sourceEn} (${quote.centuryEn})\n🏷️ Theme: ${quote.themeEn}\n\n✨ Shared via Axumite AI`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Axumite Wisdom: ${quote.sourceEn}`,
          text: formattedShareText,
          url: window.location.href,
        });
        showToast(language === 'ti' ? 'ብዓወት ተኻፊሉ!' : 'Successfully shared!');
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Fallback to modal / clipboard
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopyText = (type: 'all' | 'geez' | 'translation') => {
    let textToCopy = formattedShareText;
    if (type === 'geez') {
      textToCopy = `« ${quote.geez} »\n— ${quote.source} (${quote.century})`;
    } else if (type === 'translation') {
      textToCopy = `"${quote.english}"\n— ${quote.sourceEn} (${quote.centuryEn})`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      showToast(language === 'ti' ? 'ናብ Clipboard ተቐዲሑ!' : 'Copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSaveToInsights = () => {
    if (onSaveInsight) {
      onSaveInsight({
        title: `${quote.source} — ${quote.theme}`,
        category: 'Ancient Axumite Manuscripts',
        type: 'text',
        content: `Ge'ez Script:\n${quote.geez}\n\nTigrinya:\n${quote.tigrinya}\n\nEnglish Translation:\n${quote.english}\n\nHistorical Context:\n${language === 'ti' ? quote.historicalContextTi : quote.historicalContextEn}`,
        tags: ['Axumite Wisdom', quote.themeEn, quote.centuryEn, 'Manuscript'],
      });
      setIsSaved(true);
      showToast(language === 'ti' ? 'ኣብ ዝተዓቀቡ ተቐሚጡ!' : 'Saved to your insights collection!');
    }
  };

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      showToast(language === 'ti' ? 'ድምጺ ኣብዚ መሳርሒ ኣይድገፍን' : 'Audio synthesis not supported on this browser');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = language === 'ti' 
      ? `${quote.tigrinya}. ምንጪ፡ ${quote.source}`
      : `${quote.english}. From the ${quote.sourceEn}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadCard = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 700;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background Parchment
      const gradient = ctx.createLinearGradient(0, 0, 1200, 700);
      gradient.addColorStop(0, '#1E1810');
      gradient.addColorStop(0.5, '#2D2214');
      gradient.addColorStop(1, '#1A1309');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 700);

      // Gold Border Frame
      ctx.strokeStyle = '#ECC665';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 640);

      ctx.strokeStyle = '#B38728';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 1120, 620);

      // Corner Harag knots
      ctx.fillStyle = '#ECC665';
      ctx.font = 'bold 20px serif';
      ctx.fillText('❖', 48, 56);
      ctx.fillText('❖', 1132, 56);
      ctx.fillText('❖', 48, 644);
      ctx.fillText('❖', 1132, 644);

      // Header Tag
      ctx.fillStyle = '#ECC665';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📜 ANCIENT AXUMITE MANUSCRIPT WISDOM', 600, 95);

      // Theme
      ctx.fillStyle = '#E5C07B';
      ctx.font = 'italic 20px serif';
      ctx.fillText(`— ${quote.themeEn} • ${quote.centuryEn} —`, 600, 135);

      // Ge'ez Quote
      ctx.fillStyle = '#FFF8E7';
      ctx.font = 'bold 30px "Noto Serif Ethiopic", serif';
      ctx.fillText(`« ${quote.geez} »`, 600, 240);

      // English Quote
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'italic 24px "Libre Baskerville", serif';
      ctx.fillText(`"${quote.english}"`, 600, 340);

      // Tigrinya
      ctx.fillStyle = '#FDE68A';
      ctx.font = '22px "Noto Sans Ethiopic", sans-serif';
      ctx.fillText(`ትግርኛ: ${quote.tigrinya}`, 600, 440);

      // Source Badge
      ctx.fillStyle = '#ECC665';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`🏛️ ${quote.sourceEn}`, 600, 530);

      // Watermark
      ctx.fillStyle = '#94A3B8';
      ctx.font = '16px sans-serif';
      ctx.fillText('AXUMITE AI • Sovereign Cultural Intelligence', 600, 610);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Axumite_Wisdom_${quote.id}.png`;
      link.href = dataUrl;
      link.click();
      showToast(language === 'ti' ? 'ስእላዊ ካርድ ተሰሪሑ ተወሪዱ!' : 'Wisdom card exported!');
    } catch (e) {
      showToast('Could not generate card download');
    }
  };

  return (
    <div className={`relative ${className}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 bg-[#0F2856] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-amber-400/40 flex items-center space-x-1.5 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Parchment Card Container */}
      <div className="rounded-3xl p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-[#1E1812] via-[#2A1F15] to-[#17110B] text-[#FFF8EB] border-2 border-amber-500/40 shadow-xl shadow-amber-950/20">
        
        {/* Subtle Illuminated Birana Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ECC665_1px,transparent_1px)] [background-size:16px_16px] opacity-8 pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* TOP HEADER ROW: Tag + Actions */}
        <div className="flex items-center justify-between gap-2 relative z-10 pb-2.5 border-b border-amber-500/20">
          
          {/* Badge & Title */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 flex items-center justify-center shadow-sm shrink-0">
              <div className="w-full h-full bg-[#1A1208] rounded-[10px] flex items-center justify-center text-amber-300">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-amber-300 font-mono">
                  {language === 'ti' ? 'ዕለታዊ ጥበብ ኣክሱም' : 'Daily Axumite Wisdom'}
                </h3>
                <span className="px-1.5 py-0.2 text-[8px] font-black uppercase bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded font-mono">
                  {language === 'ti' ? quote.century : quote.centuryEn}
                </span>
              </div>
              <p className="text-[10px] text-amber-200/80 font-medium truncate mt-0.5">
                {language === 'ti' ? quote.theme : quote.themeEn}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons: Shuffle + Share */}
          <div className="flex items-center space-x-1.5 shrink-0">
            
            {/* Audio Read Aloud */}
            <button
              type="button"
              onClick={handlePlayAudio}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                isPlayingAudio 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse' 
                  : 'bg-white/10 hover:bg-white/20 text-amber-200 border-amber-400/20'
              }`}
              title={isPlayingAudio ? 'Stop reading' : 'Read wisdom quote aloud'}
              aria-label="Audio readout"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Bookmark */}
            {onSaveInsight && (
              <button
                type="button"
                onClick={handleSaveToInsights}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                  isSaved 
                    ? 'bg-emerald-500 text-white border-emerald-400' 
                    : 'bg-white/10 hover:bg-white/20 text-amber-200 border-amber-400/20'
                }`}
                title="Save wisdom to insights"
                aria-label="Save to insights"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Randomize / Next Quote */}
            <button
              type="button"
              onClick={handleNextRandomQuote}
              disabled={isShuffling}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/20 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              title={language === 'ti' ? 'ካልእ ጥበብ ቀይር' : 'Discover another ancient quote'}
              aria-label="Randomize quote"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin text-amber-300' : ''}`} />
            </button>

            {/* PRIMARY SHARE BUTTON */}
            <button
              type="button"
              id="daily-wisdom-share-button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ECC665] via-[#D4A237] to-[#B37F1D] text-[#1A1206] font-bold text-xs flex items-center space-x-1 shadow-md shadow-amber-900/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer border border-amber-200/60"
              title={language === 'ti' ? 'ነዛ ጥበብ ኣካፍል' : 'Share this wisdom quote'}
              aria-label="Share Wisdom Quote"
            >
              <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{language === 'ti' ? 'ኣካፍል' : 'Share'}</span>
            </button>

          </div>
        </div>

        {/* QUOTE BODY */}
        <div className="my-3.5 relative z-10 space-y-2.5">
          
          {/* Ge'ez Script (Ancient Manuscript Calligraphy Font) */}
          <div className="relative pl-3.5 border-l-2 border-amber-400/60">
            <Quote className="w-4 h-4 text-amber-400/40 absolute -top-1 -left-2 fill-current" />
            <p className="font-birana-manuscript text-[14.5px] sm:text-base font-bold text-[#FFE6A5] leading-relaxed tracking-wide selection:bg-amber-500 selection:text-black">
              « {quote.geez} »
            </p>
          </div>

          {/* Tigrinya Translation */}
          <div className="text-[12px] sm:text-[12.5px] text-amber-100/90 font-medium leading-relaxed bg-black/25 rounded-xl p-2.5 border border-amber-400/15">
            <span className="font-bold text-amber-300 text-[10.5px] block font-mono uppercase tracking-wider mb-0.5">
              {language === 'ti' ? 'ትርጉም ትግርኛ' : 'Tigrinya Meaning'}:
            </span>
            {quote.tigrinya}
          </div>

          {/* English Translation */}
          <div className="text-[12px] sm:text-[12.5px] text-slate-200 font-serif italic leading-relaxed pl-1">
            "{quote.english}"
          </div>

        </div>

        {/* FOOTER: Source Citation & Historical Context Accordion Toggle */}
        <div className="pt-2.5 border-t border-amber-500/20 flex flex-col gap-2 relative z-10">
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 min-w-0 pr-2">
              <span className="text-amber-400 text-xs shrink-0">🏛️</span>
              <span className="text-[11px] font-bold text-amber-200/90 truncate">
                {language === 'ti' ? quote.source : quote.sourceEn}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowContext(!showContext)}
              className="text-[10px] font-bold text-amber-300/90 hover:text-amber-200 flex items-center space-x-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/20 transition-all cursor-pointer shrink-0"
            >
              <Info className="w-3 h-3 text-amber-400" />
              <span>{language === 'ti' ? 'ታሪኽ ቅርሲ' : 'Context'}</span>
              {showContext ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>
          </div>

          {/* Expanded Historical Context */}
          {showContext && (
            <div className="bg-[#120D08]/90 rounded-xl p-3 border border-amber-400/30 text-[11px] text-amber-100/85 leading-relaxed space-y-1.5 animate-fadeIn">
              <div className="font-bold text-amber-300 flex items-center space-x-1">
                <span>📜</span>
                <span>{language === 'ti' ? 'ታሪኻዊ መበገስን ምርምርን' : 'Archaeological & Historical Context'}</span>
              </div>
              <p>
                {language === 'ti' ? quote.historicalContextTi : quote.historicalContextEn}
              </p>
              <div className="pt-1 flex items-center justify-between text-[9.5px] text-amber-300/70 font-mono">
                <span>Era: {quote.centuryEn}</span>
                <span>Type: {quote.manuscriptType.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* SHARE OPTIONS MODAL / DIALOG */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-[#1C160F] text-[#FFF8EB] border-2 border-amber-400/50 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-300">
                    {language === 'ti' ? 'ጥበብ ኣክሱም ኣካፍል' : 'Share Axumite Wisdom'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {quote.sourceEn}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowShareModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Preview Box */}
            <div className="bg-black/40 rounded-xl p-3 border border-amber-400/20 text-xs space-y-1.5 font-sans">
              <p className="font-birana-manuscript text-amber-300 font-bold text-[13px]">
                « {quote.geez} »
              </p>
              <p className="text-slate-200 text-[11px] italic">
                "{quote.english}"
              </p>
              <p className="text-[10px] text-amber-400/80 font-mono">
                — {quote.sourceEn} ({quote.centuryEn})
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 text-xs">
              
              {/* Copy Full Quote */}
              <button
                type="button"
                onClick={() => handleCopyText('all')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-md"
              >
                {copied ? <Check className="w-4 h-4 text-slate-950 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (language === 'ti' ? 'ተቐዲሑ!' : 'Copied!') : (language === 'ti' ? 'ምሉእ ጽሑፍ ቅዳሕ' : 'Copy Full Formatted Quote')}</span>
              </button>

              {/* Download as Image Card */}
              <button
                type="button"
                onClick={handleDownloadCard}
                className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 font-bold border border-amber-400/30 flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>{language === 'ti' ? 'ስእላዊ ካርድ ኣውርድ (PNG)' : 'Download Image Card (PNG)'}</span>
              </button>

              {/* Social links grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(formattedShareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold text-[11px] flex flex-col items-center justify-center space-y-1 transition-all"
                >
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(formattedShareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#29b6f6] border border-[#0088cc]/40 font-bold text-[11px] flex flex-col items-center justify-center space-y-1 transition-all"
                >
                  <span>Telegram</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(formattedShareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold text-[11px] flex flex-col items-center justify-center space-y-1 transition-all"
                >
                  <span>X / Twitter</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
