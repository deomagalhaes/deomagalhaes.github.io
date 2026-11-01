# Quality Gate Incremental (Producao Atual) e Conformidade Institucional - Deo Magalhaes
# Uso padrao (rapido, apenas arquivos novos/modificados no Git):
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1
# Uso completo sob demanda (varre todo o acervo historico):
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1 -Full

param(
    [switch]$Full
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

$errorCount = 0

function Report-Error($msg) {
    Write-Host "[FALHA CRITICA] $msg" -ForegroundColor Red
    $global:errorCount++
}

function Report-Success($msg) {
    Write-Host "[OK] $msg" -ForegroundColor Green
}

# Coleta de arquivos alvo: Incremental (Git) por padrao, ou Completo (-Full)
$targetFiles = @()

if ($Full) {
    Write-Host "Iniciando Quality Gate COMPLETO (-Full) em todo o repositorio..." -ForegroundColor Cyan
    $targetFiles = Get-ChildItem -Path $repoDir -Include *.html,*.js,*.md -Recurse | Where-Object {
        $_.FullName -notmatch '\\\.git\\' -and
        $_.FullName -notmatch '\\node_modules\\' -and
        $_.FullName -notmatch '\\scratch\\'
    }
} else {
    Write-Host "Iniciando Quality Gate INCREMENTAL (apenas producao atual)..." -ForegroundColor Cyan
    Push-Location $repoDir
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $staged = @(git -c core.quotepath=false -c core.safecrlf=false diff --cached --name-only --diff-filter=ACMR 2>$null)
        $unstaged = @(git -c core.quotepath=false -c core.safecrlf=false diff --name-only --diff-filter=ACMR 2>$null)
        $untracked = @(git -c core.quotepath=false ls-files --others --exclude-standard 2>$null)
        $relPaths = @($staged + $unstaged + $untracked) | Where-Object { $_ -and $_.Trim() -ne '' } | Select-Object -Unique
    } finally {
        $ErrorActionPreference = $prevEap
        Pop-Location
    }

    foreach ($rel in $relPaths) {
        $normRel = $rel -replace '/', '\'
        if ($normRel -match '(\.html|\.js|\.md)$' -and $normRel -notmatch '^(\.git|node_modules|scratch)\\') {
            $fullPath = Join-Path $repoDir $normRel
            if (Test-Path -LiteralPath $fullPath) {
                $targetFiles += Get-Item -LiteralPath $fullPath
            }
        }
    }

    if ($targetFiles.Count -eq 0) {
        $stopwatch.Stop()
        Report-Success "Nenhum arquivo .html/.js/.md novo ou modificado na producao atual ($($stopwatch.ElapsedMilliseconds) ms). Use -Full para auditar todo o acervo."
        exit 0
    }
    Write-Host " -> Analisando $($targetFiles.Count) arquivo(s) novo(s)/modificado(s)..." -ForegroundColor DarkCyan
}

$htmlTargets = @($targetFiles | Where-Object { $_.Extension -eq '.html' })

# 1. Checagem Anti-Mojibake e 2. Proibicao "Dr. Deo"
$mojibakePattern = '[\u00C0-\u00C3][\u0080-\u00BF]'
$mojibakeCount = 0
$drDeoCount = 0

foreach ($f in $targetFiles) {
    $txt = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $rel = $f.FullName.Replace($repoDir, '')

    $foundMatches = [regex]::Matches($txt, $mojibakePattern)
    if ($foundMatches.Count -gt 0) {
        Report-Error "$rel contem $($foundMatches.Count) ocorrencias de mojibake!"
        $mojibakeCount++
    }

    if ($f.Name -ne 'check-quality-gate.ps1' -and $f.FullName -notmatch '\\\.agents\\rules\\') {
        if ($txt -match 'Dr\.\s*Deo' -or $txt -match 'Dr\s+Deo') {
            Report-Error "$rel contem mencao proibida a 'Dr. Deo'!"
            $drDeoCount++
        }
    }
}

