import React, { useState } from 'react';
import { PaymentTransaction } from '../types';
import { 
  CreditCard, DollarSign, ArrowUpRight, TrendingUp, Search, Filter, 
  Download, CheckCircle2, Clock, AlertCircle, RotateCcw, FileText, 
  Tag, Plus, Trash2, Printer, ShieldCheck, Eye, Coins, Sparkles, Building2, Smartphone, Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AdminRevenueChurnChart } from './AdminRevenueChurnChart';
import { getStoredAppConfig } from '../lib/permissions';
import { exportPaymentsToCSV, exportPaymentsToPDF } from '../utils/adminDataExport';

interface PromoCode {
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Disabled';
}

const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-001',
    transactionId: 'AXM-TX-1786611018500-5187',
    userId: 'usr-axm-001',
    customerName: 'Amanuel Tesfay',
    customerEmail: 'amanuel.t@axumite.ai',
    planName: 'Neural Monolith Pass',
    billingCycle: 'Monthly',
    amount: 735,
    currency: 'ERN',
    paymentMethod: 'Commercial Bank of Eritrea',
    status: 'Completed',
    timestamp: '2026-08-13T14:30:00Z',
    tokensCredited: 100000,
    invoiceNumber: 'INV-AXM-2026-0891',
    notes: 'Direct Bank confirmation processed via Asmara central node.'
  },
  {
    id: 'tx-002',
    transactionId: 'AXM-TX-1786608429150-9048',
    userId: 'usr-axm-002',
    customerName: 'Senait Gebrekidan',
    customerEmail: 'senait.g@heritage.er',
    planName: 'Sovereign Enterprise',
    billingCycle: 'Annual',
    amount: 2985,
    currency: 'ERN',
    paymentMethod: 'Bank of Eritrea (BOE)',
    status: 'Completed',
    timestamp: '2026-08-13T10:15:00Z',
    tokensCredited: 1000000,
    invoiceNumber: 'INV-AXM-2026-0890',
    notes: 'BOE clearance verified.'
  },
  {
    id: 'tx-003',
    transactionId: 'AXM-TX-1786594210091-2311',
    userId: 'usr-axm-003',
    customerName: 'Bereket Yohannes',
    customerEmail: 'bereket.y@diaspora.org',
    planName: 'Neural Monolith Pass',
    billingCycle: 'Monthly',
    amount: 49,
    currency: 'USD',
    paymentMethod: 'Google Pay',
    status: 'Completed',
    timestamp: '2026-08-12T18:40:00Z',
    tokensCredited: 100000,
    invoiceNumber: 'INV-AXM-2026-0889'
  },
  {
    id: 'tx-004',
    transactionId: 'AXM-TX-1786571192801-4402',
    userId: 'usr-axm-004',
    customerName: 'Helen Mehari',
    customerEmail: 'helen.m@stockholm-tech.se',
    planName: 'Token Vault Refill (50k)',
    billingCycle: 'One-time',
    amount: 19,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    timestamp: '2026-08-11T09:20:00Z',
    tokensCredited: 50000,
    invoiceNumber: 'INV-AXM-2026-0888'
  },
  {
    id: 'tx-005',
    transactionId: 'AXM-TX-1786550912190-7714',
    userId: 'usr-axm-005',
    customerName: 'Yemane Berhe',
    customerEmail: 'yemane.b@dmv-diaspora.us',
    planName: 'Sovereign Enterprise',
    billingCycle: 'Monthly',
    amount: 199,
    currency: 'USD',
    paymentMethod: 'SWIFT Wire',
    status: 'Completed',
    timestamp: '2026-08-10T16:05:00Z',
    tokensCredited: 500000,
    invoiceNumber: 'INV-AXM-2026-0887'
  },
  {
    id: 'tx-006',
    transactionId: 'AXM-TX-1786538910244-1189',
    userId: 'usr-axm-006',
    customerName: 'Rahel Abraham',
    customerEmail: 'rahel.a@gmail.com',
    planName: 'Neural Monolith Pass',
    billingCycle: 'Monthly',
    amount: 735,
    currency: 'ERN',
    paymentMethod: 'Himbol Transfer',
    status: 'Pending',
    timestamp: '2026-08-09T11:50:00Z',
    tokensCredited: 0,
    invoiceNumber: 'INV-AXM-2026-0886',
    notes: 'Awaiting Himbol slip validation.'
  },
  {
    id: 'tx-007',
    transactionId: 'AXM-TX-1786510492811-3392',
    userId: 'usr-axm-007',
    customerName: 'Daniel Habte',
    customerEmail: 'daniel.habte@frankfurt.de',
    planName: 'Token Vault Refill (50k)',
    billingCycle: 'One-time',
    amount: 285,
    currency: 'ERN',
    paymentMethod: 'Nakfa Digital Pay',
    status: 'Refunded',
    timestamp: '2026-08-07T14:10:00Z',
    tokensCredited: 0,
    invoiceNumber: 'INV-AXM-2026-0885',
    notes: 'Refund requested due to duplicate order.'
  }
];

