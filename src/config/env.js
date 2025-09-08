/**
 * Environment configuration for EchoMapper
 * Centralizes all environment variables and provides validation
 */

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

// OpenAI Configuration
export const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
};

// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
};

// Pinata Configuration (Optional)
export const PINATA_CONFIG = {
  apiKey: import.meta.env.VITE_PINATA_API_KEY || '',
  secretKey: import.meta.env.VITE_PINATA_SECRET_KEY || '',
};

// Farcaster/Neynar Configuration (Optional)
export const NEYNAR_CONFIG = {
  apiKey: import.meta.env.VITE_NEYNAR_API_KEY || '',
};

// Base RPC Configuration (Optional)
export const BASE_CONFIG = {
  rpcUrl: import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org',
};

// Validation function to check if required environment variables are set
export const validateEnvironment = () => {
  const requiredVars = [
    { key: 'VITE_SUPABASE_URL', value: SUPABASE_CONFIG.url },
    { key: 'VITE_SUPABASE_ANON_KEY', value: SUPABASE_CONFIG.anonKey },
    { key: 'VITE_OPENAI_API_KEY', value: OPENAI_CONFIG.apiKey },
    { key: 'VITE_STRIPE_PUBLISHABLE_KEY', value: STRIPE_CONFIG.publishableKey },
  ];

  const missing = requiredVars.filter(({ value }) => !value);
  
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing.map(({ key }) => key));
    return false;
  }
  
  return true;
};

// Development mode check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
