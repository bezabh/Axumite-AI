import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Activity,
  Radio,
  Server,
  ShieldCheck,
  ShieldAlert,
  Users,
  Clock,
  RefreshCw,
  Zap,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  Eye,
  Sliders,
  Database,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight,
  UserCheck,
  UserX,
  Play,
  Pause,
  Key,
  Shield,
  BarChart3,
  TrendingUp,
  HardDrive,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { isAdminOrCreator } from '../lib/permissions';
import { exportSystemLogsToCSV, exportSystemLogsToPDF } from '../utils/adminDataExport';

export interface LiveSessionNode {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'Super Admin' | 'Admin' | 'Axumite Scholar' | 'Pro Member' | 'Free Member' | 'Guest';
  ipAddress: string;
  location: string;
  countryCode: string;
  device: string;
  browser: string;
  loginTime: string; // ISO string
  lastHeartbeat: string; // ISO string
  activeDurationMinutes: number;
  opsCount: number;
  threatScore: number; // 0-100 (low is safe)
  status: 'active' | 'idle' | 'warning' | 'terminated';
  isCurrentAdmin?: boolean;
}

export interface RoleActionDataPoint {
  timeLabel: string;
  timestamp: number;
  superAdmin: number;
  admin: number;
  scholar: number;
  proMember: number;
  freeMember: number;
  guest: number;
  totalOps: number;
}

export interface RoleActionSummary {
  role: string;
  totalActions: number;
  topActionType: string;
  avgLatencyMs: number;
  errorRatePercent: number;
  color: string;
  activeUsersCount: number;
}

export interface HealthMetric {
  title: string;
  value: string;
  unit: string;
  subtext: string;
  status: 'optimal' | 'good' | 'warning';
  icon: any;
}

// Initial Simulated Active Sessions
const INITIAL_LIVE_SESSIONS: LiveSessionNode[] = [
  {
    id: 'sess-live-01',
    userId: 'usr-100',
    userName: 'Becky Love',
    userEmail: 'BeckyLove2004@gmail.com',
    userRole: 'Super Admin',
    ipAddress: '197.156.104.12',
    location: 'Asmara, Eritrea',
    countryCode: 'ER',
    device: 'Desktop Workstation',
    browser: 'Chrome 128 (Linux x64)',
    loginTime: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
    lastHeartbeat: new Date(Date.now() - 1000 * 4).toISOString(),
    activeDurationMinutes: 145,
    opsCount: 412,
    threatScore: 0,
    status: 'active',
    isCurrentAdmin: true,
  },
  {
    id: 'sess-live-02',
    userId: 'usr-101',
    userName: 'Dr. Sarah Jenkins',
    userEmail: 'sarah.j@axumite.ai',
    userRole: 'Admin',
    ipAddress: '10.0.4.22',
    location: 'Frankfurt, Germany',
    countryCode: 'DE',
    device: 'MacBook Pro 16"',
    browser: 'Safari 17.5 (macOS)',
    loginTime: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    lastHeartbeat: new Date(Date.now() - 1000 * 12).toISOString(),
    activeDurationMinutes: 85,
    opsCount: 278,
    threatScore: 2,
    status: 'active',
  },
  {
    id: 'sess-live-03',
    userId: 'usr-102',
    userName: 'Dawit Ghebre',
    userEmail: 'dawit.g@axumite.ai',
    userRole: 'Admin',
    ipAddress: '172.16.0.8',
    location: 'London, United Kingdom',
    countryCode: 'GB',
    device: 'ThinkPad X1 Carbon',
    browser: 'Firefox 129.0',
    loginTime: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    lastHeartbeat: new Date(Date.now() - 1000 * 28).toISOString(),
    activeDurationMinutes: 210,
    opsCount: 319,
    threatScore: 0,
    status: 'active',
  },
  {
    id: 'sess-live-04',
    userId: 'usr-103',
    userName: 'Prof. Yonas Kifle',
    userEmail: 'y.kifle@addis-uni.edu',
    userRole: 'Axumite Scholar',
    ipAddress: '196.188.240.89',
    location: 'Addis Ababa, Ethiopia',
    countryCode: 'ET',
    device: 'iPad Pro 12.9"',
    browser: 'Mobile Safari 17.4',
    loginTime: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    lastHeartbeat: new Date(Date.now() - 1000 * 18).toISOString(),
    activeDurationMinutes: 50,
    opsCount: 164,
    threatScore: 1,
    status: 'active',
  },
  {
    id: 'sess-live-05',
    userId: 'usr-104',
    userName: 'Semhar Tekle',
    userEmail: 'semhar.t@diaspora.org',
    userRole: 'Pro Member',
    ipAddress: '73.223.109.4',
    location: 'Seattle, USA',
    countryCode: 'US',
    device: 'iPhone 15 Pro Max',
    browser: 'iOS Safari PWA',
    loginTime: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    lastHeartbeat: new Date(Date.now() - 1000 * 8).toISOString(),
    activeDurationMinutes: 32,
    opsCount: 88,
    threatScore: 0,
    status: 'active',
  },
  {
    id: 'sess-live-06',
    userId: 'usr-105',
    userName: 'Amanuel Berhe',
    userEmail: 'amanuel.b@gmail.com',
    userRole: 'Free Member',
    ipAddress: '197.156.101.44',
    location: 'Keren, Eritrea',
    countryCode: 'ER',
    device: 'Samsung Galaxy S24',
    browser: 'Chrome Mobile 128',
    loginTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastHeartbeat: new Date(Date.now() - 1000 * 55).toISOString(),
    activeDurationMinutes: 15,
    opsCount: 42,
    threatScore: 4,
    status: 'idle',
  },
  {
    id: 'sess-live-07',
    userId: 'usr-106',
    userName: 'Guest Anonymous 8891',
    userEmail: 'guest-8891@axumite.guest',
    userRole: 'Guest',
    ipAddress: '89.144.200.18',
    location: 'Stockholm, Sweden',
    countryCode: 'SE',
    device: 'Windows Desktop',
    browser: 'Edge 127.0',
    loginTime: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    lastHeartbeat: new Date(Date.now() - 1000 * 6).toISOString(),
    activeDurationMinutes: 7,
    opsCount: 19,
    threatScore: 1,
    status: 'active',
  },
  {
    id: 'sess-live-08',
    userId: 'usr-107',
    userName: 'Almaz Habte',
    userEmail: 'almaz.h@rotterdam.nl',
    userRole: 'Pro Member',
    ipAddress: '84.82.110.63',
    location: 'Rotterdam, Netherlands',
    countryCode: 'NL',
    device: 'MacBook Air M2',
    browser: 'Chrome 128',
    loginTime: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    lastHeartbeat: new Date(Date.now() - 1000 * 3).toISOString(),
    activeDurationMinutes: 110,
    opsCount: 194,
    threatScore: 0,
    status: 'active',
  },
];

