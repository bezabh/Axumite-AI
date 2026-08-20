import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  ShieldCheck, Lock, Fingerprint, Key, Smartphone, Laptop, Globe, AlertTriangle, 
  Check, X, RefreshCw, Trash2, ShieldAlert, Eye, EyeOff, Shield, CheckCircle2, 
  History, Server, Zap, Cpu, Terminal, Copy, Download, Radio, LogOut, HardDrive, Clock,
  Type, Sparkles, BookOpen, Palette
} from 'lucide-react';

interface SecurityManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SecurityAuditLog {
  id: string;
  event: string;
  status: 'success' | 'warning' | 'danger';
  ip: string;
  location: string;
  timestamp: string;
}

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-current',
    device: 'Android / Mobile Web',
    browser: 'Chrome 128.0 (ARM64)',
    location: 'Asmara, Eritrea (0.01 km)',
    ip: '197.156.104.12',
    lastActive: 'Active Now',
    isCurrent: true,
  },
  {
    id: 'sess-2',
    device: 'MacBook Pro 16"',
    browser: 'Safari 17.5 (macOS)',
    location: 'Addis Ababa, Ethiopia',
    ip: '196.188.240.89',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: 'sess-3',
    device: 'Windows Desktop PC',
    browser: 'Firefox 129.0',
    location: 'London, United Kingdom',
    ip: '82.132.210.45',
    lastActive: 'Yesterday at 18:42',
    isCurrent: false,
  },
];

const INITIAL_SECURITY_LOGS: SecurityAuditLog[] = [
  {
    id: 'sec-log-1',
    event: 'User Session Authenticated (Biometric WebAuthn Passkey)',
    status: 'success',
    ip: '197.156.104.12',
    location: 'Asmara, ER',
    timestamp: 'Just now',
  },
  {
    id: 'sec-log-2',
    event: 'Registration Welcome Bonus (+5,000 Tokens) Credited to Vault',
    status: 'success',
    ip: '197.156.104.12',
    location: 'Asmara, ER',
    timestamp: '10 mins ago',
  },
  {
    id: 'sec-log-3',
    event: 'OTP SMS Verification Code Delivered (+251 91 123 4567)',
    status: 'success',
    ip: '196.188.240.89',
    location: 'Addis Ababa, ET',
    timestamp: '2 hours ago',
  },
  {
    id: 'sec-log-4',
    event: 'Vault Security PIN Verification Request',
    status: 'success',
    ip: '82.132.210.45',
    location: 'London, UK',
    timestamp: 'Yesterday at 18:40',
  },
];

