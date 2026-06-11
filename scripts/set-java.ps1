# Configura JAVA_HOME para Java 21+ (requerido por Spring Boot 3.5).
# Uso: . .\scripts\set-java.ps1

function Get-JavaMajorVersion {
    param([string]$JavaExe)
    $output = & $JavaExe -version 2>&1 | Out-String
    if ($output -match 'version "1\.(\d+)') {
        return [int]$Matches[1]
    }
    if ($output -match 'version "(\d+)') {
        return [int]$Matches[1]
    }
    return 0
}

if ($env:JAVA_HOME -and (Test-Path "$env:JAVA_HOME\bin\java.exe")) {
    $currentMajor = Get-JavaMajorVersion "$env:JAVA_HOME\bin\java.exe"
    if ($currentMajor -ge 21) {
        Write-Host "JAVA_HOME ya apunta a Java ${currentMajor} en $env:JAVA_HOME"
        return
    }
    Write-Warning "JAVA_HOME apunta a Java ${currentMajor} (se requiere 21+). Buscando JDK 21..."
}

$searchPaths = @(
    "C:\Program Files\Eclipse Adoptium\jdk-21*",
    "C:\Program Files\Java\jdk-21*",
    "C:\Program Files\Microsoft\jdk-21*",
    "C:\Program Files\Eclipse Adoptium\jdk-22*",
    "C:\Program Files\Java\jdk-22*"
)

$jdk = $null
foreach ($pattern in $searchPaths) {
    $jdk = Get-ChildItem $pattern -Directory -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending |
        Select-Object -First 1
    if ($jdk) { break }
}

if (-not $jdk) {
    throw "No se encontró JDK 21+. Instale Java 21 y vuelva a ejecutar este script."
}

$env:JAVA_HOME = $jdk.FullName
if ($env:Path -notlike "*$($env:JAVA_HOME)\bin*") {
    $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}

Write-Host "JAVA_HOME configurado a Java 21+ en $env:JAVA_HOME"
& "$env:JAVA_HOME\bin\java.exe" -version
