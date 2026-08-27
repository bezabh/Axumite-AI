import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Plus, Info, Image as ImageIcon, Mic, MicOff, Send, 
  Volume2, VolumeX, Copy, Check, Sparkles, Loader2, BookmarkPlus, X, RefreshCw 
} from 'lucide-react';
import { ChatMessage, SavedItem, UserProfile } from '../types';
import { checkGuestLimit, incrementGuestUsage } from '../utils/guestManager';

interface WrittenChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  initialPrompt?: string;
  onSaveInsight?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  onOpenAuthModal?: (mode?: 'login' | 'signup' | 'otp') => void;
}

export const WrittenChatModal: React.FC<WrittenChatModalProps> = ({
  isOpen,
  onClose,
  user,
  initialPrompt,
  onSaveInsight,
  onOpenAuthModal,
}) => {
  // Response length mode: 'short' (ሓጺር) vs 'long' (ነዊሕ)
  const [responseLength, setResponseLength] = useState<'short' | 'long'>('short');

  const INITIAL_WELCOME: ChatMessage = {
    id: 'welcome-gual-erey',
    role: 'model',
    content: 'ሰላም ሓፍተይ! ኣነ ጓል ኤረይ እየ። ሎሚ እንታይ ክሕግዘኪ፧',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'ti-ET';

        recog.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };

        recog.onerror = (e: any) => {
          setIsListening(false);
          if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
            setIsTypingMode(true);
          }
        };

        recog.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt && isOpen) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // Toggle Voice Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      // If native SpeechRecognition isn't supported, toggle typing mode
      setIsTypingMode(true);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (inputText.trim()) {
        sendMessage(inputText.trim());
      }
    } else {
      try {
        setInputText('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
        setIsTypingMode(true);
      }
    }
  };

  // Handle Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
      setIsTypingMode(true);
    };
    reader.readAsDataURL(file);
  };

  // Send Message
  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query && !attachedImage) return;

    // Check Guest Limit
    const currentLimit = checkGuestLimit('chat', user?.email, user?.role);
    if (!currentLimit.allowed) {
      setMessages((prev) => [
        ...prev,
        {
          id: `limit-${Date.now()}`,
          role: 'model',
          content: `⚠️ ደረት ናይ ጋሻ ዕላል ተወዲኡ እዩ (${currentLimit.max}/${currentLimit.max})። በጃኹም ብዘይደረት ንምጥቃም ተመዝገቡ ወይ ናብ ኣካውንትኩም እተዉ። (Guest Limit reached. Please sign in to continue.)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }

    incrementGuestUsage('chat', user?.email, user?.role);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    const currentImage = attachedImage;
    setAttachedImage(null);
    setIsLoading(true);

    try {
      let endpoint = '/api/obelisk/query';
      let requestBody: any = {
        prompt: responseLength === 'short' 
          ? `${query}\n\n[CRITICAL INSTRUCTION: Respond warmly as 'ጓል ኤረይ' (Gual Erey), in clear, natural, and concise Tigrinya (ትግርኛ Fidel script). Keep the response short, direct, and under 3-4 sentences.]`
          : `${query}\n\n[CRITICAL INSTRUCTION: Respond warmly as 'ጓል ኤረይ' (Gual Erey), in comprehensive, detailed, well-formatted, and elegant Tigrinya (ትግርኛ Fidel script).]`,
        mode: 'general',
        conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
      };

      // If an image was attached, use the vision endpoint
      if (currentImage) {
        endpoint = '/api/obelisk/vision';
        requestBody = {
          imageBase64: currentImage,
          prompt: query || "ነዛ ስእሊ ኣንብባ እሞ እንታይ ከምዝኾነት ብትግርኛ ግለጸለይ።",
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch AI response');
      }

      const replyContent = data.result || data.reply || 'ይቕሬታ፣ መልሲ ንምሃብ ጸገም ተፈጢሩ ኣሎ። በጃኹም ደጊምኩም ፈትኑ።';

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: 'ይቕሬታ፣ ሓፈሻዊ ናይ ሰርቨር ርክብ ተቋሪጹ ኣሎ። በጃኹም ኢንተርኔትኩም ኣረጋጊጽኩም ደጊምኩም ፈትኑ።',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to New Chat (+ ሓዳሽ)
  const handleNewChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: 'ሰላም ሓፍተይ! ኣነ ጓል ኤረይ እየ። ሎሚ እንታይ ክሕግዘኪ፧',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
    setAttachedImage(null);
  };

  // Copy message text
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Play Speech synthesis
  const handlePlayAudio = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (playingAudioId === id) {
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ti-ER';
    utterance.rate = 0.95;

    utterance.onstart = () => setPlayingAudioId(id);
    utterance.onend = () => setPlayingAudioId(null);
    utterance.onerror = () => setPlayingAudioId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Save to Insight Vault
  const handleSaveToVault = (text: string) => {
    if (!onSaveInsight) return;
    onSaveInsight({
      title: `ዕላል ጓል ኤረይ: ${text.substring(0, 30)}...`,
      type: 'chat',
      content: text,
      tags: ['gual-erey', 'chat', responseLength],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      {/* Hidden file input for Photo Attachment */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />

      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#F8FAFC] h-full sm:h-[92vh] sm:max-h-[820px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-[#1E293B] relative"
      >
        
        {/* ========================================================================= */}
        {/* TOP BAR: BACK ARROW, TITLE 'ዕላል ብጽሑፍ' & '+ ሓዳሽ' BUTTON                    */}
        {/* ========================================================================= */}
        <div className="pt-4 pb-3 px-4 sm:px-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-2xs">
          {/* Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Centered Title matching screenshot */}
          <div className="text-center flex-1 px-2">
            <h1 className="text-lg sm:text-xl font-black text-[#0F2856] tracking-tight">
              ዕላል ብጽሑፍ
            </h1>
          </div>

          {/* '+ ሓዳሽ' (New Chat) Button */}
          <button
            type="button"
            onClick={handleNewChat}
            className="py-1.5 px-3.5 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#194BFB] font-bold text-xs sm:text-sm flex items-center space-x-1 transition-all cursor-pointer active:scale-95 shadow-2xs border border-blue-100"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>ሓዳሽ</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TOP SPEED BANNER (MATCHING SCREENSHOT)                                    */}
        {/* ========================================================================= */}
        <div className="px-4 sm:px-5 pt-3 shrink-0">
          <div className="bg-[#E0F2FE]/80 border border-[#BAE6FD] rounded-2xl p-3 flex items-start space-x-2.5 text-[#0369A1] shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
              <Info className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-[13px] font-semibold leading-relaxed">
              መልሲ ሕቶታትኩም ብዝለዓለ ቅልጣፈ (ኣብ ትሕቲ 2 ካልኢት) ንምብጻሕ ንሰርሕ ኣለና።
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RESPONSE LENGTH TOGGLE PILLS: [ ሓጺር ] [ ነዊሕ ] (MATCHING SCREENSHOT)     */}
        {/* ========================================================================= */}
        <div className="px-4 sm:px-5 pt-3 pb-1 flex justify-center shrink-0">
          <div className="bg-[#E2E8F0]/70 p-1 rounded-full flex items-center space-x-1 border border-slate-200/60 shadow-inner">
            {/* ሓጺር (Short) */}
            <button
              type="button"
              onClick={() => setResponseLength('short')}
              className={`py-1.5 px-6 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                responseLength === 'short'
                  ? 'bg-white text-[#0F2856] shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              ሓጺር
            </button>

            {/* ነዊሕ (Long) */}
            <button
              type="button"
              onClick={() => setResponseLength('long')}
              className={`py-1.5 px-6 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                responseLength === 'long'
                  ? 'bg-white text-[#0F2856] shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              ነዊሕ
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCROLLABLE CHAT STREAM                                                    */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-3xl text-sm sm:text-base leading-relaxed transition-all shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#194BFB] text-white rounded-tr-xs shadow-blue-500/10 font-medium'
                    : 'bg-white text-[#0F2856] rounded-tl-xs border border-slate-200/80 font-bold'
                }`}
              >
                <div className="whitespace-pre-wrap select-text">
                  {msg.content}
                </div>

                {/* AI Bubble Actions */}
                {msg.role === 'model' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] font-medium text-slate-400">
                      {msg.timestamp}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      {/* Audio voice playback */}
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(msg.id, msg.content)}
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Listen to voice"
                      >
                        {playingAudioId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Copy message */}
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Save to Vault */}
                      {onSaveInsight && (
                        <button
                          type="button"
                          onClick={() => handleSaveToVault(msg.content)}
                          className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                          title="Save to vault"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* AI Generating Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-2">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 flex items-center space-x-2 text-slate-500 text-xs font-semibold shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#194BFB]" />
                <span>ጓል ኤረይ ትምልስ ኣላ... (Gual Erey is typing...)</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attached image preview */}
        {attachedImage && (
          <div className="px-4 sm:px-5 py-2 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200">
                <img src={attachedImage} alt="Attached" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold text-slate-600">ስእሊ ተተሓሒዙ ኣሎ (Image Attached)</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BOTTOM DOCK / INPUT BAR (EXACTLY MATCHING SCREENSHOT)                     */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shrink-0">
          
          {/* Floating Pill Dock Layout */}
          <div className="flex items-center space-x-2.5">
            
            {/* Left: Image / Photo Upload Button (Rounded square) */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-xs border border-slate-200/60"
              title="Attach Photo / Image"
            >
              <ImageIcon className="w-5 h-5 text-slate-600" />
            </button>

            {/* Center: Tap to Speak / Text input toggle */}
            {!isTypingMode ? (
              /* Tap to Speak Main Navy Pill Button */
              <div className="flex-1 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex-1 py-3.5 px-5 rounded-full font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/30'
                      : 'bg-[#0A1128] hover:bg-[#131E42] text-white shadow-slate-900/20'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>ይስማዕ ኣሎ... (ተዛረቡ)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>ጠቒምካ ተዛረብ</span>
                    </>
                  )}
                </button>

                {/* Small Keyboard button to switch to text input */}
                <button
                  type="button"
                  onClick={() => setIsTypingMode(true)}
                  className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-xs border border-slate-200/60"
                  title="Type text"
                >
                  <span className="text-xs font-bold font-mono">Aa</span>
                </button>
              </div>
            ) : (
              /* Textarea typing input */
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="ኣብዚ ጽሓፍ..."
                  className="flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                  autoFocus
                />

                {/* Send button */}
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!inputText.trim() && !attachedImage}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs ${
                    inputText.trim() || attachedImage
                      ? 'bg-[#194BFB] hover:bg-[#133BD0] text-white active:scale-95 shadow-blue-500/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4.5 h-4.5" />
                </button>

                {/* Switch back to Mic pill */}
                <button
                  type="button"
                  onClick={() => setIsTypingMode(false)}
                  className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Switch to Voice"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
