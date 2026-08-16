import { UnauthorizedException } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';
import { FirebaseKoliOneTokenVerifierService } from './firebase-koli-one-token-verifier.service';

jest.mock('firebase-admin/app', () => ({
  getApps: jest.fn(() => []),
  initializeApp: jest.fn(() => ({ name: 'koli-one-fire-new-globul' })),
}));

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(),
}));

describe('FirebaseKoliOneTokenVerifierService', () => {
  it('rejects tokens that do not match the audited issuer and audience', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({
      uid: 'firebase-user-1',
      iss: 'https://securetoken.google.com/other-project',
      aud: 'other-project',
      email: 'user@example.com',
      email_verified: true,
    });
    jest.mocked(getAuth).mockReturnValue({ verifyIdToken } as never);

    const service = new FirebaseKoliOneTokenVerifierService({
      get: jest.fn((key: string) => {
        const values: Record<string, unknown> = {
          KOLI_ONE_FIREBASE_PROJECT_ID: 'fire-new-globul',
          KOLI_ONE_AUTH_ISSUER:
            'https://securetoken.google.com/fire-new-globul',
          KOLI_ONE_AUTH_AUDIENCE: 'fire-new-globul',
          KOLI_ONE_CHECK_REVOKED: true,
        };
        return values[key];
      }),
    } as never);

    await expect(service.verify('firebase-id-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(verifyIdToken).toHaveBeenCalledWith('firebase-id-token', true);
  });
});
