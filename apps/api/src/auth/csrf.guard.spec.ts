import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { CsrfGuard } from './csrf.guard';

describe('CsrfGuard', () => {
  it('passes the session token, CSRF cookie, and CSRF header to the service', () => {
    const verifyToken = jest.fn();
    const guard = new CsrfGuard({
      cookieName: 'kp_csrf',
      headerName: 'x-csrf-token',
      verifyToken,
    } as never);

    expect(
      guard.canActivate(
        contextForRequest({
          sessionToken: 'session-token',
          headers: {
            cookie: 'kp_session=session-token; kp_csrf=csrf-token',
            'x-csrf-token': 'csrf-token',
          },
        }),
      ),
    ).toBe(true);

    expect(verifyToken).toHaveBeenCalledWith(
      'session-token',
      'csrf-token',
      'csrf-token',
    );
  });

  it('rejects malformed CSRF cookies before verification', () => {
    const guard = new CsrfGuard({
      cookieName: 'kp_csrf',
      headerName: 'x-csrf-token',
      verifyToken: jest.fn(),
    } as never);

    expect(() =>
      guard.canActivate(
        contextForRequest({
          sessionToken: 'session-token',
          headers: {
            cookie: 'kp_csrf=%E0%A4%A',
            'x-csrf-token': 'csrf-token',
          },
        }),
      ),
    ).toThrow(UnauthorizedException);
  });
});

function contextForRequest(request: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}
