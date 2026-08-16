import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const databaseUrl = process.env.DATABASE_URL;
const migrationPath = resolve('db/migrations/001_initial_schema.sql');

if (!databaseUrl) {
  console.error('DATABASE_URL is required to run migrations.');
  process.exit(1);
}

if (!existsSync(migrationPath)) {
  console.error(`Migration file not found: ${migrationPath}`);
  process.exit(1);
}

const result = spawnSync(
  'psql',
  [databaseUrl, '-v', 'ON_ERROR_STOP=1', '-f', migrationPath],
  {
    stdio: 'inherit',
    shell: false,
  },
);

if (result.error) {
  console.error(`Failed to execute psql: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
