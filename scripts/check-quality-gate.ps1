# Quality Gate Estrito Anti-Mojibake e Conformidade Institucional — Deo Magalhães
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir

$errorCount = 0

function Report-Error($msg) {
    Write-Host "[FALHA CRITICA] $msg" -ForegroundColor Red
    $global:errorCount++
}

function Report-Success($msg) {
    Write-Host "[OK] $msg" -ForegroundColor Green
}

Write-Host "Iniciando Quality Gate de Conformidade, Anti-Mojibake e Anti-LaTeX..." -ForegroundColor Cyan

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
    $foundMatches = [regex]::Matches($txt, $mojibakePattern)
    if ($foundMatches.Count -gt 0) {
        Report-Error "$($f.FullName.Replace($repoDir, '')) contem $($foundMatches.Count) ocorrencias de mojibake!"
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
        Report-Error "$($f.FullName.Replace($repoDir, '')) contem mencao proibida a 'Dr. Deo'!"
        $drDeoCount++
    }
}
if ($drDeoCount -eq 0) {
    Report-Success "Identidade e Autoridade: Zero mencoes a 'Dr. Deo'."
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
    "artigos\neurobiologia-ansiedade-social-vergonha-julgamento.html",
    "artigos\fundamentos-logica-classica-proposicoes-operadores.html"
)

foreach ($relPath in $esteiraArticles) {
    $full = Join-Path $repoDir $relPath
    if (Test-Path $full) {
        $txt = [System.IO.File]::ReadAllText($full, [System.Text.Encoding]::UTF8)
        if ($relPath -like 'artigos\*') {
            if ($txt -notmatch 'class="[^"]*container\s+article-container[^"]*"') {
                Report-Error "Artigo $relPath nao possui 'container article-container'!"
            }
        }
        if ($txt -notmatch 'footer-grid') {
            Report-Error "Arquivo $relPath nao possui 'footer-grid' no rodape!"
        }
    }
}
Report-Success "Artigos e Testes da Esteira: Todos os arquivos validados com container e rodape em conformidade."

# 4. Checagem de Chaves no Studio Gerador (social/gerador.html)
$geradorPath = Join-Path $repoDir "social\gerador.html"
if (Test-Path $geradorPath) {
    $gTxt = [System.IO.File]::ReadAllText($geradorPath, [System.Text.Encoding]::UTF8)
    $openBraces = ([regex]::Matches($gTxt, '\{')).Count
    $closeBraces = ([regex]::Matches($gTxt, '\}')).Count
    if ($openBraces -ne $closeBraces) {
        Report-Error "social/gerador.html com chaves desbalanceadas: { = $openBraces, } = $closeBraces"
    } else {
        Report-Success "social/gerador.html: $openBraces chaves balanceadas com perfeicao."
    }
}

# 5. Blindagem de Taxonomia Estrita de Pastas e Centralizadores
$artigosDir = Join-Path $repoDir "artigos"
$artigoTests = Get-ChildItem -Path $artigosDir -Filter "teste-*.html"
foreach ($at in $artigoTests) {
    $txt = [System.IO.File]::ReadAllText($at.FullName, [System.Text.Encoding]::UTF8)
    if (-not $txt.Contains('http-equiv="refresh"')) {
        Report-Error "Taxonomia violada: O arquivo $($at.Name) esta em artigos/ mas e um teste e nao um stub de redirecionamento!"
    }
}

$recursosDir = Join-Path $repoDir "recursos"
$recursoJogos = Get-ChildItem -Path $recursosDir -Filter "*jogo*.html"
foreach ($rj in $recursoJogos) {
    $txt = [System.IO.File]::ReadAllText($rj.FullName, [System.Text.Encoding]::UTF8)
    if (-not $txt.Contains('http-equiv="refresh"')) {
        Report-Error "Taxonomia violada: O arquivo $($rj.Name) esta em recursos/ mas e um jogo e nao um stub de redirecionamento!"
    }
}

# Verificação de cards-artigos.html: PROIBIDO conter cards apontando para testes/, recursos/ ou jogos/
$cardsArtigosPath = Join-Path $repoDir "cards-artigos.html"
if (Test-Path $cardsArtigosPath) {
    $cardsTxt = [System.IO.File]::ReadAllText($cardsArtigosPath, [System.Text.Encoding]::UTF8)
    $testesInCards = ([regex]::Matches($cardsTxt, 'href="(testes/[^"]*)"')).Count
    $recursosInCards = ([regex]::Matches($cardsTxt, 'href="(recursos/[^"]*)"')).Count
    $jogosInCards = ([regex]::Matches($cardsTxt, 'href="(jogos/[^"]*)"')).Count
    if ($testesInCards -gt 0 -or $recursosInCards -gt 0 -or $jogosInCards -gt 0) {
        Report-Error "Taxonomia violada em cards-artigos.html: Encontrados $testesInCards links de testes, $recursosInCards de recursos e $jogosInCards de jogos. Este arquivo deve conter exclusivamente artigos!"
    }
}

Report-Success "Blindagem de Taxonomia: Pastas artigos/, testes/, jogos/ e recursos/ estritamente segregadas."

