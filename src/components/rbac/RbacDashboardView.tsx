import React, { useState, useMemo } from 'react';
import { 
  Users, Shield, Key, Lock, CheckCircle2, XCircle, Search, Filter, 
  Plus, Edit3, Trash2, RefreshCw, Download, Eye, AlertTriangle, 
  Layers, UserCheck, ShieldAlert, Cpu, Terminal, Check, X, 
  Globe, Clock, Smartphone, Mail, Database, FileText, BarChart2,
  ChevronRight, ArrowRight, UserX, Unlock, Sparkles, UserPlus, Info,
  Activity, Zap, Gauge, Server
} from 'lucide-react';
import { 
  RbacModule, 
  RbacAction, 
  RbacUser, 
  RoleDefinition, 
  UserGroup, 
  AuditLogEntry, 
  PermissionEffect 
} from '../../types/rbac';
import { 
  ALL_MODULES, 
  ALL_ACTIONS, 
  SYSTEM_PERMISSIONS, 
  INITIAL_ROLES, 
  INITIAL_USERS, 
  INITIAL_GROUPS, 
  INITIAL_AUDIT_LOGS, 
  evaluateUserPermission, 
  canActorModifyTarget, 
  DATABASE_SCHEMA_SQL 
} from '../../lib/rbacEngine';
import { ROLE_RATE_LIMIT_TIERS } from '../../lib/rateLimitEngine';

interface RbacDashboardViewProps {
  onBackToApp?: () => void;
}

