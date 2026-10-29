# scripts/fix-stubs-encoding.ps1
$ErrorActionPreference = 'Stop'
$repoDir = Split-Path -Parent $PSScriptRoot

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-Stub($filePath, $destRel) {
    $html = @"
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=$destRel">
    <link rel="canonical" href="https://deomagalhaes.com.br$destRel">
    <title>Redirecionando - Deo Magalhaes</title>
    <script>
        window.location.replace("$destRel");
    </script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 50px 20px; color: #334155;">
    <h2>Redirecionando para o novo local...</h2>
    <p>Caso nao seja redirecionado automaticamente, <a href="$destRel" style="color: #0a9396; font-weight: bold;">clique aqui</a>.</p>
</body>
</html>
"@
    [System.IO.File]::WriteAllText($filePath, $html, $utf8NoBom)
}

# 1. Stubs em artigos/teste-*.html
$artigosTests = Get-ChildItem -Path (Join-Path $repoDir "artigos") -Filter "teste-*.html"
foreach ($f in $artigosTests) {
    Write-Stub $f.FullName "/testes/$($f.Name)"
}

# 2. Stub escala-regulacao-emocional.html em recursos/
$escalaRecursos = Join-Path $repoDir "recursos\escala-regulacao-emocional.html"
if (Test-Path $escalaRecursos) {
    Write-Stub $escalaRecursos "/testes/escala-regulacao-emocional.html"
}

# 3. Stubs de jogos em recursos/
$recursosJogos = Get-ChildItem -Path (Join-Path $repoDir "recursos") -Filter "*jogo*.html"
foreach ($f in $recursosJogos) {
    Write-Stub $f.FullName "/jogos/$($f.Name)"
}

# 4. Outros stubs de jogos em recursos/
$auxGames = @("0-festival-pipa1.html", "0-festival-pipa2.html", "0-novo-jogo4.html")
foreach ($name in $auxGames) {
    $p = Join-Path $repoDir "recursos\$name"
    if (Test-Path $p) {
        Write-Stub $p "/jogos/$name"
    }
}

Write-Host "Todos os stubs foram regravados com codificação limpa UTF-8 sem acentos!" -ForegroundColor Green
