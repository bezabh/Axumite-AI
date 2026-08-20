import React, { useState } from 'react';
import { 
  X, ChevronLeft, Mic, Infinity as InfinityIcon, Zap, Cpu, 
  CreditCard, Check, ShieldCheck, AlertCircle, RefreshCw, Star
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onSuccess?: (plan: 'monthly' | 'yearly', receipt: any) => void;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onSuccess,
}) => {
  const { language } = useLanguage();
  const [viewStep, setViewStep] = useState<'showcase' | 'checkout'>('showcase');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'telebirr' | 'nakfa'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardName, setCardName] = useState(user?.name || 'Bezabh Abrha');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [phonePayment, setPhonePayment] = useState('+291 7 123456');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentPrice = billingCycle === 'yearly' ? '$79.99' : '$9.99';
  const pricePeriod = billingCycle === 'yearly' ? (language === 'ti' ? '/ዓመት' : '/yr') : (language === 'ti' ? '/ወርሒ' : '/mo');

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Simulate API payment checkout
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: billingCycle === 'yearly' ? 'eritrean-ai-pro-yearly' : 'eritrean-ai-pro-monthly',
          paymentMethod,
          accountNumber: cardNumber,
          customerEmail: user?.email || 'beckylove2004@gmail.com',
          amount: billingCycle === 'yearly' ? 79.99 : 9.99,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Upgrade user role in state
      if (user && onUpdateUser) {
        const updatedRole: UserRole = user.role === 'Admin' ? 'Admin' : 'ኤርትራዊ AI Pro';
        onUpdateUser({
          ...user,
          role: updatedRole,
          isLoggedIn: true,
        });
      }

      setSuccessMsg(
        language === 'ti'
          ? `እንቋዕ ናብ ኤርትራዊ AI PRO ብደሓን መጻእኹም! (${billingCycle === 'yearly' ? 'ዓመታዊ' : 'ወርሓዊ'})`
          : `Welcome to Eritrean AI PRO! (${billingCycle.toUpperCase()} Plan Activated)`
      );

      if (onSuccess) {
        onSuccess(billingCycle, data);
      }

      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setViewStep('showcase');
      }, 1600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestorePurchases = () => {
    setIsRestoring(true);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      setIsRestoring(false);
      if (user && onUpdateUser) {
        const updatedRole: UserRole = user.role === 'Admin' ? 'Admin' : 'ኤርትራዊ AI Pro';
        onUpdateUser({
          ...user,
          role: updatedRole,
          isLoggedIn: true,
        });
      }
      setSuccessMsg(
        language === 'ti'
          ? 'ክፍሊትኩም ብዓወት ተመሊሱ እዩ! ኩሉ PRO ኣገልግሎታት ድሉው ኣሎ። ✓'
          : 'Active subscription restored successfully! All PRO features are unlocked. ✓'
      );

      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-md my-auto bg-[#F8FAFC] dark:bg-[#0B101D] text-slate-900 dark:text-slate-100 rounded-[32px] sm:rounded-[36px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 40px 0 rgba(217, 119, 6, 0.15)',
        }}
      >
        
        {/* ========================================================================= */}
        {/* TOP APP BAR: BACK BUTTON + ERITREAN AI PRO PILL BADGE                     */}
        {/* ========================================================================= */}
        <div className="pt-5 pb-3 px-5 sm:px-6 flex items-center justify-between relative z-10">
          
          {/* Back Circular Button matching user screenshot */}
          <button
            type="button"
            onClick={viewStep === 'checkout' ? () => setViewStep('showcase') : onClose}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer active:scale-95 shrink-0"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Centered Pill Badge: ★ ERITREAN AI PRO matching screenshot */}
          <div className="flex-1 flex justify-center px-2">
            <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full border border-[#D97706]/50 bg-amber-500/10 dark:bg-amber-500/15 text-[#B45309] dark:text-[#FBBF24] shadow-xs">
              <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
              <span className="text-[12px] sm:text-[13px] font-black uppercase tracking-wider font-mono">
                ERITREAN AI PRO
              </span>
            </div>
          </div>

          {/* Invisible spacer or close button to maintain optical centering */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Global Success / Error Toast Banners */}
        {successMsg && (
          <div className="mx-5 mb-2 p-3 bg-emerald-500/15 border border-emerald-500 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0 stroke-[3]" />
            <span className="flex-1">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mx-5 mb-2 p-3 bg-rose-500/15 border border-rose-500 text-rose-800 dark:text-rose-300 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: PRIMARY SHOWCASE (EXACT PIXEL MATCH TO SCREENSHOT)                */}
        {/* ========================================================================= */}
        {viewStep === 'showcase' && (
          <div className="px-5 sm:px-6 pb-6 pt-2 space-y-6 animate-in fade-in">
            
            {/* 1. Center Diamond / Gem Hero Graphic */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="relative flex items-center justify-center">
                {/* Outer Glow Halo */}
                <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-full bg-[#FEF3C7] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-700/50 flex items-center justify-center shadow-inner">
                  {/* Middle Circular Disc */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white dark:bg-slate-900 border-2 border-[#F59E0B] flex items-center justify-center shadow-md">
                    {/* Golden Faceted Diamond Graphic */}
                    <svg 
                      className="w-9 h-9 sm:w-10 sm:h-10 text-[#D97706] drop-shadow-xs" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.8" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      {/* Top horizontal facet line */}
                      <path d="M6 3h12l4 6-10 12L2 9l4-6Z" fill="#FBBF24" fillOpacity="0.3" />
                      <line x1="2" y1="9" x2="22" y2="9" />
                      <line x1="10" y1="3" x2="8" y2="9" />
                      <line x1="14" y1="3" x2="16" y2="9" />
                      <line x1="12" y1="9" x2="12" y2="21" />
                      <line x1="8" y1="9" x2="12" y2="21" />
                      <line x1="16" y1="9" x2="12" y2="21" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 2. Main Title */}
              <h2 className="text-xl sm:text-2xl font-black text-center text-[#0B1426] dark:text-white mt-4 tracking-tight leading-snug">
                {language === 'ti' ? 'ምሉእ ዓቕሚ ናይ ኤርትራዊ AI ረኸቡ' : 'Unlock the Full Power of Eritrean AI'}
              </h2>

              {/* 3. Subtitle */}
              <p className="text-xs sm:text-[13px] text-center text-slate-600 dark:text-slate-400 mt-1.5 max-w-[320px] font-medium leading-relaxed">
                {language === 'ti' 
                  ? 'ብውሑድ ወርሓዊ ክፍሊት፡ ኩሉ ብሉጽ ኣገልግሎታት ብዘይ ደረት ተጠቐሙ።' 
                  : 'With a low monthly fee: Access all premium features without any limits.'}
              </p>
            </div>

            {/* 4. 2x2 Feature Grid (Exact match to screenshot) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
              
              {/* Card 1: ቀጥታዊ ዕላል (Direct Voice Chat) */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center text-center space-y-2.5 transition-all hover:shadow-md hover:border-amber-200 dark:hover:border-amber-700/60">
                <div className="w-12 h-12 rounded-full bg-[#FEF3C7] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                  <Mic className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {language === 'ti' ? 'ቀጥታዊ ዕላል' : 'Voice Chat'}
                  </h3>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-tight">
                    {language === 'ti' ? 'ምስ AI ብቐጥታ ብድምጺ ተዛረቡ' : 'Speak directly with AI by voice'}
                  </p>
                </div>
              </div>

              {/* Card 2: ደረት ኣልቦ (Unlimited Access) */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center text-center space-y-2.5 transition-all hover:shadow-md hover:border-amber-200 dark:hover:border-amber-700/60">
                <div className="w-12 h-12 rounded-full bg-[#FEF3C7] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                  <InfinityIcon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {language === 'ti' ? 'ደረት ኣልቦ' : 'Unlimited'}
                  </h3>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-tight">
                    {language === 'ti' ? 'ብዘይ ገደብ ኣገልግሎት ተጠቐሙ' : 'Use all features without limits'}
                  </p>
                </div>
              </div>

              {/* Card 3: ቀዳምነት (Priority Speed) */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center text-center space-y-2.5 transition-all hover:shadow-md hover:border-amber-200 dark:hover:border-amber-700/60">
                <div className="w-12 h-12 rounded-full bg-[#FEF3C7] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                  <Zap className="w-5 h-5 stroke-[2.2] fill-[#D97706]/20" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {language === 'ti' ? 'ቀዳምነት' : 'Priority Speed'}
                  </h3>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-tight">
                    {language === 'ti' ? 'ኩሉ ግዜ ቅልጡፍ መልሲ ረኸቡ' : 'Lightning-fast instant replies'}
                  </p>
                </div>
              </div>

              {/* Card 4: ምዕቡል AI (Advanced Model) */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center text-center space-y-2.5 transition-all hover:shadow-md hover:border-amber-200 dark:hover:border-amber-700/60">
                <div className="w-12 h-12 rounded-full bg-[#FEF3C7] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                  <Cpu className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {language === 'ti' ? 'ምዕቡል AI' : 'Advanced AI'}
                  </h3>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-tight">
                    {language === 'ti' ? 'ብዝማዕበለ ሞዴል AI ይረብሑ' : 'Most advanced AI reasoning'}
                  </p>
                </div>
              </div>

            </div>

            {/* 5. Primary Orange/Amber Subscribe Button & Restore Link */}
            <div className="pt-2 space-y-3.5">
              <button
                type="button"
                onClick={() => setViewStep('checkout')}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#D97706] hover:brightness-110 active:scale-[0.99] text-white font-black text-base sm:text-[17px] tracking-tight shadow-xl shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-white stroke-[2.5]" />
                <span>{language === 'ti' ? 'PRO ጀምር (Subscribe)' : '⚡ Start PRO (Subscribe)'}</span>
              </button>

              {/* Restore Purchases Underlined Text Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleRestorePurchases}
                  disabled={isRestoring}
                  className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isRestoring ? (
                    <span className="inline-flex items-center space-x-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === 'ti' ? 'ክፍሊት ይምለስ ኣሎ...' : 'Restoring purchases...'}</span>
                    </span>
                  ) : (
                    <span>
                      {language === 'ti' ? 'ዝነበረካ ክፍሊት ምለስ (Restore Purchases)' : 'Restore Purchases'}
                    </span>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: INTERACTIVE CHECKOUT & PLAN PAYMENT STEP                          */}
        {/* ========================================================================= */}
        {viewStep === 'checkout' && (
          <div className="px-5 sm:px-6 pb-6 pt-1 space-y-4 animate-in slide-in-from-right-4 duration-200">
            
            {/* Header / Plan Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {language === 'ti' ? 'ፕላን ምረጹ (SELECT PLAN)' : 'SELECT SUBSCRIPTION PLAN'}
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Monthly Card */}
                <div
                  onClick={() => setBillingCycle('monthly')}
                  className={`p-3.5 rounded-2xl cursor-pointer relative border flex flex-col justify-between transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-amber-500/10 border-2 border-[#D97706] shadow-md shadow-amber-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {billingCycle === 'monthly' && (
                    <div className="absolute top-2.5 right-2.5 w-4.5 h-4.5 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ti' ? 'ወርሓዊ' : 'Monthly'}
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      $9.99<span className="text-[11px] font-normal text-slate-500">{language === 'ti' ? '/ወርሒ' : '/mo'}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1.5">
                    {language === 'ti' ? 'ወርሓዊ ዝኽፈል' : 'Billed monthly'}
                  </div>
                </div>

                {/* Yearly Card */}
                <div
                  onClick={() => setBillingCycle('yearly')}
                  className={`p-3.5 rounded-2xl cursor-pointer relative border flex flex-col justify-between transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-amber-500/10 border-2 border-[#D97706] shadow-md shadow-amber-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs">
                    SAVE 33%
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ti' ? 'ዓመታዊ' : 'Yearly'}
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      $79.99<span className="text-[11px] font-normal text-slate-500">{language === 'ti' ? '/ዓመት' : '/yr'}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold pt-1.5">
                    {language === 'ti' ? '$6.66/ወርሒ ጥራይ' : 'Only $6.66/mo'}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {language === 'ti' ? 'ኣገባብ ክፍሊት (PAYMENT METHOD)' : 'PAYMENT METHOD'}
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/15 border-amber-600 text-amber-800 dark:text-amber-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card / Stripe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('telebirr')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all cursor-pointer ${
                    paymentMethod === 'telebirr'
                      ? 'bg-amber-500/15 border-amber-600 text-amber-800 dark:text-amber-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">T</span>
                  <span>Telebirr / CBE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nakfa')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all cursor-pointer ${
                    paymentMethod === 'nakfa'
                      ? 'bg-amber-500/15 border-amber-600 text-amber-800 dark:text-amber-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">ERN</span>
                  <span>Eritrean ERN</span>
                </button>
              </div>
            </div>

            {/* Dynamic Card / Payment Input Details */}
            {paymentMethod === 'card' ? (
              <div className="space-y-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1 uppercase">Card Number</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-400 block mb-1 uppercase">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-400 block mb-1 uppercase">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <label className="text-[10.5px] font-bold text-slate-400 block uppercase">
                  {paymentMethod === 'telebirr' ? 'Telebirr Phone Number' : 'Eritrea Account / Mobile'}
                </label>
                <input
                  type="text"
                  value={phonePayment}
                  onChange={(e) => setPhonePayment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Bottom Checkout Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#D97706] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-white font-black text-base tracking-tight shadow-xl shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {isProcessing
                    ? (language === 'ti' ? 'ክፍሊት ይፍጸም ኣሎ...' : 'Processing Payment...')
                    : `${language === 'ti' ? 'ክፈል እሞ ጀምር' : 'Pay & Activate'} ${currentPrice}${pricePeriod}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setViewStep('showcase')}
                className="w-full py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-center cursor-pointer"
              >
                {language === 'ti' ? '← ናብ መብርሂ ተመለስ' : '← Back to Overview'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
