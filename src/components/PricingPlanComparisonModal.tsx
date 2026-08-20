import React, { useState } from 'react';
import { 
  X, Check, Crown, Sparkles, Shield, Zap, Infinity as InfinityIcon, 
  HelpCircle, ArrowRight, Smartphone, CreditCard, RefreshCw, 
  Receipt, FileText, AlertCircle, CheckCircle2, Building2, ChevronRight,
  ShieldCheck, Lock, ToggleLeft, ToggleRight, Download, Calendar, ExternalLink
} from 'lucide-react';
import { useSubscription, SubscriptionTier, BillingCycle, InvoiceItem } from '../context/SubscriptionContext';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile } from '../types';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import googlePlayIcon from '../assets/images/axumite_ai_logo_1786607890310.jpg';

interface PricingPlanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const PricingPlanComparisonModal: React.FC<PricingPlanComparisonModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const { language } = useLanguage();
  const {
    subscription,
    isProOrHigher,
    isTrialing,
    startGooglePlayPurchase,
    processCardPayment,
    cancelSubscription,
    reactivateSubscription,
    toggleAutoRenewal,
    changePlan,
  } = useSubscription();

  const [activeTab, setActiveTab] = useState<'plans' | 'management' | 'history'>('plans');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

  // Google Play Billing Sheet State
  const [isGooglePlaySheetOpen, setIsGooglePlaySheetOpen] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<'pro_monthly' | 'pro_yearly' | 'enterprise_monthly' | 'enterprise_yearly' | 'lifetime_pass'>('pro_yearly');
  const [pendingWithTrial, setPendingWithTrial] = useState(true);
  const [isProcessingGooglePlay, setIsProcessingGooglePlay] = useState(false);
  const [googlePlaySuccess, setGooglePlaySuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Cancel Subscription Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found another alternative');
  const [isCanceling, setIsCanceling] = useState(false);

  // Downgrade Confirm State
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
  const [targetDowngradeTier, setTargetDowngradeTier] = useState<SubscriptionTier>('free');

  if (!isOpen) return null;

  const handleOpenGooglePlay = (
    planId: 'pro_monthly' | 'pro_yearly' | 'enterprise_monthly' | 'enterprise_yearly' | 'lifetime_pass',
    withTrial: boolean = true
  ) => {
    setPendingPlanId(planId);
    setPendingWithTrial(withTrial);
    setPaymentError('');
    setGooglePlaySuccess(false);
    setIsGooglePlaySheetOpen(true);
  };

  const handleExecuteGooglePlayPurchase = async () => {
    setIsProcessingGooglePlay(true);
    setPaymentError('');

    try {
      const result = await startGooglePlayPurchase(pendingPlanId, pendingWithTrial);
      if (result.success) {
        setGooglePlaySuccess(true);
        setTimeout(() => {
          setIsGooglePlaySheetOpen(false);
          setGooglePlaySuccess(false);
          setActiveTab('management');
        }, 1600);
      } else {
        setPaymentError(result.error || 'Google Play Billing authorization failed.');
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment failed.');
    } finally {
      setIsProcessingGooglePlay(false);
    }
  };

  const handleConfirmCancel = async () => {
    setIsCanceling(true);
    try {
      await cancelSubscription(cancelReason);
      setIsCancelModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleConfirmDowngrade = async () => {
    await changePlan(targetDowngradeTier, 'monthly');
    setIsDowngradeModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0B0D17] border border-[#8E6D28]/40 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl relative my-auto max-h-[94vh] flex flex-col text-slate-100">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-[#121422] border-b border-[#8E6D28]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold font-cinzel text-white">
                  {language === 'ti' ? 'ፕላናትን ክፍሊትን (Pricing & Subscriptions)' : 'Pricing & Subscription Plans'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  Google Play Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ti' ? 'ዝተማልአ ናይ AI መሳርሒታት፡ 14 መዓልቲ ናጻ ፈተነ፡ ውሑስ ክፍሊት' : 'Compare tiers, manage subscriptions, view invoices, and unlock premium AI features.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {/* Tab Navigation Switches */}
            <div className="bg-[#1C2035] p-1 rounded-xl flex items-center space-x-1 border border-slate-700/60 text-xs">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'plans' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {language === 'ti' ? 'ፕላናት (Plans)' : 'Plans & Pricing'}
              </button>
              <button
                onClick={() => setActiveTab('management')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'management' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {language === 'ti' ? 'ናተይ ኣባልነት (My Sub)' : 'My Subscription'}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'history' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {language === 'ti' ? 'ረሲታት (Invoices)' : 'Invoices & Receipts'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-7">
          
          {/* ========================================================================= */}
          {/* TAB 1: PRICING PLANS & FEATURE COMPARISON                                 */}
          {/* ========================================================================= */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              
              {/* Monthly vs. Yearly Switcher */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="bg-[#151828] p-1.5 rounded-2xl border border-[#8E6D28]/30 flex items-center space-x-1.5 shadow-inner">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {language === 'ti' ? 'ወርሓዊ (Monthly)' : 'Monthly Billing'}
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                      billingCycle === 'yearly'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{language === 'ti' ? 'ዓመታዊ (Yearly)' : 'Yearly Billing'}</span>
                    <span className="bg-emerald-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                      SAVE 33%
                    </span>
                  </button>
                </div>
                
                <div className="text-[11px] text-amber-400/90 font-medium flex items-center space-x-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ti' ? 'ኩሎም ፕሮ ፕላናት 14 መዓልቲ ናጻ ፈተነ የጠቓልሉ' : 'All Pro plans include 14-day free trial with auto-renewal'}</span>
                </div>
              </div>

              {/* Plans Grid (3 Cards + 1 Lifetime Pass Banner) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. Free Explorer */}
                <div className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                  subscription.tier === 'free'
                    ? 'bg-[#151726]/80 border-slate-600 shadow-lg ring-2 ring-slate-500/20'
                    : 'bg-[#10121F]/60 border-slate-800/80 hover:border-slate-700'
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                        {language === 'ti' ? 'ነጻ ጀማሪ' : 'Starter'}
                      </span>
                      {subscription.tier === 'free' && (
                        <span className="text-[10px] font-bold bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full">
                          CURRENT PLAN
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mt-1">
                      {language === 'ti' ? 'ናጻ ኣክሱማይት' : 'Free Explorer'}
                    </h3>

                    <div className="mt-3 flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-white">$0</span>
                      <span className="text-xs text-slate-400">/forever</span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      {language === 'ti' ? 'መሰረታዊ ናይ AI ቻትን ግእዝ ትርጉምን ንጀመርቲ' : 'Basic AI chat and standard dictionary queries for casual users.'}
                    </p>

                    <div className="border-t border-slate-800 my-4" />

                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>25,000 Monthly Obelisk Tokens</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Standard Tigrinya & Ge'ez Chat</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Basic Dictionary & Historical Archive</span>
                      </li>
                      <li className="flex items-center space-x-2 text-slate-500">
                        <X className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>No AI Video Translation or Dubbing</span>
                      </li>
                      <li className="flex items-center space-x-2 text-slate-500">
                        <X className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>No 4K Calligraphy / Document AI</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    {subscription.tier === 'free' ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs cursor-default"
                      >
                        {language === 'ti' ? 'ንጡፍ ፕላን (Active)' : 'Active Plan'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setTargetDowngradeTier('free');
                          setIsDowngradeModalOpen(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                      >
                        {language === 'ti' ? 'ናብ ነጻ ቀይር (Downgrade)' : 'Downgrade to Free'}
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Sovereign Pro (Most Popular) */}
                <div className={`rounded-3xl p-6 border relative flex flex-col justify-between transition-all ${
                  subscription.tier === 'pro'
                    ? 'bg-gradient-to-b from-[#1C1A2E] to-[#12111E] border-amber-500 shadow-2xl ring-2 ring-amber-500/30'
                    : 'bg-gradient-to-b from-[#171524] to-[#0F0E18] border-amber-500/60 shadow-xl hover:border-amber-400'
                }`}>
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    ★ MOST POPULAR • 14-DAY TRIAL ★
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                        {language === 'ti' ? 'ልዑላዊ ፕሮ' : 'Sovereign Pro'}
                      </span>
                      {subscription.tier === 'pro' && (
                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          CURRENT PLAN
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mt-1">
                      {language === 'ti' ? 'ኤርትራዊ AI Pro' : 'Sovereign Pro AI'}
                    </h3>

                    <div className="mt-3 flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-amber-400">
                        {billingCycle === 'yearly' ? '$79.99' : '$9.99'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {billingCycle === 'yearly' ? '/year ($6.66/mo)' : '/month'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2">
                      {language === 'ti'
                        ? '14 መዓልቲ ብነጻ ጀምሩ። ዘይውዳእ ቻት፡ ቪድዮ ትርጉም፡ 4K ግእዝ ከሊግራፊ።'
                        : 'Start with 14-day free trial ($0 today). Auto-renews, cancel anytime.'}
                    </p>

                    <div className="border-t border-slate-800 my-4" />

                    <ul className="space-y-2.5 text-xs text-slate-200">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>14-Day Free Trial</strong> ($0 billed today)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>Unlimited</strong> Gemini 3.7 Pro Deep Reasoning</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>AI Video Translator & Speech Dubbing</strong></span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>4K Ge'ez Calligraphy & Mandala Studio</strong></span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>OCR Smart Document & Legal Civic AI</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    {subscription.tier === 'pro' ? (
                      <button
                        onClick={() => setActiveTab('management')}
                        className="w-full py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition-colors cursor-pointer"
                      >
                        {language === 'ti' ? 'ኣባልነት ኣመሓድር (Manage Sub)' : 'Manage Active Subscription'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenGooglePlay(billingCycle === 'yearly' ? 'pro_yearly' : 'pro_monthly', true)}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <span>{language === 'ti' ? 'ናይ 14 መዓልቲ ፈተነ ጀምር ($0/Today)' : 'Start 14-Day Free Trial ($0 Today)'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Axumite Imperial Enterprise */}
                <div className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                  subscription.tier === 'enterprise'
                    ? 'bg-[#1B172E] border-fuchsia-500 shadow-2xl ring-2 ring-fuchsia-500/30'
                    : 'bg-[#10121F]/60 border-slate-800/80 hover:border-slate-700'
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-widest text-fuchsia-400">
                        {language === 'ti' ? 'ንጉሳዊ ትካል' : 'Enterprise'}
                      </span>
                      {subscription.tier === 'enterprise' && (
                        <span className="text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 px-2 py-0.5 rounded-full">
                          CURRENT PLAN
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mt-1">
                      {language === 'ti' ? 'ኣክሱማይት ኢንተርፕራይዝ' : 'Imperial Enterprise'}
                    </h3>

                    <div className="mt-3 flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-white">
                        {billingCycle === 'yearly' ? '$239.99' : '$29.99'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {billingCycle === 'yearly' ? '/year' : '/month'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      {language === 'ti' ? 'ንትካላት፡ ዲያስፖራ ትካላትን ተመራመርትን ዝኸውን ፍሉይ ሰርቨር' : 'Dedicated token stream, custom models, multi-seat licenses, and 24/7 concierge.'}
                    </p>

                    <div className="border-t border-slate-800 my-4" />

                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>All Sovereign Pro Features Included</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Dedicated Multi-Seat Team License</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Direct API Key Access & Custom Models</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Official Tax Invoices & VAT Receipts</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>24/7 Dedicated Sovereign Concierge</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    {subscription.tier === 'enterprise' ? (
                      <button
                        onClick={() => setActiveTab('management')}
                        className="w-full py-3 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 font-bold text-xs hover:bg-fuchsia-500/30 transition-colors cursor-pointer"
                      >
                        {language === 'ti' ? 'ኣባልነት ኣመሓድር' : 'Manage Subscription'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenGooglePlay(billingCycle === 'yearly' ? 'enterprise_yearly' : 'enterprise_monthly', true)}
                        className="w-full py-3.5 px-4 rounded-2xl bg-[#221D38] hover:bg-[#2C2649] text-fuchsia-300 hover:text-white border border-fuchsia-500/40 font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <span>{language === 'ti' ? 'ናይ ትካል ፈተነ ጀምር' : 'Upgrade to Enterprise'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* 4. Lifetime Pass Banner */}
              <div className="bg-gradient-to-r from-[#171520] via-[#1C182A] to-[#171520] rounded-3xl p-5 sm:p-6 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md shrink-0">
                    <InfinityIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base sm:text-lg font-bold text-white font-cinzel">
                        {language === 'ti' ? 'ናይ ዘለኣለም ልዑላዊ ፍቓድ (Lifetime Sovereign Pass)' : 'Lifetime Sovereign Pass'}
                      </h4>
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                        ONE-TIME PAYMENT
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl">
                      {language === 'ti'
                        ? 'ሓንሳብ ጥራይ ክፈሉ ($199.99)፡ ንዘለኣለም ኩሎም ሓደስቲ መሳርሒታትን ናይ AI ዕቤትን ብዘይ ተደጋጋሚ ክፍሊት ይረከቡ።'
                        : 'Pay once ($199.99), own forever. Zero recurring subscription fees with lifetime access to all future upgrades.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400">$199.99</span>
                    <p className="text-[10px] text-slate-500">One-Time Charge</p>
                  </div>
                  {subscription.tier === 'lifetime' ? (
                    <span className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                      OWNED LIFETIME
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenGooglePlay('lifetime_pass', false)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      {language === 'ti' ? 'ናይ ዘለኣለም ግዛእ' : 'Buy Lifetime Pass'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SUBSCRIPTION MANAGEMENT & STATUS                                    */}
          {/* ========================================================================= */}
          {activeTab === 'management' && (
            <div className="space-y-6">
              
              {/* Active Plan Status Card */}
              <div className="bg-gradient-to-br from-[#151829] via-[#10121F] to-[#0D0F1A] rounded-3xl p-6 border border-[#8E6D28]/40 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-white">
                          {subscription.planName}
                        </h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          subscription.status === 'TRIALING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : subscription.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {subscription.status === 'TRIALING' ? '14-DAY TRIAL ACTIVE' : subscription.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Billing Term: <strong className="text-slate-200 capitalize">{subscription.billingCycle}</strong> • Price: <strong className="text-amber-400">${subscription.amount.toFixed(2)} USD</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {subscription.status === 'CANCELED_PENDING_EXPIRATION' ? (
                      <button
                        onClick={reactivateSubscription}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
                      >
                        {language === 'ti' ? 'ኣባልነት ቀጽል (Reactivate)' : 'Reactivate Auto-Renewal'}
                      </button>
                    ) : subscription.tier !== 'free' && (
                      <button
                        onClick={() => setIsCancelModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
                      >
                        {language === 'ti' ? 'ሰርዝ (Cancel Subscription)' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Grid Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-xs">
                  <div className="bg-[#191D30]/60 p-4 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 uppercase font-semibold text-[10px] tracking-wider">Next Renewal / Expiry</p>
                    <p className="text-white font-bold text-sm mt-1 flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{subscription.renewsAt}</span>
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1">
                      {subscription.autoRenew ? 'Automatic renewal enabled' : 'Will expire at period end'}
                    </p>
                  </div>

                  <div className="bg-[#191D30]/60 p-4 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 uppercase font-semibold text-[10px] tracking-wider">Payment Method</p>
                    <p className="text-white font-bold text-sm mt-1 flex items-center space-x-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>{subscription.paymentMethod.label}</span>
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Managed via Google Play Account
                    </p>
                  </div>

                  <div className="bg-[#191D30]/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 uppercase font-semibold text-[10px] tracking-wider">Auto-Renewal</p>
                      <p className="text-white font-bold text-sm mt-1">
                        {subscription.autoRenew ? 'Enabled (ON)' : 'Disabled (OFF)'}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Toggle renewal preference</p>
                    </div>

                    <button
                      onClick={toggleAutoRenewal}
                      className="p-1 rounded-full text-slate-300 hover:text-white transition-transform active:scale-95 cursor-pointer"
                    >
                      {subscription.autoRenew ? (
                        <ToggleRight className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Cryptographic Entitlement Proof */}
                <div className="mt-4 p-3 bg-[#0D0F1A] rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Cryptographic Entitlement Signature: <strong className="font-mono text-slate-200">{subscription.entitlementSignature}</strong></span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">VERIFIED BY SERVER</span>
                </div>
              </div>

              {/* Upgrade / Change Plan Actions */}
              <div className="bg-[#121422] p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {language === 'ti' ? 'ፕላንካ ምቕያር ትደሊ ዲኻ?' : 'Want to upgrade or change your plan?'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ti' ? 'ናብ ዓመታዊ ፕላን ብምቕያር 33% ክትቑጥቡ ወይ ናብ ትካል ክትዓብዩ ትኽእሉ ኢኹም።' : 'Switch between monthly and yearly billing or upgrade to Enterprise.'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('plans')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  {language === 'ti' ? 'ፕላናት ርአ (View Plans)' : 'Browse Plan Options'}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: INVOICES & PAYMENT HISTORY                                         */}
          {/* ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {language === 'ti' ? 'ናይ ክፍሊት ታሪክን ረሲታትን (Payment History)' : 'Invoices & Payment History'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official tax receipts with VAT breakdown and transaction reference.
                  </p>
                </div>
              </div>

              {subscription.invoices && subscription.invoices.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#151829] text-slate-400 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Invoice #</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Plan</th>
                        <th className="p-3.5">Payment Method</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {subscription.invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3.5 font-mono text-amber-400 font-semibold">{inv.invoiceNumber}</td>
                          <td className="p-3.5 text-slate-300">{inv.date}</td>
                          <td className="p-3.5 text-white font-medium">{inv.planName}</td>
                          <td className="p-3.5 text-slate-400">{inv.paymentMethod}</td>
                          <td className="p-3.5 font-mono font-bold text-slate-200">${inv.amount.toFixed(2)} USD</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-3 py-1 rounded-lg bg-[#1C2035] hover:bg-[#262C4A] text-amber-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer inline-flex items-center space-x-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-[#10121F] rounded-2xl border border-slate-800/80 space-y-3">
                  <Receipt className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-xs">
                    {language === 'ti' ? 'ዝኾነ ናይ ክፍሊት ታሪክ የለን።' : 'No recorded transactions yet. Start your 14-day free trial to generate your first invoice.'}
                  </p>
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold cursor-pointer"
                  >
                    {language === 'ti' ? 'ፕላናት ርአ' : 'View Plans'}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* GOOGLE PLAY BILLING ANDROID NATIVE BOTTOM SHEET / MODAL                   */}
      {/* ========================================================================= */}
      {isGooglePlaySheetOpen && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1E1F22] border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-white animate-slide-up">
            
            {/* Sheet Top Handle for Android */}
            <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mt-3 sm:hidden" />

            <div className="p-6 space-y-5">
              
              {/* Google Play Header */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="#4285F4" d="M3.6 1.4L13.8 11.6l-2.6 2.6L1.4 4.4C1 3.5 1.7 2.2 2.7 1.6l.9-.2z"/>
                      <path fill="#34A853" d="M17.2 8.2l-3.4 3.4 2.6 2.6 3.4-3.4c.8-.8.8-2.2 0-3l-2.6.4z"/>
                      <path fill="#FBBC05" d="M1.4 19.6l9.8-9.8 2.6 2.6L3.6 22.6c-1 .6-2.3 0-2.6-1l.4-2z"/>
                      <path fill="#EA4335" d="M13.8 11.6L3.6 1.4C4.2.8 5.2.8 5.8 1.4l11.4 6.8-3.4 3.4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300">Google Play Billing</h4>
                    <p className="text-[10px] text-slate-400">com.axumite.ai.sovereign</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsGooglePlaySheetOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info & Trial Terms */}
              <div className="flex items-center space-x-3.5 bg-[#2B2D31] p-3.5 rounded-2xl border border-slate-700/80">
                <div className="w-12 h-12 rounded-xl bg-[#0F0E13] border border-amber-500/40 p-1 shrink-0 flex items-center justify-center">
                  <img src={googlePlayIcon} alt="App" className="w-full h-full rounded-lg object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {pendingPlanId.includes('enterprise')
                      ? 'Axumite Enterprise'
                      : pendingPlanId === 'lifetime_pass'
                      ? 'Lifetime Sovereign Pass'
                      : 'Eritrean AI Sovereign Pro'}
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    {pendingWithTrial ? '14 Days Free, then $79.99/year' : pendingPlanId === 'lifetime_pass' ? '$199.99 One-Time' : '$79.99/year'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Starting today: <strong className="text-emerald-400">$0.00</strong>
                  </p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Payment Method</p>
                <div className="flex items-center justify-between p-3 bg-[#2B2D31] rounded-xl border border-slate-700">
                  <div className="flex items-center space-x-2.5">
                    <CreditCard className="w-4 h-4 text-slate-300" />
                    <span className="text-xs text-slate-200">Google Play Balance •••• 4829</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold">Primary</span>
                </div>
              </div>

              {/* Notice & Terms */}
              <p className="text-[10px] text-slate-400 leading-relaxed">
                By tapping &quot;Subscribe&quot;, your subscription starts with a 14-day free trial. You will not be charged today. Auto-renews automatically. Cancel anytime in Google Play Subscriptions.
              </p>

              {paymentError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Android 1-Tap Buy Button */}
              <div>
                {googlePlaySuccess ? (
                  <div className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Purchase Verified by Server!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleExecuteGooglePlayPurchase}
                    disabled={isProcessingGooglePlay}
                    className="w-full py-3.5 rounded-2xl bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {isProcessingGooglePlay ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying with Google Play Server...</span>
                      </>
                    ) : (
                      <>
                        <span>1-Tap Subscribe with Google Play</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANCEL SUBSCRIPTION CONFIRMATION MODAL                                    */}
      {/* ========================================================================= */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#151726] border border-rose-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {language === 'ti' ? 'ኣባልነት ክትስርዙ ርግጸኛ ዲኹም?' : 'Cancel Subscription?'}
                </h3>
                <p className="text-xs text-slate-400">
                  You will keep all Pro features until your current period ends ({subscription.renewsAt}).
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">Please let us know why you are canceling:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-[#10121F] border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
              >
                <option value="Too expensive">Too expensive / Price concern</option>
                <option value="Temporarily not needed">Temporarily not needed</option>
                <option value="Found alternative">Found another tool / alternative</option>
                <option value="Missing features">Missing specific Tigrinya AI features</option>
                <option value="Other">Other reason</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                {language === 'ti' ? 'ኣይፋለይን (Keep Sub)' : 'Keep Subscription'}
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCanceling}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                {isCanceling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Confirm Cancel</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DOWNGRADE CONFIRMATION MODAL                                              */}
      {/* ========================================================================= */}
      {isDowngradeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#151726] border border-slate-700 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-white">
            <h3 className="font-bold text-base">Downgrade to Free Tier?</h3>
            <p className="text-xs text-slate-300">
              You will lose access to unlimited high-speed AI queries, AI Video Translator, 4K Ge'ez calligraphy, and OCR Document AI.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setIsDowngradeModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDowngrade}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                Confirm Downgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      <InvoiceReceiptModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />

    </div>
  );
};
