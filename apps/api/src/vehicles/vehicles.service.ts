import { Inject } from '@nestjs/common';
import {
  VEHICLES_REPOSITORY,
  type VehiclesRepository,
} from './vehicles.repository';
import type {
  CreateVehicleInput,
  ListVehiclesInput,
  SetDefaultVehicleInput,
  UpdateVehicleInput,
} from './vehicle.types';

export class VehiclesService {
  constructor(
    @Inject(VEHICLES_REPOSITORY)
    private readonly repository: VehiclesRepository,
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
}
