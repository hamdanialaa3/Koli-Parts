import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AdminProcurementsController } from './admin-procurements.controller';
import type { AdminProcurementService } from './admin-procurement.service';

describe('AdminProcurementsController', () => {
  it('submits a guarded procurement approval request to the service', async () => {
    const approveProcurement = jest.fn().mockResolvedValue({
      procurementId: '40b8bf5b-d6d3-465d-aec2-bc0f7f463d20',
      status: 'APPROVED',
      approvedBy: '5f8768e3-df8d-4fd0-b72f-523cd8e8f001',
      approvedAt: '2026-08-16T20:00:00.000Z',
      idempotentReplay: false,
    });
    const controller = new AdminProcurementsController({
      approveProcurement,
    } as unknown as AdminProcurementService);

    await controller.approve(
      { procurementId: '40b8bf5b-d6d3-465d-aec2-bc0f7f463d20' },
      { reason: 'Supplier listing and fitment evidence reviewed' },
      'idempotency-key-123',
      {
        authUser: {
          userId: '5f8768e3-df8d-4fd0-b72f-523cd8e8f001',
          preferredLanguage: 'bg',
          roles: ['procurement_operator'],
        },
      } as never,
    );

    expect(approveProcurement).toHaveBeenCalledWith({
      procurementId: '40b8bf5b-d6d3-465d-aec2-bc0f7f463d20',
      actorUserId: '5f8768e3-df8d-4fd0-b72f-523cd8e8f001',
      idempotencyKey: 'idempotency-key-123',
      reason: 'Supplier listing and fitment evidence reviewed',
    });
  });

  it('rejects invalid request input before service execution', () => {
    const approveProcurement = jest.fn();
    const controller = new AdminProcurementsController({
      approveProcurement,
    } as unknown as AdminProcurementService);

    expect(() =>
      controller.approve(
        { procurementId: 'not-a-uuid' },
        { reason: 'ok' },
        'short',
        { authUser: { userId: 'user-1' } } as never,
      ),
    ).toThrow(BadRequestException);
    expect(approveProcurement).not.toHaveBeenCalled();
  });

  it('rejects requests when the session guard did not attach an auth user', () => {
    const controller = new AdminProcurementsController({
      approveProcurement: jest.fn(),
    } as unknown as AdminProcurementService);

    expect(() =>
      controller.approve(
        { procurementId: '40b8bf5b-d6d3-465d-aec2-bc0f7f463d20' },
        { reason: 'Supplier listing and fitment evidence reviewed' },
        'idempotency-key-123',
        {} as never,
      ),
    ).toThrow(UnauthorizedException);
  });
});
