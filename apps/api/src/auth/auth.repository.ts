import { createHash, randomBytes } from 'node:crypto';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';
import type { Config } from '../config.schema';
import type {
  AuthenticatedUser,
  IssuedSession,
  KoliOneIdentity,
} from './auth.types';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export interface AuthRepository {
  upsertExternalIdentity(identity: KoliOneIdentity): Promise<AuthenticatedUser>;
  issueSession(userId: string): Promise<IssuedSession>;
  findSession(token: string): Promise<AuthenticatedUser | null>;
  revokeSession(token: string): Promise<void>;
}

@Injectable()
export class PostgresAuthRepository implements AuthRepository, OnModuleDestroy {
  private readonly pool: Pool;
  private readonly sessionTtlSeconds: number;

  constructor(private readonly configService: ConfigService<Config, true>) {
    this.pool = new Pool({
      connectionString: this.configService.get('DATABASE_URL', { infer: true }),
    });
    this.sessionTtlSeconds = this.configService.get('SESSION_TTL_SECONDS', {
      infer: true,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  async upsertExternalIdentity(
    identity: KoliOneIdentity,
  ): Promise<AuthenticatedUser> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const existing = await client.query<{ user_id: string }>(
        `SELECT user_id
           FROM external_identities
          WHERE provider = $1 AND provider_subject = $2 AND deleted_at IS NULL
          FOR UPDATE`,
        [identity.provider, identity.subject],
      );

      let userId = existing.rows[0]?.user_id;
      if (!userId) {
        userId = await this.findOrCreateUser(client, identity);
      }

      await client.query(
        `INSERT INTO external_identities
          (user_id, provider, provider_subject, issuer, audience, email,
           email_verified, claims, last_login_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, now())
         ON CONFLICT (provider, provider_subject)
         DO UPDATE SET
           issuer = EXCLUDED.issuer,
           audience = EXCLUDED.audience,
           email = EXCLUDED.email,
           email_verified = EXCLUDED.email_verified,
           claims = EXCLUDED.claims,
           last_login_at = now()
         RETURNING user_id`,
        [
          userId,
          identity.provider,
          identity.subject,
          identity.issuer,
          identity.audience,
          identity.email ?? null,
          identity.emailVerified,
          JSON.stringify(identity.claims),
        ],
      );
      await client.query('COMMIT');
      return this.getAuthenticatedUser(userId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async issueSession(userId: string): Promise<IssuedSession> {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + this.sessionTtlSeconds * 1000);
    await this.pool.query(
      `INSERT INTO auth_sessions (user_id, session_token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, this.hashToken(token), expiresAt],
    );
    return { token, expiresAt };
  }

  async findSession(token: string): Promise<AuthenticatedUser | null> {
    const result = await this.pool.query<{ user_id: string }>(
      `UPDATE auth_sessions
          SET last_seen_at = now()
        WHERE session_token_hash = $1
          AND revoked_at IS NULL
          AND expires_at > now()
        RETURNING user_id`,
      [this.hashToken(token)],
    );

    const userId = result.rows[0]?.user_id;
    return userId ? this.getAuthenticatedUser(userId) : null;
  }

  async revokeSession(token: string): Promise<void> {
    await this.pool.query(
      `UPDATE auth_sessions
          SET revoked_at = now()
        WHERE session_token_hash = $1 AND revoked_at IS NULL`,
      [this.hashToken(token)],
    );
  }

  private async findOrCreateUser(
    client: PoolClient,
    identity: KoliOneIdentity,
  ): Promise<string> {
    if (identity.email && identity.emailVerified) {
      const existingUser = await client.query<{ id: string }>(
        `SELECT id FROM users
          WHERE lower(email) = lower($1) AND deleted_at IS NULL
          FOR UPDATE`,
        [identity.email],
      );

      if (existingUser.rows[0]) {
        return existingUser.rows[0].id;
      }
    }

    const created = await client.query<{ id: string }>(
      `INSERT INTO users (email, preferred_language)
       VALUES ($1, 'bg')
       RETURNING id`,
      [identity.emailVerified ? (identity.email ?? null) : null],
    );
    return created.rows[0].id;
  }

  private async getAuthenticatedUser(
    userId: string,
  ): Promise<AuthenticatedUser> {
    const result = await this.pool.query<{
      id: string;
      preferred_language: 'bg' | 'en';
      roles: string[] | null;
    }>(
      `SELECT u.id,
              u.preferred_language,
              COALESCE(array_agg(ur.role_key) FILTER (WHERE ur.role_key IS NOT NULL), '{}') AS roles
         FROM users u
         LEFT JOIN user_roles ur
           ON ur.user_id = u.id AND ur.revoked_at IS NULL
        WHERE u.id = $1 AND u.deleted_at IS NULL
        GROUP BY u.id`,
      [userId],
    );

    const user = result.rows[0];
    if (!user) {
      throw new Error('Authenticated user record was not found');
    }

    return {
      userId: user.id,
      preferredLanguage: user.preferred_language,
      roles: user.roles ?? [],
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
