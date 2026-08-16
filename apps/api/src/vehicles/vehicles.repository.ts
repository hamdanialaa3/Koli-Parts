import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import type { Config } from '../config.schema';
import type {
  CreateVehicleInput,
  ListVehiclesInput,
  SetDefaultVehicleInput,
  Vehicle,
} from './vehicle.types';

export const VEHICLES_REPOSITORY = Symbol('VEHICLES_REPOSITORY');

export interface VehiclesRepository {
  list(input: ListVehiclesInput): Promise<Vehicle[]>;
  create(input: CreateVehicleInput): Promise<Vehicle>;
  setDefault(input: SetDefaultVehicleInput): Promise<Vehicle | null>;
}

type VehicleRow = {
  id: string;
  vin: string | null;
  make: string;
  model: string;
  production_year: number | null;
  engine_code: string | null;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class PostgresVehiclesRepository
  implements VehiclesRepository, OnModuleDestroy
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

  async list(input: ListVehiclesInput): Promise<Vehicle[]> {
    const result = await this.pool.query<VehicleRow>(
      `SELECT id, vin, make, model, production_year, engine_code,
              is_default, created_at, updated_at
         FROM vehicles
        WHERE user_id = $1
        ORDER BY is_default DESC, created_at DESC, id DESC
        LIMIT $2`,
      [input.userId, input.limit],
    );

    return result.rows.map((row) => this.toVehicle(row));
  }

  async create(input: CreateVehicleInput): Promise<Vehicle> {
    const result = await this.pool.query<VehicleRow>(
      `INSERT INTO vehicles
        (user_id, vin, make, model, production_year, engine_code)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, vin, make, model, production_year, engine_code,
                 is_default, created_at, updated_at`,
      [
        input.userId,
        input.vin ?? null,
        input.make,
        input.model,
        input.productionYear ?? null,
        input.engineCode ?? null,
      ],
    );

    return this.toVehicle(result.rows[0]);
  }

  async setDefault(input: SetDefaultVehicleInput): Promise<Vehicle | null> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `UPDATE vehicles
            SET is_default = false, updated_at = now()
          WHERE user_id = $1 AND is_default = true`,
        [input.userId],
      );
      const result = await client.query<VehicleRow>(
        `UPDATE vehicles
            SET is_default = true, updated_at = now()
          WHERE user_id = $1 AND id = $2
          RETURNING id, vin, make, model, production_year, engine_code,
                    is_default, created_at, updated_at`,
        [input.userId, input.vehicleId],
      );

      if (!result.rows[0]) {
        await client.query('ROLLBACK');
        return null;
      }

      await client.query('COMMIT');
      return this.toVehicle(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private toVehicle(row: VehicleRow): Vehicle {
    return {
      id: row.id,
      vin: row.vin ?? undefined,
      make: row.make,
      model: row.model,
      productionYear: row.production_year ?? undefined,
      engineCode: row.engine_code ?? undefined,
      isDefault: row.is_default,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}
