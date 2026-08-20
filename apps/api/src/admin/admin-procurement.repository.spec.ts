import { createHash } from 'node:crypto';
import { ConflictException } from '@nestjs/common';
import { Pool } from 'pg';
import { PostgresAdminProcurementRepository } from './admin-procurement.repository';

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const mockPool = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};

jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool),
}));

describe('PostgresAdminProcurementRepository', () => {
  const approvedAt = new Date('2026-08-16T20:00:00.000Z');
  const input = {
    procurementId: '40b8bf5b-d6d3-465d-aec2-bc0f7f463d20',
    actorUserId: '5f8768e3-df8d-4fd0-b72f-523cd8e8f001',
    idempotencyKey: 'idempotency-key-123',
    reason: 'Supplier listing and fitment evidence reviewed',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.connect.mockResolvedValue(mockClient);
    mockClient.query.mockReset();
    mockPool.query.mockReset();
  });

  it('lists pending and review procurements with a bounded query', async () => {
    const createdAt = new Date('2026-08-16T20:00:00.000Z');
    const updatedAt = new Date('2026-08-16T20:05:00.000Z');
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          procurement_id: input.procurementId,
          order_id: 'f6ee2a3e-8536-4b26-9f12-a1fdedfb9ba8',
          procurement_status: 'REVIEW',
          order_status: 'PROCUREMENT_REVIEW',
          supplier: 'ebay',
          total_minor: '11600',
          currency: 'EUR',
          created_at: createdAt,
          updated_at: updatedAt,
        },
      ],
    });

    const repository = makeRepository();
    const result = await repository.listQueue({ limit: 25 });

    expect(result).toEqual({
      items: [
        {
          procurementId: input.procurementId,
          orderId: 'f6ee2a3e-8536-4b26-9f12-a1fdedfb9ba8',
          procurementStatus: 'REVIEW',
          orderStatus: 'PROCUREMENT_REVIEW',
          supplier: 'ebay',
          totalMinor: 11600,
          currency: 'EUR',
          createdAt: '2026-08-16T20:00:00.000Z',
          updatedAt: '2026-08-16T20:05:00.000Z',
        },
      ],
      limit: 25,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('LIMIT $2'),
      [['PENDING', 'REVIEW'], 25],
    );
  });

  it('filters the procurement queue by requested status', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });

    const repository = makeRepository();
    await repository.listQueue({ status: 'PENDING', limit: 10 });

    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
      ['PENDING'],
      10,
    ]);
  });

  it('approves a pending procurement inside a transaction and records audit/idempotency', async () => {
    mockClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [] }) // idempotency lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: input.procurementId,
            status: 'PENDING',
            approved_by: null,
            approved_at: null,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: input.procurementId,
            approved_by: input.actorUserId,
            approved_at: approvedAt,
          },
        ],
      })
      .mockResolvedValueOnce({}) // audit log
      .mockResolvedValueOnce({}) // idempotency insert
      .mockResolvedValueOnce({}); // COMMIT

    const repository = makeRepository();
    const result = await repository.approve(input);

    expect(result).toEqual({
      procurementId: input.procurementId,
      status: 'APPROVED',
      approvedBy: input.actorUserId,
      approvedAt: '2026-08-16T20:00:00.000Z',
      idempotentReplay: false,
    });
    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(
      queryTexts().some((text) => text.includes('procurement.approve')),
    ).toBe(true);
  });

  it('returns a stored idempotent response without updating procurement again', async () => {
    const response = {
      procurementId: input.procurementId,
      status: 'APPROVED' as const,
      approvedBy: input.actorUserId,
      approvedAt: '2026-08-16T20:00:00.000Z',
      idempotentReplay: false,
    };
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            scope: `admin.procurement.approve.${input.procurementId}`,
            request_hash: requestHash(input),
            response_body: response,
            expires_at: activeIdempotencyExpiry(),
          },
        ],
      })
      .mockResolvedValueOnce({});

    const repository = makeRepository();
    await expect(repository.approve(input)).resolves.toEqual({
      ...response,
      idempotentReplay: true,
    });

    expect(
      queryTexts().some((text) => text.includes('UPDATE procurements')),
    ).toBe(false);
  });

  it('rolls back when an idempotency key is reused for a different request', async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            scope: `admin.procurement.approve.${input.procurementId}`,
            request_hash: 'different-hash',
            response_body: {},
            expires_at: activeIdempotencyExpiry(),
          },
        ],
      })
      .mockResolvedValueOnce({});

    const repository = makeRepository();

    await expect(repository.approve(input)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
  });

  it('constructs a Postgres pool from the configured database URL', () => {
    makeRepository();

    expect(Pool).toHaveBeenCalledWith({
      connectionString:
        'postgresql://koliparts:dev-password@localhost:5432/koliparts_db',
    });
  });
});

function makeRepository(): PostgresAdminProcurementRepository {
  return new PostgresAdminProcurementRepository({
    get: jest.fn(
      () => 'postgresql://koliparts:dev-password@localhost:5432/koliparts_db',
    ),
  } as never);
}

function queryTexts(): string[] {
  return (mockClient.query.mock.calls as Array<[unknown, ...unknown[]]>).map(
    ([statement]) => String(statement),
  );
}

function requestHash(input: {
  procurementId: string;
  actorUserId: string;
  reason: string;
}): string {
  return createHash('sha256')
    .update(
      JSON.stringify({
        procurementId: input.procurementId,
        actorUserId: input.actorUserId,
        reason: input.reason,
      }),
    )
    .digest('hex');
}

function activeIdempotencyExpiry(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}
