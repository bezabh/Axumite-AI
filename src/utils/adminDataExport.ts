import { jsPDF } from 'jspdf';
import { ManagedUser, PaymentTransaction, UserProfile } from '../types';
import { AdminAuditAction, INITIAL_ADMIN_AUDIT_LOGS } from '../components/AuditLogModal';
import { LiveSessionNode } from '../components/SystemActivityView';

// ============================================================================
// DATA FETCHERS & DEFAULTS
// ============================================================================

export const DEFAULT_USERS_DATA: ManagedUser[] = [
  {
    id: 'usr-axm-000',
    name: 'Becky Love',
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
    lastActive: 'Just now'
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
    lastActive: '12 mins ago'
  },
  {
    id: 'usr-axm-003',
    name: 'Bereket Yohannes',
    email: 'bereket.y@diaspora.org',
    phoneNumber: '+44 7911 123456',
    country: 'United Kingdom (London)',
    role: 'ኣክሱማይት AI Pro',
    status: 'Active',
    tokensUsed: 31200,
    tokensQuota: 50000,
    isPhoneVerified: true,
    isEmailVerified: true,
    joinedDate: '2026-02-10',
    lastActive: '2 hours ago'
  },
  {
    id: 'usr-axm-004',
    name: 'Helen Mehari',
    email: 'helen.m@stockholm-tech.se',
    phoneNumber: '+46 70 123 4567',
    country: 'Sweden (Stockholm)',
    role: 'ኣክሱማይት AI Pro',
    status: 'Active',
    tokensUsed: 14200,
    tokensQuota: 50000,
    isPhoneVerified: true,
    isEmailVerified: false,
    joinedDate: '2026-03-05',
    lastActive: 'Yesterday'
  },
  {
    id: 'usr-axm-005',
    name: 'Yemane Berhe',
    email: 'yemane.b@dmv-diaspora.us',
    phoneNumber: '+1 202 555 0192',
    country: 'United States (Washington DC)',
    role: 'Free Member',
    status: 'Active',
    tokensUsed: 4800,
    tokensQuota: 10000,
    isPhoneVerified: false,
    isEmailVerified: true,
    joinedDate: '2026-04-12',
    lastActive: '3 days ago'
  }
];

export const DEFAULT_PAYMENTS_DATA: PaymentTransaction[] = [
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
  }
];

export const DEFAULT_LIVE_SESSIONS: LiveSessionNode[] = [
  {
    id: 'sess-live-01',
    userId: 'usr-100',
    userName: 'Becky Love',
    userEmail: 'BeckyLove2004@gmail.com',
    userRole: 'Super Admin',
    ipAddress: '192.168.1.100',
    location: 'Regensburg, Germany',
    countryCode: 'DE',
    device: 'MacBook Pro M3 Max',
    browser: 'Chrome 128 (macOS)',
    loginTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    lastHeartbeat: new Date().toISOString(),
    activeDurationMinutes: 45,
    opsCount: 384,
    threatScore: 0,
    status: 'active',
    isCurrentAdmin: true,
  },
  {
    id: 'sess-live-02',
    userId: 'usr-axm-001',
    userName: 'Amanuel Tesfay',
    userEmail: 'amanuel.t@axumite.ai',
    userRole: 'Admin',
    ipAddress: '197.156.64.12',
    location: 'Asmara, Eritrea',
    countryCode: 'ER',
    device: 'ThinkPad X1 Carbon',
    browser: 'Firefox 129 (Linux)',
    loginTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    lastHeartbeat: new Date().toISOString(),
    activeDurationMinutes: 120,
    opsCount: 612,
    threatScore: 4,
    status: 'active',
  },
  {
    id: 'sess-live-03',
    userId: 'usr-axm-002',
    userName: 'Senait Gebrekidan',
    userEmail: 'senait.g@heritage.er',
    userRole: 'Axumite Scholar',
    ipAddress: '197.156.88.45',
    location: 'Keren, Eritrea',
    countryCode: 'ER',
    device: 'iPad Pro 12.9',
    browser: 'Safari (iOS 17)',
    loginTime: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    lastHeartbeat: new Date().toISOString(),
    activeDurationMinutes: 18,
    opsCount: 94,
    threatScore: 2,
    status: 'active',
  },
  {
    id: 'sess-live-04',
    userId: 'usr-axm-003',
    userName: 'Bereket Yohannes',
    userEmail: 'bereket.y@diaspora.org',
    userRole: 'Pro Member',
    ipAddress: '82.165.197.1',
    location: 'London, UK',
    countryCode: 'GB',
    device: 'Dell XPS 15',
    browser: 'Edge 127 (Windows 11)',
    loginTime: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    lastHeartbeat: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    activeDurationMinutes: 95,
    opsCount: 420,
    threatScore: 6,
    status: 'idle',
  }
];

