import React, { useState } from 'react';
import { CustomerRecord, CustomerTicket } from '../types';
import { 
  HeartHandshake, Users, MessageSquare, Star, Sparkles, Search, 
  Filter, Download, Plus, Mail, Smartphone, MapPin, Tag, CheckCircle2, 
  Clock, AlertTriangle, Send, MoreVertical, Edit3, Trash2, Shield, 
  Award, RefreshCw, ThumbsUp, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'crm-001',
    name: 'Dr. Tedros Weldeab',
    email: 'tedros.w@oxford-heritage.ac.uk',
    phone: '+44 7700 900123',
    country: 'United Kingdom (Oxford)',
    companyOrOrganization: 'Axumite Heritage & Ge\'ez Manuscript Foundation',
    tier: 'VIP Scholar',
    lifecycleStage: 'VIP',
    totalSpendUSD: 1450,
    tokensUsed: 420000,
    healthScore: 'Excellent',
    totalInquiries: 3,
    satisfactionRating: 5.0,
    lastContactDate: '2026-08-12',
    assignedManager: 'Dr. Amanuel (Heritage Lead)',
    tags: ['Ancient Script Scholar', 'VIP', 'High LTV', 'Ge\'ez OCR'],
    notes: ['Leading Ge\'ez manuscript digitisation project. Requested custom batch OCR API.']
  },
  {
    id: 'crm-002',
    name: 'Saba Tekle',
    email: 'saba.t@asmara-tech.er',
    phone: '+291 7 345 678',
    country: 'Eritrea (Asmara)',
    companyOrOrganization: 'Red Sea Software Innovations',
    tier: 'Enterprise',
    lifecycleStage: 'Active Customer',
    totalSpendUSD: 796,
    tokensUsed: 210000,
    healthScore: 'Excellent',
    totalInquiries: 5,
    satisfactionRating: 4.8,
    lastContactDate: '2026-08-10',
    assignedManager: 'Bilen Y. (Account Executive)',
    tags: ['Enterprise', 'Local Eritrean Biz', 'Bank of Eritrea API'],
    notes: ['Integrating Axumite AI into local banking software for Tigrinya voice assistance.']
  },
  {
    id: 'crm-003',
    name: 'Kibreab Ghebrehiwet',
    email: 'kibreab.g@seattle-diaspora.org',
    phone: '+1 206 555 7890',
    country: 'USA (Seattle)',
    companyOrOrganization: 'Eritrean Diaspora Community Center',
    tier: 'Pro',
    lifecycleStage: 'Active Customer',
    totalSpendUSD: 196,
    tokensUsed: 84000,
    healthScore: 'Good',
    totalInquiries: 2,
    satisfactionRating: 4.5,
    lastContactDate: '2026-08-08',
    assignedManager: 'Merhawi G.',
    tags: ['Diaspora Community', 'Education', 'Language Learning'],
    notes: ['Uses Tigrinya & Ge\'ez tools for youth cultural literacy classes.']
  },
  {
    id: 'crm-004',
    name: 'Filmon Estifanos',
    email: 'filmon.e@gmail.com',
    phone: '+46 8 123 4567',
    country: 'Sweden (Stockholm)',
    tier: 'Free',
    lifecycleStage: 'Trial',
    totalSpendUSD: 0,
    tokensUsed: 4950,
    healthScore: 'Fair',
    totalInquiries: 1,
    satisfactionRating: 4.0,
    lastContactDate: '2026-08-04',
    assignedManager: 'Self-Serve',
    tags: ['Trial User', 'Potential Pro'],
    notes: ['Approaching token ceiling. Follow up with promo code AKSUM2026.']
  },
  {
    id: 'crm-005',
    name: 'Aster Beraki',
    email: 'aster.b@toronto-creative.ca',
    phone: '+1 416 555 0184',
    country: 'Canada (Toronto)',
    companyOrOrganization: 'Habesha Creative Media',
    tier: 'Pro',
    lifecycleStage: 'At Risk',
    totalSpendUSD: 98,
    tokensUsed: 12000,
    healthScore: 'At Risk',
    totalInquiries: 4,
    satisfactionRating: 3.2,
    lastContactDate: '2026-07-28',
    assignedManager: 'Merhawi G.',
    tags: ['Media Producer', 'Voice Sync Issue', 'Needs Outreach'],
    notes: ['Reported latency in Tigrinya audio TTS. Needs outreach from technical team.']
  }
];

