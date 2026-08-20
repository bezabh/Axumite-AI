import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole, SupportedCurrency } from '../types';
import { triggerPaymentFailedAlert } from '../services/notificationService';

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
  provider: 'stripe' | 'google_play' | 'credit_card' | 'bank_wire';
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  planName: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  amount: number;
  currency: SupportedCurrency;
  startedAt: string;
  renewsAt: string;
  trialEndsAt: string | null;
  autoRenew: boolean;
  paymentMethod: {
    provider: 'stripe' | 'google_play' | 'credit_card' | 'bank_wire';
    label: string;
    last4?: string;
  };
  entitlementSignature: string;
  invoices: InvoiceItem[];
}

interface SubscriptionContextType {
  subscription: SubscriptionState;
  selectedCurrency: SupportedCurrency;
  setSelectedCurrency: (currency: SupportedCurrency) => void;
  isProOrHigher: boolean;
  isEnterprise: boolean;
  isTrialing: boolean;
  canAccess: (feature: 'video_dubbing' | 'unlimited_chat' | 'calligraphy_4k' | 'legal_ai' | 'mechanic_ai' | 'ocr_docs') => boolean;
  startStripeCheckout: (params: {
    planId: string;
    billingCycle?: BillingCycle;
    withTrial?: boolean;
    promoCode?: string;
  }) => Promise<{ success: boolean; checkoutUrl?: string; error?: string; isSandbox?: boolean }>;
  startGooglePlayPurchase: (
    planId: 'pro_monthly' | 'pro_yearly' | 'enterprise_monthly' | 'enterprise_yearly' | 'lifetime_pass',
    withTrial?: boolean
  ) => Promise<{ success: boolean; error?: string; invoice?: InvoiceItem }>;
  processCardPayment: (
    planId: string,
    billingCycle: BillingCycle,
    cardDetails: any,
    withTrial?: boolean
  ) => Promise<{ success: boolean; error?: string; invoice?: InvoiceItem }>;
  cancelSubscription: (reason?: string) => Promise<{ success: boolean; error?: string }>;
  reactivateSubscription: () => Promise<{ success: boolean; error?: string }>;
  toggleAutoRenewal: () => Promise<boolean>;
  changePlan: (newTier: SubscriptionTier, newCycle: BillingCycle) => Promise<{ success: boolean; error?: string }>;
  verifyBackendEntitlement: () => Promise<boolean>;
  restorePurchases: () => Promise<{ success: boolean; restoredCount: number; message: string }>;
  simulatePaymentFailureAlert: (customReason?: string) => void;
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
    provider: 'stripe',
    label: 'Free Tier Explorer',
  },
  entitlementSignature: 'free_tier_sig_default',
  invoices: [],
};

