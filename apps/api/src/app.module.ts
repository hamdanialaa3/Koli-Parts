import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { configValidationSchema } from './config.schema';
import { FitmentModule } from './fitment/fitment.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = configValidationSchema.safeParse(config);
        if (!result.success) {
          console.error(
            '❌ Invalid environment variables:',
            result.error.format(),
          );
          throw new Error('Config validation failed');
        }
        return result.data;
      },
    }),
    AdminModule,
    AuthModule,
    CatalogModule,
    FitmentModule,
    VehiclesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
