# Quality Gate Estrito Anti-Mojibake e Conformidade Institucional — Deo Magalhães
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir

$errorCount = 0

function Report-Error($msg) {
    Write-Host "[FALHA CRÍTICA] $msg" -ForegroundColor Red
    $global:errorCount++
}

function Report-Success($msg) {
    Write-Host "[OK] $msg" -ForegroundColor Green
}

Write-Host "Iniciando Quality Gate de Conformidade e Anti-Mojibake..." -ForegroundColor Cyan

# 1. Checagem Anti-Mojibake em TODOS os arquivos HTML, JS e MD do repositório
$mojibakePattern = '[\u00C0-\u00C3][\u0080-\u00BF]'
$filesToScan = Get-ChildItem -Path $repoDir -Include *.html,*.js,*.md -Recurse | Where-Object {
    $_.FullName -notmatch '\\\.git\\' -and 
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\scratch\\'
}

$mojibakeCount = 0
foreach ($f in $filesToScan) {
    $txt = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $matches = [regex]::Matches($txt, $mojibakePattern)
    if ($matches.Count -gt 0) {
        Report-Error "$($f.FullName.Replace($repoDir, '')) contém $($matches.Count) ocorrências de mojibake!"
        $mojibakeCount++
    }
}

if ($mojibakeCount -eq 0) {
    Report-Success "Varredura Anti-Mojibake: 0 caracteres corrompidos em $($filesToScan.Count) arquivos."
}

# 2. Checagem Proibição "Dr. Deo"
$drDeoCount = 0
foreach ($f in $filesToScan) {
    $txt = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    if ($txt -match 'Dr\.\s*Deo' -or $txt -match 'Dr\s+Deo') {
        Report-Error "$($f.FullName.Replace($repoDir, '')) contém menção proibida a 'Dr. Deo'!"
        $drDeoCount++
    }
}
if ($drDeoCount -eq 0) {
    Report-Success "Identidade e Autoridade: Zero menções a 'Dr. Deo'."
}

# 3. Checagem de Estrutura dos Artigos e Testes da Esteira Recente
$esteiraArticles = @(
    "artigos\neurobiologia-autocompaixao-gentileza-amigdala.html",
    "testes\teste-autocompaixao.html",
    "artigos\sistema-glinfatico-sono-profundo-limpeza-cerebral.html",
    "testes\teste-assertividade.html",
    "artigos\neurobiologia-perdao-magoa-ressentimento-estresse.html",
    "testes\teste-sensibilidade-sensorial.html",
    "artigos\cerebro-fragmentado-troca-tarefas-residuo-atencao.html",
    "artigos\neurobiologia-motivacao-dopamina-tonica-fasica.html",
    "artigos\mente-hiperalerta-trauma-precoce-neurodesenvolvimento.html",
    "artigos\neuroinflamacao-microbiota-eixo-intestino-cerebro.html",
    "artigos\neurobiologia-empatia-teoria-da-mente-contagio-emocional.html",
    "artigos\flexibilidade-psicologica-neuroplasticidade-act.html",
    "artigos\neurobiologia-ansiedade-social-vergonha-julgamento.html"
)

foreach ($relPath in $esteiraArticles) {
    $full = Join-Path $repoDir $relPath
    if (Test-Path $full) {
        $txt = [System.IO.File]::ReadAllText($full, [System.Text.Encoding]::UTF8)
        if ($relPath -like 'artigos\*') {
            if ($txt -notmatch 'class="[^"]*container\s+article-container[^"]*"') {
                Report-Error "Artigo $relPath não possui 'container article-container'!"
            }
        }
        if ($txt -notmatch 'footer-grid') {
            Report-Error "Arquivo $relPath não possui 'footer-grid' no rodapé!"
        }
    }
}
Report-Success "Artigos e Testes da Esteira: Todos os arquivos validados com container e rodapé em conformidade."

# 4. Checagem de Chaves no Studio Gerador (social/gerador.html)
$geradorPath = Join-Path $repoDir "social\gerador.html"
if (Test-Path $geradorPath) {
    $gTxt = [System.IO.File]::ReadAllText($geradorPath, [System.Text.Encoding]::UTF8)
    $openBraces = ([regex]::Matches($gTxt, '\{')).Count
    $closeBraces = ([regex]::Matches($gTxt, '\}')).Count
    if ($openBraces -ne $closeBraces) {
        Report-Error "social/gerador.html com chaves desbalanceadas: { = $openBraces, } = $closeBraces"
    } else {
        Report-Success "social/gerador.html: $openBraces chaves balanceadas com perfeição."
    }
}

# 5. Blindagem de Taxonomia Estrita de Pastas
$artigosDir = Join-Path $repoDir "artigos"
$artigoTests = Get-ChildItem -Path $artigosDir -Filter "teste-*.html"
foreach ($at in $artigoTests) {
    $txt = [System.IO.File]::ReadAllText($at.FullName, [System.Text.Encoding]::UTF8)
    if (-not $txt.Contains('http-equiv="refresh"')) {
        Report-Error "Taxonomia violada: O arquivo $($at.Name) está em artigos/ mas é um teste e não um stub de redirecionamento!"
    }
}

$recursosDir = Join-Path $repoDir "recursos"
$recursoJogos = Get-ChildItem -Path $recursosDir -Filter "*jogo*.html"
foreach ($rj in $recursoJogos) {
    $txt = [System.IO.File]::ReadAllText($rj.FullName, [System.Text.Encoding]::UTF8)
    if (-not $txt.Contains('http-equiv="refresh"')) {
        Report-Error "Taxonomia violada: O arquivo $($rj.Name) está em recursos/ mas é um jogo e não um stub de redirecionamento!"
    }
}
Report-Success "Blindagem de Taxonomia: Pastas artigos/, testes/, jogos/ e recursos/ estritamente segregadas."

$finalColor = if ($errorCount -eq 0) { "Green" } else { "Red" }
Write-Host "Quality Gate Finalizado. Total de Erros: $errorCount" -ForegroundColor $finalColor
exit $errorCount
