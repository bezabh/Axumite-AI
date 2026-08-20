import React, { useState } from 'react';
import { UserProfile, AppSystemConfig } from '../types';
import { UserManagementView } from './UserManagementView';
import { PaymentManagementView } from './PaymentManagementView';
import { CustomerManagementView } from './CustomerManagementView';
import { AdminConfigView } from './AdminConfigView';
import { RbacDashboardView } from './rbac/RbacDashboardView';
import { Users, CreditCard, HeartHandshake, ShieldCheck, Sparkles, LayoutDashboard, Sliders, Settings, Crown, Lock, Shield, Key } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isAdminOrCreator, hasPrivilege } from '../lib/permissions';

export type ManagementSection = 'rbac' | 'users' | 'payments' | 'customers' | 'admin-config';

interface ManagementHubProps {
  initialSection?: ManagementSection;
  user: UserProfile;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onConfigChange?: (config: AppSystemConfig) => void;
}

export const ManagementHub: React.FC<ManagementHubProps> = ({
  initialSection = 'rbac',
  user,
  onUpdateUser,
  onConfigChange,
}) => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<ManagementSection>(initialSection);

  const canConfigApp = isAdminOrCreator(user) || hasPrivilege(user, 'canConfigureApp');
  const canManageUsers = isAdminOrCreator(user) || hasPrivilege(user, 'canManageUsers');
  const canManagePayments = isAdminOrCreator(user) || hasPrivilege(user, 'canManagePayments');
  const canManageCRM = isAdminOrCreator(user) || hasPrivilege(user, 'canManageCRM');

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-6">
      
      {/* Top Sovereign Navigation Tabs */}
      <div className="bg-[#090812] border border-[#8E6D28]/30 rounded-2xl p-2 shadow-2xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
          
          {/* Complete RBAC & Access Control Tab */}
          <button
            onClick={() => setActiveSection('rbac')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeSection === 'rbac'
                ? 'bg-gradient-to-r from-[#8E6D28]/40 via-[#C5A059]/30 to-[#8E6D28]/40 text-[#F3E5AB] border border-[#C5A059] stela-glow scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-[#141022]'
            }`}
          >
            <Shield className={`w-4 h-4 ${activeSection === 'rbac' ? 'text-[#E1C47D]' : 'text-slate-400'}`} />
            <span>{language === 'ti' ? 'RBAC ምሕደራን መሰላትን' : 'Enterprise RBAC Suite'}</span>
          </button>

          {/* User Management Tab */}
          {canManageUsers && (
            <button
              onClick={() => setActiveSection('users')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                activeSection === 'users'
                  ? 'bg-gradient-to-r from-[#8E6D28]/40 via-[#C5A059]/30 to-[#8E6D28]/40 text-[#F3E5AB] border border-[#C5A059] stela-glow scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-[#141022]'
              }`}
            >
              <Users className={`w-4 h-4 ${activeSection === 'users' ? 'text-[#E1C47D]' : 'text-slate-400'}`} />
              <span>{language === 'ti' ? 'ተጠቃሚን ማውጫን' : 'User Directory'}</span>
            </button>
          )}

          {/* Admin App Configuration Tab */}
          {canConfigApp && (
            <button
              onClick={() => setActiveSection('admin-config')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                activeSection === 'admin-config'
                  ? 'bg-gradient-to-r from-[#8E6D28]/40 via-[#C5A059]/30 to-[#8E6D28]/40 text-[#F3E5AB] border border-[#C5A059] stela-glow scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-[#141022]'
              }`}
            >
              <Sliders className={`w-4 h-4 ${activeSection === 'admin-config' ? 'text-[#E1C47D]' : 'text-slate-400'}`} />
              <span>{language === 'ti' ? 'ናይ መድረኽ ቅጥዒ' : 'System Configuration'}</span>
            </button>
          )}

          {/* Payment Management Tab */}
          {canManagePayments && (
            <button
              onClick={() => setActiveSection('payments')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                activeSection === 'payments'
                  ? 'bg-gradient-to-r from-[#8E6D28]/40 via-[#C5A059]/30 to-[#8E6D28]/40 text-[#F3E5AB] border border-[#C5A059] stela-glow scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-[#141022]'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${activeSection === 'payments' ? 'text-[#E1C47D]' : 'text-slate-400'}`} />
              <span>{language === 'ti' ? 'ክፍሊት ምሕደራ' : 'Payment Management'}</span>
            </button>
          )}

          {/* Customer Management Tab */}
          {canManageCRM && (
            <button
              onClick={() => setActiveSection('customers')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                activeSection === 'customers'
                  ? 'bg-gradient-to-r from-[#8E6D28]/40 via-[#C5A059]/30 to-[#8E6D28]/40 text-[#F3E5AB] border border-[#C5A059] stela-glow scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-[#141022]'
              }`}
            >
              <HeartHandshake className={`w-4 h-4 ${activeSection === 'customers' ? 'text-[#E1C47D]' : 'text-slate-400'}`} />
              <span>{language === 'ti' ? 'ዓማዊል ምሕደራ (CRM)' : 'Customer CRM Desk'}</span>
            </button>
          )}

        </div>

        {/* User Role Badge & Status Indicator */}
        <div className="flex items-center space-x-3 pr-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#181428] border border-[#8E6D28]/40 text-xs text-[#F3E5AB] font-bold">
            {user.role === 'Creator' ? (
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{user.role}</span>
          </div>
          <div className="hidden lg:flex items-center space-x-1 text-[11px] text-[#C5A059] font-mono font-semibold">
            <span>Encrypted Admin Console</span>
          </div>
        </div>
      </div>

      {/* Render Active Management Module */}
      <div className="transition-all duration-300">
        {activeSection === 'rbac' && (
          <RbacDashboardView />
        )}
        {activeSection === 'users' && (
          <UserManagementView currentUser={user} onUpdateCurrentUser={onUpdateUser} />
        )}
        {activeSection === 'admin-config' && (
          <AdminConfigView currentUser={user} onConfigChange={onConfigChange} />
        )}
        {activeSection === 'payments' && (
          <PaymentManagementView />
        )}
        {activeSection === 'customers' && (
          <CustomerManagementView />
        )}
      </div>

    </div>
  );
};


