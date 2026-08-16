import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthController } from './auth.controller';
import type { AuthService } from './auth.service';

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
    const cookie = jest.fn();
    const response = { cookie } as unknown as Response;
    const controller = new AuthController(authService);

    const result = await controller.exchangeKoliOneAssertion(
      { assertion: 'a'.repeat(20) },
      response,
    );

    expect(cookie).toHaveBeenCalledWith(
      'kp_session',
      'opaque-session-token',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/' }),
    );
    expect(result.roles).toEqual([]);
  });

  it('rejects current-user lookup without a session cookie', async () => {
    const controller = new AuthController({
      cookieName: 'kp_session',
    } as AuthService);

    await expect(controller.me(undefined)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects malformed exchange payloads as bad requests', async () => {
    const controller = new AuthController({
      cookieName: 'kp_session',
    } as AuthService);

    await expect(
      controller.exchangeKoliOneAssertion(
        { assertion: 'too-short' },
        {} as Response,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects malformed session cookies', async () => {
    const controller = new AuthController({
      cookieName: 'kp_session',
    } as AuthService);

    await expect(controller.me('kp_session=%E0%A4%A')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
