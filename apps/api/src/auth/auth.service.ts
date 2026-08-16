import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Config } from '../config.schema';
import type { AuthenticatedUser, IssuedSession } from './auth.types';
import { AUTH_REPOSITORY, type AuthRepository } from './auth.repository';
import {
  KOLI_ONE_TOKEN_VERIFIER,
  type KoliOneTokenVerifier,
} from './koli-one-token-verifier';

export type AuthExchangeResult = {
  user: AuthenticatedUser;
  session: IssuedSession;
};

@Injectable()
export class AuthService {
  readonly cookieName: string;
  readonly cookieMaxAgeMs: number;

  constructor(
    @Inject(KOLI_ONE_TOKEN_VERIFIER)
    private readonly verifier: KoliOneTokenVerifier,
    @Inject(AUTH_REPOSITORY)
    private readonly repository: AuthRepository,
    configService: ConfigService<Config, true>,
  ) {
    this.cookieName = configService.get('SESSION_COOKIE_NAME', { infer: true });
    this.cookieMaxAgeMs =
      configService.get('SESSION_TTL_SECONDS', { infer: true }) * 1000;
  }

  async exchangeKoliOneAssertion(
    assertion: string,
  ): Promise<AuthExchangeResult> {
    const identity = await this.verifier.verify(assertion);
    const user = await this.repository.upsertExternalIdentity(identity);
    const session = await this.repository.issueSession(user.userId);
    return { user, session };
  }

  async getUserForSessionToken(token: string): Promise<AuthenticatedUser> {
    const user = await this.repository.findSession(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }
    return user;
  }

  async logout(token: string | undefined): Promise<void> {
    if (token) {
      await this.repository.revokeSession(token);
    }
  }
}
