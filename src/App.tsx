import React, { useState, useEffect, useRef } from 'react';
import { AppTab, SavedItem, UserProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ObeliskChat } from './components/ObeliskChat';
import { VisionStudio } from './components/VisionStudio';
import { PromptForge } from './components/PromptForge';
import { GeezTranslator } from './components/GeezTranslator';
import { GeezCalligraphyStudio } from './components/GeezCalligraphyStudio';
import { SavedInsights } from './components/SavedInsights';
import { Analytics } from './components/Analytics';
import { PaymentSystem } from './components/PaymentSystem';
import { AssistanceSystem } from './components/AssistanceSystem';
import { UserManagementModal } from './components/UserManagementModal';
import { SecurityManagementModal } from './components/SecurityManagementModal';
import { TigrinyaOnboardingModal } from './components/TigrinyaOnboardingModal';
import { BrandHeroModal } from './components/BrandHeroModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import { AuthModal } from './components/AuthModal';
import { IdleWarningModal } from './components/IdleWarningModal';
import { AxumiteHibernationScreen } from './components/AxumiteHibernationScreen';
import { useIdleTimer } from './hooks/useIdleTimer';
import { EritreanPremiereView } from './components/EritreanPremiereView';
import { ManagementHub } from './components/ManagementHub';
import { SovereignSideDrawer } from './components/SovereignSideDrawer';
import { JobSearchModal } from './components/JobSearchModal';
import { LegalAdvisorModal } from './components/LegalAdvisorModal';
import { MechanicDiagnosisModal } from './components/MechanicDiagnosisModal';
import { HistoryModal } from './components/HistoryModal';
import { PremiumUpgradeModal } from './components/PremiumUpgradeModal';
import { PricingPlanComparisonModal } from './components/PricingPlanComparisonModal';
import { SubscriptionGateModal } from './components/SubscriptionGateModal';
import { ScholarshipModal } from './components/ScholarshipModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { PushNotificationToast } from './components/PushNotificationToast';
import { AiVideoTranslatorModal } from './components/AiVideoTranslatorModal';
import { VoiceCommandOverlay } from './components/VoiceCommandOverlay';
import { AlwaysListeningFloatingIndicator } from './components/AlwaysListeningFloatingIndicator';
import { UserFileManagerModal } from './components/UserFileManagerModal';
import { useAlwaysListeningVoice } from './hooks/useAlwaysListeningVoice';
import { useLanguage } from './context/LanguageContext';
import { EducationPlatformView } from './components/education/EducationPlatformView';
import { BusinessHubView } from './components/business/BusinessHubView';
import { CulturalExplorerView } from './components/cultural/CulturalExplorerView';
import { AndroidAppInterfaceView } from './components/AndroidAppInterfaceView';
import { RewardsView } from './components/RewardsView';
import { useSubscription } from './context/SubscriptionContext';
import { AppNotification, NotificationPreferences } from './types';
import { 
  getStoredNotifications, 
  saveStoredNotifications, 
  getStoredPreferences, 
  saveStoredPreferences, 
  playGoldenNotificationChime, 
  triggerBrowserPushNotification,
  NOTIFICATION_EVENT_NAME
} from './services/notificationService';
import { playVoiceTriggerChime } from './utils/audioChime';
import { 
  syncUserProfileToFirestore,
  handleFirebaseRedirectResult,
  onFirebaseAuthStateChanged,
  fetchUserProfileFromFirestore
} from './lib/firebase';
import { useBrandingTheme } from './context/BrandingThemeContext';
import { WifiOff, RefreshCw, Hand, ChevronLeft, ChevronRight } from 'lucide-react';
import logoImg from './assets/images/axumite_3d_luxury_logo_1787505687476.jpg';
import axumiteBgImg from './assets/images/axumite_background_1786611272574.jpg';

const DEFAULT_USER: UserProfile = {
  id: 'usr_guest_001',
  name: 'ጋሻ (Guest User)',
  email: 'guest@axumite.ai',
  phoneNumber: '',
  countryCode: '+291',
  isPhoneVerified: false,
  isEmailVerified: false,
  avatar: 'axumite-star',
  role: 'Guest',
  preferredLanguage: 'ti-ER',
  isLoggedIn: true,
  joinedDate: '2026',
  offlineAccessEnabled: true,
  savedInsightsCount: 0,
};

export default function App() {
  const { isProOrHigher } = useSubscription();
  const { language, setLanguage } = useLanguage();
  const { 
    setThemeScheme, 
    setGoldIntensity, 
    setThemeHue, 
    setGoldShimmerEffect, 
    setBorderGlow 
  } = useBrandingTheme();
  const [activeTab, setActiveTab] = useState<AppTab>('premiere');
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isHibernationOpen, setIsHibernationOpen] = useState(false);
  
  // Sovereign All-Tools Drawer and Specialized AI Modals State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isJobSearchOpen, setIsJobSearchOpen] = useState(false);
  const [isScholarshipOpen, setIsScholarshipOpen] = useState(false);
  const [isVideoTranslatorOpen, setIsVideoTranslatorOpen] = useState(false);
  const [isVoiceOverlayOpen, setIsVoiceOverlayOpen] = useState(false);
  const [isUserFileVaultOpen, setIsUserFileVaultOpen] = useState(false);
  const [targetScholarshipId, setTargetScholarshipId] = useState<string | undefined>(undefined);
  const [isLegalAdvisorOpen, setIsLegalAdvisorOpen] = useState(false);
  const [isMechanicOpen, setIsMechanicOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [pendingChatPrompt, setPendingChatPrompt] = useState('');

  // Sovereign Hands-Free Always-Listening Voice System
  const {
    isAlwaysListening,
    toggleAlwaysListening,
    lastHeardPhrase,
    lastActionFeedback,
    clearFeedback,
  } = useAlwaysListeningVoice({
    navigateTab: (tab) => setActiveTab(tab),
    openSettings: () => setIsUserModalOpen(true),
    openSecurity: () => setIsSecurityModalOpen(true),
    openJobSearch: () => setIsJobSearchOpen(true),
    openScholarship: () => setIsScholarshipOpen(true),
    openLegalAdvisor: () => setIsLegalAdvisorOpen(true),
    openMechanic: () => setIsMechanicOpen(true),
    openHistory: () => setIsHistoryOpen(true),
    openNotifications: () => setIsNotificationCenterOpen(true),
    openPricing: () => setIsPremiumModalOpen(true),
    openDrawer: () => setIsDrawerOpen(true),
    openVideoTranslator: () => setIsVideoTranslatorOpen(true),
    openVoiceOverlay: () => setIsVoiceOverlayOpen(true),
    setLanguage: (lang) => setLanguage(lang),
    onSendChatMessage: (prompt) => {
      setPendingChatPrompt(prompt);
      setActiveTab('chat');
    },
  });

  // Push Notification System State & Preferences
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [activePushToast, setActivePushToast] = useState<AppNotification | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStoredNotifications());
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(() => getStoredPreferences());

  const handleUpdateNotifications = (newNotifs: AppNotification[]) => {
    setNotifications(newNotifs);
    saveStoredNotifications(newNotifs);
  };

  const handleUpdateNotificationPrefs = (newPrefs: NotificationPreferences) => {
    setNotificationPrefs(newPrefs);
    saveStoredPreferences(newPrefs);
  };

  const handleOpenScholarshipFromNotification = (scholarshipId?: string) => {
    setTargetScholarshipId(scholarshipId);
    setIsScholarshipOpen(true);
  };

  const handleTriggerTestPushNotification = () => {
    const testSamples: Omit<AppNotification, 'id' | 'timestamp' | 'isoDate' | 'read'>[] = [
      {
        titleTi: '🎓 ሓድሽ ዕድል ስኮላርሺፕ፡ KAIST ኮርያ 2026/27 ምሉእ ብምሉእ ዝተኸፍለ STEM',
        titleEn: '🎓 New Scholarship: KAIST South Korea 2026 Full AI & STEM Fellowship',
        bodyTi: 'ኣብ ኮርያ ብሉጽ ናይ ሳይንስን ቴክኖሎጂን ትምህርቲ፡ ምሉእ ናጻ ክፍሊት ትምህርቲ፡ ናይ ወርሒ $1,000 ኣበልን ናይ ምርምር ደገፍን።',
        bodyEn: 'Korea Advanced Institute of Science and Technology (KAIST) offers full tuition, monthly living allowance ($1,000/mo), and national health insurance.',
        category: 'scholarship',
        urgency: 'urgent',
        scholarshipId: 'kaust-fellowship',
        actionLabelTi: 'ስኮላርሺፕ ተመልከት',
        actionLabelEn: 'View Scholarship',
        badgeText: 'Full Fellowship',
      },
      {
        titleTi: '🎓 ኤራስመስ ሙንዱስ (Erasmus Mundus) ናይ ኣውሮጳ ሕብረት 2026/27',
        titleEn: '🎓 Erasmus Mundus Joint Master Degrees 2026 EU Full Grant',
        bodyTi: 'ኣብ 2 ክሳብ 3 ናይ ኣውሮጳ ሃገራት ብነጻ ናይ ማስተርስ ዲግሪ ንምምሃርን ናይ ወርሒ €1,400 ኣበልን ዝወሃብ ዓለምለኸ ስኮላርሺፕ።',
        bodyEn: 'Prestigious European Commission scholarship covering tuition in multiple EU countries with €1,400 monthly allowance and flight funding.',
        category: 'scholarship',
        urgency: 'urgent',
        scholarshipId: 'erasmus-mundus',
        actionLabelTi: 'ዝርዝር ሓበሬታ ርአ',
        actionLabelEn: 'View Details',
        badgeText: 'EU Grant',
      },
      {
        titleTi: '⚙️ ናይ ስርዓት ሓበሬታ፡ ናይ ትግርኛ ድምጺ AI 2.0 ሞዴል ተኸፊቱ',
        titleEn: '⚙️ System Alert: Tigrinya Neural TTS v2.0 Ultra-Crisp Voice Activated',
        bodyTi: 'ሓድሽ ናይ ትግርኛ ንባብን ድምጺ ምድላውን ሞዴል ብዝለዓለ ጽሬት ኣብ ኩሉ ናይ ቻትን ትርጉምን ክፍሊ ተተኺሉ ኣሎ።',
        bodyEn: 'Upgraded Tigrinya natural voice synthesis engine is now active across voice assistance, translation, and welcome greetings.',
        category: 'system_update',
        urgency: 'important',
        actionLabelTi: 'ድምጺ ፈትን',
        actionLabelEn: 'Try Voice',
        badgeText: 'Audio v2.0',
      },
    ];

    const randomIndex = Math.floor(Math.random() * testSamples.length);
    const chosen = testSamples[randomIndex];

    const newNotification: AppNotification = {
      ...chosen,
      id: `notif_${Date.now()}`,
      timestamp: 'ሕጂ • Just now',
      isoDate: new Date().toISOString(),
      read: false,
    };

    const updated = [newNotification, ...notifications];
    handleUpdateNotifications(updated);
    setActivePushToast(newNotification);

    if (notificationPrefs.enableAudioChime) {
      playGoldenNotificationChime();
    }

    if (notificationPrefs.enableWebPush) {
      triggerBrowserPushNotification(
        newNotification,
        user.preferredLanguage?.startsWith('ti') ? 'ti' : 'en'
      );
    }
  };

  // Sync programmatic and cross-system notifications (e.g. Stripe payment failure alerts)
  useEffect(() => {
    const handleNewNotificationEvent = (e: any) => {
      const detail: AppNotification = e?.detail;
      if (!detail) return;
      setNotifications((prev) => [detail, ...prev.filter((n) => n.id !== detail.id)]);
      setActivePushToast(detail);
    };

    window.addEventListener(NOTIFICATION_EVENT_NAME as any, handleNewNotificationEvent);
    return () => {
      window.removeEventListener(NOTIFICATION_EVENT_NAME as any, handleNewNotificationEvent);
    };
  }, []);

  const triggerCursorToChat = () => {
    setActiveTab('chat');
  };

  const handleSelectPromptForChat = (prompt: string) => {
    setPendingChatPrompt(prompt);
    setActiveTab('chat');
  };
  
  // Auth & OTP Verification Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'verify' | 'forgot_password'>('login');
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);

  const handleOpenAuthModal = (mode: 'login' | 'signup' | 'verify' | 'forgot_password', reason?: string) => {
    setAuthMode(mode);
    setAuthReason(reason);
    setIsAuthModalOpen(true);
  };

  // Offline detection state
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global Keyboard Shortcut for Voice Commands (Press 'v' when not typing, or Ctrl+Shift+V)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      
      if (!isInput && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        setIsVoiceOverlayOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsVoiceOverlayOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persistent User State
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('axumite_user_profile');
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        const normalizedEmail = (parsed.email || '').trim().toLowerCase();
        if (normalizedEmail === 'beckylove2004@gmail.com') {
          parsed.role = 'Creator';
          parsed.isEmailVerified = true;
          parsed.isPhoneVerified = true;
        } else {
          parsed.role = 'Guest';
        }
        return parsed;
      }
      return DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('axumite_user_profile', JSON.stringify(user));
      if (user?.email && user?.isLoggedIn) {
        syncUserProfileToFirestore(user);
      }
    } catch (err) {
      console.error('Failed to save user profile:', err);
    }
  }, [user]);

  // Firebase Auth Redirect Resolution & Continuous Session Synchronization
  useEffect(() => {
    let isMounted = true;

    // 1. Check and resolve any redirect results from Firebase Auth to prevent initial login sequence errors
    handleFirebaseRedirectResult()
      .then((redirectedProfile) => {
        if (redirectedProfile && isMounted) {
          handleUpdateUser({
            ...redirectedProfile,
            isLoggedIn: true,
          });
        }
      })
      .catch((err) => {
        console.warn('Firebase initial redirect resolution notice:', err);
      });

    // 2. Continuous Firebase Auth state listener to synchronize session
    const unsubscribe = onFirebaseAuthStateChanged(async (fbUser) => {
      if (!isMounted) return;
      if (fbUser && fbUser.email) {
        const email = fbUser.email.trim().toLowerCase();
        const isSuperadmin = email === 'beckylove2004@gmail.com';
        
        try {
          const cloudProfile = await fetchUserProfileFromFirestore(email);
          if (cloudProfile && isMounted) {
            // Restore theme preferences from Firestore cloud profile
            if (cloudProfile.themePreference) {
              setThemeScheme(cloudProfile.themePreference);
            }
            if (cloudProfile.themeConfig) {
              if (cloudProfile.themeConfig.goldIntensity) setGoldIntensity(cloudProfile.themeConfig.goldIntensity);
              if (cloudProfile.themeConfig.themeHue) setThemeHue(cloudProfile.themeConfig.themeHue as any);
              if (typeof cloudProfile.themeConfig.goldShimmerEffect === 'boolean') setGoldShimmerEffect(cloudProfile.themeConfig.goldShimmerEffect);
              if (typeof cloudProfile.themeConfig.borderGlow === 'boolean') setBorderGlow(cloudProfile.themeConfig.borderGlow);
            }

            handleUpdateUser({
              ...cloudProfile,
              isLoggedIn: true,
              isEmailVerified: fbUser.emailVerified || cloudProfile.isEmailVerified || isSuperadmin,
            });
          } else if (isMounted) {
            handleUpdateUser({
              id: fbUser.uid,
              name: fbUser.displayName || (isSuperadmin ? 'Becky Love (Superadmin)' : 'Axumite Member'),
              email,
              isLoggedIn: true,
              isEmailVerified: fbUser.emailVerified || isSuperadmin,
              role: isSuperadmin ? 'Creator' : 'Guest',
            });
          }
        } catch (profileErr) {
          console.warn('Auth state profile fetch notice:', profileErr);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      const normalizedEmail = (next.email || '').trim().toLowerCase();
      
      // Enforce Superadmin authority for beckylove2004@gmail.com, and Guest for all other users
      if (normalizedEmail === 'beckylove2004@gmail.com') {
        next.role = 'Creator';
        next.isEmailVerified = true;
        next.isPhoneVerified = true;
      } else {
        next.role = 'Guest';
      }

      const isExplicitLogin = updated.isLoggedIn === true;
      const isAccountSwitch = prev.email && next.email && prev.email.toLowerCase() !== next.email.toLowerCase();
      const isStateLogin = !prev.isLoggedIn && next.isLoggedIn;

      if ((isExplicitLogin && next.isLoggedIn) || isStateLogin || isAccountSwitch) {
        setTimeout(() => {
          setActiveTab('premiere');
        }, 50);
      }
      return next;
    });
  };

  // 30-Minute Inactivity Idle Auto-Logout Security Shield
  const handleIdleAutoLogout = () => {
    if (user?.isLoggedIn) {
      handleUpdateUser({ isLoggedIn: false });
      setAuthReason('🔒 ድሕንነትኩም ንምሕላው፡ ብሰንኪ 30 ደቓይቕ ዘይምንቅስቓስ ብኣውቶማቲክ ወጺእኩም ኣለኹም (Logged out automatically after 30 minutes of inactivity for your account security. Please sign in again).');
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const {
    remainingSeconds,
    isWarning: isIdleWarning,
    formattedRemaining,
    resetTimer: resetIdleTimer,
  } = useIdleTimer({
    timeoutMs: 30 * 60 * 1000, // 30 Minutes
    warningMs: 60 * 1000,      // 60 Seconds warning countdown
    isLoggedIn: !!user?.isLoggedIn,
    onIdle: handleIdleAutoLogout,
  });

  // Enforce mandatory registration & login before starting the app
  useEffect(() => {
    if (!user || !user.isLoggedIn) {
      setIsAuthModalOpen(true);
      setAuthMode('login');
      if (!authReason) {
        setAuthReason('ቅድሚ ምጅማርኩም ምዝገባ ወይ ሎግ ኢን የድሊ (Registration or Sign In is required before using AXUMITE AI).');
      }
    }
  }, [user?.isLoggedIn, authReason]);

  // Persistent Saved Insights
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('axumite_saved_insights');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('axumite_saved_insights', JSON.stringify(savedItems));
    } catch (err) {
      console.error('Failed to save insights to localStorage:', err);
    }
  }, [savedItems]);

  const handleSaveInsight = (itemData: Omit<SavedItem, 'id' | 'createdAt'>) => {
    const newItem: SavedItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setSavedItems((prev) => [newItem, ...prev]);
  };

  const handleDeleteInsight = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Touch Gesture Swipe Navigation State & Handlers
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const [swipeNotice, setSwipeNotice] = useState<{ label: string; icon: 'left' | 'right' } | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('left');

  const MAIN_TABS: { id: AppTab; labelTi: string; labelEn: string }[] = [
    { id: 'premiere', labelTi: 'ኣክሱማይት (Premiere)', labelEn: 'Premiere' },
    { id: 'business-hub', labelTi: 'ቢዝነስ (Business Hub)', labelEn: 'Business' },
    { id: 'cultural-explorer', labelTi: 'ባህላዊ ቅርሲ (Cultural AI)', labelEn: 'Culture' },
    { id: 'education', labelTi: 'ትምህርቲ (Academy)', labelEn: 'Education' },
    { id: 'chat', labelTi: 'ቻት (Chat)', labelEn: 'Chat' },
    { id: 'assistance', labelTi: 'ድምጺ ሓገዝ (Voice)', labelEn: 'Voice' },
    { id: 'payment', labelTi: 'ክፍሊት (Pay)', labelEn: 'Pay' },
    { id: 'vision', labelTi: 'ምስሊ (Vision)', labelEn: 'Vision' },
    { id: 'prompt-forge', labelTi: 'ፕሮምፕት (Forge)', labelEn: 'Forge' },
    { id: 'translator', labelTi: 'ትርጉም (Translate)', labelEn: 'Translate' },
    { id: 'rewards', labelTi: 'ዓስብን ቦነስን (Rewards)', labelEn: 'Rewards' },
    { id: 'saved', labelTi: 'ተዓቂቡ (Saved)', labelEn: 'Saved' },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    // Avoid triggering tab swipe when touching input fields, buttons, interactive sliders or canvases
    const target = e.target as HTMLElement;
    if (
      target.closest('input, textarea, select, button, [role="button"], [data-no-swipe]')
    ) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const duration = Date.now() - touchStartTime.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // Must be a quick swipe (< 500ms) with > 50px displacement and primarily horizontal
    if (duration < 500 && Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      const currentIndex = MAIN_TABS.findIndex((t) => t.id === activeTab);
      if (currentIndex === -1) return;

      if (deltaX < 0) {
        // Swiped LEFT -> Move to NEXT tab
        const nextIndex = (currentIndex + 1) % MAIN_TABS.length;
        const nextTab = MAIN_TABS[nextIndex];
        setSwipeDirection('left');
        setActiveTab(nextTab.id);
        triggerSwipeNotice(nextTab.labelTi, 'right');
      } else {
        // Swiped RIGHT -> Move to PREVIOUS tab
        const prevIndex = (currentIndex - 1 + MAIN_TABS.length) % MAIN_TABS.length;
        const prevTab = MAIN_TABS[prevIndex];
        setSwipeDirection('right');
        setActiveTab(prevTab.id);
        triggerSwipeNotice(prevTab.labelTi, 'left');
      }
    }
  };

  const triggerSwipeNotice = (label: string, iconDir: 'left' | 'right') => {
    setSwipeNotice({ label, icon: iconDir });
    setTimeout(() => setSwipeNotice(null), 1800);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col relative overflow-x-hidden antialiased transition-colors duration-300 ${
      activeTab === 'premiere'
        ? 'bg-gradient-to-b from-[#EBF2FA] via-[#EEF5FC] to-[#E3EDF8] text-[#0F2856] selection:bg-blue-200 selection:text-blue-900'
        : 'bg-[#070709] text-slate-100 selection:bg-[#C5A059]/30 selection:text-[#F3E5AB]'
    }`}>
      
      {/* Ambient Depth (Dark mode only) */}
      {activeTab !== 'premiere' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-[#C5A059]/10 via-[#8E6D28]/5 to-transparent blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-600/[0.03] blur-[160px] rounded-full pointer-events-none" />
        </div>
      )}
      
      {/* Offline Status Alert Banner */}
      {isOffline && (
        <div className="bg-[#181109] border-b border-amber-500/50 px-4 py-2 text-xs text-amber-200 flex items-center justify-between animate-fade-in shadow-md z-30">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-semibold">ብዘይ ኢንተርነት ትሰርሕ ኣለኻ (Working Offline Mode Active)</span>
            <span className="hidden md:inline text-[11px] text-amber-300/80">
              — Tigrinya dictionary, landmark maps, and offline chat local fallback engine are active.
            </span>
          </div>
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="text-[10px] uppercase font-bold text-amber-300 underline hover:text-white"
          >
            Manage Cache
          </button>
        </div>
      )}

      {/* Navigation Header (Shown on other tabs; Premiere has its own embedded native mobile top bar) */}
      {activeTab !== 'premiere' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={savedItems.length}
          logoSrc={logoImg}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
          user={user}
          onOpenUserModal={() => setIsUserModalOpen(true)}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
          isOffline={isOffline}
          onOpenOnboardingModal={() => setIsOnboardingModalOpen(true)}
          onOpenAuthModal={(m) => handleOpenAuthModal(m)}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          unreadNotifCount={notifications.filter((n) => !n.read).length}
          onOpenNotifications={() => setIsNotificationCenterOpen(true)}
          onOpenVoiceOverlay={() => setIsVoiceOverlayOpen(true)}
          isAlwaysListening={isAlwaysListening}
          onToggleAlwaysListening={() => toggleAlwaysListening()}
        />
      )}

      {/* Main App Content View Area with Touch Swipe Support */}
      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 w-full mx-auto relative touch-pan-y transition-all ${
          activeTab === 'premiere' 
            ? 'max-w-md px-2 sm:px-3 pt-1 pb-24' 
            : 'max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-6 pb-28 sm:pb-32'
        }`}
      >
        {/* Floating Touch Swipe Feedback Banner */}
        <AnimatePresence>
          {swipeNotice && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#17130A] border-2 border-[#C5A059] px-4 py-2 rounded-2xl shadow-2xl text-amber-200 text-xs font-bold flex items-center space-x-2.5 pointer-events-none backdrop-blur-md"
            >
              <Hand className="w-4 h-4 text-[#C5A059] animate-bounce shrink-0" />
              <div className="flex items-center space-x-1">
                {swipeNotice.icon === 'left' && <ChevronLeft className="w-4 h-4 text-[#C5A059] animate-pulse" />}
                <span>{swipeNotice.label}</span>
                {swipeNotice.icon === 'right' && <ChevronRight className="w-4 h-4 text-[#C5A059] animate-pulse" />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Slide Tab Container with Luxury Fading-Gold Entrance */}
        <div className="relative w-full">
          {/* Subtle Ambient Fading-Gold Halo that Blooms and Evaporates on Tab Switch */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`gold-veil-${activeTab}`}
              initial={{ opacity: 0.65, scale: 0.96 }}
              animate={{ opacity: 0, scale: 1.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-full max-w-3xl h-36 bg-gradient-to-b from-amber-400/20 via-[#E1C47D]/10 to-transparent blur-3xl pointer-events-none rounded-full z-0"
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ 
                opacity: 0, 
                x: swipeDirection === 'left' ? 16 : swipeDirection === 'right' ? -16 : 0,
                y: 8,
                scale: 0.99,
                filter: 'drop-shadow(0 0 20px rgba(225, 196, 125, 0.4)) brightness(1.08)'
              }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                y: 0,
                scale: 1,
                filter: 'drop-shadow(0 0 0px rgba(225, 196, 125, 0)) brightness(1)'
              }}
              exit={{ 
                opacity: 0, 
                x: swipeDirection === 'left' ? -16 : swipeDirection === 'right' ? 16 : 0,
                y: -6,
                scale: 0.99,
                filter: 'brightness(0.98)'
              }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              {/* Golden Top Shimmer Hairline on Entrance */}
              <motion.div
                initial={{ opacity: 0.85, scaleX: 0.2, x: '-50%' }}
                animate={{ opacity: 0, scaleX: 1.1, x: '50%' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#E1C47D] to-transparent pointer-events-none z-20 shadow-[0_0_10px_#E1C47D]"
              />
            {activeTab === 'chat' && (
              <ObeliskChat 
                onSaveInsight={handleSaveInsight} 
                initialPrompt={pendingChatPrompt}
                onPromptConsumed={() => setPendingChatPrompt('')}
                user={user}
                onOpenAuthModal={handleOpenAuthModal}
              />
            )}

            {activeTab === 'assistance' && (
              <AssistanceSystem 
                onNavigateTab={setActiveTab} 
                onSaveInsight={handleSaveInsight}
                onOpenUserModal={() => setIsUserModalOpen(true)}
                onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
                onOpenPaymentModal={() => setActiveTab('payment')}
                user={user}
              />
            )}

            {activeTab === 'payment' && (
              <PaymentSystem
                onSaveInsight={handleSaveInsight}
                user={user}
                onOpenAuthModal={handleOpenAuthModal}
              />
            )}

            {activeTab === 'vision' && (
              <VisionStudio 
                onSaveInsight={handleSaveInsight} 
                user={user}
                onOpenAuthModal={handleOpenAuthModal}
              />
            )}

            {activeTab === 'prompt-forge' && (
              <PromptForge onSaveInsight={handleSaveInsight} logoSrc={logoImg} />
            )}

            {activeTab === 'translator' && (
              <GeezTranslator 
                onSaveInsight={handleSaveInsight} 
                user={user}
                onOpenAuthModal={handleOpenAuthModal}
              />
            )}

            {activeTab === 'calligraphy' && (
              <GeezCalligraphyStudio
                user={user}
                onSaveInsight={handleSaveInsight}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'education' && (
              <EducationPlatformView
                onOpenPricingModal={() => setIsPremiumModalOpen(true)}
                isUserSubscribed={isProOrHigher}
                preferredLanguage={user.preferredLanguage?.startsWith('ti') ? 'ti' : 'en'}
              />
            )}

            {activeTab === 'business-hub' && (
              <BusinessHubView
                isPro={isProOrHigher}
                onOpenUpgradeModal={() => setIsPremiumModalOpen(true)}
              />
            )}

            {activeTab === 'cultural-explorer' && (
              <CulturalExplorerView
                isPro={isProOrHigher}
                onOpenUpgradeModal={() => setIsPremiumModalOpen(true)}
              />
            )}

            {activeTab === 'premiere' && (
              <EritreanPremiereView
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                onUpdateUser={handleUpdateUser}
                onSaveInsight={handleSaveInsight}
                onOpenAuthModal={handleOpenAuthModal}
                onOpenUserModal={() => setIsUserModalOpen(true)}
                onOpenOnboardingModal={() => setIsOnboardingModalOpen(true)}
                onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
                onOpenJobSearch={() => setIsJobSearchOpen(true)}
                onOpenScholarship={() => setIsScholarshipOpen(true)}
                onOpenLegalAdvisor={() => setIsLegalAdvisorOpen(true)}
                onOpenMechanic={() => setIsMechanicOpen(true)}
                onOpenHistory={() => setIsHistoryOpen(true)}
                onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
                onOpenDrawer={() => setIsDrawerOpen(true)}
                unreadNotifCount={notifications.filter((n) => !n.read).length}
                onOpenNotifications={() => setIsNotificationCenterOpen(true)}
                onOpenVideoTranslator={() => setIsVideoTranslatorOpen(true)}
                onOpenVoiceOverlay={() => setIsVoiceOverlayOpen(true)}
                onOpenHibernation={() => setIsHibernationOpen(true)}
              />
            )}

            {activeTab === 'saved' && (
              <SavedInsights
                savedItems={savedItems}
                onDelete={handleDeleteInsight}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics
                user={user}
                savedItems={savedItems}
                onNavigateTab={setActiveTab}
              />
            )}

            {(activeTab === 'management' || activeTab === 'user-management') && (
              <ManagementHub
                initialSection="users"
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {activeTab === 'payment-management' && (
              <ManagementHub
                initialSection="payments"
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {activeTab === 'customer-management' && (
              <ManagementHub
                initialSection="customers"
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {activeTab === 'admin-config' && (
              <ManagementHub
                initialSection="admin-config"
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {activeTab === 'system-activity' && (
              <ManagementHub
                initialSection="activity"
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {activeTab === 'android-app' && (
              <AndroidAppInterfaceView
                user={user}
                onNavigateTab={setActiveTab}
                onOpenAuthModal={handleOpenAuthModal}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardsView
                onBack={() => setActiveTab('premiere')}
                onNavigateTab={setActiveTab}
                user={user}
              />
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>

      {/* Sovereign AI All-Tools Side Drawer matching User Screenshot */}
      <SovereignSideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsDrawerOpen(false);
        }}
        user={user}
        onOpenUserModal={() => {
          setIsDrawerOpen(false);
          setIsUserModalOpen(true);
        }}
        onOpenSecurityModal={() => {
          setIsDrawerOpen(false);
          setIsSecurityModalOpen(true);
        }}
        onOpenPremiumModal={() => {
          setIsDrawerOpen(false);
          setIsPremiumModalOpen(true);
        }}
        onOpenJobSearch={() => {
          setIsDrawerOpen(false);
          setIsJobSearchOpen(true);
        }}
        onOpenScholarship={() => {
          setIsDrawerOpen(false);
          setIsScholarshipOpen(true);
        }}
        onOpenLegalAdvisor={() => {
          setIsDrawerOpen(false);
          setIsLegalAdvisorOpen(true);
        }}
        onOpenMechanic={() => {
          setIsDrawerOpen(false);
          setIsMechanicOpen(true);
        }}
        onOpenHistory={() => {
          setIsDrawerOpen(false);
          setIsHistoryOpen(true);
        }}
        unreadNotifCount={notifications.filter((n) => !n.read).length}
        onOpenNotifications={() => {
          setIsDrawerOpen(false);
          setIsNotificationCenterOpen(true);
        }}
        onOpenVideoTranslator={() => {
          setIsDrawerOpen(false);
          setIsVideoTranslatorOpen(true);
        }}
        onOpenVoiceOverlay={() => {
          setIsDrawerOpen(false);
          setIsVoiceOverlayOpen(true);
        }}
        onOpenFileVault={() => {
          setIsDrawerOpen(false);
          setIsUserFileVaultOpen(true);
        }}
        onOpenHibernation={() => {
          setIsDrawerOpen(false);
          setIsHibernationOpen(true);
        }}
      />

      {/* User Cloud File Storage & Vault Modal */}
      <UserFileManagerModal
        isOpen={isUserFileVaultOpen}
        onClose={() => setIsUserFileVaultOpen(false)}
        user={user}
        onSendToChat={handleSelectPromptForChat}
      />

      {/* Global Scholarships & Grants Opportunities Modal */}
      <ScholarshipModal
        isOpen={isScholarshipOpen}
        onClose={() => {
          setIsScholarshipOpen(false);
          setTargetScholarshipId(undefined);
        }}
        user={user}
        onSaveInsight={handleSaveInsight}
        onOpenAuthModal={handleOpenAuthModal}
        onNavigateToChat={handleSelectPromptForChat}
        initialScholarshipId={targetScholarshipId}
      />

      {/* Job Search & Career Assistant Modal */}
      <JobSearchModal
        isOpen={isJobSearchOpen}
        onClose={() => setIsJobSearchOpen(false)}
        onSelectPromptForChat={handleSelectPromptForChat}
      />

      {/* Legal & Civic Advisor AI Modal */}
      <LegalAdvisorModal
        isOpen={isLegalAdvisorOpen}
        onClose={() => setIsLegalAdvisorOpen(false)}
        onSelectPromptForChat={handleSelectPromptForChat}
      />

      {/* Auto Mechanic & Vehicle Diagnostic AI Modal */}
      <MechanicDiagnosisModal
        isOpen={isMechanicOpen}
        onClose={() => setIsMechanicOpen(false)}
        onSelectPromptForChat={handleSelectPromptForChat}
      />

      {/* Chat History & Prompt Archive Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectPromptForChat={handleSelectPromptForChat}
      />

      {/* Comprehensive Pricing & Subscription Management Modal (Google Play & Tax Invoices) */}
      <PricingPlanComparisonModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />

      {/* Global Pro Feature Access Gate / Paywall Interceptor */}
      <SubscriptionGateModal
        onOpenPricingPlans={() => setIsPremiumModalOpen(true)}
      />

      {/* Authentication & Verification Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        initialMode={authMode}
        verificationReason={authReason}
        isMandatory={!user.isLoggedIn}
        logoSrc={logoImg}
      />

      {/* 30-Minute Security Inactivity Warning Modal */}
      <IdleWarningModal
        isOpen={isIdleWarning && !!user?.isLoggedIn}
        remainingSeconds={remainingSeconds}
        formattedRemaining={formattedRemaining}
        onStayLoggedIn={resetIdleTimer}
        onLogoutNow={handleIdleAutoLogout}
        onEnterHibernation={() => {
          resetIdleTimer();
          setIsHibernationOpen(true);
        }}
      />

      {/* Tigrinya Audio Onboarding Modal */}
      <TigrinyaOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onNavigateTab={setActiveTab}
      />

      {/* User Management System Modal */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        isOffline={isOffline}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onOpenPaymentModal={() => setActiveTab('payment')}
        onOpenManagement={(sec) => setActiveTab(sec === 'payments' ? 'payment-management' : sec === 'customers' ? 'customer-management' : 'user-management')}
        onOpenAuthModal={(mode) => {
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        }}
        onSaveInsight={handleSaveInsight}
        onNavigateTab={setActiveTab}
      />

      {/* App Security & Vault Management Center Modal */}
      <SecurityManagementModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />

      {/* Mobile & Android PWA Install Guide Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        onOpenAuthModal={(m) => handleOpenAuthModal(m)}
        onOpenAndroidInterface={() => setActiveTab('android-app')}
        onOpenHibernation={() => setIsHibernationOpen(true)}
      />

      {/* Sovereign Axumite AI Fullscreen Hibernation Standby Shield */}
      <AxumiteHibernationScreen
        isOpen={isHibernationOpen}
        onWakeUp={() => setIsHibernationOpen(false)}
        reason="manual"
      />

      {/* Brand Hero Manifesto Modal */}
      {activeTab === 'brand-manifesto' && (
        <BrandHeroModal
          logoSrc={logoImg}
          onClose={() => setActiveTab('chat')}
        />
      )}

      {/* Floating Bottom Navigation Bar matching reference screenshots */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedItems.length}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Push Notification Immediate Toast */}
      <PushNotificationToast
        notification={activePushToast}
        onClose={() => setActivePushToast(null)}
        onActionClick={(notif) => {
          setActivePushToast(null);
          if (notif.category === 'scholarship') {
            handleOpenScholarshipFromNotification(notif.scholarshipId);
          } else if (notif.category === 'payment_failed' || notif.actionType === 'open_payment') {
            setActiveTab('payment');
          } else {
            setIsNotificationCenterOpen(true);
          }
        }}
      />

      {/* Full Push Notification & Scholarship Alerts Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        preferences={notificationPrefs}
        onUpdateNotifications={handleUpdateNotifications}
        onUpdatePreferences={handleUpdateNotificationPrefs}
        onOpenScholarshipOpportunity={(id) => {
          setIsNotificationCenterOpen(false);
          handleOpenScholarshipFromNotification(id);
        }}
        onOpenPaymentManagement={() => {
          setIsNotificationCenterOpen(false);
          setActiveTab('payment');
        }}
        onNavigateTab={(tab) => {
          setIsNotificationCenterOpen(false);
          setActiveTab(tab as AppTab);
        }}
        onTriggerTestNotification={handleTriggerTestPushNotification}
      />

      {/* AI Video Translator, Neural Dubbing & Subtitle Studio Modal */}
      <AiVideoTranslatorModal
        isOpen={isVideoTranslatorOpen}
        onClose={() => setIsVideoTranslatorOpen(false)}
      />

      {/* Sovereign Natural Language Voice Command Overlay */}
      <VoiceCommandOverlay
        isOpen={isVoiceOverlayOpen}
        onClose={() => setIsVoiceOverlayOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsVoiceOverlayOpen(false);
        }}
        onOpenSettings={() => {
          setIsVoiceOverlayOpen(false);
          setIsUserModalOpen(true);
        }}
        onOpenHistory={() => {
          setIsVoiceOverlayOpen(false);
          setIsHistoryOpen(true);
        }}
        onOpenNotifications={() => {
          setIsVoiceOverlayOpen(false);
          setIsNotificationCenterOpen(true);
        }}
        onOpenSecurity={() => {
          setIsVoiceOverlayOpen(false);
          setIsSecurityModalOpen(true);
        }}
        onOpenPricing={() => {
          setIsVoiceOverlayOpen(false);
          setIsPremiumModalOpen(true);
        }}
        onOpenJobSearch={() => {
          setIsVoiceOverlayOpen(false);
          setIsJobSearchOpen(true);
        }}
        onOpenScholarship={() => {
          setIsVoiceOverlayOpen(false);
          setIsScholarshipOpen(true);
        }}
        onOpenLegalAdvisor={() => {
          setIsVoiceOverlayOpen(false);
          setIsLegalAdvisorOpen(true);
        }}
        onOpenMechanic={() => {
          setIsVoiceOverlayOpen(false);
          setIsMechanicOpen(true);
        }}
        onOpenVideoTranslator={() => {
          setIsVoiceOverlayOpen(false);
          setIsVideoTranslatorOpen(true);
        }}
        onOpenDrawer={() => {
          setIsVoiceOverlayOpen(false);
          setIsDrawerOpen(true);
        }}
        onSendChatMessage={(prompt) => {
          setIsVoiceOverlayOpen(false);
          setPendingChatPrompt(prompt);
          setActiveTab('chat');
        }}
        isAlwaysListening={isAlwaysListening}
        onToggleAlwaysListening={() => toggleAlwaysListening()}
      />

      {/* Persistent Floating Hands-Free Audio & Speech Recognition Indicator */}
      <AlwaysListeningFloatingIndicator
        isActive={isAlwaysListening}
        onToggle={() => toggleAlwaysListening()}
        onOpenOverlay={() => setIsVoiceOverlayOpen(true)}
        lastPhrase={lastHeardPhrase}
        lastFeedback={lastActionFeedback}
        onClearFeedback={clearFeedback}
      />

    </div>
  );
}
