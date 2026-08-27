import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Wand2, Compass, BookOpen, RotateCcw, VolumeX, Shield, Play, Pause, ChevronDown, Radio, HelpCircle, BookMarked, Layers, MessageSquareText, RefreshCw, Music2 } from 'lucide-react';
import { AppTab, UserProfile } from '../types';
import { AxumiteTimeline } from './AxumiteTimeline';
import { VoiceCommandsModal } from './VoiceCommandsModal';
import { SpeechStudioModal } from './SpeechStudioModal';
import { base64PcmToWavDataUrl } from '../utils/welcomeAudioService';

interface AssistanceSystemProps {
  onNavigateTab: (tab: AppTab) => void;
  onSaveInsight?: (item: any) => void;
  onOpenUserModal?: () => void;
  onOpenSecurityModal?: () => void;
  onOpenPaymentModal?: () => void;
  user?: UserProfile;
}

export const AssistanceSystem: React.FC<AssistanceSystemProps> = ({ 
  onNavigateTab, 
  onSaveInsight,
  onOpenUserModal,
  onOpenSecurityModal,
  onOpenPaymentModal,
  user = { id: 'default', name: 'Guest User', role: 'Guest' },
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceInput, setVoiceInput] = useState('');
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechVolume, setSpeechVolume] = useState<number[]>(Array(14).fill(15));
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isSpeechStudioOpen, setIsSpeechStudioOpen] = useState(false);
  const [speechStudioMode, setSpeechStudioMode] = useState<'stt' | 'tts'>('stt');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Simulated visualizer waveform animation when listening or playing audio
  useEffect(() => {
    let interval: any;
    if (isListening || isPlayingAudio) {
      interval = setInterval(() => {
        setSpeechVolume(
          Array(16).fill(0).map(() => Math.floor(Math.random() * 80) + 20)
        );
      }, 100);
    } else {
      setSpeechVolume(Array(16).fill(12));
    }
    return () => clearInterval(interval);
  }, [isListening, isPlayingAudio]);

  // Voice Command Direct Interceptor
  const handleInterceptVoiceAction = (rawText: string): boolean => {
    const clean = rawText.trim().toLowerCase();

    // 1. Audio Stop / Mute
    if (clean.includes('ደው') || clean.includes('stop') || clean.includes('mute') || clean.includes('ስቕ') || clean.includes('ኣጥፍእ')) {
      stopAudio();
      setAssistantReply('ድምጺ ደው ተባሂሉ ኣሎ። (Audio playback paused)');
      return true;
    }

    // 2. Clear / Reset
    if (clean.includes('ኣጽሪ') || clean.includes('clear') || clean.includes('reset') || clean.includes('ጽረዮ')) {
      setTranscript('');
      setVoiceInput('');
      setAssistantReply('ናይ ድምጺ መእተዊ ተጸሪጉ ኣሎ። (Voice input & transcript reset)');
      return true;
    }

    // 3. Replay
    if (clean.includes('ደግመሉ') || clean.includes('replay') || clean.includes('repeat') || clean.includes('ኣስምዓኒ')) {
      if (assistantReply) {
        handleSpeakAudio(assistantReply);
      }
      return true;
    }

    // 4. Save insight to vault
    if (clean.includes('ዕቘሮ') || clean.includes('ዓቅቦ') || clean.includes('save insight') || clean.includes('ኣብ ቫልት')) {
      if (assistantReply && onSaveInsight) {
        onSaveInsight({
          title: `Voice Concierge Note: ${transcript.substring(0, 24)}`,
          type: 'assistance',
          content: assistantReply,
          tags: ['voice', 'vault-saved'],
        });
        setAssistantReply((prev) => `${prev}\n\n[✓ ንቫልት ብዓወት ተዓቂቡ ኣሎ። Saved to Vault]`);
      }
      return true;
    }

    // 5. Navigation Commands
    if (clean.includes('ክፈት ቻት') || clean.includes('open chat') || clean.includes('ናብ ቻት')) {
      onNavigateTab('chat');
      return true;
    }
    if (clean.includes('ክፈት ትርጉም') || clean.includes('open translator') || clean.includes('open translate') || clean.includes('ናብ ትርጉም')) {
      onNavigateTab('translator');
      return true;
    }
    if (clean.includes('ክፈት ምስሊ') || clean.includes('open vision') || clean.includes('open image') || clean.includes('ናይ ምስሊ')) {
      onNavigateTab('vision');
      return true;
    }
    if (clean.includes('prompt forge') || clean.includes('ክፈት ፎርጅ') || clean.includes('ናይ ስእሊ ፎርጅ')) {
      onNavigateTab('prompt-forge');
      return true;
    }
    if (clean.includes('ክፈት ክፍሊት') || clean.includes('open payment') || clean.includes('ክፍሊት') || clean.includes('ፕሮ ምዕባለ')) {
      if (onOpenPaymentModal) onOpenPaymentModal();
      else onNavigateTab('payment');
      return true;
    }
    if (clean.includes('ክፈት ፕሮፋይል') || clean.includes('open profile') || clean.includes('ኣካውንተይ')) {
      if (onOpenUserModal) onOpenUserModal();
      return true;
    }
    if (clean.includes('ክፈት ደሕንነት') || clean.includes('open security') || clean.includes('ቫልት')) {
      if (onOpenSecurityModal) onOpenSecurityModal();
      return true;
    }

    return false;
  };

  // Setup Web Speech API if available in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setVoiceInput(currentTranscript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Web Speech API microphone input is active. If your browser restricts mic permissions in iframe, you can also type your command or click the preset topics below!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        handleExecuteVoiceQuery(transcript);
      }
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleExecuteVoiceQuery = async (queryText?: string) => {
    const textToRun = queryText || voiceInput || transcript || "ብዛዕባ እዋናዊ ዜና ሃገርናን ፍሉይ ፍጻመ ተጋሩን ሓበሬታ ሃበኒ";
    if (!textToRun.trim()) return;

    // Check if it's an actionable shortcut command
    const handledDirectly = handleInterceptVoiceAction(textToRun);
    if (handledDirectly) {
      return;
    }

    setIsLoading(true);
    setAssistantReply(null);

    try {
      const response = await fetch('/api/obelisk/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `[ERITREAN AI ASSISTANT "ጓል ኤረይ"]: ${textToRun}. Provide an articulate, warm, and highly informative response in pure Tigrinya suitable for live voice readout.`,
          mode: 'general',
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setAssistantReply(data.result);

      // Save insight if callback provided
      if (onSaveInsight) {
        onSaveInsight({
          title: `Voice Concierge: ${textToRun.substring(0, 25)}`,
          type: 'assistance',
          content: `Voice Prompt: "${textToRun}"\n\nAssistant Response:\n${data.result}`,
          tags: ['voice-assistance', 'concierge'],
        });
      }

      // Automatically synthesize speech output
      handleSpeakAudio(data.result);
    } catch (err: any) {
      setAssistantReply(`Assistant system error: ${err.message || 'Failed to process voice command.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakAudio = async (textToSpeak: string) => {
    if (!textToSpeak) return;
    setIsPlayingAudio(true);

    const fallbackSpeech = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak.slice(0, 450));
        utterance.lang = 'ti-ER';
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
          text: textToSpeak.slice(0, 450),
          voice: 'Kore',
        }),
      });

      const data = await response.json();
      if (data.audioBase64) {
        const audioUrl = base64PcmToWavDataUrl(data.audioBase64, data.sampleRate || 24000);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
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

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="min-h-[82vh] max-w-md sm:max-w-lg mx-auto bg-gradient-to-b from-[#0F0E17] via-[#09080E] to-[#050408] text-white rounded-[2.5rem] border border-[#8E6D28]/30 shadow-2xl overflow-hidden flex flex-col justify-between p-6 sm:p-8 relative">
      
      {/* Background Subtle Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-[#C5A059]/10 rounded-full blur-3xl" />
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[260px] h-[260px] bg-amber-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#8E6D28]/15 rounded-full blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Collapse / Back Button */}
        <button
          onClick={() => onNavigateTab('chat')}
          className="w-11 h-11 rounded-full bg-[#181524]/80 border border-[#8E6D28]/40 hover:bg-[#252038] flex items-center justify-center text-slate-300 hover:text-[#F3E5AB] transition-all shadow-md cursor-pointer"
          title="Back to Chat"
        >
          <ChevronDown className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Title */}
        <h1 className="text-base sm:text-lg font-cinzel font-black tracking-[0.25em] uppercase metallic-gold-shimmer">
          AI ASSISTANT
        </h1>

        {/* Live Pill Badge */}
        <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#1C1829] border border-[#C5A059]/40 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#E1C47D] animate-ping" />
          <span className="text-[11px] font-bold tracking-widest text-[#F3E5AB] uppercase">
            LIVE
          </span>
        </div>
      </div>

      {/* Center Interactive Sphere & Prompts */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8 text-center space-y-8">
        
        {/* Concentric Glow Orb with Floating Mic */}
        <div className="relative flex items-center justify-center">
          {/* Subtle Outer Concentric Ring */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-[#C5A059]/20 flex items-center justify-center">
            {/* Middle Dotted Ring */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-[#E1C47D]/30 border-dashed flex items-center justify-center">
              
              {/* Central Glowing Gold/Amber Sphere */}
              <div 
                onClick={toggleListening}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#E1C47D] via-[#C5A059] to-[#8E6D28] shadow-[0_0_50px_rgba(197,160,89,0.4)] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 ${
                  isListening ? 'animate-pulse ring-8 ring-amber-500/30' : ''
                }`}
              >
                <Mic className="w-10 h-10 sm:w-11 sm:h-11 text-black stroke-[2.2]" />
              </div>

            </div>
          </div>

          {/* Equalizer Ring Waveform when Active */}
          {(isListening || isPlayingAudio) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-52 h-52 rounded-full border-2 border-[#F3E5AB]/40 animate-ping" />
            </div>
          )}
        </div>

        {/* Text Section */}
        <div className="space-y-2 px-2 max-w-md">
          <h2 className="text-2xl sm:text-3xl font-extrabold metallic-gold-shimmer tracking-wide">
            ክትዛረብ ማይክ ጠውቕ
          </h2>
        </div>

        {/* Real-time Status / Transcript / Audio Playback Pill */}
        {isListening ? (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
            <Radio className="w-3.5 h-3.5 animate-spin" />
            <span>ይሰምዕ ኣሎ... ሕጂ ተዛረቡ (Listening)</span>
          </div>
        ) : isPlayingAudio ? (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
            <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>ጓል ኤረይ ትዛረብ ኣላ...</span>
            <button onClick={stopAudio} className="ml-1 underline text-rose-300 hover:text-rose-200">
              ደው ኣብል
            </button>
          </div>
        ) : isLoading ? (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-200 text-xs font-bold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>ሓበሬታ የዳልው ኣሎ...</span>
          </div>
        ) : null}

        {/* Assistant Speech Response Overlay Box (if available) */}
        {assistantReply && !isLoading && (
          <div className="w-full bg-[#101226]/90 border border-indigo-500/40 rounded-2xl p-4 text-left space-y-2 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-1.5 border-b border-indigo-900/40">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>ጓል ኣክሱም (Axumite AI)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSpeakAudio(assistantReply)}
                  className="p-1 rounded-lg bg-indigo-950 text-indigo-300 hover:text-white text-[10px] font-mono border border-indigo-800/50 flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Replay</span>
                </button>
                <button
                  onClick={() => setAssistantReply(null)}
                  className="text-slate-400 hover:text-slate-200 text-xs px-1"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans whitespace-pre-wrap max-h-48 overflow-y-auto">
              {assistantReply}
            </p>
          </div>
        )}

        {/* Dual Purpose Quick Studio Launchers */}
        <div className="w-full grid grid-cols-2 gap-2.5 pt-2">
          {/* Purpose 1: ድምጺ ናብ ጽሑፍ */}
          <button
            type="button"
            onClick={() => {
              setSpeechStudioMode('stt');
              setIsSpeechStudioOpen(true);
            }}
            className="bg-[#141220]/90 hover:bg-[#1C182E] border border-blue-500/30 hover:border-blue-500/60 rounded-2xl p-2.5 text-left transition-all group flex items-center space-x-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-md shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block group-hover:text-blue-300 transition-colors truncate">
                ድምጺ ናብ ጽሑፍ
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                Speech to Text
              </span>
            </div>
          </button>

          {/* Purpose 2: ጽሑፍ ናብ ድምጺ */}
          <button
            type="button"
            onClick={() => {
              setSpeechStudioMode('tts');
              setIsSpeechStudioOpen(true);
            }}
            className="bg-[#141220]/90 hover:bg-[#1C182E] border border-red-500/30 hover:border-red-500/60 rounded-2xl p-2.5 text-left transition-all group flex items-center space-x-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#DC2626] via-[#EF4444] to-[#F87171] flex items-center justify-center text-white shadow-md shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block group-hover:text-red-300 transition-colors truncate">
                ጽሑፍ ናብ ድምጺ
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                Text to Speech
              </span>
            </div>
          </button>
        </div>

      </div>

      {/* Voice Commands Cheat Sheet Modal */}
      <VoiceCommandsModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
        onExecuteCommand={(cmd) => {
          setVoiceInput(cmd);
          handleExecuteVoiceQuery(cmd);
        }}
      />

      {/* Dedicated Dual Purpose Speech Studio Modal */}
      <SpeechStudioModal
        isOpen={isSpeechStudioOpen}
        onClose={() => setIsSpeechStudioOpen(false)}
        initialMode={speechStudioMode}
        user={user}
        onNavigateToChat={(prompt) => {
          setIsSpeechStudioOpen(false);
          onNavigateTab('chat');
        }}
      />

    </div>
  );
};

