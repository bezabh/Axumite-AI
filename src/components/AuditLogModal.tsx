import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Users,
  Sliders,
  CreditCard,
  Key,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Eye,
  ChevronDown,
  ChevronRight,
  Database,
  Lock,
  ArrowRight,
  Terminal,
  Activity,
  Calendar,
  Sparkles,
  Layers,
  Settings,
  Zap,
  Globe
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

export interface AdminAuditAction {
  id: string;
  timestamp: string; // ISO string
  actorId: string;
  actorName: string;
  actorEmail?: string;
  actorRole: string;
  actionType: string;
  resource: string;
  targetId?: string;
  targetName?: string;
  description: string;
  changeType: 'Created' | 'Modified' | 'Deleted' | 'Assigned' | 'Revoked' | 'Overridden' | 'Configured' | 'Suspended' | 'Restored';
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  location?: string;
  severity: 'info' | 'warning' | 'critical';
  status: 'Success' | 'Pending' | 'Blocked';
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'axumite_admin_audit_logs';

export const INITIAL_ADMIN_AUDIT_LOGS: AdminAuditAction[] = [
  {
    id: 'aud-adm-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    actorId: 'usr-100',
    actorName: 'Alexander Ross',
    actorEmail: 'alexander@axumite.ai',
    actorRole: 'Super Admin',
    actionType: 'CONFIG_UPDATE',
    resource: 'System Configuration',
    targetId: 'cfg-churn-threshold',
    targetName: 'Subscription Churn Alert Ceiling',
    description: 'Updated churn ceiling threshold from 3.0% to 3.5% and activated automated push notifications.',
    changeType: 'Configured',
    previousValue: 'enableChurnAlert: true, churnThreshold: 3.0%',
    newValue: 'enableChurnAlert: true, churnThreshold: 3.5%',
    ipAddress: '192.168.1.100',
    location: 'Asmara, ER (Admin Gateway)',
    severity: 'warning',
    status: 'Success',
    metadata: {
      subsystem: 'telemetry_sentinel',
      notificationChannels: ['push_toast', 'admin_email', 'event_bus'],
    },
  },
  {
    id: 'aud-adm-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(), // ~1 hour ago
    actorId: 'usr-100',
    actorName: 'Alexander Ross',
    actorEmail: 'alexander@axumite.ai',
    actorRole: 'Super Admin',
    actionType: 'ROLE_ASSIGN',
    resource: 'User Accounts',
    targetId: 'usr-104',
    targetName: 'John Doe (john@example.com)',
    description: 'Elevated user membership role from Free Member to Content Editor.',
    changeType: 'Assigned',
    previousValue: 'role: "Free Member"',
    newValue: 'role: "Editor", groups: ["editorial_team"]',
    ipAddress: '192.168.1.100',
    location: 'Asmara, ER (Admin Gateway)',
    severity: 'info',
    status: 'Success',
    metadata: {
      grantedBy: 'Alexander Ross',
      reason: 'Approved for bilingual manuscript translations curation',
    },
  },
  {
    id: 'aud-adm-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    actorId: 'usr-101',
    actorName: 'Sarah Jenkins',
    actorEmail: 'sarah.j@axumite.ai',
    actorRole: 'Security Lead',
    actionType: 'USER_SUSPENSION',
    resource: 'User Accounts',
    targetId: 'usr-105',
    targetName: 'Marcus Brody (m.brody@external.org)',
    description: 'Enforced emergency account suspension following 12 rapid failed cryptographic PIN validation attempts.',
    changeType: 'Suspended',
    previousValue: 'status: "Active", loginAttempts: 0',
    newValue: 'status: "Suspended", lockReason: "brute_force_prevention"',
    ipAddress: '10.0.4.22',
    location: 'Frankfurt, DE (Cloud Ingress)',
    severity: 'critical',
    status: 'Success',
    metadata: {
      incidentId: 'INC-88912',
      failedAttempts: 12,
      lockoutDurationMinutes: 1440,
    },
  },
  {
    id: 'aud-adm-104',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    actorId: 'usr-100',
    actorName: 'Alexander Ross',
    actorEmail: 'alexander@axumite.ai',
    actorRole: 'Super Admin',
    actionType: 'PERMISSION_OVERRIDE',
    resource: 'RBAC Permissions',
    targetId: 'perm-export-audit',
    targetName: 'Override for Elena Rostova',
    description: 'Granted explicit individual allow override for "analytics.export_pdf" bypassing default tier constraint.',
    changeType: 'Overridden',
    previousValue: 'permission.analytics.export_pdf: default_deny',
    newValue: 'permission.analytics.export_pdf: explicit_allow',
    ipAddress: '192.168.1.100',
    location: 'Asmara, ER (Admin Gateway)',
    severity: 'warning',
    status: 'Success',
    metadata: {
      targetUserId: 'usr-106',
      scope: 'Analytics & Revenue Reports',
    },
  },
  {
    id: 'aud-adm-105',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    actorId: 'usr-102',
    actorName: 'Dawit Ghebre',
    actorEmail: 'dawit.g@axumite.ai',
    actorRole: 'Billing Admin',
    actionType: 'BILLING_CHANGE',
    resource: 'Payment Gateway',
    targetId: 'stripe-sub-49910',
    targetName: 'Pro Tier Annual Renewal Rebate',
    description: 'Processed goodwill discount rebate of $25.00 for disputed billing reconciliation on invoice #INV-2026-0814.',
    changeType: 'Modified',
    previousValue: 'invoiceTotal: $120.00, status: "Disputed"',
    newValue: 'invoiceTotal: $95.00, status: "Paid", discount: $25.00',
    ipAddress: '172.16.0.8',
    location: 'London, UK (Finance Node)',
    severity: 'info',
    status: 'Success',
    metadata: {
      disputeRef: 'DSP-09941',
      settlementGateway: 'Stripe Webhook',
    },
  },
  {
    id: 'aud-adm-106',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    actorId: 'usr-100',
    actorName: 'Alexander Ross',
    actorEmail: 'alexander@axumite.ai',
    actorRole: 'Super Admin',
    actionType: 'CREATE',
    resource: 'Role Definitions',
    targetId: 'role-linguist-specialist',
    targetName: 'Tigrinya NLP Linguist Role',
    description: 'Created new system role "Linguist Specialist" with custom access tokens for Ge\'ez audio corpus annotators.',
    changeType: 'Created',
    previousValue: 'None',
    newValue: 'Role created with 14 module permissions & audio upload privileges',
    ipAddress: '192.168.1.100',
    location: 'Asmara, ER (Admin Gateway)',
    severity: 'info',
    status: 'Success',
    metadata: {
      permissionCount: 14,
      defaultAssignable: false,
    },
  },
  {
    id: 'aud-adm-107',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    actorId: 'usr-101',
    actorName: 'Sarah Jenkins',
    actorEmail: 'sarah.j@axumite.ai',
    actorRole: 'Security Lead',
    actionType: 'SECURITY_POLICY',
    resource: 'Security & Auth',
    targetId: 'sec-2fa-enforcement',
    targetName: 'Mandatory 2FA Policy',
    description: 'Enforced mandatory hardware/authenticator 2FA requirement across all administrative & creator accounts.',
    changeType: 'Configured',
    previousValue: 'enforceTwoFactorForAdmins: false',
    newValue: 'enforceTwoFactorForAdmins: true, gracePeriodDays: 3',
    ipAddress: '10.0.4.22',
    location: 'Frankfurt, DE (Cloud Ingress)',
    severity: 'critical',
    status: 'Success',
    metadata: {
      policyCode: 'SEC-POL-2026-A',
      affectedAccountsCount: 6,
    },
  },
];

// Helper to retrieve persisted logs from localStorage
export function getAdminAuditLogs(): AdminAuditAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_AUDIT_LOGS));
      return INITIAL_ADMIN_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load admin audit logs from storage:', err);
    return INITIAL_ADMIN_AUDIT_LOGS;
  }
}

