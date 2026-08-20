import { 
  RbacModule, 
  RbacAction, 
  PermissionDefinition, 
  RoleDefinition, 
  RbacUser, 
  UserGroup, 
  AuditLogEntry, 
  PermissionEffect 
} from '../types/rbac';

export const ALL_MODULES: { id: RbacModule; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'users', label: 'Users', icon: 'Users' },
  { id: 'roles', label: 'Roles', icon: 'Shield' },
  { id: 'permissions', label: 'Permissions', icon: 'Key' },
  { id: 'content', label: 'Content', icon: 'FileText' },
  { id: 'courses', label: 'Courses', icon: 'GraduationCap' },
  { id: 'products', label: 'Products', icon: 'ShoppingBag' },
  { id: 'orders', label: 'Orders', icon: 'ShoppingCart' },
  { id: 'payments', label: 'Payments', icon: 'CreditCard' },
  { id: 'reports', label: 'Reports', icon: 'BarChart2' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell' },
  { id: 'files', label: 'Files', icon: 'Folder' },
  { id: 'api_access', label: 'API Access', icon: 'Code' },
];

export const ALL_ACTIONS: { id: RbacAction; label: string }[] = [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'approve', label: 'Approve' },
  { id: 'publish', label: 'Publish' },
  { id: 'export', label: 'Export' },
  { id: 'manage', label: 'Manage' },
];

// Generate standard permission catalog
export const SYSTEM_PERMISSIONS: PermissionDefinition[] = ALL_MODULES.flatMap((mod) => {
  return ALL_ACTIONS.map((act) => ({
    id: `${mod.id}.${act.id}`,
    module: mod.id,
    action: act.id,
    name: `${act.label} ${mod.label}`,
    description: `Grants capability to ${act.label.toLowerCase()} items within the ${mod.label} module.`,
  }));
});

// Helper to build permission record
function buildPerms(pairs: [RbacModule, RbacAction[]][]): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const [mod, acts] of pairs) {
    for (const act of acts) {
      result[`${mod}.${act}`] = true;
    }
  }
  return result;
}

// Initial Roles
export const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Complete unrestricted access across all system modules, roles, and security vaults.',
    isSystem: true,
    isSuperAdmin: true,
    permissions: SYSTEM_PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.id]: true }), {}),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-admin',
    name: 'Admin',
    description: 'Manages standard business modules, user accounts, content, orders, and reports.',
    isSystem: true,
    permissions: buildPerms([
      ['dashboard', ['view', 'manage', 'export']],
      ['users', ['view', 'create', 'edit', 'delete', 'manage']],
      ['roles', ['view']],
      ['permissions', ['view']],
      ['content', ['view', 'create', 'edit', 'delete', 'approve', 'publish']],
      ['courses', ['view', 'create', 'edit', 'delete', 'publish']],
      ['products', ['view', 'create', 'edit', 'delete', 'publish']],
      ['orders', ['view', 'create', 'edit', 'manage']],
      ['payments', ['view', 'export']],
      ['reports', ['view', 'export']],
      ['settings', ['view', 'edit']],
      ['notifications', ['view', 'create', 'edit', 'delete', 'manage']],
      ['files', ['view', 'create', 'edit', 'delete']],
      ['api_access', ['view']],
    ]),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-manager',
    name: 'Manager',
    description: 'Supervises operational departments, courses, orders, customer records, and reports.',
    isSystem: true,
    permissions: buildPerms([
      ['dashboard', ['view', 'export']],
      ['users', ['view']],
      ['content', ['view', 'create', 'edit', 'approve']],
      ['courses', ['view', 'create', 'edit', 'approve']],
      ['products', ['view', 'create', 'edit']],
      ['orders', ['view', 'edit', 'manage']],
      ['reports', ['view', 'export']],
      ['notifications', ['view', 'create']],
      ['files', ['view', 'create', 'edit']],
    ]),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-editor',
    name: 'Editor',
    description: 'Manages, creates, edits, and publishes articles, courses, and educational content.',
    isSystem: true,
    permissions: buildPerms([
      ['dashboard', ['view']],
      ['content', ['view', 'create', 'edit', 'publish']],
      ['courses', ['view', 'create', 'edit', 'publish']],
      ['files', ['view', 'create', 'edit', 'delete']],
      ['notifications', ['view']],
    ]),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-moderator',
    name: 'Moderator',
    description: 'Reviews user submissions, community chats, flags, and approves content publishing.',
    isSystem: true,
    permissions: buildPerms([
      ['dashboard', ['view']],
      ['users', ['view']],
      ['content', ['view', 'edit', 'approve', 'delete']],
      ['courses', ['view', 'approve']],
      ['notifications', ['view', 'create']],
    ]),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-support',
    name: 'Support Staff',
    description: 'Assists customers, manages order statuses, views payments, and troubleshoots tickets.',
    isSystem: true,
    permissions: buildPerms([
      ['dashboard', ['view']],
      ['users', ['view']],
      ['orders', ['view', 'edit']],
      ['payments', ['view']],
      ['notifications', ['view', 'create']],
      ['files', ['view']],
    ]),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-teacher',
    name: 'Teacher',
    description: 'Creates curricula, grades student assignments, uploads files, and manages live courses.',
    isSystem: true,
    permissions: buildPerms([
      ['dashboard', ['view']],
      ['courses', ['view', 'create', 'edit', 'publish']],
      ['content', ['view', 'create', 'edit']],
      ['files', ['view', 'create', 'edit', 'delete']],
      ['reports', ['view']],
      ['notifications', ['view', 'create']],
    ]),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-student',
    name: 'Student',
    description: 'Views accessible learning materials, enrolled courses, and personal profile analytics.',
    isSystem: true,
    permissions: buildPerms([
      ['dashboard', ['view']],
      ['courses', ['view']],
      ['content', ['view']],
      ['files', ['view']],
    ]),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// Initial Groups
export const INITIAL_GROUPS: UserGroup[] = [
  {
    id: 'grp-marketing',
    name: 'Marketing Team',
    description: 'Responsible for public campaigns, blog publishing, product promotions, and analytics.',
    memberUserIds: ['usr-104', 'usr-106'],
    permissions: {
      'content.publish': true,
      'products.view': true,
      'reports.export': true,
    },
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'grp-it',
    name: 'IT & DevOps Team',
    description: 'Maintains system health, API keys, file storage quotas, and security configuration.',
    memberUserIds: ['usr-101', 'usr-102'],
    permissions: {
      'api_access.view': true,
      'api_access.manage': true,
      'settings.view': true,
      'files.manage': true,
    },
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'grp-teachers',
    name: 'Faculty & Teachers',
    description: 'Academic instructors and curriculum developers collaborating on educational modules.',
    memberUserIds: ['usr-107'],
    permissions: {
      'courses.manage': true,
      'files.upload': true,
    },
    createdAt: '2026-01-15T12:00:00Z',
  },
  {
    id: 'grp-students',
    name: 'Enrolled Students',
    description: 'Active cohort learners with access to student dashboards and homework submissions.',
    memberUserIds: ['usr-108', 'usr-109'],
    permissions: {},
    createdAt: '2026-01-15T12:00:00Z',
  },
  {
    id: 'grp-finance',
    name: 'Finance Team',
    description: 'Handles billing reconciliations, payment disputes, receipts, and revenue audits.',
    memberUserIds: ['usr-103'],
    permissions: {
      'payments.view': true,
      'payments.export': true,
      'orders.export': true,
      'reports.export': true,
    },
    createdAt: '2026-01-20T14:00:00Z',
  },
];

// Initial Users
export const INITIAL_USERS: RbacUser[] = [
  {
    id: 'usr-100',
    name: 'Becky Love (Super Admin)',
    email: 'beckylove2004@gmail.com',
    phoneNumber: '+49 152 14451691',
    roleId: 'role-super-admin',
    status: 'Active',
    twoFactorEnabled: true,
    userPermissions: {},
    groupIds: ['grp-it'],
    lastLoginAt: '2026-08-15T06:14:00Z',
    lastLoginIp: '192.168.1.100',
    loginHistory: [
      { timestamp: '2026-08-15T06:14:00Z', ip: '192.168.1.100', userAgent: 'Chrome / macOS', status: 'Success' },
      { timestamp: '2026-08-14T09:30:00Z', ip: '192.168.1.100', userAgent: 'Chrome / macOS', status: 'Success' },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'usr-101',
    name: 'Sarah Jenkins',
    email: 'sarah.j@axumite.ai',
    phoneNumber: '+1 415 555 0101',
    roleId: 'role-admin',
    status: 'Active',
    twoFactorEnabled: true,
    userPermissions: {},
    groupIds: ['grp-it'],
    lastLoginAt: '2026-08-15T05:40:00Z',
    lastLoginIp: '192.168.1.102',
    loginHistory: [
      { timestamp: '2026-08-15T05:40:00Z', ip: '192.168.1.102', userAgent: 'Firefox / Windows', status: 'Success' },
    ],
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 'usr-102',
    name: 'Michael Chang',
    email: 'michael.c@axumite.ai',
    phoneNumber: '+1 415 555 0102',
    roleId: 'role-manager',
    status: 'Active',
    twoFactorEnabled: false,
    userPermissions: {
      'users.delete': 'deny', // Explicit restriction
    },
    groupIds: ['grp-it'],
    lastLoginAt: '2026-08-14T18:22:00Z',
    lastLoginIp: '10.0.4.15',
    loginHistory: [
      { timestamp: '2026-08-14T18:22:00Z', ip: '10.0.4.15', userAgent: 'Safari / macOS', status: 'Success' },
    ],
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-07-20T00:00:00Z',
  },
  {
    id: 'usr-103',
    name: 'Elena Vance',
    email: 'elena.v@axumite.ai',
    phoneNumber: '+1 415 555 0103',
    roleId: 'role-manager',
    status: 'Active',
    twoFactorEnabled: true,
    userPermissions: {
      'payments.manage': 'allow', // Explicit grant
    },
    groupIds: ['grp-finance'],
    lastLoginAt: '2026-08-15T04:10:00Z',
    lastLoginIp: '172.16.0.45',
    loginHistory: [
      { timestamp: '2026-08-15T04:10:00Z', ip: '172.16.0.45', userAgent: 'Chrome / Windows', status: 'Success' },
    ],
    createdAt: '2026-01-18T00:00:00Z',
    updatedAt: '2026-06-15T00:00:00Z',
  },
  {
    id: 'usr-104',
    name: 'John Doe (Editor + Export Override)',
    email: 'john.doe@axumite.ai',
    phoneNumber: '+1 415 555 0104',
    roleId: 'role-editor',
    status: 'Active',
    twoFactorEnabled: false,
    userPermissions: {
      'reports.export': 'allow', // Additional specific user permission without changing role
    },
    groupIds: ['grp-marketing'],
    lastLoginAt: '2026-08-14T22:15:00Z',
    lastLoginIp: '192.168.2.14',
    loginHistory: [
      { timestamp: '2026-08-14T22:15:00Z', ip: '192.168.2.14', userAgent: 'Chrome / Android', status: 'Success' },
    ],
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 'usr-105',
    name: 'Marcus Brody',
    email: 'marcus.b@axumite.ai',
    phoneNumber: '+1 415 555 0105',
    roleId: 'role-moderator',
    status: 'Suspended',
    twoFactorEnabled: false,
    userPermissions: {},
    groupIds: [],
    lastLoginAt: '2026-07-28T11:00:00Z',
    lastLoginIp: '198.51.100.4',
    loginHistory: [
      { timestamp: '2026-07-28T11:00:00Z', ip: '198.51.100.4', userAgent: 'Edge / Windows', status: 'Success' },
    ],
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-07-29T00:00:00Z',
  },
  {
    id: 'usr-106',
    name: 'Chloe Sullivan',
    email: 'chloe.s@axumite.ai',
    phoneNumber: '+1 415 555 0106',
    roleId: 'role-support',
    status: 'Active',
    twoFactorEnabled: true,
    userPermissions: {},
    groupIds: ['grp-marketing'],
    lastLoginAt: '2026-08-15T02:00:00Z',
    lastLoginIp: '192.168.1.55',
    loginHistory: [
      { timestamp: '2026-08-15T02:00:00Z', ip: '192.168.1.55', userAgent: 'Chrome / macOS', status: 'Success' },
    ],
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'usr-107',
    name: 'Prof. David Kibreab',
    email: 'david.k@academy.edu',
    phoneNumber: '+1 415 555 0107',
    roleId: 'role-teacher',
    status: 'Active',
    twoFactorEnabled: true,
    userPermissions: {},
    groupIds: ['grp-teachers'],
    lastLoginAt: '2026-08-15T05:10:00Z',
    lastLoginIp: '10.200.1.8',
    loginHistory: [
      { timestamp: '2026-08-15T05:10:00Z', ip: '10.200.1.8', userAgent: 'Safari / iPadOS', status: 'Success' },
    ],
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'usr-108',
    name: 'Liya Wolde',
    email: 'liya.w@student.edu',
    phoneNumber: '+1 415 555 0108',
    roleId: 'role-student',
    status: 'Active',
    twoFactorEnabled: false,
    userPermissions: {},
    groupIds: ['grp-students'],
    lastLoginAt: '2026-08-14T20:45:00Z',
    lastLoginIp: '192.168.10.40',
    loginHistory: [
      { timestamp: '2026-08-14T20:45:00Z', ip: '192.168.10.40', userAgent: 'Chrome / iOS', status: 'Success' },
    ],
    createdAt: '2026-03-10T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    actorId: 'usr-100',
    actorName: 'Alexander Ross',
    actorRole: 'Super Admin',
    action: 'ROLE_ASSIGNED',
    resource: 'users',
    targetId: 'usr-104',
    targetName: 'John Doe',
    previousValue: 'Role: Free Member',
    newValue: 'Role: Editor',
    ipAddress: '192.168.1.100',
    timestamp: '2026-08-14T10:15:30Z',
    severity: 'info',
  },
  {
    id: 'aud-2',
    actorId: 'usr-100',
    actorName: 'Alexander Ross',
    actorRole: 'Super Admin',
    action: 'USER_PERMISSION_OVERRIDE_GRANTED',
    resource: 'permissions',
    targetId: 'usr-104',
    targetName: 'John Doe',
    previousValue: 'reports.export: not set',
    newValue: 'reports.export: allow',
    ipAddress: '192.168.1.100',
    timestamp: '2026-08-14T10:18:00Z',
    severity: 'warning',
  },
  {
    id: 'aud-3',
    actorId: 'usr-101',
    actorName: 'Sarah Jenkins',
    actorRole: 'Admin',
    action: 'USER_SUSPENDED',
    resource: 'users',
    targetId: 'usr-105',
    targetName: 'Marcus Brody',
    previousValue: 'Status: Active',
    newValue: 'Status: Suspended (Security Policy Violation)',
    ipAddress: '192.168.1.102',
    timestamp: '2026-08-14T14:30:15Z',
    severity: 'critical',
  },
  {
    id: 'aud-4',
    actorId: 'usr-100',
    actorName: 'Alexander Ross',
    actorRole: 'Super Admin',
    action: 'ROLE_CREATED',
    resource: 'roles',
    targetId: 'role-teacher',
    targetName: 'Teacher',
    previousValue: 'None',
    newValue: 'Role Created with 8 module permissions',
    ipAddress: '192.168.1.100',
    timestamp: '2026-08-12T09:00:00Z',
    severity: 'info',
  },
];

// Permission Evaluation Result
export interface PermissionResolution {
  permissionId: string;
  hasAccess: boolean;
  source: 'DENY_OVERRIDE' | 'USER_ALLOW' | 'GROUP_ALLOW' | 'ROLE_ALLOW' | 'DEFAULT_DENY' | 'SUSPENDED_USER';
  explanation: string;
}

/**
 * Core RBAC Engine: Calculates effective permissions for a user
 * Precedence Rule:
 * 1. Suspended or Inactive user -> ALL DENIED
 * 2. Explicit User-Level 'deny' -> DENIED (Overrides everything)
 * 3. Explicit User-Level 'allow' -> ALLOWED
 * 4. Group-Level 'allow' -> ALLOWED
 * 5. Role-Level 'allow' -> ALLOWED
 * 6. Default -> DENIED (Least Privilege)
 */
export function evaluateUserPermission(
  user: RbacUser,
  permissionId: string,
  roles: RoleDefinition[],
  groups: UserGroup[]
): PermissionResolution {
  // Check user status
  if (user.status !== 'Active') {
    return {
      permissionId,
      hasAccess: false,
      source: 'SUSPENDED_USER',
      explanation: `User is ${user.status}. All permissions are revoked.`,
    };
  }

  // 1. Explicit user-level override check
  const userOverride = user.userPermissions?.[permissionId];
  if (userOverride === 'deny') {
    return {
      permissionId,
      hasAccess: false,
      source: 'DENY_OVERRIDE',
      explanation: 'Explicit user restriction (DENY) overrides all roles and group grants.',
    };
  }
  if (userOverride === 'allow') {
    return {
      permissionId,
      hasAccess: true,
      source: 'USER_ALLOW',
      explanation: 'Explicit user-specific permission override (ALLOW) granted.',
    };
  }

  // 2. Group-level permissions check
  const userGroups = groups.filter((g) => user.groupIds?.includes(g.id));
  for (const group of userGroups) {
    if (group.permissions?.[permissionId]) {
      return {
        permissionId,
        hasAccess: true,
        source: 'GROUP_ALLOW',
        explanation: `Inherited via membership in team group: "${group.name}".`,
      };
    }
  }

  // 3. Role-level permissions check
  const userRole = roles.find((r) => r.id === user.roleId);
  if (userRole?.isSuperAdmin) {
    return {
      permissionId,
      hasAccess: true,
      source: 'ROLE_ALLOW',
      explanation: 'Unrestricted access granted by Super Admin role.',
    };
  }
  if (userRole?.permissions?.[permissionId]) {
    return {
      permissionId,
      hasAccess: true,
      source: 'ROLE_ALLOW',
      explanation: `Inherited from role: "${userRole.name}".`,
    };
  }

  // 4. Default Deny
  return {
    permissionId,
    hasAccess: false,
    source: 'DEFAULT_DENY',
    explanation: 'Denied by default (Principle of Least Privilege).',
  };
}

/**
 * Check if an actor has privilege to manage other users or assign roles
 * Prevents privilege escalation
 */
export function canActorModifyTarget(
  actor: RbacUser,
  target: RbacUser,
  actorRole: RoleDefinition,
  targetRole: RoleDefinition
): { allowed: boolean; reason?: string } {
  if (actor.status !== 'Active') {
    return { allowed: false, reason: 'Actor account is not active.' };
  }

  if (actorRole.isSuperAdmin) {
    return { allowed: true };
  }

  // Prevent modifying Super Admin if not Super Admin
  if (targetRole.isSuperAdmin) {
    return { allowed: false, reason: 'Only Super Admins can modify other Super Admins.' };
  }

  // Prevent modifying equal or higher rank (e.g. Admin cannot delete another Admin)
  if (actor.roleId === target.roleId && actor.id !== target.id) {
    return { allowed: false, reason: 'Admins cannot modify peer Administrators of the same rank.' };
  }

  return { allowed: true };
}

/**
 * Scalable Database SQL Schema Definitions for Documentation & Export
 */
export const DATABASE_SCHEMA_SQL = `-- ==========================================================
-- SCALABLE RBAC & USER MANAGEMENT DATABASE SCHEMA
-- Compatible with PostgreSQL 14+, Cloud SQL, Supabase
-- ==========================================================

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    last_login_at TIMESTAMPTZ,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- 2. ROLES TABLE
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PERMISSIONS CATALOG TABLE
CREATE TABLE permissions (
    id VARCHAR(100) PRIMARY KEY, -- e.g. 'courses.create', 'reports.export'
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_module_action UNIQUE (module, action)
);
CREATE INDEX idx_permissions_module ON permissions(module);

-- 4. USER ROLES JUNCTION (Supports single or multi-role architecture)
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- 5. ROLE PERMISSIONS JUNCTION
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- 6. USER DIRECT PERMISSION OVERRIDES (Allow / Deny)
CREATE TABLE user_permissions (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    effect VARCHAR(10) NOT NULL CHECK (effect IN ('allow', 'deny')),
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, permission_id)
);

-- 7. USER GROUPS / TEAMS TABLE
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. GROUP MEMBERSHIP JUNCTION
CREATE TABLE group_users (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- 9. GROUP PERMISSIONS JUNCTION
CREATE TABLE group_permissions (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, permission_id)
);

-- 10. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255),
    actor_role VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    target_id VARCHAR(255),
    target_name VARCHAR(255),
    previous_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'info',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource);

-- 11. ACTIVE SESSIONS TABLE
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sessions_user_token ON sessions(user_id, token_hash);
`;
