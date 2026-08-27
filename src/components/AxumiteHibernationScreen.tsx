import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Power, Zap, Shield, Sparkles, BatteryCharging, RefreshCw, Volume2, Volume1, VolumeX, Globe, Music } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTraditionalAmbientAudio } from '../hooks/useTraditionalAmbientAudio';
import { TraditionalInstrument } from '../utils/traditionalAmbientAudio';
import axumiteEmblem from '../assets/axumite_gold_icon.jpg';

interface AxumiteHibernationScreenProps {
  isOpen: boolean;
  onWakeUp: () => void;
  reason?: 'idle' | 'manual' | 'battery_save';
}

export const AxumiteHibernationScreen: React.FC<AxumiteHibernationScreenProps> = ({
  isOpen,
  onWakeUp,
  reason = 'manual'
}) => {
  const { language } = useLanguage();
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [isWaking, setIsWaking] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);

  // Ambient Audio Hook
  const { 
    isPlaying: isAmbientPlaying, 
    volume: ambientVolume, 
    instrument: ambientInstrument,
    currentMode: ambientCurrentMode,
    toggle: toggleAmbient,
    setVolume: setAmbientVolume,
    setInstrument: setAmbientInstrument
  } = useTraditionalAmbientAudio();

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
      setDateStr(
        now.toLocaleDateString(language === 'ti' ? 'en-US' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  // Gentle subtle rolling rotation interval for the golden emblem in hibernation
  useEffect(() => {
    if (!isOpen) return;
    const rotateInterval = setInterval(() => {
      setRotationDegrees((prev) => (prev + 360) % 3600);
    }, 12000);
    return () => clearInterval(rotateInterval);
  }, [isOpen]);

  const handleWakeUp = () => {
    setIsWaking(true);
    setTimeout(() => {
      setIsWaking(false);
      onWakeUp();
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onClick={handleWakeUp}
        className="fixed inset-0 z-[999] bg-[#030304] text-slate-100 flex flex-col items-center justify-between p-6 sm:p-10 select-none cursor-pointer overflow-hidden backdrop-blur-2xl"
      >
        {/* Deep ambient star / energy particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/5 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#8E6D28]/10 rounded-full blur-[90px]" />
          
          {/* Subtle Axumite Circuit Grid Lines */}
          <div className="absolute inset-0 opacity-10 circuit-pattern" />
        </div>

        {/* Top Header Bar */}
        <header className="relative z-10 w-full max-w-4xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] block font-bold">
                AXUMITE SOVEREIGN AI • HIBERNATION
              </span>
              <span className="text-xs text-slate-400 font-serif">
                {language === 'ti' ? 'ናይ ጸዓት ምዕቃብን ዕረፍትን ድቃስ' : 'Deep Standby & Battery Energy Shield'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-black/60 border border-[#8E6D28]/40 px-3.5 py-1.5 rounded-full text-xs text-amber-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
            <span>{reason === 'idle' ? 'AUTO-IDLE STANDBY' : 'HIBERNATION READY'}</span>
          </div>
        </header>

        {/* Center: The Iconic Golden Axumite Emblem with Meditative Rolling Breathing */}
        <main className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-lg space-y-6">
          <div className="relative group">
            {/* Glowing outer rings with slow rolling rotation */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute -inset-4 rounded-full border border-amber-500/25 border-dashed pointer-events-none"
            />
            <motion.div
              animate={{
                rotate: -360,
                scale: [1.08, 1, 1.08],
              }}
              transition={{
                rotate: { duration: 45, repeat: Infinity, ease: 'linear' },
                scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute -inset-8 rounded-full border border-[#C5A059]/15 pointer-events-none"
            />

            {/* Pulsing Backlight Halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-[#F3E5AB]/30 to-amber-600/20 rounded-full blur-2xl animate-pulse" />

            {/* Official Axumite AI Emblem Icon with 3D Rolling Hibernation Effect */}
            <motion.div
              animate={{
                scale: isWaking ? [1, 1.15, 0.95] : [1, 1.03, 1],
                boxShadow: [
                  '0 0 25px rgba(197, 160, 89, 0.3)',
                  '0 0 45px rgba(243, 229, 171, 0.5)',
                  '0 0 25px rgba(197, 160, 89, 0.3)',
                ],
              }}
              transition={{
                duration: isWaking ? 0.4 : 3.5,
                repeat: isWaking ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-[#F3E5AB] shadow-2xl p-1 bg-gradient-to-b from-[#8E6D28] via-[#14110B] to-[#0A0805]"
            >
              <img
                src={axumiteEmblem}
                alt="Axumite AI Sovereign Mobile & Hibernation Emblem"
                className="w-full h-full object-cover rounded-full transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Gentle rotating light reflection */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-full"
              />
            </motion.div>
          </div>

          {/* Clock & Ge'ez Calendar */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-mono font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#E1C47D] to-[#C5A059] drop-shadow-[0_0_15px_rgba(243,229,171,0.3)]">
              {timeStr || '12:00:00 AM'}
            </h1>
            <p className="text-xs text-slate-400 font-mono tracking-wide">
              {dateStr} • <span className="text-[#C5A059] font-bold">ኢትዮጵያ / ኤርትራ ሰዓት</span>
            </p>
          </div>

          {/* Hibernation Status Message */}
          <div className="bg-[#120F1A]/80 border border-[#8E6D28]/40 px-5 py-3 rounded-2xl max-w-sm backdrop-blur-md shadow-xl">
            <p className="text-xs text-[#F3E5AB] font-serif leading-relaxed">
              {language === 'ti'
                ? 'ኣክሱማይት AI ኣብ ጸጥታን ዕረፍትን ድቃስ ኣሎ። ስርዓቱ ንዝኾነ ሓበሬታ ወይ ድምጺ ብቕጽበት ንምቕባል ድሉው እዩ።'
                : 'Axumite AI is resting in sovereign hibernation mode. Memory and neural channels remain synchronized in standby.'}
            </p>
          </div>

          {/* Traditional Ambient Sound Pill in Hibernation Mode */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#140F22]/90 border border-amber-500/50 p-3 rounded-2xl max-w-sm w-full space-y-2.5 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isAmbientPlaying ? 'bg-amber-400 text-black shadow-md' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Music className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-amber-200">
                    {language === 'ti' ? 'ባህላዊ ሙዚቃ (Ambient Sound)' : 'Traditional Ambient Sound'}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {ambientInstrument} ({ambientCurrentMode})
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleAmbient}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                  isAmbientPlaying 
                    ? 'bg-amber-500 text-black hover:bg-amber-400' 
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {isAmbientPlaying ? (language === 'ti' ? 'ኣቋርጽ (Stop)' : 'Pause') : (language === 'ti' ? 'ወልዕ (Play)' : 'Play')}
              </button>
            </div>

            {/* Volume control with continuation */}
            {isAmbientPlaying && (
              <div className="pt-2 border-t border-amber-500/20 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center space-x-1">
                    {ambientVolume === 0 ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-400" />}
                    <span>{language === 'ti' ? 'ድምጺ' : 'Volume'}</span>
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{Math.round(ambientVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                
                {/* Quick Instrument Switcher */}
                <div className="grid grid-cols-4 gap-1 pt-1">
                  {[
                    { id: 'masinko', label: 'ማሲንቆ' },
                    { id: 'kirar', label: 'ክራር' },
                    { id: 'washint', label: 'ዋሽንት' },
                    { id: 'ensemble', label: 'ሕውስዋስ' },
                  ].map((inst) => (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => setAmbientInstrument(inst.id as TraditionalInstrument)}
                      className={`py-1 text-[9.5px] font-bold rounded border transition-all cursor-pointer ${
                        ambientInstrument === inst.id
                          ? 'bg-[#8E6D28] text-white border-amber-400'
                          : 'bg-black/40 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {inst.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Wake Up Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleWakeUp();
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/25 flex items-center space-x-2.5 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
          >
            <Power className="w-4 h-4 text-slate-950" />
            <span>{language === 'ti' ? 'ንቓሕ / ጀምር (Wake Up App)' : 'Tap to Wake Up App'}</span>
          </motion.button>
        </main>

        {/* Bottom Footer Info */}
        <footer className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-[#8E6D28]/20 pt-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Zero-drain battery saver • Encrypted local state preserved</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-400">
              {language === 'ti' ? 'ንክትንቅሕ ኣብ ዝኾነ ቦታ ጠውቑ' : 'Click or tap anywhere on screen to resume'}
            </span>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
