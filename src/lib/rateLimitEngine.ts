export interface RateLimitTierConfig {
  name: string;
  windowMs: number; // e.g. 60,000 ms (1 min)
  maxRequests: number; // general endpoints max requests per window
  maxAiRequests: number; // heavy generative AI endpoints max requests
  maxPaymentRequests: number; // financial/checkout endpoints max requests
}

export const ROLE_RATE_LIMIT_TIERS: Record<string, RateLimitTierConfig> = {
  'Super Admin': {
    name: 'Super Admin',
    windowMs: 60 * 1000,
    maxRequests: 300,
    maxAiRequests: 60,
    maxPaymentRequests: 40,
  },
  'Creator': {
    name: 'Creator / Founder',
    windowMs: 60 * 1000,
    maxRequests: 300,
    maxAiRequests: 60,
    maxPaymentRequests: 40,
  },
  'Admin': {
    name: 'Administrator',
    windowMs: 60 * 1000,
    maxRequests: 120,
    maxAiRequests: 35,
    maxPaymentRequests: 30,
  },
  'Manager': {
    name: 'Manager',
    windowMs: 60 * 1000,
    maxRequests: 80,
    maxAiRequests: 25,
    maxPaymentRequests: 20,
  },
  'Teacher': {
    name: 'Teacher',
    windowMs: 60 * 1000,
    maxRequests: 80,
    maxAiRequests: 20,
    maxPaymentRequests: 15,
  },
  'Axumite Sovereign Scholar': {
    name: 'Axumite Sovereign Scholar',
    windowMs: 60 * 1000,
    maxRequests: 70,
    maxAiRequests: 20,
    maxPaymentRequests: 15,
  },
  'ኤርትራዊ AI Pro': {
    name: 'AI Pro Member',
    windowMs: 60 * 1000,
    maxRequests: 60,
    maxAiRequests: 18,
    maxPaymentRequests: 15,
  },
  'Editor': {
    name: 'Editor',
    windowMs: 60 * 1000,
    maxRequests: 60,
    maxAiRequests: 15,
    maxPaymentRequests: 10,
  },
  'Moderator': {
    name: 'Moderator',
    windowMs: 60 * 1000,
    maxRequests: 60,
    maxAiRequests: 15,
    maxPaymentRequests: 10,
  },
  'Support Staff': {
    name: 'Support Staff',
    windowMs: 60 * 1000,
    maxRequests: 50,
    maxAiRequests: 12,
    maxPaymentRequests: 20,
  },
  'Student': {
    name: 'Student',
    windowMs: 60 * 1000,
    maxRequests: 40,
    maxAiRequests: 10,
    maxPaymentRequests: 8,
  },
  'Free Member': {
    name: 'Free Member',
    windowMs: 60 * 1000,
    maxRequests: 25,
    maxAiRequests: 5,
    maxPaymentRequests: 5,
  },
  'Guest': {
    name: 'Guest / Anonymous IP',
    windowMs: 60 * 1000,
    maxRequests: 12,
    maxAiRequests: 3,
    maxPaymentRequests: 3,
  },
  'Suspended': {
    name: 'Suspended Account',
    windowMs: 60 * 1000,
    maxRequests: 0,
    maxAiRequests: 0,
    maxPaymentRequests: 0,
  },
};

export interface ClientRateBucket {
  key: string;
  role: string;
  identifier: string;
  category: 'general' | 'ai' | 'payment';
  timestamps: number[];
  lastRequestAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  role: string;
  category: 'general' | 'ai' | 'payment';
  retryAfter?: number;
  reason?: string;
}

class ServerRateLimiter {
  private buckets = new Map<string, ClientRateBucket>();
  private totalBlockedRequests = 0;
  private totalProcessedRequests = 0;

  constructor() {
    // Run background garbage collector every 2 minutes
    setInterval(() => {
      this.cleanupExpiredBuckets();
    }, 2 * 60 * 1000);
  }

  private getBucketKey(identifier: string, category: string): string {
    return `${identifier}:${category}`;
  }

  public checkRateLimit(
    identifier: string,
    role: string = 'Guest',
    category: 'general' | 'ai' | 'payment' = 'general'
  ): RateLimitResult {
    this.totalProcessedRequests++;
    const now = Date.now();
    const tier = ROLE_RATE_LIMIT_TIERS[role] || ROLE_RATE_LIMIT_TIERS['Guest'];
    const windowMs = tier.windowMs;

    // Determine max limit for category
    let maxLimit = tier.maxRequests;
    if (category === 'ai') maxLimit = tier.maxAiRequests;
    if (category === 'payment') maxLimit = tier.maxPaymentRequests;

    // Handle suspended users immediately
    if (role === 'Suspended' || maxLimit === 0) {
      this.totalBlockedRequests++;
      return {
        allowed: false,
        limit: 0,
        remaining: 0,
        resetSeconds: 60,
        retryAfter: 60,
        role,
        category,
        reason: 'Account is suspended or has a zero quota allocation.',
      };
    }

    const bucketKey = this.getBucketKey(identifier, category);
    let bucket = this.buckets.get(bucketKey);

    if (!bucket) {
      bucket = {
        key: bucketKey,
        role,
        identifier,
        category,
        timestamps: [],
        lastRequestAt: now,
      };
      this.buckets.set(bucketKey, bucket);
    }

    // Filter out timestamps outside the sliding window
    bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);
    bucket.lastRequestAt = now;
    bucket.role = role;

    const currentCount = bucket.timestamps.length;
    const oldestTimestamp = bucket.timestamps[0] || now;
    const timeUntilOldestExpires = Math.max(0, windowMs - (now - oldestTimestamp));
    const resetSeconds = Math.ceil(timeUntilOldestExpires / 1000) || 60;

    if (currentCount >= maxLimit) {
      this.totalBlockedRequests++;
      return {
        allowed: false,
        limit: maxLimit,
        remaining: 0,
        resetSeconds,
        retryAfter: resetSeconds,
        role,
        category,
        reason: `Rate limit exceeded for role "${role}" on ${category} endpoints. Allowed: ${maxLimit} req/min.`,
      };
    }

    // Record request timestamp
    bucket.timestamps.push(now);
    const remaining = Math.max(0, maxLimit - bucket.timestamps.length);

    return {
      allowed: true,
      limit: maxLimit,
      remaining,
      resetSeconds,
      role,
      category,
    };
  }

  public getTelemetry() {
    const activeBucketsCount = this.buckets.size;
    const activeClients = Array.from(this.buckets.values()).map((b) => ({
      identifier: b.identifier,
      role: b.role,
      category: b.category,
      recentRequests: b.timestamps.length,
      lastRequestAt: new Date(b.lastRequestAt).toISOString(),
    }));

    return {
      totalProcessedRequests: this.totalProcessedRequests,
      totalBlockedRequests: this.totalBlockedRequests,
      activeBucketsCount,
      activeClients,
      tiers: ROLE_RATE_LIMIT_TIERS,
    };
  }

  private cleanupExpiredBuckets() {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      const tier = ROLE_RATE_LIMIT_TIERS[bucket.role] || ROLE_RATE_LIMIT_TIERS['Guest'];
      // If no requests in 3x window, clean up
      if (now - bucket.lastRequestAt > tier.windowMs * 3) {
        this.buckets.delete(key);
      }
    }
  }
}

export const serverRateLimiter = new ServerRateLimiter();
