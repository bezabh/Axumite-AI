import React, { useState } from 'react';
import { 
  X, Car, Wrench, AlertCircle, Sparkles, Search, 
  Activity, ShieldAlert, CheckCircle2, ChevronRight, Gauge
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MechanicDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPromptForChat?: (prompt: string) => void;
}

export const MechanicDiagnosisModal: React.FC<MechanicDiagnosisModalProps> = ({
  isOpen,
  onClose,
  onSelectPromptForChat,
}) => {
  const { language } = useLanguage();
  const [obdCode, setObdCode] = useState('');

  if (!isOpen) return null;

  const COMMON_FAULTS = [
    {
      code: 'P0300',
      title: language === 'ti' ? 'ሞተር ምትዕንቓፍ (Random/Multiple Cylinder Misfire)' : 'Random Cylinder Misfire',
      symptoms: language === 'ti' ? 'ሞተር ምንቅጥቃጥ፣ ሓይሊ ምጉዳል፣ ላምፓ ሞተር ምብራቕ' : 'Rough idle, loss of acceleration, flashing Check Engine light',
      causes: language === 'ti' ? 'ናይ ስፓርክ ፕላግ (Spark Plugs)፣ ናይ ነዳዲ መርፌ (Fuel Injector) ወይ ኮይል' : 'Bad spark plugs, ignition coil failure, or clogged fuel injector',
    },
    {
      code: 'P0420',
      title: language === 'ti' ? 'ናይ ካታሊቲክ ኮንቨርተር ጸገም (Catalyst System Efficiency)' : 'Catalyst System Efficiency Below Threshold',
      symptoms: language === 'ti' ? 'ጸሊም ትኪ፣ ነዳዲ ምብዛሕ፣ ትሑት ናህሪ' : 'Reduced engine performance, sulfur smell, poor fuel economy',
      causes: language === 'ti' ? 'ናይ ኦክስጅን ሴንሰር (O2 Sensor) ወይ ካታሊስት ምብላሽ' : 'Faulty upstream/downstream O2 sensor or degraded catalytic converter',
    },
    {
      code: 'P0171',
      title: language === 'ti' ? 'ስርዓተ ነዳዲ ምቕጣን (System Too Lean - Bank 1)' : 'System Too Lean (Bank 1)',
      symptoms: language === 'ti' ? 'ሞተር ምጥፋእ፣ ትሑት ጉልበት፣ ጽዕነት ዘይምኽኣል' : 'Engine hesitation on acceleration, rough idling, stalling',
      causes: language === 'ti' ? 'ናይ ኣየር ሴንሰር (MAF Sensor) ረሳሕ ምዃን፣ ናይ ቫክዩም ሌክ' : 'Dirty MAF sensor, vacuum leak, weak fuel pump',
    },
    {
      code: 'BRAKE',
      title: language === 'ti' ? 'ናይ ፍሬን ድምጺን ምንቅጥቃጥን' : 'Brake Squealing, Grinding & Vibration',
      symptoms: language === 'ti' ? 'ፍሬን ክትሕዝ ከለኻ ዝጭርጭር ድምጺ ወይ ፔዳል ምንቅጥቃጥ' : 'High pitched squeal when braking or pulsing brake pedal',
      causes: language === 'ti' ? 'ናይ ፍሬን ፓስታ (Brake Pads) ምውዳቕ ወይ ዲስክ ምቕጣን' : 'Worn brake pads, warped rotors, or caliper sticking',
    },
  ];

  const handleAskMechanic = (codeOrIssue: string) => {
    if (onSelectPromptForChat) {
      const prompt = language === 'ti'
        ? `እባክኻ ንናይ መኪና ጸገም "${codeOrIssue}" መርሚርካ፣ ጠንቁ፣ ከመይ ከም ዝዕረ፣ ዘድልዩ መለዋወጢ ኣቑሑትን ናይ ጽገና ምኽርን ብትግርኛን እንግሊዝን ኣብርሃለይ።`
        : `Please act as a Master Auto Mechanic. Diagnose this vehicle problem/code: "${codeOrIssue}". Explain the root cause, step-by-step troubleshooting, parts to inspect, and estimated repair complexity.`;
      onSelectPromptForChat(prompt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0E0E18] border-2 border-rose-600/50 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#16121D] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-400 flex items-center justify-center shadow-md">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>{language === 'ti' ? 'ክእለ መካኒክ (Auto Mechanic & Diagnosis AI)' : 'Auto Mechanic & Diagnosis AI'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ti' ? 'ናይ መኪና ጸገማት፣ ኮድ OBD-II፣ ድምጺ ሞተርን ናይ ጽገና ምኽርን' : 'OBD-II trouble codes, engine diagnostics, symptoms & vehicle maintenance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Code Search Input */}
          <div className="p-4 bg-[#141525] border border-slate-800 rounded-xl space-y-3">
            <label className="text-xs font-bold text-slate-300 block">
              {language === 'ti' ? 'ናይ መኪና ቼክ ኢንጅን ኮድ (OBD-II Code) ወይ ጸገም ጽሓፍ:' : 'Enter OBD-II Code (e.g. P0300) or Symptom:'}
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Gauge className="w-4 h-4 absolute left-3.5 top-3.5 text-rose-400" />
                <input
                  type="text"
                  value={obdCode}
                  onChange={(e) => setObdCode(e.target.value)}
                  placeholder={language === 'ti' ? 'ንኣብነት፡ P0300 ወይ ሞተር ድምጺ የውጽእ ኣሎ...' : 'e.g. P0420, squealing brakes, rough idle...'}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0A0C16] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
              <button
                onClick={() => {
                  if (obdCode.trim()) {
                    handleAskMechanic(obdCode);
                  }
                }}
                disabled={!obdCode.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ti' ? 'ምርምር' : 'Diagnose'}</span>
              </button>
            </div>
          </div>

          {/* Common Faults list */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ti' ? 'ልሙዳት ናይ መኪና ጸገማት (Common Diagnostics)' : 'Frequent Diagnostic Codes'}
            </div>

            {COMMON_FAULTS.map((fault) => (
              <div 
                key={fault.code}
                className="p-3.5 rounded-xl bg-[#141525] border border-slate-800 hover:border-rose-500/50 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300">
                      {fault.code}
                    </span>
                    <h4 className="font-bold text-xs text-slate-200">{fault.title}</h4>
                  </div>
                  <button
                    onClick={() => handleAskMechanic(`${fault.code} - ${fault.title}`)}
                    className="px-2.5 py-1 bg-[#201726] hover:bg-[#2F1F3B] border border-rose-500/40 text-rose-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Wrench className="w-3 h-3 text-rose-400" />
                    <span>{language === 'ti' ? 'ፍታሕ ርኸብ' : 'Solutions'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-300 font-semibold">{language === 'ti' ? 'ምልክታት: ' : 'Symptoms: '}</span>
                  {fault.symptoms}
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="text-rose-400 font-semibold">{language === 'ti' ? 'ቀንዲ ጠንቂ: ' : 'Likely Cause: '}</span>
                  {fault.causes}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
