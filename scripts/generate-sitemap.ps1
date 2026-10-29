# scripts/generate-sitemap.ps1
$base = 'https://deomagalhaes.com.br'
$today = (Get-Date).ToString('yyyy-MM-dd')
$urls = New-Object System.Collections.Generic.List[string]

function Test-IsRedirectStub($filePath) {
    try {
        $txt = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
        return $txt.Contains('http-equiv="refresh"')
    } catch {
        return $false
    }
}

Get-ChildItem -Path . -Filter '*.html' | ForEach-Object {
    $name = $_.Name
    if ($name -eq 'index.html') {
        $urls.Add($base + '/')
    } elseif ($name -ne 'cards-artigos.html') {
        $urls.Add($base + '/' + $name)
    }
}

if (Test-Path 'artigos') {
    Get-ChildItem -Path 'artigos' -Filter '*.html' | ForEach-Object {
        if (-not (Test-IsRedirectStub $_.FullName)) {
            $urls.Add($base + '/artigos/' + $_.Name)
        }
    }
}

if (Test-Path 'testes') {
    Get-ChildItem -Path 'testes' -Filter '*.html' | ForEach-Object {
        $urls.Add($base + '/testes/' + $_.Name)
    }
}

if (Test-Path 'jogos') {
    Get-ChildItem -Path 'jogos' -Filter '*.html' | ForEach-Object {
        $urls.Add($base + '/jogos/' + $_.Name)
    }
}

if (Test-Path 'recursos') {
    Get-ChildItem -Path 'recursos' -Filter '*.html' | ForEach-Object {
        if (-not (Test-IsRedirectStub $_.FullName)) {
            $urls.Add($base + '/recursos/' + $_.Name)
        }
    }
}

if (Test-Path 'recursos/explorador-dois-mundos/index.html') {
    $urls.Add($base + '/recursos/explorador-dois-mundos/')
}
if (Test-Path 'jogos/cronicas-dos-emissarios/index.html') {
    $urls.Add($base + '/jogos/cronicas-dos-emissarios/')
}

$xmlLines = New-Object System.Collections.Generic.List[string]
$xmlLines.Add('<?xml version="1.0" encoding="UTF-8"?>')
$xmlLines.Add('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

foreach ($u in $urls) {
    $priority = '0.7'
    $freq = 'weekly'
    if ($u -eq ($base + '/')) {
        $priority = '1.0'
        $freq = 'daily'
    } elseif ($u -like '*artigos.html*' -or $u -like '*testes.html*' -or $u -like '*jogos.html*' -or $u -like '*recursos.html*') {
        $priority = '0.9'
        $freq = 'daily'
    } elseif ($u -like '*/artigos/*') {
        $priority = '0.8'
        $freq = 'monthly'
    } elseif ($u -like '*/testes/*') {
        $priority = '0.85'
        $freq = 'monthly'
    } elseif ($u -like '*/jogos/*') {
        $priority = '0.85'
        $freq = 'monthly'
    } elseif ($u -like '*/recursos/*') {
        $priority = '0.8'
        $freq = 'monthly'
    }

    $xmlLines.Add('  <url>')
    $xmlLines.Add('    <loc>' + $u + '</loc>')
    $xmlLines.Add('    <lastmod>' + $today + '</lastmod>')
    $xmlLines.Add('    <changefreq>' + $freq + '</changefreq>')
    $xmlLines.Add('    <priority>' + $priority + '</priority>')
    $xmlLines.Add('  </url>')
}

$xmlLines.Add('</urlset>')

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) 'sitemap.xml'), $xmlLines, $utf8NoBom)
Write-Host "✅ sitemap.xml gerado com $($urls.Count) URLs indexáveis." -ForegroundColor Green