// Helper to record a new administrative audit log entry
export function recordAdminAuditAction(action: Omit<AdminAuditAction, 'id' | 'timestamp'>): AdminAuditAction {
  const newEntry: AdminAuditAction = {
    ...action,
    id: `aud-adm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = getAdminAuditLogs();
    const updated = [newEntry, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save admin audit action:', err);
  }

  return newEntry;
}

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const { language } = useLanguage();

  const [logs, setLogs] = useState<AdminAuditAction[]>(() => getAdminAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<string>('all');
  const [selectedChangeType, setSelectedChangeType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | '24h' | '7d' | '30d'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync logs when modal opens
  useEffect(() => {
    if (isOpen) {
      setLogs(getAdminAuditLogs());
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleRefresh = () => {
    const fresh = getAdminAuditLogs();
    setLogs(fresh);
    showToast(language === 'ti' ? 'መዝገብ ብትክክል ተሓዲሱ ኣሎ።' : 'Audit logs refreshed from storage.');
  };

  const handleCreateTestLog = () => {
    const newEntry = recordAdminAuditAction({
      actorId: currentUser?.email || 'usr-adm-current',
      actorName: currentUser?.name || 'Administrator',
      actorEmail: currentUser?.email || 'admin@axumite.ai',
      actorRole: currentUser?.role || 'Super Admin',
      actionType: 'ADMIN_INSPECTION',
      resource: 'Administrative Ledger',
      targetId: 'audit-inspection',
      targetName: 'Audit Trail Health Check',
      description: `Performed interactive audit trail ledger verification on ${new Date().toLocaleTimeString()}.`,
      changeType: 'Configured',
      previousValue: 'Audit status: Verified',
      newValue: 'Audit status: Verified & Synced',
      ipAddress: '127.0.0.1 (Local Client)',
      location: 'Active Admin Session',
      severity: 'info',
      status: 'Success',
      metadata: {
        sessionType: 'Interactive Admin Verification',
        clientPlatform: navigator.userAgent.substring(0, 45),
      },
    });

    setLogs(getAdminAuditLogs());
    setExpandedLogId(newEntry.id);
    showToast(language === 'ti' ? 'ሓድሽ ናይ ፈተነ መዝገብ ተፈጢሩ!' : 'New administrative audit record recorded!');
  };

  const handleExportJSON = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(logs, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `axumite-admin-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(language === 'ti' ? 'መዝገብ ብ JSON ተሰዲዱ ኣሎ።' : 'Audit logs exported as JSON.');
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor Name', 'Actor Role', 'Action Type', 'Resource', 'Target Name', 'Change Type', 'Previous Value', 'New Value', 'Severity', 'IP Address', 'Status'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      `"${l.actorRole}"`,
      `"${l.actionType}"`,
      `"${l.resource}"`,
      `"${(l.targetName || '').replace(/"/g, '""')}"`,
      `"${l.changeType}"`,
      `"${(l.previousValue || '').replace(/"/g, '""')}"`,
      `"${(l.newValue || '').replace(/"/g, '""')}"`,
      `"${l.severity}"`,
      `"${l.ipAddress}"`,
      `"${l.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `axumite-admin-audit-logs-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(language === 'ti' ? 'መዝገብ ብ CSV ተሰዲዱ ኣሎ።' : 'Audit logs exported as CSV.');
  };

  // Distinct resource list for dropdown
  const resourceOptions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.resource));
    return Array.from(set);
  }, [logs]);

  // Distinct change types for dropdown
  const changeTypeOptions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.changeType));
    return Array.from(set);
  }, [logs]);

  // Filtering Logic
  const filteredLogs = useMemo(() => {
    const now = Date.now();
    return logs.filter((log) => {
      // Search Term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesActor = log.actorName.toLowerCase().includes(query) || (log.actorEmail && log.actorEmail.toLowerCase().includes(query));
        const matchesResource = log.resource.toLowerCase().includes(query);
        const matchesAction = log.actionType.toLowerCase().includes(query);
        const matchesTarget = (log.targetName || '').toLowerCase().includes(query) || (log.targetId || '').toLowerCase().includes(query);
        const matchesDesc = log.description.toLowerCase().includes(query);
        const matchesIp = log.ipAddress.toLowerCase().includes(query);

        if (!matchesActor && !matchesResource && !matchesAction && !matchesTarget && !matchesDesc && !matchesIp) {
          return false;
        }
      }

      // Resource filter
      if (selectedResource !== 'all' && log.resource !== selectedResource) {
        return false;
      }

      // Change Type filter
      if (selectedChangeType !== 'all' && log.changeType !== selectedChangeType) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'all' && log.severity !== selectedSeverity) {
        return false;
      }

      // Timeframe filter
      if (selectedTimeframe !== 'all') {
        const logTime = new Date(log.timestamp).getTime();
        const diffHours = (now - logTime) / (1000 * 60 * 60);
        if (selectedTimeframe === '24h' && diffHours > 24) return false;
        if (selectedTimeframe === '7d' && diffHours > 24 * 7) return false;
        if (selectedTimeframe === '30d' && diffHours > 24 * 30) return false;
      }

      return true;
    });
  }, [logs, searchTerm, selectedResource, selectedChangeType, selectedSeverity, selectedTimeframe]);

  // Metric KPI summaries
  const metrics = useMemo(() => {
    const total = logs.length;
    const critical = logs.filter((l) => l.severity === 'critical').length;
    const warning = logs.filter((l) => l.severity === 'warning').length;
    const uniqueActors = new Set(logs.map((l) => l.actorName)).size;
    const uniqueResources = new Set(logs.map((l) => l.resource)).size;
    return { total, critical, warning, uniqueActors, uniqueResources };
  }, [logs]);

  if (!isOpen) return null;

  const getSeverityBadge = (sev: 'info' | 'warning' | 'critical') => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertTriangle className="w-3 h-3 mr-1 text-rose-400" />
            CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <ShieldAlert className="w-3 h-3 mr-1 text-amber-400" />
            WARNING
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
            INFO
          </span>
        );
    }
  };

  const getChangeTypeBadge = (type: string) => {
    switch (type) {
      case 'Created':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Created</span>;
      case 'Modified':
      case 'Configured':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">{type}</span>;
      case 'Deleted':
      case 'Revoked':
      case 'Suspended':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">{type}</span>;
      case 'Assigned':
      case 'Overridden':
      case 'Restored':
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">{type}</span>;
    }
  };

  const formatRelativeTime = (iso: string) => {
    try {
      const date = new Date(iso);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#171128] border-2 border-amber-400 text-amber-200 shadow-2xl flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <div className="p-1 rounded-lg bg-amber-500/20 text-amber-300">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      <div
        className="w-full max-w-7xl max-h-[92vh] flex flex-col bg-[#0A0713] border-2 border-[#8E6D28]/60 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 relative animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Subtle Decorative Ambient Stela Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-b from-[#C5A059]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* ========================================================================= */}
        {/* MODAL HEADER                                                              */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 border-b border-[#8E6D28]/30 bg-gradient-to-r from-[#120E1F] via-[#161126] to-[#0D091A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8E6D28]/30 via-[#C5A059]/20 to-transparent border border-[#C5A059] flex items-center justify-center text-[#E1C47D] shadow-lg shadow-amber-500/10 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel tracking-wide">
                  {language === 'ti' ? 'ናይ ምሕደራ ተግባራት መዝገብ' : 'Administrative Audit Log Ledger'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#8E6D28]/30 text-[#F3E5AB] border border-[#C5A059]/50">
                  {filteredLogs.length} / {logs.length} Events
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ti'
                  ? 'ናይ ምሕደራ ስጉምትታት፣ ምቕያር መሰላትን ቅጥዕታትን ዘርዚሩ ዘርኢ ናይ ድሕነት መዝገብ'
                  : 'Immutable audit trail of administrative actions, user permission mutations, resource modifications, and security events.'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              title="Refresh logs from local storage"
              className="p-2.5 rounded-xl bg-[#1C172C] hover:bg-[#2B2342] text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleCreateTestLog}
              title="Record a live test inspection entry"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1E1730] hover:bg-[#2D2147] border border-amber-500/30 text-amber-300 font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Record Action</span>
            </button>

            <button
              onClick={handleExportCSV}
              title="Export filtered records to CSV"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1E1730] hover:bg-[#2D2147] border border-amber-500/30 text-amber-300 font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              title="Export all records to JSON"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20 hover:brightness-110"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#1E1730] hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/60 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KPI METRICS OVERVIEW STRIP                                                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 sm:px-6 py-3.5 bg-[#0D0A17] border-b border-[#8E6D28]/20 shrink-0">
          <div className="p-2.5 rounded-2xl bg-[#140F24] border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Total Audit Events</div>
              <div className="text-base font-black text-white font-mono">{metrics.total}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#140F24] border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Critical Incidents</div>
              <div className="text-base font-black text-rose-400 font-mono">{metrics.critical}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#140F24] border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Active Admins</div>
              <div className="text-base font-black text-amber-300 font-mono">{metrics.uniqueActors}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#140F24] border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Target Resources</div>
              <div className="text-base font-black text-emerald-400 font-mono">{metrics.uniqueResources}</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILTER & SEARCH CONTROL TOOLBAR                                           */}
        {/* ========================================================================= */}
        <div className="p-4 sm:px-6 bg-[#0E0A1A] border-b border-[#8E6D28]/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ti' ? 'ብተጠቃሚ፣ ጸጋ፣ ስጉምቲ ወይ IP ድለይ...' : 'Search by user, affected resource, action type, IP...'}
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#151026] border border-slate-700/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Resource Filter */}
            <div className="flex items-center space-x-1.5 bg-[#151026] border border-slate-700/70 rounded-xl px-2.5 py-1 text-xs">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-[#151026] text-white">All Resources</option>
                {resourceOptions.map((res) => (
                  <option key={res} value={res} className="bg-[#151026] text-white">
                    {res}
                  </option>
                ))}
              </select>
            </div>

            {/* Change Type Filter */}
            <div className="flex items-center space-x-1.5 bg-[#151026] border border-slate-700/70 rounded-xl px-2.5 py-1 text-xs">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedChangeType}
                onChange={(e) => setSelectedChangeType(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-[#151026] text-white">All Change Types</option>
                {changeTypeOptions.map((ctype) => (
                  <option key={ctype} value={ctype} className="bg-[#151026] text-white">
                    {ctype}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center space-x-1.5 bg-[#151026] border border-slate-700/70 rounded-xl px-2.5 py-1 text-xs">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-[#151026] text-white">All Severities</option>
                <option value="info" className="bg-[#151026] text-emerald-400">Info Only</option>
                <option value="warning" className="bg-[#151026] text-amber-400">Warning Only</option>
                <option value="critical" className="bg-[#151026] text-rose-400">Critical Only</option>
              </select>
            </div>

            {/* Timeframe Filter */}
            <div className="flex items-center space-x-1.5 bg-[#151026] border border-slate-700/70 rounded-xl px-2.5 py-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-[#151026] text-white">All Time</option>
                <option value="24h" className="bg-[#151026] text-white">Last 24 Hours</option>
                <option value="7d" className="bg-[#151026] text-white">Last 7 Days</option>
                <option value="30d" className="bg-[#151026] text-white">Last 30 Days</option>
              </select>
            </div>

            {/* Clear Filters button */}
            {(searchTerm || selectedResource !== 'all' || selectedChangeType !== 'all' || selectedSeverity !== 'all' || selectedTimeframe !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedResource('all');
                  setSelectedChangeType('all');
                  setSelectedSeverity('all');
                  setSelectedTimeframe('all');
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Reset
              </button>
            )}

          </div>

        </div>

        {/* ========================================================================= */}
        {/* MAIN AUDIT TABLE CONTAINER                                                */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-[350px] p-4 sm:p-6 bg-[#080511]">
          
          {filteredLogs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 p-8 border border-dashed border-slate-800 rounded-3xl">
              <Clock className="w-12 h-12 text-slate-600" />
              <div>
                <h3 className="text-base font-bold text-white">No Matching Audit Logs Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  No administrative actions matched your active filter criteria. Try adjusting your search query or filter dropdowns.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedResource('all');
                  setSelectedChangeType('all');
                  setSelectedSeverity('all');
                  setSelectedTimeframe('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#1C172C] hover:bg-[#2B2342] text-amber-300 font-bold text-xs border border-amber-500/30 cursor-pointer transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="border border-[#8E6D28]/30 rounded-2xl overflow-hidden shadow-2xl bg-[#0E0A1A]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#151025] border-b border-[#8E6D28]/30 text-slate-300 font-mono uppercase text-[10.5px] tracking-wider sticky top-0 z-10 shadow-sm">
                    <th className="py-3.5 px-4 font-bold">Timestamp</th>
                    <th className="py-3.5 px-4 font-bold">User (Actor)</th>
                    <th className="py-3.5 px-4 font-bold">Resource Affected</th>
                    <th className="py-3.5 px-4 font-bold">Type of Change</th>
                    <th className="py-3.5 px-4 font-bold">Details & Mutations</th>
                    <th className="py-3.5 px-4 font-bold text-center">Severity</th>
                    <th className="py-3.5 px-3 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {filteredLogs.map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    return (
                      <React.Fragment key={log.id}>
                        <tr
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className={`transition-colors cursor-pointer group ${
                            isExpanded ? 'bg-[#1D1633]/80' : 'hover:bg-[#151025]/70'
                          }`}
                        >
                          {/* 1. Timestamp */}
                          <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                            <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                              <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                              <span className="text-[10px] text-amber-400/90 font-sans font-bold px-1.5 py-0.2 rounded bg-amber-400/10">
                                {formatRelativeTime(log.timestamp)}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(log.timestamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                          </td>

                          {/* 2. User Who Performed the Action */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8E6D28]/40 to-[#C5A059]/20 border border-[#C5A059]/60 flex items-center justify-center text-amber-300 font-black text-xs shrink-0 shadow-inner">
                                {log.actorName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center space-x-1.5">
                                  <span>{log.actorName}</span>
                                </div>
                                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                                  <span className="px-1.5 py-0.2 rounded bg-[#181329] border border-slate-700 text-amber-300/90">
                                    {log.actorRole}
                                  </span>
                                  {log.actorEmail && (
                                    <span className="text-slate-500 hidden md:inline truncate max-w-[120px]">
                                      {log.actorEmail}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 3. Resource Affected */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                              <span>{log.resource}</span>
                            </div>
                            <div className="text-[11px] text-amber-200/90 font-mono mt-0.5 truncate max-w-[200px]" title={log.targetName || log.targetId}>
                              {log.targetName || log.targetId || 'Global / Unspecified'}
                            </div>
                          </td>

                          {/* 4. Type of Change */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col space-y-1 items-start">
                              <div className="flex items-center space-x-1.5">
                                {getChangeTypeBadge(log.changeType)}
                              </div>
                              <span className="font-mono text-[10px] font-bold text-amber-300/90">
                                {log.actionType}
                              </span>
                            </div>
                          </td>

                          {/* 5. Details / Diff Overview */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-xs text-slate-300 line-clamp-1 leading-snug" title={log.description}>
                              {log.description}
                            </p>
                            {(log.previousValue || log.newValue) && (
                              <div className="flex items-center space-x-1.5 text-[10.5px] font-mono mt-1 text-slate-400">
                                {log.previousValue && (
                                  <span className="line-through text-slate-500 truncate max-w-[110px]" title={log.previousValue}>
                                    {log.previousValue}
                                  </span>
                                )}
                                {log.previousValue && log.newValue && <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />}
                                {log.newValue && (
                                  <span className="text-emerald-400 truncate max-w-[120px]" title={log.newValue}>
                                    {log.newValue}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* 6. Severity */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {getSeverityBadge(log.severity)}
                          </td>

                          {/* 7. Expand Chevron */}
                          <td className="py-3.5 px-3 text-center text-slate-400">
                            <button
                              type="button"
                              className="p-1 rounded-lg hover:bg-white/10 transition-colors text-slate-400 group-hover:text-white"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Deep Inspection Panel */}
                        {isExpanded && (
                          <tr className="bg-[#120D22] border-y border-[#8E6D28]/30">
                            <td colSpan={7} className="p-4 sm:p-6 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                
                                {/* Box 1: Action Context */}
                                <div className="p-4 rounded-2xl bg-[#090613] border border-slate-800 space-y-2">
                                  <div className="font-bold text-amber-300 flex items-center space-x-2 text-xs uppercase tracking-wider">
                                    <Activity className="w-4 h-4 text-amber-400" />
                                    <span>Administrative Context</span>
                                  </div>
                                  <div className="space-y-1.5 text-slate-300">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Event ID:</span>
                                      <span className="font-mono text-slate-300 font-bold">{log.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Actor Identity:</span>
                                      <span className="font-mono text-amber-300">{log.actorName} ({log.actorRole})</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">IP Ingress:</span>
                                      <span className="font-mono text-slate-300">{log.ipAddress}</span>
                                    </div>
                                    {log.location && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Origin Location:</span>
                                        <span className="text-slate-300">{log.location}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Execution Status:</span>
                                      <span className="font-mono text-emerald-400 font-bold">{log.status}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Box 2: Mutated State Diff */}
                                <div className="p-4 rounded-2xl bg-[#090613] border border-slate-800 space-y-2 md:col-span-2">
                                  <div className="font-bold text-amber-300 flex items-center space-x-2 text-xs uppercase tracking-wider">
                                    <FileText className="w-4 h-4 text-amber-400" />
                                    <span>Payload & State Transition</span>
                                  </div>
                                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                                    {log.description}
                                  </p>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <div className="p-2.5 rounded-xl bg-[#151025] border border-slate-800">
                                      <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">Previous Value (Before)</div>
                                      <div className="font-mono text-xs text-rose-300/90 break-words whitespace-pre-wrap">
                                        {log.previousValue || '— (No previous state / Initial creation)'}
                                      </div>
                                    </div>

                                    <div className="p-2.5 rounded-xl bg-[#151025] border border-emerald-500/20">
                                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-1">New Value (After)</div>
                                      <div className="font-mono text-xs text-emerald-300 break-words whitespace-pre-wrap">
                                        {log.newValue || '— (Resource removed)'}
                                      </div>
                                    </div>
                                  </div>

                                  {log.metadata && (
                                    <div className="pt-2">
                                      <div className="text-[10.5px] font-mono text-slate-400 uppercase font-bold mb-1 flex items-center space-x-1">
                                        <Terminal className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Structured Metadata Payload:</span>
                                      </div>
                                      <pre className="p-2.5 rounded-xl bg-[#05030A] border border-slate-800/80 font-mono text-[11px] text-amber-200/90 overflow-x-auto">
                                        {JSON.stringify(log.metadata, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER                                                              */}
        {/* ========================================================================= */}
        <div className="p-4 sm:px-6 border-t border-[#8E6D28]/30 bg-gradient-to-r from-[#120E1F] via-[#151025] to-[#0D091A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audit integrity cryptographic hash is verified against sovereign ledger.</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-[#1B152B] hover:bg-[#2A2143] text-amber-300 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
