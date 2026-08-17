import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VehiclesController } from './vehicles.controller';
import {
  PostgresVehiclesRepository,
  VEHICLES_REPOSITORY,
} from './vehicles.repository';
import { VehiclesService } from './vehicles.service';
import {
  UnavailableVinDecoderProvider,
  VIN_DECODER_PROVIDER,
} from './vin-provider';

@Module({
  imports: [AuthModule],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    {
      provide: VEHICLES_REPOSITORY,
      useClass: PostgresVehiclesRepository,
    },
    {
      provide: VIN_DECODER_PROVIDER,
      useClass: UnavailableVinDecoderProvider,
    },
  ],
})
export class VehiclesModule {}
