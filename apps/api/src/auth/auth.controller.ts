import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';
import { CsrfGuard } from './csrf.guard';
import { CsrfService } from './csrf.service';
import { SessionAuthGuard } from './session-auth.guard';

const exchangeSchema = z.object({
  assertion: z.string().min(20),
});

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly csrfService: CsrfService,
  ) {}

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
    this.setCsrfCookie(
      response,
      this.csrfService.issueToken(result.session.token),
    );
    return {
      userId: result.user.userId,
      preferredLanguage: result.user.preferredLanguage,
      roles: result.user.roles,
      expiresAt: result.session.expiresAt.toISOString(),
    };
  }

  @Get('me')
  async me(@Headers('cookie') cookieHeader?: string) {
    return (await this.authService.getUserForCookieHeader(cookieHeader)).user;
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard, CsrfGuard)
  @HttpCode(204)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const token = (request as AuthenticatedRequest).sessionToken;
    await this.authService.logout(token);
    response.clearCookie(this.authService.cookieName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    response.clearCookie(this.csrfService.cookieName, {
      httpOnly: false,
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

  private setCsrfCookie(response: Response, token: string): void {
    response.cookie(this.csrfService.cookieName, token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: this.authService.cookieMaxAgeMs,
      path: '/',
    });
  }
}
