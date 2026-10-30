# Instalação da Tarefa Agendada Persistente no Windows (Task Scheduler)
# Executa a esteira a cada 12 horas (8h da manhã e 20h) mesmo após reiniciar o computador
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir
$workerScript = Join-Path $scriptDir "executar-esteira-autonoma.ps1"

$taskName = "DeoMagalhaes_EsteiraContinua"

Write-Host "Configurando Tarefa Agendada do Windows: $taskName..." -ForegroundColor Cyan

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$workerScript`""
$t1 = New-ScheduledTaskTrigger -Daily -At 8:00am
$t2 = New-ScheduledTaskTrigger -Daily -At 8:00pm
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $t1, $t2 -Settings $settings -Force
Write-Host "[OK] Tarefa Agendada '$taskName' registrada com sucesso no Windows!" -ForegroundColor Green
Write-Host "Frequência: a cada 12 horas (08:00 e 20:00)" -ForegroundColor Green
Write-Host "Persistência: Ativa permanentemente, mesmo após reiniciar o computador." -ForegroundColor Green
