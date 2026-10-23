$base = 'https://deomagalhaes.com.br';
$today = (Get-Date).ToString('yyyy-MM-dd');
$urls = New-Object System.Collections.Generic.List[string];

Get-ChildItem -Path . -Filter '*.html' | ForEach-Object {
    $name = $_.Name;
    if ($name -eq 'index.html') {
        $urls.Add($base + '/');
    } elseif ($name -ne 'cards-artigos.html') {
        $urls.Add($base + '/' + $name);
    }
}

if (Test-Path 'artigos') {
    Get-ChildItem -Path 'artigos' -Filter '*.html' | ForEach-Object {
        $urls.Add($base + '/artigos/' + $_.Name);
    }
}

if (Test-Path 'recursos') {
    Get-ChildItem -Path 'recursos' -Filter '*.html' | ForEach-Object {
        $urls.Add($base + '/recursos/' + $_.Name);
    }
}

if (Test-Path 'recursos/explorador-dois-mundos/index.html') {
    $urls.Add($base + '/recursos/explorador-dois-mundos/');
}

$xmlLines = New-Object System.Collections.Generic.List[string];
$xmlLines.Add('<?xml version="1.0" encoding="UTF-8"?>');
$xmlLines.Add('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

foreach ($u in $urls) {
    $priority = '0.7';
    $freq = 'weekly';
    if ($u -eq ($base + '/')) {
        $priority = '1.0';
        $freq = 'daily';
    } elseif ($u -like '*artigos.html*' -or $u -like '*jogos.html*' -or $u -like '*recursos.html*') {
        $priority = '0.9';
        $freq = 'daily';
    } elseif ($u -like '*/artigos/*') {
        $priority = '0.8';
        $freq = 'monthly';
    } elseif ($u -like '*/recursos/*') {
        $priority = '0.8';
        $freq = 'monthly';
    }

    $xmlLines.Add('  <url>');
    $xmlLines.Add('    <loc>' + $u + '</loc>');
    $xmlLines.Add('    <lastmod>' + $today + '</lastmod>');
    $xmlLines.Add('    <changefreq>' + $freq + '</changefreq>');
    $xmlLines.Add('    <priority>' + $priority + '</priority>');
    $xmlLines.Add('  </url>');
}

$xmlLines.Add('</urlset>');

[System.IO.File]::WriteAllLines((Join-Path (Get-Location) 'sitemap.xml'), $xmlLines, [System.Text.Encoding]::UTF8);
Write-Output ("Sitemap gerado com sucesso com " + $urls.Count + " URLs indexaveis.");
