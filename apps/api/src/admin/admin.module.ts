import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminProcurementsController } from './admin-procurements.controller';
import {
  ADMIN_PROCUREMENT_REPOSITORY,
  PostgresAdminProcurementRepository,
} from './admin-procurement.repository';
import { AdminProcurementService } from './admin-procurement.service';

@Module({
  imports: [AuthModule],
  controllers: [AdminProcurementsController],
  providers: [
    AdminProcurementService,
    {
      provide: ADMIN_PROCUREMENT_REPOSITORY,
      useClass: PostgresAdminProcurementRepository,
    },
  ],
})
export class AdminModule {}
