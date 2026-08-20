import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer2, Sparkles, MessageSquareText, Compass, Mic, Volume2 } from 'lucide-react';
import { playCursorGuideChime, playVoiceTriggerChime } from '../utils/audioChime';

interface AxumiteCursorGuideProps {
  triggerSignal: number; // Incremented on start and login
  onAnimationComplete?: () => void;
  onTriggerVoice?: () => void;
}

export const AxumiteCursorGuide: React.FC<AxumiteCursorGuideProps> = ({
  triggerSignal,
  onAnimationComplete,
  onTriggerVoice,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [label, setLabel] = useState('Axumite Chat');

  useEffect(() => {
    if (triggerSignal <= 0) return;

    // Locate the Axumite Chat icon DOM element
    const findChatElement = () => {
      const desktopTab = document.getElementById('axumite-chat-tab');
      const mobileTab = document.getElementById('axumite-chat-tab-mobile');
      const chatIcon = document.getElementById('axumite-chat-icon');
      const logoBrand = document.getElementById('axumite-logo-brand');

      const target = desktopTab || chatIcon || mobileTab || logoBrand;
      if (target) {
        const rect = target.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
      return { x: window.innerWidth / 2, y: 120 };
    };

    const targetCoords = findChatElement();
    setCoords(targetCoords);
    setIsVisible(true);

    // Play subtle audio confirmation chime
    playCursorGuideChime(0.1);

    // Focus chat input element if available
    setTimeout(() => {
      const input = document.getElementById('chat-input-textarea') || document.getElementById('chat-input-field');
      if (input) {
        input.focus();
      }
    }, 400);

    // Hide animation after 3.8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onAnimationComplete) onAnimationComplete();
    }, 3800);

    return () => clearTimeout(timer);
  }, [triggerSignal]);

  const handleTriggerVoiceCommand = (e: React.MouseEvent) => {
    e.stopPropagation();
    playVoiceTriggerChime();
    setIsVisible(false);
    if (onTriggerVoice) {
      onTriggerVoice();
    }
  };

  if (!isVisible || !coords) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        
        {/* Pulsing Gold Target Rings Centered on Axumite Chat Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0.5, 1.8, 1.2], opacity: [0.8, 0.4, 0.9] }}
          exit={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.2, repeat: 1, ease: 'easeOut' }}
          className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F3E5AB] shadow-[0_0_25px_rgba(245,215,127,0.8)]"
          style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
        />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0.2, 2.4, 1.5], opacity: [0.9, 0.2, 0.6] }}
          transition={{ duration: 1.8, repeat: 1, ease: 'easeOut' }}
          className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400 border-dashed"
          style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
        />

        {/* Animated Gold Axumite Mouse Cursor Pointer */}
        <motion.div
          initial={{ 
            x: coords.x + 80, 
            y: coords.y + 80, 
            opacity: 0, 
            scale: 1.5 
          }}
          animate={{ 
            x: [coords.x + 80, coords.x, coords.x], 
            y: [coords.y + 80, coords.y, coords.y], 
            opacity: [0, 1, 1], 
            scale: [1.4, 1, 1.1] 
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute flex items-start space-x-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          style={{ left: 0, top: 0 }}
        >
          {/* Custom Gold Pointer Icon */}
          <div className="relative">
            <MousePointer2 className="w-8 h-8 text-[#F3E5AB] fill-amber-500 stroke-[#8E6D28] stroke-[1.5] filter drop-shadow-[0_0_10px_rgba(245,215,127,0.9)] animate-bounce" />
            <Sparkles className="w-4 h-4 text-amber-300 absolute -top-2 -right-2 animate-spin" />
          </div>

          {/* Floating Axumite Chat & Voice Starter Badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="pointer-events-auto bg-[#0D0A16]/95 backdrop-blur-md border-2 border-[#C5A059] px-3 py-1.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold text-[#F3E5AB]"
          >
            <MessageSquareText className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>Cursor Anchored: <strong>AXUMITE CHAT</strong></span>
            
            {onTriggerVoice && (
              <button
                type="button"
                onClick={handleTriggerVoiceCommand}
                className="ml-2 flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-400/40 transition-colors cursor-pointer text-[11px]"
                title="Trigger Voice Command"
              >
                <Mic className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>ድምጺ (Voice)</span>
              </button>
            )}
          </motion.div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};
