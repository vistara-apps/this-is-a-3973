/**
 * Stripe service for EchoMapper
 * Handles payment processing and subscription management
 */

import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/env.js';

// Initialize Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

// Payment service
export const paymentService = {
  /**
   * Create a checkout session for premium subscription
   * @param {string} userId - User ID
   * @param {string} priceId - Stripe price ID for the subscription
   * @returns {Promise<Object>} Checkout session result
   */
  async createCheckoutSession(userId, priceId = 'price_premium_monthly') {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll simulate the flow
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          priceId,
          successUrl: `${window.location.origin}/account?success=true`,
          cancelUrl: `${window.location.origin}/account?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();
      return { success: true, data: session };

    } catch (error) {
      console.error('Checkout session error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  },

  /**
   * Redirect to Stripe Checkout
   * @param {string} sessionId - Stripe checkout session ID
   * @returns {Promise<void>}
   */
  async redirectToCheckout(sessionId) {
    try {
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Redirect to checkout error:', error);
      throw error;
    }
  },

  /**
   * Create a premium subscription checkout flow
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async subscribeToPremium(userId) {
    try {
      // For demo purposes, simulate successful subscription
      // In production, this would integrate with your backend
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful subscription
      const mockSubscription = {
        id: `sub_${Date.now()}`,
        status: 'active',
        current_period_start: Date.now() / 1000,
        current_period_end: (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000, // 30 days
        plan: {
          id: 'premium_monthly',
          amount: 500, // $5.00
          currency: 'usd',
          interval: 'month'
        }
      };

      return {
        success: true,
        data: mockSubscription
      };

    } catch (error) {
      console.error('Premium subscription error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  },

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Stripe subscription ID
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelSubscription(subscriptionId) {
    try {
      // In production, this would call your backend API
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const result = await response.json();
      return { success: true, data: result };

    } catch (error) {
      console.error('Cancel subscription error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  },

  /**
   * Get subscription details
   * @param {string} subscriptionId - Stripe subscription ID
   * @returns {Promise<Object>} Subscription details
   */
  async getSubscription(subscriptionId) {
    try {
      // In production, this would call your backend API
      const response = await fetch(`/api/subscription/${subscriptionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get subscription details');
      }

      const subscription = await response.json();
      return { success: true, data: subscription };

    } catch (error) {
      console.error('Get subscription error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  },

  /**
   * Update payment method
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<Object>} Update result
   */
  async updatePaymentMethod(customerId) {
    try {
      const stripe = await getStripe();
      
      // Create setup intent for updating payment method
      const response = await fetch('/api/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create setup intent');
      }

      const { client_secret } = await response.json();
      
      // Redirect to payment method update
      const { error } = await stripe.confirmCardSetup(client_secret);
      
      if (error) {
        throw new Error(error.message);
      }

      return { success: true };

    } catch (error) {
      console.error('Update payment method error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
};

// Subscription utilities
export const subscriptionUtils = {
  /**
   * Check if user has active premium subscription
   * @param {Object} user - User object with subscription info
   * @returns {boolean} Whether user has active premium
   */
  hasActivePremium(user) {
    if (!user.subscription) return false;
    
    const now = Date.now() / 1000;
    return (
      user.subscription.status === 'active' &&
      user.subscription.current_period_end > now
    );
  },

  /**
   * Get days remaining in subscription
   * @param {Object} subscription - Subscription object
   * @returns {number} Days remaining
   */
  getDaysRemaining(subscription) {
    if (!subscription || subscription.status !== 'active') return 0;
    
    const now = Date.now() / 1000;
    const secondsRemaining = subscription.current_period_end - now;
    return Math.max(0, Math.ceil(secondsRemaining / (24 * 60 * 60)));
  },

  /**
   * Format subscription price
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code
   * @returns {string} Formatted price
   */
  formatPrice(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  },

  /**
   * Get subscription status display text
   * @param {string} status - Stripe subscription status
   * @returns {string} Display text
   */
  getStatusDisplayText(status) {
    const statusMap = {
      'active': 'Active',
      'canceled': 'Canceled',
      'incomplete': 'Incomplete',
      'incomplete_expired': 'Expired',
      'past_due': 'Past Due',
      'trialing': 'Trial',
      'unpaid': 'Unpaid'
    };
    
    return statusMap[status] || 'Unknown';
  },

  /**
   * Get subscription status color for UI
   * @param {string} status - Stripe subscription status
   * @returns {string} Color class
   */
  getStatusColor(status) {
    const colorMap = {
      'active': 'text-emerald-400',
      'trialing': 'text-blue-400',
      'canceled': 'text-slate-400',
      'past_due': 'text-orange-400',
      'unpaid': 'text-red-400',
      'incomplete': 'text-yellow-400',
      'incomplete_expired': 'text-red-400'
    };
    
    return colorMap[status] || 'text-slate-400';
  }
};

// Premium feature checks
export const premiumFeatures = {
  /**
   * Check if user can access unlimited analysis
   * @param {Object} user - User object
   * @returns {boolean} Whether user has unlimited analysis
   */
  hasUnlimitedAnalysis(user) {
    return subscriptionUtils.hasActivePremium(user);
  },

  /**
   * Check if user can access advanced insights
   * @param {Object} user - User object
   * @returns {boolean} Whether user has advanced insights
   */
  hasAdvancedInsights(user) {
    return subscriptionUtils.hasActivePremium(user);
  },

  /**
   * Check if user can access offline capabilities
   * @param {Object} user - User object
   * @returns {boolean} Whether user has offline access
   */
  hasOfflineCapabilities(user) {
    return subscriptionUtils.hasActivePremium(user);
  },

  /**
   * Check if user can access priority database integration
   * @param {Object} user - User object
   * @returns {boolean} Whether user has priority integration
   */
  hasPriorityIntegration(user) {
    return subscriptionUtils.hasActivePremium(user);
  },

  /**
   * Get monthly analysis limit for user
   * @param {Object} user - User object
   * @returns {number} Monthly analysis limit
   */
  getMonthlyAnalysisLimit(user) {
    return subscriptionUtils.hasActivePremium(user) ? Infinity : 10;
  }
};