const INITIAL_TICKETS: CustomerTicket[] = [
  {
    id: 'tkt-001',
    ticketNumber: 'TKT-2026-019',
    customerId: 'crm-001',
    customerName: 'Dr. Tedros Weldeab',
    customerEmail: 'tedros.w@oxford-heritage.ac.uk',
    subject: 'Batch OCR recognition for 14th Century Ge\'ez Vellum Manuscripts',
    category: 'Ge\'ez Script Support',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2026-08-13T09:00:00Z',
    updatedAt: '2026-08-14T08:30:00Z',
    messagesCount: 4,
    lastResponse: 'Engineering team fine-tuning ancient paleographic recognition weights.'
  },
  {
    id: 'tkt-002',
    ticketNumber: 'TKT-2026-018',
    customerId: 'crm-005',
    customerName: 'Aster Beraki',
    customerEmail: 'aster.b@toronto-creative.ca',
    subject: 'Voice Assistant audio buffer latency on mobile browser',
    category: 'AI Model Query',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2026-08-12T15:20:00Z',
    updatedAt: '2026-08-12T15:20:00Z',
    messagesCount: 1,
    lastResponse: 'Ticket received by customer success desk.'
  },
  {
    id: 'tkt-003',
    ticketNumber: 'TKT-2026-017',
    customerId: 'crm-002',
    customerName: 'Saba Tekle',
    customerEmail: 'saba.t@asmara-tech.er',
    subject: 'Bank of Eritrea wire confirmation and invoice receipt verification',
    category: 'Billing & Payments',
    priority: 'High',
    status: 'Resolved',
    createdAt: '2026-08-10T11:00:00Z',
    updatedAt: '2026-08-10T14:15:00Z',
    messagesCount: 3,
    lastResponse: 'BOE wire confirmed and annual receipt INV-AXM-2026-0890 delivered.'
  }
];

