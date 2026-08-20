import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Send, Sparkles, Brain, Bot, User, Volume2, RefreshCw, 
  Lightbulb, BookOpen, Calculator, Atom, Code, Globe, HelpCircle 
} from 'lucide-react';
import { queryAiTutor } from '../../services/educationService';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const SUBJECT_OPTIONS = [
  { id: 'math', name: 'Mathematics & Calculus', nameTi: 'ሒሳብን ካልኩለስን', icon: Calculator, prompt: 'How do I solve partial derivatives with intuition?' },
  { id: 'geez', name: "Ge'ez & Semitic Philology", nameTi: 'ቋንቋ ግእዝን ሰዋስውን', icon: BookOpen, prompt: 'Explain the 7 orders of Ge\'ez fidel matrix with examples.' },
  { id: 'ai', name: 'AI & Neural Networks', nameTi: 'AIን ኒውራል ኔትወርክን', icon: Code, prompt: 'How does backpropagation optimize weights mathematically?' },
  { id: 'physics', name: 'Physics & Quantum Mechanics', nameTi: 'ፊዚክስን ሳይንስን', icon: Atom, prompt: 'Explain wave-particle duality simply in Tigrinya and English.' },
  { id: 'medicine', name: 'Medical Diagnostics', nameTi: 'ሕክምናን ስነ-ህይወትን', icon: Lightbulb, prompt: 'How do I interpret ECG leads for myocardial infarction?' },
  { id: 'scholarship', name: 'Global Scholarship SOP', nameTi: 'ዓለምለኸ ስኮላርሺፕ', icon: Globe, prompt: 'Give me a winning SOP structure for Erasmus Mundus.' },
];

export const AiTutorChat: React.FC<{ preferredLanguage?: 'en' | 'ti' }> = ({
  preferredLanguage = 'ti',
}) => {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_OPTIONS[0].id);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: preferredLanguage === 'ti'
        ? `ሰላም! ኣነ **መምህር ኣክሱማዊ** (Axumite Master Tutor) እየ።\n\nኣብ ሒሳብ (Calculus)፡ ፊዚክስ፡ ቋንቋ ግእዝ፡ AI ኢንጂነሪንግ፡ ሕክምና ወይ ዓለምለኸ ስኮላርሺፕ ዝኾነ ሕቶ እንተለካ ስጉምቲ ብስጉምቲ ከረድኣካ ድሉው ኣለኹ።\n\nእንታይ ክትምሃር ትደሊ?`
        : `Greetings! I am **መምህር ኣክሱማዊ** (Axumite Master Tutor).\n\nI am your dedicated academic AI professor. Ask me any conceptual question in STEM, Ge'ez philology, AI engineering, clinical medicine, or international scholarships.\n\nWhat would you like to master today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const reply = await queryAiTutor(query, history, selectedSubject, preferredLanguage);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`$]/g, ''));
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-[750px] max-h-[85vh] bg-zinc-950/80 rounded-2xl border border-amber-500/30 overflow-hidden shadow-2xl" id="ai-tutor-chat-container">
      {/* Tutor Top Banner */}
      <div className="p-4 bg-zinc-900/70 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-amber-400">
              <Brain className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-zinc-100">መምህር ኣክሱማዊ (AI Master Tutor)</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                Gemini 3.7 Reasoning
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {preferredLanguage === 'ti' ? 'ስጉምቲ ብስጉምቲ ዝምህር ናይ ትምህርቲ ኣማኻሪ' : 'Interactive Socratic Tutor & STEM Mentor'}
            </p>
          </div>
        </div>

        {/* Clear chat */}
        <button
          onClick={() => setMessages([messages[0]])}
          className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          {preferredLanguage === 'ti' ? 'ሓዲሽ ምይይጥ' : 'Reset Chat'}
        </button>
      </div>

      {/* Subject Filter Carousel */}
      <div className="p-3 bg-zinc-900/30 border-b border-zinc-800/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
        {SUBJECT_OPTIONS.map(sub => {
          const Icon = sub.icon;
          const isSelected = selectedSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{preferredLanguage === 'ti' ? sub.nameTi : sub.name}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans">
        {messages.map(m => {
          const isAi = m.role === 'model';
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                isAi
                  ? 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 shadow-md'
                  : 'bg-amber-500 text-zinc-950 font-medium ml-auto'
              }`}>
                <div className="whitespace-pre-line prose prose-invert max-w-none">
                  {m.content}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[10px] text-zinc-400">
                  <span>{m.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => handleSpeak(m.content)}
                      className="hover:text-amber-400 flex items-center gap-1 transition-colors"
                      title="Listen with Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{preferredLanguage === 'ti' ? 'ስማዕ' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-amber-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{preferredLanguage === 'ti' ? 'መምህር ኣክሱማዊ ይሓስብ ኣሎ...' : 'Axumite Tutor is formulating the step-by-step proof...'}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-zinc-900/40 border-t border-zinc-800/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[11px] text-zinc-400 shrink-0 flex items-center gap-1 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          {preferredLanguage === 'ti' ? 'ሕቶታት:' : 'Quick Prompt:'}
        </span>
        {SUBJECT_OPTIONS.filter(s => s.id === selectedSubject).map(s => (
          <button
            key={s.id}
            onClick={() => handleSendMessage(s.prompt)}
            className="text-[11px] text-zinc-300 hover:text-amber-300 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-lg truncate max-w-xs transition-all"
          >
            "{s.prompt}"
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-zinc-900/80 border-t border-zinc-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              preferredLanguage === 'ti'
                ? 'ዝኾነ ናይ ሒሳብ፡ ቋንቋ ወይ ሳይንስ ሕቶ ኣብዚ ጽሓፍ...'
                : 'Ask any academic question, proof request, or concept explanation...'
            }
            className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            id="ai-tutor-input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs sm:text-sm disabled:opacity-40 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            id="ai-tutor-submit-btn"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{preferredLanguage === 'ti' ? 'ሕተት' : 'Ask'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
