import { Module } from '@nestjs/common';
import {
  FITMENT_REPOSITORY,
  PostgresFitmentRepository,
} from './fitment.repository';

@Module({
  providers: [
    {
      provide: FITMENT_REPOSITORY,
      useClass: PostgresFitmentRepository,
    },
  ],
  exports: [FITMENT_REPOSITORY],
})
export class FitmentModule {}
