export type RbacModule = 
  | 'dashboard'
  | 'users'
  | 'roles'
  | 'permissions'
  | 'content'
  | 'courses'
  | 'products'
  | 'orders'
  | 'payments'
  | 'reports'
  | 'settings'
  | 'notifications'
  | 'files'
  | 'api_access';

export type RbacAction = 
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'publish'
  | 'export'
  | 'manage';

export type PermissionEffect = 'allow' | 'deny';

export interface PermissionDefinition {
  id: string; // e.g. "courses.publish"
  module: RbacModule;
  action: RbacAction;
  name: string;
  description: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  isSystem: boolean; // cannot be deleted
  isSuperAdmin?: boolean;
  permissions: Record<string, boolean>; // permissionId -> true (allowed)
  createdAt: string;
  updatedAt: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberUserIds: string[];
  permissions: Record<string, boolean>; // group-level permission additions
  createdAt: string;
}

export interface RbacUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  roleId: string; // references RoleDefinition.id
  status: 'Active' | 'Inactive' | 'Suspended';
  twoFactorEnabled: boolean;
  userPermissions: Record<string, PermissionEffect>; // Individual overrides: 'allow' | 'deny'
  groupIds: string[];
  lastLoginAt?: string;
  lastLoginIp?: string;
  loginHistory: {
    timestamp: string;
    ip: string;
    userAgent: string;
    status: 'Success' | 'Failed';
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  resource: string;
  targetId?: string;
  targetName?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}
