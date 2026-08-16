import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Config } from '../config.schema';

@Injectable()
export class CsrfService {
  readonly cookieName: string;
  readonly headerName = 'x-csrf-token';
  private readonly secret: string;

  constructor(configService: ConfigService<Config, true>) {
    this.secret = configService.get('SESSION_SECRET', { infer: true });
    this.cookieName = configService.get('CSRF_COOKIE_NAME', { infer: true });
  }

  issueToken(sessionToken: string): string {
    const nonce = randomBytes(32).toString('base64url');
    return this.sign(nonce, sessionToken);
  }

  verifyToken(
    sessionToken: string | undefined,
    csrfCookie: string | undefined,
    csrfHeader: string | string[] | undefined,
  ): void {
    if (!sessionToken || !csrfCookie || !csrfHeader) {
      throw new UnauthorizedException('Missing CSRF token');
    }

    const headerValue = Array.isArray(csrfHeader) ? csrfHeader[0] : csrfHeader;
    if (!headerValue || headerValue !== csrfCookie) {
      throw new UnauthorizedException('Invalid CSRF token');
    }

    const [nonce, signature] = csrfCookie.split('.');
    if (!nonce || !signature) {
      throw new UnauthorizedException('Invalid CSRF token');
    }

    const expected = this.sign(nonce, sessionToken);
    if (!this.safeEqual(csrfCookie, expected)) {
      throw new UnauthorizedException('Invalid CSRF token');
    }
  }

  private sign(nonce: string, sessionToken: string): string {
    const signature = createHmac('sha256', this.secret)
      .update(`${sessionToken}.${nonce}`)
      .digest('base64url');
    return `${nonce}.${signature}`;
  }

  private safeEqual(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    return (
      leftBuffer.length === rightBuffer.length &&
      timingSafeEqual(leftBuffer, rightBuffer)
    );
  }
}
