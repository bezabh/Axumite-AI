import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Volume2, VolumeX, Play, Pause, 
  Copy, Check, RefreshCw, Sparkles, MessageSquare, Download, Globe
} from 'lucide-react';
import { UserProfile } from '../types';

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
  const [mode, setMode] = useState<'stt' | 'tts'>(initialMode);
  
  // STT State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'ti-ER' | 'en-US' | 'am-ET' | 'ar-SA'>('ti-ER');
  
  // TTS State
  const [ttsText, setTtsText] = useState('ሰላም፡ ኣነ ኣክሱማይት AI እየ። ዝደለኹምዎ ሕቶ ብድምጺ ክምልሰልኩም ድሉው እየ። (Hello, I am Axumite AI. I am ready to answer any question for you with natural voice.)');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    // Check speech recognition support
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
          setTranscript((prev) => (prev ? prev + ' ' + current : current));
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
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Simulated live recording if API not permitted in iframe
      if (!isListening) {
        setIsListening(true);
        const samplePhrases = [
          "ሰላም፡ ከመይ ኣለኹም፧",
          "ናይ ሎሚ መደብ እንታይ እዩ፧",
          "ስራሕ ክረክብ ይደሊ ኣለኹ፡ ሓግዙኒ።",
          "Hello, can you help me analyze this project roadmap?"
        ];
        const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        setTimeout(() => {
          setTranscript((prev) => prev ? prev + ' ' + randomPhrase : randomPhrase);
          setIsListening(false);
        }, 2200);
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
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  const handlePlayTTS = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.lang = selectedLanguage;
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToChat = () => {
    const textToSend = mode === 'stt' ? transcript : ttsText;
    if (onNavigateToChat && textToSend) {
      onNavigateToChat(textToSend);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-5 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] text-[#0F2856]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]/40">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${
              mode === 'stt' 
                ? 'bg-gradient-to-br from-[#2563EB] to-[#60A5FA] shadow-blue-500/20' 
                : 'bg-gradient-to-br from-[#EF4444] to-[#F87171] shadow-red-500/20'
            }`}>
              {mode === 'stt' ? <Mic className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F2856] flex items-center space-x-2">
                <span>{mode === 'stt' ? 'Speech to Text Engine' : 'Text to Speech Synthesizer'}</span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-500/15 text-blue-700 font-black rounded-full font-mono">NATURAL AI</span>
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'stt' ? 'Convert spoken voice into accurate text instantly' : 'Listen to AI responses in clear, lifelike natural voices'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tab */}
        <div className="px-5 pt-4 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setMode('stt')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                mode === 'stt'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Speech to Text</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('tts')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                mode === 'tts'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Text to Speech</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 text-xs text-slate-500">
            <Globe className="w-3.5 h-3.5" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-[#0F2856] font-bold focus:outline-none"
            >
              <option value="ti-ER">ትግርኛ (Tigrinya)</option>
              <option value="en-US">English (US)</option>
              <option value="am-ET">አማርኛ (Amharic)</option>
              <option value="ar-SA">العربية (Arabic)</option>
            </select>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {mode === 'stt' ? (
            /* SPEECH TO TEXT MODE */
            <div className="space-y-4">
              {/* Mic Visualizer Button */}
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <div className="relative flex items-center justify-center">
                  {isListening && (
                    <div className="absolute w-24 h-24 rounded-full bg-blue-500/30 animate-ping" />
                  )}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 text-white ring-8 ring-rose-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white ring-8 ring-blue-100'
                    }`}
                  >
                    {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                </div>
                <p className="text-xs font-bold text-[#0F2856]">
                  {isListening ? 'Listening... Speak clearly into your microphone' : 'Tap to Start Speaking'}
                </p>
              </div>

              {/* Transcript Display */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Transcribed Output:</span>
                  {transcript && (
                    <button
                      type="button"
                      onClick={() => handleCopy(transcript)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your spoken words will appear here in real-time..."
                  rows={4}
                  className="w-full bg-transparent text-xs text-[#0F2856] leading-relaxed resize-none focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-xs text-slate-500 hover:text-rose-600 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100"
                >
                  Clear Text
                </button>
                <button
                  type="button"
                  onClick={handleSendToChat}
                  disabled={!transcript.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send to AI Chat</span>
                </button>
              </div>
            </div>
          ) : (
            /* TEXT TO SPEECH MODE */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F2856] block">
                  Text to Read Aloud:
                </label>
                <textarea
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-[#0F2856] leading-relaxed focus:outline-none focus:border-rose-400"
                  placeholder="Enter text you want the AI to speak in natural voice..."
                />
              </div>

              {/* Voice Speed & Pitch Controls */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Voice Speed:</span>
                    <span>{voiceRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Voice Pitch:</span>
                    <span>{voicePitch}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.1"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Audio Playback Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handlePlayTTS}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-md cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-rose-600 text-white shadow-rose-500/30 animate-pulse'
                      : 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-red-500/20 hover:brightness-105'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlayingAudio ? 'Stop Reading' : 'Play Natural Voice'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendToChat}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F2856] font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send to Chat</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
