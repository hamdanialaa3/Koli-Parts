import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config.schema';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