const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    code: 'AKSUM2026',
    discountPercent: 20,
    maxUses: 500,
    usedCount: 142,
    expiryDate: '2026-12-31',
    status: 'Active'
  },
  {
    code: 'SOVEREIGN_SCHOLAR',
    discountPercent: 35,
    maxUses: 100,
    usedCount: 28,
    expiryDate: '2026-10-01',
    status: 'Active'
  },
  {
    code: 'ERITREA_PRO_50',
    discountPercent: 50,
    maxUses: 200,
    usedCount: 89,
    expiryDate: '2026-09-15',
    status: 'Active'
  }
];

export const PaymentManagementView: React.FC = () => {
  const { language } = useLanguage();
  
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('axumite_payment_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('axumite_promo_codes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROMO_CODES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  
  // Modals & subviews
  const [activeSubTab, setActiveSubTab] = useState<'transactions' | 'promos' | 'pricing' | 'mrr_churn'>('transactions');
  const [viewingReceipt, setViewingReceipt] = useState<PaymentTransaction | null>(null);
  const [refundTarget, setRefundTarget] = useState<PaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discountPercent: 20,
    maxUses: 100,
    expiryDate: '2026-12-31'
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const saveTransactions = (updated: PaymentTransaction[]) => {
    setTransactions(updated);
    try {
      localStorage.setItem('axumite_payment_transactions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const savePromoCodes = (updated: PromoCode[]) => {
    setPromoCodes(updated);
    try {
      localStorage.setItem('axumite_promo_codes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || tx.paymentMethod === methodFilter;
    const matchesCurrency = currencyFilter === 'all' || tx.currency === currencyFilter;
    return matchesSearch && matchesStatus && matchesMethod && matchesCurrency;
  });

  // KPI Calculations
  const completedTxs = transactions.filter(t => t.status === 'Completed');
  const totalVolumeUSD = completedTxs.reduce((sum, t) => {
    if (t.currency === 'USD') return sum + t.amount;
    if (t.currency === 'ERN') return sum + (t.amount / 15);
    return sum + (t.amount / 120);
  }, 0);

  const totalVolumeERN = completedTxs.reduce((sum, t) => {
    if (t.currency === 'ERN') return sum + t.amount;
    if (t.currency === 'USD') return sum + (t.amount * 15);
    return sum;
  }, 0);

  const totalTokensIssued = completedTxs.reduce((sum, t) => sum + t.tokensCredited, 0);

  // Actions
  const handleApprovePending = (txId: string) => {
    const updated = transactions.map((t) => {
      if (t.id === txId) {
        return { ...t, status: 'Completed' as const, tokensCredited: 100000 };
      }
      return t;
    });
    saveTransactions(updated);
    showToast('Transaction confirmed and tokens released to customer.');
  };

  const handleProcessRefund = () => {
    if (!refundTarget) return;
    const updated = transactions.map((t) => {
      if (t.id === refundTarget.id) {
        return { 
          ...t, 
          status: 'Refunded' as const, 
          tokensCredited: 0,
          notes: `Refunded: ${refundReason || 'Customer requested'}` 
        };
      }
      return t;
    });
    saveTransactions(updated);
    setRefundTarget(null);
    setRefundReason('');
    showToast(`Refund processed for ${refundTarget.transactionId}.`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code) return;
    const item: PromoCode = {
      code: newPromo.code.toUpperCase().trim(),
      discountPercent: Number(newPromo.discountPercent),
      maxUses: Number(newPromo.maxUses),
      usedCount: 0,
      expiryDate: newPromo.expiryDate,
      status: 'Active'
    };
    savePromoCodes([item, ...promoCodes]);
    setIsAddPromoOpen(false);
    showToast(`Promo code ${item.code} created successfully.`);
  };

  const handleTogglePromoStatus = (code: string) => {
    const updated = promoCodes.map((p) => {
      if (p.code === code) {
        const next = p.status === 'Active' ? 'Disabled' : 'Active';
        return { ...p, status: next as any };
      }
      return p;
    });
    savePromoCodes(updated);
    showToast('Promo code status changed.');
  };

  const handleExportCSV = () => {
    exportPaymentsToCSV(transactions);
    showToast('Financial transactions exported as CSV.');
  };

  const handleExportPDF = () => {
    exportPaymentsToPDF(transactions);
    showToast('Payment summary report generated as PDF.');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#161424] border border-[#C5A059] text-[#F3E5AB] px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-gradient-to-r from-[#120F1D] via-[#0E0C17] to-[#0A0812] border border-[#8E6D28]/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <CreditCard className="w-6 h-6 text-[#E1C47D]" />
              <h1 className="text-xl sm:text-2xl font-black font-cinzel metallic-gold-shimmer tracking-wide">
                {language === 'ti' ? 'ናይ ክፍሊት ምሕደራ (PAYMENT OPERATIONS)' : 'PAYMENT & FINANCIAL MANAGEMENT'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'ti'
                ? 'ምሕደራ ዲጂታል ክፍሊታት፡ ባንክታት ትግራይ፡ ቅናሽ ፕሮሞታት ከምኡ ውን ሰነዳት ረሲት።'
                : 'Comprehensive financial governance, transaction ledger, local banking clearance, and promo campaigns.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-[#1A162B] hover:bg-[#25203D] border border-amber-500/40 hover:border-amber-400 text-amber-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-md active:scale-95"
              title="Export Transactions as CSV Spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/50 hover:border-[#C5A059] text-[#F3E5AB] text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-md active:scale-95"
              title="Export Financial Summary as Official PDF Report"
            >
              <FileText className="w-3.5 h-3.5 text-[#E1C47D]" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => {
                setActiveSubTab('promos');
                setIsAddPromoOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:brightness-110 flex items-center space-x-2 cursor-pointer shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>New Promo Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Financial Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>Total Revenue (USD Equiv.)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
            ${totalVolumeUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            Across all international & local gateways
          </div>
        </div>

        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>Local Volume (ERN)</span>
            <TrendingUp className="w-4 h-4 text-[#E1C47D]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#F3E5AB] font-mono">
            {totalVolumeERN.toLocaleString()} <span className="text-xs font-sans text-[#C5A059]">ERN</span>
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center space-x-1">
            <span>Bank of Eritrea & CBE Clearing</span>
          </div>
        </div>

        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>Successful Transactions</span>
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {completedTxs.length} <span className="text-xs text-slate-400 font-normal">/ {transactions.length}</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            {Math.round((completedTxs.length / transactions.length) * 100)}% settlement rate
          </div>
        </div>

        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>Tokens Minted</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-300 font-mono">
            {(totalTokensIssued / 1000).toFixed(0)}k
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            Allocated to active subscribers
          </div>
        </div>

      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#8E6D28]/30 pb-2">
        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'transactions'
              ? 'bg-[#1D1830] text-[#F3E5AB] border border-[#C5A059]/60 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#E1C47D]" />
          <span>Transactions & Settlements ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('promos')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'promos'
              ? 'bg-[#1D1830] text-[#F3E5AB] border border-[#C5A059]/60 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-400" />
          <span>Promo Campaigns & Discounts ({promoCodes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pricing')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'pricing'
              ? 'bg-[#1D1830] text-[#F3E5AB] border border-[#C5A059]/60 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Tier Pricing Configuration</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mrr_churn')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'mrr_churn'
              ? 'bg-[#1D1830] text-[#F3E5AB] border border-[#C5A059]/60 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>MRR & Churn Trends (6 Mo)</span>
        </button>
      </div>

      {/* SubTab 1: Transactions Ledger */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-4">
          
          {/* Filters */}
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 shadow-md flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#C5A059] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transaction ID, customer, invoice..."
                className="w-full bg-[#120F1E] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
              <div className="flex items-center space-x-1.5 bg-[#120F1E] border border-[#8E6D28]/40 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-[11px] font-semibold text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-[#F3E5AB] font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-[#120F1E]">All Status</option>
                  <option value="Completed" className="bg-[#120F1E]">Completed</option>
                  <option value="Pending" className="bg-[#120F1E]">Pending</option>
                  <option value="Refunded" className="bg-[#120F1E]">Refunded</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#120F1E] border border-[#8E6D28]/40 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-[11px] font-semibold text-slate-400">Currency:</span>
                <select
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                  className="bg-transparent text-[#F3E5AB] font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-[#120F1E]">All Currencies</option>
                  <option value="ERN" className="bg-[#120F1E]">ERN (ናቕፋ)</option>
                  <option value="USD" className="bg-[#120F1E]">USD ($)</option>
                </select>
              </div>

              {(searchQuery || statusFilter !== 'all' || currencyFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setCurrencyFilter('all');
                  }}
                  className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 hover:text-white transition-all underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#120F1E] border-b border-[#8E6D28]/30 text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Transaction & Customer</th>
                    <th className="py-3.5 px-4">Plan & Tokens</th>
                    <th className="py-3.5 px-4">Gateway & Method</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8E6D28]/15">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No financial records found for current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#141022] transition-colors">
                        
                        {/* Transaction ID & Customer */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-[11px] text-[#F3E5AB] font-bold">
                            {tx.transactionId}
                          </div>
                          <div className="text-slate-300 font-semibold mt-0.5">
                            {tx.customerName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {tx.customerEmail} • {new Date(tx.timestamp).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{tx.planName}</div>
                          <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                            +{tx.tokensCredited.toLocaleString()} Tokens ({tx.billingCycle})
                          </div>
                        </td>

                        {/* Payment Method */}
                        <td className="py-3.5 px-4 text-[11px]">
                          <div className="flex items-center space-x-1.5 text-slate-200">
                            {tx.paymentMethod.includes('Bank') ? (
                              <Building2 className="w-3.5 h-3.5 text-amber-400" />
                            ) : tx.paymentMethod.includes('Pay') || tx.paymentMethod.includes('Himbol') ? (
                              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                            ) : (
                              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                            )}
                            <span className="font-semibold">{tx.paymentMethod}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {tx.invoiceNumber}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#F3E5AB]">
                          {tx.amount.toLocaleString()} {tx.currency}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'Completed'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                              : tx.status === 'Pending'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                          }`}>
                            {tx.status === 'Completed' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : tx.status === 'Pending' ? (
                              <Clock className="w-3 h-3 text-amber-400" />
                            ) : (
                              <RotateCcw className="w-3 h-3 text-rose-400" />
                            )}
                            <span>{tx.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setViewingReceipt(tx)}
                              className="p-1.5 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 text-[#F3E5AB] rounded-lg transition-all cursor-pointer"
                              title="View Sovereign Invoice"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {tx.status === 'Pending' && (
                              <button
                                onClick={() => handleApprovePending(tx.id)}
                                className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                title="Approve Payment"
                              >
                                Approve
                              </button>
                            )}

                            {tx.status === 'Completed' && (
                              <button
                                onClick={() => setRefundTarget(tx)}
                                className="p-1.5 bg-[#1A162B] hover:bg-rose-950/40 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-300 rounded-lg transition-all cursor-pointer"
                                title="Process Refund"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Promo Codes */}
      {activeSubTab === 'promos' && (
        <div className="space-y-4">
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-5 shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Active Promotional Discounts</h3>
              <p className="text-xs text-slate-400">Manage campaign codes, usage limits, and redemption statistics.</p>
            </div>
            <button
              onClick={() => setIsAddPromoOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-bold text-xs rounded-xl hover:brightness-110 cursor-pointer shadow-md"
            >
              + Create Campaign Code
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promoCodes.map((p) => (
              <div key={p.code} className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-[#F3E5AB] bg-[#171328] px-2.5 py-1 border border-[#8E6D28]/50 rounded-lg">
                    {p.code}
                  </span>
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    {p.discountPercent}% OFF
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Redemptions:</span>
                    <span className="font-bold text-white">{p.usedCount} / {p.maxUses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valid Until:</span>
                    <span className="font-mono text-slate-300">{p.expiryDate}</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-[#171424] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#8E6D28] to-[#C5A059]" 
                    style={{ width: `${(p.usedCount / p.maxUses) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#8E6D28]/20">
                  <span className={`text-[10px] font-bold ${p.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {p.status}
                  </span>
                  <button
                    onClick={() => handleTogglePromoStatus(p.code)}
                    className="text-[10px] text-[#C5A059] hover:underline font-bold cursor-pointer"
                  >
                    {p.status === 'Active' ? 'Disable Code' : 'Enable Code'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: Pricing Configuration */}
      {activeSubTab === 'pricing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-5 space-y-4 shadow-md">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tier 1</div>
            <h3 className="text-base font-bold text-white font-cinzel">Free Heritage Tier</h3>
            <div className="text-2xl font-mono font-bold text-[#F3E5AB]">$0 <span className="text-xs text-slate-400">/ forever</span></div>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-[#8E6D28]/20 pt-3">
              <li>✓ 5,000 Obelisk Tokens</li>
              <li>✓ Basic Tigrinya / Ge'ez translation</li>
              <li>✓ Offline local caching</li>
            </ul>
          </div>

          <div className="bg-[#0D0A1C] border-2 border-[#C5A059] rounded-xl p-5 space-y-4 shadow-xl relative">
            <span className="absolute -top-3 right-4 px-2 py-0.5 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-bold text-[9px] uppercase tracking-widest rounded-full">
              Recommended
            </span>
            <div className="text-xs text-[#E1C47D] uppercase font-bold tracking-wider">Tier 2</div>
            <h3 className="text-base font-bold text-white font-cinzel metallic-gold-shimmer">Neural Monolith Pass</h3>
            <div className="text-2xl font-mono font-bold text-[#F3E5AB]">735 ERN <span className="text-xs text-slate-400">($49/mo)</span></div>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-[#8E6D28]/20 pt-3">
              <li>✓ 100,000 Obelisk Tokens</li>
              <li>✓ Gemini 3.6 Flash & Pro Engines</li>
              <li>✓ Live AI Voice Assistant</li>
              <li>✓ Android APK & PWA Sync</li>
            </ul>
          </div>

          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-5 space-y-4 shadow-md">
            <div className="text-xs text-purple-400 uppercase font-bold tracking-wider">Tier 3</div>
            <h3 className="text-base font-bold text-white font-cinzel">Sovereign Enterprise</h3>
            <div className="text-2xl font-mono font-bold text-[#F3E5AB]">2,985 ERN <span className="text-xs text-slate-400">($199/mo)</span></div>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-[#8E6D28]/20 pt-3">
              <li>✓ 1,000,000 Obelisk Tokens</li>
              <li>✓ Dedicated Model Fine-Tuning</li>
              <li>✓ 24/7 Sovereign Scholar Desk</li>
              <li>✓ Enterprise SLA Guarantee</li>
            </ul>
          </div>

        </div>
      )}

      {/* SubTab 4: MRR & Churn Rate Trends (6 Mo) */}
      {activeSubTab === 'mrr_churn' && (
        <div className="space-y-4 animate-fade-in">
          <AdminRevenueChurnChart customThreshold={getStoredAppConfig().churnThreshold ?? 3.0} />
        </div>
      )}

      {/* Invoice / Receipt View Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B18] border border-[#C5A059] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-[#8E6D28]/30 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#E1C47D]" />
                <h3 className="text-base font-bold font-cinzel metallic-gold-shimmer">
                  Sovereign Digital Receipt
                </h3>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#141122] p-4 rounded-xl border border-[#8E6D28]/30 text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Invoice:</span>
                <span className="text-[#F3E5AB] font-bold">{viewingReceipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-slate-200 text-[10px]">{viewingReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-slate-200 font-sans">{viewingReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="text-white font-sans font-bold">{viewingReceipt.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="text-amber-300 font-sans">{viewingReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-emerald-400 pt-2 border-t border-slate-700/50">
                <span>Amount Paid:</span>
                <span>{viewingReceipt.amount.toLocaleString()} {viewingReceipt.currency}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 text-[#F3E5AB] text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B18] border border-rose-600/60 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-rose-300 flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <span>Confirm Refund Process</span>
            </h3>
            <p className="text-xs text-slate-300">
              You are about to refund <strong className="text-[#F3E5AB]">{refundTarget.amount} {refundTarget.currency}</strong> to <strong>{refundTarget.customerName}</strong>.
            </p>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Reason for refund:</label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Duplicate order / customer request"
                className="w-full bg-[#151226] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRefundTarget(null)}
                className="px-4 py-2 bg-[#1A162B] text-slate-300 text-xs rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Promo Modal */}
      {isAddPromoOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B18] border border-[#C5A059] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#8E6D28]/30 pb-2">
              <h3 className="text-base font-bold font-cinzel metallic-gold-shimmer">
                Create Promo Campaign
              </h3>
              <button onClick={() => setIsAddPromoOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Promo Code String</label>
                <input
                  type="text"
                  required
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                  placeholder="e.g. ASMARA2026"
                  className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-2.5 text-white font-mono uppercase focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Discount %</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={newPromo.discountPercent}
                    onChange={(e) => setNewPromo({ ...newPromo, discountPercent: Number(e.target.value) })}
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Max Uses</label>
                  <input
                    type="number"
                    value={newPromo.maxUses}
                    onChange={(e) => setNewPromo({ ...newPromo, maxUses: Number(e.target.value) })}
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Expiration Date</label>
                <input
                  type="date"
                  value={newPromo.expiryDate}
                  onChange={(e) => setNewPromo({ ...newPromo, expiryDate: e.target.value })}
                  className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPromoOpen(false)}
                  className="px-4 py-2 bg-[#1A162B] text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-bold uppercase rounded-xl"
                >
                  Publish Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
