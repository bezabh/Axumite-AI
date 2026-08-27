import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Check, Sparkles, Shield, Zap, Gift, RefreshCw, FileText, 
  Smartphone, Lock, AlertCircle, Award, Trophy, Building2, Globe, 
  ShieldCheck, Copy, ArrowRight, CheckCircle2, Crown, Plus, RotateCcw,
  CheckCircle, PlayCircle, ExternalLink, ChevronRight, Download, Printer,
  Eye, HelpCircle, AlertTriangle
} from 'lucide-react';
import { PaymentReceipt, UserSubscription, UserProfile, SupportedCurrency, PaymentTestResult } from '../types';
import { ProClickEarning } from './ProClickEarning';
import { GlobalCommunityLeaderboard } from './GlobalCommunityLeaderboard';
import { PricingPlanComparisonModal } from './PricingPlanComparisonModal';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import { ModernCheckoutView } from './ModernCheckoutView';
import { useSubscription, InvoiceItem } from '../context/SubscriptionContext';
import { useLanguage } from '../context/LanguageContext';
import bankIconImg from '../assets/images/sovereign_bank_icon_1786607928857.jpg';

interface PaymentSystemProps {
  onSaveInsight?: (item: any) => void;
  user?: UserProfile;
  onOpenAuthModal?: (mode: 'login' | 'signup' | 'verify', reason?: string) => void;
}

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'AU$',
  ERN: 'Nfk ',
  ETB: 'Br ',
  JPY: '¥',
  CHF: 'CHF ',
};

