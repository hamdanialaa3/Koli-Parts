import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Config } from '../config.schema';
import {
  VEHICLES_REPOSITORY,
  type VehiclesRepository,
} from './vehicles.repository';
import type {
  CreateVehicleInput,
  ListVehiclesInput,
  SetDefaultVehicleInput,
  UpdateVehicleInput,
  VehicleCandidate,
} from './vehicle.types';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(VEHICLES_REPOSITORY)
    private readonly repository: VehiclesRepository,
    private readonly configService: ConfigService<Config, true>,
  ) {}

  listVehicles(input: ListVehiclesInput) {
    return this.repository.list(input);
  }

  createVehicle(input: CreateVehicleInput) {
    return this.repository.create(input);
  }

  setDefaultVehicle(input: SetDefaultVehicleInput) {
    return this.repository.setDefault(input);
  }

  updateVehicle(input: UpdateVehicleInput) {
    return this.repository.update(input);
  }

  parseVin(vin: string): VehicleCandidate | null {
    if (vin.length !== 17) return null;
    const provider = this.configService.get('VIN_PROVIDER', { infer: true });
    if (provider === 'unconfigured') return null;
    return null;
  }
}