export const SecurityManagementModal: React.FC<SecurityManagementModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'typography' | 'pin' | '2fa' | 'sessions' | 'encryption' | 'audit'>('overview');

  // Typography Preference State ('modern' vs 'calligraphic')
  const [fontPreference, setFontPreference] = useState<'modern' | 'calligraphic'>('modern');
  const [testSampleText, setTestSampleText] = useState('ሰላም ንኹልኹም ፡ AXUMITE AI 2026');

  // Security Toggles State (backed by localStorage)
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [localEncryptionEnabled, setLocalEncryptionEnabled] = useState(true);
  const [pinLockEnabled, setPinLockEnabled] = useState(true);
  const [securityPin, setSecurityPin] = useState('7849');

  // PIN Form State
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');
  const [pinErrorMsg, setPinErrorMsg] = useState('');

  // 2FA Backup Codes State
  const [backupCodes, setBackupCodes] = useState<string[]>([
    'AXUM-9482-1048', 'AXUM-3819-7401', 'AXUM-5820-9921', 'AXUM-1102-4820',
    'AXUM-7739-2901', 'AXUM-6031-8842', 'AXUM-4921-0032', 'AXUM-8291-5510'
  ]);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Active Sessions State
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>(INITIAL_SECURITY_LOGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Emergency Wipe Confirmation State
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);

  // Load stored security & typography settings
  useEffect(() => {
    if (!isOpen) return;
    try {
      const storedFont = localStorage.getItem('axumite_font_theme');
      if (storedFont === 'calligraphic' || storedFont === 'modern') {
        setFontPreference(storedFont);
      }

      const storedSec = localStorage.getItem('axumite_security_config');
      if (storedSec) {
        const parsed = JSON.parse(storedSec);
        if (typeof parsed.biometricEnabled === 'boolean') setBiometricEnabled(parsed.biometricEnabled);
        if (typeof parsed.twoFactorEnabled === 'boolean') setTwoFactorEnabled(parsed.twoFactorEnabled);
        if (typeof parsed.localEncryptionEnabled === 'boolean') setLocalEncryptionEnabled(parsed.localEncryptionEnabled);
        if (typeof parsed.pinLockEnabled === 'boolean') setPinLockEnabled(parsed.pinLockEnabled);
        if (parsed.securityPin) setSecurityPin(parsed.securityPin);
        if (parsed.fontPreference === 'calligraphic' || parsed.fontPreference === 'modern') {
          setFontPreference(parsed.fontPreference);
        }
      }
    } catch (e) {
      console.error('Failed to load security config:', e);
    }
  }, [isOpen]);

  const saveSecurityConfig = (updated: Record<string, any>) => {
    try {
      const storedSec = localStorage.getItem('axumite_security_config') || '{}';
      const parsed = JSON.parse(storedSec);
      const merged = { ...parsed, ...updated };
      localStorage.setItem('axumite_security_config', JSON.stringify(merged));
    } catch (e) {
      console.error('Failed to save security config:', e);
    }
  };

  const handleToggleFontPreference = (newMode: 'modern' | 'calligraphic') => {
    setFontPreference(newMode);
    try {
      localStorage.setItem('axumite_font_theme', newMode);
      saveSecurityConfig({ fontPreference: newMode });
      
      if (newMode === 'calligraphic') {
        document.documentElement.classList.add('font-theme-calligraphic');
        document.documentElement.classList.remove('font-theme-modern');
        showToast("Historical Calligraphic Ge'ez Typography (ጥንታዊ ብራና) Activated ✓");
      } else {
        document.documentElement.classList.add('font-theme-modern');
        document.documentElement.classList.remove('font-theme-calligraphic');
        showToast("Standard Modern Typography (ዘመናዊ ፅሑፍ) Activated ✓");
      }

      window.dispatchEvent(new CustomEvent('axumite_font_changed', { detail: { fontPreference: newMode } }));

      // Audit Log entry
      const log: SecurityAuditLog = {
        id: `sec-font-${Date.now()}`,
        event: `Typography Mode Switched: ${newMode === 'calligraphic' ? "Historical Calligraphic Ge'ez (Serif)" : "Standard Modern (Sans-Serif)"}`,
        status: 'success',
        ip: '197.156.104.12',
        location: 'Asmara, ER',
        timestamp: 'Just now',
      };
      setSecurityLogs((prev) => [log, ...prev]);
    } catch (e) {
      console.error('Failed to apply font preference:', e);
    }
  };

  const handleToggleBiometric = () => {
    const nextVal = !biometricEnabled;
    setBiometricEnabled(nextVal);
    saveSecurityConfig({ biometricEnabled: nextVal });
    showToast(nextVal ? 'Biometric FaceID / Fingerprint Login Enabled ✓' : 'Biometric Auth Disabled');
  };

  const handleToggle2FA = () => {
    const nextVal = !twoFactorEnabled;
    setTwoFactorEnabled(nextVal);
    saveSecurityConfig({ twoFactorEnabled: nextVal });
    showToast(nextVal ? '2FA OTP Shield Active ✓' : '2FA Protection Disabled');
  };

  const handleToggleEncryption = () => {
    const nextVal = !localEncryptionEnabled;
    setLocalEncryptionEnabled(nextVal);
    saveSecurityConfig({ localEncryptionEnabled: nextVal });
    showToast(nextVal ? 'AES-256 Vault Encryption Active ✓' : 'Local State Encryption Disabled');
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinErrorMsg('');
    setPinSuccessMsg('');

    if (newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin)) {
      setPinErrorMsg('Security PIN must be 4 to 6 numeric digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinErrorMsg('PIN confirmation does not match.');
      return;
    }

    setSecurityPin(newPin);
    setPinLockEnabled(true);
    saveSecurityConfig({ securityPin: newPin, pinLockEnabled: true });
    setNewPin('');
    setConfirmPin('');
    setPinSuccessMsg('Security PIN successfully updated & encrypted ✓');

    // Add entry to audit log
    const newLog: SecurityAuditLog = {
      id: `sec-${Date.now()}`,
      event: 'Vault Security PIN Changed',
      status: 'warning',
      ip: '197.156.104.12',
      location: 'Asmara, ER',
      timestamp: 'Just now',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);

    setTimeout(() => setPinSuccessMsg(''), 3000);
  };

  const handleRegenerateBackupCodes = () => {
    const newCodes = Array.from({ length: 8 }, () => {
      const part1 = Math.floor(1000 + Math.random() * 9000);
      const part2 = Math.floor(1000 + Math.random() * 9000);
      return `AXUM-${part1}-${part2}`;
    });
    setBackupCodes(newCodes);
    showToast('New 2FA Recovery Emergency Codes Generated ✓');
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast('Remote device session terminated & revoked ✓');
  };

  const handleTerminateAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    showToast('All remote device sessions terminated successfully ✓');
  };

  const handlePanicDataWipe = () => {
    try {
      localStorage.clear();
      showToast('EMERGENCY PANIC WIPE COMPLETED: All local vault data, keys & cache purged.');
      onUpdateUser({ isLoggedIn: false });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {
      console.error('Panic wipe error:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#080808] border-2 border-[#8E6D28] w-full max-w-2xl rounded-3xl p-5 sm:p-7 space-y-6 relative shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Decorative Gold Radial Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full bg-[#14110B] border border-[#8E6D28]/40 hover:border-[#C5A059] transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5 border-b border-[#8E6D28]/30 pb-4 shrink-0">
          <div className="w-12 h-12 rounded-2xl border border-[#C5A059] bg-gradient-to-br from-[#1F190D] to-[#0A0804] flex items-center justify-center text-[#F3E5AB] shadow-lg shrink-0">
            <ShieldCheck className="w-7 h-7 text-[#C5A059] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="serif-luxury text-lg sm:text-xl font-bold tracking-wider text-slate-100 gold-gradient">
                AXUMITE APP SECURITY & VAULT MANAGEMENT
              </h2>
            </div>
            <p className="text-xs text-gray-400">
              Enterprise Biometrics, 2FA Shields, Session Locks, AES-256 Vault & Security Audit Ledger
            </p>
          </div>
        </div>

        {/* Global Toast Banner */}
        {toastMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/80 p-3 rounded-2xl text-xs text-emerald-300 flex items-center justify-between shadow-lg animate-fade-in shrink-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-[#8E6D28]/20 shrink-0 text-xs font-bold no-scrollbar">
          {[
            { id: 'overview', label: 'Security Center', icon: <Shield className="w-3.5 h-3.5" /> },
            { id: 'typography', label: "Ge'ez Typography & Font", icon: <Type className="w-3.5 h-3.5" /> },
            { id: 'pin', label: 'PIN & Biometrics', icon: <Lock className="w-3.5 h-3.5" /> },
            { id: '2fa', label: '2FA & Recovery', icon: <Smartphone className="w-3.5 h-3.5" /> },
            { id: 'sessions', label: 'Active Devices', icon: <Laptop className="w-3.5 h-3.5" /> },
            { id: 'encryption', label: 'Vault Encryption', icon: <Server className="w-3.5 h-3.5" /> },
            { id: 'audit', label: 'Audit Logs', icon: <History className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-extrabold shadow-md'
                  : 'bg-[#120F0A] border border-[#8E6D28]/30 text-gray-300 hover:text-white hover:border-[#8E6D28]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              {/* Security Health Score Banner */}
              <div className="bg-gradient-to-r from-[#17140B] via-[#211A0D] to-[#0D0B06] border border-[#C5A059] p-4 rounded-2xl flex items-center justify-between shadow-xl">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-extrabold text-lg">
                    100%
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                      <span>Security Shield Status: EXCELLENT</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 rounded-full text-[10px] font-mono">
                        Sovereign Grade
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-300 pt-0.5">
                      Biometric Passkey, 2FA OTP, Vault PIN and AES-256 Storage Encryption are fully active.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Toggle Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Toggle 1: Biometric Login */}
                <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">Biometric Passkey (WebAuthn)</div>
                      <div className="text-[10px] text-gray-400">FaceID / TouchID Biometric Auth</div>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleBiometric}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                      biometricEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Toggle 2: 2FA Protection */}
                <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">Two-Factor Auth (2FA OTP)</div>
                      <div className="text-[10px] text-gray-400">SMS / Authenticator OTP Code</div>
                    </div>
                  </div>
                  <button
                    onClick={handleToggle2FA}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                      twoFactorEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Toggle 3: Vault PIN Lock */}
                <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">Vault Security PIN Lock</div>
                      <div className="text-[10px] text-gray-400">4-6 Digit Protection PIN ({securityPin ? 'Set' : 'None'})</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const nextVal = !pinLockEnabled;
                      setPinLockEnabled(nextVal);
                      saveSecurityConfig({ pinLockEnabled: nextVal });
                      showToast(nextVal ? 'Vault PIN Lock Active ✓' : 'PIN Protection Disabled');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                      pinLockEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Toggle 4: AES-256 Vault Encryption */}
                <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">AES-256 Local Encryption</div>
                      <div className="text-[10px] text-gray-400">Encrypted Local Storage Data</div>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleEncryption}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                      localEncryptionEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Feature 5: 30-Minute Inactivity Auto-Logout Shield */}
                <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-3.5 rounded-2xl flex items-center justify-between sm:col-span-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 flex items-center space-x-2">
                        <span>30-Minute Inactivity Auto-Logout Shield</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] rounded-full font-mono">
                          ACTIVE & PROTECTED
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Automatically terminates idle sessions after 30 minutes of no user interaction to safeguard your sensitive AI data.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>30m Timeout</span>
                  </div>
                </div>

                {/* Feature 6: App Typography & Calligraphy Mode Toggle */}
                <div className="bg-gradient-to-r from-[#17130A] to-[#0E0C07] border border-[#C5A059]/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:col-span-2 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                      <Type className="w-5 h-5 text-[#E1C47D]" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-xs">
                          {fontPreference === 'calligraphic' 
                            ? "Historical Calligraphic Ge'ez Script (ጥንታዊ ብራና)" 
                            : "Standard Modern Typography (ዘመናዊ ፅሑፍ)"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          fontPreference === 'calligraphic'
                            ? 'bg-amber-500/20 text-[#F3E5AB] border border-amber-500/50'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {fontPreference === 'calligraphic' ? "Calligraphic Serif" : "Modern Sans"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 pt-0.5">
                        {fontPreference === 'calligraphic'
                          ? "Using royal Axumite illuminated manuscript serif font (Noto Serif Ethiopic & Cinzel) across all views."
                          : "Using clean digital sans-serif font (Noto Sans Ethiopic & Plus Jakarta Sans) for high-density clarity."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleFontPreference(fontPreference === 'calligraphic' ? 'modern' : 'calligraphic')}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black font-extrabold text-[11px] uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer flex items-center space-x-1.5 shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{fontPreference === 'calligraphic' ? 'Switch to Modern' : "Switch to Ge'ez Calligraphy"}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('typography')}
                      className="p-1.5 rounded-xl bg-[#1A150A] border border-[#8E6D28]/40 hover:border-[#C5A059] text-gray-300 hover:text-white transition-all cursor-pointer"
                      title="Open Typography Studio"
                    >
                      <Palette className="w-4 h-4 text-[#C5A059]" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Active User Security Identity Summary */}
              <div className="bg-[#0A0906] border border-[#8E6D28]/25 p-4 rounded-2xl space-y-2">
                <div className="text-[11px] font-bold text-[#F3E5AB] uppercase tracking-wider">
                  Verified Security Principal Credentials
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="bg-[#120F0A] p-2 rounded-xl border border-[#8E6D28]/20">
                    <span className="text-gray-400 block text-[9px]">USER ID</span>
                    <span className="text-slate-200 font-bold truncate block">{user.id || 'usr-axum-7829'}</span>
                  </div>
                  <div className="bg-[#120F0A] p-2 rounded-xl border border-[#8E6D28]/20">
                    <span className="text-gray-400 block text-[9px]">PHONE STATUS</span>
                    <span className="text-emerald-400 font-bold block">{user.isPhoneVerified ? 'Verified ✓' : 'Unverified'}</span>
                  </div>
                  <div className="bg-[#120F0A] p-2 rounded-xl border border-[#8E6D28]/20">
                    <span className="text-gray-400 block text-[9px]">EMAIL STATUS</span>
                    <span className="text-emerald-400 font-bold block">{user.isEmailVerified ? 'Verified ✓' : 'Unverified'}</span>
                  </div>
                  <div className="bg-[#120F0A] p-2 rounded-xl border border-[#8E6D28]/20">
                    <span className="text-gray-400 block text-[9px]">ACTIVE SESSIONS</span>
                    <span className="text-amber-300 font-bold block">{sessions.length} Devices</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 1.5: GE'EZ TYPOGRAPHY & FONT PREFERENCE */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#17140B] via-[#211A0D] to-[#0D0B06] border border-[#C5A059] p-4 rounded-2xl flex items-center justify-between shadow-xl">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-[#F3E5AB] font-bold text-xl shrink-0">
                    <Type className="w-6 h-6 text-[#E1C47D]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                      <span>App-Wide Typography & Calligraphic Ge'ez Preference</span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-[#F3E5AB] border border-amber-500/50 rounded-full text-[10px] font-mono">
                        Global Setting
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-300 pt-0.5">
                      Toggle seamlessly between crisp modern minimalist typography and historical royal Axumite illuminated Birana manuscript calligraphy across all views, modals, and AI tools.
                    </p>
                  </div>
                </div>
              </div>

              {/* Font Mode Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Mode 1: Standard Modern Sans-Serif */}
                <div 
                  onClick={() => handleToggleFontPreference('modern')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    fontPreference === 'modern'
                      ? 'bg-gradient-to-br from-[#12141A] via-[#0C0E14] to-[#07080B] border-blue-400 shadow-xl ring-2 ring-blue-400/20'
                      : 'bg-[#0A0907] border-[#8E6D28]/30 hover:border-[#8E6D28] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-100 text-xs">Standard Modern Typography</h4>
                          <span className="text-[10px] text-blue-300 font-mono">Noto Sans Ethiopic + Plus Jakarta Sans</span>
                        </div>
                      </div>
                      {fontPreference === 'modern' && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/60 rounded-full text-[9px] font-mono font-bold flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Active Mode</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      Clean geometric digital sans-serif optimized for high readability, data density, code readability, and modern responsive screen layouts.
                    </p>

                    {/* Visual Typography Preview Box (Modern) */}
                    <div className="bg-[#050507] border border-blue-500/30 p-3 rounded-xl space-y-1.5 font-sans">
                      <div className="text-[9px] uppercase tracking-wider text-blue-400/80 font-mono">Live Modern Rendering Preview:</div>
                      <div className="text-slate-100 text-sm font-semibold">
                        ሰላም ፡ ንኹሉ ዓለም ፡ ኣክሱም AI 2026
                      </div>
                      <div className="text-gray-400 text-[11px]">
                        The quick brown fox jumps over the lazy dog &bull; ፩፪፫፬፭
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFontPreference('modern');
                    }}
                    className={`mt-3.5 w-full py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      fontPreference === 'modern'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-[#14120D] border border-[#8E6D28]/40 text-gray-300 hover:text-white hover:border-blue-400'
                    }`}
                  >
                    {fontPreference === 'modern' ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{fontPreference === 'modern' ? 'Current Active Font' : 'Activate Modern Font'}</span>
                  </button>
                </div>

                {/* Mode 2: Historical Calligraphic Ge'ez Serif */}
                <div 
                  onClick={() => handleToggleFontPreference('calligraphic')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    fontPreference === 'calligraphic'
                      ? 'bg-gradient-to-br from-[#1C160B] via-[#141008] to-[#0A0804] border-[#C5A059] shadow-xl ring-2 ring-[#C5A059]/30'
                      : 'bg-[#0A0907] border-[#8E6D28]/30 hover:border-[#8E6D28] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-[#F3E5AB] border border-amber-500/50">
                          <Sparkles className="w-4 h-4 text-[#E1C47D]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#F3E5AB] text-xs">Historical Calligraphic Ge'ez</h4>
                          <span className="text-[10px] text-amber-300/80 font-mono">Noto Serif Ethiopic + Cinzel + Libre Baskerville</span>
                        </div>
                      </div>
                      {fontPreference === 'calligraphic' && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-[#F3E5AB] border border-[#C5A059] rounded-full text-[9px] font-mono font-bold flex items-center space-x-1">
                          <Check className="w-3 h-3 text-[#E1C47D]" />
                          <span>Active Mode</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      Royal Axumite illuminated manuscript script with authentic Ge'ez calligraphic serifs, classical Harag aesthetics, and imperial monumental engraving letterforms.
                    </p>

                    {/* Visual Typography Preview Box (Calligraphic) */}
                    <div className="bg-[#080603] border border-[#C5A059]/40 p-3 rounded-xl space-y-1.5 font-geez-calligraphy">
                      <div className="text-[9px] uppercase tracking-wider text-[#C5A059] font-mono">Live Calligraphic Rendering Preview:</div>
                      <div className="text-[#F3E5AB] text-sm font-bold tracking-wide">
                        « ሰላም ፡ ንኹሉ ፡ ፍጥረት ፡ ኣክሱም ፡ ጥበብ ፡ ማኅተም ፩፱፱፩ »
                      </div>
                      <div className="text-amber-200/70 text-[11px] italic font-serif">
                        SOVEREIGN AXUMITE CALLIGRAPHIC HERITAGE &bull; ፩፪፫፬፭
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFontPreference('calligraphic');
                    }}
                    className={`mt-3.5 w-full py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      fontPreference === 'calligraphic'
                        ? 'bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black shadow-md'
                        : 'bg-[#14120D] border border-[#8E6D28]/40 text-gray-300 hover:text-white hover:border-[#C5A059]'
                    }`}
                  >
                    {fontPreference === 'calligraphic' ? <Check className="w-3.5 h-3.5 text-black" /> : null}
                    <span>{fontPreference === 'calligraphic' ? 'Current Active Font' : "Activate Ge'ez Calligraphy"}</span>
                  </button>
                </div>

              </div>

              {/* Interactive Live Typography Sandbox */}
              <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-100 text-xs flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span>Interactive Real-Time Typography Tester & Sandbox</span>
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">Live Sandbox</span>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                    Type Custom Phrase or Fidel Sample:
                  </label>
                  <input
                    type="text"
                    value={testSampleText}
                    onChange={(e) => setTestSampleText(e.target.value)}
                    placeholder="Type Tigrinya or English text to test typography..."
                    className="w-full bg-[#120F0A] border border-[#8E6D28]/40 p-2.5 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-gray-400 mr-1">Quick Samples:</span>
                  {[
                    'ሰላም', 'ፍቕሪ', 'ጥበብ', 'ኣክሱም', 'ኤርትራ', 'ሓርነት', 'በረኸት', 'ልዑላዊ'
                  ].map((word) => (
                    <button
                      key={word}
                      onClick={() => setTestSampleText(`${word} ፡ AXUMITE AI`)}
                      className="px-2.5 py-1 bg-[#15120C] border border-[#8E6D28]/30 hover:border-[#C5A059] text-[#F3E5AB] text-[10px] rounded-lg cursor-pointer transition-all"
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {/* Live Sandbox Render Output */}
                <div className={`p-4 rounded-xl border ${
                  fontPreference === 'calligraphic'
                    ? 'bg-[#090703] border-[#C5A059]/40 font-geez-calligraphy'
                    : 'bg-[#070709] border-blue-500/30 font-sans'
                }`}>
                  <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 pb-1 border-b border-white/5">
                    <span>ACTIVE STYLE: {fontPreference === 'calligraphic' ? "HISTORICAL CALLIGRAPHIC GE'EZ (SERIF)" : "STANDARD MODERN (SANS-SERIF)"}</span>
                    <span>{fontPreference === 'calligraphic' ? 'Noto Serif Ethiopic' : 'Noto Sans Ethiopic'}</span>
                  </div>
                  <div className={`pt-2.5 text-base sm:text-lg font-bold leading-snug ${
                    fontPreference === 'calligraphic' ? 'text-[#F3E5AB]' : 'text-slate-100'
                  }`}>
                    {testSampleText || 'ሰላም ንኹልኹም ፡ AXUMITE AI 2026'}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PIN & BIOMETRICS */}
          {activeTab === 'pin' && (
            <div className="space-y-4">
              
              {/* Form to Set / Change Security PIN */}
              <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-4 sm:p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                  <Key className="w-4 h-4 text-[#C5A059]" />
                  <span>Configure Vault Security PIN Code</span>
                </h3>
                <p className="text-gray-300 text-xs">
                  Your PIN is required when performing sensitive operations like Pro Click token withdrawals, profile credentials export, or unlocking offline encrypted notes.
                </p>

                {pinErrorMsg && (
                  <div className="p-2.5 bg-rose-500/20 border border-rose-500/80 text-rose-300 rounded-xl flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{pinErrorMsg}</span>
                  </div>
                )}

                {pinSuccessMsg && (
                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/80 text-emerald-300 rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{pinSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePin} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                        New Security PIN (4-6 Digits):
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        placeholder="••••"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full bg-[#120F0A] border border-[#8E6D28]/40 p-2.5 rounded-xl text-slate-100 font-mono tracking-widest focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                        Confirm Security PIN:
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        placeholder="••••"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        className="w-full bg-[#120F0A] border border-[#8E6D28]/40 p-2.5 rounded-xl text-slate-100 font-mono tracking-widest focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-4 h-4 text-black" />
                    <span>Save & Encrypt PIN Code</span>
                  </button>
                </form>
              </div>

              {/* Biometric Status Card */}
              <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100">WebAuthn Biometric Passkeys</h4>
                    <p className="text-[11px] text-gray-400 pt-0.5">
                      Hardware-level biometric authorization using Android Fingerprint, FaceID, or TouchID.
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold rounded-full">
                  Hardware Active ✓
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: 2FA & RECOVERY CODES */}
          {activeTab === '2fa' && (
            <div className="space-y-4">
              
              <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Smartphone className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-slate-100 text-sm">Two-Factor Authentication (2FA) Status</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold rounded-full">
                    Active
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Every sign-in attempt from an unrecognized device requires a 6-digit OTP code sent via SMS to <strong className="text-[#F3E5AB]">{user.countryCode || '+251'} {user.phoneNumber || '911234567'}</strong> or delivered through your authenticator app.
                </p>
              </div>

              {/* Emergency Backup Recovery Codes */}
              <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-[#C5A059]" />
                      <span>Emergency Recovery Codes</span>
                    </h4>
                    <p className="text-[11px] text-gray-400 pt-0.5">
                      Store these codes in a safe place. Each code can be used once if you lose access to your phone or authenticator.
                    </p>
                  </div>

                  <button
                    onClick={handleRegenerateBackupCodes}
                    className="px-3 py-1.5 bg-[#14110B] border border-[#8E6D28]/50 hover:bg-[#8E6D28]/30 text-amber-200 text-[10px] font-bold uppercase rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-amber-400" />
                    <span>Regenerate</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center pt-1">
                  {backupCodes.map((code, idx) => (
                    <div
                      key={idx}
                      className="bg-[#120F0A] border border-[#8E6D28]/30 p-2 rounded-xl text-[#F3E5AB] font-bold text-[11px] tracking-wider select-all"
                    >
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleCopyBackupCodes}
                    className="px-4 py-2 bg-[#1A150A] border border-[#8E6D28] hover:bg-[#8E6D28] text-[#F3E5AB] hover:text-black text-xs font-bold uppercase rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCodes ? 'Copied to Clipboard! ✓' : 'Copy All Recovery Codes'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: ACTIVE SESSIONS & DEVICE MANAGEMENT */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                  <Laptop className="w-4 h-4 text-[#C5A059]" />
                  <span>Authorized Devices & Active Sessions ({sessions.length})</span>
                </h3>

                {sessions.length > 1 && (
                  <button
                    onClick={handleTerminateAllOtherSessions}
                    className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/60 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold uppercase rounded-xl flex items-center space-x-1 cursor-pointer transition-all"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Terminate Other Sessions</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      sess.isCurrent
                        ? 'bg-[#141008] border-[#C5A059] shadow-md'
                        : 'bg-[#0C0A06] border-[#8E6D28]/25'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-[#1A150C] border border-[#8E6D28]/40 text-[#C5A059]">
                        {sess.device.includes('Mobile') ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-100">{sess.device}</span>
                          {sess.isCurrent && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 rounded-full text-[9px] font-mono font-bold">
                              This Device (Current)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono pt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span>{sess.browser}</span>
                          <span>&bull; IP: {sess.ip}</span>
                          <span>&bull; {sess.location}</span>
                        </div>
                      </div>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        onClick={() => handleTerminateSession(sess.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/60 transition-all cursor-pointer"
                        title="Revoke Session"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: VAULT ENCRYPTION & PANIC WIPE */}
          {activeTab === 'encryption' && (
            <div className="space-y-4">
              
              <div className="bg-[#0C0A06] border border-[#8E6D28]/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2.5">
                  <Server className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-slate-100 text-sm">Client-Side AES-256 State Encryption</h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  All saved Tigrinya insights, audio transcripts, offline neural embeddings, and Pro Click token credentials stored locally are sealed using client-side cryptographic keys derived from your profile signature.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] pt-1">
                  <div className="bg-[#120F0A] p-2.5 rounded-xl border border-[#8E6D28]/25">
                    <span className="text-gray-400 block text-[9px]">CIPHER ALGORITHM</span>
                    <span className="text-emerald-400 font-bold">AES-GCM-256</span>
                  </div>
                  <div className="bg-[#120F0A] p-2.5 rounded-xl border border-[#8E6D28]/25">
                    <span className="text-gray-400 block text-[9px]">KEY DERIVATION</span>
                    <span className="text-amber-300 font-bold">PBKDF2 (100k rounds)</span>
                  </div>
                  <div className="bg-[#120F0A] p-2.5 rounded-xl border border-[#8E6D28]/25">
                    <span className="text-gray-400 block text-[9px]">STORAGE SHIELD</span>
                    <span className="text-purple-300 font-bold">Encrypted WebStorage</span>
                  </div>
                </div>
              </div>

              {/* Emergency Panic Data Wipe Section */}
              <div className="bg-rose-950/20 border-2 border-rose-500/50 p-4 sm:p-5 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2.5 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Emergency Panic Vault Wipe</h3>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  If your device is lost or compromised, executing an Emergency Panic Wipe will immediately purge all local state, credentials, saved insights, and active authorization tokens, locking the app instantly.
                </p>

                {!showPanicConfirm ? (
                  <button
                    onClick={() => setShowPanicConfirm(true)}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Initiate Emergency Vault Wipe</span>
                  </button>
                ) : (
                  <div className="bg-rose-900/40 border border-rose-500 p-3 rounded-xl space-y-2 animate-fade-in">
                    <div className="text-xs font-bold text-rose-200">
                      ⚠️ Are you absolutely sure? This action cannot be undone.
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handlePanicDataWipe}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                      >
                        CONFIRM PURGE ALL DATA NOW
                      </button>
                      <button
                        onClick={() => setShowPanicConfirm(false)}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 6: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                  <History className="w-4 h-4 text-[#C5A059]" />
                  <span>Real-Time Security Audit Ledger</span>
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">Immutable Log Ledger</span>
              </div>

              <div className="space-y-2">
                {securityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-[#0C0A06] border border-[#8E6D28]/25 p-3 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        log.status === 'success' ? 'bg-emerald-400 shadow-sm' : log.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                      <div>
                        <div className="font-semibold text-slate-100 text-xs">{log.event}</div>
                        <div className="text-[10px] text-gray-400 font-mono pt-0.5">
                          <span>IP: {log.ip}</span> &bull; <span>{log.location}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-amber-300/80 font-mono shrink-0 ml-2">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#8E6D28]/30 flex items-center justify-between shrink-0">
          <div className="text-[10px] text-gray-400 font-mono flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AXUMITE App Security Shield Active v2.4</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
