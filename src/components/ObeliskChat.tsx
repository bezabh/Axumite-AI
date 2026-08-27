import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, QueryMode, SavedItem, UserProfile } from '../types';
import { Send, Volume2, VolumeX, BookmarkPlus, Sparkles, Cpu, Scroll, Code, ShieldAlert, Copy, Check, Loader2, RefreshCw, Mic, MicOff, Globe, WifiOff } from 'lucide-react';
import { getOfflineAIResponse } from '../utils/offlineData';
import { useLanguage } from '../context/LanguageContext';
import { checkGuestLimit, incrementGuestUsage } from '../utils/guestManager';
import { GuestLimitBanner } from './GuestLimitBanner';
import { playVoiceTriggerChime } from '../utils/audioChime';
import { AxumiteTypingIndicator } from './AxumiteTypingIndicator';
import { StreamingMessageText } from './StreamingMessageText';
import logoImg from '../assets/images/axumite_ai_logo_1786607890310.jpg';
import heroBgImg from '../assets/images/axumite_hero_bg_1786607906422.jpg';
import geezIconImg from '../assets/images/geez_fidel_icon_1786607918022.jpg';

interface ObeliskChatProps {
  onSaveInsight: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  initialPrompt?: string;
  onPromptConsumed?: () => void;
  user?: UserProfile;
  onOpenAuthModal?: (mode?: 'login' | 'signup' | 'otp') => void;
}

