import React from 'react';
import { Mic, FileText, X } from 'lucide-react';

interface TranslationMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAudio?: () => void;
  onSelectWritten?: () => void;
  onSelectMethod?: (method: 'audio' | 'written') => void;
}

export const TranslationMethodModal: React.FC<TranslationMethodModalProps> = ({
  isOpen,
  onClose,
  onSelectAudio,
  onSelectWritten,
  onSelectMethod,
}) => {
  if (!isOpen) return null;

  const handleAudioSelect = () => {
    if (typeof onSelectAudio === 'function') {
      onSelectAudio();
    } else if (typeof onSelectMethod === 'function') {
      onSelectMethod('audio');
    }
    onClose();
  };

  const handleWrittenSelect = () => {
    if (typeof onSelectWritten === 'function') {
      onSelectWritten();
    } else if (typeof onSelectMethod === 'function') {
      onSelectMethod('written');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6 animate-slide-up relative text-center"
      >
        {/* Top Drag Pill Handle */}
        <div className="w-16 h-1.5 bg-stone-300 rounded-full mx-auto" />

        {/* Title & Subtitle */}
        <div className="space-y-2 pt-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
            ኣገባብ ትርጉም ይምረጹ
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm font-medium leading-relaxed px-2">
            ካብዚ ዝስዕቡ፡ ነቲ ዝደለይዎ ኣገባብ ትርጉም ብምምራጽ ይቐጽሉ።
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3.5 pt-2">
          {/* Option 1: Audio Translation (Blue Button) */}
          <button
            type="button"
            onClick={handleAudioSelect}
            className="w-full py-4 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-bold text-base sm:text-lg rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-3 transition-all cursor-pointer"
          >
            <Mic className="w-5 h-5 text-white" />
            <span>ናይ ድምጺ ትርጉም (Audio)</span>
          </button>

          {/* Option 2: Written Translation (Green Button) */}
          <button
            type="button"
            onClick={handleWrittenSelect}
            className="w-full py-4 px-6 bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white font-bold text-base sm:text-lg rounded-2xl shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-3 transition-all cursor-pointer"
          >
            <FileText className="w-5 h-5 text-white" />
            <span>ናይ ጽሑፍ ትርጉም (Written)</span>
          </button>
        </div>

        {/* Cancel Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 font-bold text-sm sm:text-base transition-colors py-2 px-4 cursor-pointer"
          >
            ተመለስ (Cancel)
          </button>
        </div>
      </div>
    </div>
  );
};