export const CustomerManagementView: React.FC = () => {
  const { language } = useLanguage();
  
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('axumite_crm_customers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CUSTOMERS;
  });

  const [tickets, setTickets] = useState<CustomerTicket[]>(() => {
    try {
      const saved = localStorage.getItem('axumite_crm_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TICKETS;
  });

  const [activeTab, setActiveTab] = useState<'directory' | 'tickets' | 'insights'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  
  // Modals & Details
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<CustomerTicket | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [newCustomerNote, setNewCustomerNote] = useState('');

  // Add Customer Form
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Eritrea (Asmara)',
    company: '',
    tier: 'Pro' as CustomerRecord['tier'],
    lifecycleStage: 'Lead' as CustomerRecord['lifecycleStage'],
    assignedManager: 'Amanuel T.'
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const saveCustomers = (updated: CustomerRecord[]) => {
    setCustomers(updated);
    try {
      localStorage.setItem('axumite_crm_customers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveTickets = (updated: CustomerTicket[]) => {
    setTickets(updated);
    try {
      localStorage.setItem('axumite_crm_tickets', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.companyOrOrganization && c.companyOrOrganization.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTier = tierFilter === 'all' || c.tier === tierFilter;
    const matchesStage = stageFilter === 'all' || c.lifecycleStage === stageFilter;
    const matchesHealth = healthFilter === 'all' || c.healthScore === healthFilter;
    return matchesSearch && matchesTier && matchesStage && matchesHealth;
  });

  // Actions
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.email) return;

    const item: CustomerRecord = {
      id: `crm-${Date.now().toString().slice(-4)}`,
      name: newCustomerForm.name,
      email: newCustomerForm.email,
      phone: newCustomerForm.phone,
      country: newCustomerForm.country,
      companyOrOrganization: newCustomerForm.company,
      tier: newCustomerForm.tier,
      lifecycleStage: newCustomerForm.lifecycleStage,
      totalSpendUSD: 0,
      tokensUsed: 0,
      healthScore: 'Good',
      totalInquiries: 0,
      satisfactionRating: 5.0,
      lastContactDate: new Date().toISOString().split('T')[0],
      assignedManager: newCustomerForm.assignedManager,
      tags: ['New Lead'],
      notes: ['Account provisioned via Customer Management Desk.']
    };

    saveCustomers([item, ...customers]);
    setIsAddCustomerOpen(false);
    showToast(`Customer "${item.name}" registered in CRM.`);
  };

  const handleAddNoteToCustomer = (customerId: string) => {
    if (!newCustomerNote.trim()) return;
    const updated = customers.map((c) => {
      if (c.id === customerId) {
        return {
          ...c,
          notes: [newCustomerNote.trim(), ...c.notes],
          lastContactDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    });
    saveCustomers(updated);
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer({
        ...selectedCustomer,
        notes: [newCustomerNote.trim(), ...selectedCustomer.notes],
        lastContactDate: new Date().toISOString().split('T')[0]
      });
    }
    setNewCustomerNote('');
    showToast('Customer interaction note logged.');
  };

  const handleGiftTokens = (customerId: string, amount: number) => {
    const updated = customers.map((c) => {
      if (c.id === customerId) {
        return {
          ...c,
          notes: [`Gifted +${amount.toLocaleString()} bonus tokens via admin desk.`, ...c.notes]
        };
      }
      return c;
    });
    saveCustomers(updated);
    showToast(`Gifted +${amount.toLocaleString()} bonus tokens to customer.`);
  };

  const handleReplyTicket = (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'In Progress' as const,
          messagesCount: t.messagesCount + 1,
          lastResponse: ticketReplyText.trim(),
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    saveTickets(updated);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: 'In Progress',
        messagesCount: selectedTicket.messagesCount + 1,
        lastResponse: ticketReplyText.trim(),
        updatedAt: new Date().toISOString()
      });
    }
    setTicketReplyText('');
    showToast('Response transmitted to customer ticket.');
  };

  const handleResolveTicket = (ticketId: string) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Resolved' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    saveTickets(updated);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: 'Resolved' });
    }
    showToast('Ticket marked as Resolved.');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Country', 'Company', 'Tier', 'Stage', 'Spend USD', 'Health', 'Satisfaction'];
    const rows = customers.map(c => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.phone}"`,
      `"${c.country}"`,
      `"${c.companyOrOrganization || 'Individual'}"`,
      c.tier,
      c.lifecycleStage,
      c.totalSpendUSD,
      c.healthScore,
      c.satisfactionRating
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `axumite_crm_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer CRM directory exported.');
  };

  // KPIs
  const totalCustomers = customers.length;
  const vipCustomersCount = customers.filter(c => c.tier === 'VIP Scholar' || c.tier === 'Enterprise').length;
  const avgSatisfaction = (customers.reduce((acc, c) => acc + c.satisfactionRating, 0) / (customers.length || 1)).toFixed(1);
  const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#161424] border border-[#C5A059] text-[#F3E5AB] px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#120F1D] via-[#0E0C17] to-[#0A0812] border border-[#8E6D28]/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <HeartHandshake className="w-6 h-6 text-[#E1C47D]" />
              <h1 className="text-xl sm:text-2xl font-black font-cinzel metallic-gold-shimmer tracking-wide">
                {language === 'ti' ? 'ናይ ዓማዊል ምሕደራ (CUSTOMER RELATIONS - CRM)' : 'CUSTOMER MANAGEMENT & CRM'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'ti'
                ? 'ምሕደራ ዓማዊል፡ 360° ፕሮፋይል፡ ሓገዝ ደገፍቲ ትኬት (Support Desk) ከምኡ ውን ርክባት ዲያስፖራን ውሽጢ ሃገርን።'
                : '360° Customer relationship management, support ticketing desk, scholar concierge, and satisfaction metrics.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 hover:border-[#C5A059] text-[#F3E5AB] text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-[#E1C47D]" />
              <span>Export CRM</span>
            </button>
            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:brightness-110 flex items-center space-x-2 cursor-pointer shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>New Customer Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* CRM KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>Customer Accounts</span>
            <Users className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {totalCustomers}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            Across 6 international regions
          </div>
        </div>

        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>VIP & Enterprise Accounts</span>
            <Award className="w-4 h-4 text-[#E1C47D]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#F3E5AB] font-mono">
            {vipCustomersCount}
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center space-x-1">
            <span>High LTV Institutional accounts</span>
          </div>
        </div>

        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>Customer CSAT Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-300 font-mono flex items-center space-x-1.5">
            <span>{avgSatisfaction}</span>
            <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            Based on direct user ratings
          </div>
        </div>

        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>Open Support Tickets</span>
            <MessageSquare className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-sky-400 font-mono">
            {openTicketsCount}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            Avg response time: 28 mins
          </div>
        </div>

      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-[#8E6D28]/30 pb-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-[#1D1830] text-[#F3E5AB] border border-[#C5A059]/60 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-[#E1C47D]" />
          <span>Customer Directory ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-[#1D1830] text-[#F3E5AB] border border-[#C5A059]/60 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-sky-400" />
          <span>Support Desk Tickets ({tickets.length})</span>
        </button>
      </div>

      {/* Tab 1: Customer Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          
          {/* Filters */}
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 shadow-md flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#C5A059] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers, organization, phone..."
                className="w-full bg-[#120F1E] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
              <div className="flex items-center space-x-1.5 bg-[#120F1E] border border-[#8E6D28]/40 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-[11px] font-semibold text-slate-400">Tier:</span>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="bg-transparent text-[#F3E5AB] font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-[#120F1E]">All Tiers</option>
                  <option value="VIP Scholar" className="bg-[#120F1E]">VIP Scholar</option>
                  <option value="Enterprise" className="bg-[#120F1E]">Enterprise</option>
                  <option value="Pro" className="bg-[#120F1E]">Pro</option>
                  <option value="Free" className="bg-[#120F1E]">Free</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#120F1E] border border-[#8E6D28]/40 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-[11px] font-semibold text-slate-400">Health:</span>
                <select
                  value={healthFilter}
                  onChange={(e) => setHealthFilter(e.target.value)}
                  className="bg-transparent text-[#F3E5AB] font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-[#120F1E]">All Health</option>
                  <option value="Excellent" className="bg-[#120F1E]">Excellent</option>
                  <option value="Good" className="bg-[#120F1E]">Good</option>
                  <option value="At Risk" className="bg-[#120F1E]">At Risk</option>
                </select>
              </div>

              {(searchQuery || tierFilter !== 'all' || healthFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setTierFilter('all');
                    setHealthFilter('all');
                  }}
                  className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 hover:text-white transition-all underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Customer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((c) => (
              <div 
                key={c.id}
                className="bg-[#0B0914] border border-[#8E6D28]/30 hover:border-[#C5A059]/60 rounded-xl p-5 space-y-4 shadow-md transition-all relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">{c.name}</h3>
                      {c.companyOrOrganization && (
                        <div className="text-[11px] text-[#E1C47D] font-medium mt-0.5">
                          {c.companyOrOrganization}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#C5A059]" />
                        <span>{c.country}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      c.tier === 'VIP Scholar'
                        ? 'bg-amber-900/30 border-amber-500/50 text-[#F3E5AB]'
                        : c.tier === 'Enterprise'
                        ? 'bg-purple-900/30 border-purple-500/40 text-purple-300'
                        : c.tier === 'Pro'
                        ? 'bg-blue-900/30 border-blue-500/40 text-blue-300'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400'
                    }`}>
                      {c.tier}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-[#120F1E] p-3 rounded-lg border border-[#8E6D28]/20 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Spend:</span>
                      <span className="text-emerald-400 font-bold">${c.totalSpendUSD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tokens Used:</span>
                      <span className="text-[#F3E5AB]">{(c.tokensUsed / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Health Score:</span>
                      <span className={`font-bold ${
                        c.healthScore === 'Excellent' ? 'text-emerald-400' :
                        c.healthScore === 'Good' ? 'text-sky-400' : 'text-rose-400'
                      }`}>
                        {c.healthScore}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-[#1A162B] text-slate-300 text-[9px] rounded-md border border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#8E6D28]/20 flex items-center justify-between text-xs">
                  <div className="text-[10px] text-slate-400">
                    Lead: <span className="text-slate-200">{c.assignedManager}</span>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(c)}
                    className="px-3 py-1 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 hover:border-[#C5A059] text-[#F3E5AB] font-bold rounded-lg transition-all cursor-pointer text-xs"
                  >
                    View 360° Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Support Desk Tickets */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#120F1E] border-b border-[#8E6D28]/30 text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Ticket & Customer</th>
                    <th className="py-3.5 px-4">Subject & Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Update</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8E6D28]/15">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-[#141022] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[#F3E5AB] font-bold">{t.ticketNumber}</div>
                        <div className="text-white font-semibold">{t.customerName}</div>
                        <div className="text-[10px] text-slate-400">{t.customerEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-200 truncate">{t.subject}</div>
                        <div className="text-[10px] text-amber-400 font-mono mt-0.5">{t.category}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.priority === 'High' || t.priority === 'Urgent'
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-600/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'Resolved'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                            : t.status === 'In Progress'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                            : 'bg-sky-950/60 text-sky-400 border border-sky-500/40'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[10px] text-slate-400 font-mono">
                        {new Date(t.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedTicket(t)}
                          className="px-3 py-1 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 text-[#F3E5AB] rounded-lg font-bold text-xs cursor-pointer"
                        >
                          Respond
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer 360 Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B18] border border-[#C5A059] rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#8E6D28]/30 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#1A162B] border border-[#C5A059] flex items-center justify-center text-[#F3E5AB] font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-cinzel metallic-gold-shimmer">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-[#141122] p-3 rounded-xl border border-[#8E6D28]/20">
                <div className="text-slate-400 text-[10px]">Tier & Lifecycle</div>
                <div className="font-bold text-[#F3E5AB] mt-0.5">{selectedCustomer.tier} ({selectedCustomer.lifecycleStage})</div>
              </div>
              <div className="bg-[#141122] p-3 rounded-xl border border-[#8E6D28]/20">
                <div className="text-slate-400 text-[10px]">Lifetime Spend</div>
                <div className="font-bold text-emerald-400 mt-0.5">${selectedCustomer.totalSpendUSD} USD</div>
              </div>
              <div className="bg-[#141122] p-3 rounded-xl border border-[#8E6D28]/20">
                <div className="text-slate-400 text-[10px]">Account Health</div>
                <div className="font-bold text-amber-300 mt-0.5">{selectedCustomer.healthScore} ({selectedCustomer.satisfactionRating} ★)</div>
              </div>
            </div>

            {/* Direct Admin Actions */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => handleGiftTokens(selectedCustomer.id, 25000)}
                className="px-3 py-1.5 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 text-[#F3E5AB] text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gift +25k Tokens</span>
              </button>
            </div>

            {/* Notes & Interaction Log */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Customer Interaction Notes
              </h4>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCustomerNote}
                  onChange={(e) => setNewCustomerNote(e.target.value)}
                  placeholder="Add note or log customer conversation..."
                  className="flex-1 bg-[#151226] border border-[#8E6D28]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={() => handleAddNoteToCustomer(selectedCustomer.id)}
                  className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Log Note
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedCustomer.notes.map((note, idx) => (
                  <div key={idx} className="bg-[#141122] p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Ticket Response Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B18] border border-[#C5A059] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#8E6D28]/30 pb-2">
              <div>
                <span className="font-mono text-xs text-[#F3E5AB] font-bold">{selectedTicket.ticketNumber}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedTicket.subject}</h3>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-[#141122] p-3 rounded-xl text-xs space-y-1.5 border border-slate-800">
              <div className="text-slate-400">Customer: <strong className="text-white">{selectedTicket.customerName}</strong> ({selectedTicket.customerEmail})</div>
              <div className="text-slate-400">Category: <strong className="text-amber-300">{selectedTicket.category}</strong> • Priority: <strong className="text-rose-400">{selectedTicket.priority}</strong></div>
              <div className="text-slate-400">Current Status: <strong className="text-emerald-400">{selectedTicket.status}</strong></div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-slate-300 font-semibold">Staff Response & Resolution:</label>
              <textarea
                rows={3}
                value={ticketReplyText}
                onChange={(e) => setTicketReplyText(e.target.value)}
                placeholder="Type response to transmit to customer..."
                className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#8E6D28]/30">
              <button
                onClick={() => handleResolveTicket(selectedTicket.id)}
                className="px-3.5 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Mark as Resolved ✓
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-3 py-2 bg-[#1A162B] text-slate-300 text-xs rounded-xl font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => handleReplyTicket(selectedTicket.id)}
                  className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Send Response
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Lead / Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B18] border border-[#C5A059] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#8E6D28]/30 pb-2">
              <h3 className="text-base font-bold font-cinzel metallic-gold-shimmer">
                Register Customer / Lead
              </h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="e.g. Almaz Abraham"
                  className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  placeholder="customer@domain.com"
                  className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    placeholder="+291 ..."
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Location / Country</label>
                  <input
                    type="text"
                    value={newCustomerForm.country}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, country: e.target.value })}
                    placeholder="Eritrea (Asmara)"
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Organization / Institution</label>
                <input
                  type="text"
                  value={newCustomerForm.company}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, company: e.target.value })}
                  placeholder="e.g. Asmara Heritage Center"
                  className="w-full bg-[#151226] border border-[#8E6D28]/40 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 bg-[#1A162B] text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-black font-bold uppercase rounded-xl"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
