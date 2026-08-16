import { createHash } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';
import type { Config } from '../config.schema';
import type {
  ApprovedProcurement,
  ApproveProcurementInput,
  ListProcurementQueueInput,
  ProcurementQueue,
  ProcurementQueueItem,
  ProcurementQueueStatus,
} from './admin-procurement.types';

export const ADMIN_PROCUREMENT_REPOSITORY = Symbol(
  'ADMIN_PROCUREMENT_REPOSITORY',
);

export interface AdminProcurementRepository {
  approve(input: ApproveProcurementInput): Promise<ApprovedProcurement>;
  listQueue(input: ListProcurementQueueInput): Promise<ProcurementQueue>;
}

@Injectable()
export class PostgresAdminProcurementRepository
  implements AdminProcurementRepository, OnModuleDestroy
{
  private readonly pool: Pool;

  constructor(configService: ConfigService<Config, true>) {
    this.pool = new Pool({
      connectionString: configService.get('DATABASE_URL', { infer: true }),
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  async listQueue(input: ListProcurementQueueInput): Promise<ProcurementQueue> {
    const statuses = input.status ? [input.status] : ['PENDING', 'REVIEW'];
    const result = await this.pool.query<{
      procurement_id: string;
      order_id: string;
      procurement_status: ProcurementQueueStatus;
      order_status: string;
      supplier: string;
      total_minor: string;
      currency: string;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT p.id AS procurement_id,
              p.order_id,
              p.status AS procurement_status,
              o.status AS order_status,
              p.supplier,
              o.total_minor,
              o.currency,
              p.created_at,
              p.updated_at
         FROM procurements p
         JOIN orders o ON o.id = p.order_id
        WHERE p.status = ANY($1::procurement_status[])
        ORDER BY p.created_at ASC, p.id ASC
        LIMIT $2`,
      [statuses, input.limit],
    );

    return {
      items: result.rows.map((row): ProcurementQueueItem => ({
        procurementId: row.procurement_id,
        orderId: row.order_id,
        procurementStatus: row.procurement_status,
        orderStatus: row.order_status,
        supplier: row.supplier,
        totalMinor: Number(row.total_minor),
        currency: row.currency,
        createdAt: row.created_at.toISOString(),
        updatedAt: row.updated_at.toISOString(),
      })),
      limit: input.limit,
    };
  }

  async approve(input: ApproveProcurementInput): Promise<ApprovedProcurement> {
    const client = await this.pool.connect();
    const scope = `admin.procurement.approve.${input.procurementId}`;
    const requestHash = this.hashRequest(input);

    try {
      await client.query('BEGIN');

      const replay = await client.query<{
        scope: string;
        request_hash: string;
        response_body: ApprovedProcurement | null;
        expires_at: Date;
      }>(
        `SELECT scope, request_hash, response_body, expires_at
           FROM idempotency_keys
          WHERE key = $1
          FOR UPDATE`,
        [input.idempotencyKey],
      );

      const existing = replay.rows[0];
      if (existing) {
        if (existing.expires_at <= new Date()) {
          await client.query('DELETE FROM idempotency_keys WHERE key = $1', [
            input.idempotencyKey,
          ]);
        } else if (
          existing.scope === scope &&
          existing.request_hash === requestHash &&
          existing.response_body
        ) {
          await client.query('COMMIT');
          return { ...existing.response_body, idempotentReplay: true };
        } else {
          throw new ConflictException('Idempotency key reuse mismatch');
        }
      }

      const procurement = await client.query<{
        id: string;
        status: string;
        approved_by: string | null;
        approved_at: Date | null;
      }>(
        `SELECT id, status, approved_by, approved_at
           FROM procurements
          WHERE id = $1
          FOR UPDATE`,
        [input.procurementId],
      );

      const row = procurement.rows[0];
      if (!row) {
        throw new NotFoundException('Procurement not found');
      }

      if (row.status === 'APPROVED' && row.approved_by && row.approved_at) {
        const response = this.toResponse(
          row.id,
          row.approved_by,
          row.approved_at,
          false,
        );
        await this.recordIdempotency(
          client,
          input.idempotencyKey,
          scope,
          requestHash,
          response,
        );
        await client.query('COMMIT');
        return response;
      }

      if (!['PENDING', 'REVIEW'].includes(row.status)) {
        throw new ConflictException(
          `Procurement cannot be approved from ${row.status}`,
        );
      }

      const updated = await client.query<{
        id: string;
        approved_by: string;
        approved_at: Date;
      }>(
        `UPDATE procurements
            SET status = 'APPROVED',
                approved_by = $2,
                approved_at = now(),
                updated_at = now()
          WHERE id = $1
          RETURNING id, approved_by, approved_at`,
        [input.procurementId, input.actorUserId],
      );

      const approved = updated.rows[0];
      const response = this.toResponse(
        approved.id,
        approved.approved_by,
        approved.approved_at,
        false,
      );

      await client.query(
        `INSERT INTO audit_logs
          (actor_type, actor_id, action, target_type, target_id, after_data, reason)
         VALUES ('user', $1, 'procurement.approve', 'procurement', $2, $3::jsonb, $4)`,
        [
          input.actorUserId,
          input.procurementId,
          JSON.stringify({ status: 'APPROVED' }),
          input.reason,
        ],
      );

      await this.recordIdempotency(
        client,
        input.idempotencyKey,
        scope,
        requestHash,
        response,
      );

      await client.query('COMMIT');
      return response;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async recordIdempotency(
    client: PoolClient,
    key: string,
    scope: string,
    requestHash: string,
    response: ApprovedProcurement,
  ): Promise<void> {
    await client.query(
      `INSERT INTO idempotency_keys
        (key, scope, request_hash, response_status, response_body, resource_id, expires_at)
       VALUES ($1, $2, $3, 200, $4::jsonb, $5, now() + interval '24 hours')`,
      [
        key,
        scope,
        requestHash,
        JSON.stringify(response),
        response.procurementId,
      ],
    );
  }

  private hashRequest(input: ApproveProcurementInput): string {
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

  private toResponse(
    procurementId: string,
    approvedBy: string,
    approvedAt: Date,
    idempotentReplay: boolean,
  ): ApprovedProcurement {
    return {
      procurementId,
      status: 'APPROVED',
      approvedBy,
      approvedAt: approvedAt.toISOString(),
      idempotentReplay,
    };
  }
}
