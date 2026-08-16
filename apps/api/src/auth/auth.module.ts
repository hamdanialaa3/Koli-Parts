import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AUTH_REPOSITORY, PostgresAuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { FirebaseKoliOneTokenVerifierService } from './firebase-koli-one-token-verifier.service';
import { KOLI_ONE_TOKEN_VERIFIER } from './koli-one-token-verifier';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: KOLI_ONE_TOKEN_VERIFIER,
      useClass: FirebaseKoliOneTokenVerifierService,
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: PostgresAuthRepository,
    },
  ],
})
export class AuthModule {}