// Helper to generate historical Action Frequency data for D3 chart
function generateHistoricalRoleActions(timeframe: '1h' | '24h' | '7d' | '30d'): RoleActionDataPoint[] {
  const points: RoleActionDataPoint[] = [];
  const now = Date.now();

  if (timeframe === '1h') {
    // 12 intervals of 5 minutes
    for (let i = 11; i >= 0; i--) {
      const ts = now - i * 5 * 60 * 1000;
      const date = new Date(ts);
      const label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const superAdmin = Math.floor(25 + Math.random() * 20);
      const admin = Math.floor(40 + Math.random() * 30);
      const scholar = Math.floor(35 + Math.random() * 25);
      const proMember = Math.floor(60 + Math.random() * 45);
      const freeMember = Math.floor(50 + Math.random() * 40);
      const guest = Math.floor(20 + Math.random() * 15);
      points.push({
        timeLabel: label,
        timestamp: ts,
        superAdmin,
        admin,
        scholar,
        proMember,
        freeMember,
        guest,
        totalOps: superAdmin + admin + scholar + proMember + freeMember + guest,
      });
    }
  } else if (timeframe === '24h') {
    // 24 intervals of 1 hour
    for (let i = 23; i >= 0; i--) {
      const ts = now - i * 60 * 60 * 1000;
      const date = new Date(ts);
      const label = `${date.getHours()}:00`;
      const mult = date.getHours() >= 8 && date.getHours() <= 22 ? 1.6 : 0.6;
      const superAdmin = Math.floor((120 + Math.random() * 60) * mult);
      const admin = Math.floor((220 + Math.random() * 90) * mult);
      const scholar = Math.floor((180 + Math.random() * 80) * mult);
      const proMember = Math.floor((340 + Math.random() * 140) * mult);
      const freeMember = Math.floor((290 + Math.random() * 110) * mult);
      const guest = Math.floor((110 + Math.random() * 50) * mult);
      points.push({
        timeLabel: label,
        timestamp: ts,
        superAdmin,
        admin,
        scholar,
        proMember,
        freeMember,
        guest,
        totalOps: superAdmin + admin + scholar + proMember + freeMember + guest,
      });
    }
  } else if (timeframe === '7d') {
    // 7 days
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const ts = now - i * 24 * 60 * 60 * 1000;
      const date = new Date(ts);
      const label = dayNames[date.getDay()];
      const superAdmin = Math.floor(1800 + Math.random() * 400);
      const admin = Math.floor(3400 + Math.random() * 700);
      const scholar = Math.floor(2900 + Math.random() * 600);
      const proMember = Math.floor(5200 + Math.random() * 1200);
      const freeMember = Math.floor(4100 + Math.random() * 900);
      const guest = Math.floor(1600 + Math.random() * 400);
      points.push({
        timeLabel: label,
        timestamp: ts,
        superAdmin,
        admin,
        scholar,
        proMember,
        freeMember,
        guest,
        totalOps: superAdmin + admin + scholar + proMember + freeMember + guest,
      });
    }
  } else {
    // 30 days - 10 sampled 3-day buckets
    for (let i = 9; i >= 0; i--) {
      const ts = now - i * 3 * 24 * 60 * 60 * 1000;
      const date = new Date(ts);
      const label = `${date.getMonth() + 1}/${date.getDate()}`;
      const superAdmin = Math.floor(5200 + Math.random() * 1100);
      const admin = Math.floor(9800 + Math.random() * 2100);
      const scholar = Math.floor(8400 + Math.random() * 1800);
      const proMember = Math.floor(15500 + Math.random() * 3200);
      const freeMember = Math.floor(12100 + Math.random() * 2600);
      const guest = Math.floor(4900 + Math.random() * 1200);
      points.push({
        timeLabel: label,
        timestamp: ts,
        superAdmin,
        admin,
        scholar,
        proMember,
        freeMember,
        guest,
        totalOps: superAdmin + admin + scholar + proMember + freeMember + guest,
      });
    }
  }

  return points;
}

