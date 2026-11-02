# scripts/generate-sitemap.ps1
$base = 'https://deomagalhaes.com.br'
$today = (Get-Date).ToString('yyyy-MM-dd')
$items = New-Object System.Collections.Generic.List[PSCustomObject]

function Test-IsRedirectStub($fileItem) {
    # Stubs de redirecionamento sao arquivos minimos (< 2 KB). Artigos reais nunca sao lidos do disco.
    if ($fileItem.Length -ge 2048) { return $false }
    try {
        $txt = [System.IO.File]::ReadAllText($fileItem.FullName, [System.Text.Encoding]::UTF8)
        return $txt.Contains('http-equiv="refresh"')
    } catch {
        return $false
    }
}

function Add-UrlEntry($loc, $fileItem, $priority, $freq, $forceToday = $false) {
    $lastMod = if ($forceToday -or -not $fileItem) { $today } else { $fileItem.LastWriteTime.ToString('yyyy-MM-dd') }
    $items.Add([PSCustomObject]@{
        Loc = $loc
        LastMod = $lastMod
        Priority = $priority
        Freq = $freq
    })
}

# 1. Paginas principais da raiz
Get-ChildItem -Path . -Filter '*.html' | ForEach-Object {
    $name = $_.Name
    if ($name -eq 'index.html') {
        Add-UrlEntry ($base + '/') $_ '1.0' 'daily' $true
    } elseif ($name -ne 'cards-artigos.html') {
        $isDynamic = ($name -in @('artigos.html', 'testes.html', 'jogos.html', 'recursos.html'))
        $prio = if ($isDynamic) { '0.9' } else { '0.7' }
        $freq = if ($isDynamic) { 'daily' } else { 'weekly' }
        Add-UrlEntry ($base + '/' + $name) $_ $prio $freq $isDynamic
    }
}

# 2. Artigos clinicos (preserva lastmod real e nao le artigos antigos em disco)
if (Test-Path 'artigos') {
    Get-ChildItem -Path 'artigos' -Filter '*.html' | ForEach-Object {
        if (-not (Test-IsRedirectStub $_)) {
            Add-UrlEntry ($base + '/artigos/' + $_.Name) $_ '0.8' 'monthly'
        }
    }
}

# 3. Testes psicometricos
if (Test-Path 'testes') {
    Get-ChildItem -Path 'testes' -Filter '*.html' | ForEach-Object {
        Add-UrlEntry ($base + '/testes/' + $_.Name) $_ '0.85' 'monthly'
    }
}

# 4. Jogos cognitivos
if (Test-Path 'jogos') {
    Get-ChildItem -Path 'jogos' -Filter '*.html' | ForEach-Object {
        Add-UrlEntry ($base + '/jogos/' + $_.Name) $_ '0.85' 'monthly'
    }
}

# 5. Recursos e ferramentas clinicas
if (Test-Path 'recursos') {
    Get-ChildItem -Path 'recursos' -Filter '*.html' | ForEach-Object {
        if (-not (Test-IsRedirectStub $_)) {
            Add-UrlEntry ($base + '/recursos/' + $_.Name) $_ '0.8' 'monthly'
        }
    }
}

# 6. Subaplicacoes e Hubs Clinicos (NUNCA indexar pastas ocultas como nexus-vault)
$hubClinicoIndex = 'ferramentas-clinicas/index.html'
if (Test-Path $hubClinicoIndex) {
    Add-UrlEntry ($base + '/ferramentas-clinicas/') (Get-Item $hubClinicoIndex) '0.9' 'weekly' $true
}
$expIndex = 'recursos/explorador-dois-mundos/index.html'
if (Test-Path $expIndex) {
    Add-UrlEntry ($base + '/recursos/explorador-dois-mundos/') (Get-Item $expIndex) '0.8' 'monthly'
}
$croIndex = 'jogos/cronicas-dos-emissarios/index.html'
if (Test-Path $croIndex) {
    Add-UrlEntry ($base + '/jogos/cronicas-dos-emissarios/') (Get-Item $croIndex) '0.8' 'monthly'
}

# Geracao do XML
$xmlLines = New-Object System.Collections.Generic.List[string]
$xmlLines.Add('<?xml version="1.0" encoding="UTF-8"?>')
$xmlLines.Add('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

foreach ($entry in $items) {
    $xmlLines.Add('  <url>')
    $xmlLines.Add('    <loc>' + $entry.Loc + '</loc>')
    $xmlLines.Add('    <lastmod>' + $entry.LastMod + '</lastmod>')
    $xmlLines.Add('    <changefreq>' + $entry.Freq + '</changefreq>')
    $xmlLines.Add('    <priority>' + $entry.Priority + '</priority>')
    $xmlLines.Add('  </url>')
}

$xmlLines.Add('</urlset>')

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) 'sitemap.xml'), $xmlLines, $utf8NoBom)
Write-Host "✅ sitemap.xml gerado com $($items.Count) URLs indexáveis (datas reais preservadas)." -ForegroundColor Green
