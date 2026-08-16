import { AuthService } from './auth.service';
import type { AuthRepository } from './auth.repository';
import type { KoliOneTokenVerifier } from './koli-one-token-verifier';

describe('AuthService', () => {
  const identity = {
    provider: 'firebase' as const,
    subject: 'firebase-user-1',
    issuer: 'https://securetoken.google.com/fire-new-globul',
    audience: 'fire-new-globul',
    email: 'user@example.com',
    emailVerified: true,
    claims: {},
  };

  it('verifies a Koli One assertion and issues an opaque session', async () => {
    const verify = jest.fn().mockResolvedValue(identity);
    const upsertExternalIdentity = jest.fn().mockResolvedValue({
      userId: '5f8768e3-df8d-4fd0-b72f-523cd8e8f001',
      preferredLanguage: 'bg',
      roles: [],
    });
    const issueSession = jest.fn().mockResolvedValue({
      token: 'opaque-session-token',
      expiresAt: new Date('2026-08-23T00:00:00.000Z'),
    });
    const verifier: KoliOneTokenVerifier = {
      verify,
    };
    const repository: AuthRepository = {
      upsertExternalIdentity,
      issueSession,
      findSession: jest.fn(),
      revokeSession: jest.fn(),
    };
    const configService = {
      get: jest.fn((key: string) =>
        key === 'SESSION_COOKIE_NAME' ? 'kp_session' : 604800,
      ),
    };

    const service = new AuthService(
      verifier,
      repository,
      configService as never,
    );
    const result = await service.exchangeKoliOneAssertion('firebase-id-token');

    expect(verify).toHaveBeenCalledWith('firebase-id-token');
    expect(upsertExternalIdentity).toHaveBeenCalledWith(identity);
    expect(issueSession).toHaveBeenCalledWith(result.user.userId);
    expect(result.user.roles).toEqual([]);
  });
});
