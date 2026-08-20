import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, Send, Mic, MicOff, Upload, Image as ImageIcon, 
  Sparkles, Bot, User, Trash2, ShieldCheck, RefreshCw, Volume2, Copy, Check 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string;
}

export const BusinessCopilotChat: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: language === 'ti'
        ? `ሰላም! ኣነ ናይ AXUMITE AI ቢዝነስ ኮፓይሎት (AI Business Advisor) እየ። ኣብ ምምስራት ትካል፡ ምሕሳብ ባጀት፡ ምምሕዳር ዓማዊልን ስትራተጂ ዕዳጋን ከመይ ክሕግዘኩም ትደልዩ?`
        : language === 'de'
        ? `Willkommen beim AXUMITE KI-Business-Copiloten. Ich berate Sie zu Geschäftsmodellen, Investitionsplänen, Finanzierungsrunden, Marketing und internationalem Handel.`
        : `Greetings! I am the AXUMITE AI Business Copilot. How can I assist your enterprise with strategy, financial modeling, market expansion, or customer service automation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<'startup_advisor' | 'financial_analyst' | 'marketing_strategist' | 'diaspora_trade_expert' | 'customer_service_bot_trainer'>('startup_advisor');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const currentImg = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content,
      }));

      const res = await fetch('/api/business/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          persona,
          history: historyPayload,
          language,
          imageBase64: currentImg,
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.reply || 'Analysis completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ti' ? 'am-ET' : language === 'de' ? 'de-DE' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => `${prev} ${transcript}`.trim());
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const copyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[750px]">
      {/* Top Header & Role Selector */}
      <div className="p-4 bg-stone-950 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-100 text-sm">AI Business Advisory Copilot</h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full font-mono">
                Active Expert Mode
              </span>
            </div>
            <p className="text-stone-400 text-xs">Multi-Domain Commercial & Startup Intelligence</p>
          </div>
        </div>

        {/* Persona Select */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-stone-400 font-semibold uppercase">Advisor Role:</label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value as any)}
            className="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
          >
            <option value="startup_advisor">🚀 Startup & Seed Mentor</option>
            <option value="financial_analyst">💰 CFO & Financial Analyst</option>
            <option value="marketing_strategist">📈 CMO & Growth Marketer</option>
            <option value="diaspora_trade_expert">🌍 Diaspora & Trade Advisor</option>
            <option value="customer_service_bot_trainer">🤖 Customer Bot Trainer</option>
          </select>
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-rose-400 rounded-lg transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-stone-950/40">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-1 border border-amber-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed space-y-2 shadow-md ${
                  isUser
                    ? 'bg-amber-600 text-stone-950 font-medium rounded-tr-none'
                    : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none'
                }`}
              >
                {msg.image && (
                  <div className="mb-2 rounded-lg overflow-hidden max-h-48">
                    <img src={msg.image} alt="Uploaded attachment" className="w-full object-cover" />
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800/40 text-[10px] text-stone-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(msg.content)}
                        className="hover:text-amber-400 transition-colors p-1"
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyMessage(msg.content, idx)}
                        className="hover:text-amber-400 transition-colors p-1"
                        title="Copy"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-1 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-stone-400 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Analyzing financial models and strategy...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Upload Preview if present */}
      {selectedImage && (
        <div className="px-4 py-2 bg-stone-950 border-t border-stone-800 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-amber-500/50">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs text-stone-400">Image / Receipt attached for visual financial analysis</span>
          <button
            onClick={() => setSelectedImage(null)}
            className="text-xs text-rose-400 hover:text-rose-300 ml-auto"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 bg-stone-950 border-t border-stone-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 transition-colors border border-stone-800"
            title="Upload Receipt or Document Image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl transition-colors border ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 border-stone-800'
            }`}
            title="Voice Input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'ti'
                ? 'ሕቶኹም ብትግርኛ ወይ እንግሊዝኛ ጽሓፉ...'
                : language === 'de'
                ? 'Stellen Sie Ihre geschäftliche Frage...'
                : 'Ask anything on business strategy, pricing, fundraising, taxes...'
            }
            className="flex-1 bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
          />

          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all disabled:opacity-40 cursor-pointer shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
