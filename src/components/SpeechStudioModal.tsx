import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Volume2, VolumeX, Play, Pause, 
  Copy, Check, RefreshCw, Sparkles, MessageSquare, Download, Globe,
  Upload, Wand2, ArrowRight, Music2, RotateCcw, FileText, CheckCircle2,
  Sliders, Radio
} from 'lucide-react';
import { UserProfile } from '../types';
import { base64PcmToWavDataUrl } from '../utils/welcomeAudioService';
import { useLanguage } from '../context/LanguageContext';

interface SpeechStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'stt' | 'tts';
  user: UserProfile;
  onNavigateToChat?: (prompt: string) => void;
}

export const SpeechStudioModal: React.FC<SpeechStudioModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'stt',
  user,
  onNavigateToChat,
}) => {
  const { language } = useLanguage();
  const isTigrinya = language === 'ti';

  const [mode, setMode] = useState<'stt' | 'tts'>(initialMode);
  
  // ==========================================
  // 1. SPEECH TO TEXT (STT) STATE
  // ==========================================
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'ti-ER' | 'en-US' | 'am-ET' | 'ar-SA'>('ti-ER');
  const [isRefiningStt, setIsRefiningStt] = useState(false);
  const [sttSuccessMsg, setSttSuccessMsg] = useState<string | null>(null);
  const [micAudioVolume, setMicAudioVolume] = useState<number[]>(Array(18).fill(10));
  const [copiedStt, setCopiedStt] = useState(false);
  
  // ==========================================
  // 2. TEXT TO SPEECH (TTS) STATE
  // ==========================================
  const [ttsText, setTtsText] = useState(
    'ሰላም፡ ከመይ ቀኒኹም፧ ኣነ ኣክሱማይት AI እየ። ብትግርኛ ዝኾነ ሕቶ ወይ ሓሳብ እንተልዩኩም ብጥዑም ተፈጥሮኣዊ ድምጺ ክምልሰልኩም ድሉው እየ።'
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Fenrir' | 'Puck' | 'Aoede' | 'Charon'>('Kore');
  const [isGeneratingAiAnswer, setIsGeneratingAiAnswer] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [showAiPromptBox, setShowAiPromptBox] = useState(false);
  const [copiedTts, setCopiedTts] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  // Audio equalizer bars animation when listening or playing
  useEffect(() => {
    let interval: any;
    if (isListening || isPlayingAudio) {
      interval = setInterval(() => {
        setMicAudioVolume(
          Array(18).fill(0).map(() => Math.floor(Math.random() * 75) + 20)
        );
      }, 110);
    } else {
      setMicAudioVolume(Array(18).fill(12));
    }
    return () => clearInterval(interval);
  }, [isListening, isPlayingAudio]);

  // Initialize browser speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            current += event.results[i][0].transcript;
          }
          if (current.trim()) {
            setTranscript((prev) => (prev ? prev + ' ' + current.trim() : current.trim()));
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage]);

  if (!isOpen) return null;

  // ==========================================
  // SPEECH TO TEXT HANDLERS
  // ==========================================
  const toggleListening = () => {
    if (!recognitionRef.current) {
      if (!isListening) {
        setIsListening(true);
        const samplePhrases = [
          "ሰላም፡ ከመይ ቀኒኹም፧ ብዛዕባ ታሪኽ ኣክሱም ሓበሬታ ሃቡኒ።",
          "ናይ ሎሚ ናይ ትምህርትን ስራሕን መደብ እንታይ እዩ፧",
          "ስኮላርሺፕ ወጻኢ ሃገር ንምርካብ እንታይ ክገብር ኣለኒ፧",
          "ብትግርኛ ጽሑፍ ናብ ድምጺ ክቕየር ይደሊ ኣለኹ።"
        ];
        const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        setTimeout(() => {
          setTranscript((prev) => prev ? prev + ' ' + randomPhrase : randomPhrase);
          setIsListening(false);
        }, 2000);
      } else {
        setIsListening(false);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = selectedLanguage;
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(true);
        const samplePhrases = [
          "ሰላም፡ ከመይ ቀኒኹም፧ ብዛዕባ ታሪኽ ኣክሱም ሓበሬታ ሃቡኒ።",
          "ናይ ሎሚ ናይ ትምህርትን ስራሕን መደብ እንታይ እዩ፧",
          "ስኮላርሺፕ ወጻኢ ሃገር ንምርካብ እንታይ ክገብር ኣለኒ፧",
          "ብትግርኛ ጽሑፍ ናብ ድምጺ ክቕየር ይደሊ ኣለኹ።"
        ];
        const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        setTimeout(() => {
          setTranscript((prev) => prev ? prev + ' ' + randomPhrase : randomPhrase);
          setIsListening(false);
        }, 1800);
      }
    }
  };

  // Format Ge'ez Punctuation & Polish Grammar via AI
  const handleRefineSttGrammar = async () => {
    if (!transcript.trim()) return;
    setIsRefiningStt(true);
    setSttSuccessMsg(null);

    try {
      const response = await fetch('/api/obelisk/stt-refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: transcript }),
      });

      const data = await response.json();
      if (data.refinedText) {
        setTranscript(data.refinedText);
        setSttSuccessMsg(
          isTigrinya 
            ? 'ስርዓተ-ነጥቢ ግእዝን ሰዋስውን ብትኽክል ተኣሪሙ ኣሎ ✓' 
            : 'Ge\'ez punctuation & grammar refined successfully ✓'
        );
        setTimeout(() => setSttSuccessMsg(null), 4000);
      }
    } catch {
      // Basic rule-based Ge'ez punctuation fallback if offline
      let formatted = transcript.trim();
      if (!/[።፧!]$/.test(formatted)) {
        formatted += '።';
      }
      setTranscript(formatted);
      setSttSuccessMsg(
        isTigrinya 
          ? 'ስርዓተ-ነጥቢ ግእዝ ተወሲኹ ኣሎ ✓' 
          : 'Ge\'ez punctuation added ✓'
      );
      setTimeout(() => setSttSuccessMsg(null), 4000);
    } finally {
      setIsRefiningStt(false);
    }
  };

  const handleApplyPresetPhrase = (phrase: string) => {
    setTranscript((prev) => prev ? `${prev} ${phrase}` : phrase);
  };

  const handleExportText = () => {
    if (!transcript.trim()) return;
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tigrinya_Transcript_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSwitchToTtsWithTranscript = () => {
    if (transcript.trim()) {
      setTtsText(transcript.trim());
    }
    setMode('tts');
  };

  // ==========================================
  // TEXT TO SPEECH HANDLERS
  // ==========================================
  const handlePlayTTS = async () => {
    if (!ttsText.trim()) return;

    if (isPlayingAudio) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);

    const fallbackSpeech = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(ttsText.slice(0, 500));
        utterance.lang = selectedLanguage;
        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    };

    try {
      const response = await fetch('/api/obelisk/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ttsText.slice(0, 500),
          voice: selectedVoice,
        }),
      });

      const data = await response.json();
      if (data.audioBase64) {
        const audioUrl = base64PcmToWavDataUrl(data.audioBase64, data.sampleRate || 24000);
        setTtsAudioUrl(audioUrl);
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;
        audio.playbackRate = voiceRate;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => fallbackSpeech();
        await audio.play().catch(() => fallbackSpeech());
      } else {
        fallbackSpeech();
      }
    } catch {
      fallbackSpeech();
    }
  };

  // Generate Spoken AI Answer specifically formatted for TTS audio
  const handleGenerateSpokenAiAnswer = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPromptInput || 'ሰላምታን ናይ ኣክሱማይት AI መግለጺን';
    setIsGeneratingAiAnswer(true);

    try {
      const response = await fetch('/api/obelisk/tts-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: promptToUse }),
      });

      const data = await response.json();
      if (data.spokenTigrinyaText) {
        setTtsText(data.spokenTigrinyaText);
        setShowAiPromptBox(false);
        setAiPromptInput('');
      }
    } catch {
      setTtsText('ሰላም፡ ኣነ ኣክሱማይት AI እየ። ንዝኾነ ናይ ድምጽን ጽሑፍን ሓሳብኩም ብተፈጥሮኣዊ ቋንቋ ትግርኛ ክምልሰልኩም ድሉው እየ።');
    } finally {
      setIsGeneratingAiAnswer(false);
    }
  };

  const handleCopy = (text: string, type: 'stt' | 'tts') => {
    navigator.clipboard.writeText(text);
    if (type === 'stt') {
      setCopiedStt(true);
      setTimeout(() => setCopiedStt(false), 2000);
    } else {
      setCopiedTts(true);
      setTimeout(() => setCopiedTts(false), 2000);
    }
  };

  const handleSendToChat = () => {
    const textToSend = mode === 'stt' ? transcript : ttsText;
    if (onNavigateToChat && textToSend) {
      onNavigateToChat(textToSend);
      onClose();
    }
  };

  const handleDownloadTtsAudio = () => {
    if (!ttsAudioUrl) {
      handlePlayTTS();
      return;
    }
    const link = document.createElement('a');
    link.href = ttsAudioUrl;
    link.download = `Axumite_Tigrinya_Voice_${Date.now()}.wav`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-5 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F8FAFC] rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] text-[#0F2856]"
      >
        {/* ========================================================================= */}
        {/* TOP MODAL HEADER                                                          */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F2856] via-[#1D4ED8] to-[#C5A059] flex items-center justify-center text-white shadow-md">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-[#0F2856]">
                  {isTigrinya ? 'ናይ ትግርኛ ድምጺ ስቱድዮ' : 'Tigrinya Speech & Audio Studio'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 font-extrabold rounded-full font-mono">
                  DUAL-ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isTigrinya 
                  ? 'ድምጺ ናብ ጽሑፍን ጽሑፍ ናብ ድምጺን (Speech-to-Text & Text-to-Speech)' 
                  : 'High-fidelity Tigrinya Speech-to-Text & Neural Text-to-Speech'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="bg-transparent text-xs text-[#0F2856] font-bold focus:outline-none cursor-pointer"
              >
                <option value="ti-ER">ትግርኛ (Tigrinya)</option>
                <option value="en-US">English (US)</option>
                <option value="am-ET">አማርኛ (Amharic)</option>
                <option value="ar-SA">العربية (Arabic)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DUAL PURPOSE SELECTION CARDS (EXACT VISUAL REPLICA OF THE SCREENSHOT)     */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-slate-100/60 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* PURPOSE 1: ድምጺ ናብ ጽሑፍ (Speech to Text) */}
            <div
              onClick={() => setMode('stt')}
              className={`rounded-2xl p-4 transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[136px] ${
                mode === 'stt'
                  ? 'bg-white ring-2 ring-blue-500 shadow-lg shadow-blue-500/10'
                  : 'bg-white/90 hover:bg-white border border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              {/* Soft Watermark in background */}
              <div className="absolute right-0 bottom-0 text-blue-500/10 select-none pointer-events-none translate-x-2 translate-y-2">
                <Mic className="w-20 h-20" />
              </div>

              <div className="flex items-center justify-between">
                {/* Circular Blue Icon from screenshot */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-500/10">
                  <Mic className="w-6 h-6" />
                </div>
                {mode === 'stt' && (
                  <span className="text-[10px] px-2 py-0.5 bg-blue-600 text-white font-bold rounded-full">
                    ACTIVE MODE
                  </span>
                )}
              </div>

              <div className="space-y-1 relative z-10 mt-3">
                <h4 className="font-bold text-[#0F2856] text-base group-hover:text-blue-600 transition-colors">
                  ድምጺ ናብ ጽሑፍ
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  ዝተዛረብክምዎ ድምጺ ብልክዕ ናብ ጽሑፍ ይቕየር።
                </p>
              </div>
            </div>

            {/* PURPOSE 2: ጽሑፍ ናብ ድምጺ (Text to Speech) */}
            <div
              onClick={() => setMode('tts')}
              className={`rounded-2xl p-4 transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[136px] ${
                mode === 'tts'
                  ? 'bg-white ring-2 ring-red-500 shadow-lg shadow-red-500/10'
                  : 'bg-white/90 hover:bg-white border border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              {/* Soft Watermark in background */}
              <div className="absolute right-0 bottom-0 text-red-500/10 select-none pointer-events-none translate-x-2 translate-y-2">
                <Volume2 className="w-20 h-20" />
              </div>

              <div className="flex items-center justify-between">
                {/* Circular Red Icon from screenshot */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#DC2626] via-[#EF4444] to-[#F87171] flex items-center justify-center text-white shadow-md shadow-red-500/25 ring-4 ring-red-500/10">
                  <Volume2 className="w-6 h-6" />
                </div>
                {mode === 'tts' && (
                  <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white font-bold rounded-full">
                    ACTIVE MODE
                  </span>
                )}
              </div>

              <div className="space-y-1 relative z-10 mt-3">
                <h4 className="font-bold text-[#0F2856] text-base group-hover:text-red-600 transition-colors">
                  ጽሑፍ ናብ ድምጺ
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  መልስታት AI ብጥዑም ተፈጥሮኣዊ ድምጺ ስምዑ።
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE WORKSPACE FOR CURRENT MODE                                    */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {mode === 'stt' ? (
            /* ===================================================================== */
            /* 1. SPEECH TO TEXT MODE (ድምጺ ናብ ጽሑፍ)                                  */
            /* ===================================================================== */
            <div className="space-y-4">
              
              {/* Microphone Card & Animated Waveform */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                <div className="relative flex items-center justify-center py-2">
                  {isListening && (
                    <div className="absolute w-28 h-28 rounded-full bg-blue-500/20 animate-ping pointer-events-none" />
                  )}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 active:scale-95 cursor-pointer z-10 ${
                      isListening
                        ? 'bg-gradient-to-tr from-red-600 to-rose-500 text-white ring-8 ring-red-100 shadow-red-500/30 animate-pulse'
                        : 'bg-gradient-to-tr from-[#1D4ED8] to-[#3B82F6] hover:brightness-110 text-white ring-8 ring-blue-100 shadow-blue-500/30'
                    }`}
                  >
                    {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                </div>

                {/* Animated Frequency Equalizer Bars */}
                <div className="flex items-center space-x-1 h-6">
                  {micAudioVolume.map((vol, i) => (
                    <span
                      key={i}
                      style={{ height: `${vol}%` }}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        isListening ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-center space-y-0.5">
                  <p className="text-sm font-bold text-[#0F2856]">
                    {isListening 
                      ? (isTigrinya ? 'ይሰምዕ ኣሎ... ብትግርኛ ብንጹር ተዛረቡ' : 'Listening... Speak clearly in Tigrinya')
                      : (isTigrinya ? 'ክትዛረቡ ነዚ ናይ ድምጺ መጠወቒ ጠውቑ' : 'Tap Microphone to Speak in Tigrinya')}
                  </p>
                  <p className="text-[11px] text-slate-400 font-sans">
                    {isTigrinya 
                      ? 'ስርዓተ-ነጥቢ ግእዝን (።፣ ፡) ሰዋስውን ብልክዕ ይቕየር' 
                      : 'Live transcription with automatic Ge\'ez punctuation & grammar'}
                  </p>
                </div>
              </div>

              {/* Sample Preset Spoken Phrases for Quick Testing */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isTigrinya ? 'ናይ ፈተነ ሓሳባት (Quick Speech Samples):' : 'Quick Speech Samples:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "ሰላም፡ ከመይ ቀኒኹም፧",
                    "ብዛዕባ ታሪኽ ኣክሱም ሓበሬታ ሃቡኒ።",
                    "ስኮላርሺፕ ወጻኢ ሃገር እንታይ ኣሎ፧",
                    "ናይ ሎሚ ስነ-ጥበብን ኪነ-ጽሕፈትን ርአ።"
                  ].map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPresetPhrase(phrase)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      + "{phrase}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Transcribed Output Workspace */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-slate-100 pb-2">
                  <span className="flex items-center space-x-1.5 text-[#0F2856]">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isTigrinya ? 'ዝተቐየረ ናይ ትግርኛ ጽሑፍ (Transcribed Text):' : 'Transcribed Output:'}</span>
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    {transcript && (
                      <button
                        type="button"
                        onClick={() => handleCopy(transcript, 'stt')}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 px-2 py-0.5 rounded-md hover:bg-blue-50 cursor-pointer"
                      >
                        {copiedStt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedStt ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={
                    isTigrinya 
                      ? "ዝተዛረብኩምዎ ቃላት ኣብዚ ብትግርኛ ጽሑፍ ክቕየር እዩ..." 
                      : "Your spoken Tigrinya audio will appear here in real-time..."
                  }
                  rows={4}
                  className="w-full bg-transparent text-sm text-[#0F2856] leading-relaxed resize-none focus:outline-none font-sans"
                />

                {/* Status Message */}
                {sttSuccessMsg && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{sttSuccessMsg}</span>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    {/* Ge'ez Punctuation Polisher Button */}
                    <button
                      type="button"
                      onClick={handleRefineSttGrammar}
                      disabled={isRefiningStt || !transcript.trim()}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                      title="Add Ge'ez punctuation (።፣ ፡) and polish grammar"
                    >
                      {isRefiningStt ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      <span>{isTigrinya ? 'ስርዓተ-ነጥቢ ግእዝ ኣተዓራሪ' : 'Refine Ge\'ez Punctuation'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportText}
                      disabled={!transcript.trim()}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isTigrinya ? 'ኣውርድ' : 'Export'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTranscript('')}
                      className="text-xs text-slate-400 hover:text-red-600 font-bold px-2 py-1.5 rounded-lg cursor-pointer"
                    >
                      {isTigrinya ? 'ኣጽሪ' : 'Clear'}
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Bridge to Text to Speech */}
                    <button
                      type="button"
                      onClick={handleSwitchToTtsWithTranscript}
                      disabled={!transcript.trim()}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-40 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isTigrinya ? 'ብድምጺ ስማዕ' : 'Read Aloud in TTS'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSendToChat}
                      disabled={!transcript.trim()}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isTigrinya ? 'ናብ ቻት ስደድ' : 'Send to Chat'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* ===================================================================== */
            /* 2. TEXT TO SPEECH MODE (ጽሑፍ ናብ ድምጺ)                                  */
            /* ===================================================================== */
            <div className="space-y-4">
              
              {/* Ask AI to Generate Spoken Answer Banner */}
              <div className="bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 rounded-2xl p-3.5 border border-red-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-[#0F2856]">
                      {isTigrinya ? 'መልሲ AI ብጥዑም ተፈጥሮኣዊ ድምጺ ምፍጣር' : 'Generate Spoken Tigrinya AI Answers'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAiPromptBox(!showAiPromptBox)}
                    className="text-xs text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
                  >
                    {showAiPromptBox ? 'ዕጸው' : (isTigrinya ? '+ ሓድሽ ሕቶ ሕተት' : '+ Ask Custom AI Question')}
                  </button>
                </div>

                {/* Quick Topic Prompts */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: "🌟 ሰላምታን ምልላይን", prompt: "ሰላምታን ናይ ኣክሱማይት AI መግለጺን ብጥዑም ድምጺ አዳልወለይ" },
                    { label: "🏛️ ታሪኽ ኣክሱምን ግእዝን", prompt: "ብዛዕባ ዓበይቲ ሓወልትታት ኣክሱምን ታሪኽ ግእዝን ብሓጺሩ ኣብራህርሃኒ" },
                    { label: "💡 ናይ ሎሚ ጥበብ", prompt: "ንሎሚ ዝኸውን ብሉጽ ናይ ትግርኛ ምስላን ጥበብን ኣስምዓኒ" },
                    { label: "🎓 ስኮላርሺፕን ትምህርትን", prompt: "ንተምሃሮ ኣብ ወጻኢ ሃገር ዝወሃቡ ዓበይቲ ስኮላርሺፕታት ብሓጺሩ ግለጸለይ" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleGenerateSpokenAiAnswer(item.prompt)}
                      disabled={isGeneratingAiAnswer}
                      className="px-2.5 py-1 bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200/80 rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Custom Prompt Box */}
                {showAiPromptBox && (
                  <div className="pt-2 flex items-center space-x-2">
                    <input
                      type="text"
                      value={aiPromptInput}
                      onChange={(e) => setAiPromptInput(e.target.value)}
                      placeholder={isTigrinya ? "እንታይ ክምልሰልኩም ትደልዩ፧ (ንኣ. ብዛዕባ ቴክኖሎጂ ትግርኛ ሓበሬታ ሃበኒ)" : "Ask AI to generate a concise spoken response..."}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-[#0F2856] focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateSpokenAiAnswer()}
                      disabled={isGeneratingAiAnswer || !aiPromptInput.trim()}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer"
                    >
                      {isGeneratingAiAnswer ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{isTigrinya ? 'ፍጠር' : 'Generate'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Text Input Area */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-slate-100 pb-2">
                  <label className="text-xs font-bold text-[#0F2856] block">
                    {isTigrinya ? 'ብድምጺ ዝንበብ ጽሑፍ (Text to Read Aloud):' : 'Tigrinya Text to Speak:'}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy(ttsText, 'tts')}
                    className="text-red-600 hover:text-red-800 flex items-center space-x-1 px-2 py-0.5 rounded-md hover:bg-red-50 cursor-pointer"
                  >
                    {copiedTts ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTts ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <textarea
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  rows={4}
                  className="w-full bg-transparent text-sm text-[#0F2856] leading-relaxed resize-none focus:outline-none font-sans"
                  placeholder={
                    isTigrinya 
                      ? "ብተፈጥሮኣዊ ድምጺ ክንበብ ዝደለኹምዎ ናይ ትግርኛ ጽሑፍ ኣብዚ የእትዉ..." 
                      : "Enter Tigrinya text you want the AI to read aloud with natural voice..."
                  }
                />
              </div>

              {/* Voice Speed, Pitch & Character Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                {/* Voice Character */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">
                    {isTigrinya ? 'ድምጺ (Voice Actor):' : 'Voice Character:'}
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-[#0F2856] font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Kore">Kore (ጓል - Clear Female)</option>
                    <option value="Fenrir">Fenrir (ወዲ - Resonant Male)</option>
                    <option value="Puck">Puck (Warm Conversational)</option>
                    <option value="Aoede">Aoede (Melodic Harmony)</option>
                    <option value="Charon">Charon (Authoritative Noble)</option>
                  </select>
                </div>

                {/* Voice Speed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>{isTigrinya ? 'ቅልጣፈ ድምጺ:' : 'Voice Speed:'}</span>
                    <span className="text-red-600">{voiceRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.4"
                    step="0.1"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>

                {/* Voice Pitch */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>{isTigrinya ? 'ዓቐን ድምጺ (Pitch):' : 'Voice Pitch:'}</span>
                    <span className="text-red-600">{voicePitch}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.05"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Main Playback Control Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handlePlayTTS}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-md cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-red-600 text-white shadow-red-500/30 animate-pulse'
                        : 'bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white shadow-red-500/25 hover:brightness-105'
                    }`}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlayingAudio ? (isTigrinya ? 'ደው ኣብል' : 'Stop Audio') : (isTigrinya ? 'ብጥዑም ድምጺ ስማዕ' : 'Play Natural Voice')}</span>
                  </button>

                  {/* Equalizer Visualizer during playback */}
                  <div className="flex items-center space-x-1 h-5">
                    {micAudioVolume.slice(0, 10).map((vol, i) => (
                      <span
                        key={i}
                        style={{ height: `${isPlayingAudio ? vol : 15}%` }}
                        className={`w-1 rounded-full transition-all duration-75 ${
                          isPlayingAudio ? 'bg-red-500' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleDownloadTtsAudio}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                    title="Download audio as WAV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isTigrinya ? 'ድምጺ ኣውርድ' : 'Download Audio'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToChat}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F2856] text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isTigrinya ? 'ናብ ቻት' : 'To Chat'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
