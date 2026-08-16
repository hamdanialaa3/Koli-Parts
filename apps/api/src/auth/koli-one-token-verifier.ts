import type { KoliOneIdentity } from './auth.types';

export const KOLI_ONE_TOKEN_VERIFIER = Symbol('KOLI_ONE_TOKEN_VERIFIER');

export interface KoliOneTokenVerifier {
  verify(assertion: string): Promise<KoliOneIdentity>;
}
