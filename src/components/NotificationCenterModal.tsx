import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  ArrowRight,
  Sliders,
  Check,
  Copy,
  AlertTriangle,
  Globe,
  Radio,
  Layers,
  Send,
  Inbox,
  CreditCard,
  AlertOctagon,
  ShieldAlert
} from 'lucide-react';
import { AppNotification, NotificationPreferences, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  getBrowserPushPermissionStatus,
  requestBrowserPushPermission,
  triggerBrowserPushNotification,
  playGoldenNotificationChime,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '../services/notificationService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onUpdateNotifications: (notifs: AppNotification[]) => void;
  preferences: NotificationPreferences;
  onUpdatePreferences: (prefs: NotificationPreferences) => void;
  onOpenScholarshipOpportunity?: (scholarshipId?: string) => void;
  onOpenPaymentManagement?: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenSystemStatus?: () => void;
  onTriggerTestNotification?: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onUpdateNotifications,
  preferences,
  onUpdatePreferences,
  onOpenScholarshipOpportunity,
  onOpenPaymentManagement,
  onNavigateTab,
  onOpenSystemStatus,
  onTriggerTestNotification,
}) => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'payment' | 'scholarship' | 'system_update' | 'unread' | 'settings'>('all');
  const [browserPermission, setBrowserPermission] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBrowserPermission(getBrowserPushPermissionStatus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const paymentAlertsCount = notifications.filter((n) => n.category === 'payment_failed' || n.category === 'payment').length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'unread') return !item.read;
    if (activeFilter === 'payment') return item.category === 'payment_failed' || item.category === 'payment';
    if (activeFilter === 'scholarship') return item.category === 'scholarship';
    if (activeFilter === 'system_update') return item.category === 'system_update' || item.category === 'security' || item.category === 'feature';
    return true;
  });

  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: !n.read } : n
    );
    onUpdateNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    onUpdateNotifications(updated);
  };

  const handleDeleteNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    onUpdateNotifications(updated);
  };

  const handleClearAll = () => {
    onUpdateNotifications([]);
  };

  const handleCopy = (item: AppNotification, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `${item.titleTi}\n${item.titleEn}\n\n${item.bodyTi}\n${item.bodyEn}\n${item.actionUrl || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    const res = await requestBrowserPushPermission();
    setBrowserPermission(res);
    setIsRequestingPermission(false);
    if (res === 'granted' && preferences.enableAudioChime) {
      playGoldenNotificationChime();
    }
  };

  const handleItemAction = (item: AppNotification) => {
    // Mark as read
    const updated = notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n));
    onUpdateNotifications(updated);

    if (item.category === 'payment_failed' || item.actionType === 'open_payment' || item.targetTab === 'payment') {
      if (onOpenPaymentManagement) {
        onOpenPaymentManagement();
      } else if (onNavigateTab) {
        onNavigateTab('payment');
      }
      onClose();
    } else if (item.category === 'scholarship') {
      if (onOpenScholarshipOpportunity) {
        onOpenScholarshipOpportunity(item.scholarshipId);
        onClose();
      } else if (item.actionUrl) {
        window.open(item.actionUrl, '_blank');
      }
    } else if (item.actionUrl) {
      window.open(item.actionUrl, '_blank');
    } else if (onOpenSystemStatus) {
      onOpenSystemStatus();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#110D1D] via-[#0D0917] to-[#07050E] border-2 border-[#8E6D28] rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(197,160,89,0.25)] text-slate-100 overflow-hidden z-10"
      >
        {/* ========================================================================= */}
        {/* TOP HEADER                                                                */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 border-b border-[#2C2140] flex items-center justify-between gap-3 bg-[#161026]/60">
          <div className="flex items-center space-x-3">
            <div className="relative p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 shadow-md">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[#110D1D] flex items-center justify-center text-[8px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black font-cinzel text-white tracking-tight">
                  {language === 'ti' ? 'ማእከል ምልክታታትን ዕድላትን' : 'Push Notification Center'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {unreadCount} {language === 'ti' ? 'ዘይተነበቡ' : 'Unread'}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                {language === 'ti' 
                  ? 'ናይ ስኮላርሺፕ ዕድላትን ወሳኒ ናይ ስርዓት ዜናታትን ብትግርኛን እንግሊዝኛን'
                  : 'Bilingual push alerts for global scholarships and system updates'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1C1530] border border-[#3C2D56] hover:bg-[#281E44] text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* BROWSER WEB PUSH PERMISSION BAR                                           */}
        {/* ========================================================================= */}
        <div className="bg-[#0C0816] px-5 py-3 border-b border-[#241A37] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Radio className={`w-4 h-4 ${browserPermission === 'granted' ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="text-gray-300 font-medium">
              {browserPermission === 'granted' ? (
                <span className="text-emerald-300 font-bold">
                  {language === 'ti' ? '✓ ናይ ብሮውዘር ፑሽ ምልክታታት ነቒሑ ኣሎ (Active)' : '✓ Browser Push Notifications Active'}
                </span>
              ) : browserPermission === 'denied' ? (
                <span className="text-rose-400 font-bold">
                  {language === 'ti' ? '⚠️ ናይ ብሮውዘር ፍቓድ ተኸልኪሉ ኣሎ (Blocked in browser settings)' : '⚠️ Browser Push Blocked in Settings'}
                </span>
              ) : (
                <span>
                  {language === 'ti' ? 'ናይ ብሮውዘር ፑሽ ፍቓድ ኣይተዋህበን' : 'Browser push permission not yet requested'}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {browserPermission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                disabled={isRequestingPermission}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center space-x-1"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{language === 'ti' ? 'ፍቓድ ሃብ' : 'Enable Push'}</span>
              </button>
            )}

            {onTriggerTestNotification && (
              <button
                onClick={onTriggerTestNotification}
                className="px-3 py-1.5 rounded-xl bg-[#1D162E] hover:bg-[#2A1F42] border border-[#8E6D28] text-amber-300 font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-md active:scale-95"
                title="Send a sample bilingual scholarship notification"
              >
                <Send className="w-3 h-3 text-amber-400" />
                <span>{language === 'ti' ? 'ናይ ፈተነ ፑሽ ስደድ' : 'Test Alert'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY FILTER TABS & BULK ACTIONS                                       */}
        {/* ========================================================================= */}
        <div className="px-5 pt-3 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#241A37] bg-[#0E0A1A]">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
            {[
              { id: 'all', labelTi: 'ኩሉ', labelEn: 'All', count: notifications.length },
              { id: 'payment', labelTi: '💳 ክፍሊት', labelEn: '💳 Payments', count: paymentAlertsCount },
              { id: 'scholarship', labelTi: '🎓 ስኮላርሺፕ', labelEn: '🎓 Scholarships', count: notifications.filter(n => n.category === 'scholarship').length },
              { id: 'system_update', labelTi: '⚙️ ስርዓት', labelEn: '⚙️ System', count: notifications.filter(n => n.category === 'system_update' || n.category === 'security' || n.category === 'feature').length },
              { id: 'unread', labelTi: '🔔 ዘይተነበቡ', labelEn: '🔔 Unread', count: unreadCount },
              { id: 'settings', labelTi: 'ምርጫታት', labelEn: 'Settings', count: undefined },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                    isActive
                      ? tab.id === 'payment'
                        ? 'bg-rose-500/25 text-rose-200 border border-rose-400/60 shadow-md'
                        : 'bg-amber-500/25 text-[#F3E5AB] border border-amber-400/60 shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{language === 'ti' ? tab.labelTi : tab.labelEn}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive 
                        ? tab.id === 'payment' ? 'bg-rose-500 text-white font-black' : 'bg-amber-400 text-slate-950 font-black' 
                        : 'bg-[#1C162A] text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeFilter !== 'settings' && notifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="text-[11px] text-amber-300/90 hover:text-amber-200 disabled:opacity-40 font-bold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'ti' ? 'ኩሉ ከም እተነበበ ግበር' : 'Mark all read'}</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY CONTENT: NOTIFICATION LIST OR SETTINGS                          */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 max-h-[55vh] scrollbar-thin scrollbar-thumb-slate-800">
          
          {activeFilter === 'settings' ? (
            /* PREFERENCES PANEL */
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#140F24] border border-[#2D2144] space-y-3">
                <h3 className="text-sm font-black text-[#F3E5AB] flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ti' ? 'ናይ ፑሽ ምልክታታት ምርጫታት' : 'Push Notification Preferences'}</span>
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {language === 'ti' 
                    ? 'ኣየኖት ዓይነት ምልክታታት ክበጽሑኹም ከም እትደልዩን ናይ ድምጺ ቅጥዕታትን ኣብዚ ምረጹ።'
                    : 'Customize what notifications you receive and manage golden audio chimes.'}
                </p>
              </div>

              <div className="space-y-2.5">
                {/* 1. Web Push Notifications */}
                <div className="p-3.5 rounded-2xl bg-[#130E20] border border-[#281D3C] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">
                      {language === 'ti' ? 'ናይ ብሮውዘር ፑሽ ምልክታታት (Web Push)' : 'Browser Push Notifications'}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {language === 'ti' ? 'ኣፕ ተዓጽዩ እንከሎ እውን ናይ ዴስክቶፕ/ሞባይል ፑሽ ምልክታ የርኢ' : 'Receive instant browser alerts even when tab is backgrounded'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.enableWebPush}
                    onChange={(e) => onUpdatePreferences({ ...preferences, enableWebPush: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 2. Payment & Subscription Alerts */}
                <div className="p-3.5 rounded-2xl bg-[#130E20] border border-[#281D3C] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <CreditCard className="w-4 h-4 text-rose-400" />
                      <span>{language === 'ti' ? 'ናይ ክፍሊትን ኣባልነትን ምልክታታት (Payment Alerts)' : 'Subscription & Billing Alerts'}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {language === 'ti' ? 'ክፍሊት ኣባልነት እንተተሰናኺሉ ወይ ምሕዳስ እንተዘየጋጢሙ ቅጽበታዊ ሓበሬታ ሃብ' : 'Immediate high-priority in-app alerts when recurring payments fail or require updated card details'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.enablePaymentAlerts ?? true}
                    onChange={(e) => onUpdatePreferences({ ...preferences, enablePaymentAlerts: e.target.checked })}
                    className="w-4 h-4 accent-rose-400 cursor-pointer"
                  />
                </div>

                {/* 3. Scholarships Notifications */}
                <div className="p-3.5 rounded-2xl bg-[#130E20] border border-[#281D3C] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <GraduationCap className="w-4 h-4 text-amber-300" />
                      <span>{language === 'ti' ? 'ናይ ስኮላርሺፕ ዕድላት (Scholarship Alerts)' : 'Scholarship Alerts'}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {language === 'ti' ? 'ሓደሽቲ ናይ DAAD፡ ቸቨኒንግ፡ ማስተርካርድን ካልኦትን ስኮላርሺፕ ክኽፈቱ እንከለዉ ምልክታ ሃብ' : 'Alerts for fully-funded global scholarships (DAAD, Chevening, Turkiye, etc.)'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.enableScholarships}
                    onChange={(e) => onUpdatePreferences({ ...preferences, enableScholarships: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 4. System Updates */}
                <div className="p-3.5 rounded-2xl bg-[#130E20] border border-[#281D3C] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <RefreshCw className="w-4 h-4 text-sky-400" />
                      <span>{language === 'ti' ? 'ናይ ስርዓት ዜናታትን ድሕንነትን (System Updates)' : 'System & Engine Updates'}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {language === 'ti' ? 'ናይ ሞዴል ምምሕያሽ፡ ኪነ-ጽሕፈትን ናይ ድሕንነት መከላኸሊ ሓበሬታታትን' : 'Neural model improvements, new features, and security alerts'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.enableSystemUpdates}
                    onChange={(e) => onUpdatePreferences({ ...preferences, enableSystemUpdates: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 5. Golden Audio Chime */}
                <div className="p-3.5 rounded-2xl bg-[#130E20] border border-[#281D3C] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>{language === 'ti' ? 'ናይ ወርቃዊ ቃጭል ድምጺ (Audio Chime)' : 'Golden Audio Chime Synthesizer'}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {language === 'ti' ? 'ሓድሽ ምልክታ ክመጽእ ከሎ ድምጺ ኣስምዕ' : 'Play a subtle harmonic audio chime on arrival'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => playGoldenNotificationChime()}
                      className="px-2 py-1 bg-[#201735] hover:bg-[#2D2149] text-amber-300 rounded text-[10px] font-bold border border-[#3C2D56]"
                      title="Preview Sound"
                    >
                      Preview
                    </button>
                    <input
                      type="checkbox"
                      checked={preferences.enableAudioChime}
                      onChange={(e) => onUpdatePreferences({ ...preferences, enableAudioChime: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 6. Language Display Format */}
                <div className="p-3.5 rounded-2xl bg-[#130E20] border border-[#281D3C] space-y-2">
                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>{language === 'ti' ? 'ናይ ቋንቋ ኣቀራርባ (Language Format)' : 'Notification Language Mode'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { id: 'bilingual', label: 'Bilingual (ትግርኛ + English)' },
                      { id: 'ti', label: 'ትግርኛ ጥራይ (Tigrinya Only)' },
                      { id: 'en', label: 'English Only' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => onUpdatePreferences({ ...preferences, preferredLanguage: opt.id as any })}
                        className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                          preferences.preferredLanguage === opt.id
                            ? 'bg-amber-500/20 text-[#F3E5AB] border-amber-400/60 shadow-md'
                            : 'bg-[#0B0715] text-gray-400 border-[#281D3C] hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear History Danger Action */}
              <div className="pt-2">
                <button
                  onClick={handleClearAll}
                  className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'ti' ? 'ኩሉ ናይ ምልክታታት ታሪኽ ኣጽርይ' : 'Clear All Notification History'}</span>
                </button>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            /* EMPTY STATE */
            <div className="py-16 text-center space-y-3 bg-[#0B0715] border border-[#241A37] rounded-3xl p-8">
              <Inbox className="w-12 h-12 text-gray-600 mx-auto stroke-[1.5]" />
              <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                {language === 'ti' ? 'ምልክታታት የለን' : 'No Notifications Found'}
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {language === 'ti'
                  ? 'ሓደሽቲ ዕድላት ስኮላርሺፕ፡ ናይ ክፍሊት ሓበሬታ ወይ ናይ ስርዓት ዜናታት ምስ ዝመጽእ ኣብዚ ክዝርዘር እዩ።'
                  : 'New scholarship opportunities, payment alerts, and system upgrade bulletins will appear here.'}
              </p>
            </div>
          ) : (
            /* NOTIFICATION CARDS LIST */
            filteredNotifications.map((item) => {
              const isPaymentFailed = item.category === 'payment_failed';
              const isScholarship = item.category === 'scholarship';
              const isUnread = !item.read;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemAction(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between space-y-3 ${
                    isUnread
                      ? isPaymentFailed
                        ? 'bg-gradient-to-r from-[#200D18] via-[#1B0C15] to-[#12070E] border-rose-500/80 shadow-lg shadow-rose-500/15 ring-1 ring-rose-500/30'
                        : 'bg-gradient-to-r from-[#171128] via-[#1A122C] to-[#120D20] border-[#C5A059] shadow-lg shadow-amber-500/10'
                      : isPaymentFailed
                        ? 'bg-[#150912] border-rose-900/50 hover:border-rose-600/70 opacity-95'
                        : 'bg-[#0E0A1A] border-[#251A3B] hover:border-[#8E6D28]/60 opacity-90'
                  }`}
                >
                  {/* Glowing left accent on unread */}
                  {isUnread && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      isPaymentFailed
                        ? 'bg-gradient-to-b from-rose-400 via-rose-500 to-amber-500 animate-pulse'
                        : 'bg-gradient-to-b from-amber-400 via-[#F3E5AB] to-amber-500'
                    }`} />
                  )}

                  <div className="space-y-2">
                    {/* Header line: Badge + Time + Read toggle */}
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className={`p-1.5 rounded-lg ${
                          isPaymentFailed
                            ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
                            : isScholarship 
                              ? 'bg-amber-500/20 text-amber-300' 
                              : 'bg-sky-500/20 text-sky-300'
                        }`}>
                          {isPaymentFailed ? (
                            <CreditCard className="w-4 h-4 text-rose-400" />
                          ) : isScholarship ? (
                            <GraduationCap className="w-4 h-4" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </span>
                        
                        <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                          isPaymentFailed ? 'text-rose-400 font-black' : 'text-amber-300'
                        }`}>
                          {isPaymentFailed 
                            ? (language === 'ti' ? '⚠️ ናይ ክፍሊት ጸገም' : '⚠️ Payment Failed') 
                            : isScholarship 
                              ? (language === 'ti' ? 'ዕድል ስኮላርሺፕ' : 'Scholarship Opportunity') 
                              : (language === 'ti' ? 'ናይ ስርዓት ዜና' : 'System Update')}
                        </span>

                        {item.badgeText && (
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase ${
                            isPaymentFailed
                              ? 'bg-rose-500/20 text-rose-200 border border-rose-400/50 animate-pulse'
                              : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                          }`}>
                            {item.badgeText}
                          </span>
                        )}

                        {isUnread && (
                          <span className={`w-2 h-2 rounded-full ${isPaymentFailed ? 'bg-rose-500' : 'bg-amber-400'} animate-ping`} />
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5 text-gray-400 text-[10.5px] font-mono">
                        <span>{item.timestamp}</span>
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                      {/* Tigrinya Title */}
                      <h4 className={`text-sm font-bold leading-snug transition-colors ${
                        isPaymentFailed 
                          ? 'text-rose-100 group-hover:text-rose-300' 
                          : 'text-white group-hover:text-[#F3E5AB]'
                      }`}>
                        {item.titleTi}
                      </h4>

                      {/* English Title */}
                      {(preferences.preferredLanguage === 'bilingual' || preferences.preferredLanguage === 'en') && (
                        <div className={`text-xs font-semibold font-sans ${
                          isPaymentFailed ? 'text-rose-200/90' : 'text-amber-200/80'
                        }`}>
                          {item.titleEn}
                        </div>
                      )}
                    </div>

                    {/* Payment Failure Details Card if present */}
                    {isPaymentFailed && item.paymentDetails && (
                      <div className="p-2.5 rounded-xl bg-[#2A0E18]/80 border border-rose-500/30 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between text-rose-200 font-bold">
                          <span className="flex items-center space-x-1">
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                            <span>{item.paymentDetails.planName || 'AI Sovereign Plan'}</span>
                          </span>
                          <span className="font-mono text-xs bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                            {item.paymentDetails.currency || 'USD'} ${item.paymentDetails.amount?.toFixed(2) || '79.99'}
                          </span>
                        </div>
                        {item.paymentDetails.failureReason && (
                          <p className="text-rose-300/80 font-mono text-[10px]">
                            • Reason: {item.paymentDetails.failureReason}
                          </p>
                        )}
                        {item.paymentDetails.paymentMethod && (
                          <p className="text-gray-300 text-[10px]">
                            • Method: {item.paymentDetails.paymentMethod}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Body Texts */}
                    <div className="text-xs text-gray-300 leading-relaxed font-sans space-y-1 bg-[#090612] p-2.5 rounded-xl border border-[#201535]">
                      {preferences.preferredLanguage !== 'en' && (
                        <p className={isPaymentFailed ? 'text-rose-100/90 font-medium' : 'text-slate-200'}>{item.bodyTi}</p>
                      )}
                      {(preferences.preferredLanguage === 'bilingual' || preferences.preferredLanguage === 'en') && (
                        <p className="text-gray-400 text-[11.5px] pt-0.5 border-t border-[#1C1230]">{item.bodyEn}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-2 border-t border-[#201535] flex items-center justify-between gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleCopy(item, e)}
                        className="px-2.5 py-1 bg-[#1A132C] hover:bg-[#251B3E] text-gray-300 hover:text-white rounded-lg border border-[#3A2A54] text-[10.5px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={(e) => handleToggleRead(item.id, e)}
                        className="px-2.5 py-1 bg-[#1A132C] hover:bg-[#251B3E] text-gray-300 hover:text-white rounded-lg border border-[#3A2A54] text-[10.5px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <CheckCircle2 className={`w-3 h-3 ${isUnread ? (isPaymentFailed ? 'text-rose-400' : 'text-amber-400') : 'text-gray-500'}`} />
                        <span>{isUnread ? (language === 'ti' ? 'ተነቢቡ' : 'Mark Read') : (language === 'ti' ? 'ዘይተነበበ' : 'Mark Unread')}</span>
                      </button>

                      <button
                        onClick={(e) => handleDeleteNotification(item.id, e)}
                        className="p-1 bg-[#1A132C] hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 rounded-lg border border-[#3A2A54] transition-all cursor-pointer"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Primary Trigger Button */}
                    <button
                      onClick={() => handleItemAction(item)}
                      className={`px-3.5 py-1.5 font-black rounded-xl text-xs transition-all flex items-center space-x-1 shadow-md active:scale-95 cursor-pointer ${
                        isPaymentFailed
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-rose-500/30'
                          : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20'
                      }`}
                    >
                      {isPaymentFailed ? (
                        <>
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{language === 'ti' ? (item.actionLabelTi || 'ክፍሊት ኣሐድስ') : (item.actionLabelEn || 'Update Billing Info')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>{language === 'ti' ? (item.actionLabelTi || 'ተመልከት') : (item.actionLabelEn || 'View')}</span>
                          {item.actionUrl ? <ExternalLink className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER                                                              */}
        {/* ========================================================================= */}
        <div className="p-4 border-t border-[#251A3B] bg-[#0E0A1A] flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
          <div className="flex items-center space-x-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'ti' ? 'ንተጋሩ ዝተዳለወ ሓበሬታታትን ዕድላትን' : 'Curated intelligence & opportunities for Tigray & Diaspora'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1C1530] hover:bg-[#281E44] text-gray-200 hover:text-white border border-[#3C2D56] font-bold text-xs transition-all cursor-pointer"
          >
            {language === 'ti' ? 'ዕጾ' : 'Close'}
          </button>
        </div>

      </motion.div>
    </div>
  );
};
