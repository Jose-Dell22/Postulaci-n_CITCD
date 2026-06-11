# Configura Java 21 y carga variables desde .env (raíz del proyecto).
# Uso: . .\scripts\load-env.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

. "$scriptDir\set-java.ps1"

$envFile = Join-Path $projectRoot ".env"
if (-not (Test-Path $envFile)) {
    Write-Warning "No existe .env en la raíz del proyecto. Copie .env.example a .env y complete DB_PASSWORD."
    return
}

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith('#')) { return }
    $eq = $line.IndexOf('=')
    if ($eq -lt 1) { return }
    $name = $line.Substring(0, $eq).Trim()
    $value = $line.Substring($eq + 1).Trim()
    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
        $value = $value.Substring(1, $value.Length - 2)
    }
    Set-Item -Path "Env:$name" -Value $value
}

Write-Host "Variables de entorno cargadas desde $envFile"