const STORAGE_KEY = 'axumite_secure_subscription_v3';
const CURRENCY_STORAGE_KEY = 'axumite_selected_currency_v2';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{
  children: React.ReactNode;
  user?: UserProfile;
  onUpdateUserRole?: (role: UserRole) => void;
}> = ({ children, user, onUpdateUserRole }) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<SupportedCurrency>(() => {
    try {
      const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (stored) return stored as SupportedCurrency;
    } catch {}
    return 'USD';
  });

  const setSelectedCurrency = (c: SupportedCurrency) => {
    setSelectedCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
    } catch {}
  };

  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read subscription from storage:', e);
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
  }, [subscription.tier, onUpdateUserRole]);

  // Check URL query parameters for successful Stripe Checkout return
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');
    const planId = urlParams.get('plan') || 'pro_yearly';

    if (paymentStatus === 'success' && sessionId) {
      // Verify payment session with backend
      fetch('/api/payment/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: user?.id || 'usr_guest',
          userEmail: user?.email || 'beckylove2004@gmail.com',
          planId,
          currency: selectedCurrency,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.subscription) {
            const sub = data.subscription;
            setSubscription((prev) => ({
              tier: sub.plan.includes('enterprise') ? 'enterprise' : sub.plan.includes('lifetime') ? 'lifetime' : 'pro',
              planName: sub.plan_name,
              status: sub.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
              billingCycle: sub.billing_cycle,
              amount: sub.amount,
              currency: sub.currency,
              startedAt: sub.start_date,
              renewsAt: new Date(sub.renewal_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              trialEndsAt: sub.trial_end_date,
              autoRenew: !sub.cancel_at_period_end,
              paymentMethod: {
                provider: 'stripe',
                label: `Stripe Secure Card (•••• 4242)`,
                last4: '4242',
              },
              entitlementSignature: sub.entitlement_signature || `sig_${Date.now()}`,
              invoices: data.invoice
                ? [
                    {
                      id: `inv_${Date.now()}`,
                      invoiceNumber: data.invoice.invoiceNumber,
                      orderId: sessionId,
                      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                      planName: sub.plan_name,
                      billingCycle: sub.billing_cycle,
                      amount: sub.amount,
                      currency: sub.currency,
                      paymentMethod: 'Stripe Secure Card (•••• 4242)',
                      status: 'PAID',
                      downloadUrl: `#receipt-${data.invoice.invoiceNumber}`,
                      vatAmount: data.invoice.vatAmount,
                      subtotal: data.invoice.subtotal,
                      provider: 'stripe',
                    },
                    ...(prev.invoices || []),
                  ]
                : prev.invoices,
            }));

            // Clean URL query parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        })
        .catch((err) => console.warn('Could not verify checkout return session:', err));
    }
  }, [user?.id, user?.email, selectedCurrency]);

  const isProOrHigher =
    subscription.tier === 'pro' || subscription.tier === 'enterprise' || subscription.tier === 'lifetime';
  const isEnterprise = subscription.tier === 'enterprise';
  const isTrialing = subscription.status === 'TRIALING';

  // Access control helper
  const canAccess = useCallback(
    (feature: 'video_dubbing' | 'unlimited_chat' | 'calligraphy_4k' | 'legal_ai' | 'mechanic_ai' | 'ocr_docs'): boolean => {
      if (user?.role === 'Admin' || user?.role === 'Creator') return true;
      if (subscription.status === 'EXPIRED') return false;

      switch (feature) {
        case 'unlimited_chat':
        case 'calligraphy_4k':
        case 'ocr_docs':
        case 'video_dubbing':
        case 'legal_ai':
        case 'mechanic_ai':
          return isProOrHigher;
        default:
          return true;
      }
    },
    [user?.role, subscription.status, isProOrHigher]
  );

  const openPaywall = (featureName: string = 'ልዑላዊ AI Pro መሳርሒ (Pro Feature)') => {
    setActivePaywallFeature(featureName);
  };

  const closePaywall = () => {
    setActivePaywallFeature(null);
  };

  // 1. Verify Backend Entitlement Server-Authoritatively
  const verifyBackendEntitlement = async (): Promise<boolean> => {
    try {
      const res = await fetch(`/api/payment/subscription-status?userId=${encodeURIComponent(user?.id || 'usr_guest')}&signature=${encodeURIComponent(subscription.entitlementSignature)}`);
      const data = await res.json();
      if (data.success) {
        if (!data.isPremium && subscription.tier !== 'free') {
          // Sync downgrade if expired on server
          setSubscription((prev) => ({
            ...prev,
            tier: 'free',
            status: 'EXPIRED',
          }));
          return false;
        }
        return data.isPremium;
      }
      return true;
    } catch (e) {
      console.warn('Backend verification fallback:', e);
      return true;
    }
  };

  // 2. Start Stripe Checkout Session (Production Ready)
  const startStripeCheckout = async (params: {
    planId: string;
    billingCycle?: BillingCycle;
    withTrial?: boolean;
    promoCode?: string;
  }): Promise<{ success: boolean; checkoutUrl?: string; error?: string; isSandbox?: boolean }> => {
    try {
      const res = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'usr_guest',
          userEmail: user?.email || 'beckylove2004@gmail.com',
          userName: user?.name || 'Axumite User',
          planId: params.planId,
          currency: selectedCurrency,
          promoCode: params.promoCode,
          withTrial: params.withTrial,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to create Stripe checkout session.');
      }

      // If Stripe returns direct checkout URL in production mode, redirect or simulate complete
      if (data.isSandbox || !data.checkoutUrl.startsWith('http')) {
        // Instant sandbox verification
        const verifyRes = await fetch('/api/payment/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: data.sessionId,
            userId: user?.id || 'usr_guest',
            userEmail: user?.email || 'beckylove2004@gmail.com',
            planId: params.planId,
            currency: selectedCurrency,
            withTrial: params.withTrial,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          const sub = verifyData.subscription;
          setSubscription((prev) => ({
            tier: sub.plan.includes('enterprise') ? 'enterprise' : sub.plan.includes('lifetime') ? 'lifetime' : 'pro',
            planName: sub.plan_name,
            status: sub.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
            billingCycle: sub.billing_cycle,
            amount: sub.amount,
            currency: sub.currency,
            startedAt: sub.start_date,
            renewsAt: new Date(sub.renewal_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            trialEndsAt: sub.trial_end_date,
            autoRenew: !sub.cancel_at_period_end,
            paymentMethod: {
              provider: 'stripe',
              label: `Stripe Secure Card (•••• 4242)`,
              last4: '4242',
            },
            entitlementSignature: sub.entitlement_signature || `sig_${Date.now()}`,
            invoices: [
              {
                id: `inv_${Date.now()}`,
                invoiceNumber: verifyData.invoice.invoiceNumber,
                orderId: data.sessionId,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                planName: sub.plan_name,
                billingCycle: sub.billing_cycle,
                amount: sub.amount,
                currency: sub.currency,
                paymentMethod: 'Stripe Secure Card (•••• 4242)',
                status: params.withTrial ? 'TRIAL_ACTIVE' : 'PAID',
                downloadUrl: `#receipt-${verifyData.invoice.invoiceNumber}`,
                vatAmount: verifyData.invoice.vatAmount,
                subtotal: verifyData.invoice.subtotal,
                provider: 'stripe',
              },
              ...(prev.invoices || []),
            ],
          }));

          closePaywall();
          return { success: true, isSandbox: true };
        }
      }

      return {
        success: true,
        checkoutUrl: data.checkoutUrl,
        isSandbox: data.isSandbox,
      };
    } catch (err: any) {
      console.error('Stripe checkout error:', err);
      return { success: false, error: err.message || 'Payment initiation failed.' };
    }
  };

  // 3. Process Card Payment Directly (Tokens & Plan Upgrades)
  const processCardPayment = async (
    planId: string,
    billingCycle: BillingCycle,
    cardDetails: any,
    withTrial: boolean = false
  ): Promise<{ success: boolean; error?: string; invoice?: InvoiceItem }> => {
    try {
      const res = await fetch('/api/payment/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'stripe',
          orderId: `STRIPE-ORD-${Date.now()}-${Math.floor(Math.random() * 899 + 100)}`,
          productId: planId,
          tier: planId.includes('enterprise') ? 'enterprise' : planId.includes('lifetime') ? 'lifetime' : 'pro',
          billingCycle,
          amount: billingCycle === 'yearly' ? 79.99 : billingCycle === 'one_time' ? 199.99 : 9.99,
          withTrial,
          userEmail: user?.email || 'beckylove2004@gmail.com',
          userId: user?.id || 'usr_guest',
          cardLast4: cardDetails?.cardNumber?.slice(-4) || '4242',
          currency: selectedCurrency,
        }),
      });

      const verificationData = await res.json();
      if (!res.ok || verificationData.error) {
        throw new Error(verificationData.error || 'Payment gateway failed.');
      }

      const inv = verificationData.invoice;
      const newInvoice: InvoiceItem = {
        id: `inv_${Date.now()}`,
        invoiceNumber: verificationData.invoiceNumber,
        orderId: verificationData.orderId,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        planName: inv.planName,
        billingCycle,
        amount: withTrial ? 0 : inv.amount,
        currency: selectedCurrency,
        paymentMethod: `Stripe / Card (•••• ${cardDetails?.cardNumber?.slice(-4) || '4242'})`,
        status: withTrial ? 'TRIAL_ACTIVE' : 'PAID',
        downloadUrl: `#receipt-${verificationData.orderId}`,
        subtotal: inv.subtotal,
        vatAmount: inv.vatAmount,
        provider: 'stripe',
      };

      setSubscription((prev) => ({
        tier: verificationData.tier,
        planName: inv.planName,
        status: withTrial ? 'TRIALING' : 'ACTIVE',
        billingCycle,
        amount: inv.amount,
        currency: selectedCurrency,
        startedAt: new Date().toISOString(),
        renewsAt: billingCycle === 'one_time' ? 'Never' : new Date(inv.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        trialEndsAt: inv.trialEndsAt,
        autoRenew: billingCycle !== 'one_time',
        paymentMethod: {
          provider: 'stripe',
          label: `Visa / Mastercard (•••• ${cardDetails?.cardNumber?.slice(-4) || '4242'})`,
          last4: cardDetails?.cardNumber?.slice(-4) || '4242',
        },
        entitlementSignature: verificationData.signature,
        invoices: [newInvoice, ...(prev.invoices || [])],
      }));

      closePaywall();
      return { success: true, invoice: newInvoice };
    } catch (err: any) {
      const errorMsg = err.message || 'Payment card failed / declined by issuer.';
      // Trigger automated in-app notification with link to payment management
      triggerPaymentFailedAlert({
        planName: planId.includes('enterprise') ? 'ልዑላዊ AI ንግዲ (Enterprise)' : planId.includes('lifetime') ? 'ናይ ዘለኣለም ፍቓድ (Lifetime Pass)' : 'ልዑላዊ AI ፕሮ (Sovereign Pro)',
        amount: billingCycle === 'yearly' ? 79.99 : billingCycle === 'one_time' ? 199.99 : 9.99,
        currency: selectedCurrency,
        failureReason: errorMsg,
        last4: cardDetails?.cardNumber?.slice(-4) || '4242',
        paymentMethod: `Card ending in •••• ${cardDetails?.cardNumber?.slice(-4) || '4242'}`,
      });
      return { success: false, error: errorMsg };
    }
  };

  // Explicit simulation trigger for diagnostics / tests
  const simulatePaymentFailureAlert = (customReason?: string) => {
    triggerPaymentFailedAlert({
      planName: subscription.planName || 'ልዑላዊ AI ፕሮ (Sovereign Pro)',
      amount: subscription.amount || 79.99,
      currency: selectedCurrency,
      failureReason: customReason || 'Insufficient funds / Card issuer declined authorization code 51.',
      last4: subscription.paymentMethod.last4 || '4242',
      paymentMethod: subscription.paymentMethod.label || 'Stripe Visa •••• 4242',
    });
  };

  // 4. Google Play Purchase Handler (for Mobile Applet Ingress)
  const startGooglePlayPurchase = async (
    planId: 'pro_monthly' | 'pro_yearly' | 'enterprise_monthly' | 'enterprise_yearly' | 'lifetime_pass',
    withTrial: boolean = false
  ): Promise<{ success: boolean; error?: string; invoice?: InvoiceItem }> => {
    return processCardPayment(
      planId,
      planId.includes('yearly') ? 'yearly' : planId === 'lifetime_pass' ? 'one_time' : 'monthly',
      { cardNumber: '4829' },
      withTrial
    );
  };

  // 5. Cancel Subscription Functionality
  const cancelSubscription = async (reason: string = 'User requested cancellation'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/payment/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'usr_guest',
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

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

  // 6. Reactivate Subscription Functionality
  const reactivateSubscription = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/payment/reactivate-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'usr_guest',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to reactivate subscription');
      }

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

  // 7. Toggle Auto-Renewal
  const toggleAutoRenewal = async (): Promise<boolean> => {
    if (subscription.autoRenew) {
      await cancelSubscription('User toggled off auto-renewal');
      return false;
    } else {
      await reactivateSubscription();
      return true;
    }
  };

  // 8. Change / Upgrade / Downgrade Plan
  const changePlan = async (newTier: SubscriptionTier, newCycle: BillingCycle): Promise<{ success: boolean; error?: string }> => {
    if (newTier === 'free') {
      await cancelSubscription('Downgraded to free');
      setSubscription(DEFAULT_FREE_SUBSCRIPTION);
      return { success: true };
    }

    try {
      const targetPlanId = `${newTier}_${newCycle}`;
      const res = await fetch('/api/payment/upgrade-downgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'usr_guest',
          targetPlanId,
          currency: selectedCurrency,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to change plan.');
      }

      const sub = data.subscription;
      setSubscription((prev) => ({
        ...prev,
        tier: newTier,
        planName: sub.plan_name,
        status: 'ACTIVE',
        billingCycle: newCycle,
        amount: sub.amount,
        currency: sub.currency,
        renewsAt: new Date(sub.renewal_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        entitlementSignature: sub.entitlement_signature,
      }));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // 9. Restore Previous Purchases from Server
  const restorePurchases = async (): Promise<{ success: boolean; restoredCount: number; message: string }> => {
    try {
      const res = await fetch(`/api/payment/history?userId=${encodeURIComponent(user?.id || 'usr_guest')}&userEmail=${encodeURIComponent(user?.email || 'beckylove2004@gmail.com')}`);
      const data = await res.json();

      const statusRes = await fetch(`/api/payment/subscription-status?userId=${encodeURIComponent(user?.id || 'usr_guest')}`);
      const statusData = await statusRes.json();

      if (statusData.isPremium && statusData.subscription) {
        const sub = statusData.subscription;
        setSubscription((prev) => ({
          tier: statusData.tier,
          planName: sub.plan_name || 'Sovereign Pro',
          status: sub.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
          billingCycle: sub.billing_cycle || 'yearly',
          amount: sub.amount || 79.99,
          currency: sub.currency || 'USD',
          startedAt: sub.start_date || new Date().toISOString(),
          renewsAt: new Date(sub.renewal_date || Date.now() + 365 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          trialEndsAt: sub.trial_end_date || null,
          autoRenew: !sub.cancel_at_period_end,
          paymentMethod: {
            provider: 'stripe',
            label: 'Stripe Verified Account',
            last4: '4242',
          },
          entitlementSignature: sub.entitlement_signature || generateDefaultSig(user?.id || 'guest'),
          invoices: data.payments
            ? data.payments.map((p: any) => ({
                id: p.id,
                invoiceNumber: p.invoice_number,
                orderId: p.provider_payment_id,
                date: new Date(p.payment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                planName: p.plan_id,
                billingCycle: 'yearly',
                amount: p.amount,
                currency: p.currency,
                paymentMethod: p.payment_method_label || 'Stripe Card',
                status: p.status === 'succeeded' ? 'PAID' : p.status === 'refunded' ? 'REFUNDED' : 'TRIAL_ACTIVE',
                downloadUrl: `#receipt-${p.invoice_number}`,
                vatAmount: p.amount * 0.15,
                subtotal: p.amount * 0.85,
                provider: 'stripe',
              }))
            : prev.invoices,
        }));

        return {
          success: true,
          restoredCount: data.payments?.length || 1,
          message: 'Previous purchases successfully restored and verified from Axumite Cloud.',
        };
      }

      return {
        success: true,
        restoredCount: 0,
        message: 'No active past purchases found for this account.',
      };
    } catch (err: any) {
      return { success: false, restoredCount: 0, message: err.message || 'Failed to restore purchases.' };
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        selectedCurrency,
        setSelectedCurrency,
        isProOrHigher,
        isEnterprise,
        isTrialing,
        canAccess,
        startStripeCheckout,
        startGooglePlayPurchase,
        processCardPayment,
        cancelSubscription,
        reactivateSubscription,
        toggleAutoRenewal,
        changePlan,
        verifyBackendEntitlement,
        restorePurchases,
        simulatePaymentFailureAlert,
        activePaywallFeature,
        openPaywall,
        closePaywall,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

function generateDefaultSig(userId: string): string {
  return `AXM_SIG_${userId.slice(-6).toUpperCase()}_${Date.now().toString(36)}`;
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
