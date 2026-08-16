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

export type AuthenticatedRequest = {
  headers: {
    cookie?: string;
    'x-csrf-token'?: string | string[];
  };
  authUser?: AuthenticatedUser;
  sessionToken?: string;
};

export type IssuedSession = {
  token: string;
  expiresAt: Date;
};
