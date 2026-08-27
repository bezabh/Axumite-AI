import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Lock, HelpCircle, ShieldCheck, Check, 
  CreditCard, Sparkles, CheckCircle2, ChevronRight, AlertCircle,
  Smartphone, Plus, RefreshCw, X, Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { SupportedCurrency, UserProfile } from '../types';

interface SavedCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'sovereign';
  last4: string;
  cardholderName: string;
  expiry: string;
  bgGradient: string;
  accentColor: string;
}

interface ModernCheckoutViewProps {
  onBack?: () => void;
  user?: UserProfile;
  planName?: string;
  planId?: string;
  amountFormatted?: string;
  rawAmount?: number;
  currency?: SupportedCurrency;
  billingCycle?: 'monthly' | 'yearly' | 'one_time';
  withTrial?: boolean;
  onSuccess?: () => void;
  onManageOtherMethods?: () => void;
}

const DEFAULT_CARDS: SavedCard[] = [
  {
    id: 'card-1',
    type: 'visa',
    last4: '8821',
    cardholderName: 'ALEXANDER CHEN',
    expiry: '09/27',
    bgGradient: 'from-[#0A1B36] via-[#0E274D] to-[#061226]',
    accentColor: '#38BDF8',
  },
  {
    id: 'card-2',
    type: 'mastercard',
    last4: '4242',
    cardholderName: 'ALEXANDER CHEN',
    expiry: '12/28',
    bgGradient: 'from-[#1E1238] via-[#2A184D] to-[#120A24]',
    accentColor: '#E879F9',
  },
  {
    id: 'card-3',
    type: 'sovereign',
    last4: '1991',
    cardholderName: 'AXUMITE SOVEREIGN',
    expiry: '05/30',
    bgGradient: 'from-[#2A1F0A] via-[#3E2D0E] to-[#1A1305]',
    accentColor: '#F59E0B',
  },
];

export const ModernCheckoutView: React.FC<ModernCheckoutViewProps> = ({
  onBack,
  user,
  planName = 'Sovereign Pro',
  planId = 'pro',
  amountFormatted = '$49.99',
  rawAmount = 49.99,
  currency = 'USD',
  billingCycle = 'yearly',
  withTrial = false,
  onSuccess,
  onManageOtherMethods,
}) => {
  const { language } = useLanguage();
  const isTigrinya = language === 'ti' || language === 'ti_tg';
  const { processCardPayment, startStripeCheckout, startGooglePlayPurchase } = useSubscription();

  // Selected payment method: 'gpay' | 'card'
  const [paymentMethod, setPaymentMethod] = useState<'gpay' | 'card'>('card');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [saveCard, setSaveCard] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [showCvvTooltip, setShowCvvTooltip] = useState<boolean>(false);

  // Form Fields (synced with active card preview)
  const [cardholderName, setCardholderName] = useState<string>(
    user?.name?.toUpperCase() || 'ALEXANDER CHEN'
  );
  const [cardNumber, setCardNumber] = useState<string>('4242 8821 9012 8821');
  const [expiryDate, setExpiryDate] = useState<string>('09/27');
  const [cvv, setCvv] = useState<string>('882');

  useEffect(() => {
    if (user?.name) {
      setCardholderName(user.name.toUpperCase());
    }
  }, [user]);

  // Handle format for Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiryDate(val);
  };

  // Handle format for Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.slice(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  // Card display values
  const displayLast4 = cardNumber.replace(/\s/g, '').slice(-4) || '8821';
  const displayMaskedNumber = cardNumber
    ? `****  ****  ****  ${displayLast4}`
    : '****  ****  ****  8821';

  // Handle Payment Submit
  const handlePayment = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsProcessing(true);

    try {
      if (paymentMethod === 'gpay') {
        const res = await startGooglePlayPurchase(
          `${planId}_${billingCycle}` as any,
          withTrial
        );
        if (res.success) {
          setSuccessMsg(
            isTigrinya
              ? '✅ ክፍሊት ብዓወት ተፈጺሙ! ኣባልነትኩም ተኸፊቱ ኣሎ።'
              : '✅ Google Pay authorized successfully! Subscription activated.'
          );
          if (onSuccess) onSuccess();
        } else {
          setErrorMsg(res.error || 'Google Pay authorization was not completed.');
        }
      } else {
        // Direct Card Payment
        const cleanCard = cardNumber.replace(/\s/g, '') || '4242424242428821';
        const res = await processCardPayment(
          `${planId}_${billingCycle}`,
          billingCycle,
          {
            cardNumber: cleanCard,
            cardExpiry: expiryDate,
            cardCvc: cvv,
            name: cardholderName,
          },
          withTrial
        );

        if (res.success) {
          setSuccessMsg(
            isTigrinya
              ? '🎉 ክፍሊት ብውሑስ መንገዲ ተፈጺሙ! ኣባልነትኩም ብንጥፈት ይሰርሕ ኣሎ።'
              : '🎉 Payment processed securely! Your Sovereign entitlement is active.'
          );
          if (onSuccess) onSuccess();
        } else {
          setErrorMsg(res.error || 'Card authorization failed. Please check details.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing error.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-2 px-1 sm:px-4">
      {/* Phone Canvas Container */}
      <div className="w-full max-w-[420px] bg-[#0E1015] rounded-[36px] border border-slate-800 shadow-2xl p-5 sm:p-6 text-white font-sans relative overflow-hidden flex flex-col justify-between min-h-[720px]">
        
        {/* Subtle decorative glows */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          
          {/* Top Bar: Back Button & Title */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              title={isTigrinya ? 'ተመለስ' : 'Go back'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              {isTigrinya ? 'ክፍሊት (Checkout)' : 'Checkout'}
            </h2>
            <div className="w-5" /> {/* Balance placeholder */}
          </div>

          {/* 3D Realistic Credit Card Carousel */}
          <div className="relative pt-2">
            <div className="relative w-full rounded-2xl p-5 shadow-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0C203F] via-[#0A1830] to-[#061022] min-h-[190px] flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01]">
              
              {/* Subtle wave & geometric background watermark */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-50 180 C 100 80, 250 260, 450 140" stroke="url(#cardGrad)" strokeWidth="40" fill="none" opacity="0.6" />
                  <path d="M-30 60 C 120 180, 280 40, 430 180" stroke="url(#cardGrad)" strokeWidth="20" fill="none" opacity="0.4" />
                  <circle cx="340" cy="50" r="90" stroke="white" strokeWidth="1" opacity="0.15" strokeDasharray="3 3" />
                  <defs>
                    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#818CF8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Card Top Row: VISA Logo + Contactless Icon */}
              <div className="flex items-center justify-between relative z-10">
                <span className="font-serif italic font-black text-2xl tracking-wider text-white select-none">
                  VISA
                </span>
                
                {/* Contactless waves icon */}
                <div className="text-white/80">
                  <svg className="w-6 h-6 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M4 12a8 8 0 0 1 8-8" />
                    <path d="M7 12a5 5 0 0 1 5-5" />
                    <path d="M10 12a2 2 0 0 1 2-2" />
                  </svg>
                </div>
              </div>

              {/* EMV Chip */}
              <div className="relative z-10 -mt-1">
                <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-500 p-0.5 border border-yellow-200/60 shadow-inner flex flex-col justify-around">
                  <div className="w-full h-[1px] bg-amber-700/40" />
                  <div className="flex justify-between px-1">
                    <div className="w-2 h-2 rounded-[2px] border border-amber-700/40" />
                    <div className="w-2 h-2 rounded-[2px] border border-amber-700/40" />
                  </div>
                  <div className="w-full h-[1px] bg-amber-700/40" />
                </div>
              </div>

              {/* Card Number Masked */}
              <div className="relative z-10 pt-2">
                <div className="font-mono text-lg sm:text-xl font-bold tracking-[0.2em] text-slate-100 drop-shadow-sm">
                  {displayMaskedNumber}
                </div>
              </div>

              {/* Card Bottom Row: Name & Expiry */}
              <div className="flex items-end justify-between relative z-10 pt-1 text-[11px] font-mono tracking-wider">
                <div className="truncate max-w-[200px] text-slate-200 font-bold uppercase">
                  {cardholderName || 'CARDHOLDER NAME'}
                </div>
                <div className="text-slate-300 font-semibold shrink-0">
                  {expiryDate || '09/27'}
                </div>
              </div>

            </div>

            {/* Peeking Second Card Indicator on the right */}
            <div className="absolute right-0 top-6 w-3 h-40 bg-slate-700/30 rounded-r-xl border-y border-r border-white/10 pointer-events-none translate-x-2 blur-[0.5px]" />
          </div>

          {/* Payment Method Switcher (Segmented Control) */}
          <div className="space-y-2 pt-1">
            <div className="bg-[#181B22] p-1 rounded-2xl border border-slate-800 flex items-center">
              
              {/* Google Pay Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('gpay')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  paymentMethod === 'gpay'
                    ? 'bg-[#222733] text-white shadow-md border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Google multi-color G icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Pay</span>
              </button>

              {/* Credit / Debit Card Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#222733] text-white shadow-md border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{isTigrinya ? 'ክረዲት/ዴቢት ካርድ' : 'Credit/Debit Card'}</span>
              </button>

            </div>

            {/* Manage other methods link */}
            <div className="flex justify-end pr-1">
              <button
                type="button"
                onClick={onManageOtherMethods}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer"
              >
                {isTigrinya ? 'ካልኦት ናይ ክፍሊት መንገድታት ኣመሓድር' : 'Manage other methods'}
              </button>
            </div>
          </div>

          {/* Form Inputs (Outlined Notched Labels) */}
          <div className="space-y-3.5 pt-1">
            
            {/* Cardholder Name Input */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-[#0E1015] text-[11px] font-semibold text-slate-400 z-10">
                {isTigrinya ? 'ናይ ካርድ መሓዚ ሽም' : 'Cardholder Name'}
              </label>
              <input
                id="checkout-cardholder-name"
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Alexander Chen"
                className="w-full bg-transparent border border-slate-700/90 hover:border-slate-600 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none transition-colors"
              />
            </div>

            {/* Card Number Input (when in card mode) */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-[#0E1015] text-[11px] font-semibold text-slate-400 z-10">
                {isTigrinya ? 'ናይ ካርድ ቑጽሪ' : 'Card Number'}
              </label>
              <input
                id="checkout-card-number"
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4242 8821 9012 8821"
                maxLength={19}
                className="w-full bg-transparent border border-slate-700/90 hover:border-slate-600 focus:border-sky-500 rounded-xl px-4 py-3 text-sm font-mono text-slate-100 focus:outline-none transition-colors"
              />
            </div>

            {/* Side-by-Side: Expiry Date & CVV */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Expiry Date */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 px-1.5 bg-[#0E1015] text-[11px] font-semibold text-slate-400 z-10">
                  {isTigrinya ? 'ዕለት መወድኢ' : 'Expiry Date'}
                </label>
                <input
                  id="checkout-card-expiry"
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full bg-transparent border border-slate-700/90 hover:border-slate-600 focus:border-sky-500 rounded-xl px-4 py-3 text-sm font-mono text-slate-100 focus:outline-none transition-colors"
                />
              </div>

              {/* CVV */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 px-1.5 bg-[#0E1015] text-[11px] font-semibold text-slate-400 z-10">
                  CVV
                </label>
                <div className="relative flex items-center">
                  <input
                    id="checkout-card-cvv"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="3-digit"
                    maxLength={4}
                    className="w-full bg-transparent border border-slate-700/90 hover:border-slate-600 focus:border-sky-500 rounded-xl px-4 py-3 text-sm font-mono text-slate-100 focus:outline-none transition-colors pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvvTooltip(!showCvvTooltip)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 cursor-pointer p-0.5"
                    title="CVV Help"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* CVV Tooltip */}
            {showCvvTooltip && (
              <div className="bg-[#191D28] border border-slate-700 p-2.5 rounded-xl text-[11px] text-slate-300 flex items-start space-x-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <p>
                  {isTigrinya 
                    ? 'CVV ኣብ ድሕሪት ካርድኹም ዘሎ ናይ 3 ወይ 4 ኣሃዛት ናይ ድሕንነት ኮድ እዩ።' 
                    : 'The CVV is the 3 or 4 digit security code on the back of your credit/debit card.'}
                </p>
              </div>
            )}

            {/* Save Card Switch */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-300 font-medium">
                {isTigrinya ? 'ካርድ ንቀጻሊ ክፍሊት ኣቐምጥ' : 'Save card for future payments'}
              </span>
              
              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={saveCard}
                onClick={() => setSaveCard(!saveCard)}
                className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                  saveCard ? 'bg-[#38BDF8]' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-300 ${
                    saveCard ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

        </div>

        {/* Bottom CTA Button: Pay $49.99 🔒 */}
        <div className="pt-6 relative z-10">
          <button
            type="button"
            id="checkout-pay-btn"
            disabled={isProcessing}
            onClick={handlePayment}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#005B94] via-[#026FA8] to-[#005B94] hover:from-[#026FA8] hover:to-[#0284C7] active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-sky-950/50 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>{isTigrinya ? 'ይፍጸም ኣሎ...' : 'Processing Payment...'}</span>
              </>
            ) : (
              <>
                <span>
                  {isTigrinya 
                    ? `ክፈል ${amountFormatted}` 
                    : `Pay ${amountFormatted}`}
                </span>
                <Lock className="w-4 h-4 text-white/90 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