export const RbacDashboardView: React.FC<RbacDashboardViewProps> = ({ onBackToApp }) => {
  // Navigation sub-tabs
  const [activeTab, setActiveTab] = useState<
    'users' | 'roles' | 'matrix' | 'groups' | 'audit' | 'tester' | 'ratelimit' | 'architecture'
  >('users');

  // RBAC State
  const [users, setUsers] = useState<RbacUser[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [groups, setGroups] = useState<UserGroup[]>(INITIAL_GROUPS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Active simulated actor (who is currently using the admin dashboard)
  const [currentActorId, setCurrentActorId] = useState<string>('usr-100'); // Alexander Ross (Super Admin)
  const currentActor = useMemo(() => users.find((u) => u.id === currentActorId) || users[0], [users, currentActorId]);
  const currentActorRole = useMemo(() => roles.find((r) => r.id === currentActor.roleId) || roles[0], [roles, currentActor]);

  // Search & Filters for Users
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  // Modals & Drawers
  const [selectedUser, setSelectedUser] = useState<RbacUser | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isUserPermissionsModalOpen, setIsUserPermissionsModalOpen] = useState(false);
  const [isViewHistoryModalOpen, setIsViewHistoryModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  // Roles management state
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<string>('role-admin');
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // Groups management state
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Tester Simulator State
  const [testUserId, setTestUserId] = useState<string>('usr-104'); // John Doe (Editor with override)
  const [testModule, setTestModule] = useState<RbacModule>('reports');
  const [testAction, setTestAction] = useState<RbacAction>('export');

  // Rate Limiting Simulator State
  const [rateLimitSimRole, setRateLimitSimRole] = useState<string>('Guest');
  const [rateLimitCategory, setRateLimitCategory] = useState<'general' | 'ai' | 'payment'>('general');
  const [simulatedRequestLogs, setSimulatedRequestLogs] = useState<{
    id: string;
    timestamp: string;
    status: number;
    endpoint: string;
    remaining: number;
    limit: number;
    resetSeconds: number;
    role: string;
  }[]>([]);
  const [rateLimitUsageCounts, setRateLimitUsageCounts] = useState<Record<string, number>>({});

  const handleSimulateApiCall = (burstCount: number = 1) => {
    const tier = ROLE_RATE_LIMIT_TIERS[rateLimitSimRole] || ROLE_RATE_LIMIT_TIERS['Guest'];
    let limit = tier.maxRequests;
    if (rateLimitCategory === 'ai') limit = tier.maxAiRequests;
    if (rateLimitCategory === 'payment') limit = tier.maxPaymentRequests;

    const key = `${rateLimitSimRole}:${rateLimitCategory}`;
    let currentUsage = rateLimitUsageCounts[key] || 0;

    const newLogs = [];
    for (let i = 0; i < burstCount; i++) {
      const allowed = currentUsage < limit && rateLimitSimRole !== 'Suspended';
      const status = allowed ? 200 : 429;
      if (allowed) {
        currentUsage++;
      }
      const remaining = Math.max(0, limit - currentUsage);
      newLogs.unshift({
        id: `req-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        status,
        endpoint: rateLimitCategory === 'ai' ? '/api/obelisk/query' : rateLimitCategory === 'payment' ? '/api/payment/checkout' : '/api/users',
        remaining,
        limit,
        resetSeconds: 58,
        role: rateLimitSimRole,
      });
    }

    setRateLimitUsageCounts((prev) => ({ ...prev, [key]: currentUsage }));
    setSimulatedRequestLogs((prev) => [...newLogs, ...prev].slice(0, 30));

    if (currentUsage >= limit || rateLimitSimRole === 'Suspended') {
      showToast(`429 Too Many Requests: Rate limit exceeded for role "${rateLimitSimRole}" on ${rateLimitCategory} endpoints.`, 'error');
    } else {
      showToast(`Simulated ${burstCount} request(s) for ${rateLimitSimRole} (${currentUsage}/${limit} consumed).`, 'success');
    }
  };

  const handleResetRateLimitCounters = () => {
    setRateLimitUsageCounts({});
    setSimulatedRequestLogs([]);
    showToast('Rate limit bucket counters and sliding window reset to 0.', 'info');
  };

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Log an audit action
  const logAudit = (
    action: string,
    resource: string,
    targetId?: string,
    targetName?: string,
    previousValue?: string,
    newValue?: string,
    severity: 'info' | 'warning' | 'critical' = 'info'
  ) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      actorId: currentActor.id,
      actorName: currentActor.name,
      actorRole: currentActorRole.name,
      action,
      resource,
      targetId,
      targetName,
      previousValue,
      newValue,
      ipAddress: currentActor.lastLoginIp || '192.168.1.100',
      timestamp: new Date().toISOString(),
      severity,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phoneNumber && u.phoneNumber.includes(searchQuery));
      const matchesRole = roleFilter === 'all' || u.roleId === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchesGroup = groupFilter === 'all' || u.groupIds.includes(groupFilter);
      return matchesSearch && matchesRole && matchesStatus && matchesGroup;
    });
  }, [users, searchQuery, roleFilter, statusFilter, groupFilter]);

  // Form State for Adding User
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    roleId: 'role-student',
    status: 'Active' as const,
    twoFactorEnabled: false,
    groupIds: [] as string[],
  });

  // Handler: Add User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      showToast('Name and Email are required.', 'error');
      return;
    }

    const assignedRole = roles.find((r) => r.id === newUserForm.roleId);
    if (assignedRole?.isSuperAdmin && !currentActorRole.isSuperAdmin) {
      showToast('Privilege Escalation Blocked: Only Super Admins can assign Super Admin role.', 'error');
      return;
    }

    const created: RbacUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUserForm.name,
      email: newUserForm.email,
      phoneNumber: newUserForm.phoneNumber,
      roleId: newUserForm.roleId,
      status: newUserForm.status,
      twoFactorEnabled: newUserForm.twoFactorEnabled,
      userPermissions: {},
      groupIds: newUserForm.groupIds,
      loginHistory: [
        {
          timestamp: new Date().toISOString(),
          ip: '192.168.1.1',
          userAgent: 'System Provisioned',
          status: 'Success',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => [created, ...prev]);
    logAudit(
      'USER_CREATED',
      'users',
      created.id,
      created.name,
      'None',
      `Created as ${assignedRole?.name || 'User'}`,
      'info'
    );
    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      phoneNumber: '',
      roleId: 'role-student',
      status: 'Active',
      twoFactorEnabled: false,
      groupIds: [],
    });
    showToast(`User ${created.name} successfully created!`);
  };

  // Handler: Suspend / Restore User
  const handleToggleSuspendUser = (target: RbacUser) => {
    const targetRole = roles.find((r) => r.id === target.roleId) || roles[0];
    const check = canActorModifyTarget(currentActor, target, currentActorRole, targetRole);
    if (!check.allowed) {
      showToast(`Action Blocked: ${check.reason}`, 'error');
      return;
    }

    const nextStatus = target.status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers((prev) =>
      prev.map((u) => (u.id === target.id ? { ...u, status: nextStatus, updatedAt: new Date().toISOString() } : u))
    );

    logAudit(
      nextStatus === 'Suspended' ? 'USER_SUSPENDED' : 'USER_RESTORED',
      'users',
      target.id,
      target.name,
      `Status: ${target.status}`,
      `Status: ${nextStatus}`,
      nextStatus === 'Suspended' ? 'critical' : 'info'
    );
    showToast(`User ${target.name} status updated to ${nextStatus}.`);
  };

  // Handler: Delete User
  const handleDeleteUser = (target: RbacUser) => {
    const targetRole = roles.find((r) => r.id === target.roleId) || roles[0];
    const check = canActorModifyTarget(currentActor, target, currentActorRole, targetRole);
    if (!check.allowed) {
      showToast(`Action Blocked: ${check.reason}`, 'error');
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete user "${target.name}"?`)) {
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== target.id));
    logAudit(
      'USER_DELETED',
      'users',
      target.id,
      target.name,
      `Role: ${targetRole.name}, Email: ${target.email}`,
      'Permanently Deleted',
      'critical'
    );
    showToast(`User ${target.name} deleted.`);
  };

  // Handler: Reset Password
  const handleResetPassword = () => {
    if (!selectedUser) return;
    const tempPass = `Axum#${Math.floor(100000 + Math.random() * 900000)}`;
    logAudit(
      'PASSWORD_RESET_TRIGGERED',
      'users',
      selectedUser.id,
      selectedUser.name,
      'Old Password Hash',
      'Temporary OTP / Hash Generated',
      'warning'
    );
    setIsResetPasswordModalOpen(false);
    showToast(`Temporary security password generated for ${selectedUser.name}: ${tempPass}`, 'info');
  };

  // Handler: Toggle Permission for Role
  const handleToggleRolePermission = (roleId: string, permissionId: string) => {
    const targetRole = roles.find((r) => r.id === roleId);
    if (!targetRole) return;

    if (targetRole.isSuperAdmin) {
      showToast('Super Admin role has immutable full system permissions.', 'error');
      return;
    }

    if (!currentActorRole.isSuperAdmin && !currentActorRole.permissions['roles.edit']) {
      showToast('Permission Denied: You need roles.edit permission to modify roles.', 'error');
      return;
    }

    const currentVal = !!targetRole.permissions[permissionId];
    const nextVal = !currentVal;

    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === roleId) {
          const nextPerms = { ...r.permissions };
          if (nextVal) nextPerms[permissionId] = true;
          else delete nextPerms[permissionId];
          return { ...r, permissions: nextPerms, updatedAt: new Date().toISOString() };
        }
        return r;
      })
    );

    logAudit(
      'ROLE_PERMISSIONS_UPDATED',
      'roles',
      targetRole.id,
      targetRole.name,
      `${permissionId}: ${currentVal}`,
      `${permissionId}: ${nextVal}`,
      'warning'
    );
  };

  // Handler: Create Custom Role
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      showToast('Role name is required', 'error');
      return;
    }

    if (!currentActorRole.isSuperAdmin) {
      showToast('Only Super Admins are authorized to create new system roles.', 'error');
      return;
    }

    const newRole: RoleDefinition = {
      id: `role-${newRoleName.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-3)}`,
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || 'Custom user role configured by administrator.',
      isSystem: false,
      permissions: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRoles((prev) => [...prev, newRole]);
    logAudit('ROLE_CREATED', 'roles', newRole.id, newRole.name, 'None', 'Role created', 'info');
    setIsCreateRoleModalOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
    setSelectedRoleForMatrix(newRole.id);
    showToast(`Role "${newRole.name}" created! You can now configure its permission matrix.`);
  };

  // Handler: Delete Custom Role
  const handleDeleteRole = (roleToDelete: RoleDefinition) => {
    if (roleToDelete.isSystem) {
      showToast('System roles cannot be deleted.', 'error');
      return;
    }
    if (!currentActorRole.isSuperAdmin) {
      showToast('Only Super Admins can delete roles.', 'error');
      return;
    }

    const assignedCount = users.filter((u) => u.roleId === roleToDelete.id).length;
    if (assignedCount > 0) {
      showToast(`Cannot delete role: ${assignedCount} user(s) are currently assigned to this role.`, 'error');
      return;
    }

    setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
    logAudit('ROLE_DELETED', 'roles', roleToDelete.id, roleToDelete.name, 'Existing role', 'Deleted', 'critical');
    showToast(`Role "${roleToDelete.name}" deleted.`);
  };

  // Handler: Create Team Group
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      showToast('Group name is required.', 'error');
      return;
    }

    const newGroup: UserGroup = {
      id: `grp-${newGroupName.toLowerCase().replace(/\s+/g, '-')}`,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || 'Collaborative team group.',
      memberUserIds: [],
      permissions: {},
      createdAt: new Date().toISOString(),
    };

    setGroups((prev) => [...prev, newGroup]);
    logAudit('GROUP_CREATED', 'groups', newGroup.id, newGroup.name, 'None', 'Team group created', 'info');
    setIsCreateGroupModalOpen(false);
    setNewGroupName('');
    setNewGroupDesc('');
    showToast(`Group "${newGroup.name}" created.`);
  };

  // Handler: Toggle Specific User Permission Override (Allow, Deny, Inherit)
  const handleSetUserPermissionEffect = (userId: string, permissionId: string, effect: PermissionEffect | 'inherit') => {
    if (!currentActorRole.isSuperAdmin) {
      showToast('Only Super Admins can set individual user permission overrides.', 'error');
      return;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextUserPerms = { ...u.userPermissions };
          if (effect === 'inherit') {
            delete nextUserPerms[permissionId];
          } else {
            nextUserPerms[permissionId] = effect;
          }
          return { ...u, userPermissions: nextUserPerms, updatedAt: new Date().toISOString() };
        }
        return u;
      })
    );

    const targetUser = users.find((u) => u.id === userId);
    logAudit(
      'USER_PERMISSION_OVERRIDE_CHANGED',
      'permissions',
      userId,
      targetUser?.name,
      `${permissionId}: ${targetUser?.userPermissions[permissionId] || 'inherit'}`,
      `${permissionId}: ${effect}`,
      effect === 'deny' ? 'critical' : 'warning'
    );
  };

  // Active Role in Matrix
  const currentMatrixRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleForMatrix) || roles[0];
  }, [roles, selectedRoleForMatrix]);

  // Simulation outcome
  const testUser = useMemo(() => users.find((u) => u.id === testUserId) || users[0], [users, testUserId]);
  const testUserRole = useMemo(() => roles.find((r) => r.id === testUser.roleId) || roles[0], [roles, testUser]);
  const testResolution = useMemo(() => {
    return evaluateUserPermission(testUser, `${testModule}.${testAction}`, roles, groups);
  }, [testUser, testModule, testAction, roles, groups]);

  return (
    <div className="min-h-screen bg-[#07060A] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div 
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold border animate-bounce ${
            toastMessage.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-600'
              : toastMessage.type === 'warning'
              ? 'bg-amber-950/90 text-amber-200 border-amber-500'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header & Simulation Identity Bar */}
      <div className="bg-[#0E0C15] border border-[#8E6D28]/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center space-x-2">
                  <span>ENTERPRISE RBAC & USER MANAGEMENT</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                    PRODUCTION READY
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Granular multi-tenant role-based access control, individual overrides, team grouping, and immutable audit logs.
                </p>
              </div>
            </div>
          </div>

          {/* Active Admin Persona Switcher (For live testing privilege escalation & RBAC enforcement) */}
          <div className="bg-[#151220] border border-amber-500/30 p-3 rounded-2xl flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                Acting Administrator:
              </span>
            </div>
            <select
              value={currentActorId}
              onChange={(e) => {
                setCurrentActorId(e.target.value);
                const a = users.find((u) => u.id === e.target.value);
                showToast(`Switched active administrator view to ${a?.name}`, 'info');
              }}
              aria-label="Acting Administrator"
              className="bg-[#0B0912] border border-[#8E6D28]/40 text-xs text-slate-100 rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
            >
              {users.map((u) => {
                const r = roles.find((role) => role.id === u.roleId);
                return (
                  <option key={u.id} value={u.id}>
                    {u.name} ({r?.name || 'User'}) {r?.isSuperAdmin ? '⭐ Super Admin' : ''}
                  </option>
                );
              })}
            </select>

            {onBackToApp && (
              <button
                type="button"
                onClick={onBackToApp}
                className="px-3 py-1.5 bg-[#1F1A2C] hover:bg-[#2B243D] text-slate-300 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer transition-colors"
              >
                Back to App
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {[
            { id: 'users', label: '1. Users Management', icon: Users, count: users.length },
            { id: 'roles', label: '2. Roles Catalog', icon: Shield, count: roles.length },
            { id: 'matrix', label: '3. Permission Matrix', icon: Key },
            { id: 'groups', label: '4. User Groups & Teams', icon: Layers, count: groups.length },
            { id: 'audit', label: '5. Audit Trail Logs', icon: Clock, count: auditLogs.length },
            { id: 'tester', label: '6. Permission Evaluator', icon: Sparkles },
            { id: 'ratelimit', label: '7. Rate Limiter & Abuse Guard', icon: Activity },
            { id: 'architecture', label: '8. Database & API Specs', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DCA83D] to-[#F3C65D] text-black shadow-lg font-black'
                    : 'bg-[#13101C] text-slate-400 hover:text-slate-100 hover:bg-[#1A1627] border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-black/20 text-black' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USER MANAGEMENT                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          {/* Action & Filter Bar */}
          <div className="bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by user name, email, phone..."
                  className="w-full bg-[#151220] border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filter by Role"
                className="bg-[#151220] border border-slate-800 text-xs text-slate-300 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Roles ({roles.length})</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by Status"
                className="bg-[#151220] border border-slate-800 text-xs text-slate-300 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>

              {/* Group Filter */}
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                aria-label="Filter by Group"
                className="bg-[#151220] border border-slate-800 text-xs text-slate-300 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Teams/Groups</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add User Button */}
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2.5 bg-[#DCA83D] hover:bg-[#F3C65D] text-black font-black text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New User</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#151220] border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">User Details</th>
                    <th className="py-3.5 px-4">Role & Status</th>
                    <th className="py-3.5 px-4">Teams / Groups</th>
                    <th className="py-3.5 px-4">Security / 2FA</th>
                    <th className="py-3.5 px-4">Individual Overrides</th>
                    <th className="py-3.5 px-4">Last Activity</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {filteredUsers.map((user) => {
                    const role = roles.find((r) => r.id === user.roleId) || roles[0];
                    const userGroupsList = groups.filter((g) => user.groupIds.includes(g.id));
                    const overrideCount = Object.keys(user.userPermissions || {}).length;

                    return (
                      <tr key={user.id} className="hover:bg-[#151220]/60 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8E6D28] to-[#1E1408] border border-amber-500/40 flex items-center justify-center font-bold text-white text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center space-x-1.5">
                                <span>{user.name}</span>
                                {role.isSuperAdmin && (
                                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/40 font-mono">
                                    SUPER
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                              {user.phoneNumber && (
                                <div className="text-[10px] text-slate-500 font-mono">{user.phoneNumber}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold text-[11px]">
                              {role.name}
                            </span>
                            <div>
                              <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                user.status === 'Active'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : user.status === 'Suspended'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/40'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  user.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'
                                }`} />
                                <span>{user.status}</span>
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {userGroupsList.length > 0 ? (
                              userGroupsList.map((g) => (
                                <span
                                  key={g.id}
                                  className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-lg border border-cyan-500/30"
                                >
                                  {g.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-600 italic">No team assigned</span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {user.twoFactorEnabled ? (
                              <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-bold">
                                <Lock className="w-3.5 h-3.5" />
                                <span>2FA Active</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Disabled</span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {overrideCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsUserPermissionsModalOpen(true);
                              }}
                              className="text-[11px] text-amber-400 underline font-mono cursor-pointer"
                            >
                              {overrideCount} Explicit Override(s)
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsUserPermissionsModalOpen(true);
                              }}
                              className="text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
                            >
                              + Add Override
                            </button>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-[11px] text-slate-300 font-mono">
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            IP: {user.lastLoginIp || 'None'}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* View Login History */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsViewHistoryModalOpen(true);
                              }}
                              title="View Profile & Login History"
                              className="p-2 bg-[#1C182A] hover:bg-[#28223D] text-slate-300 rounded-xl cursor-pointer transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Reset Password */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsResetPasswordModalOpen(true);
                              }}
                              title="Reset Password"
                              className="p-2 bg-[#1C182A] hover:bg-[#28223D] text-amber-400 rounded-xl cursor-pointer transition-colors"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            {/* Suspend / Restore */}
                            <button
                              type="button"
                              onClick={() => handleToggleSuspendUser(user)}
                              title={user.status === 'Suspended' ? 'Restore User' : 'Suspend User'}
                              className={`p-2 rounded-xl cursor-pointer transition-colors ${
                                user.status === 'Suspended'
                                  ? 'bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300'
                                  : 'bg-amber-900/30 hover:bg-amber-800/50 text-amber-400'
                              }`}
                            >
                              {user.status === 'Suspended' ? (
                                <Unlock className="w-3.5 h-3.5" />
                              ) : (
                                <UserX className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Delete User */}
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user)}
                              title="Delete User"
                              className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-xl cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ROLE MANAGEMENT CATALOG                                            */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl p-5">
            <div>
              <h2 className="text-base font-bold text-white">System & Custom Roles Catalog</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define access templates and authority boundaries across 14 distinct system modules.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateRoleModalOpen(true)}
              className="px-4 py-2.5 bg-[#DCA83D] hover:bg-[#F3C65D] text-black font-black text-xs rounded-2xl shadow-lg flex items-center space-x-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => {
              const assignedUsers = users.filter((u) => u.roleId === role.id);
              const permissionCount = Object.keys(role.permissions).length;

              return (
                <div
                  key={role.id}
                  className="bg-[#0E0C15] border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base text-white flex items-center space-x-2">
                        <span>{role.name}</span>
                        {role.isSuperAdmin && <Sparkles className="w-4 h-4 text-amber-400" />}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        role.isSystem ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        {role.isSystem ? 'SYSTEM' : 'CUSTOM'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed min-h-[38px]">
                      {role.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                      <span className="text-slate-500">Active Users:</span>
                      <span className="font-mono font-bold text-slate-200">{assignedUsers.length}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Allowed Permissions:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {role.isSuperAdmin ? 'ALL (112 / 112)' : `${permissionCount} Granted`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center space-x-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleForMatrix(role.id);
                        setActiveTab('matrix');
                      }}
                      className="flex-1 py-2 bg-[#1C182A] hover:bg-[#2B243D] text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Edit Matrix</span>
                    </button>

                    {!role.isSystem && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(role)}
                        title="Delete Role"
                        className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-xl cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PERMISSION MATRIX                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-4 animate-fade-in">
          {/* Matrix Controls */}
          <div className="bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Permission Matrix for Role:</span>
                <span className="text-amber-400 font-black underline">{currentMatrixRole.name}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle module-level capabilities. Super Admin maintains full universal access.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-400 font-mono">Select Role:</span>
              <select
                value={selectedRoleForMatrix}
                onChange={(e) => setSelectedRoleForMatrix(e.target.value)}
                aria-label="Select Role for Matrix"
                className="bg-[#151220] border border-amber-500/40 text-xs text-slate-100 rounded-2xl px-4 py-2.5 focus:outline-none focus:border-amber-400 font-bold"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.isSuperAdmin ? '⭐ (Super Admin)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="bg-[#151220] border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-4 px-6 text-left min-w-[180px]">Module</th>
                    {ALL_ACTIONS.map((action) => (
                      <th key={action.id} className="py-4 px-3 min-w-[90px]">
                        {action.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-200">
                  {ALL_MODULES.map((mod) => (
                    <tr key={mod.id} className="hover:bg-[#151220]/40 transition-colors">
                      <td className="py-3.5 px-6 text-left font-bold text-white flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="capitalize">{mod.label}</span>
                      </td>

                      {ALL_ACTIONS.map((act) => {
                        const permId = `${mod.id}.${act.id}`;
                        const isGranted = currentMatrixRole.isSuperAdmin || !!currentMatrixRole.permissions[permId];

                        return (
                          <td key={act.id} className="py-3.5 px-3">
                            <button
                              type="button"
                              onClick={() => handleToggleRolePermission(currentMatrixRole.id, permId)}
                              disabled={currentMatrixRole.isSuperAdmin}
                              title={`${isGranted ? 'Revoke' : 'Grant'} ${act.label} on ${mod.label}`}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto transition-all ${
                                currentMatrixRole.isSuperAdmin
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-not-allowed opacity-90'
                                  : isGranted
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:scale-110 cursor-pointer shadow-sm'
                                  : 'bg-slate-900/60 text-slate-600 border border-slate-800 hover:border-slate-600 cursor-pointer'
                              }`}
                            >
                              {isGranted ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: USER GROUPS & TEAMS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'groups' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl p-5">
            <div>
              <h2 className="text-base font-bold text-white">Department Teams & User Groups</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Organize users into multi-tenant organizational units with shared group permission cascades.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateGroupModalOpen(true)}
              className="px-4 py-2.5 bg-[#DCA83D] hover:bg-[#F3C65D] text-black font-black text-xs rounded-2xl shadow-lg flex items-center space-x-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Team</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => {
              const members = users.filter((u) => group.memberUserIds.includes(u.id) || u.groupIds.includes(group.id));
              const groupPermCount = Object.keys(group.permissions || {}).length;

              return (
                <div
                  key={group.id}
                  className="bg-[#0E0C15] border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base text-white flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>{group.name}</span>
                      </span>
                      <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                        {members.length} Members
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                      {group.description}
                    </p>

                    <div className="pt-2 space-y-1.5 border-t border-slate-800">
                      <div className="text-[11px] font-bold text-slate-300">Team Members:</div>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {members.length > 0 ? (
                          members.map((m) => (
                            <span key={m.id} className="text-[10px] bg-[#1A1627] text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                              {m.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">No assigned members</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 text-xs flex justify-between border-t border-slate-800">
                      <span className="text-slate-500">Group Permissions:</span>
                      <span className="font-mono text-cyan-300 font-bold">{groupPermCount} Added</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AUDIT LOGS                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl p-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Immutable Security Audit Log</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every privilege modification, user suspension, role assignment, and permission override is tracked.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(auditLogs, null, 2)
                )}`;
                const a = document.createElement('a');
                a.href = jsonStr;
                a.download = `rbac-audit-logs-${Date.now()}.json`;
                a.click();
                showToast('Audit log exported to JSON.');
              }}
              className="px-4 py-2 bg-[#1C182A] hover:bg-[#2B243D] text-amber-400 border border-amber-500/40 font-bold text-xs rounded-2xl flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Logs (JSON)</span>
            </button>
          </div>

          <div className="bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#151220] border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Timestamp & IP</th>
                    <th className="py-3.5 px-4">Actor</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">Target Resource</th>
                    <th className="py-3.5 px-4">Previous Value</th>
                    <th className="py-3.5 px-4">New Value</th>
                    <th className="py-3.5 px-4">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#151220]/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="text-slate-300">{new Date(log.timestamp).toLocaleTimeString()}</div>
                        <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleDateString()} • {log.ipAddress}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{log.actorName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-amber-300 text-[11px]">
                        {log.action}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">{log.targetName || log.targetId || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Module: {log.resource}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 max-w-[150px] truncate" title={log.previousValue}>
                        {log.previousValue || '—'}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-emerald-400 max-w-[150px] truncate" title={log.newValue}>
                        {log.newValue || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                          log.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : log.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: PERMISSION TESTER & SIMULATOR                                      */}
      {/* ========================================================================= */}
      {activeTab === 'tester' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl p-5 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Effective Permission Evaluator & Simulator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Test how the RBAC engine resolves permissions for any user in real-time. Understand how user status, role defaults, team groups, and explicit overrides interact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="bg-[#0E0C15] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                1. Select Test Subject & Action
              </h3>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-bold">
                  Target User:
                </label>
                <select
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  className="w-full bg-[#151220] border border-slate-800 text-xs text-slate-100 rounded-2xl p-3 focus:outline-none focus:border-amber-400"
                >
                  {users.map((u) => {
                    const r = roles.find((role) => role.id === u.roleId);
                    return (
                      <option key={u.id} value={u.id}>
                        {u.name} ({r?.name}) [{u.status}]
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-bold">
                  System Module:
                </label>
                <select
                  value={testModule}
                  onChange={(e) => setTestModule(e.target.value as RbacModule)}
                  className="w-full bg-[#151220] border border-slate-800 text-xs text-slate-100 rounded-2xl p-3 focus:outline-none focus:border-amber-400"
                >
                  {ALL_MODULES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({m.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-bold">
                  Action Capability:
                </label>
                <select
                  value={testAction}
                  onChange={(e) => setTestAction(e.target.value as RbacAction)}
                  className="w-full bg-[#151220] border border-slate-800 text-xs text-slate-100 rounded-2xl p-3 focus:outline-none focus:border-amber-400"
                >
                  {ALL_ACTIONS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} ({a.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#151220] p-3 rounded-2xl border border-slate-800 text-[11px] space-y-1 font-mono">
                <div className="text-slate-400">Evaluating Permission Key:</div>
                <div className="text-amber-400 font-bold text-xs">{testModule}.{testAction}</div>
              </div>
            </div>

            {/* Resolution Breakdown Result */}
            <div className="lg:col-span-2 bg-[#0E0C15] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Evaluation Resolution Output</h3>
                  <p className="text-xs text-slate-400">Server-side middleware decision path</p>
                </div>

                <div className={`px-4 py-2 rounded-2xl font-mono font-black text-xs flex items-center space-x-2 ${
                  testResolution.hasAccess
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                }`}>
                  {testResolution.hasAccess ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span>{testResolution.hasAccess ? 'ACCESS GRANTED (200 OK)' : 'ACCESS DENIED (403 FORBIDDEN)'}</span>
                </div>
              </div>

              {/* Step by step ladder */}
              <div className="space-y-3">
                <div className="bg-[#151220] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">1</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Account Status Check</div>
                      <div className="text-[11px] text-slate-400">Target user is marked as <span className="font-bold">{testUser.status}</span></div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    testUser.status === 'Active' ? 'text-emerald-400 bg-emerald-500/20' : 'text-rose-400 bg-rose-500/20'
                  }`}>
                    {testUser.status === 'Active' ? 'PASSED' : 'BLOCKED'}
                  </span>
                </div>

                <div className="bg-[#151220] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">2</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">User-Specific Override Rule</div>
                      <div className="text-[11px] text-slate-400">
                        {testUser.userPermissions[`${testModule}.${testAction}`] 
                          ? `Explicit user override: ${testUser.userPermissions[`${testModule}.${testAction}`].toUpperCase()}`
                          : 'No user-specific override configured (falls through)'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300">
                    {testUser.userPermissions[`${testModule}.${testAction}`] || 'INHERITED'}
                  </span>
                </div>

                <div className="bg-[#151220] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">3</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Role & Group Permissions</div>
                      <div className="text-[11px] text-slate-400">
                        Role <span className="text-purple-300 font-bold">{testUserRole.name}</span> + {testUser.groupIds.length} assigned team groups
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300">
                    CHECKED
                  </span>
                </div>
              </div>

              {/* Summary note */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>Resolution Engine Explanation:</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px] pl-5">
                  {testResolution.explanation} (Resolution Source: {testResolution.source})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: RATE LIMITER & ABUSE GUARD                                         */}
      {/* ========================================================================= */}
      {activeTab === 'ratelimit' && (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="bg-[#0E0C15] border border-[#8E6D28]/40 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Server-Side Rate Limiter & Abuse Prevention Engine
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold">
                    ACTIVE ON ALL /api/* ROUTES
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Enforces role-tiered sliding-window request quotas for all authenticated users, background API callers, and anonymous guests.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleResetRateLimitCounters}
                  className="px-3.5 py-2 bg-[#1A1627] hover:bg-[#251F38] text-amber-400 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Sliding Windows</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              <div className="bg-[#14111E] border border-slate-800 p-4 rounded-2xl">
                <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Sliding Window</div>
                <div className="text-xl font-mono font-bold text-white mt-1">60 Seconds</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Continuous rolling window</div>
              </div>
              <div className="bg-[#14111E] border border-slate-800 p-4 rounded-2xl">
                <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Guest Quota (IP)</div>
                <div className="text-xl font-mono font-bold text-amber-400 mt-1">12 req/min</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Heavy AI: 3 req/min</div>
              </div>
              <div className="bg-[#14111E] border border-slate-800 p-4 rounded-2xl">
                <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Super Admin Quota</div>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-1">300 req/min</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Heavy AI: 60 req/min</div>
              </div>
              <div className="bg-[#14111E] border border-slate-800 p-4 rounded-2xl">
                <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Abuse Protection</div>
                <div className="text-xl font-mono font-bold text-cyan-400 mt-1">RFC 429</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Retry-After + X-RateLimit Headers</div>
              </div>
            </div>
          </div>

          {/* Interactive Simulator & Live Response Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Tester Controls */}
            <div className="lg:col-span-6 bg-[#0E0C15] border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-400">
                    Live Rate Limit Test Console
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Burst Simulation Engine</span>
              </div>

              {/* Persona / Role Selector */}
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 uppercase font-bold block">
                  Select Caller Persona / Role:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(ROLE_RATE_LIMIT_TIERS).map((roleName) => {
                    const isSelected = rateLimitSimRole === roleName;
                    const tier = ROLE_RATE_LIMIT_TIERS[roleName];
                    return (
                      <button
                        key={roleName}
                        type="button"
                        onClick={() => setRateLimitSimRole(roleName)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-md'
                            : 'bg-[#13101C] border-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{roleName}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {tier.maxRequests} req/m
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Endpoint Category Selector */}
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 uppercase font-bold block">
                  Target Endpoint Sensitivity:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'general', label: 'General APIs', desc: '/api/users, /api/roles' },
                    { id: 'ai', label: 'Heavy AI Models', desc: '/api/obelisk/query, /vision' },
                    { id: 'payment', label: 'Payment / Checkout', desc: '/api/payment/checkout' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setRateLimitCategory(cat.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        rateLimitCategory === cat.id
                          ? 'bg-amber-500/10 border-amber-500/60 text-white'
                          : 'bg-[#13101C] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{cat.label}</div>
                      <div className="text-[9px] font-mono text-slate-500 mt-0.5 truncate">{cat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quota Gauge Display */}
              {(() => {
                const tier = ROLE_RATE_LIMIT_TIERS[rateLimitSimRole] || ROLE_RATE_LIMIT_TIERS['Guest'];
                let max = tier.maxRequests;
                if (rateLimitCategory === 'ai') max = tier.maxAiRequests;
                if (rateLimitCategory === 'payment') max = tier.maxPaymentRequests;

                const key = `${rateLimitSimRole}:${rateLimitCategory}`;
                const consumed = rateLimitUsageCounts[key] || 0;
                const remaining = Math.max(0, max - consumed);
                const percent = max > 0 ? Math.min(100, Math.round((consumed / max) * 100)) : 100;
                const isExceeded = consumed >= max || rateLimitSimRole === 'Suspended';

                return (
                  <div className="bg-[#141020] border border-slate-800 p-4 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold">Quota Usage in Current Window:</span>
                      <span className="font-mono font-bold text-white">
                        {consumed} / {max} req ({remaining} remaining)
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isExceeded
                            ? 'bg-rose-500'
                            : percent > 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">Sliding Reset: ~58s remaining</span>
                      <span className={isExceeded ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {isExceeded ? 'STATUS 429 TOO MANY REQUESTS' : 'STATUS 200 OK'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Trigger Burst Actions */}
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 uppercase font-bold block">
                  Simulate Inbound Requests:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateApiCall(1)}
                    className="px-3 py-2.5 bg-[#1F1A2C] hover:bg-[#2A233D] text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer transition-colors text-center"
                  >
                    1 Single Req
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateApiCall(5)}
                    className="px-3 py-2.5 bg-[#1F1A2C] hover:bg-[#2A233D] text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 cursor-pointer transition-colors text-center"
                  >
                    5x Burst
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateApiCall(10)}
                    className="px-3 py-2.5 bg-[#1F1A2C] hover:bg-[#2A233D] text-amber-400 text-xs font-bold rounded-xl border border-amber-500/40 cursor-pointer transition-colors text-center"
                  >
                    10x Burst
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateApiCall(25)}
                    className="px-3 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/40 cursor-pointer transition-colors text-center"
                  >
                    25x Stress
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live HTTP Header & Log Inspector */}
            <div className="lg:col-span-6 bg-[#0E0C15] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-400">
                    HTTP Response Headers & Telemetry Stream
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {simulatedRequestLogs.length} events logged
                </span>
              </div>

              {simulatedRequestLogs.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <Gauge className="w-8 h-8 text-slate-700 mx-auto" />
                  <p className="text-xs">Click one of the burst buttons on the left to test rate limiting.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {simulatedRequestLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-2xl border text-xs font-mono space-y-1.5 transition-all ${
                        log.status === 429
                          ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                          : 'bg-[#14111E] border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === 429
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            }`}
                          >
                            HTTP {log.status}
                          </span>
                          <span className="text-slate-400 text-[11px] font-bold">{log.endpoint}</span>
                        </div>
                        <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400 bg-black/40 p-2 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-500 block">X-RateLimit-Limit:</span>
                          <span className="text-slate-200 font-bold">{log.limit}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">X-RateLimit-Remaining:</span>
                          <span className={log.remaining === 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {log.remaining}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">X-RateLimit-Reset:</span>
                          <span className="text-slate-200 font-bold">{log.resetSeconds}s</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Retry-After:</span>
                          <span className={log.status === 429 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                            {log.status === 429 ? `${log.resetSeconds}s` : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {log.status === 429 && (
                        <div className="text-[10px] text-rose-400 bg-rose-950/40 p-2 rounded-xl border border-rose-500/30">
                          <strong>429 Payload:</strong> ብዝሒ ጠለባት ካብ ዓቐን ንላዕሊ በዚሑ ኣሎ። Rate limit exceeded for role "{log.role}".
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full Role Quotas Matrix Table */}
          <div className="bg-[#0E0C15] border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  Server-Side Tier Configuration Reference
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Sliding Window: 60s</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                    <th className="py-3 px-4">User Role / Persona</th>
                    <th className="py-3 px-4">General API Quota</th>
                    <th className="py-3 px-4">Heavy AI Quota</th>
                    <th className="py-3 px-4">Payment & Checkout</th>
                    <th className="py-3 px-4">Window</th>
                    <th className="py-3 px-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {Object.entries(ROLE_RATE_LIMIT_TIERS).map(([roleKey, tier]) => (
                    <tr key={roleKey} className="hover:bg-[#14111E] transition-colors">
                      <td className="py-3 px-4 font-sans font-bold text-slate-200">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span>{tier.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        {tier.maxRequests} req/min
                      </td>
                      <td className="py-3 px-4 text-amber-400 font-bold">
                        {tier.maxAiRequests} req/min
                      </td>
                      <td className="py-3 px-4 text-cyan-400 font-bold">
                        {tier.maxPaymentRequests} req/min
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        60 seconds
                      </td>
                      <td className="py-3 px-4">
                        {tier.maxRequests === 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px]">
                            Blocked / 403
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px]">
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: DATABASE SCHEMA & API SPECIFICATIONS                               */}
      {/* ========================================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#0E0C15] border border-[#8E6D28]/30 rounded-3xl p-5 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span>Production Architecture, SQL DDL & Middleware</span>
            </h2>
            <p className="text-xs text-slate-400">
              Complete production database schema with indices, relational integrity, middleware decorators, and API routing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SQL DDL Schema */}
            <div className="bg-[#0E0C15] border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  1. PostgreSQL / SQL DDL Schema (10 Tables)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(DATABASE_SCHEMA_SQL);
                    showToast('SQL Schema copied to clipboard!');
                  }}
                  className="text-xs text-slate-400 hover:text-amber-400 flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Copy SQL</span>
                </button>
              </div>
              <pre className="bg-[#050408] border border-slate-800/80 p-4 rounded-2xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
                {DATABASE_SCHEMA_SQL}
              </pre>
            </div>

            {/* Middleware & API Specs */}
            <div className="bg-[#0E0C15] border border-slate-800 rounded-3xl p-5 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase block">
                2. Backend Authorization Middleware & Endpoints
              </span>
              <pre className="bg-[#050408] border border-slate-800/80 p-4 rounded-2xl text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-96 leading-relaxed">
{`// ==========================================
// BACKEND PERMISSION MIDDLEWARE (Express.js)
// ==========================================

export function requirePermission(permissionId: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Extracted from JWT token
    if (!user || user.status !== 'Active') {
      return res.status(401).json({ error: 'Unauthorized or account inactive' });
    }

    // Evaluate server-side effective permissions
    const decision = await rbacService.evaluate(user.id, permissionId);
    if (!decision.hasAccess) {
      await auditService.log({
        actorId: user.id,
        action: 'ACCESS_DENIED_BLOCKED',
        resource: permissionId,
        ipAddress: req.ip
      });
      return res.status(403).json({ 
        error: 'Forbidden: Insufficient privileges',
        requiredPermission: permissionId
      });
    }

    next();
  };
}

// ==========================================
// PROTECTED API ENDPOINT ROUTING
// ==========================================

router.post(
  '/api/v1/courses', 
  authenticateJWT, 
  requirePermission('courses.create'), 
  coursesController.create
);

router.post(
  '/api/v1/courses/:id/publish', 
  authenticateJWT, 
  requirePermission('courses.publish'), 
  coursesController.publish
);

router.get(
  '/api/v1/reports/export', 
  authenticateJWT, 
  requirePermission('reports.export'), 
  reportsController.exportCSV
);

router.put(
  '/api/v1/users/:id/permissions', 
  authenticateJWT, 
  requirePermission('permissions.manage'), 
  userController.updateUserOverrides
);`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD USER                                                           */}
      {/* ========================================================================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0E0C15] border border-[#8E6D28]/60 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>Create New User Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Mary Anderson"
                  className="w-full bg-[#151220] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="mary.a@axumite.ai"
                  className="w-full bg-[#151220] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                    Assign Role:
                  </label>
                  <select
                    value={newUserForm.roleId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, roleId: e.target.value })}
                    className="w-full bg-[#151220] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} {r.isSuperAdmin ? '(Super Admin)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                    Initial Status:
                  </label>
                  <select
                    value={newUserForm.status}
                    onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value as any })}
                    className="w-full bg-[#151220] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="twoFactorCheckbox"
                  checked={newUserForm.twoFactorEnabled}
                  onChange={(e) => setNewUserForm({ ...newUserForm, twoFactorEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-400"
                />
                <label htmlFor="twoFactorCheckbox" className="text-xs text-slate-300 font-bold">
                  Enforce Two-Factor Authentication (2FA) on initial login
                </label>
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#DCA83D] hover:bg-[#F3C65D] text-black font-black text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="py-3 px-4 bg-[#1C182A] text-slate-400 hover:text-white text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: USER EXPLICIT PERMISSION OVERRIDES (ALLOW / DENY)                   */}
      {/* ========================================================================= */}
      {isUserPermissionsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0E0C15] border border-[#8E6D28]/60 w-full max-w-2xl rounded-3xl p-6 space-y-4 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  <span>Individual Permission Overrides: {selectedUser.name}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Role: <span className="text-purple-300 font-bold">{roles.find(r => r.id === selectedUser.roleId)?.name}</span>. User overrides supersede role defaults. Deny overrides allow.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUserPermissionsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {ALL_MODULES.map((mod) => (
                <div key={mod.id} className="bg-[#151220] border border-slate-800/80 p-3.5 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-amber-400 capitalize">{mod.label} Module</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ALL_ACTIONS.map((act) => {
                      const permId = `${mod.id}.${act.id}`;
                      const currentEffect = selectedUser.userPermissions[permId]; // 'allow' | 'deny' | undefined

                      return (
                        <div key={act.id} className="bg-[#0B0912] p-2 rounded-xl border border-slate-800 text-[11px] space-y-1">
                          <div className="font-bold text-slate-300 capitalize">{act.label}</div>
                          <select
                            value={currentEffect || 'inherit'}
                            onChange={(e) => handleSetUserPermissionEffect(selectedUser.id, permId, e.target.value as any)}
                            aria-label={`Permission override for ${mod.label} ${act.label}`}
                            className={`w-full text-[10px] rounded-lg p-1 font-mono font-bold focus:outline-none ${
                              currentEffect === 'allow'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                                : currentEffect === 'deny'
                                ? 'bg-rose-950 text-rose-300 border border-rose-600'
                                : 'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}
                          >
                            <option value="inherit">Inherit Role</option>
                            <option value="allow">ALLOW (+)</option>
                            <option value="deny">DENY (-)</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsUserPermissionsModalOpen(false)}
                className="px-5 py-2.5 bg-[#DCA83D] text-black font-black text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE ROLE                                                        */}
      {/* ========================================================================= */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0E0C15] border border-[#8E6D28]/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Create New Custom Role</span>
              </h3>
              <button type="button" onClick={() => setIsCreateRoleModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3.5">
              <div>
                <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                  Role Name:
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Compliance Officer"
                  className="w-full bg-[#151220] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                  Description:
                </label>
                <textarea
                  rows={3}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Describes the operational responsibilities of this custom role..."
                  className="w-full bg-[#151220] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#DCA83D] hover:bg-[#F3C65D] text-black font-black text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Create Role & Configure Matrix
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="py-3 px-4 bg-[#1C182A] text-slate-400 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE GROUP                                                       */}
      {/* ========================================================================= */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0E0C15] border border-[#8E6D28]/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Create Organizational Team</span>
              </h3>
              <button type="button" onClick={() => setIsCreateGroupModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              <div>
                <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                  Team / Group Name:
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Legal & Compliance Team"
                  className="w-full bg-[#151220] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                  Team Purpose:
                </label>
                <textarea
                  rows={3}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Defines group scope..."
                  className="w-full bg-[#151220] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Create Team
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateGroupModalOpen(false)}
                  className="py-3 px-4 bg-[#1C182A] text-slate-400 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW LOGIN & PROFILE HISTORY                                       */}
      {/* ========================================================================= */}
      {isViewHistoryModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0E0C15] border border-[#8E6D28]/60 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-amber-400" />
                  <span>Activity & Login History: {selectedUser.name}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
              </div>
              <button type="button" onClick={() => setIsViewHistoryModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300">Authentication Audit Records:</div>
              <div className="bg-[#151220] rounded-2xl p-3 border border-slate-800 space-y-2 max-h-60 overflow-y-auto font-mono text-[11px]">
                {selectedUser.loginHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-800/60 pb-2 last:border-b-0">
                    <div>
                      <div className="text-slate-200">{new Date(item.timestamp).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">{item.userAgent} • IP: {item.ip}</div>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsViewHistoryModalOpen(false)}
                className="px-4 py-2 bg-[#1C182A] text-slate-300 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RESET PASSWORD                                                     */}
      {/* ========================================================================= */}
      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0E0C15] border border-amber-500/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset User Password</h3>
                <p className="text-xs text-slate-400">{selectedUser.name} ({selectedUser.email})</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will invalidate the user's active login sessions and generate a secure temporary password. An audit log entry will be permanently recorded.
            </p>

            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={handleResetPassword}
                className="flex-1 py-3 bg-[#DCA83D] hover:bg-[#F3C65D] text-black font-black text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Confirm & Generate New Password
              </button>
              <button
                type="button"
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="py-3 px-4 bg-[#1C182A] text-slate-400 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
