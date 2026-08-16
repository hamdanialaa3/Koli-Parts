import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthController } from './auth.controller';
import type { AuthService } from './auth.service';
import type { CsrfService } from './csrf.service';

describe('AuthController', () => {
  it('sets an httpOnly session cookie after exchange', async () => {
    const authService = {
      cookieName: 'kp_session',
      cookieMaxAgeMs: 604800000,
      exchangeKoliOneAssertion: jest.fn().mockResolvedValue({
        user: {
          userId: '5f8768e3-df8d-4fd0-b72f-523cd8e8f001',
          preferredLanguage: 'bg',
          roles: [],
        },
        session: {
          token: 'opaque-session-token',
          expiresAt: new Date('2026-08-23T00:00:00.000Z'),
        },
      }),
    } as unknown as AuthService;
    const csrfService = {
      cookieName: 'kp_csrf',
      issueToken: jest.fn().mockReturnValue('csrf-token'),
    } as unknown as CsrfService;
    const cookie = jest.fn();
    const response = { cookie } as unknown as Response;
    const controller = new AuthController(authService, csrfService);

    const result = await controller.exchangeKoliOneAssertion(
      { assertion: 'a'.repeat(20) },
      response,
    );

    expect(cookie).toHaveBeenCalledWith(
      'kp_session',
      'opaque-session-token',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/' }),
    );
    expect(cookie).toHaveBeenCalledWith(
      'kp_csrf',
      'csrf-token',
      expect.objectContaining({ httpOnly: false, sameSite: 'lax', path: '/' }),
    );
    expect(result.roles).toEqual([]);
  });

  it('rejects current-user lookup without a session cookie', async () => {
    const controller = new AuthController(
      {
        cookieName: 'kp_session',
        getUserForCookieHeader: jest
          .fn()
          .mockRejectedValue(new UnauthorizedException()),
      } as unknown as AuthService,
      {} as CsrfService,
    );

    await expect(controller.me(undefined)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects malformed exchange payloads as bad requests', async () => {
    const controller = new AuthController(
      {
        cookieName: 'kp_session',
      } as AuthService,
      {} as CsrfService,
    );

    await expect(
      controller.exchangeKoliOneAssertion(
        { assertion: 'too-short' },
        {} as Response,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('clears both session and CSRF cookies on logout', async () => {
    const logout = jest.fn();
    const controller = new AuthController(
      {
        cookieName: 'kp_session',
        logout,
      } as unknown as AuthService,
      {
        cookieName: 'kp_csrf',
      } as CsrfService,
    );
    const clearCookie = jest.fn();
    const request = { sessionToken: 'opaque-session-token' };
    const response = { clearCookie } as unknown as Response;

    await controller.logout(request as never, response);

    expect(logout).toHaveBeenCalledWith('opaque-session-token');
    expect(clearCookie).toHaveBeenCalledWith(
      'kp_session',
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
    expect(clearCookie).toHaveBeenCalledWith(
      'kp_csrf',
      expect.objectContaining({ httpOnly: false, path: '/' }),
    );
  });
});
