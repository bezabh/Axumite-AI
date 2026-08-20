import React, { useState, useEffect, useRef } from 'react';
import { FastForward, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StreamingMessageTextProps {
  content: string;
  isStreaming?: boolean;
  onStreamComplete?: () => void;
  onAutoScroll?: () => void;
}

export const StreamingMessageText: React.FC<StreamingMessageTextProps> = ({
  content,
  isStreaming = false,
  onStreamComplete,
  onAutoScroll,
}) => {
  const { language } = useLanguage();
  const [displayedLength, setDisplayedLength] = useState(isStreaming ? 0 : content.length);
  const [isFinished, setIsFinished] = useState(!isStreaming);
  const scrollThrottleRef = useRef<number>(0);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedLength(content.length);
      setIsFinished(true);
      return;
    }

    setDisplayedLength(0);
    setIsFinished(false);

    const totalLength = content.length;
    if (totalLength === 0) {
      setIsFinished(true);
      onStreamComplete?.();
      return;
    }

    // Adaptive chunk step based on total message length for natural responsive pacing
    // Short: 2 chars / 16ms (~120 chars/sec)
    // Medium: 5 chars / 16ms (~300 chars/sec)
    // Long: 10 chars / 16ms (~600 chars/sec)
    const chunkSize = totalLength > 800 ? 10 : totalLength > 300 ? 5 : 2;
    const intervalTime = 16; // ~60fps smooth rendering

    const timer = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = Math.min(prev + chunkSize, totalLength);

        // Throttle auto-scroll calls so it remains silky smooth
        const now = Date.now();
        if (now - scrollThrottleRef.current > 70) {
          scrollThrottleRef.current = now;
          onAutoScroll?.();
        }

        if (next >= totalLength) {
          clearInterval(timer);
          setIsFinished(true);
          onStreamComplete?.();
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [content, isStreaming, onStreamComplete, onAutoScroll]);

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayedLength(content.length);
    setIsFinished(true);
    onStreamComplete?.();
    onAutoScroll?.();
  };

  const currentVisibleText = isFinished ? content : content.slice(0, displayedLength);

  return (
    <div className="relative group/stream">
      {/* Visible Stream Text with Whitespace Preservation */}
      <div className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed select-text">
        {currentVisibleText}
        {!isFinished && (
          <span 
            className="inline-block w-2 h-4.5 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 rounded-xs animate-pulse ml-1 align-middle shadow-[0_0_10px_rgba(245,158,11,0.9)]"
            title="Streaming AI Response"
          />
        )}
      </div>

      {/* Floating Instant Skip Button during Active Streaming */}
      {!isFinished && (
        <div className="mt-2.5 flex justify-end">
          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-950/70 hover:bg-amber-900 border border-amber-500/50 text-amber-200 hover:text-white text-[10px] font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
            title={language === 'ti' ? 'ቀጥታ ጽሑፍ ኣርኢ' : 'Show full text immediately'}
          >
            <FastForward className="w-3 h-3 text-amber-400" />
            <span>{language === 'ti' ? 'ቀጥታ ኣርኢ (Skip)' : 'Instant Output'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
