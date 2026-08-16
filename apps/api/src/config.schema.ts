import { z } from 'zod';

const placeholderFragments = [
  'change_me',
  'replace_me',
  'local-dev-only',
  'sk_test_replace_me',
  'whsec_replace_me',
  'replace_with_at_least_32_random_bytes',
];

const nonEmptyString = z.string().trim().min(1);

const optionalNonEmptyString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().trim().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url().optional(),
);

const strictBoolean = (defaultValue: boolean) =>
  z.preprocess((value) => {
    if (value === undefined) return defaultValue;
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  }, z.boolean());

export const configValidationSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    WEB_PORT: z.coerce.number().default(3000),
    API_PORT: z.coerce.number().default(4000),
    WEB_PUBLIC_URL: z.string().url().default('http://localhost:3000'),
    API_PUBLIC_URL: z.string().url().default('http://localhost:4000'),

    // Postgres
    POSTGRES_HOST: z.string().default('localhost'),
    POSTGRES_PORT: z.coerce.number().default(5432),
    POSTGRES_USER: nonEmptyString,
    POSTGRES_PASSWORD: nonEmptyString,
    POSTGRES_DB: nonEmptyString,
    DATABASE_URL: nonEmptyString,

    // Redis
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_URL: z.string().url().default('redis://localhost:6379'),

    // Search
    SEARCH_PROVIDER: z.string().default('meilisearch'),
    MEILI_HOST: z.string().url().default('http://localhost:7700'),
    MEILI_MASTER_KEY: nonEmptyString,

    // Koli One identity
    KOLI_ONE_ORIGIN: z.string().url().default('https://koli.one'),
    KOLI_ONE_AUTH_ISSUER: optionalNonEmptyString,
    KOLI_ONE_AUTH_AUDIENCE: optionalNonEmptyString,
    KOLI_ONE_FIREBASE_PROJECT_ID: optionalNonEmptyString,

    // eBay
    EBAY_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
    EBAY_CLIENT_ID: optionalNonEmptyString,
    EBAY_CLIENT_SECRET: optionalNonEmptyString,
    EBAY_RUNAME: optionalNonEmptyString,
    EBAY_REDIRECT_URI: z
      .string()
      .url()
      .default('http://localhost:4000/integrations/ebay/oauth/callback'),
    EBAY_MARKETPLACE_ID: z.string().default('EBAY_DE'),
    EBAY_API_BASE_URL: z.string().url().default('https://api.sandbox.ebay.com'),
    EBAY_OAUTH_BASE_URL: z
      .string()
      .url()
      .default('https://api.sandbox.ebay.com/identity/v1/oauth2'),
    EBAY_EPN_CAMPAIGN_ID: optionalNonEmptyString,
    EBAY_AUTOMATED_ORDERING: strictBoolean(false),
    EBAY_APPLICATION_TOKEN_SAFETY_SECONDS: z.coerce.number().default(120),

    // TecDoc / VIN
    TECDOC_API_URL: optionalUrl,
    TECDOC_API_KEY: optionalNonEmptyString,
    VIN_PROVIDER: z.string().default('unconfigured'),
    VIN_PROVIDER_URL: optionalUrl,
    VIN_PROVIDER_KEY: optionalNonEmptyString,

    // Stripe
    STRIPE_SECRET_KEY: z.string().default('sk_test_replace_me'),
    STRIPE_WEBHOOK_SECRET: z.string().default('whsec_replace_me'),
    STRIPE_CAPTURE_MODE: z.enum(['manual', 'automatic']).default('manual'),

    // PayPal
    PAYPAL_CLIENT_ID: z.string().optional(),
    PAYPAL_CLIENT_SECRET: z.string().optional(),

    // Econt
    ECONT_API_URL: z
      .string()
      .url()
      .default('https://demo.econt.com/ee/services'),
    ECONT_USERNAME: optionalNonEmptyString,
    ECONT_PASSWORD: optionalNonEmptyString,

    // App settings
    DEFAULT_LOCALE: z.string().default('bg'),
    SUPPORTED_LOCALES: z.string().default('bg,en'),
    DEFAULT_CURRENCY: z.string().default('EUR'),
    DEFAULT_PROFIT_MARGIN: z.coerce.number().default(0.06),
    QUOTE_TTL_SECONDS: z.coerce.number().default(900),
    PROCUREMENT_LOCK_TTL_SECONDS: z.coerce.number().default(1800),

    // Security
    SESSION_SECRET: z.string().min(32, {
      message: 'SESSION_SECRET must be at least 32 characters long',
    }),
    TOKEN_ENCRYPTION_KEY_ID: z.string().default('local-dev-only'),
    ADMIN_MFA_REQUIRED: strictBoolean(true),

    // Safety flags
    DISABLE_EBAY_SYNC: strictBoolean(false),
    DISABLE_AUTOMATIC_PROCUREMENT: strictBoolean(true),
    DISABLE_CHECKOUT: strictBoolean(false),
    DISABLE_NEW_ORDERS: strictBoolean(false),
    DISABLE_PAYMENT_CAPTURE: strictBoolean(false),

    // Observability
    SENTRY_DSN: optionalUrl,
    OTEL_EXPORTER_OTLP_ENDPOINT: optionalUrl,
    LOG_LEVEL: z
      .enum(['error', 'warn', 'info', 'debug', 'verbose'])
      .default('info'),
  })
  .superRefine((config, ctx) => {
    if (config.NODE_ENV !== 'production') return;

    for (const [key, value] of Object.entries(config)) {
      if (typeof value !== 'string') continue;

      const normalizedValue = value.toLowerCase();
      if (
        placeholderFragments.some((placeholder) =>
          normalizedValue.includes(placeholder),
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `${key} must not use a placeholder value in production`,
        });
      }
    }
  });

export type Config = z.infer<typeof configValidationSchema>;
