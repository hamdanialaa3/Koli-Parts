import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import type { Config } from '../config.schema';
import type {
  CompatibilityEvaluationRecord,
  FindLatestCompatibilityEvaluationInput,
  FitmentEvidenceRecord,
  RecordCompatibilityEvaluationInput,
  RecordFitmentEvidenceInput,
} from './fitment.types';

export const FITMENT_REPOSITORY = Symbol('FITMENT_REPOSITORY');

export interface FitmentRepository {
  recordEvidence(
    input: RecordFitmentEvidenceInput,
  ): Promise<FitmentEvidenceRecord>;
  recordEvaluation(
    input: RecordCompatibilityEvaluationInput,
  ): Promise<CompatibilityEvaluationRecord>;
  findLatestEvaluation(
    input: FindLatestCompatibilityEvaluationInput,
  ): Promise<CompatibilityEvaluationRecord | null>;
}

type FitmentEvidenceRow = {
  id: string;
  product_id: string;
  vehicle_id: string | null;
  source: string;
  evidence_type: string;
  strength: string;
  details: Record<string, unknown>;
  created_at: Date;
};

type CompatibilityEvaluationRow = {
  id: string;
  product_id: string;
  vehicle_id: string;
  status: CompatibilityEvaluationRecord['status'];
  rule_score: string;
  calibrated_probability: string | null;
  evidence_ids: string[];
  warnings: string[];
  algorithm_version: string;
  created_at: Date;
};

@Injectable()
export class PostgresFitmentRepository
  implements FitmentRepository, OnModuleDestroy
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

  async recordEvidence(
    input: RecordFitmentEvidenceInput,
  ): Promise<FitmentEvidenceRecord> {
    const result = await this.pool.query<FitmentEvidenceRow>(
      `INSERT INTO fitment_evidence
        (product_id, vehicle_id, source, evidence_type, strength, details)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)
       RETURNING id, product_id, vehicle_id, source, evidence_type,
                 strength, details, created_at`,
      [
        input.productId,
        input.vehicleId ?? null,
        input.source,
        input.evidenceType,
        input.strength,
        JSON.stringify(input.details ?? {}),
      ],
    );

    return this.toEvidenceRecord(result.rows[0]);
  }

  async recordEvaluation(
    input: RecordCompatibilityEvaluationInput,
  ): Promise<CompatibilityEvaluationRecord> {
    const result = await this.pool.query<CompatibilityEvaluationRow>(
      `INSERT INTO compatibility_evaluations
        (product_id, vehicle_id, status, rule_score, calibrated_probability,
         evidence_ids, warnings, algorithm_version)
       VALUES ($1, $2, $3, $4, $5, $6::uuid[], $7::jsonb, $8)
       RETURNING id, product_id, vehicle_id, status, rule_score,
                 calibrated_probability, evidence_ids, warnings,
                 algorithm_version, created_at`,
      [
        input.productId,
        input.vehicleId,
        input.status,
        input.ruleScore,
        input.calibratedProbability,
        input.evidenceIds,
        JSON.stringify(input.warnings),
        input.algorithmVersion,
      ],
    );

    return this.toEvaluationRecord(result.rows[0]);
  }

  async findLatestEvaluation(
    input: FindLatestCompatibilityEvaluationInput,
  ): Promise<CompatibilityEvaluationRecord | null> {
    const result = await this.pool.query<CompatibilityEvaluationRow>(
      `SELECT id, product_id, vehicle_id, status, rule_score,
              calibrated_probability, evidence_ids, warnings,
              algorithm_version, created_at
         FROM compatibility_evaluations
        WHERE product_id = $1 AND vehicle_id = $2
        ORDER BY created_at DESC, id DESC
        LIMIT 1`,
      [input.productId, input.vehicleId],
    );

    return result.rows[0] ? this.toEvaluationRecord(result.rows[0]) : null;
  }

  private toEvidenceRecord(row: FitmentEvidenceRow): FitmentEvidenceRecord {
    return {
      id: row.id,
      productId: row.product_id,
      vehicleId: row.vehicle_id ?? undefined,
      source: row.source,
      evidenceType: row.evidence_type,
      strength: Number(row.strength),
      details: row.details,
      createdAt: row.created_at.toISOString(),
    };
  }

  private toEvaluationRecord(
    row: CompatibilityEvaluationRow,
  ): CompatibilityEvaluationRecord {
    return {
      id: row.id,
      productId: row.product_id,
      vehicleId: row.vehicle_id,
      status: row.status,
      ruleScore: Number(row.rule_score),
      calibratedProbability: row.calibrated_probability
        ? Number(row.calibrated_probability)
        : null,
      evidenceIds: row.evidence_ids,
      warnings: row.warnings,
      algorithmVersion: row.algorithm_version,
      createdAt: row.created_at.toISOString(),
    };
  }
}
