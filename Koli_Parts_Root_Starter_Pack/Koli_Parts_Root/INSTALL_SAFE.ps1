param(
  [string]$TargetRoot = 'C:\Users\hamda\Desktop\Koli_Parts_Root'
)

$ErrorActionPreference = 'Stop'
$SourceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $TargetRoot ".starter-backup\$stamp"

if (-not (Test-Path $TargetRoot)) { New-Item -ItemType Directory -Force -Path $TargetRoot | Out-Null }

$files = Get-ChildItem -Path $SourceRoot -Recurse -File | Where-Object {
  $_.FullName -notlike "*\.starter-backup\*" -and $_.Name -ne 'INSTALL_SAFE.ps1'
}

foreach ($file in $files) {
  $relative = $file.FullName.Substring($SourceRoot.Length).TrimStart('\')
  $dest = Join-Path $TargetRoot $relative
  $destDir = Split-Path -Parent $dest
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null

  if (Test-Path $dest) {
    $backupPath = Join-Path $backup $relative
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backupPath) | Out-Null
    Copy-Item $dest $backupPath -Force
  }
  Copy-Item $file.FullName $dest -Force
}

Write-Host "Starter pack copied. Existing overwritten files were backed up to: $backup"
Write-Host 'Review git diff before committing.'
