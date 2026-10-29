# Motor de Execução Autônoma de Esteiras Contínuas — Deo Magalhães
# Executado a cada 2 horas via Agendador de Tarefas do Windows (Task Scheduler)
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir

$logFile = Join-Path $repoDir "logs\esteira-execucoes.log"
$lockFile = Join-Path $repoDir "logs\esteira.lock"

function Log-Message($msg) {
    $time = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $line = "[$time] $msg"
    Write-Host $line
    [System.IO.File]::AppendAllText($logFile, "$line`r`n", [System.Text.Encoding]::UTF8)
}

# 1. Controle de Concorrência
if (Test-Path $lockFile) {
    $lockTime = (Get-Item $lockFile).LastWriteTime
    if ((Get-Date) - $lockTime -lt (New-TimeSpan -Minutes 45)) {
        Log-Message "AVISO: Esteira anterior ainda em execução ou lock ativo. Abortando execução concorrente."
        exit 0
    } else {
        Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
    }
}

New-Item -ItemType File -Path $lockFile -Force | Out-Null

try {
    Log-Message "=================================================="
    Log-Message "Iniciando ciclo autônomo da esteira contínua..."
    
    Set-Location $repoDir
    
    # 2. Sincronizar repositório local com a nuvem
    git pull origin main --quiet
    
    # 3. Ler esteiras-programacao.md e identificar o próximo lote
    $esteiraPath = Join-Path $repoDir "esteiras-programacao.md"
    $esteiraTxt = [System.IO.File]::ReadAllText($esteiraPath, [System.Text.Encoding]::UTF8)
    
    $proximoMatch = [regex]::Match($esteiraTxt, '\|\s*\*\*Lote (\d+)\*\*\s*\|\s*\*\*([^\*]+)\*\*:?([^\*\|]+)?\|\s*([^\|]+)\|\s*\*\*([^\*]+)\*\*:?([^\|]+)?\|\s*\*\*([^\*]+)\*\*:?([^\|]+)?\|\s*⏳\s*\*\*Próximo da Fila\*\*')
    
    if (-not $proximoMatch.Success) {
        # Tentar regex mais tolerante
        $proximoMatch = [regex]::Match($esteiraTxt, '\|\s*\*\*Lote (\d+)\*\*\s*\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|\s*⏳\s*\*\*Próximo da Fila\*\*')
    }
    
    if (-not $proximoMatch.Success) {
        Log-Message "Nenhum lote pendente com status 'Próximo da Fila' encontrado. Esteira em dia!"
        exit 0
    }
    
    $loteNum = [int]$proximoMatch.Groups[1].Value
    Log-Message "Lote selecionado para produção: Lote $loteNum"
    
    # 4. Executar Quality Gate prévio
    $qGateScript = Join-Path $repoDir "scripts\check-quality-gate.ps1"
    if (Test-Path $qGateScript) {
        & powershell.exe -ExecutionPolicy Bypass -File $qGateScript
        if ($LASTEXITCODE -ne 0) {
            throw "Quality Gate prévio falhou com código $LASTEXITCODE. Abortando esteira."
        }
    }
    
    Log-Message "Ciclo de verificação concluído. Ambiente preparado para execução contínua."

} catch {
    Log-Message "ERRO CRÍTICO NA ESTEIRA: $_"
} finally {
    Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
    Log-Message "Ciclo autônomo finalizado."
    Log-Message "=================================================="
}
