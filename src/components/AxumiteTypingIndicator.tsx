import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AxumiteTypingIndicatorProps {
  mode?: string;
}

export const AxumiteTypingIndicator: React.FC<AxumiteTypingIndicatorProps> = ({ mode }) => {
  const { language } = useLanguage();
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phasesTi = [
    'ሓሳባት ይድህስስ ኣሎ... (Analyzing query context...)',
    'ናይ ግዕዝን ትግርኛን መዛግብቲ ይምርምር ኣሎ... (Querying intelligence...)',
    'ታሪካውን ቋንቋውን ትንታነ ይገብር ኣሎ... (Synthesizing reasoning...)',
    'መልሲ ይጽሕፍ ኣሎ... (Generating response...)',
  ];

  const phasesEn = [
    'Obelisk Neural Core analyzing prompt...',
    'Consulting Ge\'ez & Tigrinya linguistic models...',
    'Synthesizing historical & technical context...',
    'Formulating comprehensive AI response...',
  ];

  const currentPhases = language === 'ti' ? phasesTi : phasesEn;

  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % currentPhases.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [currentPhases.length]);

  return (
    <div className="flex flex-col items-start space-y-2 max-w-[88%] sm:max-w-[80%] animate-fade-in">
      {/* Header Info */}
      <div className="flex items-center space-x-2 text-[10px] text-amber-300/80 font-mono uppercase tracking-widest px-1">
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
          <span className="font-bold text-amber-200">AXUMITE AI</span>
        </span>
        <span>•</span>
        <span className="text-amber-400/90 font-medium">
          {mode ? `${mode.toUpperCase()} MODE` : 'REASONING...'}
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full bg-[#0E0C08]/95 border border-[#C5A059]/40 p-4 rounded-2xl rounded-tl-none shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Shimmer Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-300/10 to-amber-500/5 animate-pulse pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Top Row: Animated Avatar & Staggered Typing Dots */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-[#C5A059]/60 flex items-center justify-center text-amber-300 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" style={{ animationDuration: '3s' }} />
              </div>
              <div className="text-xs font-semibold text-[#F3E5AB]">
                {language === 'ti' ? 'ኣክሱማዊ AI ይሓስብ ኣሎ' : 'Axumite AI Thinking'}
              </div>
            </div>

            {/* 3 Staggered Golden Bouncing Typing Dots */}
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#1A150B] border border-amber-500/30 rounded-full shadow-inner">
              <span 
                className="w-2 h-2 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 animate-bounce shadow-[0_0_6px_rgba(245,158,11,0.8)]"
                style={{ animationDelay: '0ms', animationDuration: '0.9s' }}
              />
              <span 
                className="w-2 h-2 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 animate-bounce shadow-[0_0_6px_rgba(245,158,11,0.8)]"
                style={{ animationDelay: '180ms', animationDuration: '0.9s' }}
              />
              <span 
                className="w-2 h-2 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 animate-bounce shadow-[0_0_6px_rgba(245,158,11,0.8)]"
                style={{ animationDelay: '360ms', animationDuration: '0.9s' }}
              />
            </div>
          </div>

          {/* Dynamic Stage Message */}
          <div className="flex items-center space-x-2 text-xs text-amber-100/90 font-sans tracking-wide transition-all duration-300 ease-in-out">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate italic">
              {currentPhases[phaseIndex]}
            </span>
          </div>

          {/* Golden Progress Shimmer Wave */}
          <div className="w-full h-1 bg-[#221B10] rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-transparent via-[#F3E5AB] to-transparent w-1/2 rounded-full animate-[shimmer_1.5s_infinite]"
              style={{
                animation: 'translateX 1.8s infinite linear',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
