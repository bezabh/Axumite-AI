import React, { useState, useEffect } from 'react';
import { ManagedUser, UserProfile, UserPrivileges, UserRole } from '../types';
import { 
  Users, UserPlus, Search, Filter, ShieldCheck, ShieldAlert, CheckCircle2, 
  XCircle, MoreVertical, Edit3, Trash2, Key, Download, RefreshCw, 
  Smartphone, Mail, MapPin, Coins, ArrowUpDown, Lock, UserCheck, Eye,
  Sliders, Sparkles, Check, X, Shield, Cpu, Database, Server, Crown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  PRIVILEGE_METADATA, 
  ROLE_DEFAULT_PRIVILEGES, 
  getUserEffectivePrivileges, 
  isAdminOrCreator 
} from '../lib/permissions';

const INITIAL_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr-axm-000',
    name: 'በዛብህ ኣብርሃ ወልደገብርኤል',
    email: 'beckylove2004@gmail.com',
    phoneNumber: '+49 152 14451691',
    country: 'Germany (Regensburg, Bavaria)',
    role: 'Creator',
    status: 'Active',
    tokensUsed: 1250,
    tokensQuota: 1000000,
    isPhoneVerified: true,
    isEmailVerified: true,
    joinedDate: '2026-01-01',
    lastActive: 'Active Now',
    notes: 'Platform Founder & Sovereign Super-Admin'
  },
  {
    id: 'usr-axm-001',
    name: 'Amanuel Tesfay',
    email: 'amanuel.t@axumite.ai',
    phoneNumber: '+291 7 123 456',
    country: 'Eritrea (Asmara)',
    role: 'Admin',
    status: 'Active',
    tokensUsed: 42350,
    tokensQuota: 250000,
    isPhoneVerified: true,
    isEmailVerified: true,
    joinedDate: '2026-01-15',
    lastActive: 'Just now',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-axm-002',
    name: 'Senait Gebrekidan',
    email: 'senait.g@heritage.er',
    phoneNumber: '+291 7 889 012',
    country: 'Eritrea (Keren)',
    role: 'Axumite Sovereign Scholar',
    status: 'Active',
    tokensUsed: 89400,
    tokensQuota: 100000,
    isPhoneVerified: true,
    isEmailVerified: true,
    joinedDate: '2026-02-01',
    lastActive: '12 mins ago',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-axm-003',
    name: 'Bereket Yohannes',
    email: 'bereket.y@diaspora.org',
    phoneNumber: '+44 7911 123456',
    country: 'United Kingdom (London)',
    role: 'ኤርትራዊ AI Pro',
    status: 'Active',
    tokensUsed: 31200,
    tokensQuota: 50000,
    isPhoneVerified: true,
    isEmailVerified: true,
    joinedDate: '2026-02-10',
    lastActive: '2 hours ago',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-axm-004',
    name: 'Helen Mehari',
    email: 'helen.m@stockholm-tech.se',
    phoneNumber: '+46 70 123 4567',
    country: 'Sweden (Stockholm)',
    role: 'ኤርትራዊ AI Pro',
    status: 'Active',
    tokensUsed: 14200,
    tokensQuota: 50000,
    isPhoneVerified: true,
    isEmailVerified: false,
    joinedDate: '2026-03-05',
    lastActive: 'Yesterday',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-axm-005',
    name: 'Yemane Berhe',
    email: 'yemane.b@dmv-diaspora.us',
    phoneNumber: '+1 202 555 0192',
    country: 'USA (Washington DC)',
    role: 'Axumite Sovereign Scholar',
    status: 'Active',
    tokensUsed: 98120,
    tokensQuota: 100000,
    isPhoneVerified: true,
    isEmailVerified: true,
    joinedDate: '2026-03-12',
    lastActive: '3 hours ago',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-axm-006',
    name: 'Rahel Abraham',
    email: 'rahel.a@gmail.com',
    phoneNumber: '+291 7 456 789',
    country: 'Eritrea (Massawa)',
    role: 'Free Member',
    status: 'Pending Verification',
    tokensUsed: 4900,
    tokensQuota: 5000,
    isPhoneVerified: false,
    isEmailVerified: true,
    joinedDate: '2026-04-02',
    lastActive: '3 days ago'
  },
  {
    id: 'usr-axm-007',
    name: 'Daniel Habte',
    email: 'daniel.habte@frankfurt.de',
    phoneNumber: '+49 151 23456789',
    country: 'Germany (Frankfurt)',
    role: 'Free Member',
    status: 'Suspended',
    tokensUsed: 5000,
    tokensQuota: 5000,
    isPhoneVerified: true,
    isEmailVerified: true,
    joinedDate: '2026-01-20',
    lastActive: '2 weeks ago'
  }
];

