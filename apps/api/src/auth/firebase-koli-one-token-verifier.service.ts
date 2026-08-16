import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { Config } from '../config.schema';
import type { KoliOneIdentity } from './auth.types';
import type { KoliOneTokenVerifier } from './koli-one-token-verifier';

@Injectable()
export class FirebaseKoliOneTokenVerifierService implements KoliOneTokenVerifier {
  private readonly projectId?: string;
  private readonly issuer?: string;
  private readonly audience?: string;
  private readonly checkRevoked: boolean;
  private readonly app?: App;

  constructor(private readonly configService: ConfigService<Config, true>) {
    this.projectId = this.configService.get('KOLI_ONE_FIREBASE_PROJECT_ID', {
      infer: true,
    });
    this.issuer =
      this.configService.get('KOLI_ONE_AUTH_ISSUER', { infer: true }) ??
      (this.projectId
        ? `https://securetoken.google.com/${this.projectId}`
        : undefined);
    this.audience =
      this.configService.get('KOLI_ONE_AUTH_AUDIENCE', { infer: true }) ??
      this.projectId;
    this.checkRevoked = this.configService.get('KOLI_ONE_CHECK_REVOKED', {
      infer: true,
    });

    if (this.projectId) {
      const appName = `koli-one-${this.projectId}`;
      this.app =
        getApps().find((app) => app.name === appName) ??
        initializeApp({ projectId: this.projectId }, appName);
    }
  }

  async verify(assertion: string): Promise<KoliOneIdentity> {
    if (!this.app || !this.issuer || !this.audience) {
      throw new ServiceUnavailableException('Koli One auth is not configured');
    }

    const decoded = await getAuth(this.app).verifyIdToken(
      assertion,
      this.checkRevoked,
    );

    if (decoded.iss !== this.issuer || decoded.aud !== this.audience) {
      throw new UnauthorizedException('Koli One auth contract mismatch');
    }

    return {
      provider: 'firebase',
      subject: decoded.uid,
      issuer: decoded.iss,
      audience: String(decoded.aud),
      email: decoded.email,
      emailVerified: decoded.email_verified === true,
      claims: decoded as unknown as Record<string, unknown>,
    };
  }
}
