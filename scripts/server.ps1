param(
    [int]$Port = 8080,
    [string]$Root = (Get-Location).Path
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Error "Falha ao iniciar o servidor na porta $Port. $_"
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Servidor Web Local Ativo!" -ForegroundColor Green
Write-Host "  URL: $prefix" -ForegroundColor Yellow
Write-Host "  Pasta Raiz: $Root" -ForegroundColor Gray
Write-Host "  Cache desativado para testes e recarregamento em tempo real." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".pdf"  = "application/pdf"
    ".mp3"  = "audio/mpeg"
    ".mp4"  = "video/mp4"
    ".md"   = "text/plain; charset=utf-8"
    ".xml"  = "application/xml; charset=utf-8"
    ".txt"  = "text/plain; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.RawUrl
        $pathPart = $rawUrl.Split('?')[0]
        $decodedPath = [System.Uri]::UnescapeDataString($pathPart)

        # Endpoint de API: Sincronização sob demanda com o Google Calendar
        if ($decodedPath -eq '/api/sync-gcalendar') {
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "*")
            if ($request.HttpMethod -eq 'OPTIONS') {
                $response.StatusCode = 204
                $response.Close()
                continue
            }
            try {
                $syncScript = Join-Path $Root "scripts\sync-agenda-vault.ps1"
                if (Test-Path $syncScript) {
                    & $syncScript | Out-Null
                }
                $cacheJson = Join-Path $Root "nexus-vault\data\agenda-cache.json"
                if (Test-Path $cacheJson) {
                    $bytes = [System.IO.File]::ReadAllBytes($cacheJson)
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.StatusCode = 200
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                } else {
                    throw "Arquivo agenda-cache.json nao encontrado apos sincronizacao."
                }
            } catch {
                $response.StatusCode = 500
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("{`"error`": `"$($_.Exception.Message)`"}")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.Close()
            continue
        }

        $relPath = $decodedPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        if ([string]::IsNullOrWhiteSpace($relPath)) {
            $relPath = "index.html"
        }

        $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($Root, $relPath))

        if (Test-Path -Path $fullPath -PathType Container) {
            $candidate = [System.IO.Path]::Combine($fullPath, "index.html")
            if (Test-Path -Path $candidate -PathType Leaf) {
                $fullPath = $candidate
            }
        }

        $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
        $response.Headers.Add("Pragma", "no-cache")
        $response.Headers.Add("Expires", "0")
        $response.Headers.Add("Access-Control-Allow-Origin", "*")

        if ((Test-Path -Path $fullPath -PathType Leaf) -and $fullPath.StartsWith([System.IO.Path]::GetFullPath($Root), [System.StringComparison]::OrdinalIgnoreCase)) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType

            try {
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $errMsg = [System.Text.Encoding]::UTF8.GetBytes("500 Internal Server Error: $($_.Exception.Message)")
                $response.OutputStream.Write($errMsg, 0, $errMsg.Length)
            }
        } else {
            $response.StatusCode = 404
            $response.ContentType = "text/html; charset=utf-8"
            $html404 = @"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><title>404 Nao Encontrado</title><style>body{font-family:sans-serif;padding:40px;background:#0d1117;color:#c9d1d9;}h1{color:#f85149;}code{background:#161b22;padding:4px 8px;border-radius:4px;}</style></head>
<body>
<h1>404 - Arquivo nao encontrado</h1>
<p>O arquivo requisitado nao existe no servidor local:</p>
<p><code>$decodedPath</code></p>
<p><a href="/" style="color:#58a6ff;">&larr; Voltar para a pagina inicial</a></p>
</body>
</html>
"@
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($html404)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
