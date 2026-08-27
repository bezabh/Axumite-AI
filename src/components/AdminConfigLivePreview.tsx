import React, { useState } from 'react';
import { AppSystemConfig } from '../types';
import { 
  Monitor, Smartphone, Sparkles, Globe, ShieldCheck, 
  AlertTriangle, Mic, Scan, Zap, Eye, CheckCircle2,
  Crown, RefreshCw, MessageSquare, Volume2, Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AdminConfigLivePreviewProps {
  config: AppSystemConfig;
  savedConfig?: AppSystemConfig;
  onThemeSelect?: (theme: 'gold' | 'cyan' | 'obsidian' | 'ruby') => void;
}

export const AdminConfigLivePreview: React.FC<AdminConfigLivePreviewProps> = ({
  config,
  savedConfig,
  onThemeSelect,
}) => {
  const { language } = useLanguage();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [interactiveTab, setInteractiveTab] = useState<'chat' | 'tools' | 'maintenance'>('chat');

  // Check if there are unsaved changes
  const hasUnsavedChanges = savedConfig 
    ? JSON.stringify(config) !== JSON.stringify(savedConfig)
    : false;

  // Derive theme styling variables
  const getThemeStyles = () => {
    switch (config.ui?.primaryTheme) {
      case 'cyan':
        return {
          name: 'Asmara Cyan',
          border: 'border-cyan-500/50',
          borderActive: 'border-cyan-400',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
          badge: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
          gradientBtn: 'bg-gradient-to-r from-cyan-600 via-teal-400 to-cyan-500 text-black',
          subtleBg: 'bg-cyan-950/30',
          textHighlight: 'text-cyan-300',
          accentDot: 'bg-cyan-400',
          pillActive: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60',
        };
      case 'obsidian':
        return {
          name: 'Royal Obsidian',
          border: 'border-slate-500/50',
          borderActive: 'border-slate-300',
          glow: 'shadow-[0_0_20px_rgba(148,163,184,0.25)]',
          badge: 'bg-slate-500/20 text-slate-200 border-slate-400/40',
          gradientBtn: 'bg-gradient-to-r from-slate-400 via-slate-200 to-slate-300 text-slate-950',
          subtleBg: 'bg-slate-900/40',
          textHighlight: 'text-slate-200',
          accentDot: 'bg-slate-300',
          pillActive: 'bg-slate-500/20 text-slate-200 border-slate-400/60',
        };
      case 'ruby':
        return {
          name: 'Red Sea Ruby',
          border: 'border-rose-500/50',
          borderActive: 'border-rose-400',
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
          badge: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
          gradientBtn: 'bg-gradient-to-r from-rose-600 via-pink-400 to-rose-500 text-white',
          subtleBg: 'bg-rose-950/30',
          textHighlight: 'text-rose-300',
          accentDot: 'bg-rose-400',
          pillActive: 'bg-rose-500/20 text-rose-200 border-rose-400/60',
        };
      case 'gold':
      default:
        return {
          name: 'Axumite Gold',
          border: 'border-[#C5A059]/50',
          borderActive: 'border-[#E1C47D]',
          glow: 'shadow-[0_0_20px_rgba(197,160,89,0.25)]',
          badge: 'bg-amber-500/20 text-[#F3E5AB] border-amber-400/40',
          gradientBtn: 'bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-black',
          subtleBg: 'bg-amber-950/25',
          textHighlight: 'text-[#F3E5AB]',
          accentDot: 'bg-[#E1C47D]',
          pillActive: 'bg-amber-500/25 text-[#F3E5AB] border-amber-400/60',
        };
    }
  };

  const themeStyle = getThemeStyles();

  // Helper for language representation in preview
  const getLanguageLabel = (langCode?: string) => {
    switch (langCode) {
      case 'gez': return 'ግዕዝ (Ge\'ez)';
      case 'en': return 'English';
      case 'de': return 'Deutsch';
      case 'ti':
      case 'ti-ER':
      case 'ti-ET':
      default:
        return 'ትግርኛ (Tigrinya)';
    }
  };

  return (
    <div className={`rounded-2xl border ${themeStyle.border} bg-[#0A0814] p-4 sm:p-5 shadow-2xl transition-all duration-300 relative overflow-hidden ${themeStyle.glow}`}>
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#161226] border border-[#8E6D28]/40 flex items-center justify-center text-amber-300">
            <Eye className="w-4 h-4 text-[#E1C47D]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-serif text-[#F3E5AB] tracking-wide uppercase">
                {language === 'ti' ? 'ቀጥታ ቅድመ-ተረኽቦ (Live Branding Preview)' : 'Live UI & Branding Preview'}
              </span>
              {hasUnsavedChanges ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold animate-pulse flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Unsaved Draft</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Synced</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'ti' 
                ? 'ዝተገብሩ ለውጥታት ቅድሚ ምዕቃብ ኣብዚ ብቀጥታ ከመይ ከም ዝመስል ርኣዩ።' 
                : 'Real-time simulation of navbar, brand titles, palette theme, and active features.'}
            </p>
          </div>
        </div>

        {/* Device Switcher & Theme Palette Quick-Select */}
        <div className="flex items-center space-x-2 flex-wrap">
          {/* Quick Theme Selector Buttons */}
          {onThemeSelect && (
            <div className="hidden sm:flex items-center bg-[#130F22] p-1 rounded-xl border border-slate-800 space-x-1">
              {(['gold', 'cyan', 'obsidian', 'ruby'] as const).map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => onThemeSelect(th)}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    th === 'gold' ? 'bg-amber-400' :
                    th === 'cyan' ? 'bg-cyan-400' :
                    th === 'obsidian' ? 'bg-slate-400' : 'bg-rose-500'
                  } ${config.ui?.primaryTheme === th ? 'scale-110 ring-2 ring-white shadow-md' : 'opacity-60 hover:opacity-100'}`}
                  title={`Select ${th} theme`}
                />
              ))}
            </div>
          )}

          {/* Device Mode Toggle */}
          <div className="flex items-center bg-[#130F22] p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-[#251D38] text-[#F3E5AB] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-[#251D38] text-[#F3E5AB] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mockup Frame Container */}
      <div className={`mx-auto transition-all duration-300 ${
        deviceMode === 'mobile' ? 'max-w-[360px]' : 'w-full'
      }`}>
        <div className="rounded-xl border border-slate-800 bg-[#07060E] overflow-hidden shadow-inner flex flex-col">
          
          {/* Simulated Browser Chrome / Status Header */}
          <div className="px-3 py-2 bg-[#0E0C18] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-[10px] text-slate-300 truncate max-w-[160px] sm:max-w-[240px]">
                https://axumite.ai/workspace
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="font-mono text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </span>
              <span className={`px-1.5 py-0.5 rounded font-mono ${themeStyle.badge}`}>
                {themeStyle.name}
              </span>
            </div>
          </div>

          {/* Simulated Top Navbar */}
          <div className="px-3 sm:px-4 py-2.5 bg-[#0C0A16]/95 border-b border-slate-800/80 flex items-center justify-between gap-2">
            
            {/* Live Brand Identity in Navbar */}
            <div className="flex items-center space-x-2 min-w-0">
              <div className={`w-7 h-7 rounded-lg ${themeStyle.subtleBg} border ${themeStyle.border} flex items-center justify-center shrink-0`}>
                <Crown className={`w-4 h-4 ${themeStyle.textHighlight}`} />
              </div>
              <div className="min-w-0">
                <div className="font-black text-xs text-white tracking-wide truncate flex items-center space-x-1.5 font-cinzel">
                  <span>{config.appName || 'AXUMITE AI'}</span>
                  {config.maintenanceMode && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono">
                      MAINTENANCE
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-[320px]">
                  {config.appSubtitle || 'ልዑላዊ ናይ ምስትውዓል መድረኽ'}
                </div>
              </div>
            </div>

            {/* Live Nav Items & Language Switcher Mock */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <div className="hidden sm:flex items-center space-x-1">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${themeStyle.pillActive}`}>
                  Obelisk Chat
                </span>
                <span className="px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-400 bg-slate-900/60">
                  Vision
                </span>
              </div>
              
              <div className="px-2 py-1 rounded-lg bg-[#141024] border border-slate-700/60 text-[10px] font-bold text-amber-200 flex items-center space-x-1">
                <Globe className="w-3 h-3 text-amber-400" />
                <span className="truncate">{getLanguageLabel(config.defaultLanguage)}</span>
              </div>
            </div>

          </div>

          {/* Simulated Maintenance Mode Banner (if active) */}
          {config.maintenanceMode && (
            <div className="bg-amber-950/60 border-b border-amber-500/50 p-2.5 flex items-start space-x-2 text-amber-200 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-bold text-[11px] text-amber-300">System Maintenance Mode Active</div>
                <div className="text-[10px] text-amber-200/90 leading-tight">
                  {config.maintenanceNotice || 'System is undergoing scheduled optimization.'}
                </div>
              </div>
            </div>
          )}

          {/* Main Simulated App Content Body */}
          <div className="p-3.5 sm:p-4 space-y-3 bg-gradient-to-b from-[#090812] to-[#06050C]">
            
            {/* Live Hero / Welcome Simulation Card */}
            <div className={`p-3.5 sm:p-4 rounded-xl border ${themeStyle.border} ${themeStyle.subtleBg} relative overflow-hidden`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className={`w-3.5 h-3.5 ${themeStyle.textHighlight}`} />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      Sovereign AI Engine
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-serif">
                    {config.appName || 'AXUMITE AI'}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed max-w-[420px]">
                    {config.appSubtitle || 'Ancient Axumite Wisdom fused with Next-Gen Neural Intelligence.'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${themeStyle.gradientBtn}`}
                  >
                    Start Session
                  </button>
                </div>
              </div>
            </div>

            {/* Live AI Feature Capabilities Matrix (Reflecting Toggles) */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Enabled Platform Modules</span>
                <span className="text-slate-500 font-mono">
                  Model: {config.defaultModel || 'gemini-3.7-flash'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                {/* Voice Synthesis */}
                <div className={`p-2 rounded-lg border flex items-center space-x-1.5 ${
                  config.enableVoiceSynthesis 
                    ? 'border-purple-500/40 bg-purple-950/20 text-purple-200' 
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 opacity-60'
                }`}>
                  <Mic className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate font-semibold">Voice AI</span>
                  {config.enableVoiceSynthesis && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 ml-auto shrink-0" />}
                </div>

                {/* Vision / OCR */}
                <div className={`p-2 rounded-lg border flex items-center space-x-1.5 ${
                  config.enableImageRecognition 
                    ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-200' 
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 opacity-60'
                }`}>
                  <Scan className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate font-semibold">Vision OCR</span>
                  {config.enableImageRecognition && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 ml-auto shrink-0" />}
                </div>

                {/* Prompt Forge */}
                <div className={`p-2 rounded-lg border flex items-center space-x-1.5 ${
                  config.enablePromptForge 
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200' 
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 opacity-60'
                }`}>
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate font-semibold">Prompt Forge</span>
                  {config.enablePromptForge && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto shrink-0" />}
                </div>

                {/* Pro Click */}
                <div className={`p-2 rounded-lg border flex items-center space-x-1.5 ${
                  config.enableProClickEarning 
                    ? 'border-amber-500/40 bg-amber-950/20 text-amber-200' 
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 opacity-60'
                }`}>
                  <Crown className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate font-semibold">Pro Click</span>
                  {config.enableProClickEarning && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-auto shrink-0" />}
                </div>
              </div>
            </div>

            {/* Simulated Live Chat Response Bubble */}
            <div className="p-2.5 rounded-xl bg-[#110E20] border border-slate-800/80 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center space-x-1 text-[#F3E5AB] font-bold">
                  <span className={`w-1.5 h-1.5 rounded-full ${themeStyle.accentDot}`} />
                  <span>Obelisk Assistant</span>
                </span>
                <span className="font-mono">Temp: {config.aiTemperature || 0.7}</span>
              </div>
              <p className="text-slate-200 text-xs">
                {language === 'ti'
                  ? `ሰላም! ናይ ${config.appName || 'AXUMITE AI'} ኣገልግሎት ንምጥቃም ድሉዋት ዲኹም? ዝኾነ ሕቶ ብትግርኛ ወይ እንግሊዝኛ ክትሓቱ ትኽእሉ ኢኹም።`
                  : `Welcome to ${config.appName || 'AXUMITE AI'}. All systems operational with token ceiling configured at ${config.tokenLimits?.free?.toLocaleString() || '10,000'} for free members.`}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Hint */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 px-1">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Interactive Branding Sandbox • Instant visual simulation</span>
        </span>
        <span className="font-mono text-slate-500">
          UI Theme: {themeStyle.name}
        </span>
      </div>

    </div>
  );
};
