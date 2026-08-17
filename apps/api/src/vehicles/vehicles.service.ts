import { Inject, Injectable } from '@nestjs/common';
import {
  VEHICLES_REPOSITORY,
  type VehiclesRepository,
} from './vehicles.repository';
import type {
  CreateVehicleInput,
  DeleteVehicleInput,
  GetVehicleInput,
  ListVehiclesInput,
  SetDefaultVehicleInput,
  UpdateVehicleInput,
  VehicleCandidate,
} from './vehicle.types';
import { VIN_DECODER_PROVIDER, type VinDecoderProvider } from './vin-provider';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(VEHICLES_REPOSITORY)
    private readonly repository: VehiclesRepository,
    @Inject(VIN_DECODER_PROVIDER)
    private readonly vinDecoderProvider: VinDecoderProvider,
  ) {}

  listVehicles(input: ListVehiclesInput) {
    return this.repository.list(input);
  }

  getVehicle(input: GetVehicleInput) {
    return this.repository.find(input);
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

  deleteVehicle(input: DeleteVehicleInput) {
    return this.repository.delete(input);
  }

  async parseVin(vin: string): Promise<VehicleCandidate | null> {
    if (vin.length !== 17) return null;
    return this.vinDecoderProvider.decode(vin);
  }
}
