$ErrorActionPreference = 'Stop'
Write-Host 'Starting Koli Parts local dependencies...'
docker compose up -d postgres redis meilisearch
Write-Host 'Waiting briefly for health checks...'
Start-Sleep -Seconds 5
node .\scripts\verify-config.mjs
Write-Host 'Then run your existing repo commands (for example npm run dev).'
