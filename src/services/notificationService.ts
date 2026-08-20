import { AppNotification, NotificationPreferences } from '../types';

const STORAGE_KEY_NOTIFICATIONS = 'axumite_push_notifications';
const STORAGE_KEY_PREFS = 'axumite_notification_prefs';

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enableWebPush: true,
  enableScholarships: true,
  enableSystemUpdates: true,
  enablePaymentAlerts: true,
  enableAudioChime: true,
  preferredLanguage: 'bilingual',
};

export const NOTIFICATION_EVENT_NAME = 'axumite:new_notification';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_payment_failed_alert',
    titleTi: '⚠️ ናይ ኣባልነት ክፍሊት ኣይተሳኽዐን (Subscription Payment Failed)',
    titleEn: '⚠️ Subscription Payment Failed - Action Required',
    bodyTi: 'ናይ ልዑላዊ AI ፕሮ ኣባልነት ክፍሊትኩም ኣይተሳኽዐን (Card declined or insufficient funds)። ብኽብረትኩም ናብ ክፍሊት ምሕደራ ብምእታው ናይ ካርድ ወይ ናይ ባንክ ሓበሬታኹም ኣሐድሱ።',
    bodyEn: 'Your subscription recurring billing failed to process. Please visit Payment Management to update your billing info and maintain continuous AI Pro privileges.',
    category: 'payment_failed',
    timestamp: 'ሕጂ • Just now',
    isoDate: new Date().toISOString(),
    read: false,
    urgency: 'urgent',
    actionLabelTi: 'ናይ ክፍሊት ሓበሬታ ኣሐድስ',
    actionLabelEn: 'Update Billing Info',
    badgeText: 'Payment Failed',
    actionType: 'open_payment',
    targetTab: 'payment',
    paymentDetails: {
      planName: 'ልዑላዊ AI ፕሮ (Sovereign Pro)',
      amount: 79.99,
      currency: 'USD',
      failureReason: 'Card issuer declined authorization / Insufficient funds.',
      invoiceNumber: 'INV-FAILED-2026',
      last4: '4242',
      paymentMethod: 'Stripe Credit Card (•••• 4242)',
    },
  },
  {
    id: 'notif_scholarship_daad_2026',
    titleTi: '🎓 ሓድሽ ዕድል ስኮላርሺፕ፡ DAAD ጀርመን 2026/27 ምሉእ ብምሉእ ዝተኸፍለ',
    titleEn: '🎓 New Scholarship Opportunity: DAAD Germany 2026/27 Intake Open',
    bodyTi: 'መንግስቲ ጀርመን ንኤርትራውያንን ኣፍሪቃውያንን ተመሃሮ ምሉእ ናጻ ትምህርቲ፡ ናይ ወርሒ ኣበል (€934)፡ ናይ ነፋሪት ቲኬትን ናይ ጥዕና መድሕንን ይህብ ኣሎ።',
    bodyEn: 'German Academic Exchange Service (DAAD) opens fully-funded Master & PhD scholarships for Eritrean & Global South scholars with monthly stipend (€934) and travel allowance.',
    category: 'scholarship',
    timestamp: 'ቅድሚ 15 ደቒቕ • 15m ago',
    isoDate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    urgency: 'urgent',
    scholarshipId: 'daad',
    actionUrl: 'https://www.daad.de/en/',
    actionLabelTi: 'ስኮላርሺፕ ተመልከት',
    actionLabelEn: 'View Scholarship',
    badgeText: 'Closing Soon',
  },
  {
    id: 'notif_sys_update_v4',
    titleTi: '⚙️ ወሳኒ ናይ ስርዓት ምምሕያሽ፡ Axumite AI 4.0 Neural Engine ተዘርጊሑ',
    titleEn: '⚙️ System Update: Axumite AI 4.0 Neural Engine Deployed',
    bodyTi: 'ናይ ትግርኛ ድምጺ ምድላው (Neural TTS) ብ 40% ቅልጣፈ ወሲኹ፡ ናይ ግዕዝ ኪነ-ጽሕፈት ስቱድዮን 4K ድማ ብምሉእ ተኸፊቱ ኣሎ።',
    bodyEn: 'Major system update deployed: Tigrinya Neural Speech latency reduced by 40%, offline cache hit rate boosted, and 4K Ge\'ez Calligraphy Studio activated.',
    category: 'system_update',
    timestamp: 'ቅድሚ 1 ሰዓት • 1h ago',
    isoDate: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: false,
    urgency: 'important',
    actionLabelTi: 'ዝርዝር ምምሕያሽ ርአ',
    actionLabelEn: 'View System Status',
    badgeText: 'v4.0 Live',
  },
  {
    id: 'notif_scholarship_mastercard_2026',
    titleTi: '🎓 ማስተርካርድ ፋውንዴሽን፡ ናጻ ናይ ማስተርስ ትምህርቲ ኣብ ካናዳን UKን',
    titleEn: '🎓 Mastercard Foundation Scholars: Full Ride at McGill & Edinburgh',
    bodyTi: 'ናይ ትምህርቲ ክፍሊት፡ መዕረፊ፡ ናይ መነባበሮ ወጻኢታትን ላፕቶፕን ዘጠቓለለ ምሉእ ናጻ ዕድል ትምህርቲ ንመንእሰያት መራሕቲ።',
    bodyEn: 'Comprehensive full-ride funding covering tuition, housing, flights, living stipend, and research mentorship for transformative African leaders.',
    category: 'scholarship',
    timestamp: 'ቅድሚ 3 ሰዓታት • 3h ago',
    isoDate: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    read: false,
    urgency: 'urgent',
    scholarshipId: 'mastercard',
    actionLabelTi: 'ዝርዝር ሓበሬታ ርአ',
    actionLabelEn: 'View Opportunity',
    badgeText: 'Fully Funded',
  },
  {
    id: 'notif_feature_calligraphy_studio',
    titleTi: '🎨 ሓድሽ መሳርሒ፡ ናይ ግዕዝ ኪነ-ጽሕፈት ስቱድዮ ብ 4K ውጽኢት',
    titleEn: '🎨 New Feature Launch: Ge\'ez Calligraphy Studio with 4K Export',
    bodyTi: 'ጥንታዊ ማኅተም ኣክሱም፡ ናይ ብራና ሓረግ ስነ-ጥበብን 4K ፎቶታትን ብቐጥታ ምፍጣርን ምዕቃብን ተኸፊቱ ኣሎ።',
    bodyEn: 'Generate illuminated Birana manuscripts, Axumite talismanic seals, and export ultra-high-resolution 4K Ge\'ez wallpapers directly.',
    category: 'feature',
    timestamp: 'ትማሊ • Yesterday',
    isoDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    urgency: 'info',
    actionLabelTi: 'ስቱድዮ ክፈት',
    actionLabelEn: 'Open Studio',
    badgeText: 'New Studio',
  },
  {
    id: 'notif_scholarship_turkiye_2026',
    titleTi: '🎓 ቱርክዬ ቡርስላሪ (Türkiye Bursları) 2026 ምሉእ ስኮላርሺፕ',
    titleEn: '🎓 Turkiye Burslari Government Scholarships 2026',
    bodyTi: 'ናይ ባችለር፡ ማስተርስን ዶክተርነትን ምሉእ ብምሉእ ዝተኸፍለ ናይ ቱርኪ መንግስቲ ስኮላርሺፕ ንዓለምለኸ ተመሃሮ።',
    bodyEn: 'Fully funded scholarship by the Turkish Government covering university placement, tuition, monthly allowance, accommodation, and flights.',
    category: 'scholarship',
    timestamp: 'ቅድሚ 2 መዓልቲ • 2d ago',
    isoDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    read: true,
    urgency: 'important',
    scholarshipId: 'turkiye',
    actionLabelTi: 'ስኮላርሺፕ ተመልከት',
    actionLabelEn: 'View Scholarship',
    badgeText: 'Full Grant',
  },
  {
    id: 'notif_security_idle_guard',
    titleTi: '🛡️ ናይ ድሕንነት ሓበሬታ፡ ናይ 30 ደቒቕ ዕረፍቲ ኣውቶማቲክ መከላኸሊ ተተኺሉ',
    titleEn: '🛡️ Security Notice: 30-Minute Idle Auto-Protection Active',
    bodyTi: 'ናይ ሕሳብኩም ድሕንነት ንምሕላው፡ ድሕሪ 30 ደቒቕ ዘይምንቅስቓስ ብውሕስነት ሎግ-ኣውት ዝገብር መከላኸሊ ብዕሊ ተተኺሉ ኣሎ።',
    bodyEn: 'Your account is safeguarded with 30-minute inactivity auto-logout protection and encrypted local session persistence.',
    category: 'security',
    timestamp: 'ቅድሚ 3 መዓልቲ • 3d ago',
    isoDate: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    read: true,
    urgency: 'info',
    actionLabelTi: 'ናይ ድሕንነት ቅጥዕታት ርአ',
    actionLabelEn: 'Security Settings',
    badgeText: 'Protected',
  },
];

