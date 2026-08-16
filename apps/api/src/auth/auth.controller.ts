import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';

const exchangeSchema = z.object({
  assertion: z.string().min(20),
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('koli-one/exchange')
  async exchangeKoliOneAssertion(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const parsed = exchangeSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException('Invalid Koli One assertion payload');
    }

    const { assertion } = parsed.data;
    const result = await this.authService.exchangeKoliOneAssertion(assertion);
    this.setSessionCookie(response, result.session.token);
    return {
      userId: result.user.userId,
      preferredLanguage: result.user.preferredLanguage,
      roles: result.user.roles,
      expiresAt: result.session.expiresAt.toISOString(),
    };
  }

  @Get('me')
  async me(@Headers('cookie') cookieHeader?: string) {
    const token = this.extractSessionToken(cookieHeader);
    if (!token) {
      throw new UnauthorizedException('Missing session');
    }
    return this.authService.getUserForSessionToken(token);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Headers('cookie') cookieHeader: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const token = this.extractSessionToken(cookieHeader);
    await this.authService.logout(token);
    response.clearCookie(this.authService.cookieName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }

  private setSessionCookie(response: Response, token: string): void {
    response.cookie(this.authService.cookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: this.authService.cookieMaxAgeMs,
      path: '/',
    });
  }

  private extractSessionToken(
    cookieHeader: string | undefined,
  ): string | undefined {
    if (!cookieHeader) return undefined;
    const cookie = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${this.authService.cookieName}=`));

    if (!cookie) return undefined;

    try {
      return decodeURIComponent(cookie.split('=').slice(1).join('='));
    } catch {
      throw new UnauthorizedException('Invalid session cookie');
    }
  }
}
