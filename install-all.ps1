# install-all.ps1
# Finds every package.json in the repo and runs `npm install` in that directory.

$root = $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installing dependencies for all projects" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find all package.json files, excluding node_modules directories
$packageFiles = Get-ChildItem -Path $root -Recurse -Filter "package.json" |
    Where-Object { $_.FullName -notmatch "\\node_modules\\" }

foreach ($pkg in $packageFiles) {
    $dir = $pkg.DirectoryName
    $relativePath = $dir.Replace($root, "").TrimStart("\")

    Write-Host "[INSTALL] $relativePath" -ForegroundColor Yellow
    Write-Host "  Path: $dir" -ForegroundColor DarkGray

    Push-Location $dir
    npm install
    $exitCode = $LASTEXITCODE
    Pop-Location

    if ($exitCode -eq 0) {
        Write-Host "  [OK] Done" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Exit code: $exitCode" -ForegroundColor Red
    }

    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All installations complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