export function getStoredManagedUsers(): ManagedUser[] {
  try {
    const saved = localStorage.getItem('axumite_managed_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read stored users', e);
  }
  return DEFAULT_USERS_DATA;
}

export function getStoredPaymentTransactions(): PaymentTransaction[] {
  try {
    const saved = localStorage.getItem('axumite_payment_transactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read stored transactions', e);
  }
  return DEFAULT_PAYMENTS_DATA;
}

export function getStoredAuditLogs(): AdminAuditAction[] {
  try {
    const saved = localStorage.getItem('axumite_admin_audit_logs');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read stored audit logs', e);
  }
  return INITIAL_ADMIN_AUDIT_LOGS;
}

export function getStoredLiveSessions(): LiveSessionNode[] {
  try {
    const saved = localStorage.getItem('axumite_live_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_LIVE_SESSIONS;
}

// ============================================================================
// HELPER: DOWNLOAD FILE IN BROWSER
// ============================================================================

export function downloadBlobFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
  // Add BOM for UTF-8 Excel support
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsvCell(cell: any): string {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

function generateCsvString(headers: string[], rows: any[][]): string {
  const headerRow = headers.map(h => escapeCsvCell(h)).join(',');
  const dataRows = rows.map(r => r.map(cell => escapeCsvCell(cell)).join(','));
  return [headerRow, ...dataRows].join('\r\n');
}

// ============================================================================
// 1. USER ACTIVITY & DIRECTORY EXPORTS
// ============================================================================

export function exportUsersToCSV(users: ManagedUser[] = getStoredManagedUsers(), adminUser?: UserProfile): void {
  const headers = [
    'User ID',
    'Full Name',
    'Email Address',
    'Phone Number',
    'Country / Location',
    'Role',
    'Account Status',
    'Tokens Used',
    'Tokens Quota',
    'Quota Utilization (%)',
    'Phone Verified',
    'Email Verified',
    'Registration Date',
    'Last Active Time',
    'Administrative Notes'
  ];

  const rows = users.map(u => {
    const usagePercent = u.tokensQuota ? Math.round((u.tokensUsed / u.tokensQuota) * 100) : 0;
    return [
      u.id,
      u.name,
      u.email,
      u.phoneNumber || 'N/A',
      u.country,
      u.role,
      u.status,
      u.tokensUsed.toLocaleString(),
      u.tokensQuota.toLocaleString(),
      `${usagePercent}%`,
      u.isPhoneVerified ? 'VERIFIED' : 'UNVERIFIED',
      u.isEmailVerified ? 'VERIFIED' : 'UNVERIFIED',
      u.joinedDate,
      u.lastActive,
      u.notes || ''
    ];
  });

  const csv = generateCsvString(headers, rows);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadBlobFile(csv, `Axumite_User_Activity_Report_${timestamp}.csv`);
}

export function exportUsersToPDF(users: ManagedUser[] = getStoredManagedUsers(), adminUser?: UserProfile): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210 mm
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Top Dark Header Banner
  doc.setFillColor(12, 10, 6);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(197, 160, 89);
  doc.rect(0, 28, pageWidth, 1.5, 'F');

  // Title
  doc.setTextColor(243, 229, 171);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AXUMITE SOVEREIGN AI • USER ACTIVITY & DIRECTORY AUDIT', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 190, 190);
  doc.text(`Official Administrative User Registry & Token Consumption Telemetry | Generated by: ${adminUser?.name || 'Super Admin'} (${adminUser?.email || 'admin@axumite.ai'})`, 14, 19);

  doc.setFontSize(8);
  doc.setTextColor(197, 160, 89);
  doc.text(`Date of Export: ${dateStr} | Total Records: ${users.length} Users`, 14, 25);

  // Executive KPI Summary Cards (4 Cards)
  const kpiY = 34;
  const cardWidth = (pageWidth - 28 - 15) / 4; // 4 cards across
  const totalTokens = users.reduce((acc, u) => acc + (u.tokensUsed || 0), 0);
  const activeCount = users.filter(u => u.status === 'Active').length;
  const verifiedCount = users.filter(u => u.isPhoneVerified && u.isEmailVerified).length;

  const kpis = [
    { title: 'TOTAL REGISTERED USERS', value: `${users.length}`, sub: `${activeCount} Active / ${users.length - activeCount} Other` },
    { title: 'TOTAL TOKENS CONSUMED', value: totalTokens.toLocaleString(), sub: `Avg ${(totalTokens / (users.length || 1)).toFixed(0)} tokens/user` },
    { title: 'FULLY VERIFIED ACCOUNTS', value: `${verifiedCount} Users`, sub: `${Math.round((verifiedCount / (users.length || 1)) * 100)}% identity complete` },
    { title: 'ACTIVE ROLE PROFILE', value: 'Sovereign Multi-Tier', sub: 'SuperAdmin, Creator, Scholars' }
  ];

  kpis.forEach((k, i) => {
    const x = 14 + i * (cardWidth + 5);
    doc.setFillColor(248, 246, 240);
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, kpiY, cardWidth, 18, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(130, 95, 30);
    doc.text(k.title, x + 3, kpiY + 4.5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(k.value, x + 3, kpiY + 11);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(k.sub, x + 3, kpiY + 16);
  });

  // Table of Users
  let startY = 58;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 12, 8);
  doc.text('USER ACTIVITY & ROLES DIRECTORY LEDGER', 14, startY);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.4);
  doc.line(14, startY + 2, pageWidth - 14, startY + 2);

  startY += 7;

  // Columns: Name, Email, Country, Role, Status, Tokens Used, Quota, Joined, Last Active
  const colWidths = [42, 50, 48, 38, 20, 26, 24, 21];
  const colHeaders = ['User Name', 'Email Address', 'Location / Country', 'Role & Tier', 'Status', 'Tokens Used', 'Quota', 'Joined'];

  // Draw Table Header
  doc.setFillColor(20, 16, 28);
  doc.rect(14, startY, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(243, 229, 171);

  let curX = 16;
  colHeaders.forEach((h, idx) => {
    doc.text(h, curX, startY + 4.5);
    curX += colWidths[idx];
  });

  startY += 7;

  // Draw Rows
  users.forEach((u, i) => {
    // Handle Page Break
    if (startY > pageHeight - 20) {
      doc.addPage();
      startY = 20;

      // Table Header on New Page
      doc.setFillColor(20, 16, 28);
      doc.rect(14, startY, pageWidth - 28, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(243, 229, 171);

      let headerX = 16;
      colHeaders.forEach((h, idx) => {
        doc.text(h, headerX, startY + 4.5);
        headerX += colWidths[idx];
      });
      startY += 7;
    }

    // Row Background (Zebra Striping)
    if (i % 2 === 0) {
      doc.setFillColor(252, 251, 248);
      doc.rect(14, startY, pageWidth - 28, 6.5, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 30, 30);

    let rowX = 16;
    // Name
    doc.setFont('helvetica', 'bold');
    doc.text(u.name.substring(0, 24), rowX, startY + 4.2);
    rowX += colWidths[0];

    // Email
    doc.setFont('helvetica', 'normal');
    doc.text(u.email.substring(0, 30), rowX, startY + 4.2);
    rowX += colWidths[1];

    // Country
    doc.text(u.country.substring(0, 28), rowX, startY + 4.2);
    rowX += colWidths[2];

    // Role
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(110, 80, 20);
    doc.text(u.role.substring(0, 22), rowX, startY + 4.2);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    rowX += colWidths[3];

    // Status
    if (u.status === 'Active') {
      doc.setTextColor(16, 120, 70);
    } else {
      doc.setTextColor(180, 50, 50);
    }
    doc.text(u.status, rowX, startY + 4.2);
    doc.setTextColor(30, 30, 30);
    rowX += colWidths[4];

    // Tokens Used
    doc.text(u.tokensUsed.toLocaleString(), rowX, startY + 4.2);
    rowX += colWidths[5];

    // Tokens Quota
    doc.text(u.tokensQuota.toLocaleString(), rowX, startY + 4.2);
    rowX += colWidths[6];

    // Joined Date
    doc.text(u.joinedDate, rowX, startY + 4.2);

    startY += 6.5;
  });

  // Footer on Last Page
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(`Axumite Sovereign AI Security & Confidentiality: Internal Administrative Record Only. Generated ${dateStr}`, 14, pageHeight - 8);

  const timestamp = new Date().toISOString().slice(0, 10);
  doc.save(`Axumite_User_Activity_Report_${timestamp}.pdf`);
}

// ============================================================================
// 2. PAYMENT & FINANCIAL SUMMARY EXPORTS
// ============================================================================

export function exportPaymentsToCSV(payments: PaymentTransaction[] = getStoredPaymentTransactions(), adminUser?: UserProfile): void {
  const headers = [
    'Transaction ID',
    'Invoice Number',
    'Customer Name',
    'Customer Email',
    'Plan Name',
    'Billing Cycle',
    'Amount',
    'Currency',
    'Payment Gateway / Method',
    'Transaction Status',
    'Tokens Credited',
    'Timestamp (UTC)',
    'Administrative Notes'
  ];

  const rows = payments.map(p => [
    p.transactionId,
    p.invoiceNumber || 'N/A',
    p.customerName,
    p.customerEmail,
    p.planName,
    p.billingCycle,
    p.amount,
    p.currency,
    p.paymentMethod,
    p.status,
    p.tokensCredited ? p.tokensCredited.toLocaleString() : '0',
    p.timestamp,
    p.notes || ''
  ]);

  const csv = generateCsvString(headers, rows);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadBlobFile(csv, `Axumite_Payment_Summary_Report_${timestamp}.csv`);
}

export function exportPaymentsToPDF(payments: PaymentTransaction[] = getStoredPaymentTransactions(), adminUser?: UserProfile): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210 mm
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Top Dark Header Banner
  doc.setFillColor(12, 10, 6);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(197, 160, 89);
  doc.rect(0, 28, pageWidth, 1.5, 'F');

  // Title
  doc.setTextColor(243, 229, 171);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AXUMITE SOVEREIGN AI • PAYMENT & REVENUE SUMMARY REPORT', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 190, 190);
  doc.text(`Official Sovereign Financial Transactions & Multi-Currency Settlement Ledger | Exported by: ${adminUser?.name || 'Super Admin'}`, 14, 19);

  doc.setFontSize(8);
  doc.setTextColor(197, 160, 89);
  doc.text(`Export Date: ${dateStr} | Settled Transactions: ${payments.length} Records`, 14, 25);

  // Financial KPIs
  const kpiY = 34;
  const cardWidth = (pageWidth - 28 - 15) / 4;
  const totalUSD = payments.filter(p => p.currency === 'USD').reduce((sum, p) => sum + p.amount, 0);
  const totalERN = payments.filter(p => p.currency === 'ERN').reduce((sum, p) => sum + p.amount, 0);
  const totalTokensCredited = payments.reduce((sum, p) => sum + (p.tokensCredited || 0), 0);
  const completedCount = payments.filter(p => p.status === 'Completed').length;

  const kpis = [
    { title: 'TOTAL USD REVENUE', value: `$${totalUSD.toLocaleString()}`, sub: `${payments.filter(p => p.currency === 'USD').length} USD Transactions` },
    { title: 'TOTAL ERN REVENUE', value: `${totalERN.toLocaleString()} ERN`, sub: 'Direct Bank & Telebirr' },
    { title: 'SETTLEMENT SUCCESS RATE', value: `${Math.round((completedCount / (payments.length || 1)) * 100)}%`, sub: `${completedCount} of ${payments.length} Completed` },
    { title: 'TOTAL TOKENS DISPENSED', value: `+${totalTokensCredited.toLocaleString()}`, sub: 'Vault Capacity Credited' }
  ];

  kpis.forEach((k, i) => {
    const x = 14 + i * (cardWidth + 5);
    doc.setFillColor(248, 246, 240);
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, kpiY, cardWidth, 18, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(130, 95, 30);
    doc.text(k.title, x + 3, kpiY + 4.5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(k.value, x + 3, kpiY + 11);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(k.sub, x + 3, kpiY + 16);
  });

  // Table
  let startY = 58;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 12, 8);
  doc.text('TRANSACTION LEDGER & SETTLEMENT DETAILS', 14, startY);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.4);
  doc.line(14, startY + 2, pageWidth - 14, startY + 2);

  startY += 7;

  const colWidths = [45, 42, 38, 22, 24, 42, 26, 30];
  const colHeaders = ['Tx ID / Invoice', 'Customer Name', 'Plan / Subscription', 'Cycle', 'Amount', 'Payment Method', 'Status', 'Timestamp'];

  // Draw Table Header
  doc.setFillColor(20, 16, 28);
  doc.rect(14, startY, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(243, 229, 171);

  let curX = 16;
  colHeaders.forEach((h, idx) => {
    doc.text(h, curX, startY + 4.5);
    curX += colWidths[idx];
  });

  startY += 7;

  // Draw Rows
  payments.forEach((p, i) => {
    if (startY > pageHeight - 20) {
      doc.addPage();
      startY = 20;

      doc.setFillColor(20, 16, 28);
      doc.rect(14, startY, pageWidth - 28, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(243, 229, 171);

      let headerX = 16;
      colHeaders.forEach((h, idx) => {
        doc.text(h, headerX, startY + 4.5);
        headerX += colWidths[idx];
      });
      startY += 7;
    }

    if (i % 2 === 0) {
      doc.setFillColor(252, 251, 248);
      doc.rect(14, startY, pageWidth - 28, 6.5, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 30, 30);

    let rowX = 16;
    // Tx ID / Invoice
    doc.setFont('helvetica', 'bold');
    doc.text((p.invoiceNumber || p.transactionId).substring(0, 26), rowX, startY + 4.2);
    rowX += colWidths[0];

    // Customer
    doc.setFont('helvetica', 'normal');
    doc.text(p.customerName.substring(0, 24), rowX, startY + 4.2);
    rowX += colWidths[1];

    // Plan
    doc.text(p.planName.substring(0, 22), rowX, startY + 4.2);
    rowX += colWidths[2];

    // Cycle
    doc.text(p.billingCycle, rowX, startY + 4.2);
    rowX += colWidths[3];

    // Amount
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 90, 40);
    doc.text(`${p.amount} ${p.currency}`, rowX, startY + 4.2);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    rowX += colWidths[4];

    // Payment Method
    doc.text(p.paymentMethod.substring(0, 24), rowX, startY + 4.2);
    rowX += colWidths[5];

    // Status
    if (p.status === 'Completed') {
      doc.setTextColor(16, 120, 70);
    } else {
      doc.setTextColor(180, 110, 20);
    }
    doc.setFont('helvetica', 'bold');
    doc.text(p.status, rowX, startY + 4.2);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    rowX += colWidths[6];

    // Timestamp
    const formattedDate = p.timestamp ? p.timestamp.slice(0, 16).replace('T', ' ') : 'N/A';
    doc.text(formattedDate, rowX, startY + 4.2);

    startY += 6.5;
  });

  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(`Official Axumite Sovereign Finance Ledger • Confidential Banking & Billing Record. Generated ${dateStr}`, 14, pageHeight - 8);

  const timestamp = new Date().toISOString().slice(0, 10);
  doc.save(`Axumite_Payment_Summary_Report_${timestamp}.pdf`);
}

// ============================================================================
// 3. SYSTEM USAGE, TELEMETRY & AUDIT LOGS EXPORTS
// ============================================================================

export function exportSystemLogsToCSV(
  sessions: LiveSessionNode[] = getStoredLiveSessions(),
  auditLogs: AdminAuditAction[] = getStoredAuditLogs(),
  adminUser?: UserProfile
): void {
  // We will compile a comprehensive multi-section CSV report
  const sessionHeaders = [
    'Session ID',
    'User ID',
    'User Name',
    'User Email',
    'Role',
    'IP Address',
    'Location',
    'Device Hardware',
    'Client Browser',
    'Login Timestamp',
    'Duration (Mins)',
    'Operations Executed',
    'Threat Score',
    'Session Status'
  ];

  const sessionRows = sessions.map(s => [
    s.id,
    s.userId,
    s.userName,
    s.userEmail,
    s.userRole,
    s.ipAddress,
    s.location,
    s.device,
    s.browser,
    s.loginTime,
    s.activeDurationMinutes,
    s.opsCount,
    `${s.threatScore}/100`,
    s.status
  ]);

  const auditHeaders = [
    'Audit ID',
    'Timestamp (UTC)',
    'Actor Name',
    'Actor Email',
    'Actor Role',
    'Action Type',
    'Target Resource',
    'Change Category',
    'Description',
    'IP Address',
    'Severity Level',
    'Execution Status'
  ];

  const auditRows = auditLogs.map(a => [
    a.id,
    a.timestamp,
    a.actorName,
    a.actorEmail || 'N/A',
    a.actorRole,
    a.actionType,
    a.resource,
    a.changeType,
    a.description,
    a.ipAddress,
    a.severity,
    a.status
  ]);

  let combinedCsv = '=== SECTION 1: LIVE ACTIVE SESSIONS & TELEMETRY NODES ===\r\n';
  combinedCsv += generateCsvString(sessionHeaders, sessionRows);
  combinedCsv += '\r\n\r\n=== SECTION 2: ADMINISTRATIVE AUDIT TRAIL & SECURITY EVENT LOGS ===\r\n';
  combinedCsv += generateCsvString(auditHeaders, auditRows);

  const timestamp = new Date().toISOString().slice(0, 10);
  downloadBlobFile(combinedCsv, `Axumite_System_Usage_and_Audit_Logs_${timestamp}.csv`);
}

export function exportSystemLogsToPDF(
  sessions: LiveSessionNode[] = getStoredLiveSessions(),
  auditLogs: AdminAuditAction[] = getStoredAuditLogs(),
  adminUser?: UserProfile
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210 mm
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Top Dark Header Banner
  doc.setFillColor(12, 10, 6);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(197, 160, 89);
  doc.rect(0, 28, pageWidth, 1.5, 'F');

  // Title
  doc.setTextColor(243, 229, 171);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AXUMITE SOVEREIGN AI • SYSTEM USAGE & TELEMETRY AUDIT REPORT', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 190, 190);
  doc.text(`Real-Time Active Node Telemetry, Threat Indexing & Administrative Security Event Trail | Verified by: ${adminUser?.name || 'Super Admin'}`, 14, 19);

  doc.setFontSize(8);
  doc.setTextColor(197, 160, 89);
  doc.text(`Report Generated: ${dateStr} | Active Nodes: ${sessions.length} | Audit Trail: ${auditLogs.length} Events`, 14, 25);

  // System Health KPIs
  const kpiY = 34;
  const cardWidth = (pageWidth - 28 - 15) / 4;
  const totalOps = sessions.reduce((acc, s) => acc + (s.opsCount || 0), 0);
  const avgThreat = (sessions.reduce((acc, s) => acc + (s.threatScore || 0), 0) / (sessions.length || 1)).toFixed(1);

  const kpis = [
    { title: 'ACTIVE LIVE SESSIONS', value: `${sessions.length} Nodes`, sub: '100% Ingress Verified' },
    { title: 'TOTAL OPS EXECUTED', value: `${totalOps.toLocaleString()} Ops`, sub: 'Real-time telemetry buffer' },
    { title: 'SYSTEM THREAT INDEX', value: `${avgThreat}/100 Safe`, sub: 'Zero active critical alerts' },
    { title: 'INFRASTRUCTURE UPTIME', value: '99.98%', sub: 'Sovereign Distributed Core' }
  ];

  kpis.forEach((k, i) => {
    const x = 14 + i * (cardWidth + 5);
    doc.setFillColor(248, 246, 240);
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, kpiY, cardWidth, 18, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(130, 95, 30);
    doc.text(k.title, x + 3, kpiY + 4.5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(k.value, x + 3, kpiY + 11);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(k.sub, x + 3, kpiY + 16);
  });

  // Table 1: Live Sessions
  let startY = 58;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 12, 8);
  doc.text('SECTION 1: ACTIVE LIVE SESSION NODES', 14, startY);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.4);
  doc.line(14, startY + 2, pageWidth - 14, startY + 2);

  startY += 7;

  const sessWidths = [42, 45, 32, 38, 48, 22, 22, 20];
  const sessHeaders = ['User Name', 'Email Address', 'Role', 'IP Address', 'Location & Hardware', 'Duration', 'Ops Count', 'Threat'];

  doc.setFillColor(20, 16, 28);
  doc.rect(14, startY, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(243, 229, 171);

  let curX = 16;
  sessHeaders.forEach((h, idx) => {
    doc.text(h, curX, startY + 4.5);
    curX += sessWidths[idx];
  });

  startY += 7;

  sessions.forEach((s, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(252, 251, 248);
      doc.rect(14, startY, pageWidth - 28, 6.5, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 30, 30);

    let rowX = 16;
    doc.setFont('helvetica', 'bold');
    doc.text(s.userName.substring(0, 24), rowX, startY + 4.2);
    rowX += sessWidths[0];

    doc.setFont('helvetica', 'normal');
    doc.text(s.userEmail.substring(0, 26), rowX, startY + 4.2);
    rowX += sessWidths[1];

    doc.text(s.userRole, rowX, startY + 4.2);
    rowX += sessWidths[2];

    doc.text(s.ipAddress, rowX, startY + 4.2);
    rowX += sessWidths[3];

    doc.text(`${s.location.substring(0, 16)} (${s.device.substring(0, 12)})`, rowX, startY + 4.2);
    rowX += sessWidths[4];

    doc.text(`${s.activeDurationMinutes}m`, rowX, startY + 4.2);
    rowX += sessWidths[5];

    doc.text(`${s.opsCount} ops`, rowX, startY + 4.2);
    rowX += sessWidths[6];

    if (s.threatScore > 50) {
      doc.setTextColor(180, 50, 50);
    } else {
      doc.setTextColor(16, 120, 70);
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${s.threatScore}/100`, rowX, startY + 4.2);
    doc.setTextColor(30, 30, 30);

    startY += 6.5;
  });

  // Table 2: Audit Logs
  startY += 6;
  if (startY > pageHeight - 40) {
    doc.addPage();
    startY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 12, 8);
  doc.text('SECTION 2: ADMINISTRATIVE SECURITY AUDIT TRAIL', 14, startY);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.4);
  doc.line(14, startY + 2, pageWidth - 14, startY + 2);

  startY += 7;

  const auditWidths = [30, 38, 32, 40, 95, 24, 15];
  const auditHeaders = ['Timestamp', 'Actor Name', 'Action Type', 'Resource Target', 'Action Description', 'IP Address', 'Status'];

  doc.setFillColor(20, 16, 28);
  doc.rect(14, startY, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(243, 229, 171);

  curX = 16;
  auditHeaders.forEach((h, idx) => {
    doc.text(h, curX, startY + 4.5);
    curX += auditWidths[idx];
  });

  startY += 7;

  auditLogs.slice(0, 15).forEach((a, i) => {
    if (startY > pageHeight - 20) {
      doc.addPage();
      startY = 20;

      doc.setFillColor(20, 16, 28);
      doc.rect(14, startY, pageWidth - 28, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(243, 229, 171);

      let headerX = 16;
      auditHeaders.forEach((h, idx) => {
        doc.text(h, headerX, startY + 4.5);
        headerX += auditWidths[idx];
      });
      startY += 7;
    }

    if (i % 2 === 0) {
      doc.setFillColor(252, 251, 248);
      doc.rect(14, startY, pageWidth - 28, 6.5, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 30, 30);

    let rowX = 16;
    doc.text(a.timestamp.slice(11, 19), rowX, startY + 4.2);
    rowX += auditWidths[0];

    doc.setFont('helvetica', 'bold');
    doc.text(a.actorName.substring(0, 20), rowX, startY + 4.2);
    doc.setFont('helvetica', 'normal');
    rowX += auditWidths[1];

    doc.text(a.actionType.substring(0, 18), rowX, startY + 4.2);
    rowX += auditWidths[2];

    doc.text(a.resource.substring(0, 22), rowX, startY + 4.2);
    rowX += auditWidths[3];

    doc.text(a.description.substring(0, 60), rowX, startY + 4.2);
    rowX += auditWidths[4];

    doc.text(a.ipAddress, rowX, startY + 4.2);
    rowX += auditWidths[5];

    if (a.status === 'Success') {
      doc.setTextColor(16, 120, 70);
    } else {
      doc.setTextColor(180, 50, 50);
    }
    doc.setFont('helvetica', 'bold');
    doc.text(a.status, rowX, startY + 4.2);
    doc.setTextColor(30, 30, 30);

    startY += 6.5;
  });

  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(`Axumite Sovereign Security Architecture • Telemetry & System Diagnostics Ledger. Generated ${dateStr}`, 14, pageHeight - 8);

  const timestamp = new Date().toISOString().slice(0, 10);
  doc.save(`Axumite_System_Usage_and_Audit_Logs_${timestamp}.pdf`);
}

// ============================================================================
// 4. MASTER COMPREHENSIVE SOVEREIGN AUDIT (ALL-IN-ONE)
// ============================================================================

export function exportMasterExecutiveBundleToCSV(adminUser?: UserProfile): void {
  const users = getStoredManagedUsers();
  const payments = getStoredPaymentTransactions();
  const sessions = getStoredLiveSessions();
  const auditLogs = getStoredAuditLogs();

  let masterCsv = `=== AXUMITE SOVEREIGN AI ENTERPRISE MANAGEMENT MASTER AUDIT ===\r\n`;
  masterCsv += `Generated: ${new Date().toISOString()}\r\n`;
  masterCsv += `Authorized Admin: ${adminUser?.name || 'Super Admin'} (${adminUser?.email || 'admin@axumite.ai'})\r\n\r\n`;

  masterCsv += `--- 1. USER DIRECTORY & ACTIVITY LOGS ---\r\n`;
  const userHeaders = ['User ID', 'Full Name', 'Email', 'Role', 'Status', 'Tokens Used', 'Quota', 'Country', 'Joined'];
  const userRows = users.map(u => [u.id, u.name, u.email, u.role, u.status, u.tokensUsed, u.tokensQuota, u.country, u.joinedDate]);
  masterCsv += generateCsvString(userHeaders, userRows) + '\r\n\r\n';

  masterCsv += `--- 2. PAYMENT & FINANCIAL SETTLEMENTS ---\r\n`;
  const payHeaders = ['Transaction ID', 'Invoice', 'Customer', 'Email', 'Plan', 'Amount', 'Currency', 'Method', 'Status', 'Date'];
  const payRows = payments.map(p => [p.transactionId, p.invoiceNumber || '', p.customerName, p.customerEmail, p.planName, p.amount, p.currency, p.paymentMethod, p.status, p.timestamp]);
  masterCsv += generateCsvString(payHeaders, payRows) + '\r\n\r\n';

  masterCsv += `--- 3. LIVE SYSTEM NODES & TELEMETRY ---\r\n`;
  const sessHeaders = ['Session ID', 'User', 'Role', 'IP', 'Location', 'Device', 'Duration Mins', 'Ops', 'Threat Score'];
  const sessRows = sessions.map(s => [s.id, s.userName, s.userRole, s.ipAddress, s.location, s.device, s.activeDurationMinutes, s.opsCount, s.threatScore]);
  masterCsv += generateCsvString(sessHeaders, sessRows) + '\r\n\r\n';

  masterCsv += `--- 4. ADMINISTRATIVE AUDIT TRAIL ---\r\n`;
  const auditHeaders = ['Audit ID', 'Timestamp', 'Actor', 'Action Type', 'Resource', 'Description', 'Status'];
  const auditRows = auditLogs.map(a => [a.id, a.timestamp, a.actorName, a.actionType, a.resource, a.description, a.status]);
  masterCsv += generateCsvString(auditHeaders, auditRows);

  const timestamp = new Date().toISOString().slice(0, 10);
  downloadBlobFile(masterCsv, `Axumite_Master_Executive_Audit_Bundle_${timestamp}.csv`);
}
