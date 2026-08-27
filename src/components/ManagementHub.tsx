import React, { useState } from 'react';
import { UserProfile, AppSystemConfig } from '../types';
import { UserManagementView } from './UserManagementView';
import { PaymentManagementView } from './PaymentManagementView';
import { CustomerManagementView } from './CustomerManagementView';
import { AdminConfigView } from './AdminConfigView';
import { RbacDashboardView } from './rbac/RbacDashboardView';
import { AuditLogModal } from './AuditLogModal';
import { SystemActivityView } from './SystemActivityView';
import { AdminDataExportModal } from './AdminDataExportModal';
import { 
  Users, CreditCard, HeartHandshake, ShieldCheck, Sparkles, 
  LayoutDashboard, Sliders, Settings, Crown, Lock, Shield, 
  Key, Clock, FileText, ScrollText, Activity, Download, FileSpreadsheet 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isAdminOrCreator, hasPrivilege } from '../lib/permissions';
import { exportUsersToCSV, exportUsersToPDF, exportPaymentsToCSV, exportPaymentsToPDF, exportSystemLogsToCSV, exportSystemLogsToPDF } from '../utils/adminDataExport';

export type ManagementSection = 'rbac' | 'users' | 'payments' | 'customers' | 'admin-config' | 'activity';

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
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const canConfigApp = isAdminOrCreator(user) || hasPrivilege(user, 'canConfigureApp');
  const canManageUsers = isAdminOrCreator(user) || hasPrivilege(user, 'canManageUsers');
  const canManagePayments = isAdminOrCreator(user) || hasPrivilege(user, 'canManagePayments');
  const canManageCRM = isAdminOrCreator(user) || hasPrivilege(user, 'canManageCRM');
  const canViewActivity = isAdminOrCreator(user) || hasPrivilege(user, 'canConfigureApp') || hasPrivilege(user, 'canManagePrivileges');

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
              <HeartHandshake className={`w-4 h-4 ${activeSection === 'customers' ? 'text-[#E1C47D]' : 'Customer CRM Desk'}`} />
              <span>{language === 'ti' ? 'ዓማዊል ምሕደራ (CRM)' : 'Customer CRM Desk'}</span>
            </button>
          )}

          {/* System Activity (D3 Telemetry) Tab */}
          {canViewActivity && (
            <button
              onClick={() => setActiveSection('activity')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                activeSection === 'activity'
                  ? 'bg-gradient-to-r from-[#8E6D28]/40 via-[#C5A059]/30 to-[#8E6D28]/40 text-[#F3E5AB] border border-[#C5A059] stela-glow scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-[#141022]'
              }`}
            >
              <Activity className={`w-4 h-4 ${activeSection === 'activity' ? 'text-[#E1C47D]' : 'text-slate-400'}`} />
              <span>{language === 'ti' ? 'ናይ ሲስተም ምንቅስቓስ' : 'System Activity'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}

        </div>

        {/* Top Header Actions & Audit / Export Links */}
        <div className="flex items-center space-x-2 pr-2 flex-wrap">
          
          {/* Data Export (CSV / PDF) Modal Link Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1C162E] via-[#2A1F45] to-[#1C162E] hover:from-[#2F2150] hover:to-[#2F2150] border border-amber-500/50 hover:border-amber-400 text-amber-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md hover:shadow-amber-500/20 group active:scale-95"
            title="Download User Activity, Payment Summaries & System Logs in CSV or PDF"
          >
            <Download className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
            <span>{language === 'ti' ? 'ዳታ ኤክስፖርት (CSV/PDF)' : 'Data Export (CSV/PDF)'}</span>
            <span className="text-[9px] bg-amber-400/20 text-amber-200 font-mono px-1 rounded">ALL</span>
          </button>

          {/* Audit Log Modal Link Button */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#1C162E] hover:bg-[#2B2144] border border-[#8E6D28]/50 hover:border-[#C5A059] text-[#F3E5AB] text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md hover:shadow-[#C5A059]/20 group active:scale-95"
            title="View Administrative Audit Logs & Action Trail"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
            <span>{language === 'ti' ? 'ናይ ምሕደራ መዝገብ' : 'Audit Logs'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* User Role Badge & Status Indicator */}
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

      {/* Quick Data Export Shortcut Banner for Super Admins */}
      <div className="bg-gradient-to-r from-[#120E22]/90 via-[#1A1430]/90 to-[#120E22]/90 border border-[#8E6D28]/40 rounded-2xl p-3.5 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4 text-[#E1C47D]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#F3E5AB] flex items-center space-x-2">
              <span>{language === 'ti' ? 'ናይ ላዕለዎት ሓለፍቲ ዳታ ኤክስፖርት ማእከል' : 'Super Admin Offline Compliance & Data Export Suite'}</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">CSV & PDF ENGINE</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {language === 'ti' 
                ? 'ናይ ተጠቃሚ ምንቅስቓስ፣ ክፍሊታትን ሲስተም ሎግስን ንመጽናዕቲ ኣውርድ'
                : 'Instantly download user activity records, payment summaries, and system usage logs for offline analysis.'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* Quick User CSV */}
          <button
            onClick={() => exportUsersToCSV(undefined, user)}
            className="px-2.5 py-1.5 rounded-lg bg-[#141026] hover:bg-[#20183B] border border-purple-500/40 text-purple-200 text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Download User Activity Report in CSV"
          >
            <Download className="w-3 h-3 text-purple-400" />
            <span>Users CSV</span>
          </button>

          {/* Quick User PDF */}
          <button
            onClick={() => exportUsersToPDF(undefined, user)}
            className="px-2.5 py-1.5 rounded-lg bg-[#141026] hover:bg-[#20183B] border border-purple-500/40 text-purple-200 text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Download User Activity Report in PDF"
          >
            <FileText className="w-3 h-3 text-purple-400" />
            <span>Users PDF</span>
          </button>

          {/* Quick Payments CSV */}
          <button
            onClick={() => exportPaymentsToCSV(undefined, user)}
            className="px-2.5 py-1.5 rounded-lg bg-[#141026] hover:bg-[#20183B] border border-amber-500/40 text-amber-200 text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Download Payment Summary Report in CSV"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>Payments CSV</span>
          </button>

          {/* Quick Payments PDF */}
          <button
            onClick={() => exportPaymentsToPDF(undefined, user)}
            className="px-2.5 py-1.5 rounded-lg bg-[#141026] hover:bg-[#20183B] border border-amber-500/40 text-amber-200 text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Download Payment Summary Report in PDF"
          >
            <FileText className="w-3 h-3 text-amber-400" />
            <span>Payments PDF</span>
          </button>

          {/* Quick System Logs CSV */}
          <button
            onClick={() => exportSystemLogsToCSV(undefined, undefined, user)}
            className="px-2.5 py-1.5 rounded-lg bg-[#141026] hover:bg-[#20183B] border border-emerald-500/40 text-emerald-200 text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Download System Usage & Telemetry Logs in CSV"
          >
            <Download className="w-3 h-3 text-emerald-400" />
            <span>System CSV</span>
          </button>

          {/* Quick System Logs PDF */}
          <button
            onClick={() => exportSystemLogsToPDF(undefined, undefined, user)}
            className="px-2.5 py-1.5 rounded-lg bg-[#141026] hover:bg-[#20183B] border border-emerald-500/40 text-emerald-200 text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Download System Usage & Telemetry Logs in PDF"
          >
            <FileText className="w-3 h-3 text-emerald-400" />
            <span>System PDF</span>
          </button>

          {/* Open Full Export Modal */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8E6D28] to-[#C5A059] hover:brightness-110 text-black text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-md active:scale-95"
          >
            <span>Full Hub</span>
            <span className="text-[10px]">↗</span>
          </button>
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
        {activeSection === 'activity' && (
          <SystemActivityView currentUser={user} />
        )}
      </div>

      {/* Administrative Audit Log Ledger Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        currentUser={user}
      />

      {/* Administrative Data Export Modal */}
      <AdminDataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentUser={user}
      />

    </div>
  );
};



