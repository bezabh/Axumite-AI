import React, { useState, useEffect } from 'react';
import { TranslationResult, SavedItem, UserProfile } from '../types';
import { Languages, Sparkles, Copy, Check, BookmarkPlus, Loader2, Volume2, BookOpen, ArrowRightLeft, Globe, VolumeX, Mic, ArrowRight } from 'lucide-react';
import { checkGuestLimit, incrementGuestUsage } from '../utils/guestManager';
import { GuestLimitBanner } from './GuestLimitBanner';
import geezIconImg from '../assets/images/geez_fidel_icon_1786607918022.jpg';
import { ALL_INTERNATIONAL_LANGUAGES, POPULAR_LANGUAGE_PAIRS, LanguageOption } from '../utils/languages';
import { AudioTranslationModal } from './AudioTranslationModal';
import { WrittenTranslationModal } from './WrittenTranslationModal';
import { base64PcmToWavDataUrl } from '../utils/welcomeAudioService';
import { FileText } from 'lucide-react';

interface GeezTranslatorProps {
  onSaveInsight: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  user?: UserProfile;
  onOpenAuthModal?: (mode?: 'login' | 'signup' | 'otp') => void;
}

export const GeezTranslator: React.FC<GeezTranslatorProps> = ({ 
  onSaveInsight,
  user,
  onOpenAuthModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Tigrinya');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isWrittenModalOpen, setIsWrittenModalOpen] = useState(false);

  const [guestLimitState, setGuestLimitState] = useState(() =>
    checkGuestLimit('translation', user?.email, user?.role)
  );

  useEffect(() => {
    setGuestLimitState(checkGuestLimit('translation', user?.email, user?.role));
  }, [user]);

  // Fidel Punctuation & Numerals Keyboard Shortcuts
  const fidelKeyboard = [
    { label: '፡', desc: 'Word Separator' },
    { label: '፣', desc: 'Comma' },
    { label: '፤', desc: 'Semicolon' },
    { label: '፦', desc: 'Preface' },
    { label: '፨', desc: 'Paragraph' },
    { label: '፩', desc: '1' },
    { label: '፪', desc: '2' },
    { label: '፫', desc: '3' },
    { label: '፬', desc: '4' },
    { label: '፭', desc: '5' },
    { label: '፲', desc: '10' },
    { label: '፻', desc: '100' },
  ];

  const handleTranslate = async (textToUse?: string, srcOverride?: string, tgtOverride?: string) => {
    const text = textToUse !== undefined ? textToUse : inputText;
    const src = srcOverride || sourceLang;
    const tgt = tgtOverride || targetLang;
    if (!text.trim() || isLoading) return;

    // Check guest limit
    const currentLimit = checkGuestLimit('translation', user?.email, user?.role);
    if (!currentLimit.allowed) {
      setGuestLimitState(currentLimit);
      setResult({
        sourceText: text,
        translatedText: `⚠️ Guest Translation Limit Reached (${currentLimit.max}/${currentLimit.max}). Please register or sign in for unlimited neural translations.`,
        phoneticGeEz: 'ደረት ጋሻ ተወዲኡ እዩ።',
        transliteration: 'Deret gasha tewedi-u eyu. Please sign in.',
        culturalContext: 'Unlimited translation is available to verified members.',
      });
      return;
    }

    incrementGuestUsage('translation', user?.email, user?.role);
    setGuestLimitState(checkGuestLimit('translation', user?.email, user?.role));

    setIsLoading(true);

    try {
      const res = await fetch('/api/obelisk/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLanguage: src,
          targetLanguage: tgt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Translation failed.');
      }

      setResult(data.translation);
    } catch (err: any) {
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(`${result.translatedText}\nPhonetic: ${result.transliteration}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeakTranslated = async (textToSpeak: string) => {
    if (!textToSpeak) return;
    if (isPlayingAudio && audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
      return;
    }

    const fallbackSpeech = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak.slice(0, 300));
        utterance.lang = targetLang.toLowerCase().includes('tigrinya') ? 'ti-ER' : 'en-US';
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    };

    setIsPlayingAudio(true);
    try {
      const response = await fetch('/api/obelisk/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak.slice(0, 300),
          voice: 'Kore',
        }),
      });

      const data = await response.json();
      if (data.audioBase64) {
        const audioUrl = base64PcmToWavDataUrl(data.audioBase64, data.sampleRate || 24000);
        const audio = new Audio(audioUrl);
        setAudioObj(audio);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => fallbackSpeech();
        audio.play().catch(() => fallbackSpeech());
      } else {
        fallbackSpeech();
      }
    } catch {
      fallbackSpeech();
    }
  };

  const samplePhrases = [
    { label: '✨ Tigrinya Heritage Proverb', text: 'ሰላም፤ ብሩክ መዓልቲ ይግበረልና። ፍልጠት ካብ ወርቂ ይበልጽ።' },
    { label: '👑 Axum Royalty Greeting (Tigrinya)', text: 'ሰላምን ክብርን ንንግስነትን ህዝብን ኣክሱም ይኹን።' },
    { label: '📜 Wisdom Proverb (English to Tigrinya)', text: 'Wisdom is greater than gold, and understanding is a fountain of life.' },
    { label: '🏛️ Stela Dedication (Ge\'ez Script)', text: 'Built for eternity under the light of the heavens.' },
    { label: '🌍 Global Unity (English to All Languages)', text: 'Technology connects humanity across cultures, languages, and generations.' },
  ];

  // Group languages by category for organized selects
  const categories: Array<LanguageOption['category']> = [
    'Horn of Africa & Semitic',
    'European',
    'Asian & Middle Eastern',
    'African',
    'Classical & Ancient',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {user?.role === 'Guest' && (
        <GuestLimitBanner
          feature="translation"
          remaining={guestLimitState.remaining}
          max={guestLimitState.max}
          onOpenUpgradeOrAuth={() => {
            if (onOpenAuthModal) onOpenAuthModal('signup');
          }}
        />
      )}

      {/* Audio & Written Translation CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Audio Translation Card */}
        <div className="bg-gradient-to-r from-[#194BFB]/15 via-[#194BFB]/5 to-transparent border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#194BFB] to-[#3B82F6] flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
                <span>ናይ ድምጺ ትርጉም</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 font-bold rounded-full">VOICE</span>
              </h3>
              <p className="text-xs text-gray-400">
                ብድምጺ ተዛረቡ እሞ ተርጉሙ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAudioModalOpen(true)}
            className="py-2 px-3 rounded-xl bg-[#194BFB] hover:bg-[#133BD0] active:scale-95 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0 border border-blue-400/40"
          >
            <span>ጀምር</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Written Translation Card (Matching screenshot) */}
        <div className="bg-gradient-to-r from-emerald-600/15 via-emerald-600/5 to-transparent border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
                <span>ጽሑፍ ትርጓሜ</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">SCAN & OCR</span>
              </h3>
              <p className="text-xs text-gray-400">
                ካሜራ፣ ፎቶ ወይ ጽሑፍ ብምልጋብ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWrittenModalOpen(true)}
            className="py-2 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0 border border-emerald-400/40"
          >
            <span>ክፈት</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Popular Fast Language Pairs */}
      <div className="bg-[#080808] p-3.5 border border-[#8E6D28]/20 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#C5A059] font-bold tracking-[0.15em] uppercase flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>POPULAR INTERNATIONAL PAIRS (ቀልጣፍ ናይ ቋንቋ መምረጺ):</span>
          </span>
          <span className="text-[10px] text-gray-500 font-mono">Instant Switch</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_LANGUAGE_PAIRS.map((pair, idx) => {
            const isSelected = sourceLang === pair.source && targetLang === pair.target;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSourceLang(pair.source);
                  setTargetLang(pair.target);
                  if (inputText.trim()) {
                    handleTranslate(inputText, pair.source, pair.target);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-bold shadow-md'
                    : 'bg-[#100F14] hover:bg-[#1C1824] text-gray-300 border border-[#8E6D28]/25'
                }`}
              >
                {pair.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Input Column */}
        <div className="space-y-4">
          
          <div className="bg-[#060606] border border-[#8E6D28]/25 rounded-3xl p-5 space-y-4 shadow-xl">
            
            {/* Language Selection Row with categorized select */}
            <div className="flex items-center justify-between gap-2">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="flex-1 bg-[#080808] border border-[#8E6D28]/30 rounded-xl text-gray-200 text-xs p-2.5 focus:outline-none"
              >
                {categories.map((cat) => (
                  <optgroup key={cat} label={`── ${cat} ──`}>
                    {ALL_INTERNATIONAL_LANGUAGES.filter((l) => l.category === cat).map((lang) => (
                      <option key={`src-${lang.code}`} value={lang.name}>
                        {lang.flag ? `${lang.flag} ` : ''}{lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <button
                onClick={handleSwap}
                className="p-2.5 bg-[#0D0D0E] border border-[#8E6D28]/30 rounded-xl text-[#C5A059] hover:bg-[#15120C] transition-colors cursor-pointer"
                title="Swap Languages"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="flex-1 bg-[#080808] border border-[#8E6D28]/30 rounded-xl text-gray-200 text-xs p-2.5 focus:outline-none"
              >
                {categories.map((cat) => (
                  <optgroup key={cat} label={`── ${cat} ──`}>
                    {ALL_INTERNATIONAL_LANGUAGES.filter((l) => l.category === cat).map((lang) => (
                      <option key={`tgt-${lang.code}`} value={lang.name}>
                        {lang.flag ? `${lang.flag} ` : ''}{lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Input Textarea */}
            <div className="space-y-1.5">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type or paste text to translate from ${sourceLang} to ${targetLang}...`}
                className="w-full bg-[#080808] border border-[#8E6D28]/30 focus:border-[#C5A059] rounded-2xl p-3.5 text-xs text-slate-100 placeholder-gray-500 focus:outline-none min-h-[110px] resize-none font-ethiopic"
              />
            </div>

            {/* Fidel Characters Keyboard (shown when either source or target is Tigrinya, Ge'ez or Amharic) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#C5A059] tracking-[0.15em] uppercase">
                FIDEL PUNCTUATION & NUMERALS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fidelKeyboard.map((char, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText((prev) => prev + char.label)}
                    className="px-2.5 py-1 bg-[#0D0D0E] hover:bg-[#15120C] border border-[#8E6D28]/30 text-[#F3E5AB] text-xs font-bold rounded-lg transition-all font-ethiopic cursor-pointer"
                    title={char.desc}
                  >
                    {char.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleTranslate()}
              disabled={!inputText.trim() || isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] hover:brightness-110 disabled:opacity-40 text-black font-extrabold text-xs uppercase tracking-widest rounded-full shadow-lg transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Translating between {sourceLang} & {targetLang}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Translate & Analyze ({sourceLang} ➔ {targetLang})</span>
                </>
              )}
            </button>

          </div>

          {/* Preset Sample Phrases */}
          <div className="bg-[#080808] p-4 border border-[#8E6D28]/25 rounded-3xl space-y-2 shadow-md">
            <span className="text-[10px] text-[#C5A059] font-bold tracking-[0.2em] uppercase">
              TRY SAMPLE HISTORICAL & GLOBAL PHRASES:
            </span>
            <div className="space-y-1.5">
              {samplePhrases.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(sp.text);
                    handleTranslate(sp.text);
                  }}
                  className="w-full text-left p-2.5 bg-[#0D0D0E] hover:bg-[#15120C] border border-[#8E6D28]/20 hover:border-[#8E6D28] rounded-2xl text-xs text-gray-300 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="font-medium text-[#F3E5AB]">{sp.label}</span>
                  <span className="text-[11px] text-gray-400 group-hover:text-gray-200 truncate ml-2">
                    "{sp.text}"
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Output Column */}
        <div className="bg-[#060606] border border-[#8E6D28]/20 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#8E6D28]/15">
              <span className="serif-luxury text-xs font-bold text-[#C5A059] tracking-widest uppercase flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4" />
                <span>TRANSLATION & FIDEL BREAKDOWN</span>
              </span>

              {result && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSpeakTranslated(result.translatedText)}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-[#0D0D0E] text-[#F3E5AB] hover:text-white border border-[#8E6D28]/40 text-[10px] uppercase tracking-wider transition-colors cursor-pointer rounded-lg"
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-[#0D0D0E] text-gray-300 hover:text-[#C5A059] border border-[#8E6D28]/30 text-[10px] uppercase tracking-wider transition-colors cursor-pointer rounded-lg"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() =>
                      onSaveInsight({
                        title: `Translation [${targetLang}]: ${result.translatedText.substring(0, 30)}`,
                        type: 'translation',
                        content: result.translatedText,
                        tags: ['translation', result.scriptName, targetLang],
                        metadata: result,
                      })
                    }
                    className="flex items-center space-x-1 px-2.5 py-1 bg-[#8E6D28]/15 text-[#F3E5AB] hover:bg-[#8E6D28]/30 border border-[#8E6D28]/40 text-[10px] uppercase tracking-wider transition-colors cursor-pointer rounded-lg"
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
                  Deconstructing linguistics, Fidel root glyphs and phonetic transliteration...
                </p>
              </div>
            ) : result ? (
              <div className="mt-4 space-y-4">
                
                {/* Primary Script Output Box */}
                <div className="bg-[#0B0B0C] p-4 border border-[#8E6D28]/30 rounded-2xl text-center space-y-2 stela-glow">
                  <div className="flex items-center justify-between text-[10px] text-[#C5A059] uppercase tracking-widest font-mono border-b border-[#8E6D28]/20 pb-1.5">
                    <span>{result.scriptName || `${targetLang} Script`}</span>
                    <span>Target: {targetLang}</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold font-ethiopic text-gold-gradient leading-relaxed pt-1">
                    {result.translatedText}
                  </p>
                  {result.transliteration && (
                    <p className="text-xs text-gray-300 font-mono italic">
                      Phonetic: "{result.transliteration}"
                    </p>
                  )}
                </div>

                {/* Word Breakdown */}
                {result.wordBreakdown && result.wordBreakdown.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-200">
                      Word-by-Word Analysis:
                    </span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {result.wordBreakdown.map((wb, idx) => (
                        <div
                          key={idx}
                          className="bg-[#080808] p-2.5 rounded-xl border border-[#8E6D28]/20 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#F3E5AB] font-ethiopic mr-2">
                              {wb.translatedWord}
                            </span>
                            {wb.phonetic && (
                              <span className="text-gray-400 text-[11px]">
                                ({wb.phonetic})
                              </span>
                            )}
                          </div>
                          <span className="text-gray-300 text-[11px] bg-[#0E0D0F] px-2 py-0.5 rounded-md border border-[#8E6D28]/15">
                            {wb.meaning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cultural Context */}
                {result.culturalContext && (
                  <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-[#8E6D28]/20 text-xs text-gray-300 space-y-1">
                    <span className="font-bold text-[#C5A059] text-[10px] uppercase tracking-widest block">
                      HISTORICAL & CULTURAL CONTEXT:
                    </span>
                    <p className="leading-relaxed text-[11.5px] text-gray-400">
                      {result.culturalContext}
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-2 text-gray-500">
                <Languages className="w-10 h-10 stroke-[1.5] text-gray-600" />
                <p className="text-xs font-medium text-gray-400">
                  Enter phrase on the left to translate between Tigrinya, Ge'ez and all international languages.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Audio Translation Studio & Language Selector Modal */}
      <AudioTranslationModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        user={user}
        onSaveInsight={onSaveInsight}
        onOpenAuthModal={onOpenAuthModal}
      />

      {/* Written Translation Studio (Scan, Upload, Paste & Output Card) */}
      <WrittenTranslationModal
        isOpen={isWrittenModalOpen}
        onClose={() => setIsWrittenModalOpen(false)}
        user={user}
        onSaveInsight={onSaveInsight}
        onOpenAuthModal={onOpenAuthModal}
      />

    </div>
  );
};

