import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('allows requests when no role metadata is required', () => {
    const guard = new RolesGuard({
      getAllAndOverride: jest.fn(() => undefined),
    } as never);

    expect(guard.canActivate(contextForRoles([]))).toBe(true);
  });

  it('allows a user with one of the required roles', () => {
    const guard = new RolesGuard({
      getAllAndOverride: jest.fn(() => ['procurement_operator', 'admin']),
    } as never);

    expect(guard.canActivate(contextForRoles(['procurement_operator']))).toBe(
      true,
    );
  });

  it('rejects authenticated users without the required role', () => {
    const guard = new RolesGuard({
      getAllAndOverride: jest.fn(() => ['admin']),
    } as never);

    expect(() => guard.canActivate(contextForRoles(['support']))).toThrow(
      ForbiddenException,
    );
  });
});

function contextForRoles(roles: string[]): ExecutionContext {
  return {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({
      getRequest: () => ({ authUser: { roles } }),
    }),
  } as unknown as ExecutionContext;
}