// Play Golden Chime Synthesizer Tone via Web Audio API
export function playGoldenNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    const notes = [587.33, 880.00, 1174.66]; // D5, A5, D6 golden chord

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.5);
    });
  } catch {
    // Graceful fallback if audio is not permitted by browser
  }
}

// Retrieve stored notifications from localStorage
export function getStoredNotifications(): AppNotification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load notifications from localStorage:', err);
  }
  // Default seed
  saveStoredNotifications(INITIAL_NOTIFICATIONS);
  return INITIAL_NOTIFICATIONS;
}

// Save notifications to localStorage
export function saveStoredNotifications(notifs: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifs));
  } catch (err) {
    console.error('Failed to save notifications to localStorage:', err);
  }
}

// Retrieve notification preferences
export function getStoredPreferences(): NotificationPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFS);
    if (stored) {
      return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore error
  }
  return DEFAULT_NOTIFICATION_PREFERENCES;
}

// Save notification preferences
export function saveStoredPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save notification preferences:', err);
  }
}

// Check Browser Push Permission Status
export function getBrowserPushPermissionStatus(): 'default' | 'granted' | 'denied' | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

// Request Browser Push Permission
export async function requestBrowserPushPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return 'denied';
  }
}

// Trigger Web Push Notification if browser permission granted
export function triggerBrowserPushNotification(
  notif: AppNotification,
  language: 'ti' | 'en' = 'ti'
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const title = language === 'ti' ? notif.titleTi : notif.titleEn;
    const body = language === 'ti' ? notif.bodyTi : notif.bodyEn;

    const pushNotif = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notif.id,
      data: {
        id: notif.id,
        category: notif.category,
        scholarshipId: notif.scholarshipId,
        actionUrl: notif.actionUrl,
        targetTab: notif.targetTab,
      },
    });

    pushNotif.onclick = () => {
      window.focus();
      if (notif.actionUrl) {
        window.open(notif.actionUrl, '_blank');
      }
      pushNotif.close();
    };

    return true;
  } catch (err) {
    console.error('Error triggering web push notification:', err);
    return false;
  }
}

