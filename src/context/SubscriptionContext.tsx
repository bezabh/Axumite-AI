import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise' | 'lifetime';
export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'CANCELED_PENDING_EXPIRATION' | 'EXPIRED' | 'PAST_DUE';
export type BillingCycle = 'monthly' | 'yearly' | 'one_time' | 'free';

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  orderId: string;
  date: string;
  planName: string;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'PAID' | 'REFUNDED' | 'TRIAL_ACTIVE';
  downloadUrl: string;
  vatAmount: number;
  subtotal: number;
  provider: 'google_play' | 'credit_card' | 'bank_wire';
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  planName: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  startedAt: string;
  renewsAt: string;
  trialEndsAt: string | null;
  autoRenew: boolean;
  paymentMethod: {
    provider: 'google_play' | 'credit_card' | 'bank_wire';
    label: string;
    last4?: string;
  };
  entitlementSignature: string;
  invoices: InvoiceItem[];
}

interface SubscriptionContextType {
  subscription: SubscriptionState;
  isProOrHigher: boolean;
  isEnterprise: boolean;
  isTrialing: boolean;
  canAccess: (feature: 'video_dubbing' | 'unlimited_chat' | 'calligraphy_4k' | 'legal_ai' | 'mechanic_ai' | 'ocr_docs') => boolean;
  startGooglePlayPurchase: (planId: 'pro_monthly' | 'pro_yearly' | 'enterprise_monthly' | 'enterprise_yearly' | 'lifetime_pass', withTrial?: boolean) => Promise<{ success: boolean; error?: string; invoice?: InvoiceItem }>;
  processCardPayment: (planId: string, billingCycle: BillingCycle, cardDetails: any, withTrial?: boolean) => Promise<{ success: boolean; error?: string }>;
  cancelSubscription: (reason?: string) => Promise<{ success: boolean; error?: string }>;
  reactivateSubscription: () => Promise<{ success: boolean; error?: string }>;
  toggleAutoRenewal: () => Promise<boolean>;
  changePlan: (newTier: SubscriptionTier, newCycle: BillingCycle) => Promise<{ success: boolean; error?: string }>;
  verifyBackendEntitlement: () => Promise<boolean>;
  activePaywallFeature: string | null;
  openPaywall: (featureName?: string) => void;
  closePaywall: () => void;
}

const DEFAULT_FREE_SUBSCRIPTION: SubscriptionState = {
  tier: 'free',
  planName: 'Axumite Free Explorer',
  status: 'ACTIVE',
  billingCycle: 'free',
  amount: 0,
  currency: 'USD',
  startedAt: new Date().toISOString(),
  renewsAt: 'Never',
  trialEndsAt: null,
  autoRenew: false,
  paymentMethod: {
    provider: 'google_play',
    label: 'Free Tier',
  },
  entitlementSignature: 'free_tier_sig_default',
  invoices: [],
};

