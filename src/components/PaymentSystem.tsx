import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Sparkles, Shield, Zap, Gift, RefreshCw, FileText, Smartphone, Lock, AlertCircle, MousePointerClick, Award, Trophy, Building2, Globe, ShieldCheck, Copy, ArrowRight, CheckCircle2, Crown, Plus } from 'lucide-react';
import { PaymentReceipt, UserSubscription, UserProfile } from '../types';
import { ProClickEarning } from './ProClickEarning';
import { GlobalCommunityLeaderboard } from './GlobalCommunityLeaderboard';
import { PricingPlanComparisonModal } from './PricingPlanComparisonModal';
import bankIconImg from '../assets/images/sovereign_bank_icon_1786607928857.jpg';

interface PaymentSystemProps {
  onSaveInsight?: (item: any) => void;
  user?: UserProfile;
  onOpenAuthModal?: (mode: 'login' | 'signup' | 'verify', reason?: string) => void;
}

export const PaymentSystem: React.FC<PaymentSystemProps> = ({ onSaveInsight, user, onOpenAuthModal }) => {
  const [activeSubTab, setActiveSubTab] = useState<'checkout' | 'bank-portal' | 'pro-earnings' | 'leaderboard'>('checkout');
  const [selectedPlan, setSelectedPlan] = useState<'neural-pass' | 'sovereign-tier' | 'token-vault'>('neural-pass');
  const [paymentMethod, setPaymentMethod] = useState<
    'cbe-er' | 'boe' | 'himbol' | 'nakfa' | 'swift' | 'google-pay' | 'apple-pay' | 'credit-card' | 'axum-gold'
  >('cbe-er');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'ERN'>('ERN');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [accountNumber, setAccountNumber] = useState(user?.phoneNumber || '');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<PaymentReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Premium Card UI State (Matching User Screenshot)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [premiumBillingCycle, setPremiumBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isAddingCardInCheckout, setIsAddingCardInCheckout] = useState(false);
  const [cardEntryNumber, setCardEntryNumber] = useState('');

  // Bank Portal Verification State
  const [selectedBankKey, setSelectedBankKey] = useState<'cbe-er' | 'boe' | 'himbol' | 'swift'>('cbe-er');
  const [bankRefNumber, setBankRefNumber] = useState('');
  const [bankDepositAmount, setBankDepositAmount] = useState('1250');
  const [isBankVerifying, setIsBankVerifying] = useState(false);
  const [bankVerificationResult, setBankVerificationResult] = useState<any>(null);
  const [copyNotice, setCopyNotice] = useState('');

  // Local storage for subscription state
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem('axumite_subscription');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      activePlan: 'free',
      planName: 'Axumite Explorer (Free)',
      tokensRemaining: 25000,
      renewalDate: 'N/A',
      history: [],
      totalClickEarnings: 8500,
      referralCode: 'AXUM-SOVEREIGN-PRO',
      referralClicksCount: 7,
    };
  });

  const BANK_DIRECTORY = [
    {
      key: 'cbe-er',
      name: 'ናይ ኤርትራ ንግዲ ባንክ (Commercial Bank of Eritrea)',
      accountName: 'AXUMITE AI SOVEREIGN ERITREA LTD',
      accountNumber: '20194829103',
      swift: 'CBOEERAS',
      branch: 'Harnet Avenue Main Branch, Asmara',
      badge: 'Commercial Bank 🇪🇷',
      descriptionTi: 'ቀጥታ ብናይ ኤርትራ ንግዲ ባንክ ሕሳብ ቑጽሪ ወይ ጨንፈር ክፍሊት ፈጽሙ።',
    },
    {
      key: 'boe',
      name: 'ናይ ኤርትራ ማእከላይ ባንክ (Bank of Eritrea)',
      accountName: 'AXUMITE AI ENTERPRISE',
      accountNumber: '10928374651',
      swift: 'BERTERAS',
      branch: 'Central Bank HQ, Asmara',
      badge: 'Bank of Eritrea 🏛️',
      descriptionTi: 'ብናይ ኤርትራ ማእከላይ ባንክ ወይ ዝተፈቐደሎም ትካላት ዝግበር ክፍሊት።',
    },
    {
      key: 'himbol',
      name: 'ሂምቦል ናይ ኤርትራውያን ሓዋላ (Himbol Remittance)',
      accountName: 'AXUMITE AI TECH HIMBOL',
      accountNumber: '01320987654',
      swift: 'HIMBERAS',
      branch: 'Himbol Financial Services Asmara',
      badge: 'Himbol 📱',
      descriptionTi: 'ብሂምቦል ናይ ወጻኢ ሃገራት ሓዋላን ናቕፋ ክፍሊትን ብቕልጡፍ መፈጸሚ ቑጽሪ የእትዉ።',
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

  useEffect(() => {
    if (user?.email) setCustomerEmail(user.email);
    if (user?.phoneNumber) setAccountNumber(user.phoneNumber);
  }, [user]);

  useEffect(() => {
    localStorage.setItem('axumite_subscription', JSON.stringify(subscription));
  }, [subscription]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyNotice(`ተቐዲሑ እዩ (Copied ${label}!): ${text}`);
    setTimeout(() => setCopyNotice(''), 3000);
  };

  const handleVerifyBankTransfer = async () => {
    setIsBankVerifying(true);
    setBankVerificationResult(null);
    setErrorMsg('');

    try {
      const response = await fetch('/api/payment/bank-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: selectedBankKey,
          accountNumber,
          referenceNumber: bankRefNumber,
          amount: `${bankDepositAmount} ETB`,
          customerEmail: customerEmail || user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Bank verification returned error status ' + response.status);
      }

      const data = await response.json();
      setBankVerificationResult(data);

      // Grant 100,000 Obelisk tokens upon direct bank verification
      const receipt: PaymentReceipt = {
        transactionId: data.referenceNumber,
        planName: `Bank Wire Credit (${data.bankName})`,
        amountPaid: data.amountVerified,
        currency: 'ETB',
        paymentMethod: `Direct Bank (${data.bankName})`,
        billing: 'One-Time Direct Deposit',
        tokensGranted: '100,000 Tokens',
        customerEmail: data.customerEmail,
        timestamp: data.timestamp,
        receiptUrl: `#receipt-${data.referenceNumber}`,
        status: 'VERIFIED_AND_CREDITED',
      };

      setSubscription((prev) => ({
        ...prev,
        tokensRemaining: prev.tokensRemaining + 100000,
        history: [receipt, ...prev.history],
      }));

      if (onSaveInsight) {
        onSaveInsight({
          title: `ናይ ባንክ ረሲት ቪሪፊኬሽን: ${data.bankName}`,
          type: 'payment',
          content: `${data.tigrinyaMessage}\nReference ID: ${data.referenceNumber}\nBank: ${data.bankName}\nAccount: ${data.officialAccountName}\nAmount Verified: ${data.amountVerified}`,
          tags: ['bank-transfer', 'verified', data.bankName],
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'ናይ ባንክ ቪሪፊኬሽን ኣይተዓወተን።');
    } finally {
      setIsBankVerifying(false);
    }
  };

  const handleRewardClaimed = (rewardAmount: number, taskTitle: string) => {
    setSubscription((prev) => ({
      ...prev,
      tokensRemaining: prev.tokensRemaining + rewardAmount,
      totalClickEarnings: (prev.totalClickEarnings || 0) + rewardAmount,
    }));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'AKSUM2026') {
      setPromoApplied(true);
      setErrorMsg('');
    } else {
      setErrorMsg('ፕሮሞ ኮድ ኣይተረኽበን። AKSUM2026 ን 20% ቅናሽ ተጠቐሙ።');
    }
  };

  const handleCheckout = async () => {
    setErrorMsg('');

    // Check Mobile Number & Email Verification status requirement
    const needsVerification = !user?.isPhoneVerified || !user?.isEmailVerified;
    if (needsVerification && onOpenAuthModal) {
      onOpenAuthModal(
        'verify',
        `ብባንክ ወይ ቴሌብር ንምኽፋል ናይ ሞባይል ስልኪ ወይ ኢሜይል ኦቲፒ (OTP Verification) የድሊ እዩ።`
      );
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          paymentMethod,
          selectedCurrency,
          accountNumber,
          promoCode: promoApplied ? 'AKSUM2026' : promoCode,
          customerEmail: customerEmail || 'sovereign@axumite.ai',
        }),
      });

      if (!response.ok) {
        throw new Error('Payment processing returned status ' + response.status);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const receipt: PaymentReceipt = {
        transactionId: data.transactionId,
        planName: data.planName,
        amountPaid: data.amountPaid,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        billing: data.billing,
        tokensGranted: data.tokensGranted,
        customerEmail: data.customerEmail,
        timestamp: data.timestamp,
        receiptUrl: data.receiptUrl,
        status: data.status,
      };

      setLastReceipt(receipt);

      const addedTokens = selectedPlan === 'sovereign-tier' ? 999999 : selectedPlan === 'neural-pass' ? 100000 : 50000;
      const newSub: UserSubscription = {
        activePlan: selectedPlan === 'token-vault' ? subscription.activePlan : selectedPlan,
        planName: data.planName,
        tokensRemaining: subscription.tokensRemaining + addedTokens,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        history: [receipt, ...subscription.history],
      };

      setSubscription(newSub);

      if (onSaveInsight) {
        onSaveInsight({
          title: `Payment Receipt: ${data.planName}`,
          type: 'payment',
          content: `Transaction ID: ${data.transactionId}\nPlan: ${data.planName}\nAmount Paid: ${data.amountPaid} ${data.currency}\nTokens Granted: ${data.tokensGranted}\nMethod: ${data.paymentMethod}\nStatus: ${data.status}`,
          tags: ['receipt', 'payment', selectedPlan],
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment simulation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Segmented Pill Navigation Bar */}
      <div className="bg-[#0A0A0C] p-1.5 rounded-full border border-[#8E6D28]/30 flex flex-wrap items-center justify-between gap-1 shadow-lg">
        <button
          onClick={() => setActiveSubTab('checkout')}
          className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'checkout'
              ? 'bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black shadow-md'
              : 'text-gray-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>ክፍሊትን ፕላንን</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bank-portal')}
          className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'bank-portal'
              ? 'bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black shadow-md'
              : 'text-gray-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>ናይ ባንክ ሕሳብ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pro-earnings')}
          className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'pro-earnings'
              ? 'bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black shadow-md'
              : 'text-gray-400 hover:text-slate-200'
          }`}
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>ፕሮ ክሊክ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'leaderboard'
              ? 'bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] text-black shadow-md'
              : 'text-gray-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>ሊደርቦርድ</span>
        </button>
      </div>

      {copyNotice && (
        <div className="bg-[#120F09] border border-[#C5A059] p-2 text-center text-xs text-[#F3E5AB] font-semibold animate-pulse">
          {copyNotice}
        </div>
      )}

      {/* SubTab 1: Direct Bank Transfer & SWIFT Portal */}
      {activeSubTab === 'bank-portal' ? (
        <div className="space-y-6">
          <div className="bg-[#060606] border border-[#8E6D28]/30 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#8E6D28]/20 pb-4">
              <div>
                <h3 className="serif-luxury text-sm font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#C5A059]" />
                  <span>ናይ ባንክ መፈጸሚ ቑጽሪ ሕሳብን ረሲትን (Direct Bank Transfer Directory)</span>
                </h3>
                <p className="text-xs text-gray-400 pt-1">
                  ኣብ ታሕቲ ካብ ዘለው ባንክታት ብሕሳብ ቑጽሪ ክፍሊት ፈጺምኩም ናይ መፈጸሚ ቑጽሪ (Reference Number / FT Code) ብምእታው ቶከንኩም ብኡኑኡ ኣረጋግጹ።
                </p>
              </div>

              <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>24/7 Bank Sync Active</span>
              </div>
            </div>

            {/* Bank Selector List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {BANK_DIRECTORY.map((bank) => (
                <div
                  key={bank.key}
                  onClick={() => setSelectedBankKey(bank.key as any)}
                  className={`cursor-pointer p-3.5 border transition-all text-left flex flex-col justify-between ${
                    selectedBankKey === bank.key
                      ? 'bg-[#141009] border-[#C5A059] stela-glow'
                      : 'bg-[#080808] border-[#8E6D28]/20 hover:border-[#8E6D28]/50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#C5A059] bg-[#8E6D28]/20 px-2 py-0.5 border border-[#8E6D28]/40">
                        {bank.badge}
                      </span>
                      {selectedBankKey === bank.key && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-xs font-bold text-slate-100">{bank.name}</div>
                    <div className="text-[10px] text-gray-400 leading-snug">{bank.descriptionTi}</div>
                  </div>

                  <div className="pt-2 border-t border-[#8E6D28]/15 mt-2 flex items-center justify-between text-[11px] text-[#F3E5AB] font-mono">
                    <span>Acc: {bank.accountNumber}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyText(bank.accountNumber, bank.name);
                      }}
                      className="p-1 hover:text-white"
                      title="Copy Account Number"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Bank Details Box */}
            {(() => {
              const currentBank = BANK_DIRECTORY.find((b) => b.key === selectedBankKey) || BANK_DIRECTORY[0];
              return (
                <div className="bg-[#0A0A0B] border border-[#8E6D28]/40 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-2">
                    <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest">
                      ዝተሓረየ ባንክ መረዳእታ (OFFICIAL BANK ACCOUNT DETAILS):
                    </div>
                    <div className="text-sm font-bold text-slate-100">{currentBank.name}</div>
                    <div className="text-gray-300">
                      <span className="text-gray-500">ሕሳብ ስም (Name):</span> <strong className="text-[#F3E5AB]">{currentBank.accountName}</strong>
                    </div>
                    <div className="text-gray-300 flex items-center space-x-2">
                      <span className="text-gray-500">ሕሳብ ቑጽሪ (Account No):</span>
                      <strong className="text-[#F3E5AB] text-sm">{currentBank.accountNumber}</strong>
                      <button
                        onClick={() => handleCopyText(currentBank.accountNumber, 'Account Number')}
                        className="p-1 bg-[#8E6D28]/20 border border-[#8E6D28]/40 text-[#C5A059] hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-gray-300 flex items-center space-x-2">
                      <span className="text-gray-500">SWIFT / BIC Code:</span>
                      <strong className="text-emerald-400">{currentBank.swift}</strong>
                      <button
                        onClick={() => handleCopyText(currentBank.swift, 'SWIFT Code')}
                        className="p-1 bg-[#8E6D28]/20 border border-[#8E6D28]/40 text-[#C5A059] hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-gray-400 text-[11px]">
                      <span className="text-gray-500">ጨንፈር (Branch):</span> {currentBank.branch}
                    </div>
                  </div>

                  {/* Verification Form */}
                  <div className="bg-[#050505] p-3 border border-[#8E6D28]/20 space-y-3 font-sans">
                    <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>ረሲት ምእታውን ምረጋገፅን (VERIFY BANK RECEIPT)</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-300 font-semibold uppercase">
                        ናይ ባንክ መፈጸሚ ረሲት ቑጽሪ (Reference / Code):
                      </label>
                      <input
                        type="text"
                        value={bankRefNumber}
                        onChange={(e) => setBankRefNumber(e.target.value)}
                        placeholder="e.g. ERN261029384 ወይ Bank Ref"
                        className="w-full bg-[#080808] border border-[#8E6D28]/30 focus:border-[#C5A059] p-2 text-xs text-slate-100 placeholder-gray-500 focus:outline-none uppercase font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-300 font-semibold uppercase">
                        ዝተኸፍለ መጠን ብ ናቕፋ (Amount Deposited ERN / USD):
                      </label>
                      <input
                        type="number"
                        value={bankDepositAmount}
                        onChange={(e) => setBankDepositAmount(e.target.value)}
                        placeholder="1250"
                        className="w-full bg-[#080808] border border-[#8E6D28]/30 focus:border-[#C5A059] p-2 text-xs text-slate-100 placeholder-gray-500 focus:outline-none font-mono"
                      />
                    </div>

                    <button
                      onClick={handleVerifyBankTransfer}
                      disabled={isBankVerifying}
                      className="w-full py-2.5 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] hover:brightness-110 disabled:opacity-40 text-black font-bold text-xs uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center space-x-1.5"
                    >
                      {isBankVerifying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                          <span>ኣብ ምረጋገፅ ይርከብ...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ናይ ባንክ ክፍሊት ኣረጋግጽ (Verify & Credit)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Verification Result Card */}
            {bankVerificationResult && (
              <div className="bg-[#080808] border border-emerald-500/50 p-4 space-y-2 text-xs stela-glow">
                <div className="flex items-center justify-between text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ናይ ባንክ ክፍሊት ብዓወት ተረጋጊጹ ኣሎ! (Bank Verified Successfully)</span>
                  </span>
                  <span>{bankVerificationResult.status}</span>
                </div>
                <p className="text-[#F3E5AB] font-semibold">{bankVerificationResult.tigrinyaMessage}</p>
                <div className="text-gray-400 text-[11px] font-mono grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20">
                  <div>ረሲት Reference: {bankVerificationResult.referenceNumber}</div>
                  <div>ባንክ: {bankVerificationResult.bankName}</div>
                  <div>ዝተረጋገፀ መጠን: {bankVerificationResult.amountVerified}</div>
                  <div>SWIFT: {bankVerificationResult.swiftCode}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeSubTab === 'pro-earnings' ? (
        <ProClickEarning
          subscription={subscription}
          onRewardClaimed={handleRewardClaimed}
          onSaveInsight={onSaveInsight}
          user={user}
          onOpenAuthModal={onOpenAuthModal}
        />
      ) : activeSubTab === 'leaderboard' ? (
        <GlobalCommunityLeaderboard
          subscription={subscription}
          onRewardClaimed={handleRewardClaimed}
          onSaveInsight={onSaveInsight}
        />
      ) : (
      /* Main Grid: Plans vs Checkout */
      <div className="space-y-5 max-w-lg mx-auto">
        
        {/* Top User Profile Header matching screenshot */}
        <div className="flex items-center space-x-3.5 px-2 py-1">
          <div className="w-14 h-14 rounded-full bg-[#E5A93C] text-[#120E05] font-black text-2xl flex items-center justify-center shadow-md shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              {user?.name || 'Bezabh Abrha'}
            </h1>
            <div className="text-xs text-slate-400 font-medium">
              {user?.email || 'beckylove2004@gmail.com'}
            </div>
            <div className="pt-0.5">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded border border-[#E5A93C]/50 bg-[#E5A93C]/10 text-[#E5A93C] text-[10px] font-extrabold uppercase tracking-wider">
                <Shield className="w-3 h-3 text-[#E5A93C]" />
                <span>ADMIN</span>
              </span>
            </div>
          </div>
        </div>

        {/* Exact "Upgrade to Premium" Payment Card Component matching user screenshot */}
        <div className="bg-[#13111E] border border-[#262035] rounded-[28px] p-5 sm:p-6 shadow-2xl space-y-5 text-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center space-x-2.5">
            <Crown className="w-5 h-5 text-[#E5A93C] shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Upgrade to Premium
            </h2>
          </div>

          {/* Plan Selector Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Monthly Card */}
            <div
              onClick={() => setPremiumBillingCycle('monthly')}
              className={`p-4 rounded-2xl cursor-pointer relative border flex flex-col justify-between transition-all ${
                premiumBillingCycle === 'monthly'
                  ? 'bg-[#191629] border-2 border-[#E5A93C] shadow-lg shadow-amber-500/10'
                  : 'bg-[#191629] border-[#2D2640] hover:border-[#3E3557]'
              }`}
            >
              {premiumBillingCycle === 'monthly' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#E5A93C] text-black flex items-center justify-center font-bold">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-200">Monthly</div>
                <div className="text-2xl font-black text-white tracking-tight">
                  $9.99<span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 pt-2">Billed monthly</div>
            </div>

            {/* Yearly Card (Default Selected) */}
            <div
              onClick={() => setPremiumBillingCycle('yearly')}
              className={`p-4 rounded-2xl cursor-pointer relative border flex flex-col justify-between transition-all ${
                premiumBillingCycle === 'yearly'
                  ? 'bg-[#191629] border-2 border-[#E5A93C] shadow-lg shadow-amber-500/10'
                  : 'bg-[#191629] border-[#2D2640] hover:border-[#3E3557]'
              }`}
            >
              {premiumBillingCycle === 'yearly' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#E5A93C] text-black flex items-center justify-center font-bold">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-200">Yearly</div>
                <div className="text-2xl font-black text-white tracking-tight">
                  $79.99<span className="text-xs font-normal text-slate-400">/yr</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 pt-2">Save 33%</div>
            </div>
          </div>

          {/* Payment Method Details Form matching screenshot */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#8C849B] uppercase tracking-wider text-[11px]">
                PAYMENT METHOD
              </span>
              <button
                type="button"
                onClick={() => {
                  setCardEntryNumber('4242 5678 9012 3456');
                }}
                className="text-[#E5A93C] font-semibold hover:underline cursor-pointer flex items-center space-x-0.5"
              >
                <span>+ Add new</span>
              </button>
            </div>

            {/* Card Form Container */}
            <div className="space-y-3.5">
              {/* Card Number Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#8C849B] uppercase tracking-wider block">
                  CARD NUMBER
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardEntryNumber}
                    onChange={(e) => setCardEntryNumber(e.target.value)}
                    className="w-full bg-[#181527] border border-[#302844] focus:border-[#E5A93C] rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                  />
                  <div className="absolute right-3.5 text-slate-400 pointer-events-none">
                    <CreditCard className="w-5 h-5 stroke-[1.8]" />
                  </div>
                </div>
              </div>

              {/* Name on Card Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#8C849B] uppercase tracking-wider block">
                  NAME ON CARD
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  defaultValue={user?.name || ''}
                  className="w-full bg-[#181527] border border-[#302844] focus:border-[#E5A93C] rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Expiry & CVC Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#8C849B] uppercase tracking-wider block">
                    EXPIRY
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-[#181527] border border-[#302844] focus:border-[#E5A93C] rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#8C849B] uppercase tracking-wider block">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-[#181527] border border-[#302844] focus:border-[#E5A93C] rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons: Cancel and Save Card */}
              <div className="flex items-center space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCardEntryNumber('')}
                  className="px-6 py-2.5 rounded-xl bg-[#1D192E] border border-[#372E4E] text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!cardEntryNumber) setCardEntryNumber('4242 5678 9012 3456');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#7D6021] hover:bg-[#967428] text-[#F3E5AB] font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Card</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Subscribe & Pay */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8E6D28] via-[#A88230] to-[#8E6D28] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-[#120E05] font-black text-base tracking-tight shadow-xl shadow-amber-500/15 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Crown className="w-5 h-5 text-[#120E05] fill-black/20" />
              <span>
                {isProcessing
                  ? 'Processing Payment...'
                  : `Subscribe & Pay ${premiumBillingCycle === 'yearly' ? '$79.99' : '$9.99'}`}
              </span>
            </button>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-200">
              {errorMsg}
            </div>
          )}

          {/* Last Receipt Notification */}
          {lastReceipt && (
            <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 space-y-1">
              <div className="font-bold flex items-center space-x-1 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Payment Successful! Receipt #{lastReceipt.transactionId}</span>
              </div>
              <div>Plan: {lastReceipt.planName} · Paid: ${lastReceipt.amountPaid}</div>
            </div>
          )}

        </div>
      </div>
      )}

      {/* Global Pricing & Subscription Management Modal */}
      <PricingPlanComparisonModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        user={user}
      />
    </div>
  );
};
