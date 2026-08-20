import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, Camera, Image as ImageIcon, Clipboard, Languages, 
  Copy, Check, Volume2, VolumeX, Sparkles, BookmarkPlus, Loader2, X, RefreshCw
} from 'lucide-react';
import { TranslationResult, SavedItem, UserProfile } from '../types';
import { checkGuestLimit, incrementGuestUsage } from '../utils/guestManager';

interface WrittenTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  onSaveInsight?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  onOpenAuthModal?: (mode?: 'login' | 'signup' | 'otp') => void;
}

export const WrittenTranslationModal: React.FC<WrittenTranslationModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveInsight,
  onOpenAuthModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [translatedResult, setTranslatedResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrStatusMessage, setOcrStatusMessage] = useState('');
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslation, setCopiedTranslation] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Language pair selector
  const [sourceLang, setSourceLang] = useState('Tigrinya');
  const [targetLang, setTargetLang] = useState('English');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Paste from Clipboard
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputText((prev) => (prev ? `${prev}\n${text}` : text));
        }
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  // Handle Image/Camera File Selection for OCR
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, source: 'camera' | 'upload') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrProcessing(true);
    setOcrStatusMessage(source === 'camera' ? 'ናይ ካሜራ ስእሊ ይንበብ ኣሎ...' : 'ናይ ፎቶ ጽሑፍ ይንበብ ኣሎ...');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/obelisk/ocr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Data,
              mimeType: file.type || 'image/jpeg',
            }),
          });

          const data = await res.json();
          if (res.ok && data.text) {
            setInputText(data.text);
            setOcrStatusMessage('ጽሑፍ ብዓወት ተረኺቡ ኣሎ!');
            setTimeout(() => setOcrStatusMessage(''), 3000);
          } else {
            setOcrStatusMessage('ጽሑፍ ክንበብ ኣይተኻእለን።');
            setTimeout(() => setOcrStatusMessage(''), 3000);
          }
        } catch (err) {
          console.error('OCR Request error:', err);
          setOcrStatusMessage('ምውጻእ ጽሑፍ ኣይተዓወተን።');
          setTimeout(() => setOcrStatusMessage(''), 3000);
        } finally {
          setIsOcrProcessing(false);
          if (e.target) e.target.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      setIsOcrProcessing(false);
    }
  };

  // Execute Translation
  const handleTranslate = async () => {
    if (!inputText.trim() || isTranslating) return;

    // Check guest limit
    const currentLimit = checkGuestLimit('translation', user?.email, user?.role);
    if (!currentLimit.allowed) {
      setTranslatedResult({
        translatedText: `⚠️ ደረት ናይ ጋሻ ትርጉም ተወዲኡ እዩ (${currentLimit.max}/${currentLimit.max})። በጃኹም ብዘይደረት ንምጥቃም ተመዝገቡ ወይ ናብ ኣካውንትኩም እተዉ። (Guest Limit Reached. Please sign in.)`,
        scriptName: 'Ethiopic Fidel',
        transliteration: 'Deret gasha tewedi-u eyu. Please sign in.',
        culturalContext: 'Sign in to access unlimited AI translations.',
        wordBreakdown: [],
      });
      return;
    }

    incrementGuestUsage('translation', user?.email, user?.role);

    setIsTranslating(true);
    try {
      const res = await fetch('/api/obelisk/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Translation request failed.');
      }

      setTranslatedResult({
        translatedText: data.translation.translatedText,
        scriptName: data.translation.scriptName || 'Ethiopic Fidel',
        transliteration: data.translation.transliteration || '',
        culturalContext: data.translation.culturalContext || '',
        wordBreakdown: data.translation.wordBreakdown || [],
      });
    } catch (err: any) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Play Speech Audio
  const playSpeech = (text: string) => {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang === 'English' ? 'en-US' : 'ti-ER';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const handleCopy = (text: string, type: 'original' | 'translation') => {
    navigator.clipboard.writeText(text);
    if (type === 'original') {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedTranslation(true);
      setTimeout(() => setCopiedTranslation(false), 2000);
    }
  };

  const handleSaveToVault = () => {
    if (!translatedResult || !onSaveInsight) return;
    onSaveInsight({
      title: `Written Translation: ${inputText.substring(0, 25)}...`,
      type: 'translation',
      content: `[Source (${sourceLang})]: ${inputText}\n[Target (${targetLang})]: ${translatedResult.translatedText}\n[Transliteration]: ${translatedResult.transliteration || ''}`,
      tags: ['written-translation', sourceLang, targetLang],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      {/* Hidden file inputs for Camera & Upload */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'camera')}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'upload')}
      />

      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#F8FAFC] h-full sm:h-[92vh] sm:max-h-[820px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-[#1E293B] relative"
      >
        
        {/* ========================================================================= */}
        {/* TOP BAR: BACK ARROW & TITLE MATCHING SCREENSHOT                           */}
        {/* ========================================================================= */}
        <div className="pt-4 pb-3 px-4 sm:px-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="text-center flex-1 pr-10">
            <h1 className="text-lg sm:text-xl font-black text-[#0F2856] tracking-tight">
              ጽሑፍ ትርጓሜ
            </h1>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCROLLABLE MAIN BODY                                                      */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* Action Row: 📷 ካሜራ (Scan) & 🖼️ ፎቶ (Upload) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Scan with Camera */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isOcrProcessing}
              className="py-3.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200/90 rounded-2xl shadow-xs flex items-center justify-center space-x-2 text-slate-800 font-bold text-sm sm:text-base transition-all cursor-pointer"
            >
              <div className="text-emerald-600 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <span>ካሜራ (Scan)</span>
            </button>

            {/* Upload Photo */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isOcrProcessing}
              className="py-3.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200/90 rounded-2xl shadow-xs flex items-center justify-center space-x-2 text-slate-800 font-bold text-sm sm:text-base transition-all cursor-pointer"
            >
              <div className="text-blue-600 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span>ፎቶ (Upload)</span>
            </button>
          </div>

          {/* OCR Processing Status */}
          {isOcrProcessing && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center space-x-2 text-blue-700 text-xs font-semibold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
              <span>{ocrStatusMessage || 'ናይ ስእሊ ጽሑፍ ይንበብ ኣሎ...'}</span>
            </div>
          )}

          {ocrStatusMessage && !isOcrProcessing && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-semibold text-center">
              {ocrStatusMessage}
            </div>
          )}

          {/* Section: ORIGINAL TEXT + Paste Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                ORIGINAL TEXT
              </span>

              <button
                type="button"
                onClick={handlePaste}
                className="py-1 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Clipboard className="w-3.5 h-3.5 text-indigo-500" />
                <span>Paste</span>
              </button>
            </div>

            {/* Input Textarea matching screenshot */}
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="ኣብዚ ጽሓፍ..."
                rows={3}
                className="w-full p-4 bg-white border border-slate-200/90 rounded-2xl text-slate-900 placeholder-slate-400 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs resize-none transition-all"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setTranslatedResult(null);
                  }}
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Full Width Translate Button matching screenshot */}
          <div>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-base flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs ${
                !inputText.trim() || isTranslating
                  ? 'bg-[#B0C0D4]/60 text-slate-500 cursor-not-allowed'
                  : 'bg-[#194BFB] hover:bg-[#133BD0] active:scale-[0.98] text-white shadow-blue-500/25 border border-blue-400/30'
              }`}
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>ይትርጎም ኣሎ... (Translating)</span>
                </>
              ) : (
                <>
                  <Languages className="w-5 h-5" />
                  <span>ትርጉም (Translate Text)</span>
                </>
              )}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* OUTPUT CARD MATCHING SCREENSHOT WITH GREEN ACCENT TOP BORDER              */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col min-h-[300px] relative">
            
            {/* Top Emerald Green Accent Border / Ribbon */}
            <div className="h-1.5 bg-[#10B981] w-full" />

            {/* Output Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                ውጽኢት ትርጉም (OUTPUT)
              </span>

              {translatedResult && (
                <div className="flex items-center space-x-2">
                  {/* Play Speech */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isPlayingAudio) {
                        stopAudio();
                      } else {
                        playSpeech(translatedResult.translatedText);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                    title="Listen to translation"
                  >
                    {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(translatedResult.translatedText, 'translation')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer flex items-center space-x-1 text-xs font-semibold"
                    title="Copy Translation"
                  >
                    {copiedTranslation ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">ኮፒ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>ኮፒ</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Output Body */}
            <div className="flex-1 p-5 flex flex-col justify-center">
              {!translatedResult ? (
                /* Empty Placeholder state exactly matching screenshot */
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-3 my-auto">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                    <Languages className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    Translated text will elegantly appear here.
                  </p>
                </div>
              ) : (
                /* Populated Translation Result State */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-base sm:text-lg font-bold text-[#0F2856] leading-relaxed select-text">
                      {translatedResult.translatedText}
                    </p>

                    {translatedResult.transliteration && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                        🗣️ አነባብባ (Pronunciation): {translatedResult.transliteration}
                      </p>
                    )}

                    {translatedResult.culturalContext && (
                      <p className="text-xs text-slate-600 bg-blue-50/60 rounded-xl p-2.5 border border-blue-100/60">
                        💡 {translatedResult.culturalContext}
                      </p>
                    )}
                  </div>

                  {/* Save to Vault Action */}
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleSaveToVault}
                      className="py-1.5 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
                      <span>ኣብ ቫልት ዓቅብ (Save to Vault)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
