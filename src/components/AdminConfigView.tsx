import React, { useState, useEffect } from 'react';
import { AppSystemConfig, UserProfile } from '../types';
import { 
  getStoredAppConfig, 
  saveStoredAppConfig, 
  DEFAULT_APP_CONFIG,
  isAdminOrCreator 
} from '../lib/permissions';
import { 
  Settings, Sliders, ShieldCheck, Cpu, Database, Palette, 
  Lock, Save, RotateCcw, Download, CheckCircle2, AlertTriangle, 
  Volume2, Sparkles, Server, Globe, Key, Bell, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AdminConfigLivePreview } from './AdminConfigLivePreview';

interface AdminConfigViewProps {
  currentUser: UserProfile;
  onConfigChange?: (config: AppSystemConfig) => void;
}

export const AdminConfigView: React.FC<AdminConfigViewProps> = ({
  currentUser,
  onConfigChange,
}) => {
  const { language } = useLanguage();
  const [config, setConfig] = useState<AppSystemConfig>(getStoredAppConfig());
  const [savedConfig, setSavedConfig] = useState<AppSystemConfig>(getStoredAppConfig());
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'security' | 'tokens' | 'ui' | 'features'>('general');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const hasAdminAccess = isAdminOrCreator(currentUser);

  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveStoredAppConfig(config);
      setSavedConfig(config);
      if (onConfigChange) onConfigChange(config);
      setIsSaving(false);
      triggerNotification(
        language === 'ti' 
          ? 'ቅጥዕታት መድረኽ ብትክክል ተዓቂቡ ኣሎ!' 
          : 'Application system configuration successfully applied and synced.'
      );
    }, 400);
  };

  const handleResetDefaults = () => {
    if (confirm(
      language === 'ti'
        ? 'ኩሉ ቅጥዕታት ናብቲ መበቆላዊ (Default) ክምለስ ርግጸኛ ዲኻ?'
        : 'Are you sure you want to reset all system configurations to sovereign factory defaults?'
    )) {
      setConfig(DEFAULT_APP_CONFIG);
      saveStoredAppConfig(DEFAULT_APP_CONFIG);
      setSavedConfig(DEFAULT_APP_CONFIG);
      if (onConfigChange) onConfigChange(DEFAULT_APP_CONFIG);
      triggerNotification(
        language === 'ti' 
          ? 'ኩሉ ቅጥዕታት ናብ ንቡር ተመሊሱ ኣሎ።' 
          : 'System configuration reset to default settings.'
      );
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `axumite_system_config_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotification('System configuration exported as JSON.');
  };

  if (!hasAdminAccess) {
    return (
      <div className="bg-[#0B0914] border border-red-900/50 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-red-300 font-serif">
          {language === 'ti' ? 'ፍቓድ የብልኩምን (Access Restricted)' : 'Administrative Access Restricted'}
        </h2>
        <p className="text-xs text-slate-400">
          {language === 'ti'
            ? 'እዚ ገጽ ንሓለፍቲ (Admin / Creator) ጥራይ ዝተፈቕደ እዩ።'
            : 'Only verified Administrators and Creators hold the cryptographic authority to configure platform variables.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 ${
          notification.type === 'success' 
            ? 'bg-[#161424] border border-[#C5A059] text-[#F3E5AB]' 
            : 'bg-red-950 border border-red-500 text-red-100'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141022] via-[#0E0C17] to-[#0A0812] border border-[#8E6D28]/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-[#C5A059] flex items-center justify-center text-[#F3E5AB]">
                <Sliders className="w-5 h-5 text-[#E1C47D]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-cinzel text-[#F3E5AB] tracking-wide">
                {language === 'ti' ? 'ናይ መድረኽ ምሉእ ምቁጽጻርን ቅጥዕን' : 'SYSTEM CONFIGURATION & ADMIN CONTROLS'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'ti'
                ? 'ናይ AI ሞዴላት፡ መተሓላለፊ ፍቓዳት፡ ጽገና፡ ኮታ ቶከን ከምኡ ውን ድሕንነት መድረኽ ምሉእ ብምሉእ ኣብዚ ተቖጻጸሩ።'
                : 'Central master console to configure AI parameters, token ceilings, feature toggles, security rules, and global UI defaults.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md ${
                showLivePreview 
                  ? 'bg-amber-500/20 border-amber-400/60 text-[#F3E5AB]' 
                  : 'bg-[#1A162B] border-[#8E6D28]/40 text-slate-400 hover:text-white'
              }`}
              title={showLivePreview ? "Hide Live UI Preview" : "Show Live UI Preview"}
            >
              {showLivePreview ? <Eye className="w-3.5 h-3.5 text-amber-300" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              <span>{showLivePreview ? (language === 'ti' ? 'ቅድመ-ተረኽቦ' : 'Live Preview: ON') : (language === 'ti' ? 'ቅድመ-ተረኽቦ ኣርኢ' : 'Show Preview')}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-2 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 text-[#F3E5AB] text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              title="Export Config as JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#E1C47D]" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="px-3 py-2 bg-[#1A162B] hover:bg-[#2F1D1D] border border-red-900/40 text-rose-300 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Reset to Factory Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:brightness-110 flex items-center space-x-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-black" />
              <span>{isSaving ? 'Saving...' : language === 'ti' ? 'ቅጥዒ ዓቅብ' : 'Save Config'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Interactive Live Preview Window for Branding & UI */}
      {showLivePreview && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <AdminConfigLivePreview
            config={config}
            savedConfig={savedConfig}
            onThemeSelect={(th) => setConfig({ ...config, ui: { ...config.ui, primaryTheme: th } })}
          />
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="bg-[#090812] border border-[#8E6D28]/30 rounded-2xl p-1.5 flex flex-wrap items-center gap-1 shadow-md">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'general'
              ? 'bg-[#2A2010] text-[#F3E5AB] border border-[#C5A059]/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#141220]'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-[#E1C47D]" />
          <span>{language === 'ti' ? 'ሓፈሻዊ' : 'General & System'}</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-[#2A2010] text-[#F3E5AB] border border-[#C5A059]/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#141220]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'ti' ? 'AI ሞዴል' : 'AI Engine & Prompts'}</span>
        </button>

        <button
          onClick={() => setActiveTab('tokens')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'tokens'
              ? 'bg-[#2A2010] text-[#F3E5AB] border border-[#C5A059]/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#141220]'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ti' ? 'ኮታ ቶከን' : 'Token Limits & Quotas'}</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#2A2010] text-[#F3E5AB] border border-[#C5A059]/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#141220]'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'ti' ? 'ድሕንነት' : 'Security & Access'}</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'features'
              ? 'bg-[#2A2010] text-[#F3E5AB] border border-[#C5A059]/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#141220]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{language === 'ti' ? 'ባህርያት' : 'Feature Flags'}</span>
        </button>

        <button
          onClick={() => setActiveTab('ui')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'ui'
              ? 'bg-[#2A2010] text-[#F3E5AB] border border-[#C5A059]/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#141220]'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-pink-400" />
          <span>{language === 'ti' ? 'መልክዕን ቅርጽን' : 'UI & Appearance'}</span>
        </button>
      </div>

      {/* Tab 1: General & System */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* App Branding Titles */}
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <Globe className="w-4 h-4 text-[#E1C47D]" />
              <span>{language === 'ti' ? 'ስምን መግለጺን መድረኽ' : 'Platform Identity'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Application Name</label>
                <input
                  type="text"
                  value={config.appName}
                  onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                  className="w-full bg-[#141220] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3 py-2 text-slate-100 font-medium outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subtitle / Motto</label>
                <input
                  type="text"
                  value={config.appSubtitle}
                  onChange={(e) => setConfig({ ...config, appSubtitle: e.target.value })}
                  className="w-full bg-[#141220] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3 py-2 text-slate-100 font-medium outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Default System Language</label>
                <select
                  value={config.defaultLanguage}
                  onChange={(e) => setConfig({ ...config, defaultLanguage: e.target.value as any })}
                  className="w-full bg-[#141220] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3 py-2 text-slate-100 font-medium outline-none"
                >
                  <option value="ti">ትግርኛ (Tigrinya)</option>
                  <option value="gez">ግዕዝ (Ge'ez Script)</option>
                  <option value="en">English (International)</option>
                  <option value="de">Deutsch (German)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Maintenance Mode & Operations */}
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <Server className="w-4 h-4 text-[#E1C47D]" />
              <span>{language === 'ti' ? 'ናይ ጽገናን ምዝገባን ኩነታት' : 'System Availability & Sign-Up'}</span>
            </h3>

            <div className="space-y-4 text-xs">
              {/* Maintenance Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#14101A] border border-amber-900/40">
                <div>
                  <div className="font-bold text-slate-100">Maintenance Mode</div>
                  <div className="text-[11px] text-slate-400">Lock app for non-admin users during updates</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.maintenanceMode}
                    onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* Maintenance Notice Message */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Maintenance Lock Notice</label>
                <textarea
                  rows={2}
                  value={config.maintenanceNotice}
                  onChange={(e) => setConfig({ ...config, maintenanceNotice: e.target.value })}
                  className="w-full bg-[#141220] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3 py-2 text-slate-100 font-medium outline-none text-xs"
                />
              </div>

              {/* Public Registration Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141220] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-100">Public User Registration</div>
                  <div className="text-[11px] text-slate-400">Allow new users to sign up freely</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.publicSignUp}
                    onChange={(e) => setConfig({ ...config, publicSignUp: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Engine & Model Parameters */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{language === 'ti' ? 'ናይ AI ሞዴል ምምራጽ' : 'Core LLM Engine Selection'}</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Default Gemini Model</label>
                <select
                  value={config.defaultModel}
                  onChange={(e) => setConfig({ ...config, defaultModel: e.target.value })}
                  className="w-full bg-[#141220] border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-slate-100 font-mono outline-none"
                >
                  <option value="gemini-3.7-flash">gemini-3.7-flash (Fast & Multilingual Default)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Sovereign Reasoning)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast Lightweight)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Temperature (Creativity): {config.aiTemperature}</label>
                  <span className="text-[10px] text-slate-400 font-mono">0.0 (Precise) - 1.0 (Creative)</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={config.aiTemperature}
                  onChange={(e) => setConfig({ ...config, aiTemperature: parseFloat(e.target.value) })}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Max Output Tokens: {config.maxOutputTokens}</label>
                </div>
                <select
                  value={config.maxOutputTokens}
                  onChange={(e) => setConfig({ ...config, maxOutputTokens: parseInt(e.target.value) })}
                  className="w-full bg-[#141220] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono outline-none"
                >
                  <option value={1024}>1,024 Tokens (~750 words)</option>
                  <option value={2048}>2,048 Tokens (Recommended Standard)</option>
                  <option value={4096}>4,096 Tokens (Long Discourse)</option>
                  <option value={8192}>8,192 Tokens (Max Full Synthesis)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <Sparkles className="w-4 h-4 text-[#E1C47D]" />
              <span>{language === 'ti' ? 'ናይ ሲስተም መበቆላዊ ትእዛዝ (System Prompt)' : 'Master System Prompt Directive'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <p className="text-[11px] text-slate-400">
                This master prompt governs all conversations, tone, Ge'ez cultural ethics, and accuracy standards across the entire app.
              </p>
              <textarea
                rows={6}
                value={config.systemPromptBase}
                onChange={(e) => setConfig({ ...config, systemPromptBase: e.target.value })}
                className="w-full bg-[#141220] border border-slate-700 focus:border-[#C5A059] rounded-xl p-3 text-slate-100 font-mono text-[11px] leading-relaxed outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Token Limits & Quotas */}
      {activeTab === 'tokens' && (
        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-5 shadow-lg">
          <div>
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>{language === 'ti' ? 'ናይ ምድብ ተጠቃሚ ኮታ ቶከን' : 'Role-Based Default Token Ceilings'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Set default monthly/daily token allocations automatically assigned when a user is registered or assigned a role tier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Free Tier */}
            <div className="bg-[#141220] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-bold text-slate-300">Free Member</div>
              <div className="text-[11px] text-slate-400">Default allowance for new accounts</div>
              <input
                type="number"
                value={config.tokenLimits.free}
                onChange={(e) => setConfig({
                  ...config,
                  tokenLimits: { ...config.tokenLimits, free: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-[#0B0914] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono font-bold"
              />
            </div>

            {/* Pro Tier */}
            <div className="bg-[#141220] border border-indigo-900/60 rounded-xl p-4 space-y-2">
              <div className="font-bold text-indigo-300">ኣክሱማይት AI Pro</div>
              <div className="text-[11px] text-slate-400">Standard paid subscriber tier</div>
              <input
                type="number"
                value={config.tokenLimits.pro}
                onChange={(e) => setConfig({
                  ...config,
                  tokenLimits: { ...config.tokenLimits, pro: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-[#0B0914] border border-slate-700 rounded-lg px-3 py-1.5 text-indigo-200 font-mono font-bold"
              />
            </div>

            {/* Scholar Tier */}
            <div className="bg-[#141220] border border-[#8E6D28]/60 rounded-xl p-4 space-y-2">
              <div className="font-bold text-[#F3E5AB]">Axumite Sovereign Scholar</div>
              <div className="text-[11px] text-slate-400">High-volume research tier</div>
              <input
                type="number"
                value={config.tokenLimits.scholar}
                onChange={(e) => setConfig({
                  ...config,
                  tokenLimits: { ...config.tokenLimits, scholar: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-[#0B0914] border border-slate-700 rounded-lg px-3 py-1.5 text-[#F3E5AB] font-mono font-bold"
              />
            </div>

            {/* Admin Tier */}
            <div className="bg-[#141220] border border-emerald-900/60 rounded-xl p-4 space-y-2">
              <div className="font-bold text-emerald-300">Admin / Creator</div>
              <div className="text-[11px] text-slate-400">Unlimited administrative ceiling</div>
              <input
                type="number"
                value={config.tokenLimits.admin}
                onChange={(e) => setConfig({
                  ...config,
                  tokenLimits: { ...config.tokenLimits, admin: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-[#0B0914] border border-slate-700 rounded-lg px-3 py-1.5 text-emerald-200 font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Access */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-4 shadow-lg text-xs">
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ti' ? 'ሕግታት ድሕንነት መድረኽ' : 'Session & Cryptographic Rules'}</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141220] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-100">Enforce 2FA Biometric Passkeys</div>
                  <div className="text-[11px] text-slate-400">Require WebAuthn for administrative operations</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.security.enforce2FA}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, enforce2FA: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Session Inactivity Timeout (Minutes)</label>
                <select
                  value={config.security.sessionTimeoutMinutes}
                  onChange={(e) => setConfig({
                    ...config,
                    security: { ...config.security, sessionTimeoutMinutes: parseInt(e.target.value) }
                  })}
                  className="w-full bg-[#141220] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono outline-none"
                >
                  <option value={60}>60 Minutes (1 Hour)</option>
                  <option value={720}>720 Minutes (12 Hours)</option>
                  <option value={1440}>1,440 Minutes (24 Hours - Recommended)</option>
                  <option value={10080}>10,080 Minutes (7 Days)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max Failed Login Attempts Before Lockout</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={config.security.maxFailedAttempts}
                  onChange={(e) => setConfig({
                    ...config,
                    security: { ...config.security, maxFailedAttempts: parseInt(e.target.value) || 5 }
                  })}
                  className="w-full bg-[#141220] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-4 shadow-lg text-xs">
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <ShieldCheck className="w-4 h-4 text-[#E1C47D]" />
              <span>{language === 'ti' ? 'መሰል ምውራድ ዳታ' : 'Data Privacy & Governance'}</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141220] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-100">Allow Admin Directory CSV Export</div>
                  <div className="text-[11px] text-slate-400">Permit downloading encrypted customer audit reports</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.security.allowExportCSV}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, allowExportCSV: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] space-y-1 text-amber-200">
                <div className="font-bold flex items-center space-x-1.5 text-[#F3E5AB]">
                  <Key className="w-3.5 h-3.5" />
                  <span>Sovereign Identity Key Guardian</span>
                </div>
                <p className="text-slate-300">
                  Creator profile (<span className="text-[#F3E5AB] font-mono">BeckyLove2004@gmail.com</span>) holds inviolable root super-admin key authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Feature Flags */}
      {activeTab === 'features' && (
        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-5 shadow-lg">
          <div>
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{language === 'ti' ? 'ናይ መተግበሪ ፍሉያት ባህርያት ምቁጽጻር' : 'Global Application Feature Toggles'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Instantly enable or disable specific AI modules across the client application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141220] border border-slate-800">
              <div>
                <div className="font-bold text-slate-100">Voice Synthesis & Audio Playback</div>
                <div className="text-[11px] text-slate-400">Enable Tigrinya hands-free speech output</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableVoiceSynthesis}
                  onChange={(e) => setConfig({ ...config, enableVoiceSynthesis: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141220] border border-slate-800">
              <div>
                <div className="font-bold text-slate-100">Vision Studio & OCR Extractor</div>
                <div className="text-[11px] text-slate-400">Enable image recognition and document analysis</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableImageRecognition}
                  onChange={(e) => setConfig({ ...config, enableImageRecognition: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141220] border border-slate-800">
              <div>
                <div className="font-bold text-slate-100">Prompt Forge Studio</div>
                <div className="text-[11px] text-slate-400">Enable high-end prompt engineering creator</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enablePromptForge}
                  onChange={(e) => setConfig({ ...config, enablePromptForge: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141220] border border-slate-800">
              <div>
                <div className="font-bold text-slate-100">Pro Click Reward & Referral System</div>
                <div className="text-[11px] text-slate-400">Enable token claim tasks and referral bonuses</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableProClickEarning}
                  onChange={(e) => setConfig({ ...config, enableProClickEarning: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Churn Alert Push Notification Feature */}
            <div className="md:col-span-2 p-4 rounded-xl bg-[#171329] border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-300 flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Automated Push Notification on Subscription Churn Spike</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Proactively alert admins via notificationService whenever 30-day churn rate exceeds defined ceiling
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableChurnAlert ?? true}
                    onChange={(e) => setConfig({ ...config, enableChurnAlert: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#342750]">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">
                    Churn Alert Ceiling Threshold (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.1"
                      value={config.churnThreshold ?? 3.0}
                      onChange={(e) => setConfig({ ...config, churnThreshold: parseFloat(e.target.value) || 3.0 })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <span className="px-2 py-1 bg-[#100D1C] border border-amber-500/50 rounded-lg text-amber-300 font-mono font-bold text-xs min-w-[50px] text-center">
                      {(config.churnThreshold ?? 3.0).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-[11px] text-gray-300 bg-[#100D1C] p-2.5 rounded-xl border border-slate-800">
                  <span>
                    Current baseline churn is <strong className="text-emerald-400">1.8%</strong>. Push alerts will trigger if monthly churn reaches <strong className="text-amber-300">{(config.churnThreshold ?? 3.0).toFixed(1)}%</strong>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: UI & Appearance */}
      {activeTab === 'ui' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <Palette className="w-4 h-4 text-pink-400" />
              <span>{language === 'ti' ? 'ቀለማትን መልክዕን' : 'Imperial Palette & Theme'}</span>
            </h3>

            <div className="space-y-3">
              <label className="block text-slate-300 font-semibold mb-1">Primary Sovereign Accent</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'gold', name: 'Axumite Gold (Default)', color: 'bg-amber-500' },
                  { id: 'cyan', name: 'Asmara Cyan', color: 'bg-cyan-500' },
                  { id: 'obsidian', name: 'Royal Obsidian', color: 'bg-slate-500' },
                  { id: 'ruby', name: 'Red Sea Ruby', color: 'bg-rose-500' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setConfig({ ...config, ui: { ...config.ui, primaryTheme: th.id as any } })}
                    className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                      config.ui.primaryTheme === th.id
                        ? 'border-[#C5A059] bg-[#2A2010] text-[#F3E5AB]'
                        : 'border-slate-800 bg-[#141220] text-slate-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${th.color}`} />
                    <span className="font-semibold text-[11px]">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-[#F3E5AB] flex items-center space-x-2 font-serif border-b border-[#2D2314] pb-2">
              <Sparkles className="w-4 h-4 text-[#E1C47D]" />
              <span>{language === 'ti' ? 'ናይ መጀመርታ ስክሪን' : 'Welcome Experience Controls'}</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141220] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-100">Auto-show Welcome Splash on Boot</div>
                  <div className="text-[11px] text-slate-400">Display luxury welcome stela upon app opening</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.ui.showWelcomeOverlayOnStartup}
                    onChange={(e) => setConfig({
                      ...config,
                      ui: { ...config.ui, showWelcomeOverlayOnStartup: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141220] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-100">Axumite Guide Stela Cursor</div>
                  <div className="text-[11px] text-slate-400">Floating animated tutor guiding new users</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.ui.enableCursorGuide}
                    onChange={(e) => setConfig({
                      ...config,
                      ui: { ...config.ui, enableCursorGuide: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Action Floating Footer */}
      <div className="bg-[#120F1D] border border-[#8E6D28]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'ti' 
              ? 'ዝኾነ ለውጢ ብኡንብኡ ኣብ ኩሉ ተጠቀምቲ ተግባራዊ ይኸውን።' 
              : 'All saved configurations take immediate system-wide effect across sessions.'}
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:brightness-110 flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-black" />
          <span>{isSaving ? 'Applying...' : language === 'ti' ? 'ቅጥዕታት መድረኽ ኣጽድቕ' : 'Apply Configuration'}</span>
        </button>
      </div>

    </div>
  );
};
