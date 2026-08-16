import { UnauthorizedException } from '@nestjs/common';
import { CsrfService } from './csrf.service';

describe('CsrfService', () => {
  const configService = {
    get: jest.fn((key: string) =>
      key === 'CSRF_COOKIE_NAME'
        ? 'kp_csrf'
        : '12345678901234567890123456789012',
    ),
  };

  it('issues and verifies a token bound to the opaque session token', () => {
    const service = new CsrfService(configService as never);
    const token = service.issueToken('session-token');

    expect(() =>
      service.verifyToken('session-token', token, token),
    ).not.toThrow();
  });

  it('rejects missing, mismatched, and session-swapped CSRF tokens', () => {
    const service = new CsrfService(configService as never);
    const token = service.issueToken('session-token');

    expect(() =>
      service.verifyToken('session-token', undefined, token),
    ).toThrow(UnauthorizedException);
    expect(() =>
      service.verifyToken('session-token', token, 'different-token'),
    ).toThrow(UnauthorizedException);
    expect(() =>
      service.verifyToken('other-session-token', token, token),
    ).toThrow(UnauthorizedException);
  });
});
