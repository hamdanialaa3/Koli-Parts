import fs from 'node:fs';

const requiredFiles = [
  'PROJECT_SPEC.md',
  'openapi.yaml',
  'db/migrations/001_initial_schema.sql',
  'docker-compose.yml',
  'docs/EBAY_FEASIBILITY_MATRIX.md',
  'docs/AUTH_SSO.md',
  'packages/contracts/src/supplier.ts',
  'packages/design-system/src/tokens.css',
];

let failed = false;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`MISSING: ${file}`);
    failed = true;
  }
}

const env = fs.existsSync('.env.example') ? fs.readFileSync('.env.example', 'utf8') : '';
for (const key of ['DATABASE_URL','REDIS_URL','EBAY_CLIENT_ID','EBAY_AUTOMATED_ORDERING','STRIPE_SECRET_KEY']) {
  if (!env.includes(`${key}=`)) {
    console.error(`.env.example missing ${key}`);
    failed = true;
  }
}

if (env.match(/ECONT_PASSWORD=\S+/)?.[0] && !env.includes('ECONT_PASSWORD=\n')) {
  const line = env.split(/\r?\n/).find(l => l.startsWith('ECONT_PASSWORD='));
  if (line && line !== 'ECONT_PASSWORD=') console.warn('WARNING: ECONT_PASSWORD is non-empty in .env.example');
}

if (failed) process.exit(1);
console.log('Koli Parts starter configuration: OK');