const STORAGE_KEY = 'axumite_secure_subscription_v2';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode; user?: UserProfile; onUpdateUserRole?: (role: UserRole) => void }> = ({
  children,
  user,
  onUpdateUserRole,
}) => {
  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read subscription from local storage:', e);
    }
    return DEFAULT_FREE_SUBSCRIPTION;
  });

  const [activePaywallFeature, setActivePaywallFeature] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
    } catch (e) {
      console.warn('Could not save subscription:', e);
    }
  }, [subscription]);

  // Sync user role with subscription tier
  useEffect(() => {
    if (!onUpdateUserRole) return;
    if (subscription.tier === 'enterprise') {
      onUpdateUserRole('Axumite Sovereign Scholar');
    } else if (subscription.tier === 'pro' || subscription.tier === 'lifetime') {
      onUpdateUserRole('ኤርትራዊ AI Pro');
    }
  }, [subscription.tier]);

  const isProOrHigher = subscription.tier === 'pro' || subscription.tier === 'enterprise' || subscription.tier === 'lifetime';
  const isEnterprise = subscription.tier === 'enterprise';
  const isTrialing = subscription.status === 'TRIALING';

  // Access control helper
  const canAccess = (feature: 'video_dubbing' | 'unlimited_chat' | 'calligraphy_4k' | 'legal_ai' | 'mechanic_ai' | 'ocr_docs'): boolean => {
    if (user?.role === 'Admin' || user?.role === 'Creator') return true;
    if (subscription.status === 'EXPIRED') return false;
    
    switch (feature) {
      case 'unlimited_chat':
      case 'calligraphy_4k':
      case 'ocr_docs':
        return isProOrHigher;
      case 'video_dubbing':
      case 'legal_ai':
      case 'mechanic_ai':
        return isProOrHigher;
      default:
        return true;
    }
  };

  const openPaywall = (featureName: string = 'ልዑላዊ AI Pro መሳርሒ (Pro Feature)') => {
    setActivePaywallFeature(featureName);
  };

  const closePaywall = () => {
    setActivePaywallFeature(null);
  };

  // Backend Cryptographic Verification
  const verifyBackendEntitlement = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/payment/subscription/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest',
          userEmail: user?.email || 'beckylove2004@gmail.com',
          signature: subscription.entitlementSignature,
          tier: subscription.tier,
        }),
      });
      const data = await res.json();
      return data.verified === true;
    } catch (e) {
      console.warn('Backend verification fallback:', e);
      return true;
    }
  };

  // Google Play Billing Handler
  const startGooglePlayPurchase = async (
    planId: 'pro_monthly' | 'pro_yearly' | 'enterprise_monthly' | 'enterprise_yearly' | 'lifetime_pass',
    withTrial: boolean = false
  ): Promise<{ success: boolean; error?: string; invoice?: InvoiceItem }> => {
    try {
      // Simulate Google Play Billing handshake and send to backend verification endpoint
      const isYearly = planId.includes('yearly');
      const isLifetime = planId === 'lifetime_pass';
      const tier: SubscriptionTier = isLifetime ? 'lifetime' : planId.includes('enterprise') ? 'enterprise' : 'pro';
      
      const planPrices = {
        pro_monthly: 9.99,
        pro_yearly: 79.99,
        enterprise_monthly: 29.99,
        enterprise_yearly: 239.99,
        lifetime_pass: 199.99,
      };
      
      const price = planPrices[planId];
      const cycle: BillingCycle = isLifetime ? 'one_time' : isYearly ? 'yearly' : 'monthly';

      const mockGooglePlayToken = `GPA.${Math.floor(Math.random() * 8999 + 1000)}-${Math.floor(Math.random() * 89999 + 10000)}-${Math.floor(Math.random() * 89999 + 10000)}`;
      const orderId = `GPA.${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

      // Backend Verification Call
      const res = await fetch('/api/payment/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google_play',
          purchaseToken: mockGooglePlayToken,
          orderId,
          packageName: 'com.axumite.ai.sovereign',
          productId: planId,
          tier,
          billingCycle: cycle,
          amount: price,
          withTrial,
          userEmail: user?.email || 'beckylove2004@gmail.com',
          userId: user?.id || 'usr_guest',
        }),
      });

      const verificationData = await res.json();
      if (!res.ok || verificationData.error) {
        throw new Error(verificationData.error || 'Google Play purchase verification failed.');
      }

      const now = new Date();
      const renewDate = new Date();
      if (cycle === 'yearly') {
        renewDate.setFullYear(now.getFullYear() + 1);
      } else if (cycle === 'monthly') {
        renewDate.setMonth(now.getMonth() + 1);
      } else {
        renewDate.setFullYear(now.getFullYear() + 99); // lifetime
      }

      const trialEndDate = withTrial ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null;

      const newInvoice: InvoiceItem = {
        id: `inv_${Date.now()}`,
        invoiceNumber: verificationData.invoiceNumber || `INV-2026-AXM-${Math.floor(Math.random() * 89999 + 10000)}`,
        orderId,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        planName: tier === 'lifetime' ? 'Lifetime Sovereign Pass' : tier === 'enterprise' ? 'Axumite Enterprise' : 'Sovereign Pro',
        billingCycle: cycle,
        amount: withTrial ? 0 : price,
        currency: 'USD',
        paymentMethod: 'Google Play Billing (•••• 4829)',
        status: withTrial ? 'TRIAL_ACTIVE' : 'PAID',
        downloadUrl: `#receipt-${orderId}`,
        subtotal: withTrial ? 0 : price * 0.85,
        vatAmount: withTrial ? 0 : price * 0.15,
        provider: 'google_play',
      };

      setSubscription((prev) => ({
        tier,
        planName: tier === 'lifetime' ? 'Lifetime Sovereign Pass' : tier === 'enterprise' ? 'Axumite Imperial Enterprise' : 'Sovereign Pro',
        status: withTrial ? 'TRIALING' : 'ACTIVE',
        billingCycle: cycle,
        amount: price,
        currency: 'USD',
        startedAt: now.toISOString(),
        renewsAt: cycle === 'one_time' ? 'Never (Lifetime Access)' : renewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        trialEndsAt: trialEndDate,
        autoRenew: cycle !== 'one_time',
        paymentMethod: {
          provider: 'google_play',
          label: 'Google Play Billing (Android Native)',
          last4: '4829',
        },
        entitlementSignature: verificationData.signature || `sig_verified_${Date.now()}`,
        invoices: [newInvoice, ...(prev.invoices || [])],
      }));

      closePaywall();
      return { success: true, invoice: newInvoice };
    } catch (err: any) {
      console.error('Google Play purchase error:', err);
      return { success: false, error: err.message || 'Google Play purchase failed.' };
    }
  };

  // Card Payment Handler
  const processCardPayment = async (
    planId: string,
    billingCycle: BillingCycle,
    cardDetails: any,
    withTrial: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const tier: SubscriptionTier = planId.includes('enterprise') ? 'enterprise' : planId.includes('lifetime') ? 'lifetime' : 'pro';
      const prices: Record<string, number> = {
        monthly: tier === 'enterprise' ? 29.99 : 9.99,
        yearly: tier === 'enterprise' ? 239.99 : 79.99,
        one_time: 199.99,
        free: 0,
      };
      const price = prices[billingCycle] || 9.99;
      const orderId = `CARD-${Date.now()}-${Math.floor(Math.random() * 899 + 100)}`;

      const res = await fetch('/api/payment/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'credit_card',
          orderId,
          tier,
          billingCycle,
          amount: price,
          withTrial,
          userEmail: user?.email || 'beckylove2004@gmail.com',
          userId: user?.id || 'usr_guest',
          cardLast4: cardDetails?.cardNumber?.slice(-4) || '4242',
        }),
      });

      const verificationData = await res.json();
      if (!res.ok || verificationData.error) {
        throw new Error(verificationData.error || 'Payment gateway failed.');
      }

      const now = new Date();
      const renewDate = new Date();
      if (billingCycle === 'yearly') renewDate.setFullYear(now.getFullYear() + 1);
      else if (billingCycle === 'monthly') renewDate.setMonth(now.getMonth() + 1);

      const trialEndDate = withTrial ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null;

      const newInvoice: InvoiceItem = {
        id: `inv_${Date.now()}`,
        invoiceNumber: verificationData.invoiceNumber || `INV-2026-AXM-${Math.floor(Math.random() * 89999 + 10000)}`,
        orderId,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        planName: tier === 'enterprise' ? 'Axumite Enterprise' : tier === 'lifetime' ? 'Lifetime Pass' : 'Sovereign Pro',
        billingCycle,
        amount: withTrial ? 0 : price,
        currency: 'USD',
        paymentMethod: `Credit Card (•••• ${cardDetails?.cardNumber?.slice(-4) || '4242'})`,
        status: withTrial ? 'TRIAL_ACTIVE' : 'PAID',
        downloadUrl: `#receipt-${orderId}`,
        subtotal: withTrial ? 0 : price * 0.85,
        vatAmount: withTrial ? 0 : price * 0.15,
        provider: 'credit_card',
      };

      setSubscription((prev) => ({
        tier,
        planName: tier === 'enterprise' ? 'Axumite Imperial Enterprise' : tier === 'lifetime' ? 'Lifetime Sovereign Pass' : 'Sovereign Pro',
        status: withTrial ? 'TRIALING' : 'ACTIVE',
        billingCycle,
        amount: price,
        currency: 'USD',
        startedAt: now.toISOString(),
        renewsAt: billingCycle === 'one_time' ? 'Never' : renewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        trialEndsAt: trialEndDate,
        autoRenew: billingCycle !== 'one_time',
        paymentMethod: {
          provider: 'credit_card',
          label: `Visa / Mastercard (•••• ${cardDetails?.cardNumber?.slice(-4) || '4242'})`,
          last4: cardDetails?.cardNumber?.slice(-4) || '4242',
        },
        entitlementSignature: verificationData.signature || `sig_card_${Date.now()}`,
        invoices: [newInvoice, ...(prev.invoices || [])],
      }));

      closePaywall();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Payment card failed.' };
    }
  };

  // Cancel Subscription
  const cancelSubscription = async (reason: string = 'User requested cancellation'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/payment/subscription/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          userEmail: user?.email || 'beckylove2004@gmail.com',
          reason,
        }),
      });

      setSubscription((prev) => ({
        ...prev,
        status: 'CANCELED_PENDING_EXPIRATION',
        autoRenew: false,
      }));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Reactivate Subscription
  const reactivateSubscription = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setSubscription((prev) => ({
        ...prev,
        status: 'ACTIVE',
        autoRenew: true,
      }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Toggle Auto-Renewal
  const toggleAutoRenewal = async (): Promise<boolean> => {
    const nextVal = !subscription.autoRenew;
    setSubscription((prev) => ({
      ...prev,
      autoRenew: nextVal,
      status: nextVal ? 'ACTIVE' : 'CANCELED_PENDING_EXPIRATION',
    }));
    return nextVal;
  };

  // Change / Upgrade / Downgrade Plan
  const changePlan = async (newTier: SubscriptionTier, newCycle: BillingCycle): Promise<{ success: boolean; error?: string }> => {
    if (newTier === 'free') {
      setSubscription(DEFAULT_FREE_SUBSCRIPTION);
      return { success: true };
    }
    return startGooglePlayPurchase(
      `${newTier}_${newCycle}` as any,
      false
    );
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isProOrHigher,
        isEnterprise,
        isTrialing,
        canAccess,
        startGooglePlayPurchase,
        processCardPayment,
        cancelSubscription,
        reactivateSubscription,
        toggleAutoRenewal,
        changePlan,
        verifyBackendEntitlement,
        activePaywallFeature,
        openPaywall,
        closePaywall,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
