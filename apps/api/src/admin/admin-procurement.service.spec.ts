import { AdminProcurementService } from './admin-procurement.service';

describe('AdminProcurementService', () => {
  it('delegates approval to the repository without changing the request', async () => {
    const input = {
      procurementId: '40b8bf5b-d6d3-465d-aec2-bc0f7f463d20',
      actorUserId: '5f8768e3-df8d-4fd0-b72f-523cd8e8f001',
      idempotencyKey: 'idempotency-key-123',
      reason: 'Supplier listing and fitment evidence reviewed',
    };
    const approve = jest.fn().mockResolvedValue({
      procurementId: input.procurementId,
      status: 'APPROVED',
      approvedBy: input.actorUserId,
      approvedAt: '2026-08-16T20:00:00.000Z',
      idempotentReplay: false,
    });
    const service = new AdminProcurementService({
      approve,
      listQueue: jest.fn(),
    });

    await service.approveProcurement(input);

    expect(approve).toHaveBeenCalledWith(input);
  });

  it('delegates queue listing to the repository', async () => {
    const listQueue = jest.fn().mockResolvedValue({
      items: [],
      limit: 25,
    });
    const service = new AdminProcurementService({
      approve: jest.fn(),
      listQueue,
    });

    await service.listProcurementQueue({ limit: 25 });

    expect(listQueue).toHaveBeenCalledWith({ limit: 25 });
  });
});
