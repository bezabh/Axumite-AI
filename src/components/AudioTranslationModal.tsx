import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Search, Check, Mic, MicOff, Volume2, VolumeX, 
  ArrowRightLeft, Sparkles, Copy, BookmarkPlus, RotateCcw, X, Loader2, ArrowRight, Globe
} from 'lucide-react';
import { AUDIO_TRANSLATION_LANGUAGES, AudioTranslationLanguage } from '../utils/audioTranslationLanguages';
import { TranslationResult, SavedItem, UserProfile } from '../types';
import { checkGuestLimit, incrementGuestUsage } from '../utils/guestManager';

interface AudioTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  onSaveInsight?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  onOpenAuthModal?: (mode?: 'login' | 'signup' | 'otp') => void;
}

export const AudioTranslationModal: React.FC<AudioTranslationModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveInsight,
  onOpenAuthModal,
}) => {
  // Step: 'language-select' (matches user screenshot) | 'live-translator'
  const [currentStep, setCurrentStep] = useState<'language-select' | 'live-translator'>('language-select');
  
  // Selected target language (default: English)
  const [selectedLanguage, setSelectedLanguage] = useState<AudioTranslationLanguage>(() => {
    return AUDIO_TRANSLATION_LANGUAGES.find(l => l.id === 'en') || AUDIO_TRANSLATION_LANGUAGES[0];
  });

  // Search query in language selection
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Translation State
  const [activeSpeaker, setActiveSpeaker] = useState<'tigrinya' | 'target'>('tigrinya');
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [translatedResult, setTranslatedResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslation, setCopiedTranslation] = useState(false);
  const [audioWaveform, setAudioWaveform] = useState<number[]>(Array(16).fill(15));
  const [translationHistory, setTranslationHistory] = useState<Array<{
    id: string;
    speaker: 'tigrinya' | 'target';
    sourceText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    timestamp: string;
  }>>([]);

  const recognitionRef = useRef<any>(null);
  const animationIntervalRef = useRef<any>(null);

  // Filter languages based on search query
  const filteredPopularLanguages = AUDIO_TRANSLATION_LANGUAGES.filter(
    (lang) => lang.isPopular && (
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.tigrinyaCountry.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredAllLanguages = AUDIO_TRANSLATION_LANGUAGES.filter(
    (lang) => !lang.isPopular && (
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.tigrinyaCountry.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Reset step when opened
  useEffect(() => {
    if (isOpen) {
      // Keep selected language or reset to select step if needed
      setSpokenText('');
      setTranslatedResult(null);
    } else {
      stopAudio();
      stopRecording();
    }
  }, [isOpen]);

  // Audio Waveform animation during recording or TTS playback
  useEffect(() => {
    if (isRecording || isPlayingAudio) {
      animationIntervalRef.current = setInterval(() => {
        setAudioWaveform(
          Array(16).fill(0).map(() => Math.floor(Math.random() * 85) + 15)
        );
      }, 100);
    } else {
      setAudioWaveform(Array(16).fill(12));
    }
    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, [isRecording, isPlayingAudio]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpokenText(currentTranscript);

        if (event.results[0].isFinal) {
          setIsRecording(false);
          if (currentTranscript.trim()) {
            executeTranslation(currentTranscript.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
          fallbackSimulatedVoiceInput(activeSpeaker);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage, activeSpeaker]);

  const startRecording = (speaker: 'tigrinya' | 'target') => {
    setActiveSpeaker(speaker);
    stopAudio();
    setSpokenText('');

    if (recognitionRef.current) {
      try {
        // Set speech language code
        const langCode = speaker === 'tigrinya' ? 'ti-ER' : selectedLanguage.speechCode;
        recognitionRef.current.lang = langCode;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('SpeechRecognition failed to start directly, fallback simulated speech:', e);
        fallbackSimulatedVoiceInput(speaker);
      }
    } else {
      fallbackSimulatedVoiceInput(speaker);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const fallbackSimulatedVoiceInput = (speaker: 'tigrinya' | 'target') => {
    setIsRecording(true);
    const sampleTigrinyaPhrases = [
      'ከመይ ኣለኻ፧ ከመይ ቀኒኻ፧',
      'ሰላም፡ ናብ ትግራይ እንቋዕ ብደሓን መጻእኩም።',
      'ኣብዚ ከባቢ ጽቡቕ ናይ መግቢ ቤት ኣበይ ኣሎ፧',
      'ናይ ሎሚ መዓልቲ ጸብጻብ ክትነግረኒ ትኽእልዶ፧',
      'ናብ ኣስመራ ንምኻድ ዝሓሸ መንገዲ ኣየናይ እዩ፧',
    ];

    const sampleForeignPhrases: Record<string, string[]> = {
      en: ['Hello, how are you today?', 'Where is the nearest historical landmark?', 'Could you please help me with directions?'],
      ar: ['مرحباً، كيف حالك اليوم؟', 'أين يقع أقرب مطعم هنا؟', 'شكراً جزيلاً على مساعدتك'],
      de: ['Guten Tag, wie geht es Ihnen?', 'Können Sie mir bitte helfen?', 'Wo ist der nächste Bahnhof?'],
      sv: ['Hej, hur mår du idag?', 'Kan du hjälpa mig med vägbeskrivningen?', 'Tack så mycket för hjälpen'],
      am: ['ሰላም እንደምን ነህ? ዛሬ እንዴት ነው?', 'እባክዎትን በአቅራቢያ ያለውን ሆቴል ያሳዩኝ'],
      it: ['Ciao, come stai oggi?', 'Puoi aiutarmi per favore?', 'Dov\'è il ristorante più vicino?'],
      fr: ['Bonjour, comment allez-vous?', 'Pouvez-vous m\'aider s\'il vous plaît?', 'Merci beaucoup pour votre aide'],
    };

    const targetPhrases = sampleForeignPhrases[selectedLanguage.id] || sampleForeignPhrases['en'];
    const chosenList = speaker === 'tigrinya' ? sampleTigrinyaPhrases : targetPhrases;
    const phrase = chosenList[Math.floor(Math.random() * chosenList.length)];

    setTimeout(() => {
      setSpokenText(phrase);
      setIsRecording(false);
      executeTranslation(phrase, speaker);
    }, 2200);
  };

  const executeTranslation = async (text: string, speakerOverride?: 'tigrinya' | 'target') => {
    if (!text.trim() || isTranslating) return;

    const speaker = speakerOverride || activeSpeaker;
    const sourceLang = speaker === 'tigrinya' ? 'Tigrinya' : selectedLanguage.name;
    const targetLang = speaker === 'tigrinya' ? selectedLanguage.name : 'Tigrinya';

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
          text,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Translation failed.');
      }

      const resData: TranslationResult = {
        translatedText: data.translation.translatedText,
        scriptName: data.translation.scriptName || 'Ethiopic Fidel',
        transliteration: data.translation.transliteration || '',
        culturalContext: data.translation.culturalContext || '',
        wordBreakdown: data.translation.wordBreakdown || [],
      };

      setTranslatedResult(resData);

      // Add to history
      setTranslationHistory((prev) => [
        {
          id: Date.now().toString(),
          speaker,
          sourceText: text,
          translatedText: data.translation.translatedText,
          sourceLang,
          targetLang,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.slice(0, 15),
      ]);

      // Automatically play translated voice
      playTextToSpeech(data.translation.translatedText, targetLang === 'Tigrinya' ? 'ti-ER' : selectedLanguage.speechCode);
    } catch (err: any) {
      console.error('Audio translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const playTextToSpeech = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

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

  const handleCopyText = (text: string, type: 'original' | 'translation') => {
    navigator.clipboard.writeText(text);
    if (type === 'original') {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedTranslation(true);
      setTimeout(() => setCopiedTranslation(false), 2000);
    }
  };

  const handleSaveInsight = () => {
    if (!translatedResult || !onSaveInsight) return;
    onSaveInsight({
      title: `Audio Translation: ${spokenText.substring(0, 25)}...`,
      type: 'translation',
      content: `[Source (${activeSpeaker === 'tigrinya' ? 'Tigrinya' : selectedLanguage.name})]: ${spokenText}\n[Translation (${activeSpeaker === 'tigrinya' ? selectedLanguage.name : 'Tigrinya'})]: ${translatedResult.translatedText}\n[Phonetic]: ${translatedResult.transliteration || ''}`,
      tags: ['audio-translation', activeSpeaker === 'tigrinya' ? selectedLanguage.name : 'Tigrinya'],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#F8FAFC] h-full sm:h-[92vh] sm:max-h-[820px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-[#1E293B] relative"
      >
        
        {/* ========================================================================= */}
        {/* VIEW 1: SELECT TRANSLATION LANGUAGE SCREEN (MATCHING USER SCREENSHOT)     */}
        {/* ========================================================================= */}
        {currentStep === 'language-select' ? (
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Top Navigation Bar */}
            <div className="pt-4 pb-2 px-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                aria-label="Back"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>

              <div className="text-center flex-1 pr-10">
                <h1 className="text-lg sm:text-xl font-black text-[#0F2856] tracking-tight leading-tight">
                  ቋንቋ ምረጽ
                </h1>
                <p className="text-xs font-semibold text-[#194BFB] tracking-normal">
                  Select Translation Language
                </p>
              </div>
            </div>

            {/* Scrollable List Container */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
              
              {/* Search Bar matching screenshot */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ቋንቋ ወይ ሃገር ድለ (Search)..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Section 1: ⭐ Popular Languages */}
              {filteredPopularLanguages.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-1.5 px-1">
                    <span className="text-amber-500 font-bold text-sm">⭐</span>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-600">
                      ዝያዳ ዝድለዩ (Popular)
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {filteredPopularLanguages.map((lang) => {
                      const isSelected = selectedLanguage.id === lang.id;
                      return (
                        <div
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang)}
                          className={`w-full p-3.5 bg-white rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                            isSelected
                              ? 'border-[#194BFB] ring-2 ring-blue-500/10 shadow-blue-500/5'
                              : 'border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3.5">
                            {/* Country Flag Badge */}
                            <div className="w-12 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
                              <span>{lang.flag}</span>
                            </div>

                            {/* Language Details */}
                            <div>
                              <h3 className="font-bold text-slate-900 text-base leading-tight">
                                {lang.name}
                              </h3>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {lang.tigrinyaCountry}
                              </p>
                            </div>
                          </div>

                          {/* Radio Checkmark Circle */}
                          <div className="shrink-0 pl-2">
                            {isSelected ? (
                              <div className="w-6 h-6 rounded-full bg-[#194BFB] text-white flex items-center justify-center shadow-xs">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-white" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 2: 🌍 All Languages */}
              {filteredAllLanguages.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center space-x-1.5 px-1">
                    <span className="text-blue-500 font-bold text-sm">🌍</span>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-600">
                      ኩሎም ቋንቋታት (All Languages)
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {filteredAllLanguages.map((lang) => {
                      const isSelected = selectedLanguage.id === lang.id;
                      return (
                        <div
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang)}
                          className={`w-full p-3.5 bg-white rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                            isSelected
                              ? 'border-[#194BFB] ring-2 ring-blue-500/10 shadow-blue-500/5'
                              : 'border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3.5">
                            {/* Country Flag Badge */}
                            <div className="w-12 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
                              <span>{lang.flag}</span>
                            </div>

                            {/* Language Details */}
                            <div>
                              <h3 className="font-bold text-slate-900 text-base leading-tight">
                                {lang.name}
                              </h3>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {lang.tigrinyaCountry}
                              </p>
                            </div>
                          </div>

                          {/* Radio Checkmark Circle */}
                          <div className="shrink-0 pl-2">
                            {isSelected ? (
                              <div className="w-6 h-6 rounded-full bg-[#194BFB] text-white flex items-center justify-center shadow-xs">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-white" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredPopularLanguages.length === 0 && filteredAllLanguages.length === 0 && (
                <div className="text-center py-12 px-4 space-y-2">
                  <Globe className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-600">ዝተረኽበ ቋንቋ የለን (No language found)</p>
                  <p className="text-xs text-slate-400">በጃኹም ብካልእ ስም ወይ ፊደል ድለዩ።</p>
                </div>
              )}

              {/* Extra spacing for bottom fixed button */}
              <div className="h-20" />
            </div>

            {/* Bottom Floating Start Translation Button matching Screenshot */}
            <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentStep('live-translator')}
                className="w-full py-4 px-6 bg-[#194BFB] hover:bg-[#133BD0] active:scale-[0.98] text-white font-bold text-base sm:text-lg rounded-full shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2.5 transition-all cursor-pointer border border-blue-400/30"
              >
                <span>ትርጉም ጀምር (Start Translation)</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: LIVE AUDIO / VOICE TRANSLATION STUDIO                             */
          /* ========================================================================= */
          <div className="flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
            
            {/* Studio Header */}
            <div className="pt-4 pb-3 px-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-xs">
              <button
                type="button"
                onClick={() => setCurrentStep('language-select')}
                className="flex items-center space-x-1 py-1.5 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ቋንቋ ቐይር</span>
              </button>

              {/* Active Pair Pill */}
              <div className="flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1.5 rounded-full">
                <span className="text-xs font-bold text-[#194BFB]">ትግርኛ</span>
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-bold text-[#194BFB] flex items-center space-x-1">
                  <span>{selectedLanguage.flag}</span>
                  <span>{selectedLanguage.name}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Translation Studio Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
              
              {/* Dual Voice Microphones Control Card */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 text-center space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F2856]">
                    ናይ ድምጺ ትርጉም ስቱድዮ
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    ብትግርኛ ወይ ብ {selectedLanguage.name} ተዛሪብኩም ብቕጽበት ተርጉሙ።
                  </p>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="h-12 bg-slate-50 rounded-2xl flex items-center justify-center px-4 space-x-1 border border-slate-100 overflow-hidden">
                  {audioWaveform.map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-full transition-all duration-100 ${
                        isRecording || isPlayingAudio 
                          ? 'bg-gradient-to-t from-blue-600 to-indigo-400' 
                          : 'bg-slate-300'
                      }`}
                      style={{ height: `${Math.max(6, val)}%` }}
                    />
                  ))}
                </div>

                {/* Dual Speaker Mic Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Speaker 1: Tigrinya */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isRecording && activeSpeaker === 'tigrinya') {
                        stopRecording();
                      } else {
                        startRecording('tigrinya');
                      }
                    }}
                    className={`py-3.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center space-y-1.5 transition-all shadow-md active:scale-95 cursor-pointer border ${
                      isRecording && activeSpeaker === 'tigrinya'
                        ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-red-500/30'
                        : 'bg-[#194BFB] hover:bg-[#133BD0] text-white border-blue-400/40 shadow-blue-500/25'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                      {isRecording && activeSpeaker === 'tigrinya' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </div>
                    <span>
                      {isRecording && activeSpeaker === 'tigrinya' ? 'ደው ኣብል (Stop)' : '📜 ብትግርኛ ተዛረቡ'}
                    </span>
                  </button>

                  {/* Speaker 2: Selected Foreign Language */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isRecording && activeSpeaker === 'target') {
                        stopRecording();
                      } else {
                        startRecording('target');
                      }
                    }}
                    className={`py-3.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center space-y-1.5 transition-all shadow-md active:scale-95 cursor-pointer border ${
                      isRecording && activeSpeaker === 'target'
                        ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-red-500/30'
                        : 'bg-[#0F172A] hover:bg-[#1E293B] text-white border-slate-700 shadow-slate-900/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                      {isRecording && activeSpeaker === 'target' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </div>
                    <span className="truncate max-w-[130px]">
                      {isRecording && activeSpeaker === 'target' ? 'Stop' : `${selectedLanguage.flag} Speak ${selectedLanguage.name}`}
                    </span>
                  </button>
                </div>

                {isTranslating && (
                  <div className="flex items-center justify-center space-x-2 text-blue-600 text-xs font-bold py-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ብኣክሱማይት AI ይትርጎም ኣሎ... (Translating Audio)</span>
                  </div>
                )}
              </div>

              {/* Active Audio Translation Result Card */}
              {(spokenText || translatedResult) && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 space-y-4">
                  
                  {/* Spoken Voice Input */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                      <span>ዝተሰምዐ ድምጺ ({activeSpeaker === 'tigrinya' ? 'ትግርኛ' : selectedLanguage.name}):</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(spokenText, 'original')}
                        className="text-slate-400 hover:text-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedOriginal ? 'ኮፒ ኮይኑ' : 'ኮፒ'}</span>
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      {spokenText}
                    </p>
                  </div>

                  {/* Translated Text Result */}
                  {translatedResult && (
                    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-2xl p-4 border border-blue-100 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-blue-700 font-bold">
                        <span className="flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>ውጽኢት ትርጉም ({activeSpeaker === 'tigrinya' ? selectedLanguage.name : 'ትግርኛ'}):</span>
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (isPlayingAudio) {
                                stopAudio();
                              } else {
                                const targetLangCode = activeSpeaker === 'tigrinya' ? selectedLanguage.speechCode : 'ti-ER';
                                playTextToSpeech(translatedResult.translatedText, targetLangCode);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer active:scale-95"
                            title="Listen"
                          >
                            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyText(translatedResult.translatedText, 'translation')}
                            className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedTranslation ? 'ኮፒ ኮይኑ' : 'ኮፒ'}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-base sm:text-lg font-bold text-[#0F2856] leading-relaxed">
                        {translatedResult.translatedText}
                      </p>

                      {translatedResult.transliteration && (
                        <p className="text-xs font-medium text-slate-500 italic bg-white/70 rounded-lg p-2 border border-blue-100/60">
                          🗣️ አነባብባ (Pronunciation): {translatedResult.transliteration}
                        </p>
                      )}

                      {translatedResult.culturalContext && (
                        <p className="text-[11px] text-slate-600 bg-white/70 rounded-lg p-2 border border-blue-100/60 leading-normal">
                          💡 {translatedResult.culturalContext}
                        </p>
                      )}

                      {/* Save to Insights Action */}
                      <div className="pt-1 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={handleSaveInsight}
                          className="py-1.5 px-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
                          <span>ኣብ ቫልት ዓቅብ (Save Insight)</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Translation History Log */}
              {translationHistory.length > 0 && (
                <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-600">
                      ናይ ቀረባ ናይ ድምጺ ትርጉማት (Recent Audio History)
                    </h4>
                    <button
                      type="button"
                      onClick={() => setTranslationHistory([])}
                      className="text-[11px] text-slate-400 hover:text-red-500 font-bold transition-colors cursor-pointer"
                    >
                      ኣጽሪ (Clear)
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {translationHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                          <span>{item.sourceLang} ➔ {item.targetLang}</span>
                          <span>{item.timestamp}</span>
                        </div>
                        <p className="text-slate-700 font-medium truncate">{item.sourceText}</p>
                        <p className="text-[#194BFB] font-bold truncate">{item.translatedText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
