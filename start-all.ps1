# start-all.ps1
# Starts all services - each in its own new terminal window.
# Run this from the root of the monorepo.

$root = $PSScriptRoot

# -- Service definitions --------------------------------------------------------
# Format: @{ Name; Path; Command; Port }
$services = @(
    @{
        Name    = "mainService (NestJS)"
        Path    = Join-Path $root "backend\mainService"
        Command = "npm run start:dev"
        Port    = 3000
    },
    @{
        Name    = "sideServiceOne (NestJS)"
        Path    = Join-Path $root "backend\sideServiceOne"
        Command = "npm run start:dev"
        Port    = 3001
    },
    @{
        Name    = "sideServiceTwo (NestJS)"
        Path    = Join-Path $root "backend\sideServiceTwo"
        Command = "npm run start:dev"
        Port    = 3002
    },
    @{
        Name    = "frontend (Vite)"
        Path    = Join-Path $root "frontend"
        Command = "npm run dev"
        Port    = 5173
    }
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting all services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

foreach ($svc in $services) {
    $title  = $svc.Name
    $dir    = $svc.Path
    $cmd    = $svc.Command
    $port   = $svc.Port

    if (-not (Test-Path $dir)) {
        Write-Host "[SKIP] '$title' - directory not found: $dir" -ForegroundColor Red
        continue
    }

    Write-Host "[START] $title  -->  http://localhost:$port" -ForegroundColor Yellow

    # Open a new PowerShell window and run the command inside it
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$dir'; Write-Host 'Starting $title on port $port...' -ForegroundColor Cyan; $cmd"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All services launched!" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor DarkGray
Write-Host "  Frontend       http://localhost:5173" -ForegroundColor Green
Write-Host "  mainService    http://localhost:3000" -ForegroundColor Green
Write-Host "  sideServiceOne http://localhost:3001" -ForegroundColor Green
Write-Host "  sideServiceTwo http://localhost:3002" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
