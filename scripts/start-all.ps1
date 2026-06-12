param(
    [switch]$NoFrontend,
    [switch]$NoBuild
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Gestion Convocatorias - Inicio completo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# La carpeta raíz del proyecto
$projectRoot = Split-Path $PSScriptRoot -Parent

# Cargar variables de entorno
$envScript = Join-Path $PSScriptRoot "load-env.ps1"

if (Test-Path $envScript) {
    . $envScript
} else {
    Write-Warning "No se encontró load-env.ps1 en: $envScript"
}

Write-Host "Project Root: $projectRoot" -ForegroundColor Gray

$services = @(
    @{Name="ms-usuarios";      Port=8080; Dir="ms-usuarios"}
    @{Name="ms-convocatorias"; Port=8081; Dir="ms-convocatorias"}
    @{Name="ms-postulaciones"; Port=8082; Dir="ms-postulaciones"}
    @{Name="api-gateway";      Port=8083; Dir="api-gateway"}
)

$processes = @()

foreach ($svc in $services) {

    $svcDir = Join-Path $projectRoot $svc.Dir
    $mvnw = Join-Path $svcDir "mvnw.cmd"

    Write-Host ""
    Write-Host "Iniciando $($svc.Name) en el puerto $($svc.Port)..." -ForegroundColor Yellow
    Write-Host "Ruta: $svcDir" -ForegroundColor Gray

    if (-not (Test-Path $svcDir)) {
        Write-Host "  ERROR: No existe la carpeta $svcDir" -ForegroundColor Red
        continue
    }

    if (-not (Test-Path $mvnw)) {
        Write-Host "  ERROR: No existe mvnw.cmd en $svcDir" -ForegroundColor Red
        continue
    }

    try {
        $proc = Start-Process `
            -FilePath $mvnw `
            -ArgumentList "spring-boot:run" `
            -WorkingDirectory $svcDir `
            -WindowStyle Hidden `
            -PassThru

        $processes += $proc

        Write-Host "  PID: $($proc.Id)" -ForegroundColor Green
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Esperando que los servicios backend inicien..." -ForegroundColor Yellow
Write-Host "(aproximadamente 30 segundos para la primera vez)" -ForegroundColor Gray

Start-Sleep -Seconds 30

Write-Host ""
Write-Host "Verificando servicios..." -ForegroundColor Yellow

foreach ($svc in $services) {
    try {
        Invoke-WebRequest `
            -Uri "http://localhost:$($svc.Port)/" `
            -TimeoutSec 3 `
            -ErrorAction Stop | Out-Null

        Write-Host "  [OK] $($svc.Name) en http://localhost:$($svc.Port)" -ForegroundColor Green
    }
    catch {
        Write-Host "  [--] $($svc.Name) (aún iniciando o sin endpoint raíz)" -ForegroundColor DarkYellow
    }
}

if (-not $NoFrontend) {

    $frontendDir = Join-Path $projectRoot "frontend"

    Write-Host ""
    Write-Host "Iniciando frontend Angular..." -ForegroundColor Yellow
    Write-Host "Ruta: $frontendDir" -ForegroundColor Gray

    if (-not (Test-Path $frontendDir)) {
        Write-Host "ERROR: No existe la carpeta frontend" -ForegroundColor Red
        exit 1
    }

    Push-Location $frontendDir

    try {

        if (-not (Test-Path "node_modules")) {
            Write-Host "Instalando dependencias..." -ForegroundColor Yellow
            npm install
        }

        npm start
    }
    finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Aplicacion en ejecucion" -ForegroundColor Cyan
Write-Host " Frontend : http://localhost:4200" -ForegroundColor Green
Write-Host " Gateway  : http://localhost:8083" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan