import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AUTH_REPOSITORY, PostgresAuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { CsrfGuard } from './csrf.guard';
import { CsrfService } from './csrf.service';
import { FirebaseKoliOneTokenVerifierService } from './firebase-koli-one-token-verifier.service';
import { KOLI_ONE_TOKEN_VERIFIER } from './koli-one-token-verifier';
import { RolesGuard } from './roles.guard';
import { SessionAuthGuard } from './session-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    CsrfService,
    SessionAuthGuard,
    CsrfGuard,
    RolesGuard,
    {
      provide: KOLI_ONE_TOKEN_VERIFIER,
      useClass: FirebaseKoliOneTokenVerifierService,
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: PostgresAuthRepository,
    },
  ],
  exports: [AuthService, CsrfService, SessionAuthGuard, CsrfGuard, RolesGuard],
})
export class AuthModule {}