# 6. Blindagem Estrita de Cabeçalho Canônico (#main-header)
$htmlFiles = Get-ChildItem -Path $repoDir -Filter "*.html" -Recurse | Where-Object {
    $_.FullName -notmatch '\\\.git\\' -and 
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\scratch\\' -and
    $_.FullName -notmatch '\\assets\\template\\' -and
    $_.FullName -notmatch '\\bonsai\\' -and
    $_.FullName -notmatch '\\teste-bonsai\\' -and
    $_.FullName -notmatch '\\social\\gerador\.html' -and
    $_.FullName -notmatch '\\social\\index\.html' -and
    $_.FullName -notmatch '\\relatorios\\' -and
    $_.FullName -notmatch '\\cards-artigos\.html'
}

$headerErrorCount = 0
foreach ($hf in $htmlFiles) {
    $txt = [System.IO.File]::ReadAllText($hf.FullName, [System.Text.Encoding]::UTF8)
    if ($txt -match '<header id="main-header"[^>]*>([\s\S]*?)</header>') {
        $hContent = $matches[1]
        $rel = $hf.FullName.Replace($repoDir, '')
        if ($hContent -match 'id="navbar"') {
            Report-Error "Cabecalho nao-canonico em $($rel) - contem id='navbar' (deve usar id='main-nav')!"
            $headerErrorCount++
        }
        if ($hContent -match 'id="menu-toggle"') {
            Report-Error "Cabecalho nao-canonico em $($rel) - contem id='menu-toggle' (deve usar class='mobile-menu-btn')!"
            $headerErrorCount++
        }
        if ($hContent -match 'class="nav-links"') {
            Report-Error "Cabecalho nao-canonico em $($rel) - contem class='nav-links' (deve usar links diretos no #main-nav)!"
            $headerErrorCount++
        }
        if ($hContent -match 'contato\.html') {
            Report-Error "Cabecalho nao-canonico em $($rel) - contem link para contato.html no menu superior!"
            $headerErrorCount++
        }
        if ($hContent -match '>In[\u00EDi]cio<') {
            Report-Error "Cabecalho nao-canonico em $($rel) - contem 'Inicio' no menu superior (deve usar 'Home')!"
            $headerErrorCount++
        }
        if ($hContent -notmatch 'class="mobile-menu-btn"') {
            Report-Error "Cabecalho nao-canonico em $($rel) - nao possui button.mobile-menu-btn!"
            $headerErrorCount++
        }
        if ($hContent -notmatch 'id="main-nav"') {
            Report-Error "Cabecalho nao-canonico em $($rel) - nao possui nav#main-nav!"
            $headerErrorCount++
        }
    }
}

if ($headerErrorCount -eq 0) {
    Report-Success "Blindagem de Cabecalho: 100% dos arquivos em conformidade com o menu canonico oficial."
}

# 7. Blindagem dos 4 Pilares da Esteira Contínua
$esteiraPath = Join-Path $repoDir "esteiras-programacao.md"
if (Test-Path $esteiraPath) {
    $eTxt = [System.IO.File]::ReadAllText($esteiraPath, [System.Text.Encoding]::UTF8)
    $concludedMatches = [regex]::Matches($eTxt, '\|\s*\*\*Lote (\d+)\*\*\s*\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|\s*\u2705')
    foreach ($m in $concludedMatches) {
        $loteId = $m.Groups[1].Value
        $testePart = $m.Groups[4].Value
        $jogoPart = $m.Groups[5].Value
        if ($testePart -match 'T-(\d+)') {
            $tNum = $matches[1]
            $foundTest = Get-ChildItem -Path (Join-Path $repoDir "testes") -Filter "*.html" | Where-Object {
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
    Report-Success "Blindagem de Esteira: Todos os lotes concluidos possuem seus respectivos testes e jogos validados."
}

# 8. Blindagem Estrita Anti-LaTeX Bruto em HTML e Studio Social
$latexCmdPattern = '\\(neg|land|lor|to|leftrightarrow|forall|exists|therefore|sim|veebar|oplus|text|implies|iff|equiv|vdash|models|alpha|beta|gamma|delta|Delta|mu|sigma|pm|times|cdot|leq|geq|neq|approx|frac|sqrt|sum|prod|int|subset|subseteq|in|notin|cup|cap|emptyset|Box|Diamond|rightarrow|leftarrow|Rightarrow|Leftarrow|Leftrightarrow)\b'
$latexDelimPattern = '(\$\$|\\\([^\r\n]{1,120}\\\)|\\\[[^\r\n]{1,120}\\\]|\$[^$\r\n]{1,120}\$)'

$allHtmlForLatex = Get-ChildItem -Path $repoDir -Filter "*.html" -Recurse | Where-Object {
    $_.FullName -notmatch '\\\.git\\' -and 
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\scratch\\'
}

$latexErrorCount = 0
foreach ($hf in $allHtmlForLatex) {
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

# Verificar tambem PRESETS dentro de social/gerador.html e roteiros em social/*.md
$socialFiles = Get-ChildItem -Path (Join-Path $repoDir "social") -Include *.html,*.md -Recurse -ErrorAction SilentlyContinue
foreach ($sf in $socialFiles) {
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

if ($latexErrorCount -eq 0) {
    Report-Success "Blindagem Anti-LaTeX Bruto: 0 formulas LaTeX nao-renderizadas em $($allHtmlForLatex.Count) paginas HTML e arquivos sociais."
}

$finalColor = if ($errorCount -eq 0) { "Green" } else { "Red" }
Write-Host "Quality Gate Finalizado. Total de Erros: $errorCount" -ForegroundColor $finalColor
exit $errorCount
