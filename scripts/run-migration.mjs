import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const databaseUrl = process.env.DATABASE_URL;
const migrationsDir = resolve('db/migrations');

if (!databaseUrl) {
  console.error('DATABASE_URL is required to run migrations.');
  process.exit(1);
}

if (!existsSync(migrationsDir)) {
  console.error(`Migrations directory not found: ${migrationsDir}`);
  process.exit(1);
}

const migrationFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

if (migrationFiles.length === 0) {
  console.error(`No SQL migration files found in ${migrationsDir}`);
  process.exit(1);
}

for (const file of migrationFiles) {
  const migrationPath = join(migrationsDir, file);
  const result = spawnSync(
    'psql',
    [databaseUrl, '-v', 'ON_ERROR_STOP=1', '-f', migrationPath],
    {
      stdio: 'inherit',
      shell: false,
    },
  );

  if (result.error) {
    console.error(`Failed to execute psql for ${file}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
