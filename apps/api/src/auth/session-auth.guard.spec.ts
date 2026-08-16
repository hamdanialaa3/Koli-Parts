import type { ExecutionContext } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard';

describe('SessionAuthGuard', () => {
  it('attaches the authenticated user and session token to the request', async () => {
    const request = { headers: { cookie: 'kp_session=token' } };
    const guard = new SessionAuthGuard({
      getUserForCookieHeader: jest.fn().mockResolvedValue({
        user: {
          userId: '5f8768e3-df8d-4fd0-b72f-523cd8e8f001',
          preferredLanguage: 'bg',
          roles: ['procurement_operator'],
        },
        sessionToken: 'token',
      }),
    } as never);

    const allowed = await guard.canActivate(contextForRequest(request));

    expect(allowed).toBe(true);
    expect(request).toMatchObject({
      sessionToken: 'token',
      authUser: { roles: ['procurement_operator'] },
    });
  });
});

function contextForRequest(request: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}