export const ObeliskChat: React.FC<ObeliskChatProps> = ({ 
  onSaveInsight,
  initialPrompt,
  onPromptConsumed,
  user,
  onOpenAuthModal,
}) => {
  const { language, t } = useLanguage();
  const [guestLimitState, setGuestLimitState] = useState(() =>
    checkGuestLimit('chat', user?.email, user?.role)
  );

  useEffect(() => {
    setGuestLimitState(checkGuestLimit('chat', user?.email, user?.role));
  }, [user]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: language === 'ti' 
        ? `ሰላም! ኣነ **ኣክሱማዊ AI (AXUMITE AI)** እየ። ብባህላዊ ውርሻን ዘመናዊ ናይ ኣርቲፊሻል ኢንተለጀንስ ቴክኖሎጂን ዝተሃነጸ ናይ ሓበሬታን ሓገዝን ስርዓት።

ብትግርኛ ወይ ብእንግሊዝኛ ዝኾነ ሕቶ ክትሓቱ ትኽእሉ ኢኹም፦
• **ቋንቋን ትርጉምን**: ትግርኛ፣ ግዕዝን ዓለምለኻዊ ቋንቋታትን
• **ቴክኖሎጂን ሳይንስን**: ኮዲንግ፣ ሶፍትዌርን ኢንጂነሪንግን
• **ስራሕን ንግድን**: ናይ ስራሕ ዕድላት፣ ጽሑፋትን ፕላንን
• **ስእልን ፈጠራን**: 8K ፕሮምፕት ምፍጣርን ምርመራን`
        : `Greetings! I am **AXUMITE AI**, powered by Axumite Heritage & Advanced Multilingual Intelligence.

Ask any question in Tigrinya or English:
• **Languages & Translation**: Tigrinya, Ge'ez, and multilingual translation
• **Technology & Engineering**: Coding, modern software, and sciences
• **Business & Career**: Professional advice, documents, and CV assistance
• **Creative & Vision**: 8K photographic prompts and visual analysis`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<QueryMode>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);

  // Tigrinya & Voice State
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<'ti-ET' | 'ti-ER' | 'en-US'>('ti-ET');
  const [wasVoiceInput, setWasVoiceInput] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Tigrinya Feedback State
  const [feedbackMsgId, setFeedbackMsgId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackLog, setFeedbackLog] = useState<Record<string, { rating: string; note?: string }>>({});
  const [tigrinyaToast, setTigrinyaToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Subtle luxury gold sound chime synthesized via Web Audio API
  const playLuxuryChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      // Elegant Axumite two-stage golden chime (E5 -> G#5 harmonics)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.setValueAtTime(830.61, now + 0.08); // G#5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.55);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.55);
    } catch (e) {
      console.warn('Audio chime playback notice:', e);
    }
  };

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setInput(initialPrompt);
      if (onPromptConsumed) {
        onPromptConsumed();
      }
    }
  }, [initialPrompt, onPromptConsumed]);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser version. You can type Tigrinya (ትግርኛ) directly into the text field!");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        playVoiceTriggerChime();
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = speechLang;

        let hasRecordedText = false;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setInput(currentTranscript);
            setWasVoiceInput(true);
            hasRecordedText = true;
          }
        };

        recognition.onerror = (err: any) => {
          setIsListening(false);
          if (err?.error === 'not-allowed' || err?.error === 'service-not-allowed') {
            // Provide a graceful fallback prompt in input
            setInput((prev) => prev || 'ሰላም፡ ብዛዕባ ታሪኽ ኣክሱም ንገረኒ።');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          if (hasRecordedText) {
            playLuxuryChime();
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
        setInput((prev) => prev || 'ሰላም፡ ብዛዕባ ታሪኽ ኣክሱም ንገረኒ።');
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    // Check guest limit
    const currentLimit = checkGuestLimit('chat', user?.email, user?.role);
    if (!currentLimit.allowed) {
      setGuestLimitState(currentLimit);
      const limitMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        content: language === 'ti'
          ? `⚠️ **ናይ ጋሻ ደረት ተወዲኡ እዩ (Guest Query Limit Exceeded)**\n\nከም ጋሻ መጠን ዝተፈቕደልኩም ናይ መዓልቲ ${currentLimit.max} ሕቶታት ተጠቒምኩም ኣለኹም።\n\nምሉእ ብዘይ ደረት ግልጋሎት ንምርካብ፡ በጃኹም **ተመዝገቡ** ወይ ብሕሳብኩም **እተዉ**።`
          : `⚠️ **Guest Daily Limit Reached**\n\nYou have used all ${currentLimit.max} free guest queries for today.\n\nPlease register or sign in for unlimited AI intelligence.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
      };
      setMessages((prev) => [...prev, limitMessage]);
      return;
    }

    // Increment guest usage
    incrementGuestUsage('chat', user?.email, user?.role);
    setGuestLimitState(checkGuestLimit('chat', user?.email, user?.role));

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      let aiResultText = '';
      let usedOffline = false;

      if (!navigator.onLine) {
        aiResultText = getOfflineAIResponse(textToSend);
        usedOffline = true;
      } else {
        // Build conversation context
        const history = messages
          .filter((m) => m.id !== 'welcome-1')
          .slice(-6)
          .map((m) => ({ role: m.role, content: m.content }));

        try {
          const res = await fetch('/api/obelisk/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: textToSend,
              mode,
              conversationHistory: history,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Network error');
          }
          aiResultText = data.result;
        } catch (fetchErr) {
          console.warn('Network query failed, utilizing offline database fallback:', fetchErr);
          aiResultText = getOfflineAIResponse(textToSend);
          usedOffline = true;
        }
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: aiResultText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
        isOfflineFallback: usedOffline,
      };

      setStreamingMessageId(aiMessage.id);
      setMessages((prev) => [...prev, aiMessage]);

      // Auto-save transcript to localStorage ('axumite_saved_insights') if voice or Tigrinya detected
      const containsTigrinya = /[\u1200-\u137F]/.test(textToSend) || /[\u1200-\u137F]/.test(aiResultText);
      if (wasVoiceInput || containsTigrinya || usedOffline) {
        onSaveInsight({
          title: `[${usedOffline ? 'Offline ' : ''}ትግርኛ Transcript] ${textToSend.substring(0, 35)}...`,
          type: 'chat',
          content: `User Spoken/Typed Prompt: "${textToSend}"\n\nAXUMITE AI Response:\n${aiResultText}`,
          tags: ['tigrinya', wasVoiceInput ? 'voice-transcript' : 'tigrinya-chat', usedOffline ? 'offline-cache' : 'online'],
        });
        setTigrinyaToast(usedOffline ? 'ብዘይ ኢንተርነት ኣብ Local Cache ተዓቂቡ ኣሎ። (Saved Offline)' : 'ትራንስክሪፕት ብትክክል ኣብ Saved Insights ተዓቂቡ ኣሎ።');
        setTimeout(() => setTigrinyaToast(null), 4000);
      }
    } catch (err: any) {
      console.error('Chat query error:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `⚠️ **Axumite Alert**: ${err.message || 'Unable to complete query context.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setWasVoiceInput(false);
    }
  };

  const submitTigrinyaFeedback = (msgId: string, rating: string, noteText?: string) => {
    setFeedbackLog((prev) => ({ ...prev, [msgId]: { rating, note: noteText } }));
    setFeedbackMsgId(null);
    setFeedbackText('');

    const targetMsg = messages.find((m) => m.id === msgId);
    onSaveInsight({
      title: `[ትግርኛ Feedback] Rating: ${rating}`,
      type: 'chat',
      content: `User Feedback (${rating}): ${noteText || 'No extra note'}\n\nRelated AI Output:\n${targetMsg?.content || ''}`,
      tags: ['feedback', 'tigrinya-feedback', rating],
    });

    setTigrinyaToast('የቐንየልና! ርእይቶኻ ብትክክል ተቐቢልናዮ ኣለና። (Feedback Recorded)');
    setTimeout(() => setTigrinyaToast(null), 4000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeech = async (msg: ChatMessage) => {
    if (playingAudioId === msg.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingAudioId(null);
      }
      return;
    }

    try {
      setLoadingAudioId(msg.id);
      const res = await fetch('/api/obelisk/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.content.substring(0, 400) }), // First 400 chars
      });

      const data = await res.json();
      if (!res.ok || !data.audioBase64) {
        // Fallback to browser SpeechSynthesis smoothly
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(msg.content.substring(0, 300));
          utterance.lang = 'ti-ER';
          utterance.rate = 0.95;
          const voices = window.speechSynthesis.getVoices();
          const hornVoice = voices.find(
            (v) =>
              v.lang.startsWith('ti') ||
              v.lang.startsWith('am') ||
              v.name.toLowerCase().includes('tigrinya') ||
              v.name.toLowerCase().includes('amharic')
          );
          if (hornVoice) utterance.voice = hornVoice;

          utterance.onend = () => setPlayingAudioId(null);
          utterance.onerror = () => setPlayingAudioId(null);
          window.speechSynthesis.speak(utterance);
          setPlayingAudioId(msg.id);
        }
        return;
      }

      // Convert PCM base64 or create web audio URL
      const audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;

      newAudio.onended = () => setPlayingAudioId(null);
      newAudio.play().then(() => {
        setPlayingAudioId(msg.id);
      }).catch(() => {
        // Fallback to SpeechSynthesis if raw PCM browser playback fails
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(msg.content.substring(0, 300));
          utterance.lang = 'ti-ER';
          utterance.rate = 0.95;
          utterance.onend = () => setPlayingAudioId(null);
          window.speechSynthesis.speak(utterance);
          setPlayingAudioId(msg.id);
        }
      });
    } catch (err) {
      console.warn('Backend TTS notice, using fallback synthesis:', err);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(msg.content.substring(0, 300));
        utterance.lang = 'ti-ER';
        utterance.rate = 0.95;
        utterance.onend = () => setPlayingAudioId(null);
        window.speechSynthesis.speak(utterance);
        setPlayingAudioId(msg.id);
      }
    } finally {
      setLoadingAudioId(null);
    }
  };

  const quickStarters = [
    { label: '🏛️ ታሪክን ቅርስን', prompt: 'ብትግርኛ ቋንቋ ብዛዕባ ታሪክ ስልጣነ ኣክሱም፡ ስነ-ህንጻ ሓወልትታትን ንጉስ እዛናን ተንቲንካ ግለጸለይ።' },
    { label: '⚡ ቴክኖሎጂን ኮዲንግን', prompt: 'ብትግርኛ ቋንቋ፡ ብዛዕባ Web Development, Full-stack TypeScript architecture, ን API integration ን ብግልጺ ኣብራህ።' },
    { label: '🌐 ትርጉምን ቋንቋን', prompt: 'ብትግርኛ ቋንቋ ብዛዕባ ታሪካዊ ምዕባለ ፊደል ግዕዝን ትግርኛን፡ ኣብ ዞባና ዘለዎ ስነ-ጽሑፋዊ ውርሻን ሓብረኒ።' },
    { label: '🎨 8K ስእላዊ ፈጠራ', prompt: 'ብትግርኛ ቋንቋ ሓደ ብሉጽ 8K Photographic Prompt ብዛዕባ ወርቃዊ ዝፋን ኣክሱምን ጥንታዊ ቤተ-መንግስትን ኣዳሉወለይ።' },
    { label: '💼 ንግድን ስራሕን', prompt: 'ብትግርኛ ቋንቋ፡ ንናይ ንግዲ ትልሚ (Business Plan) ወይ ናይ ስራሕ ቃለ-መሕትት ምድላው ዝኸውን ሓገዝን መምርሕን ሃበኒ።' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Guest Limitation Banner */}
      {user?.role === 'Guest' && (
        <GuestLimitBanner
          feature="chat"
          remaining={guestLimitState.remaining}
          max={guestLimitState.max}
          onOpenUpgradeOrAuth={() => {
            if (onOpenAuthModal) onOpenAuthModal('signup');
          }}
        />
      )}

      {/* Messages Feed */}
      <div className="bg-[#060606] border border-[#8E6D28]/25 rounded-3xl p-4 sm:p-6 min-h-[480px] max-h-[620px] overflow-y-auto space-y-6 shadow-2xl">
        {tigrinyaToast && (
          <div className="bg-[#14110B] border border-[#C5A059] p-3 text-xs text-[#F3E5AB] flex items-center justify-between rounded-2xl animate-fade-in shadow-lg">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C5A059] animate-spin" />
              <span>{tigrinyaToast}</span>
            </div>
            <button onClick={() => setTigrinyaToast(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 group`}
            >
              <div className="flex items-center space-x-2 text-[10px] text-gray-400 px-2 font-mono uppercase tracking-widest">
                <span>{isUser ? 'YOU (ስምኻ)' : 'AXUMITE AI (ኣክሱማዊ AI)'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.mode && (
                  <span className="text-[9px] px-2 py-0.5 bg-[#14110B] text-[#C5A059] border border-[#8E6D28]/40 rounded-full font-bold">
                    {msg.mode}
                  </span>
                )}
              </div>

              <div
                className={`max-w-[88%] sm:max-w-[82%] p-4 text-sm leading-relaxed rounded-2xl ${
                  isUser
                    ? 'bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black font-semibold border border-[#F3E5AB]/40 shadow-xl rounded-tr-none'
                    : 'bg-[#0B0B0C] text-gray-200 border border-[#8E6D28]/30 shadow-xl rounded-tl-none'
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap font-sans text-[13.5px]">
                    {msg.content}
                  </div>
                ) : (
                  <StreamingMessageText
                    content={msg.content}
                    isStreaming={streamingMessageId === msg.id}
                    onStreamComplete={() => setStreamingMessageId(null)}
                    onAutoScroll={scrollToBottom}
                  />
                )}

                {/* AI Message Action Toolbar */}
                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-[#8E6D28]/20 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleSpeech(msg)}
                          disabled={loadingAudioId === msg.id}
                          className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#12100C] hover:bg-[#1A160F] border border-[#8E6D28]/30 rounded-full text-gray-300 transition-colors"
                          title="Synthesize and Listen to Audio"
                        >
                          {loadingAudioId === msg.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                          ) : playingAudioId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                          )}
                          <span className="text-[10px] uppercase font-bold tracking-wider">
                            {playingAudioId === msg.id ? 'ደው ኣብሎ (Stop)' : 'ስምዕ (Listen)'}
                          </span>
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#12100C] hover:bg-[#1A160F] border border-[#8E6D28]/30 rounded-full text-gray-300 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                          )}
                          <span className="text-[10px] uppercase font-bold tracking-wider">
                            {copiedId === msg.id ? 'ተቐዲሑ (Copied)' : 'ቅዳሕ (Copy)'}
                          </span>
                        </button>

                        {/* Tigrinya Feedback Buttons */}
                        <div className="flex items-center space-x-1 pl-2 border-l border-[#8E6D28]/30">
                          <button
                            onClick={() => submitTigrinyaFeedback(msg.id, 'ብሉጽ (Helpful)')}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-colors ${
                              feedbackLog[msg.id]?.rating.includes('ብሉጽ')
                                ? 'bg-[#8E6D28]/30 border-[#C5A059] text-[#F3E5AB]'
                                : 'bg-[#080808] border-[#8E6D28]/20 text-gray-400 hover:text-emerald-300'
                            }`}
                            title="Give positive Tigrinya feedback"
                          >
                            👍 ብሉጽ
                          </button>
                          <button
                            onClick={() => setFeedbackMsgId(feedbackMsgId === msg.id ? null : msg.id)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-colors ${
                              feedbackMsgId === msg.id
                                ? 'bg-[#8E6D28]/30 border-[#C5A059] text-[#F3E5AB]'
                                : 'bg-[#080808] border-[#8E6D28]/20 text-gray-400 hover:text-[#C5A059]'
                            }`}
                            title="Write detailed feedback in Tigrinya"
                          >
                            💡 ርእይቶ
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          onSaveInsight({
                            title: msg.content.substring(0, 45) + '...',
                            type: 'chat',
                            content: msg.content,
                            tags: ['chat', msg.mode || 'general'],
                          })
                        }
                        className="flex items-center space-x-1 px-2.5 py-1 bg-[#8E6D28]/15 hover:bg-[#8E6D28]/30 border border-[#8E6D28]/40 rounded-full text-[#C5A059] transition-colors"
                        title="Save to Favorite Insights"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">ዓቅብ (Save)</span>
                      </button>
                    </div>

                    {/* Expandable Tigrinya Feedback Drawer */}
                    {feedbackMsgId === msg.id && (
                      <div className="bg-[#050505] p-3 rounded-2xl border border-[#8E6D28]/40 space-y-2 mt-2">
                        <label className="text-[11px] text-[#C5A059] font-medium block">
                          ርእይቶኻ ብትግርኛ ጽሓፍ (Write your Tigrinya feedback):
                        </label>
                        <input
                          type="text"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="እዚ መልሲ ብሉጽ ነይሩ፣ ወይ ድማ ሓበሬታ ወስኸሉ..."
                          className="w-full bg-[#0E0E0E] border border-[#8E6D28]/30 p-2 text-xs text-slate-100 rounded-xl focus:outline-none focus:border-[#C5A059]"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setFeedbackMsgId(null)}
                            className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-white"
                          >
                            ሰርዝ (Cancel)
                          </button>
                          <button
                            onClick={() => submitTigrinyaFeedback(msg.id, 'ርእይቶ (Detailed Feedback)', feedbackText)}
                            className="px-3.5 py-1 bg-[#14110B] border border-[#8E6D28] text-[10px] text-[#F3E5AB] rounded-full uppercase tracking-wider hover:bg-[#8E6D28]/30 font-semibold"
                          >
                            ርእይቶ ፈኑ (Submit)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Feedback Status Badge */}
                    {feedbackLog[msg.id] && (
                      <div className="text-[10px] text-emerald-400/90 font-mono pt-1">
                        ✓ ርእይቶኻ ተቐቢልናዮ ኣለና: {feedbackLog[msg.id].rating} {feedbackLog[msg.id].note ? `("${feedbackLog[msg.id].note}")` : ''}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Animated Reasoning & Multi-Phase Typing Indicator */}
        {isLoading && <AxumiteTypingIndicator mode={mode} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Starters Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] text-[#C5A059] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
          QUICK PROMPTS:
        </span>
        {quickStarters.map((qs, i) => (
          <button
            key={i}
            onClick={() => handleSend(qs.prompt)}
            disabled={isLoading}
            className="px-3.5 py-1.5 bg-[#080808] hover:bg-[#14110C] border border-[#8E6D28]/30 text-gray-300 text-xs rounded-full whitespace-nowrap transition-all shadow-sm"
          >
            {qs.label}
          </button>
        ))}
      </div>

      {/* Floating Input Box */}
      <div className="relative bg-[#080808] border border-[#8E6D28]/40 p-3 rounded-3xl stela-glow focus-within:border-[#C5A059] transition-all shadow-2xl">
        <textarea
          id="chat-input-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t.chatPlaceholder}
          className="w-full bg-transparent text-slate-100 text-sm placeholder-gray-500 focus:outline-none resize-none px-3 py-1.5 min-h-[65px]"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#8E6D28]/20 px-2">
          
          {/* Left Controls: Tigrinya Mic & Language selector */}
          <div className="flex items-center space-x-2">
            
            {/* Mic Toggle Button */}
            <button
              onClick={toggleListening}
              type="button"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 border text-xs font-bold rounded-full uppercase tracking-wider transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-[#0F0D09] border-[#8E6D28]/40 text-[#F3E5AB] hover:border-[#8E6D28]'
              }`}
              title="Click to speak via Web Speech API microphone"
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                  <span>{t.voiceListening}</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{language === 'ti' ? 'ድምጺ' : 'Voice Input'}</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-[#060606] border border-[#8E6D28]/30 px-2.5 py-1 rounded-full">
              <Globe className="w-3 h-3 text-[#C5A059]" />
              <select
                value={speechLang}
                onChange={(e: any) => setSpeechLang(e.target.value)}
                className="bg-transparent text-[11px] text-gray-300 focus:outline-none cursor-pointer font-sans"
              >
                <option value="ti-ER" className="bg-[#080808] text-gray-200">ትግርኛ (Tigrinya)</option>
                <option value="en-US" className="bg-[#080808] text-gray-200">English (en-US)</option>
              </select>
            </div>

            {isListening && (
              <span className="text-[10px] text-rose-400 font-mono animate-pulse hidden sm:inline">
                ● {t.voiceListening}
              </span>
            )}
          </div>

          {/* Right Control: Transmit Button */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] hover:brightness-110 disabled:opacity-40 text-black font-extrabold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-lg"
          >
            <span>{t.send}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
