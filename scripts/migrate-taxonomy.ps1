# scripts/migrate-taxonomy.ps1
# Script de Migração Segura de Taxonomia e Categorização — Deo Magalhães
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir

$testesDir = Join-Path $repoDir "testes"
$jogosDir = Join-Path $repoDir "jogos"
$artigosDir = Join-Path $repoDir "artigos"
$recursosDir = Join-Path $repoDir "recursos"

if (-not (Test-Path $testesDir)) { New-Item -ItemType Directory -Path $testesDir -Force | Out-Null }
if (-not (Test-Path $jogosDir)) { New-Item -ItemType Directory -Path $jogosDir -Force | Out-Null }

Write-Host "Iniciando migração de taxonomia..." -ForegroundColor Cyan

function Create-RedirectStub($destRelPath, $title) {
    return @"
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=$destRelPath">
    <link rel="canonical" href="https://deomagalhaes.com.br$destRelPath">
    <title>Redirecionando... – Deo Magalhães</title>
    <script>
        window.location.replace("$destRelPath");
    </script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 50px 20px; color: #334155;">
    <h2>Redirecionando para o novo endereço...</h2>
    <p>Se você não for redirecionado automaticamente, <a href="$destRelPath" style="color: #0a9396; font-weight: bold;">clique aqui</a>.</p>
</body>
</html>
"@
}

# 1. Copiar Testes de artigos/ para testes/
$testFiles = Get-ChildItem -Path $artigosDir -Filter "teste-*.html"
foreach ($f in $testFiles) {
    $targetPath = Join-Path $testesDir $f.Name
    # Copia o conteúdo original para testes/
    Copy-Item -Path $f.FullName -Destination $targetPath -Force
    Write-Host "Teste copiado para testes/: $($f.Name)" -ForegroundColor Green

    # Substitui em artigos/ pelo stub de redirecionamento anti-404
    $destRel = "/testes/$($f.Name)"
    $stubContent = Create-RedirectStub $destRel $f.Name
    [System.IO.File]::WriteAllText($f.FullName, $stubContent, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Stub de redirecionamento criado em artigos/: $($f.Name)" -ForegroundColor Yellow
}

# 2. Copiar escala-regulacao-emocional.html de recursos/ para testes/
$escalaRecursos = Join-Path $recursosDir "escala-regulacao-emocional.html"
if (Test-Path $escalaRecursos) {
    $targetEscala = Join-Path $testesDir "escala-regulacao-emocional.html"
    Copy-Item -Path $escalaRecursos -Destination $targetEscala -Force
    Write-Host "Escala copiada para testes/: escala-regulacao-emocional.html" -ForegroundColor Green

    $stubContent = Create-RedirectStub "/testes/escala-regulacao-emocional.html" "escala-regulacao-emocional.html"
    [System.IO.File]::WriteAllText($escalaRecursos, $stubContent, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Stub de redirecionamento criado em recursos/: escala-regulacao-emocional.html" -ForegroundColor Yellow
}

# 3. Copiar Jogos de recursos/ para jogos/
$gameFiles = Get-ChildItem -Path $recursosDir -Filter "*jogo*.html"
foreach ($f in $gameFiles) {
    $targetGame = Join-Path $jogosDir $f.Name
    Copy-Item -Path $f.FullName -Destination $targetGame -Force
    Write-Host "Jogo copiado para jogos/: $($f.Name)" -ForegroundColor Green

    $destRel = "/jogos/$($f.Name)"
    $stubContent = Create-RedirectStub $destRel $f.Name
    [System.IO.File]::WriteAllText($f.FullName, $stubContent, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Stub de redirecionamento criado em recursos/: $($f.Name)" -ForegroundColor Yellow
}

# 4. Outros jogos auxiliares (0-festival-pipa*.html, 0-novo-jogo4.html)
$auxGames = @("0-festival-pipa1.html", "0-festival-pipa2.html", "0-novo-jogo4.html")
foreach ($name in $auxGames) {
    $auxPath = Join-Path $recursosDir $name
    if (Test-Path $auxPath) {
        $targetAux = Join-Path $jogosDir $name
        Copy-Item -Path $auxPath -Destination $targetAux -Force
        
        $destRel = "/jogos/$name"
        $stubContent = Create-RedirectStub $destRel $name
        [System.IO.File]::WriteAllText($auxPath, $stubContent, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "Jogo auxiliar migrado para jogos/: $name" -ForegroundColor Green
    }
}

# 5. Copiar subpasta de jogos recursos/jogos/cronicas-dos-emissarios para jogos/cronicas-dos-emissarios
$cronicasSrc = Join-Path $recursosDir "jogos\cronicas-dos-emissarios"
if (Test-Path $cronicasSrc) {
    $cronicasDest = Join-Path $jogosDir "cronicas-dos-emissarios"
    if (-not (Test-Path $cronicasDest)) {
        New-Item -ItemType Directory -Path $cronicasDest -Force | Out-Null
    }
    Copy-Item -Path "$cronicasSrc\*" -Destination $cronicasDest -Recurse -Force
    Write-Host "Subpasta de jogo copiada: jogos/cronicas-dos-emissarios" -ForegroundColor Green
}

Write-Host "Migração física concluída com sucesso!" -ForegroundColor Cyan