if ($mojibakeCount -eq 0) {
    Report-Success "Anti-Mojibake: 0 caracteres corrompidos em $($targetFiles.Count) arquivo(s)."
}
if ($drDeoCount -eq 0) {
    Report-Success "Identidade Institucional: Zero mencoes a 'Dr. Deo'."
}

# 3. Estrutura Obrigatoria de Artigos e Testes (container + rodape)
# Exclui apps/storybooks interativos legados full-screen quando em modo -Full
$legacyInteractiveArticles = @(
    'alquimia-eros.html', 'guia-posicoes.html', 'guia-posicoes-2.html', 'tantra-radical.html',
    'cerebro-em-sobrecarga-ruminacao-ansiedade-cronica.html', 'narcisismo-vulneravel-vitimizacao-culpa-relacoes.html'
)
$structErrorCount = 0
foreach ($hf in $htmlTargets) {
    $rel = $hf.FullName.Replace($repoDir, '').TrimStart('\')
    if ($rel -match '^(artigos|testes)\\[^\\]+\.html$') {
        if ($hf.Name -like 'storybook-*' -or ($Full -and $hf.Name -in $legacyInteractiveArticles)) { continue }
        $txt = [System.IO.File]::ReadAllText($hf.FullName, [System.Text.Encoding]::UTF8)
        if ($txt.Contains('http-equiv="refresh"')) { continue }

        if ($rel -like 'artigos\*') {
            if ($txt -notmatch 'class="[^"]*container\s+article-container[^"]*"') {
                Report-Error "Artigo $rel nao possui 'container article-container'!"
                $structErrorCount++
            }
        }
        if ($txt -notmatch 'footer-grid') {
            Report-Error "Arquivo $rel nao possui 'footer-grid' no rodape!"
            $structErrorCount++
        }
    }
}
if ($structErrorCount -eq 0) {
    Report-Success "Estrutura HTML: Containers e rodapes validados."
}

# 4. Chaves no Studio Gerador (social/gerador.html) - somente se modificado ou -Full
$geradorTarget = $targetFiles | Where-Object { $_.FullName -like '*\social\gerador.html' }
if ($geradorTarget) {
    $gTxt = [System.IO.File]::ReadAllText($geradorTarget.FullName, [System.Text.Encoding]::UTF8)
    $openBraces = ([regex]::Matches($gTxt, '\{')).Count
    $closeBraces = ([regex]::Matches($gTxt, '\}')).Count
    if ($openBraces -ne $closeBraces) {
        Report-Error "social/gerador.html com chaves desbalanceadas: { = $openBraces, } = $closeBraces"
    } else {
        Report-Success "social/gerador.html: $openBraces chaves balanceadas."
    }
}

# 5. Taxonomia Estrita de Pastas e Centralizadores
foreach ($hf in $htmlTargets) {
    $rel = $hf.FullName.Replace($repoDir, '').TrimStart('\')
    if ($rel -match '^artigos\\teste-[^\\]*\.html$') {
        $txt = [System.IO.File]::ReadAllText($hf.FullName, [System.Text.Encoding]::UTF8)
        if (-not $txt.Contains('http-equiv="refresh"')) {
            Report-Error "Taxonomia violada: $($hf.Name) esta em artigos/ mas e um teste e nao um stub!"
        }
    }
    if ($rel -match '^recursos\\[^\\]*jogo[^\\]*\.html$') {
        $txt = [System.IO.File]::ReadAllText($hf.FullName, [System.Text.Encoding]::UTF8)
        if (-not $txt.Contains('http-equiv="refresh"')) {
            Report-Error "Taxonomia violada: $($hf.Name) esta em recursos/ mas e um jogo e nao um stub!"
        }
    }
}

$cardsTarget = $targetFiles | Where-Object { $_.Name -eq 'cards-artigos.html' }
if ($cardsTarget) {
    $cardsTxt = [System.IO.File]::ReadAllText($cardsTarget.FullName, [System.Text.Encoding]::UTF8)
    $testesInCards = ([regex]::Matches($cardsTxt, 'href="(testes/[^"]*)"')).Count
    $recursosInCards = ([regex]::Matches($cardsTxt, 'href="(recursos/[^"]*)"')).Count
    $jogosInCards = ([regex]::Matches($cardsTxt, 'href="(jogos/[^"]*)"')).Count
    if ($testesInCards -gt 0 -or $recursosInCards -gt 0 -or $jogosInCards -gt 0) {
        Report-Error "Taxonomia violada em cards-artigos.html: Encontrados $testesInCards testes, $recursosInCards recursos e $jogosInCards jogos!"
    } else {
        Report-Success "cards-artigos.html: Segregacao de taxonomia integra."
    }
}

# 6. Cabecalho Canonico (#main-header) nos HTMLs alvo
$headerCandidates = @($htmlTargets | Where-Object {
    $_.FullName -notmatch '\\assets\\template\\' -and
    $_.FullName -notmatch '\\bonsai\\' -and
    $_.FullName -notmatch '\\teste-bonsai\\' -and
    $_.FullName -notmatch '\\social\\gerador\.html' -and
    $_.FullName -notmatch '\\social\\index\.html' -and
    $_.FullName -notmatch '\\relatorios\\' -and
    $_.FullName -notmatch '\\cards-artigos\.html'
})

$headerErrorCount = 0
foreach ($hf in $headerCandidates) {
    $txt = [System.IO.File]::ReadAllText($hf.FullName, [System.Text.Encoding]::UTF8)
    if ($txt -match '<header id="main-header"[^>]*>([\s\S]*?)</header>') {
        $hContent = $matches[1]
        $rel = $hf.FullName.Replace($repoDir, '')
        if ($hContent -match 'id="navbar"') { Report-Error "Cabecalho nao-canonico em $rel - contem id='navbar'!"; $headerErrorCount++ }
        if ($hContent -match 'id="menu-toggle"') { Report-Error "Cabecalho nao-canonico em $rel - contem id='menu-toggle'!"; $headerErrorCount++ }
        if ($hContent -match 'class="nav-links"') { Report-Error "Cabecalho nao-canonico em $rel - contem class='nav-links'!"; $headerErrorCount++ }
        if ($hContent -match 'contato\.html') { Report-Error "Cabecalho nao-canonico em $rel - contem contato.html!"; $headerErrorCount++ }
        if ($hContent -match '>In[\u00EDi]cio<') { Report-Error "Cabecalho nao-canonico em $rel - contem 'Inicio' (usar 'Home')!"; $headerErrorCount++ }
        if ($hContent -notmatch 'class="mobile-menu-btn"') { Report-Error "Cabecalho nao-canonico em $rel - sem button.mobile-menu-btn!"; $headerErrorCount++ }
        if ($hContent -notmatch 'id="main-nav"') { Report-Error "Cabecalho nao-canonico em $rel - sem nav#main-nav!"; $headerErrorCount++ }
    }
}
if ($headerErrorCount -eq 0 -and $headerCandidates.Count -gt 0) {
    Report-Success "Cabecalho Canonico: $($headerCandidates.Count) pagina(s) HTML em conformidade."
}

# 7. Blindagem dos 4 Pilares da Esteira Continua - somente se esteiras-programacao.md foi alterado ou -Full
$esteiraTarget = $targetFiles | Where-Object { $_.Name -eq 'esteiras-programacao.md' }
if ($esteiraTarget) {
    $eTxt = [System.IO.File]::ReadAllText($esteiraTarget.FullName, [System.Text.Encoding]::UTF8)
    $concludedMatches = [regex]::Matches($eTxt, '\|\s*\*\*Lote (\d+)\*\*\s*\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|\s*\u2705')
    $allTestFiles = Get-ChildItem -Path (Join-Path $repoDir "testes") -Filter "*.html"
    foreach ($m in $concludedMatches) {
        $loteId = $m.Groups[1].Value
        $testePart = $m.Groups[4].Value
        if ($testePart -match 'T-(\d+)') {
            $tNum = $matches[1]
            $foundTest = $allTestFiles | Where-Object {
                $_.Name -match "t$tNum" -or
                ($tNum -eq '14' -and $_.Name -eq 'teste-sensibilidade-sensorial.html') -or
                ($tNum -eq '15' -and $_.Name -eq 'teste-assertividade.html') -or
                ([System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)) -match "T-$tNum"
            }
            if (-not $foundTest) {
                Report-Error "Lote $loteId marcado como concluido, mas o teste T-$tNum nao foi encontrado em testes/!"
            }
        }
    }
    Report-Success "Blindagem de Esteira: Lotes concluidos validados."
}

# 8. Blindagem Estrita Anti-LaTeX Bruto (apenas nos HTMLs e arquivos sociais alvo)
$latexCmdPattern = '\\(neg|land|lor|to|leftrightarrow|forall|exists|therefore|sim|veebar|oplus|text|implies|iff|equiv|vdash|models|alpha|beta|gamma|delta|Delta|mu|sigma|pm|times|cdot|leq|geq|neq|approx|frac|sqrt|sum|prod|int|subset|subseteq|in|notin|cup|cap|emptyset|Box|Diamond|rightarrow|leftarrow|Rightarrow|Leftarrow|Leftrightarrow)\b'
$latexDelimPattern = '(\$\$|\\\([^\r\n]{1,120}\\\)|\\\[[^\r\n]{1,120}\\\]|\$[^$\r\n]{1,120}\$)'

$latexErrorCount = 0
foreach ($hf in $htmlTargets) {
    $txt = [System.IO.File]::ReadAllText($hf.FullName, [System.Text.Encoding]::UTF8)
    $noScript = $txt -replace '(?s)<script\b[^>]*>.*?</script>', '' -replace '(?s)<style\b[^>]*>.*?</style>', ''
    $noCurr = $noScript -replace '(R|US)\$\s*\d', ''
    $rel = $hf.FullName.Replace($repoDir, '')

    $cmdMatches = [regex]::Matches($noCurr, $latexCmdPattern)
    $delimMatches = [regex]::Matches($noCurr, $latexDelimPattern)
    if ($cmdMatches.Count -gt 0 -or $delimMatches.Count -gt 0) {
        $sample = if ($cmdMatches.Count -gt 0) { $cmdMatches[0].Value } else { $delimMatches[0].Value }
        Report-Error "LaTeX bruto detectado em HTML visivel ($rel) - exemplo: '$sample'. Use caracteres Unicode nativos e tags HTML (<em>, <sub>, <sup>)!"
        $latexErrorCount++
    }
}

$socialTargets = @($targetFiles | Where-Object { $_.FullName -match '\\social\\' -and $_.Extension -in @('.html', '.md') })
foreach ($sf in $socialTargets) {
    $sTxt = [System.IO.File]::ReadAllText($sf.FullName, [System.Text.Encoding]::UTF8)
    $sClean = $sTxt -replace '\$\{[^}]*\}', '' -replace '(R|US)\$\s*\d', ''
    $rel = $sf.FullName.Replace($repoDir, '')
    $cmdMatches = [regex]::Matches($sClean, $latexCmdPattern)
    $delimMatches = [regex]::Matches($sClean, $latexDelimPattern)
    if ($cmdMatches.Count -gt 0 -or $delimMatches.Count -gt 0) {
        $sample = if ($cmdMatches.Count -gt 0) { $cmdMatches[0].Value } else { $delimMatches[0].Value }
        Report-Error "LaTeX bruto detectado em arquivo social ($rel) - exemplo: '$sample'. Use simbolos Unicode puros!"
        $latexErrorCount++
    }
}

if ($latexErrorCount -eq 0 -and ($htmlTargets.Count -gt 0 -or $socialTargets.Count -gt 0)) {
    Report-Success "Blindagem Anti-LaTeX Bruto: 0 formulas nao-renderizadas nos arquivos analisados."
}

$stopwatch.Stop()
$finalColor = if ($errorCount -eq 0) { "Green" } else { "Red" }
Write-Host "Quality Gate Finalizado em $($stopwatch.ElapsedMilliseconds) ms. Total de Erros: $errorCount" -ForegroundColor $finalColor
exit $errorCount
