# Instalação da Tarefa Agendada Persistente no Windows (Task Scheduler)
# Executa a esteira a cada 2 horas mesmo após reiniciar o computador
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir
$workerScript = Join-Path $scriptDir "executar-esteira-autonoma.ps1"

$taskName = "DeoMagalhaes_EsteiraContinua"

Write-Host "Configurando Tarefa Agendada do Windows: $taskName..." -ForegroundColor Cyan

# Comando completo para o Windows executar em background silencioso
$actionCmd = "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$workerScript`""

# Registrar via schtasks.exe (nativa e universal no Windows 10/11)
# /sc minute /mo 120 = a cada 120 minutos (2 horas)
# /f = força sobrescrita se já existir
$schtasksArgs = "/Create /TN `"$taskName`" /TR `"$actionCmd`" /SC MINUTE /MO 120 /F"

$p = Start-Process -FilePath "schtasks.exe" -ArgumentList $schtasksArgs -Wait -NoNewWindow -PassThru

if ($p.ExitCode -eq 0) {
    Write-Host "[OK] Tarefa Agendada '$taskName' criada com sucesso no Windows!" -ForegroundColor Green
    Write-Host "Frequência: a cada 2 horas (120 minutos)" -ForegroundColor Green
    Write-Host "Persistência: Ativa permanentemente, mesmo após reiniciar o computador." -ForegroundColor Green
    
    # Exibir detalhes da tarefa
    schtasks.exe /Query /TN "$taskName" /FO LIST
} else {
    Write-Host "[AVISO] Tentando registro via Register-ScheduledTask (PowerShell Cmdlet)..." -ForegroundColor Yellow
    
    $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$workerScript`""
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 2)
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force
    Write-Host "[OK] Tarefa Agendada registrada com sucesso via Cmdlet!" -ForegroundColor Green
}
