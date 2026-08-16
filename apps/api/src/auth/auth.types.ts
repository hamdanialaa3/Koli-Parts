export type KoliOneIdentity = {
  provider: 'firebase';
  subject: string;
  issuer: string;
  audience: string;
  email?: string;
  emailVerified: boolean;
  claims: Record<string, unknown>;
};

export type AuthenticatedUser = {
  userId: string;
  preferredLanguage: 'bg' | 'en';
  roles: string[];
};

export type IssuedSession = {
  token: string;
  expiresAt: Date;
};