// Create a structured payment failed notification
export function createPaymentFailedNotification(params?: {
  planName?: string;
  amount?: number;
  currency?: string;
  failureReason?: string;
  invoiceNumber?: string;
  last4?: string;
  paymentMethod?: string;
}): AppNotification {
  const plan = params?.planName || 'ልዑላዊ AI ፕሮ (Sovereign Pro)';
  const amount = params?.amount !== undefined ? params.amount : 79.99;
  const currency = params?.currency || 'USD';
  const reason = params?.failureReason || 'Card declined or insufficient funds.';
  const last4 = params?.last4 || '4242';
  const method = params?.paymentMethod || `Card ending in •••• ${last4}`;
  const invNumber = params?.invoiceNumber || `INV-FAIL-${Date.now().toString().slice(-6)}`;

  return {
    id: `notif_pay_fail_${Date.now()}`,
    titleTi: '⚠️ ናይ ኣባልነት ክፍሊት ኣይተሳኽዐን (Subscription Payment Failed)',
    titleEn: '⚠️ Subscription Payment Failed - Action Required',
    bodyTi: `ናይ ${plan} (${currency} ${amount}) ክፍሊትኩም ኣይተሳኽዐን [${reason}]። በጃኹም ናብ ክፍሊት ምሕደራ ብምኻድ ናይ ክፍሊት ሓበሬታኹም ኣሐድሱ።`,
    bodyEn: `Your payment of ${currency} ${amount} for ${plan} failed (${reason}). Please update your billing method to prevent interruption of your Sovereign Pro benefits.`,
    category: 'payment_failed',
    timestamp: 'ሕጂ • Just now',
    isoDate: new Date().toISOString(),
    read: false,
    urgency: 'urgent',
    actionLabelTi: 'ናይ ክፍሊት ሓበሬታ ኣሐድስ',
    actionLabelEn: 'Update Billing Info',
    badgeText: 'Payment Action Required',
    actionType: 'open_payment',
    targetTab: 'payment',
    paymentDetails: {
      planName: plan,
      amount,
      currency,
      failureReason: reason,
      invoiceNumber: invNumber,
      last4,
      paymentMethod: method,
    },
  };
}

// Dispatch an in-app notification across active components and persistence
export function dispatchAppNotification(notif: AppNotification): void {
  // 1. Store in localStorage
  const existing = getStoredNotifications();
  const updated = [notif, ...existing.filter((n) => n.id !== notif.id)];
  saveStoredNotifications(updated);

  // 2. Play audio chime if enabled
  const prefs = getStoredPreferences();
  if (prefs.enableAudioChime) {
    playGoldenNotificationChime();
  }

  // 3. Trigger Web Push if enabled
  if (prefs.enableWebPush) {
    triggerBrowserPushNotification(notif, prefs.preferredLanguage === 'ti' ? 'ti' : 'en');
  }

  // 4. Dispatch custom DOM event for active UI components
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(NOTIFICATION_EVENT_NAME, { detail: notif });
    window.dispatchEvent(event);
  }
}

// Trigger payment failure alert
export function triggerPaymentFailedAlert(params?: {
  planName?: string;
  amount?: number;
  currency?: string;
  failureReason?: string;
  invoiceNumber?: string;
  last4?: string;
  paymentMethod?: string;
}): AppNotification {
  const notif = createPaymentFailedNotification(params);
  dispatchAppNotification(notif);
  return notif;
}

