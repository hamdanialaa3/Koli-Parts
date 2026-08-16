import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { user, sessionToken } =
      await this.authService.getUserForCookieHeader(request.headers.cookie);

    if (!sessionToken) {
      throw new UnauthorizedException('Missing session');
    }

    request.authUser = user;
    request.sessionToken = sessionToken;
    return true;
  }
}
