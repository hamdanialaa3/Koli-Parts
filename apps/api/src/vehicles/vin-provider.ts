import { Injectable } from '@nestjs/common';
import type { VehicleCandidate } from './vehicle.types';

export const VIN_DECODER_PROVIDER = Symbol('VIN_DECODER_PROVIDER');

export interface VinDecoderProvider {
  decode(vin: string): Promise<VehicleCandidate | null>;
}

@Injectable()
export class UnavailableVinDecoderProvider implements VinDecoderProvider {
  decode(): Promise<VehicleCandidate | null> {
    return Promise.resolve(null);
  }
}
