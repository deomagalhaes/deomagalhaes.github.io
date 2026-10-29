$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir

$cardsFile = Join-Path $repoDir "cards-artigos.html"
$c = [System.IO.File]::ReadAllText($cardsFile, [System.Text.Encoding]::UTF8)

# Regex to match <a>...</a> tags whose href starts with testes/ or recursos/ or jogos/
$pattern = '(?s)<a\s+href="(testes|recursos|jogos)/[^"]*"[^>]*>.*?</a>\s*'
$matches = [regex]::Matches($c, $pattern)
Write-Host ("Cards de testes/recursos/jogos encontrados para remoção: " + $matches.Count)

$cleaned = [regex]::Replace($c, $pattern, '')
[System.IO.File]::WriteAllText($cardsFile, $cleaned, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "cards-artigos.html atualizado e limpo com sucesso!"