interface UserManagementViewProps {
  currentUser: UserProfile;
  onUpdateCurrentUser?: (updated: Partial<UserProfile>) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  onUpdateCurrentUser
}) => {
  const { language } = useLanguage();
  const [users, setUsers] = useState<ManagedUser[]>(() => {
    try {
      const saved = localStorage.getItem('axumite_managed_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MANAGED_USERS;
  });

  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'matrix'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [privilegeModalUser, setPrivilegeModalUser] = useState<ManagedUser | null>(null);

  // Form state for adding/editing user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    country: '',
    role: 'Free Member' as UserRole,
    tokensQuota: 10000,
    status: 'Active' as ManagedUser['status']
  });

  // State for privilege customization modal
  const [customPrivileges, setCustomPrivileges] = useState<UserPrivileges>(ROLE_DEFAULT_PRIVILEGES['Free Member']);
  const [isCustomOverrideActive, setIsCustomOverrideActive] = useState(false);
  const [selectedRoleInModal, setSelectedRoleInModal] = useState<UserRole>('Free Member');

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync to local storage
  const saveUsers = (updated: ManagedUser[]) => {
    setUsers(updated);
    try {
      localStorage.setItem('axumite_managed_users', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phoneNumber.includes(searchQuery) ||
      u.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Action handlers
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '+291 7 ',
      country: 'Eritrea (Asmara)',
      role: 'Free Member',
      tokensQuota: 25000,
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      triggerNotification('Please provide name and email');
      return;
    }

    const newUser: ManagedUser = {
      id: `usr-axm-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      country: formData.country,
      role: formData.role,
      status: formData.status,
      tokensUsed: 0,
      tokensQuota: Number(formData.tokensQuota),
      isPhoneVerified: true,
      isEmailVerified: true,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just registered'
    };

    saveUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    triggerNotification(`User "${newUser.name}" successfully created with ${newUser.role} privileges.`);
  };

  const handleOpenEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      country: user.country,
      role: user.role,
      tokensQuota: user.tokensQuota,
      status: user.status
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated = users.map((u) => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          country: formData.country,
          role: formData.role,
          tokensQuota: Number(formData.tokensQuota),
          status: formData.status
        };
      }
      return u;
    });

    saveUsers(updated);
    setEditingUser(null);
    triggerNotification(`User "${formData.name}" updated successfully.`);
  };

  // Open Privileges Management Modal for User
  const handleOpenPrivilegesModal = (u: ManagedUser) => {
    setPrivilegeModalUser(u);
    setSelectedRoleInModal(u.role);
    setIsCustomOverrideActive(!!u.customPrivilegesEnabled);
    const effective = getUserEffectivePrivileges(u);
    setCustomPrivileges(effective);
  };

  const handleSaveUserPrivileges = () => {
    if (!privilegeModalUser) return;

    const updated = users.map((u) => {
      if (u.id === privilegeModalUser.id) {
        return {
          ...u,
          role: selectedRoleInModal,
          customPrivilegesEnabled: isCustomOverrideActive,
          privileges: isCustomOverrideActive ? customPrivileges : undefined
        };
      }
      return u;
    });

    saveUsers(updated);

    // If updating current logged in user
    if (privilegeModalUser.id === currentUser.id || privilegeModalUser.email === currentUser.email) {
      if (onUpdateCurrentUser) {
        onUpdateCurrentUser({
          role: selectedRoleInModal,
          customPrivilegesEnabled: isCustomOverrideActive,
          privileges: isCustomOverrideActive ? customPrivileges : undefined
        });
      }
    }

    setPrivilegeModalUser(null);
    triggerNotification(`Privileges and rights for "${privilegeModalUser.name}" successfully updated.`);
  };

  const handleGrantFullAdminToUser = () => {
    setSelectedRoleInModal('Admin');
    setIsCustomOverrideActive(false);
    setCustomPrivileges(ROLE_DEFAULT_PRIVILEGES.Admin);
    triggerNotification('Admin rights preset loaded.');
  };

  const handleToggleStatus = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextStatus: ManagedUser['status'] = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveUsers(updated);
    triggerNotification('User status updated.');
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
      const updated = users.filter((u) => u.id !== userId);
      saveUsers(updated);
      triggerNotification(`User "${userName}" removed.`);
    }
  };

  const handleResetTokens = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, tokensUsed: 0 };
      }
      return u;
    });
    saveUsers(updated);
    triggerNotification('User token usage reset to 0.');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Country', 'Role', 'Status', 'Tokens Used', 'Tokens Quota', 'Joined Date'];
    const rows = users.map(u => [
      u.id,
      `"${u.name}"`,
      u.email,
      `"${u.phoneNumber}"`,
      `"${u.country}"`,
      `"${u.role}"`,
      u.status,
      u.tokensUsed,
      u.tokensQuota,
      u.joinedDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `axumite_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification('User directory exported as CSV.');
  };

  // Stats calculation
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const adminUsersCount = users.filter(u => u.role === 'Admin' || u.role === 'Creator').length;
  const proUsersCount = users.filter(u => u.role === 'ኤርትራዊ AI Pro' || u.role === 'Axumite Sovereign Scholar').length;
  const totalTokensAllocated = users.reduce((acc, u) => acc + u.tokensQuota, 0);

  const allPrivilegeKeys = Object.keys(PRIVILEGE_METADATA) as (keyof UserPrivileges)[];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-[#161424] border border-[#C5A059] text-[#F3E5AB] px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#120F1D] via-[#0E0C17] to-[#0A0812] border border-[#8E6D28]/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <Users className="w-6 h-6 text-[#E1C47D]" />
              <h1 className="text-xl sm:text-2xl font-black font-cinzel text-[#F3E5AB] tracking-wide">
                {language === 'ti' ? 'ናይ ተጠቀምትን መሰላትን ምሕደራ' : 'USER & PRIVILEGE MANAGEMENT (RBAC)'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'ti' 
                ? 'ምሕደራ ተጠቀምቲ፡ ምደባ ሚናታትን ፍቓዳትን (User Rights & Privileges)፡ ኮታ ቶከን ከምኡ ውን ድሕንነት መድረኽ።'
                : 'Role-Based Access Control (RBAC), granular permission overrides, token quotas, and administrator governance.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 hover:border-[#C5A059] text-[#F3E5AB] text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-md"
              title="Export User List"
            >
              <Download className="w-3.5 h-3.5 text-[#E1C47D]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:brightness-110 flex items-center space-x-2 cursor-pointer shadow-lg active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-black" />
              <span>{language === 'ti' ? 'ሓድሽ ተጠቃሚ ወስኽ' : 'Add New User'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tab Switcher: Directory vs Role Matrix */}
      <div className="bg-[#090812] border border-[#8E6D28]/30 rounded-2xl p-1.5 flex items-center space-x-2 shadow-md">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'directory'
              ? 'bg-[#2A2010] text-[#F3E5AB] border border-[#C5A059]/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#141220]'
          }`}
        >
          <Users className="w-4 h-4 text-[#E1C47D]" />
          <span>{language === 'ti' ? 'ዝርዝር ተጠቀምቲ' : 'User Accounts Directory'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'matrix'
              ? 'bg-[#2A2010] text-[#F3E5AB] border border-[#C5A059]/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#141220]'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#E1C47D]" />
          <span>{language === 'ti' ? 'ናይ መሰላት ማትሪክስ (Role Matrix)' : 'Role & Privilege Matrix'}</span>
        </button>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>{language === 'ti' ? 'ጠቕላላ ተጠቀምቲ' : 'Total Accounts'}</span>
            <Users className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {totalUsersCount.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{adminUsersCount} Administrators active</span>
          </div>
        </div>

        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>{language === 'ti' ? 'ንጡፋት ኣካውንታት' : 'Active Accounts'}</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
            {activeUsersCount} <span className="text-xs text-slate-400 font-normal">/ {totalUsersCount}</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            {Math.round((activeUsersCount / totalUsersCount) * 100)}% operational rate
          </div>
        </div>

        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>{language === 'ti' ? 'Pro / Scholar ተጠቀምቲ' : 'Pro & Scholars'}</span>
            <ShieldCheck className="w-4 h-4 text-[#E1C47D]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#F3E5AB] font-mono">
            {proUsersCount}
          </div>
          <div className="mt-1 text-[10px] text-[#C5A059]">
            Full AI permissions
          </div>
        </div>

        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <span>{language === 'ti' ? 'ዝተመደበ ቶከናት' : 'Tokens Pool'}</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-300 font-mono">
            {(totalTokensAllocated / 1000).toFixed(0)}k
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            Total monthly pool
          </div>
        </div>

      </div>

      {activeSubTab === 'directory' ? (
        <>
          {/* Filter & Search Bar */}
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl p-4 shadow-md flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#C5A059] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ti' ? 'ብሽም፡ ኢሜይል፡ ወይ ስልኪ ድለዩ...' : 'Search by name, email, country...'}
                className="w-full bg-[#120F1E] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
              <div className="flex items-center space-x-1.5 bg-[#120F1E] border border-[#8E6D28]/40 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] font-semibold text-slate-400">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-[#F3E5AB] font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-[#120F1E]">All Roles</option>
                  <option value="Creator" className="bg-[#120F1E]">Creator (Super Admin)</option>
                  <option value="Admin" className="bg-[#120F1E]">Admin</option>
                  <option value="Axumite Sovereign Scholar" className="bg-[#120F1E]">Sovereign Scholar</option>
                  <option value="ኤርትራዊ AI Pro" className="bg-[#120F1E]">ኤርትራዊ AI Pro</option>
                  <option value="Free Member" className="bg-[#120F1E]">Free Member</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#120F1E] border border-[#8E6D28]/40 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-[11px] font-semibold text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-[#F3E5AB] font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-[#120F1E]">All Status</option>
                  <option value="Active" className="bg-[#120F1E]">Active</option>
                  <option value="Pending Verification" className="bg-[#120F1E]">Pending</option>
                  <option value="Suspended" className="bg-[#120F1E]">Suspended</option>
                </select>
              </div>

              {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                  }}
                  className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 hover:text-white transition-all underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* User Directory Table */}
          <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#120F1E] border-b border-[#8E6D28]/30 text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">User Details</th>
                    <th className="py-3.5 px-4">Role & Privileges</th>
                    <th className="py-3.5 px-4">Location & Contact</th>
                    <th className="py-3.5 px-4">Token Ceiling</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions & Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8E6D28]/15">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No users matching the specified filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#141022] transition-colors">
                        
                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-[#1A162B] border border-[#8E6D28]/50 flex items-center justify-center font-bold text-[#F3E5AB] overflow-hidden shrink-0 shadow-sm">
                              {u.avatarUrl ? (
                                <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                              ) : (
                                u.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center space-x-1.5">
                                <span>{u.name}</span>
                                {u.role === 'Creator' && (
                                  <span className="px-1.5 py-0.2 bg-amber-500/20 border border-amber-400 text-[9px] text-[#F3E5AB] font-bold rounded-sm uppercase flex items-center space-x-0.5">
                                    <Crown className="w-2.5 h-2.5 text-amber-400" />
                                    <span>Creator</span>
                                  </span>
                                )}
                                {u.role === 'Admin' && (
                                  <span className="px-1.5 py-0.2 bg-purple-500/20 border border-purple-400/50 text-[9px] text-purple-300 font-bold rounded-sm uppercase">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                                <Mail className="w-3 h-3 text-slate-500" />
                                <span>{u.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role & Privileges Badge */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              u.role === 'Creator'
                                ? 'bg-amber-950/80 border-amber-400 text-[#F3E5AB]'
                                : u.role === 'Admin'
                                ? 'bg-purple-900/30 border-purple-500/40 text-purple-300'
                                : u.role === 'Axumite Sovereign Scholar'
                                ? 'bg-amber-900/30 border-amber-500/50 text-[#F3E5AB]'
                                : u.role === 'ኤርትራዊ AI Pro'
                                ? 'bg-blue-900/30 border-blue-500/40 text-blue-300'
                                : 'bg-slate-800/50 border-slate-700 text-slate-300'
                            }`}>
                              <span>{u.role}</span>
                            </span>
                            {u.customPrivilegesEnabled && (
                              <div className="text-[9px] text-emerald-400 font-mono flex items-center space-x-1">
                                <Sliders className="w-2.5 h-2.5" />
                                <span>Custom Rights</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Contact & Location */}
                        <td className="py-3.5 px-4 text-[11px]">
                          <div className="flex items-center space-x-1 text-slate-300">
                            <MapPin className="w-3 h-3 text-[#C5A059]" />
                            <span>{u.country}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-400 font-mono mt-0.5">
                            <Smartphone className="w-3 h-3 text-slate-500" />
                            <span>{u.phoneNumber}</span>
                          </div>
                        </td>

                        {/* Token Quota Progress */}
                        <td className="py-3.5 px-4">
                          <div className="w-32 space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-400">Used:</span>
                              <span className="text-[#F3E5AB] font-bold">{u.tokensUsed.toLocaleString()} / {u.tokensQuota.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#171424] rounded-full overflow-hidden border border-[#8E6D28]/30">
                              <div 
                                className={`h-full rounded-full ${
                                  (u.tokensUsed / u.tokensQuota) > 0.8 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059]'
                                }`}
                                style={{ width: `${Math.min(100, (u.tokensUsed / u.tokensQuota) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'Active'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                              : u.status === 'Pending Verification'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                          }`}>
                            {u.status === 'Active' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : u.status === 'Pending Verification' ? (
                              <ShieldAlert className="w-3 h-3 text-amber-400" />
                            ) : (
                              <XCircle className="w-3 h-3 text-rose-400" />
                            )}
                            <span>{u.status}</span>
                          </span>
                        </td>

                        {/* Row Actions & Permissions Button */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Manage Privileges & Rights Button */}
                            <button
                              onClick={() => handleOpenPrivilegesModal(u)}
                              className="px-2.5 py-1.5 bg-[#1F190D] hover:bg-[#2F2414] border border-[#8E6D28]/60 hover:border-[#C5A059] text-[#F3E5AB] font-bold text-[10px] rounded-lg transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                              title="Manage User Rights & Privileges (RBAC)"
                            >
                              <Key className="w-3 h-3 text-amber-400" />
                              <span>Rights</span>
                            </button>

                            <button
                              onClick={() => handleOpenEdit(u)}
                              className="p-1.5 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 hover:border-[#C5A059] text-slate-300 hover:text-[#F3E5AB] rounded-lg transition-all cursor-pointer"
                              title="Edit User Info"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(u.id)}
                              className={`p-1.5 border rounded-lg transition-all cursor-pointer ${
                                u.status === 'Active' 
                                  ? 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-700/50 text-rose-300' 
                                  : 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-700/50 text-emerald-300'
                              }`}
                              title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleResetTokens(u.id)}
                              className="p-1.5 bg-[#1A162B] hover:bg-[#25203D] border border-[#8E6D28]/40 text-amber-300 rounded-lg transition-all cursor-pointer"
                              title="Reset Token Usage"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            {u.role !== 'Creator' && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 text-rose-400 hover:text-rose-200 rounded-lg transition-all cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
        </>
      ) : (
        /* Role & Privilege Matrix Tab */
        <div className="bg-[#0B0914] border border-[#8E6D28]/30 rounded-xl overflow-hidden shadow-xl p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#F3E5AB] font-serif flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>{language === 'ti' ? 'ናይ ሚናታትን መሰላትን ማትሪክስ (Role-Based Access Control)' : 'Global Role-Based Access Control Matrix'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Standard privilege blueprints inherited automatically by each tier. Admins can grant custom granular exceptions on any user profile.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-[#120F1E] border-b border-[#8E6D28]/30 text-[10px] uppercase font-bold text-[#C5A059]">
                <tr>
                  <th className="py-3 px-3">System Privilege</th>
                  <th className="py-3 px-2 text-center text-amber-300">Creator</th>
                  <th className="py-3 px-2 text-center text-purple-300">Admin</th>
                  <th className="py-3 px-2 text-center text-[#F3E5AB]">Scholar</th>
                  <th className="py-3 px-2 text-center text-blue-300">AI Pro</th>
                  <th className="py-3 px-2 text-center text-slate-300">Free</th>
                  <th className="py-3 px-2 text-center text-slate-400">Guest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8E6D28]/15">
                {allPrivilegeKeys.map((key) => {
                  const meta = PRIVILEGE_METADATA[key];
                  return (
                    <tr key={key} className="hover:bg-[#141022]">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-100">{meta.label}</div>
                        <div className="text-[10px] text-slate-400">{meta.description}</div>
                      </td>
                      {(['Creator', 'Admin', 'Axumite Sovereign Scholar', 'ኤርትራዊ AI Pro', 'Free Member', 'Guest'] as UserRole[]).map((role) => {
                        const isGranted = ROLE_DEFAULT_PRIVILEGES[role]?.[key];
                        return (
                          <td key={role} className="py-2.5 px-2 text-center">
                            {isGranted ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-bold mx-auto">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-slate-500 text-xs mx-auto">
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Rights & Privileges Granular Management Modal */}
      {privilegeModalUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D0B18] border-2 border-[#C5A059] rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#8E6D28]/40 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-[#C5A059] flex items-center justify-center text-[#F3E5AB] font-bold">
                  <Key className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F3E5AB] font-serif">
                    User Rights & Privilege Manager
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">
                    {privilegeModalUser.name} ({privilegeModalUser.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPrivilegeModalUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Role Assignment Preset Bar */}
            <div className="bg-[#141022] border border-[#8E6D28]/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-200">Role Tier Assignment</div>
                  <div className="text-[11px] text-slate-400">Selecting a role sets default sovereign permissions</div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={selectedRoleInModal}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      setSelectedRoleInModal(newRole);
                      if (!isCustomOverrideActive) {
                        setCustomPrivileges(ROLE_DEFAULT_PRIVILEGES[newRole]);
                      }
                    }}
                    className="bg-[#0B0914] border border-[#8E6D28] text-[#F3E5AB] font-bold rounded-lg px-3 py-1.5 text-xs outline-none"
                  >
                    <option value="Creator">👑 Creator (Super Admin)</option>
                    <option value="Admin">🛡️ Admin (Full Access)</option>
                    <option value="Axumite Sovereign Scholar">📜 Axumite Sovereign Scholar</option>
                    <option value="ኤርትራዊ AI Pro">⭐ ኤርትራዊ AI Pro</option>
                    <option value="Free Member">👤 Free Member</option>
                    <option value="Guest">🌐 Guest</option>
                    <option value="Suspended">🔒 Suspended</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleGrantFullAdminToUser}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-400 text-purple-200 text-xs font-bold rounded-lg hover:brightness-125 transition-all cursor-pointer"
                  >
                    Make Admin
                  </button>
                </div>
              </div>

              {/* Custom Override Toggle Switch */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="font-semibold text-slate-300">Custom Granular Permissions Override</span>
                  <p className="text-[11px] text-slate-400">Manually enable/disable individual capabilities below</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCustomOverrideActive}
                    onChange={(e) => {
                      setIsCustomOverrideActive(e.target.checked);
                      if (!e.target.checked) {
                        setCustomPrivileges(ROLE_DEFAULT_PRIVILEGES[selectedRoleInModal]);
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* Granular Permission Toggles by Category */}
            <div className="space-y-4 text-xs">
              
              {/* Category 1: AI Features */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>AI & Intelligent Tool Privileges</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allPrivilegeKeys
                    .filter((k) => PRIVILEGE_METADATA[k].category === 'ai')
                    .map((key) => {
                      const meta = PRIVILEGE_METADATA[key];
                      const isChecked = customPrivileges[key];
                      return (
                        <div
                          key={key}
                          onClick={() => {
                            if (isCustomOverrideActive) {
                              setCustomPrivileges({ ...customPrivileges, [key]: !isChecked });
                            }
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                            isCustomOverrideActive ? 'cursor-pointer hover:border-[#C5A059]' : 'opacity-80'
                          } ${
                            isChecked 
                              ? 'bg-[#151226] border-emerald-700/50 text-slate-200' 
                              : 'bg-[#0B0914] border-slate-800 text-slate-400'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-white">{meta.label}</div>
                            <div className="text-[10px] text-slate-400">{meta.labelTi}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked ? 'bg-emerald-600 border-emerald-400 text-white font-bold' : 'border-slate-700'
                          }`}>
                            {isChecked && '✓'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Category 2: Management & Admin Suites */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Management & Operational Rights</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allPrivilegeKeys
                    .filter((k) => PRIVILEGE_METADATA[k].category === 'management')
                    .map((key) => {
                      const meta = PRIVILEGE_METADATA[key];
                      const isChecked = customPrivileges[key];
                      return (
                        <div
                          key={key}
                          onClick={() => {
                            if (isCustomOverrideActive) {
                              setCustomPrivileges({ ...customPrivileges, [key]: !isChecked });
                            }
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                            isCustomOverrideActive ? 'cursor-pointer hover:border-[#C5A059]' : 'opacity-80'
                          } ${
                            isChecked 
                              ? 'bg-[#151226] border-emerald-700/50 text-slate-200' 
                              : 'bg-[#0B0914] border-slate-800 text-slate-400'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-white">{meta.label}</div>
                            <div className="text-[10px] text-slate-400">{meta.labelTi}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked ? 'bg-emerald-600 border-emerald-400 text-white font-bold' : 'border-slate-700'
                          }`}>
                            {isChecked && '✓'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Category 3: System & Security */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                  <Server className="w-3.5 h-3.5" />
                  <span>System Configuration & Sovereignty</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allPrivilegeKeys
                    .filter((k) => PRIVILEGE_METADATA[k].category === 'system')
                    .map((key) => {
                      const meta = PRIVILEGE_METADATA[key];
                      const isChecked = customPrivileges[key];
                      return (
                        <div
                          key={key}
                          onClick={() => {
                            if (isCustomOverrideActive) {
                              setCustomPrivileges({ ...customPrivileges, [key]: !isChecked });
                            }
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                            isCustomOverrideActive ? 'cursor-pointer hover:border-[#C5A059]' : 'opacity-80'
                          } ${
                            isChecked 
                              ? 'bg-[#151226] border-emerald-700/50 text-slate-200' 
                              : 'bg-[#0B0914] border-slate-800 text-slate-400'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-white">{meta.label}</div>
                            <div className="text-[10px] text-slate-400">{meta.labelTi}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked ? 'bg-emerald-600 border-emerald-400 text-white font-bold' : 'border-slate-700'
                          }`}>
                            {isChecked && '✓'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#8E6D28]/40">
              <button
                type="button"
                onClick={() => {
                  setCustomPrivileges(ROLE_DEFAULT_PRIVILEGES[selectedRoleInModal]);
                  setIsCustomOverrideActive(false);
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Reset to Role Defaults
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setPrivilegeModalUser(null)}
                  className="px-4 py-2 bg-[#1A162B] hover:bg-[#25203D] border border-slate-700 text-slate-300 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUserPrivileges}
                  className="px-5 py-2 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-black font-bold uppercase tracking-wider text-xs rounded-xl hover:brightness-110 cursor-pointer shadow-lg active:scale-95"
                >
                  Apply Privileges
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Create / Edit User Modal */}
      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B18] border border-[#C5A059]/60 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-[#8E6D28]/30 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#E1C47D]" />
                <h3 className="text-base font-bold font-cinzel text-[#F3E5AB]">
                  {isAddModalOpen ? 'Add New Platform User' : `Edit User: ${editingUser?.name}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleCreateUser : handleSaveEdit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Yonas Michael"
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl p-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+291 7 ..."
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl p-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location / Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Eritrea (Asmara)"
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role Tier</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl p-2.5 text-[#F3E5AB] font-bold focus:outline-none"
                  >
                    <option value="Free Member">Free Member</option>
                    <option value="ኤርትራዊ AI Pro">ኤርትራዊ AI Pro</option>
                    <option value="Axumite Sovereign Scholar">Axumite Scholar</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Verification">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Token Quota</label>
                  <input
                    type="number"
                    value={formData.tokensQuota}
                    onChange={(e) => setFormData({ ...formData, tokensQuota: Number(e.target.value) })}
                    className="w-full bg-[#151226] border border-[#8E6D28]/40 focus:border-[#C5A059] rounded-xl p-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#8E6D28]/30">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 bg-[#1A162B] hover:bg-[#25203D] border border-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#8E6D28] via-[#E1C47D] to-[#C5A059] text-black font-bold uppercase tracking-wider rounded-xl hover:brightness-110 cursor-pointer shadow-lg"
                >
                  {isAddModalOpen ? 'Create Account' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

