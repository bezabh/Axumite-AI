// Guest access and limit manager for AXUMITE AI

export interface GuestUsageState {
  chatQueriesUsed: number;
  maxChatQueries: number;
  visionAnalysesUsed: number;
  maxVisionAnalyses: number;
  translationsUsed: number;
  maxTranslations: number;
  tutorQueriesUsed: number;
  maxTutorQueries: number;
  lastResetDate: string;
}

export const GUEST_DEFAULT_LIMITS: GuestUsageState = {
  chatQueriesUsed: 0,
  maxChatQueries: 5,
  visionAnalysesUsed: 0,
  maxVisionAnalyses: 2,
  translationsUsed: 0,
  maxTranslations: 5,
  tutorQueriesUsed: 0,
  maxTutorQueries: 3,
  lastResetDate: new Date().toISOString().split('T')[0],
};

const GUEST_STORAGE_KEY = 'axumite_guest_usage_state';

export const getGuestUsage = (): GuestUsageState => {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return GUEST_DEFAULT_LIMITS;
    const parsed: GuestUsageState = JSON.parse(raw);
    
    // Check if daily reset is needed
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastResetDate !== today) {
      const resetState: GuestUsageState = {
        ...GUEST_DEFAULT_LIMITS,
        lastResetDate: today,
      };
      saveGuestUsage(resetState);
      return resetState;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading guest usage:', err);
    return GUEST_DEFAULT_LIMITS;
  }
};

export const saveGuestUsage = (state: GuestUsageState): void => {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving guest usage:', err);
  }
};

export const isCreatorOrAdmin = (email?: string, role?: string): boolean => {
  if (!email && !role) return false;
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (normalizedEmail === 'beckylove2004@gmail.com') return true;
  if (role === 'Creator' || role === 'Admin') return true;
  return false;
};

export const checkGuestLimit = (
  feature: 'chat' | 'vision' | 'translation' | 'tutor',
  email?: string,
  role?: string
): { allowed: boolean; remaining: number; max: number; used: number } => {
  // Creator / Admin / beckylove2004@gmail.com has unlimited access
  if (isCreatorOrAdmin(email, role)) {
    return { allowed: true, remaining: 999999, max: 999999, used: 0 };
  }

  // If role is Pro, Scholar, or has special privilege
  if (role === 'Axumite Sovereign Scholar' || role === 'ኤርትራዊ AI Pro') {
    return { allowed: true, remaining: 999999, max: 999999, used: 0 };
  }

  const usage = getGuestUsage();

  switch (feature) {
    case 'chat': {
      const remaining = Math.max(0, usage.maxChatQueries - usage.chatQueriesUsed);
      return {
        allowed: usage.chatQueriesUsed < usage.maxChatQueries,
        remaining,
        max: usage.maxChatQueries,
        used: usage.chatQueriesUsed,
      };
    }
    case 'vision': {
      const remaining = Math.max(0, usage.maxVisionAnalyses - usage.visionAnalysesUsed);
      return {
        allowed: usage.visionAnalysesUsed < usage.maxVisionAnalyses,
        remaining,
        max: usage.maxVisionAnalyses,
        used: usage.visionAnalysesUsed,
      };
    }
    case 'translation': {
      const remaining = Math.max(0, usage.maxTranslations - usage.translationsUsed);
      return {
        allowed: usage.translationsUsed < usage.maxTranslations,
        remaining,
        max: usage.maxTranslations,
        used: usage.translationsUsed,
      };
    }
    case 'tutor': {
      const remaining = Math.max(0, usage.maxTutorQueries - usage.tutorQueriesUsed);
      return {
        allowed: usage.tutorQueriesUsed < usage.maxTutorQueries,
        remaining,
        max: usage.maxTutorQueries,
        used: usage.tutorQueriesUsed,
      };
    }
    default:
      return { allowed: true, remaining: 10, max: 10, used: 0 };
  }
};

export const incrementGuestUsage = (
  feature: 'chat' | 'vision' | 'translation' | 'tutor',
  email?: string,
  role?: string
): GuestUsageState => {
  if (isCreatorOrAdmin(email, role)) {
    return getGuestUsage();
  }

  const usage = getGuestUsage();
  switch (feature) {
    case 'chat':
      usage.chatQueriesUsed += 1;
      break;
    case 'vision':
      usage.visionAnalysesUsed += 1;
      break;
    case 'translation':
      usage.translationsUsed += 1;
      break;
    case 'tutor':
      usage.tutorQueriesUsed += 1;
      break;
  }
  saveGuestUsage(usage);
  return usage;
};