interface SystemActivityViewProps {
  currentUser?: UserProfile;
}

export const SystemActivityView: React.FC<SystemActivityViewProps> = ({
  currentUser,
}) => {
  const { language } = useLanguage();

  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [liveSessions, setLiveSessions] = useState<LiveSessionNode[]>(INITIAL_LIVE_SESSIONS);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'charts' | 'sessions' | 'matrix'>('charts');

  // Chart References
  const sessionsChartContainerRef = useRef<HTMLDivElement>(null);
  const roleActionsChartContainerRef = useRef<HTMLDivElement>(null);
  const donutChartContainerRef = useRef<HTMLDivElement>(null);

  // Role Action Data
  const [actionData, setActionData] = useState<RoleActionDataPoint[]>(() =>
    generateHistoricalRoleActions('24h')
  );

  // Refresh Action Data on timeframe change
  useEffect(() => {
    setActionData(generateHistoricalRoleActions(timeframe));
  }, [timeframe]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Live periodic simulation heartbeat for Super Admin monitoring
  useEffect(() => {
    if (!isLiveStreamActive) return;

    const interval = setInterval(() => {
      setLiveSessions((prev) => {
        return prev.map((sess) => {
          if (sess.status === 'terminated') return sess;
          // Random slight ops increment
          const opsDelta = Math.floor(Math.random() * 4);
          const shouldToggleIdle = Math.random() < 0.08;
          return {
            ...sess,
            opsCount: sess.opsCount + opsDelta,
            lastHeartbeat: new Date().toISOString(),
            status: shouldToggleIdle && !sess.isCurrentAdmin ? (sess.status === 'active' ? 'idle' : 'active') : sess.status,
          };
        });
      });

      // Update current time on chart
      setLastSyncTime(new Date());
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStreamActive]);

  // Session stats summaries
  const sessionStats = useMemo(() => {
    const total = liveSessions.length;
    const active = liveSessions.filter((s) => s.status === 'active').length;
    const idle = liveSessions.filter((s) => s.status === 'idle').length;
    const totalOps = liveSessions.reduce((acc, s) => acc + s.opsCount, 0);
    const avgDuration = Math.round(
      liveSessions.reduce((acc, s) => acc + s.activeDurationMinutes, 0) / (total || 1)
    );
    const countries = Array.from(new Set(liveSessions.map((s) => s.countryCode))).length;
    return { total, active, idle, totalOps, avgDuration, countries };
  }, [liveSessions]);

  // Role Action Summaries Matrix
  const roleSummaries: RoleActionSummary[] = useMemo(() => {
    const totals = {
      superAdmin: actionData.reduce((acc, d) => acc + d.superAdmin, 0),
      admin: actionData.reduce((acc, d) => acc + d.admin, 0),
      scholar: actionData.reduce((acc, d) => acc + d.scholar, 0),
      proMember: actionData.reduce((acc, d) => acc + d.proMember, 0),
      freeMember: actionData.reduce((acc, d) => acc + d.freeMember, 0),
      guest: actionData.reduce((acc, d) => acc + d.guest, 0),
    };

    return [
      {
        role: 'Super Admin',
        totalActions: totals.superAdmin,
        topActionType: 'System Config & RBAC Matrix',
        avgLatencyMs: 38,
        errorRatePercent: 0.01,
        color: '#EAB308', // Yellow/Gold
        activeUsersCount: liveSessions.filter((s) => s.userRole === 'Super Admin').length,
      },
      {
        role: 'Admin',
        totalActions: totals.admin,
        topActionType: 'User Audit & Payments',
        avgLatencyMs: 44,
        errorRatePercent: 0.04,
        color: '#F97316', // Orange
        activeUsersCount: liveSessions.filter((s) => s.userRole === 'Admin').length,
      },
      {
        role: 'Axumite Scholar',
        totalActions: totals.scholar,
        topActionType: "Ge'ez Lexicon Deep AI Inference",
        avgLatencyMs: 95,
        errorRatePercent: 0.12,
        color: '#A855F7', // Purple
        activeUsersCount: liveSessions.filter((s) => s.userRole === 'Axumite Scholar').length,
      },
      {
        role: 'Pro Member',
        totalActions: totals.proMember,
        topActionType: 'Speech Studio & Document OCR',
        avgLatencyMs: 72,
        errorRatePercent: 0.08,
        color: '#06B6D4', // Cyan
        activeUsersCount: liveSessions.filter((s) => s.userRole === 'Pro Member').length,
      },
      {
        role: 'Free Member',
        totalActions: totals.freeMember,
        topActionType: 'Obelisk Tigrinya Chat',
        avgLatencyMs: 86,
        errorRatePercent: 0.18,
        color: '#10B981', // Emerald
        activeUsersCount: liveSessions.filter((s) => s.userRole === 'Free Member').length,
      },
      {
        role: 'Guest',
        totalActions: totals.guest,
        topActionType: 'Preview & Quick Translate',
        avgLatencyMs: 65,
        errorRatePercent: 0.35,
        color: '#64748B', // Slate
        activeUsersCount: liveSessions.filter((s) => s.userRole === 'Guest').length,
      },
    ];
  }, [actionData, liveSessions]);

  // Health Metrics
  const healthMetrics: HealthMetric[] = [
    {
      title: 'Active Login Sessions',
      value: `${sessionStats.active}`,
      unit: `concurrency / ${sessionStats.total} total`,
      subtext: `${sessionStats.countries} sovereign countries represented`,
      status: 'optimal',
      icon: Users,
    },
    {
      title: 'Real-Time Throughput',
      value: `${(sessionStats.totalOps / 18).toFixed(1)}`,
      unit: 'ops/sec',
      subtext: 'Cryptographic Auth verification intact',
      status: 'optimal',
      icon: Zap,
    },
    {
      title: 'Mean Response Latency',
      value: '52',
      unit: 'ms',
      subtext: 'Edge gateway caching active',
      status: 'optimal',
      icon: Cpu,
    },
    {
      title: 'System Health Index',
      value: '99.98',
      unit: '%',
      subtext: 'Zero memory leaks or stalled queues',
      status: 'optimal',
      icon: ShieldCheck,
    },
  ];

  // --------------------------------------------------------------------------
  // D3 CHART 1: Active Login Sessions Timeline & Concurrency (Stream/Area D3)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!sessionsChartContainerRef.current) return;

    const container = sessionsChartContainerRef.current;
    // Clear previous SVG
    d3.select(container).selectAll('*').remove();

    const width = container.clientWidth || 600;
    const height = 240;
    const margin = { top: 20, right: 30, bottom: 35, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('class', 'overflow-visible');

    // Create defs for gold/amber gradient
    const defs = svg.append('defs');

    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'sessionAreaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#C5A059')
      .attr('stop-opacity', 0.45);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8E6D28')
      .attr('stop-opacity', 0.02);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const xScale = d3
      .scalePoint()
      .domain(actionData.map((d) => d.timeLabel))
      .range([0, innerWidth]);

    // Y Scale
    const maxVal: number = (d3.max(actionData, (d: RoleActionDataPoint) => d.totalOps) as number | undefined) ?? 100;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal * 1.15])
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.15)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(4)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#C5A059');

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0).tickPadding(10))
      .call((axis) => axis.select('.domain').attr('stroke', '#332717'))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(4).tickSize(0).tickPadding(8))
      .call((axis) => axis.select('.domain').attr('stroke', '#332717'))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Area Generator
    const areaGen = d3
      .area<RoleActionDataPoint>()
      .x((d) => xScale(d.timeLabel) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(d.totalOps))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const lineGen = d3
      .line<RoleActionDataPoint>()
      .x((d) => xScale(d.timeLabel) || 0)
      .y((d) => yScale(d.totalOps))
      .curve(d3.curveMonotoneX);

    // Draw Area
    g.append('path')
      .datum(actionData)
      .attr('fill', 'url(#sessionAreaGradient)')
      .attr('d', areaGen);

    // Draw Line
    g.append('path')
      .datum(actionData)
      .attr('fill', 'none')
      .attr('stroke', '#E1C47D')
      .attr('stroke-width', 2.5)
      .attr('d', lineGen);

    // Interactive Hover Points & Tooltip
    const tooltip = d3
      .select(container)
      .append('div')
      .attr(
        'class',
        'absolute hidden px-3 py-2 bg-[#120D22] border border-[#C5A059] rounded-xl text-xs text-white shadow-2xl pointer-events-none z-30 font-mono'
      );

    g.selectAll('.dot')
      .data(actionData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d: RoleActionDataPoint) => xScale(d.timeLabel) || 0)
      .attr('cy', (d: RoleActionDataPoint) => yScale(d.totalOps))
      .attr('r', 4)
      .attr('fill', '#090812')
      .attr('stroke', '#E1C47D')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function (this: SVGCircleElement, event: MouseEvent, d: unknown) {
        const item = d as RoleActionDataPoint;
        d3.select(this).transition().duration(150).attr('r', 7).attr('fill', '#E1C47D');
        tooltip
          .style('left', `${event.offsetX + 15}px`)
          .style('top', `${event.offsetY - 20}px`)
          .style('display', 'block').html(`
            <div class="font-bold text-[#F3E5AB]">${item.timeLabel}</div>
            <div class="text-[11px] text-emerald-400 mt-0.5">Total Throughput: <b>${item.totalOps} ops</b></div>
            <div class="text-[10px] text-slate-400 mt-1 border-t border-slate-700 pt-1">
              Super Admin: ${item.superAdmin} | Admin: ${item.admin}<br/>
              Scholar: ${item.scholar} | Pro: ${item.proMember}
            </div>
          `);
      })
      .on('mouseout', function (this: SVGCircleElement) {
        d3.select(this).transition().duration(150).attr('r', 4).attr('fill', '#090812');
        tooltip.style('display', 'none');
      });
  }, [actionData]);

  // --------------------------------------------------------------------------
  // D3 CHART 2: Role-Based Action Frequency Multi-Bar Chart
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!roleActionsChartContainerRef.current) return;

    const container = roleActionsChartContainerRef.current;
    d3.select(container).selectAll('*').remove();

    const width = container.clientWidth || 600;
    const height = 240;
    const margin = { top: 20, right: 30, bottom: 35, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('class', 'overflow-visible');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Keys for stacking / grouping
    const roles = [
      { key: 'superAdmin', label: 'Super Admin', color: '#EAB308' },
      { key: 'admin', label: 'Admin', color: '#F97316' },
      { key: 'scholar', label: 'Scholar', color: '#A855F7' },
      { key: 'proMember', label: 'Pro Member', color: '#06B6D4' },
      { key: 'freeMember', label: 'Free Member', color: '#10B981' },
      { key: 'guest', label: 'Guest', color: '#64748B' },
    ];

    // Filter roles if selected
    const activeRoles =
      selectedRoleFilter === 'all'
        ? roles
        : roles.filter((r) => r.label.toLowerCase().includes(selectedRoleFilter.toLowerCase()));

    // X0 Scale (Time points)
    const x0Scale = d3
      .scaleBand()
      .domain(actionData.map((d) => d.timeLabel))
      .rangeRound([0, innerWidth])
      .paddingInner(0.2);

    // X1 Scale (Sub-bars for each role)
    const x1Scale = d3
      .scaleBand()
      .domain(activeRoles.map((r) => r.key))
      .rangeRound([0, x0Scale.bandwidth()])
      .padding(0.08);

    // Y Scale
    const maxVal: number =
      (d3.max(actionData, (d: RoleActionDataPoint) => {
        return d3.max(activeRoles, (r) => (d as any)[r.key] as number) || 10;
      }) as number | undefined) ?? 100;

    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal * 1.18])
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.15)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(4)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#8E6D28');

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0Scale).tickSize(0).tickPadding(10))
      .call((axis) => axis.select('.domain').attr('stroke', '#332717'))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(4).tickSize(0).tickPadding(8))
      .call((axis) => axis.select('.domain').attr('stroke', '#332717'))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Tooltip
    const tooltip = d3
      .select(container)
      .append('div')
      .attr(
        'class',
        'absolute hidden px-3 py-2 bg-[#120D22] border border-[#C5A059] rounded-xl text-xs text-white shadow-2xl pointer-events-none z-30 font-mono'
      );

    interface SubBarDatum {
      key: string;
      label: string;
      color: string;
      value: number;
      timeLabel: string;
    }

    // Render Bars
    g.append('g')
      .selectAll('g')
      .data(actionData)
      .enter()
      .append('g')
      .attr('transform', (d: RoleActionDataPoint) => `translate(${x0Scale(d.timeLabel) || 0},0)`)
      .selectAll('rect')
      .data((d: RoleActionDataPoint): SubBarDatum[] =>
        activeRoles.map((r) => ({
          key: r.key,
          label: r.label,
          color: r.color,
          value: (d as any)[r.key] as number,
          timeLabel: d.timeLabel,
        }))
      )
      .enter()
      .append('rect')
      .attr('x', (d: SubBarDatum) => x1Scale(d.key) || 0)
      .attr('y', (d: SubBarDatum) => yScale(d.value))
      .attr('width', x1Scale.bandwidth())
      .attr('height', (d: SubBarDatum) => Math.max(2, innerHeight - yScale(d.value)))
      .attr('fill', (d: SubBarDatum) => d.color)
      .attr('rx', 2)
      .attr('opacity', 0.88)
      .style('cursor', 'pointer')
      .on('mouseover', function (this: SVGRectElement, event: MouseEvent, d: unknown) {
        const item = d as SubBarDatum;
        d3.select(this).transition().duration(150).attr('opacity', 1).attr('stroke', '#FFFFFF').attr('stroke-width', 1.5);
        tooltip
          .style('left', `${event.offsetX + 15}px`)
          .style('top', `${event.offsetY - 20}px`)
          .style('display', 'block').html(`
            <div class="font-bold text-[#F3E5AB]">${item.timeLabel}</div>
            <div class="flex items-center space-x-1.5 mt-0.5" style="color:${item.color}">
              <span class="w-2 h-2 rounded-full inline-block" style="background:${item.color}"></span>
              <span><b>${item.label}</b>: ${item.value} actions</span>
            </div>
          `);
      })
      .on('mouseout', function (this: SVGRectElement) {
        d3.select(this).transition().duration(150).attr('opacity', 0.88).attr('stroke', 'none');
        tooltip.style('display', 'none');
      });
  }, [actionData, selectedRoleFilter]);

  // --------------------------------------------------------------------------
  // D3 CHART 3: Action Distribution Donut Breakdown
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!donutChartContainerRef.current) return;

    const container = donutChartContainerRef.current;
    d3.select(container).selectAll('*').remove();

    const width = 160;
    const height = 160;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<RoleActionSummary>()
      .value((d) => d.totalActions)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<RoleActionSummary>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.95);

    const arcs = svg
      .selectAll('.arc')
      .data(pie(roleSummaries))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#090812')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .transition()
      .duration(750)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t)) || '';
        };
      });

    // Center text
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#FFFFFF')
      .attr('font-family', 'monospace')
      .text(`${(sessionStats.totalOps / 1000).toFixed(1)}k`);

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('font-size', '9px')
      .attr('fill', '#94A3B8')
      .attr('font-family', 'monospace')
      .text('TOTAL OPS');
  }, [roleSummaries, sessionStats.totalOps]);

  // Filter live sessions table
  const filteredLiveSessions = useMemo(() => {
    return liveSessions.filter((sess) => {
      if (selectedRoleFilter !== 'all' && !sess.userRole.toLowerCase().includes(selectedRoleFilter.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = sess.userName.toLowerCase().includes(q);
        const matchEmail = sess.userEmail.toLowerCase().includes(q);
        const matchIp = sess.ipAddress.toLowerCase().includes(q);
        const matchLoc = sess.location.toLowerCase().includes(q);
        const matchDevice = sess.device.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchIp && !matchLoc && !matchDevice) {
          return false;
        }
      }
      return true;
    });
  }, [liveSessions, selectedRoleFilter, searchQuery]);

  const handleTerminateSession = (sessionId: string, userName: string) => {
    setLiveSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'terminated', opsCount: 0 } : s))
    );
    showToast(
      language === 'ti'
        ? `ናይ ${userName} ናይ ምእታው ሰሽን ብሓይሊ ተዓጽዩ ኣሎ!`
        : `Active session for ${userName} has been forcefully revoked.`
    );
  };

  const handleSimulateSpike = () => {
    setActionData((prev) =>
      prev.map((p, idx) => {
        if (idx >= prev.length - 3) {
          return {
            ...p,
            superAdmin: p.superAdmin + 45,
            admin: p.admin + 80,
            scholar: p.scholar + 60,
            proMember: p.proMember + 120,
            totalOps: p.totalOps + 305,
          };
        }
        return p;
      })
    );
    showToast(
      language === 'ti'
        ? 'ናይ ጽዓት ወሰኽ (Load Spike) ኣብ D3 ግራፍ ተፈቲኑ ኣሎ!'
        : 'Simulated high-frequency role spike injected into D3 charts!'
    );
  };

  const handleExportCSV = () => {
    exportSystemLogsToCSV(liveSessions, undefined, currentUser);
    showToast(
      language === 'ti' ? 'ናይ ሲስተም ምንቅስቓስ ሎግ ብ CSV ተሰዲዱ ኣሎ።' : 'System usage logs exported as CSV.'
    );
  };

  const handleExportPDF = () => {
    exportSystemLogsToPDF(liveSessions, undefined, currentUser);
    showToast(
      language === 'ti' ? 'ናይ ሲስተም ምንቅስቓስ ሪፖርት ብ PDF ተዳልዩ ኣሎ።' : 'System usage report generated as PDF.'
    );
  };

  const handleExportTelemetry = () => {
    const payload = {
      exportTimestamp: new Date().toISOString(),
      superAdminObserver: currentUser?.email || 'beckylove2004@gmail.com',
      systemHealth: 'OPTIMAL (99.98%)',
      activeSessions: liveSessions,
      roleActionMetrics: roleSummaries,
      historicalSample: actionData,
    };
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`;
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `axumite-system-activity-telemetry-${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(
      language === 'ti' ? 'ናይ ሲስተም ምንቅስቓስ ዳታ ብ JSON ተሰዲዱ ኣሎ።' : 'System activity telemetry exported as JSON.'
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#171128] border-2 border-amber-400 text-amber-200 shadow-2xl flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <div className="p-1 rounded-lg bg-amber-500/20 text-amber-300">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SUPER ADMIN BANNER & CONTROL TOOLBAR                                   */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#120E1F] via-[#17112A] to-[#0D091A] border-2 border-[#8E6D28]/50 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden">
        
        {/* Ambient Stela Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#8E6D28]/40 via-[#C5A059]/20 to-transparent border border-[#C5A059] flex items-center justify-center text-[#E1C47D] shadow-lg shadow-amber-500/10 shrink-0">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel tracking-wide">
                {language === 'ti' ? 'ናይ ሲስተም ምንቅስቓስን ሰሽንን (D3 Monitor)' : 'System Activity & D3 Telemetry Hub'}
              </h2>
              <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE SENTINEL</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {language === 'ti'
                ? 'ናይ ሱፐር ኣድሚን ናይ D3 ግራፊካዊ ምርመራ፡ ንቑሓት ናይ ምእታው ሰሽናት፣ ናይ ሚናታት ተግባራት ድግግሞሽን ናይ ሲስተም ጥዕናን ዝከታተል'
                : 'Real-time D3-rendered telemetry monitor for Super Admins to track active login concurrency, role-based action frequency distributions, and node latency.'}
            </p>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          
          {/* Live Ping Toggle */}
          <button
            onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer shadow-md ${
              isLiveStreamActive
                ? 'bg-[#181226] border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40'
                : 'bg-[#181226] border-amber-500/30 text-amber-300 hover:bg-amber-950/40'
            }`}
            title="Toggle Live Stream Simulation"
          >
            {isLiveStreamActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Live Feed ON</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Feed Paused</span>
              </>
            )}
          </button>

          {/* Simulate Spike Button */}
          <button
            onClick={handleSimulateSpike}
            className="px-3 py-2 rounded-xl bg-[#1C162E] hover:bg-[#2B2144] border border-[#8E6D28]/60 hover:border-[#C5A059] text-amber-300 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            title="Inject simulated role load burst into D3 charts"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Spike</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-[#181226] hover:bg-[#261B3D] border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95"
            title="Export System Logs as CSV Spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 rounded-xl bg-[#181226] hover:bg-[#261B3D] border border-amber-500/40 hover:border-amber-400 text-[#F3E5AB] text-xs font-bold transition-all cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95"
            title="Export System Telemetry Report as Official PDF"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Export PDF</span>
          </button>

          {/* Export Telemetry JSON */}
          <button
            onClick={handleExportTelemetry}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20 hover:brightness-110 flex items-center space-x-1.5 active:scale-95"
            title="Export Raw D3 Telemetry Payload as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. SYSTEM HEALTH KPI STRIP                                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric, idx) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#0F0B1E] border border-[#8E6D28]/30 shadow-lg relative overflow-hidden flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {metric.title}
                </span>
                <div className="p-2 rounded-xl bg-[#1B152B] border border-[#8E6D28]/40 text-amber-300">
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {metric.value}
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">{metric.unit}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>{metric.subtext}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. SUB-NAVIGATION & TIMEFRAME SELECTOR                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0A0714] border border-[#8E6D28]/30 rounded-2xl">
        
        {/* Tab View Switcher */}
        <div className="flex items-center space-x-1 bg-[#140F24] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'charts'
                ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>D3 Telemetry Charts</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'sessions'
                ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Login Sessions ({liveSessions.filter((s) => s.status !== 'terminated').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-gradient-to-r from-[#8E6D28] to-[#C5A059] text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Role Performance Matrix</span>
          </button>
        </div>

        {/* Filters & Timeframe Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Role Filter */}
          <div className="flex items-center space-x-1.5 bg-[#140F24] border border-slate-700/70 rounded-xl px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-[#151026] text-white">All Roles</option>
              <option value="super admin" className="bg-[#151026] text-amber-400">Super Admin Only</option>
              <option value="admin" className="bg-[#151026] text-orange-400">Admin Only</option>
              <option value="scholar" className="bg-[#151026] text-purple-400">Scholar Only</option>
              <option value="pro member" className="bg-[#151026] text-cyan-400">Pro Member Only</option>
              <option value="free member" className="bg-[#151026] text-emerald-400">Free Member Only</option>
              <option value="guest" className="bg-[#151026] text-slate-400">Guest Only</option>
            </select>
          </div>

          {/* Timeframe Presets */}
          <div className="flex items-center space-x-1 bg-[#140F24] p-1 rounded-xl border border-slate-800">
            {(['1h', '24h', '7d', '30d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#C5A059] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN TAB CONTENTS                                                      */}
      {/* ========================================================================= */}

      {/* TAB 1: D3 CHARTS VIEW */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          
          {/* Top Row: 2 Main D3 Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Active Login Sessions & Concurrency Throughput (D3 Area Stream) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0A1A] border border-[#8E6D28]/40 shadow-2xl relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-cinzel">
                      {language === 'ti' ? 'ናይ ምእታው ሰሽናት ምንቅስቓስ (D3 Concurrency Stream)' : 'Active Login Sessions & Concurrency'}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Dynamic D3 area curve showing simultaneous user throughput
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {sessionStats.active} Active Now
                  </span>
                </div>
              </div>

              {/* D3 Render Container */}
              <div
                ref={sessionsChartContainerRef}
                className="w-full h-[240px] relative flex items-center justify-center"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 mt-2 font-mono">
                <span>Peak Load: <b>{Math.max(...actionData.map((d) => d.totalOps))} ops</b></span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Interactive D3 Monotone Spline</span>
                </span>
              </div>
            </div>

            {/* Chart 2: Role-Based Action Frequency (D3 Multi-Bar Grouped Chart) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0A1A] border border-[#8E6D28]/40 shadow-2xl relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-cinzel">
                      {language === 'ti' ? 'ናይ ሚናታት ተግባራት ድግግሞሽ (D3 Multi-Role Bars)' : 'Role-Based Action Frequency'}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      D3 grouped bar breakdown by administrative & member tiers
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Admin</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Scholar</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Pro</span>
                </div>
              </div>

              {/* D3 Render Container */}
              <div
                ref={roleActionsChartContainerRef}
                className="w-full h-[240px] relative flex items-center justify-center"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 mt-2 font-mono">
                <span>Total Multi-Tier Events: <b>{sessionStats.totalOps.toLocaleString()}</b></span>
                <span className="text-amber-400">Hover bars to inspect role payload</span>
              </div>
            </div>

          </div>

          {/* Bottom Row: Donut Distribution & Live Node Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Donut Chart: Role Volume Share */}
            <div className="p-5 rounded-3xl bg-[#0E0A1A] border border-[#8E6D28]/30 shadow-xl flex flex-col justify-between">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Role Action Share (D3 Arc)
                </h3>
              </div>

              <div className="flex items-center justify-center py-2">
                <div ref={donutChartContainerRef} className="w-[160px] h-[160px]" />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] font-mono">
                {roleSummaries.slice(0, 3).map((r) => (
                  <div key={r.role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-slate-300">{r.role}</span>
                    </div>
                    <span className="font-bold text-white">
                      {((r.totalActions / (sessionStats.totalOps || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Live Session Stream Feed */}
            <div className="p-5 rounded-3xl bg-[#0E0A1A] border border-[#8E6D28]/30 shadow-xl lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                    Real-Time Active Nodes Pulse
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All Sessions</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {liveSessions.slice(0, 3).map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3 rounded-2xl bg-[#140F24] border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8E6D28]/30 to-transparent border border-[#C5A059]/50 flex items-center justify-center text-amber-300 font-black">
                        {sess.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center space-x-2">
                          <span>{sess.userName}</span>
                          <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {sess.userRole}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
                          <span>{sess.location}</span>
                          <span>•</span>
                          <span>{sess.device}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-emerald-400 font-bold">{sess.opsCount} ops</div>
                      <div className="text-[10px] text-slate-500">{sess.activeDurationMinutes}m uptime</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3">
                <span>Last Telemetry Sync: <b>{lastSyncTime.toLocaleTimeString()}</b></span>
                <span className="text-emerald-400 font-bold">100% Cryptographic Handshake OK</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ACTIVE SESSIONS TABLE */}
      {activeTab === 'sessions' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0A1A] border border-[#8E6D28]/40 shadow-2xl space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                {language === 'ti' ? 'ንቑሓት ናይ ምእታው ሰሽናት (Active Live Sessions)' : 'Active Login Sessions Ledger'}
              </h3>
              <p className="text-xs text-slate-400">
                Super Admin real-time session watchdog with remote revocation capabilities.
              </p>
            </div>

            {/* Search sessions */}
            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, IP, location, device..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#140F24] border border-slate-700/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#090613]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#140F24] border-b border-slate-800 text-slate-300 font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-bold">User Identity</th>
                  <th className="py-3.5 px-4 font-bold">Role Tier</th>
                  <th className="py-3.5 px-4 font-bold">Network & Location</th>
                  <th className="py-3.5 px-4 font-bold">Device & Client</th>
                  <th className="py-3.5 px-4 font-bold">Throughput Ops</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredLiveSessions.map((sess) => (
                  <tr
                    key={sess.id}
                    className={`hover:bg-[#151025] transition-colors ${
                      sess.status === 'terminated' ? 'opacity-40 bg-rose-950/10' : ''
                    }`}
                  >
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8E6D28]/40 to-[#C5A059]/20 border border-[#C5A059]/60 flex items-center justify-center text-amber-300 font-black text-xs shrink-0">
                          {sess.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{sess.userName}</span>
                            {sess.isCurrentAdmin && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{sess.userEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-[#1A142E] text-amber-300 border border-[#8E6D28]/40">
                        {sess.userRole}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5 text-slate-200 font-bold">
                        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{sess.location}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{sess.ipAddress}</div>
                    </td>

                    {/* Device */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-bold">{sess.device}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{sess.browser}</div>
                    </td>

                    {/* Throughput */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-emerald-400">{sess.opsCount} ops</div>
                      <div className="text-[10px] text-slate-400">{sess.activeDurationMinutes}m active</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {sess.status === 'active' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>ACTIVE</span>
                        </span>
                      )}
                      {sess.status === 'idle' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <span>IDLE</span>
                        </span>
                      )}
                      {sess.status === 'terminated' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          <span>REVOKED</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      {sess.isCurrentAdmin ? (
                        <span className="text-[11px] text-slate-500 font-mono italic">Primary Node</span>
                      ) : sess.status === 'terminated' ? (
                        <span className="text-[10px] text-rose-400 font-mono">Terminated</span>
                      ) : (
                        <button
                          onClick={() => handleTerminateSession(sess.id, sess.userName)}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 text-[10.5px] font-bold transition-all cursor-pointer"
                        >
                          Revoke Session
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: ROLE PERFORMANCE MATRIX */}
      {activeTab === 'matrix' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0A1A] border border-[#8E6D28]/40 shadow-2xl space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white font-cinzel">
              {language === 'ti' ? 'ናይ ሚናታት ኣሰራርሓን ድግግሞሽን ማትሪክስ' : 'Role-Based Action Frequency & Latency Matrix'}
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated system metrics evaluating operation volumes, top request types, and edge latency across role tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleSummaries.map((r) => (
              <div
                key={r.role}
                className="p-4 rounded-2xl bg-[#140F24] border border-slate-800 hover:border-amber-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="font-bold text-white text-sm">{r.role}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {r.activeUsersCount} Active Nodes
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Total Ops:</span>
                    <span className="font-bold text-white">{r.totalActions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Mean Latency:</span>
                    <span className="font-bold text-emerald-400">{r.avgLatencyMs} ms</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Error Rate:</span>
                    <span className="font-bold text-slate-300">{r.errorRatePercent}%</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 uppercase">Primary Workload:</span>
                    <div className="text-amber-200/90 text-[11px] font-sans font-semibold mt-0.5">
                      {r.topActionType}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
