import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, RotateCcw, Mic, MicOff, CheckCircle2, 
  Sparkles, X, ChevronDown, ChevronUp, Shield, Crown, Play, Square, Activity
} from 'lucide-react';
import { 
  playTigrinyaWelcomeAudio, 
  stopWelcomeAudio, 
  getWelcomeGreetingText 
} from '../utils/welcomeAudioService';
import { UserProfile } from '../types';

interface WelcomeAudioGreetingToastProps {
  user: UserProfile;
  isVisible: boolean;
  onClose: () => void;
}

export const WelcomeAudioGreetingToast: React.FC<WelcomeAudioGreetingToastProps> = ({
  user,
  isVisible,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [micLevel, setMicLevel] = useState<number>(0);
  const [micPermissionState, setMicPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  const isSuperAdmin = (user?.email || '').trim().toLowerCase() === 'beckylove2004@gmail.com';
  const { textTi, textEn, phoneticTi } = getWelcomeGreetingText(user?.email, user?.name);

  // Play audio greeting
  const handlePlayGreeting = async () => {
    setIsPlaying(true);
    await playTigrinyaWelcomeAudio(
      user?.email,
      user?.name,
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const handleStopGreeting = () => {
    stopWelcomeAudio();
    setIsPlaying(false);
  };

  // Test microphone hardware capability
  const toggleMicTest = async () => {
    if (isMicTesting) {
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
        setMicStream(null);
      }
      setIsMicTesting(false);
      setMicLevel(0);
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Microphone recording is not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setMicPermissionState('granted');
      setIsMicTesting(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      const microphone = audioCtx.createMediaStreamSource(stream);
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 256;
      microphone.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!stream.active) return;
        analyser.getByteFrequencyData(dataArray);
        let values = 0;
        const length = dataArray.length;
        for (let i = 0; i < length; i++) {
          values += dataArray[i];
        }
        const average = values / length;
        setMicLevel(Math.min(100, Math.round((average / 128) * 100)));
        requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err: any) {
      console.warn('Microphone permission notice:', err);
      setMicPermissionState('denied');
      setIsMicTesting(false);
    }
  };

  useEffect(() => {
    return () => {
      stopWelcomeAudio();
      if (micStream) {
        micStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [micStream]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className="fixed bottom-20 right-4 md:right-8 z-50 max-w-md w-[calc(100vw-2rem)] bg-[#0c1220]/95 backdrop-blur-xl border border-[#D4AF37]/40 rounded-2xl shadow-2xl shadow-amber-950/40 p-4 text-white overflow-hidden"
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#F3E5AB] to-amber-500 animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          {/* Avatar / Audio Icon with Animated Pulse */}
          <div className="relative flex-shrink-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${
              isSuperAdmin 
                ? 'bg-gradient-to-br from-amber-500/30 via-yellow-600/20 to-amber-900/40 border-[#F3E5AB]/70 text-[#F3E5AB]' 
                : 'bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border-cyan-400/50 text-cyan-300'
            }`}>
              {isPlaying ? (
                <Volume2 className="w-6 h-6 animate-bounce text-[#F3E5AB]" />
              ) : isSuperAdmin ? (
                <Crown className="w-6 h-6 text-[#F3E5AB]" />
              ) : (
                <Sparkles className="w-6 h-6 text-cyan-300" />
              )}
            </div>

            {/* Audio waveform active badge */}
            {isPlaying && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 items-center justify-center text-[9px] font-bold text-slate-950">
                  ♫
                </span>
              </span>
            )}
          </div>

          {/* Greeting Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F3E5AB]/10 text-[#F3E5AB] border border-[#F3E5AB]/30 flex items-center gap-1">
                <span>🔊</span>
                <span>Tigrinya Audio Greeting (ትግርኛ ድምጺ)</span>
              </span>
              {isSuperAdmin ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-amber-300 border border-amber-400/60 flex items-center gap-0.5">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Superadmin</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-cyan-500/40">
                  👤 Guest
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-[#F3E5AB] leading-snug line-clamp-2">
              {textTi}
            </p>
            <p className="text-[11px] text-amber-200/70 mt-0.5 line-clamp-1 font-mono">
              🗣️ {phoneticTi}
            </p>
            <p className="text-[11.5px] text-slate-300/80 mt-0.5 line-clamp-1 italic">
              {textEn}
            </p>

            {/* Active Sound Wave Equalizer Bars when Playing */}
            {isPlaying && (
              <div className="flex items-end gap-1 h-4 mt-2.5 px-2 py-0.5 rounded bg-black/40 border border-amber-500/20 w-fit">
                {[40, 80, 55, 95, 70, 85, 45, 90, 60].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['20%', `${h}%`, '30%'] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 0.4 + (i % 3) * 0.15,
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-gradient-to-t from-amber-500 to-[#F3E5AB] rounded-full"
                    style={{ height: `${h}%` }}
                  />
                ))}
                <span className="text-[9.5px] text-[#F3E5AB] ml-1.5 font-mono">
                  Synthesizing Speech...
                </span>
              </div>
            )}

            {/* Audio Controls */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
              {isPlaying ? (
                <button
                  onClick={handleStopGreeting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 transition-all shadow-sm"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>ደው ኣብል (Stop)</span>
                </button>
              ) : (
                <button
                  onClick={handlePlayGreeting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ደጊምካ ስምዕ (Replay Greeting)</span>
                </button>
              )}

              {/* Hardware Mic Tester Toggle */}
              <button
                onClick={toggleMicTest}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isMicTesting
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 animate-pulse'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                }`}
                title="Test microphone capability and voice recognition input"
              >
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>{isMicTesting ? 'ድምጺ ይስማዕ ኣሎ' : 'ድምጺ ፈትሽ (Mic Test)'}</span>
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Toggle details"
              >
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Mic Live Level Indicator */}
            {isMicTesting && (
              <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-emerald-500/40">
                <div className="flex items-center justify-between text-[11px] text-emerald-300 mb-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>Microphone Input Level:</span>
                  </span>
                  <span>{micLevel}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 via-yellow-400 to-amber-500 h-full transition-all duration-75"
                    style={{ width: `${Math.max(5, micLevel)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  🎙️ Microphone hardware stream active. Speak in Tigrinya or English to test sensitivity.
                </p>
              </div>
            )}

            {/* Expanded Details & Audio Diagnostics */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span>Audio Engine:</span>
                  <span className="text-[#F3E5AB] font-mono">Gemini TTS / Web Audio API</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Language Dialect:</span>
                  <span className="text-white font-mono">ti-ER (Tigrinya)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Microphone Permission:</span>
                  <span className={micPermissionState === 'granted' ? 'text-emerald-400' : 'text-slate-300'}>
                    {micPermissionState === 'granted' ? '✓ Granted' : 'Ready on prompt'}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
            title="Dismiss Welcome Greeting"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
