import { configValidationSchema } from './config.schema';

const validConfig = {
  POSTGRES_USER: 'koliparts',
  POSTGRES_PASSWORD: 'dev-password',
  POSTGRES_DB: 'koliparts_db',
  DATABASE_URL:
    'postgresql://koliparts:dev-password@localhost:5432/koliparts_db',
  MEILI_MASTER_KEY: 'dev-search-key',
  SESSION_SECRET: '12345678901234567890123456789012',
};

describe('configValidationSchema', () => {
  it('accepts only explicit true and false strings for safety booleans', () => {
    expect(
      configValidationSchema.parse({
        ...validConfig,
        DISABLE_AUTOMATIC_PROCUREMENT: 'false',
      }).DISABLE_AUTOMATIC_PROCUREMENT,
    ).toBe(false);

    expect(() =>
      configValidationSchema.parse({
        ...validConfig,
        DISABLE_AUTOMATIC_PROCUREMENT: 'yes',
      }),
    ).toThrow();

    expect(() =>
      configValidationSchema.parse({
        ...validConfig,
        DISABLE_AUTOMATIC_PROCUREMENT: 'TRUE',
      }),
    ).toThrow();
  });

  it('converts empty optional strings to undefined', () => {
    const config = configValidationSchema.parse({
      ...validConfig,
      EBAY_CLIENT_ID: '',
    });

    expect(config.EBAY_CLIENT_ID).toBeUndefined();
  });

  it('rejects placeholder secrets in production', () => {
    expect(() =>
      configValidationSchema.parse({
        ...validConfig,
        NODE_ENV: 'production',
        STRIPE_SECRET_KEY: 'sk_test_replace_me',
        STRIPE_WEBHOOK_SECRET: 'whsec_replace_me',
        TOKEN_ENCRYPTION_KEY_ID: 'local-dev-only',
      }),
    ).toThrow();
  });
});
