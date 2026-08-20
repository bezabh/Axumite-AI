import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, GraduationCap, RefreshCw, ShieldAlert, Sparkles, X, 
  ExternalLink, ArrowRight, Check, Copy, Volume2, CreditCard, AlertTriangle 
} from 'lucide-react';
import { AppNotification } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PushNotificationToastProps {
  notification: AppNotification | null;
  onClose: () => void;
  onActionClick?: (notification: AppNotification) => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onClose,
  onActionClick,
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notification) return;

    setProgress(100);
    const duration = notification.category === 'payment_failed' ? 10000 : 7500; // 10s for urgent payment alert
    const intervalTime = 50;
    const decrement = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= decrement) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isPaymentFailed = notification.category === 'payment_failed';
  const isScholarship = notification.category === 'scholarship';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${notification.titleTi}\n${notification.titleEn}\n\n${notification.bodyTi}\n${notification.bodyEn}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = () => {
    switch (notification.category) {
      case 'payment_failed':
        return <CreditCard className="w-5 h-5 text-rose-400 animate-pulse" />;
      case 'scholarship':
        return <GraduationCap className="w-5 h-5 text-amber-300 animate-bounce" />;
      case 'system_update':
        return <RefreshCw className="w-5 h-5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />;
      case 'security':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        className="fixed top-4 sm:top-6 right-3 sm:right-6 z-50 max-w-md w-[calc(100vw-24px)] pointer-events-auto"
      >
        <div className={`relative overflow-hidden rounded-2xl border-2 text-slate-100 p-4 shadow-2xl ${
          isPaymentFailed
            ? 'bg-gradient-to-b from-[#250D18] via-[#160810] to-[#0D040A] border-rose-500 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(244,63,94,0.35)] ring-1 ring-rose-400/50'
            : 'bg-gradient-to-b from-[#140F22] via-[#0E0A1A] to-[#0A0713] border-[#C5A059] shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(197,160,89,0.25)]'
        }`}>
          
          {/* Top category ribbon & Close button */}
          <div className={`flex items-center justify-between pb-2 border-b ${
            isPaymentFailed ? 'border-rose-900/60' : 'border-[#2C2044]'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg border ${
                isPaymentFailed
                  ? 'bg-rose-500/20 border-rose-500/40'
                  : 'bg-amber-500/15 border-amber-400/30'
              }`}>
                {getCategoryIcon()}
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`text-[11px] font-mono font-black uppercase tracking-wider ${
                  isPaymentFailed ? 'text-rose-400' : 'text-amber-300'
                }`}>
                  {isPaymentFailed 
                    ? (language === 'ti' ? '⚠️ ናይ ክፍሊት ጸገም' : '⚠️ Payment Action Required')
                    : isScholarship 
                      ? (language === 'ti' ? '🎓 ሓድሽ ዕድል ስኮላርሺፕ' : '🎓 Scholarship Alert') 
                      : (language === 'ti' ? '⚙️ ናይ ስርዓት ዜና' : '⚙️ System Update')}
                </span>
                {notification.badgeText && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${
                    isPaymentFailed
                      ? 'bg-rose-500/25 text-rose-200 border-rose-400/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                  }`}>
                    {notification.badgeText}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Title & Body Content */}
          <div className="pt-2.5 space-y-1.5 cursor-pointer" onClick={() => onActionClick && onActionClick(notification)}>
            
            {/* Tigrinya Title */}
            <h4 className={`text-xs sm:text-[13px] font-bold leading-snug transition-colors flex items-center space-x-1 ${
              isPaymentFailed ? 'text-rose-100 hover:text-white' : 'text-white hover:text-[#F3E5AB]'
            }`}>
              <span>{notification.titleTi}</span>
            </h4>

            {/* English Title (Subtle) */}
            <div className={`text-[11px] font-medium font-sans line-clamp-1 ${
              isPaymentFailed ? 'text-rose-200/90' : 'text-amber-200/90'
            }`}>
              {notification.titleEn}
            </div>

            {/* Description Snippet */}
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans line-clamp-2 pt-0.5">
              {language === 'ti' ? notification.bodyTi : notification.bodyEn}
            </p>

            {isPaymentFailed && notification.paymentDetails && (
              <div className="mt-1 px-2.5 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/30 text-[10.5px] text-rose-200 flex items-center justify-between">
                <span>{notification.paymentDetails.planName || 'Pro Subscription'}</span>
                <span className="font-mono font-bold">${notification.paymentDetails.amount?.toFixed(2) || '79.99'} Due</span>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className={`mt-3 pt-2.5 border-t flex items-center justify-between gap-2 ${
            isPaymentFailed ? 'border-rose-900/50' : 'border-[#251A3B]'
          }`}>
            <span className="text-[10px] text-gray-400 font-mono">
              {notification.timestamp}
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-2 py-1 bg-[#1A132C] hover:bg-[#251B3E] text-gray-300 hover:text-white rounded-lg border border-[#3A2A54] text-[10px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
                title="Copy Details"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onActionClick) {
                    onActionClick(notification);
                  }
                  onClose();
                }}
                className={`px-3 py-1 font-black rounded-lg text-[11px] transition-all flex items-center space-x-1 shadow-md active:scale-95 cursor-pointer ${
                  isPaymentFailed
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-rose-500/30'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                {isPaymentFailed ? (
                  <>
                    <CreditCard className="w-3 h-3 mr-0.5" />
                    <span>{language === 'ti' ? (notification.actionLabelTi || 'ክፍሊት ኣሐድስ') : (notification.actionLabelEn || 'Update Billing')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <span>{language === 'ti' ? (notification.actionLabelTi || 'ተመልከት') : (notification.actionLabelEn || 'View')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Countdown Progress Bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${isPaymentFailed ? 'bg-rose-950' : 'bg-[#251A3B]'}`}>
            <div 
              className={`h-full transition-all duration-75 ${
                isPaymentFailed
                  ? 'bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400'
                  : 'bg-gradient-to-r from-amber-500 via-[#F3E5AB] to-amber-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

