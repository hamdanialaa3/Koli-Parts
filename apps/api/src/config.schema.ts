import { z } from 'zod';

export const configValidationSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  WEB_PORT: z.coerce.number().default(3000),
  API_PORT: z.coerce.number().default(4000),
  WEB_PUBLIC_URL: z.string().url().default('http://localhost:3000'),
  API_PUBLIC_URL: z.string().url().default('http://localhost:4000'),

  // Postgres
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),

  // Search
  SEARCH_PROVIDER: z.string().default('meilisearch'),
  MEILI_HOST: z.string().url().default('http://localhost:7700'),
  MEILI_MASTER_KEY: z.string(),

  // Koli One identity
  KOLI_ONE_ORIGIN: z.string().url().default('https://koli.one'),
  KOLI_ONE_AUTH_ISSUER: z.string().optional(),
  KOLI_ONE_AUTH_AUDIENCE: z.string().optional(),
  KOLI_ONE_FIREBASE_PROJECT_ID: z.string().optional(),

  // eBay
  EBAY_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
  EBAY_CLIENT_ID: z.string().optional(),
  EBAY_CLIENT_SECRET: z.string().optional(),
  EBAY_RUNAME: z.string().optional(),
  EBAY_REDIRECT_URI: z.string().url().default('http://localhost:4000/integrations/ebay/oauth/callback'),
  EBAY_MARKETPLACE_ID: z.string().default('EBAY_DE'),
  EBAY_API_BASE_URL: z.string().url().default('https://api.sandbox.ebay.com'),
  EBAY_OAUTH_BASE_URL: z.string().url().default('https://api.sandbox.ebay.com/identity/v1/oauth2'),
  EBAY_EPN_CAMPAIGN_ID: z.string().optional(),
  EBAY_AUTOMATED_ORDERING: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  EBAY_APPLICATION_TOKEN_SAFETY_SECONDS: z.coerce.number().default(120),

  // TecDoc / VIN
  TECDOC_API_URL: z.string().optional(),
  TECDOC_API_KEY: z.string().optional(),
  VIN_PROVIDER: z.string().default('unconfigured'),
  VIN_PROVIDER_URL: z.string().optional(),
  VIN_PROVIDER_KEY: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().default('sk_test_replace_me'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_replace_me'),
  STRIPE_CAPTURE_MODE: z.enum(['manual', 'automatic']).default('manual'),

  // PayPal
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),

  // Econt
  ECONT_API_URL: z.string().url().default('https://demo.econt.com/ee/services'),
  ECONT_USERNAME: z.string().optional(),
  ECONT_PASSWORD: z.string().optional(),

  // App settings
  DEFAULT_LOCALE: z.string().default('bg'),
  SUPPORTED_LOCALES: z.string().default('bg,en'),
  DEFAULT_CURRENCY: z.string().default('EUR'),
  DEFAULT_PROFIT_MARGIN: z.coerce.number().default(0.06),
  QUOTE_TTL_SECONDS: z.coerce.number().default(900),
  PROCUREMENT_LOCK_TTL_SECONDS: z.coerce.number().default(1800),

  // Security
  SESSION_SECRET: z.string().min(32, { message: "SESSION_SECRET must be at least 32 characters long" }),
  TOKEN_ENCRYPTION_KEY_ID: z.string().default('local-dev-only'),
  ADMIN_MFA_REQUIRED: z.preprocess((val) => val === 'true', z.boolean()).default(true),

  // Safety flags
  DISABLE_EBAY_SYNC: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  DISABLE_AUTOMATIC_PROCUREMENT: z.preprocess((val) => val === 'true', z.boolean()).default(true),
  DISABLE_CHECKOUT: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  DISABLE_NEW_ORDERS: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  DISABLE_PAYMENT_CAPTURE: z.preprocess((val) => val === 'true', z.boolean()).default(false),

  // Observability
  SENTRY_DSN: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'verbose']).default('info'),
});

export type Config = z.infer<typeof configValidationSchema>;