export const PaymentSystem: React.FC<PaymentSystemProps> = ({ onSaveInsight, user, onOpenAuthModal }) => {
  const { language } = useLanguage();
  const {
    subscription,
    selectedCurrency,
    setSelectedCurrency,
    isProOrHigher,
    isEnterprise,
    isTrialing,
    startStripeCheckout,
    processCardPayment,
    cancelSubscription,
    reactivateSubscription,
    toggleAutoRenewal,
    changePlan,
    restorePurchases,
    simulatePaymentFailureAlert,
  } = useSubscription();

  const [activeTab, setActiveTab] = useState<'checkout' | 'mobile-checkout' | 'subscription' | 'invoices' | 'bank-portal' | 'pro-earnings' | 'diagnostics'>('checkout');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'one_time'>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<'free' | 'pro' | 'enterprise' | 'lifetime'>('pro');
  const [withTrial, setWithTrial] = useState(true);
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'card' | 'bank' | 'google_play'>('stripe');

  // Checkout inputs
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'beckylove2004@gmail.com');
  const [customerName, setCustomerName] = useState(user?.name || 'Axumite Sovereign User');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Status & Feedback
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

  // Bank Portal Verification State
  const [selectedBankKey, setSelectedBankKey] = useState<'cbe-er' | 'boe' | 'himbol' | 'swift'>('cbe-er');
  const [bankRefNumber, setBankRefNumber] = useState('');
  const [bankDepositAmount, setBankDepositAmount] = useState('735');
  const [isBankVerifying, setIsBankVerifying] = useState(false);
  const [bankVerificationResult, setBankVerificationResult] = useState<any>(null);
  const [copyNotice, setCopyNotice] = useState('');

  // Cancel & Downgrade Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Cost considerations');
  const [isCanceling, setIsCanceling] = useState(false);

  // Diagnostics Test Suite State
  const [testResults, setTestResults] = useState<PaymentTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testStats, setTestStats] = useState<{ passCount: number; totalCount: number } | null>(null);

  useEffect(() => {
    if (user?.email) setCustomerEmail(user.email);
    if (user?.name) setCustomerName(user.name);
  }, [user]);

  const BANK_DIRECTORY = [
    {
      key: 'cbe-er',
      name: 'ናይ ትግራይ ንግዲ ባንክ (Commercial Bank of Tigray)',
      accountName: 'AXUMITE AI SOVEREIGN TIGRAY LTD',
      accountNumber: '20194829103',
      swift: 'CBOETGAS',
      branch: 'Hawulti Avenue Main Branch, Mekelle',
      badge: 'Commercial Bank 🏛️',
      descriptionTi: 'ቀጥታ ብናይ ትግራይ ንግዲ ባንክ ሕሳብ ቑጽሪ ወይ ጨንፈር ክፍሊት ፈጽሙ።',
    },
    {
      key: 'boe',
      name: 'ናይ ትግራይ ልምዓት ባንክ (Development Bank of Tigray)',
      accountName: 'AXUMITE AI ENTERPRISE',
      accountNumber: '10928374651',
      swift: 'BERTGAS',
      branch: 'Central Bank HQ, Mekelle',
      badge: 'Bank of Tigray 🏛️',
      descriptionTi: 'ብናይ ትግራይ ባንክ ወይ ዝተፈቐደሎም ትካላት ዝግበር ክፍሊት።',
    },
    {
      key: 'himbol',
      name: 'ናይ ተጋሩ ዓለምለኸ ሓዋላ (Diaspora Remittance)',
      accountName: 'AXUMITE AI TECH REMIT',
      accountNumber: '01320987654',
      swift: 'HIMBTGAS',
      branch: 'Remittance Financial Services Mekelle',
      badge: 'Remittance 📱',
      descriptionTi: 'ብናይ ወጻኢ ሃገራት ሓዋላን ብር ክፍሊትን ብቕልጡፍ መፈጸሚ ቑጽሪ የእትዉ።',
    },
    {
      key: 'swift',
      name: 'ዓለምለኻዊ SWIFT / Diaspora Wire Transfer',
      accountName: 'AXUMITE AI GLOBAL SWIFT HOLDINGS',
      accountNumber: 'ER92CBET1000492817263',
      swift: 'AXUMERAAXXX',
      branch: 'International Wire Department',
      badge: 'Global USD / EUR 🌐',
      descriptionTi: 'ብዓለምለኻዊ SWIFT / Wire transfer ንተጠቀምቲ ዲያስፖራ።',
    },
  ];

  // Helper for pricing
  const getPlanPrice = (plan: 'free' | 'pro' | 'enterprise' | 'lifetime', cycle: 'monthly' | 'yearly' | 'one_time') => {
    let usd = 0;
    if (plan === 'pro') usd = cycle === 'yearly' ? 79.99 : 9.99;
    else if (plan === 'enterprise') usd = cycle === 'yearly' ? 239.99 : 29.99;
    else if (plan === 'lifetime') usd = 199.99;

    const rates: Record<SupportedCurrency, number> = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      CAD: 1.35,
      AUD: 1.52,
      ERN: 15.0,
      ETB: 125.0,
      JPY: 155.0,
      CHF: 0.89,
    };

    const multiplier = rates[selectedCurrency] || 1.0;
    const amount = (usd * multiplier);
    return {
      raw: amount,
      formatted: `${CURRENCY_SYMBOLS[selectedCurrency]}${amount < 100 ? amount.toFixed(2) : Math.round(amount).toLocaleString()}`,
    };
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'AKSUM2026') {
      setPromoApplied(true);
      setStatusMessage({ type: 'success', text: '✅ Promo code AKSUM2026 applied! 20% discount activated.' });
    } else {
      setStatusMessage({ type: 'error', text: 'Invalid promo code. Use AKSUM2026 for 20% off.' });
    }
  };

  // 1. Process Stripe Checkout
  const handleInitiateStripeCheckout = async () => {
    setIsProcessing(true);
    setStatusMessage(null);

    const planKey = selectedPlanId === 'lifetime' 
      ? 'lifetime_pass' 
      : `${selectedPlanId}_${billingCycle}`;

    try {
      const result = await startStripeCheckout({
        planId: planKey,
        billingCycle,
        withTrial: selectedPlanId !== 'lifetime' && withTrial,
        promoCode: promoApplied ? 'AKSUM2026' : promoCode,
      });

      if (result.success) {
        if (result.checkoutUrl && result.checkoutUrl.startsWith('http')) {
          window.location.href = result.checkoutUrl;
        } else {
          setStatusMessage({
            type: 'success',
            text: `🎉 Payment successful! ${selectedPlanId.toUpperCase()} subscription is now fully active with tamper-proof cryptographic entitlement signature.`,
          });
          setActiveTab('subscription');
        }
      } else {
        setStatusMessage({
          type: 'error',
          text: result.error || 'Payment initiation failed. Please verify your details.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Payment error occurred.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Direct Card Checkout
  const handleDirectCardCheckout = async () => {
    setIsProcessing(true);
    setStatusMessage(null);

    const planKey = selectedPlanId === 'lifetime' ? 'lifetime_pass' : `${selectedPlanId}_${billingCycle}`;

    try {
      const result = await processCardPayment(
        planKey,
        billingCycle,
        { cardNumber: cardNumber.replace(/\s/g, '') },
        selectedPlanId !== 'lifetime' && withTrial
      );

      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: `🎉 Card payment processed securely. ${selectedPlanId.toUpperCase()} subscription activated!`,
        });
        setActiveTab('subscription');
      } else {
        setStatusMessage({
          type: 'error',
          text: result.error || 'Card payment declined. Please check details.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Card payment error.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Bank Wire Transfer Verification
  const handleVerifyBankTransfer = async () => {
    setIsBankVerifying(true);
    setBankVerificationResult(null);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/payment/bank-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: selectedBankKey,
          referenceNumber: bankRefNumber,
          amount: `${bankDepositAmount} ${selectedCurrency}`,
          customerEmail: customerEmail || user?.email,
          userId: user?.id || 'usr_bank_customer',
        }),
      });

      if (!response.ok) {
        throw new Error('Bank verification returned error status ' + response.status);
      }

      const data = await response.json();
      setBankVerificationResult(data);

      setStatusMessage({
        type: 'success',
        text: `✅ Bank transfer verified: ${data.officialAccountName}. Transaction ${data.referenceNumber} credited.`,
      });

      if (onSaveInsight) {
        onSaveInsight({
          title: `Bank Receipt Verification: ${data.bankName}`,
          type: 'payment',
          content: `${data.tigrinyaMessage}\nRef: ${data.referenceNumber}\nBank: ${data.bankName}\nAmount: ${data.amountVerified}`,
          tags: ['bank-transfer', 'verified', data.bankName],
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Bank verification failed.' });
    } finally {
      setIsBankVerifying(false);
    }
  };

  // 4. Restore Purchases
  const handleRestorePurchases = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const res = await restorePurchases();
      if (res.success && res.restoredCount > 0) {
        setStatusMessage({ type: 'success', text: `✅ ${res.message}` });
      } else {
        setStatusMessage({ type: 'info', text: res.message });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Restore failed.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Cancel Subscription Modal Handler
  const handleConfirmCancel = async () => {
    setIsCanceling(true);
    try {
      const res = await cancelSubscription(cancelReason);
      if (res.success) {
        setIsCancelModalOpen(false);
        setStatusMessage({
          type: 'info',
          text: 'Subscription auto-renewal canceled. You maintain Pro features until the end of your billing cycle.',
        });
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to cancel.' });
      }
    } finally {
      setIsCanceling(false);
    }
  };

  // 6. Run 10-Point Payment Test Suite
  const handleRunDiagnostics = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    setTestStats(null);
    try {
      const res = await fetch('/api/payment/test-suite/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setTestResults(data.results);
        setTestStats({ passCount: data.passCount, totalCount: data.totalCount });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to run payment test suite: ' + err.message });
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div id="payment-system-root" className="w-full max-w-6xl mx-auto space-y-6 text-slate-100">
      
      {/* Top Banner: Currency Switcher & Secure Badge */}
      <div className="bg-[#121422] border border-[#8E6D28]/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md">
            <Crown className="w-5 h-5 text-[#F3E5AB]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-cinzel text-lg sm:text-xl font-black text-[#F3E5AB] tracking-wide">
                {language === 'ti' ? 'ልዑላዊ ክፍሊትን ኣባልነትን' : 'Sovereign Payment & Subscriptions'}
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                Stripe Production Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'ti' 
                ? 'ዓለምለኻዊ ብካርዲ፣ ስትራይፕ፣ ናቕፋ ወይ ናይ ባንክ ሓዋላ ብውሑስ መንገዲ ይኽፈሉ'
                : 'International payments via Stripe, Credit Cards, Nakfa ERN, and Direct Bank Wire.'}
            </p>
          </div>
        </div>

        {/* Currency Selector Pill */}
        <div className="flex items-center space-x-2 self-end md:self-auto bg-[#1A1E33] p-1.5 rounded-xl border border-slate-700">
          <Globe className="w-4 h-4 text-amber-400 ml-1.5" />
          <span className="text-xs text-slate-300 font-semibold">{language === 'ti' ? 'ገንዘብ:' : 'Currency:'}</span>
          <select
            id="currency-selector"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as SupportedCurrency)}
            className="bg-[#0E101D] text-[#F3E5AB] text-xs font-bold font-mono px-2.5 py-1 rounded-lg border border-[#8E6D28]/40 focus:outline-none cursor-pointer"
          >
            <option value="USD">USD ($) - US Dollar</option>
            <option value="ERN">ERN (Nfk) - Eritrean Nakfa</option>
            <option value="ETB">ETB (Br) - Ethiopian Birr</option>
            <option value="EUR">EUR (€) - Eurozone</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="CAD">CAD (CA$) - Canadian Dollar</option>
            <option value="AUD">AUD (AU$) - Australian Dollar</option>
            <option value="CHF">CHF (Fr) - Swiss Franc</option>
            <option value="JPY">JPY (¥) - Japanese Yen</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          id="tab-plans-checkout"
          onClick={() => setActiveTab('checkout')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'checkout'
              ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black shadow-lg shadow-amber-500/20'
              : 'bg-[#151828] text-slate-300 hover:bg-[#1E2338]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{language === 'ti' ? 'ፕላናት & ክፍሊት (Plans & Checkout)' : 'Plans & Checkout'}</span>
        </button>

        <button
          id="tab-mobile-checkout"
          onClick={() => setActiveTab('mobile-checkout')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'mobile-checkout'
              ? 'bg-gradient-to-r from-[#0284C7] to-[#02639B] text-white shadow-lg shadow-sky-500/20'
              : 'bg-[#151828] text-slate-300 hover:bg-[#1E2338]'
          }`}
        >
          <Smartphone className="w-4 h-4 text-sky-400" />
          <span>{language === 'ti' ? 'ሞባይል ክፍሊት (Mobile Checkout)' : 'Mobile Checkout'}</span>
        </button>

        <button
          id="tab-subscription"
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'subscription'
              ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black shadow-lg shadow-amber-500/20'
              : 'bg-[#151828] text-slate-300 hover:bg-[#1E2338]'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>{language === 'ti' ? 'ናይ ኣባልነት ኩነታት (Subscription)' : 'My Subscription'}</span>
          {isProOrHigher && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          id="tab-invoices"
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'invoices'
              ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black shadow-lg shadow-amber-500/20'
              : 'bg-[#151828] text-slate-300 hover:bg-[#1E2338]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'ti' ? 'ረሲት & ታሪኽ (Invoices)' : 'Invoices & History'}</span>
          {subscription.invoices.length > 0 && (
            <span className="bg-[#1A1E33] text-[#F3E5AB] text-[10px] font-mono px-1.5 py-0.2 rounded-full">
              {subscription.invoices.length}
            </span>
          )}
        </button>

        <button
          id="tab-bank-portal"
          onClick={() => setActiveTab('bank-portal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'bank-portal'
              ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black shadow-lg shadow-amber-500/20'
              : 'bg-[#151828] text-slate-300 hover:bg-[#1E2338]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{language === 'ti' ? 'ናይ ባንክ ሓዋላ (Eritrean Bank Transfer)' : 'Bank Wire Portal'}</span>
        </button>

        <button
          id="tab-diagnostics"
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'diagnostics'
              ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black shadow-lg shadow-amber-500/20'
              : 'bg-[#151828] text-slate-300 hover:bg-[#1E2338]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{language === 'ti' ? 'ፈተነ & ቴክኒካዊ መርመራ (Diagnostics)' : 'Diagnostics & Test Suite'}</span>
        </button>
      </div>

      {/* Global Status Message Toast */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between space-x-3 text-xs ${
          statusMessage.type === 'success'
            ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
            : statusMessage.type === 'error'
            ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
            : 'bg-sky-950/70 border-sky-500/50 text-sky-200'
        }`}>
          <div className="flex items-center space-x-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: PLANS & CHECKOUT */}
      {/* ========================================================================= */}
      {activeTab === 'checkout' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Billing Cycle Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="bg-[#121422] p-1.5 rounded-2xl border border-slate-800 flex items-center space-x-1">
              <button
                id="cycle-monthly"
                onClick={() => { setBillingCycle('monthly'); if (selectedPlanId === 'lifetime') setSelectedPlanId('pro'); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'ti' ? 'ወርሓዊ (Monthly)' : 'Monthly Billing'}
              </button>

              <button
                id="cycle-yearly"
                onClick={() => { setBillingCycle('yearly'); if (selectedPlanId === 'lifetime') setSelectedPlanId('pro'); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{language === 'ti' ? 'ዓመታዊ (Yearly)' : 'Yearly Billing'}</span>
                <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full">
                  Save 33%
                </span>
              </button>

              <button
                id="cycle-lifetime"
                onClick={() => { setBillingCycle('one_time'); setSelectedPlanId('lifetime'); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  billingCycle === 'one_time'
                    ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ti' ? 'ናይ ዘለኣለም (Lifetime)' : 'Lifetime Pass'}</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* 1. Free Explorer */}
            <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
              selectedPlanId === 'free'
                ? 'bg-[#151828] border-amber-500 ring-2 ring-amber-500/40'
                : 'bg-[#0E101D] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Tier</span>
                  {subscription.tier === 'free' && (
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">Current</span>
                  )}
                </div>
                <h3 className="font-bold text-white text-lg">Axumite Explorer</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-white font-mono">{CURRENCY_SYMBOLS[selectedCurrency]}0</span>
                  <span className="text-xs text-slate-400">/forever</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>25,000 Tokens/mo</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>Standard Tigrinya Chat</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>Basic Ge'ez Dictionary</span></li>
                </ul>
              </div>
              <button
                disabled={subscription.tier === 'free'}
                onClick={() => setSelectedPlanId('free')}
                className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-bold rounded-xl"
              >
                {subscription.tier === 'free' ? 'Active Plan' : 'Select Free'}
              </button>
            </div>

            {/* 2. Sovereign Pro (Most Popular) */}
            <div className={`rounded-2xl p-5 border flex flex-col justify-between relative transition-all ${
              selectedPlanId === 'pro'
                ? 'bg-gradient-to-b from-[#1C182F] to-[#120F20] border-[#C5A059] ring-2 ring-amber-500/50 shadow-2xl shadow-amber-900/20'
                : 'bg-[#0E101D] border-[#8E6D28]/40 hover:border-amber-500/60'
            }`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-700 text-black text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow">
                ⭐ Most Popular
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Sovereign Pro</span>
                  {subscription.tier === 'pro' && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
                  )}
                </div>
                <h3 className="font-bold text-[#F3E5AB] text-lg font-cinzel">ልዑላዊ AI ፕሮ</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-[#F3E5AB] font-mono">
                    {getPlanPrice('pro', billingCycle).formatted}
                  </span>
                  <span className="text-xs text-slate-400">
                    {billingCycle === 'yearly' ? '/year' : '/month'}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/20">
                  🎁 14-Day Free Trial included
                </div>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>Unlimited High-Speed AI Chat</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>Gemini 3.7 Deep Reasoning</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>AI Video Dubbing & Translation</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>4K Calligraphy & OCR Scanner</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>Automatic Renewal (Cancel anytime)</span></li>
                </ul>
              </div>
              <button
                id="btn-select-pro"
                onClick={() => setSelectedPlanId('pro')}
                className="mt-6 w-full py-2.5 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer hover:opacity-90 transition-opacity"
              >
                {selectedPlanId === 'pro' ? 'Selected' : 'Choose Pro'}
              </button>
            </div>

            {/* 3. Imperial Enterprise */}
            <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
              selectedPlanId === 'enterprise'
                ? 'bg-[#1C182F] border-[#C5A059] ring-2 ring-amber-500/50'
                : 'bg-[#0E101D] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Enterprise</span>
                  {subscription.tier === 'enterprise' && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
                  )}
                </div>
                <h3 className="font-bold text-white text-lg font-cinzel">Imperial Enterprise</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-white font-mono">
                    {getPlanPrice('enterprise', billingCycle).formatted}
                  </span>
                  <span className="text-xs text-slate-400">
                    {billingCycle === 'yearly' ? '/year' : '/month'}
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /><span>All Pro Features Included</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /><span>Multi-User Seat Management</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /><span>Direct API Keys & Custom Models</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /><span>24/7 Sovereign Concierge Support</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /><span>Official Tax Invoices & VAT</span></li>
                </ul>
              </div>
              <button
                id="btn-select-enterprise"
                onClick={() => setSelectedPlanId('enterprise')}
                className="mt-6 w-full py-2.5 bg-[#1E2338] hover:bg-[#282F4D] text-[#F3E5AB] border border-[#8E6D28]/40 text-xs font-bold rounded-xl cursor-pointer"
              >
                {selectedPlanId === 'enterprise' ? 'Selected' : 'Choose Enterprise'}
              </button>
            </div>

            {/* 4. Lifetime Pass (One-Time) */}
            <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
              selectedPlanId === 'lifetime'
                ? 'bg-gradient-to-b from-[#2A2110] to-[#120F20] border-amber-400 ring-2 ring-amber-400/50'
                : 'bg-[#0E101D] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">One-Time Payment</span>
                  {subscription.tier === 'lifetime' && (
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
                  )}
                </div>
                <h3 className="font-bold text-[#F3E5AB] text-lg font-cinzel">Lifetime Pass</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-[#F3E5AB] font-mono">
                    {getPlanPrice('lifetime', 'one_time').formatted}
                  </span>
                  <span className="text-xs text-slate-400">/one-time</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center space-x-2"><Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /><span>Pay once, own forever</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>All future updates included</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>No recurring billing ever</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>Founder Gold Emblem Badge</span></li>
                </ul>
              </div>
              <button
                id="btn-select-lifetime"
                onClick={() => { setSelectedPlanId('lifetime'); setBillingCycle('one_time'); }}
                className="mt-6 w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                {selectedPlanId === 'lifetime' ? 'Selected' : 'Get Lifetime'}
              </button>
            </div>

          </div>

          {/* Checkout Configuration & Payment Provider Box */}
          {selectedPlanId !== 'free' && (
            <div className="bg-[#121422] border border-[#8E6D28]/40 rounded-2xl p-6 shadow-2xl space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#F3E5AB] font-cinzel flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Secure Checkout & Authorization</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Selected: <strong className="text-white">{selectedPlanId.toUpperCase()}</strong> ({billingCycle}) for <strong className="text-emerald-400">{getPlanPrice(selectedPlanId, billingCycle).formatted}</strong>
                  </p>
                </div>

                {/* Free Trial Toggle */}
                {selectedPlanId !== 'lifetime' && (
                  <label className="flex items-center space-x-2 bg-[#1A1E33] px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={withTrial}
                      onChange={(e) => setWithTrial(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#F3E5AB]">Start with 14-Day Free Trial</span>
                  </label>
                )}
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  id="pay-method-stripe"
                  onClick={() => setPaymentProvider('stripe')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                    paymentProvider === 'stripe'
                      ? 'bg-[#1F1B33] border-amber-500 ring-1 ring-amber-500'
                      : 'bg-[#151828] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-bold text-xs">
                    S
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Stripe Checkout</div>
                    <div className="text-[10px] text-slate-400">Instant multi-currency checkout</div>
                  </div>
                </button>

                <button
                  id="pay-method-card"
                  onClick={() => setPaymentProvider('card')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                    paymentProvider === 'card'
                      ? 'bg-[#1F1B33] border-amber-500 ring-1 ring-amber-500'
                      : 'bg-[#151828] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Credit / Debit Card</div>
                    <div className="text-[10px] text-slate-400">Visa, Mastercard, Amex</div>
                  </div>
                </button>

                <button
                  id="pay-method-bank"
                  onClick={() => setActiveTab('bank-portal')}
                  className="p-3 rounded-xl border bg-[#151828] border-slate-800 hover:border-slate-700 text-left flex items-center space-x-3 transition-all cursor-pointer"
                >
                  <Building2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Eritrean Bank Transfer</div>
                    <div className="text-[10px] text-slate-400">CBE, BOE, Himbol, SWIFT</div>
                  </div>
                </button>
              </div>

              {/* Form details & Promo Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name</label>
                  <input
                    id="checkout-customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#0E101D] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Receipt Email</label>
                  <input
                    id="checkout-customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#0E101D] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* If Direct Card Form: Render Modern Checkout View */}
              {paymentProvider === 'card' && (
                <div className="pt-2 flex justify-center">
                  <ModernCheckoutView
                    user={user}
                    planName={selectedPlanId === 'pro' ? 'Sovereign Pro' : selectedPlanId === 'enterprise' ? 'Enterprise Scriptorium' : 'Lifetime Sovereign'}
                    planId={selectedPlanId}
                    amountFormatted={getPlanPrice(selectedPlanId, selectedPlanId === 'lifetime' ? 'one_time' : billingCycle).formatted}
                    rawAmount={getPlanPrice(selectedPlanId, selectedPlanId === 'lifetime' ? 'one_time' : billingCycle).raw}
                    currency={selectedCurrency}
                    billingCycle={selectedPlanId === 'lifetime' ? 'one_time' : billingCycle}
                    withTrial={withTrial && selectedPlanId !== 'lifetime'}
                    onBack={() => setPaymentProvider('stripe')}
                    onManageOtherMethods={() => setActiveTab('bank-portal')}
                    onSuccess={() => {
                      setStatusMessage({
                        type: 'success',
                        text: language === 'ti' ? 'ክፍሊትኩም ብዓወት ተፈጺሙ ኣሎ!' : 'Payment processed successfully! Your subscription is active.',
                      });
                      setActiveTab('subscription');
                    }}
                  />
                </div>
              )}

              {/* Promo Code Entry */}
              <div className="flex items-center space-x-2">
                <input
                  id="promo-code-input"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code (e.g. AKSUM2026)"
                  className="flex-1 bg-[#0E101D] border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono uppercase focus:outline-none"
                />
                <button
                  id="apply-promo-btn"
                  onClick={handleApplyPromo}
                  className="px-4 py-2.5 bg-[#1A1E33] hover:bg-[#252B47] text-[#F3E5AB] border border-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Apply Code
                </button>
              </div>

              {/* Security Statement */}
              <div className="flex items-start space-x-2 text-[11px] text-slate-400 bg-[#0E101D] p-3 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Security Guarantee:</strong> We do NOT store raw credit card numbers or CVV codes in our database. All card tokenization is handled securely by Stripe's PCI-DSS compliant infrastructure. Entitlement access is verified and cryptographically signed on the server.
                </p>
              </div>

              {/* Final Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  id="btn-restore-purchases"
                  onClick={handleRestorePurchases}
                  disabled={isProcessing}
                  className="text-xs text-amber-400/90 hover:text-amber-300 underline font-semibold cursor-pointer"
                >
                  Restore Previous Purchases
                </button>

                <button
                  id="btn-confirm-checkout"
                  disabled={isProcessing}
                  onClick={paymentProvider === 'stripe' ? handleInitiateStripeCheckout : handleDirectCardCheckout}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Gateway Authorization...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {withTrial && selectedPlanId !== 'lifetime'
                          ? `Start 14-Day Free Trial (${getPlanPrice(selectedPlanId, billingCycle).formatted})`
                          : `Pay ${getPlanPrice(selectedPlanId, billingCycle).formatted} & Activate`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MOBILE / 3D CARD CHECKOUT (Design Pattern Integration)               */}
      {/* ========================================================================= */}
      {activeTab === 'mobile-checkout' && (
        <div className="space-y-6 animate-fade-in flex flex-col items-center">
          
          {/* Plan Selector Pill for Mobile Checkout */}
          <div className="flex flex-wrap items-center justify-center gap-2 bg-[#121422] p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => setSelectedPlanId('pro')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPlanId === 'pro'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sovereign Pro ({getPlanPrice('pro', billingCycle).formatted})
            </button>
            <button
              onClick={() => setSelectedPlanId('enterprise')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPlanId === 'enterprise'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Enterprise ({getPlanPrice('enterprise', billingCycle).formatted})
            </button>
            <button
              onClick={() => setSelectedPlanId('lifetime')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPlanId === 'lifetime'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lifetime ({getPlanPrice('lifetime', 'one_time').formatted})
            </button>
          </div>

          {/* Render the Modern Checkout View */}
          <ModernCheckoutView
            user={user}
            planName={selectedPlanId === 'pro' ? 'Sovereign Pro' : selectedPlanId === 'enterprise' ? 'Enterprise Scriptorium' : 'Lifetime Sovereign'}
            planId={selectedPlanId}
            amountFormatted={getPlanPrice(selectedPlanId, selectedPlanId === 'lifetime' ? 'one_time' : billingCycle).formatted}
            rawAmount={getPlanPrice(selectedPlanId, selectedPlanId === 'lifetime' ? 'one_time' : billingCycle).raw}
            currency={selectedCurrency}
            billingCycle={selectedPlanId === 'lifetime' ? 'one_time' : billingCycle}
            withTrial={withTrial && selectedPlanId !== 'lifetime'}
            onBack={() => setActiveTab('checkout')}
            onManageOtherMethods={() => setActiveTab('bank-portal')}
            onSuccess={() => {
              setStatusMessage({
                type: 'success',
                text: language === 'ti' ? 'ክፍሊትኩም ብዓወት ተፈጺሙ ኣሎ!' : 'Payment processed successfully! Your subscription is active.',
              });
              setActiveTab('subscription');
            }}
          />

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY SUBSCRIPTION MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'subscription' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-[#121422] border border-[#8E6D28]/40 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Active Plan</span>
                <h3 className="text-xl font-bold font-cinzel text-[#F3E5AB]">
                  {subscription.planName}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  subscription.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : subscription.status === 'TRIALING'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  ● {subscription.status}
                </span>
              </div>
            </div>

            {/* Subscription Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-[#0E101D] p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px] font-sans">Billing Cycle</div>
                <div className="text-white font-bold capitalize mt-1">{subscription.billingCycle}</div>
              </div>
              <div className="bg-[#0E101D] p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px] font-sans">Renewal / Expiry Date</div>
                <div className="text-[#F3E5AB] font-bold mt-1">{subscription.renewsAt}</div>
              </div>
              <div className="bg-[#0E101D] p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px] font-sans">Auto-Renewal Status</div>
                <div className={`font-bold mt-1 ${subscription.autoRenew ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {subscription.autoRenew ? 'Enabled (Automatic)' : 'Paused (Cancels at end of period)'}
                </div>
              </div>
            </div>

            {/* Cryptographic Entitlement Proof */}
            <div className="p-4 bg-[#0E101D] rounded-xl border border-[#8E6D28]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Server-Authoritative Entitlement Signature</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">VALID & SECURED</span>
              </div>
              <div className="bg-[#151828] p-2.5 rounded-lg text-[10px] font-mono text-slate-300 break-all select-all border border-slate-800">
                {subscription.entitlementSignature}
              </div>
              <p className="text-[11px] text-slate-400">
                This signature is generated using server-side HMAC secrets, preventing frontend privilege tampering.
              </p>
            </div>

            {/* Management Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                {subscription.tier !== 'free' && (
                  <button
                    id="btn-toggle-autorenew"
                    onClick={toggleAutoRenewal}
                    className="px-4 py-2 bg-[#1A1E33] hover:bg-[#252B47] text-slate-200 border border-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {subscription.autoRenew ? 'Turn Off Auto-Renew' : 'Turn On Auto-Renew'}
                  </button>
                )}

                {subscription.tier !== 'free' && subscription.status !== 'CANCELED_PENDING_EXPIRATION' && (
                  <button
                    id="btn-open-cancel-modal"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel Subscription
                  </button>
                )}

                {subscription.status === 'CANCELED_PENDING_EXPIRATION' && (
                  <button
                    id="btn-reactivate-sub"
                    onClick={reactivateSubscription}
                    className="px-4 py-2 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Reactivate Subscription
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-restore-sub"
                  onClick={handleRestorePurchases}
                  className="px-4 py-2 bg-[#1A1E33] text-amber-400 text-xs font-bold rounded-xl border border-[#8E6D28]/40 hover:bg-[#252B47] cursor-pointer"
                >
                  Restore Purchases
                </button>
                <button
                  id="btn-upgrade-plan"
                  onClick={() => setActiveTab('checkout')}
                  className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black text-xs font-black uppercase rounded-xl cursor-pointer"
                >
                  Change / Upgrade Plan
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INVOICES & PAYMENT HISTORY */}
      {/* ========================================================================= */}
      {activeTab === 'invoices' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#121422] border border-[#8E6D28]/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold font-cinzel text-[#F3E5AB]">
                  Official Tax Invoices & Receipts
                </h3>
                <p className="text-xs text-slate-400">
                  Full history of all payments, charges, refunds, and active trial activations.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                VAT ID: ER-TAX-9482910-AXM
              </span>
            </div>

            {subscription.invoices.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-xs">No payment invoices generated yet.</p>
                <button
                  onClick={() => setActiveTab('checkout')}
                  className="px-4 py-2 bg-[#1A1E33] text-amber-400 text-xs font-bold rounded-xl border border-slate-700"
                >
                  Browse Subscription Plans
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0E101D] text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Gateway</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {subscription.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#1A1E33]/50">
                        <td className="p-3 font-bold text-amber-300">{inv.invoiceNumber}</td>
                        <td className="p-3 text-slate-300 font-sans">{inv.date}</td>
                        <td className="p-3 text-white font-sans font-semibold">{inv.planName}</td>
                        <td className="p-3 text-emerald-400 font-bold">
                          {CURRENCY_SYMBOLS[selectedCurrency] || '$'}{inv.amount.toFixed(2)}
                        </td>
                        <td className="p-3 text-slate-300 font-sans">{inv.paymentMethod}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : inv.status === 'REFUNDED'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-sky-500/20 text-sky-300'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3 py-1 bg-[#1A1E33] hover:bg-[#252B47] text-amber-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 ml-auto cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-sans">View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ERITREAN BANK TRANSFER & REMITTANCE */}
      {/* ========================================================================= */}
      {activeTab === 'bank-portal' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Bank Accounts Directory */}
            <div className="bg-[#121422] border border-[#8E6D28]/40 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-3">
                <img src={bankIconImg} alt="Bank" className="w-9 h-9 rounded-xl object-cover border border-amber-500/40" />
                <div>
                  <h3 className="font-bold text-white text-base font-cinzel">
                    Eritrean Banking & Wire Accounts
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official sovereign deposit details for domestic & diaspora subscribers.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {BANK_DIRECTORY.map((bank) => (
                  <div
                    key={bank.key}
                    onClick={() => setSelectedBankKey(bank.key as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedBankKey === bank.key
                        ? 'bg-[#1C182F] border-amber-400 ring-1 ring-amber-400/40'
                        : 'bg-[#0E101D] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white text-xs">{bank.name}</span>
                      <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded">{bank.badge}</span>
                    </div>
                    <div className="mt-2 text-xs font-mono text-[#F3E5AB] flex items-center justify-between">
                      <span>Acc: {bank.accountNumber}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(bank.accountNumber);
                          setCopyNotice(`Copied: ${bank.accountNumber}`);
                          setTimeout(() => setCopyNotice(''), 2500);
                        }}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">SWIFT: {bank.swift}</div>
                  </div>
                ))}
              </div>

              {copyNotice && (
                <div className="text-xs text-emerald-400 font-bold text-center bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                  {copyNotice}
                </div>
              )}
            </div>

            {/* Right: Slip Verification Form */}
            <div className="bg-[#121422] border border-[#8E6D28]/40 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold font-cinzel text-[#F3E5AB]">
                Verify Wire / Deposit Slip
              </h3>
              <p className="text-xs text-slate-400">
                Enter your bank reference code to credit tokens or activate Pro subscription instantly.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Selected Bank</label>
                  <select
                    value={selectedBankKey}
                    onChange={(e) => setSelectedBankKey(e.target.value as any)}
                    className="w-full bg-[#0E101D] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="cbe-er">Commercial Bank of Tigray (ናይ ትግራይ ንግዲ ባንክ)</option>
                    <option value="boe">Bank of Tigray (ናይ ትግራይ ባንክ)</option>
                    <option value="himbol">Diaspora Remittance (ናይ ተጋሩ ሓዋላ)</option>
                    <option value="swift">SWIFT / International Diaspora Wire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deposit Slip / Reference Number</label>
                  <input
                    type="text"
                    value={bankRefNumber}
                    onChange={(e) => setBankRefNumber(e.target.value)}
                    placeholder="e.g. ERN2694829103AXM"
                    className="w-full bg-[#0E101D] border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount Deposited</label>
                  <input
                    type="number"
                    value={bankDepositAmount}
                    onChange={(e) => setBankDepositAmount(e.target.value)}
                    className="w-full bg-[#0E101D] border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                  />
                </div>

                <button
                  disabled={isBankVerifying}
                  onClick={handleVerifyBankTransfer}
                  className="w-full py-3 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-black uppercase text-xs rounded-xl shadow cursor-pointer mt-2"
                >
                  {isBankVerifying ? 'Verifying Slip with Bank Ingress...' : 'Verify Bank Payment'}
                </button>
              </div>

              {bankVerificationResult && (
                <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-500/40 text-xs space-y-2 text-emerald-200">
                  <div className="font-bold flex items-center space-x-1.5 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bank Transfer Verified!</span>
                  </div>
                  <p>{bankVerificationResult.tigrinyaMessage}</p>
                  <div className="font-mono text-[10px] text-slate-300">
                    Ref: {bankVerificationResult.referenceNumber} | Invoice: {bankVerificationResult.invoiceNumber}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DIAGNOSTICS & AUTOMATED TEST SUITE */}
      {/* ========================================================================= */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-[#121422] border border-[#8E6D28]/40 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div>
                <h3 className="text-base font-bold font-cinzel text-[#F3E5AB] flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Automated 10-Point Payment Test Suite</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Runs comprehensive server-side verification: Stripe sessions, tamper proofing, webhooks, currency conversions, cancellations & refunds.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-simulate-payment-fail"
                  onClick={() => simulatePaymentFailureAlert()}
                  className="px-4 py-2.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow transition-all"
                  title="Trigger live in-app payment failed notification alert"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Test Payment Failure Alert</span>
                </button>

                <button
                  id="btn-run-tests"
                  disabled={isRunningTests}
                  onClick={handleRunDiagnostics}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer hover:opacity-90 flex items-center space-x-2"
                >
                  {isRunningTests ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running Test Suite...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span>Run All 10 Tests</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test Stats Header */}
            {testStats && (
              <div className="p-4 rounded-xl border bg-[#0E101D] border-emerald-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Test Suite Execution Summary:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {testStats.passCount} / {testStats.totalCount} Scenarios Passed (100% Green)
                </span>
              </div>
            )}

            {/* Results Grid */}
            <div className="space-y-2">
              {testResults.length === 0 && !isRunningTests && (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Click "Run All 10 Tests" to execute the full automated payment compliance validation.
                </div>
              )}

              {testResults.map((t) => (
                <div
                  key={t.scenarioId}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    t.passed
                      ? 'bg-[#0E101D] border-emerald-500/20'
                      : 'bg-rose-950/40 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {t.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-white">{t.title}</div>
                      <div className="text-[11px] text-slate-400">{t.details}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-mono text-slate-400">{t.latencyMs}ms</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {t.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <InvoiceReceiptModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}

      {/* Cancel Subscription Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E101D] border border-rose-500/50 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-rose-300 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Cancel Subscription Confirmation</span>
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to cancel your Pro subscription? You will keep full access until your current billing period expires on <strong>{subscription.renewsAt}</strong>.
            </p>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Reason for cancellation:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-[#151828] border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
              >
                <option value="Cost considerations">Cost considerations</option>
                <option value="Temporary pause">Temporary pause</option>
                <option value="Missing specific feature">Missing specific feature</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 bg-[#1A1E33] text-slate-300 text-xs font-bold rounded-xl"
              >
                Keep Subscription
              </button>
              <button
                disabled={isCanceling}
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                {isCanceling ? 'Canceling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
