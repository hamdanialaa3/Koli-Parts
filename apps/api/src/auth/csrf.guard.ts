import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CsrfService } from './csrf.service';
import type { AuthenticatedRequest } from './auth.types';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly csrfService: CsrfService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    this.csrfService.verifyToken(
      request.sessionToken,
      this.extractCookie(request.headers.cookie, this.csrfService.cookieName),
      request.headers[this.csrfService.headerName],
    );
    return true;
  }

  private extractCookie(
    cookieHeader: string | undefined,
    cookieName: string,
  ): string | undefined {
    if (!cookieHeader) return undefined;
    const cookie = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${cookieName}=`));

    if (!cookie) return undefined;

    try {
      return decodeURIComponent(cookie.split('=').slice(1).join('='));
    } catch {
      throw new UnauthorizedException('Invalid CSRF cookie');
    }
  }
}
