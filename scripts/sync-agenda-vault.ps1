# Sincronizador de Agendamentos do Google Calendar para o Nexus Vault
# Deo Magalhaes - Neuropsicologia Clinica
# Local: scripts/sync-agenda-vault.ps1

param(
    [string]$CalendarId = "f518acb6bf4c0e38b2ae92bc8c85c007c9bcf00592b97233c53bfcbfbec2dcdd@group.calendar.google.com",
    [int]$MonthsBack = 3,
    [int]$MonthsForward = 2
)

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir
$cacheDir = Join-Path $repoDir "nexus-vault\data"
$outputFile = Join-Path $cacheDir "agenda-cache.json"

if (-not (Test-Path $cacheDir)) {
    New-Item -ItemType Directory -Force -Path $cacheDir | Out-Null
}

# 1. Definir intervalo de datas (RFC3339)
$now = Get-Date
$startDate = (Get-Date -Year $now.Year -Month $now.Month -Day 1).AddMonths(-$MonthsBack)
$endDate = (Get-Date -Year $now.Year -Month $now.Month -Day 1).AddMonths($MonthsForward + 1).AddSeconds(-1)

$startIso = $startDate.ToString("yyyy-MM-01T00:00:00Z")
$endIso = $endDate.ToString("yyyy-MM-ddTHH:mm:ssZ")

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Sincronizando Google Agenda com o Nexus Vault" -ForegroundColor Cyan
Write-Host " Periodo: $startIso ate $endIso" -ForegroundColor Gray
Write-Host " Calendario: $CalendarId" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# 2. Executar gcalendar CLI
try {
    # Garante gcalendar no PATH se necessario
    $gcalCmd = "gcalendar"
    if (-not (Get-Command "gcalendar" -ErrorAction SilentlyContinue)) {
        $skillCmd = "C:\Users\PC\.gemini\config\plugins\gcalendar\skills\gcalendar\scripts\gcalendar.cmd"
        if (Test-Path $skillCmd) {
            & $skillCmd --version | Out-Null
        }
    }

    $rawJson = gcalendar readonly events --cal $CalendarId --start $startIso --end $endIso --max 500 --json 2>$null
    if (-not $rawJson) {
        Write-Host "Tentando busca sem filtro de datas estrito..." -ForegroundColor Yellow
        $rawJson = gcalendar readonly events --cal $CalendarId --max 500 --json 2>$null
    }

    if (-not $rawJson) {
        throw "Nenhum dado retornado pela CLI gcalendar."
    }

    $events = $rawJson | ConvertFrom-Json
} catch {
    Write-Host "[ERRO] Falha ao consultar o Google Calendar: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Sucesso: $($events.Count) eventos encontrados no periodo." -ForegroundColor Green

# 3. Estruturar e Higienizar os Dados
$cleanedEvents = @()

foreach ($ev in $events) {
    if (-not $ev.summary -or $ev.status -eq 'cancelled') {
        continue
    }

    $title = $ev.summary.Trim()
    $startStr = if ($ev.start.dateTime) { $ev.start.dateTime } else { $ev.start.date }
    $endStr = if ($ev.end.dateTime) { $ev.end.dateTime } else { $ev.end.date }

    $cleanedEvents += [PSCustomObject]@{
        id = $ev.id
        summary = $title
        start = $startStr
        end = $endStr
        status = $ev.status
        htmlLink = $ev.htmlLink
        recurringId = $ev.recurringEventId
    }
}

# 4. Consolidar Metadados e Payload
$payload = [PSCustomObject]@{
    version = "1.0.0"
    lastSyncedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:sszzz")
    calendarId = $CalendarId
    totalEvents = $cleanedEvents.Count
    events = $cleanedEvents
}

$jsonOutput = $payload | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($outputFile, $jsonOutput, [System.Text.UTF8Encoding]::new($false))

# Grava tambem agenda-seed.js para acesso imediato no navegador sem restricao de CORS em file://
$seedFile = Join-Path $cacheDir "agenda-seed.js"
$seedJs = "window.__VAULT_AGENDA_SEED__ = $jsonOutput;"
[System.IO.File]::WriteAllText($seedFile, $seedJs, [System.Text.UTF8Encoding]::new($false))

Write-Host "Arquivo gravado com sucesso: $outputFile" -ForegroundColor Green
Write-Host "Seed JS gravado com sucesso: $seedFile" -ForegroundColor Green
Write-Host "Total de sessoes registradas: $($cleanedEvents.Count)" -ForegroundColor Green

# 5. Exibir Resumo de Atendimentos Agrupados
Write-Host "`nResumo de Pacientes / Sessoes encontradas:" -ForegroundColor Cyan
$cleanedEvents | Group-Object summary | Select-Object Count, Name | Sort-Object Count -Descending | Format-Table -AutoSize
