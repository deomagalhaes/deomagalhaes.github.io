param(
    [int]$Port = 5500,
    [string]$RootPath = (Split-Path -Parent $PSScriptRoot)
)

$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet' -and $_.IPAddress -notlike '169.254*' } | Select-Object -First 1).IPAddress

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)
$listener.Start()

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Servidor Local Bonsai Mori Ativo!" -ForegroundColor Cyan
Write-Host "  No Computador: http://localhost:$Port/bonsai/" -ForegroundColor Yellow
Write-Host "  No Celular (mesmo Wi-Fi): http://${ip}:$Port/bonsai/" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $requestLine = $reader.ReadLine()

        if ([string]::IsNullOrWhiteSpace($requestLine)) {
            $client.Close()
            continue
        }

        $parts = $requestLine.Split(' ')
        $method = $parts[0]
        $url = if ($parts.Length -gt 1) { $parts[1] } else { "/" }
        
        # Remove query string
        $pathOnly = $url.Split('?')[0]
        if ($pathOnly -eq "/" -or $pathOnly -eq "/bonsai" -or $pathOnly -eq "/bonsai/") {
            $pathOnly = "/bonsai/index.html"
        }

        # Normalize relative path to physical file
        $relPath = $pathOnly.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $RootPath $relPath

        if ((Test-Path -LiteralPath $filePath) -and -not (Get-Item -LiteralPath $filePath).PSIsContainer) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)

            $header = "HTTP/1.1 200 OK`r`n" +
                      "Content-Type: $mime`r`n" +
                      "Content-Length: $($bytes.Length)`r`n" +
                      "Access-Control-Allow-Origin: *`r`n" +
                      "Connection: close`r`n`r`n"

            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($bytes, 0, $bytes.Length)
        } else {
            $notFound = "<h1>404 Not Found</h1><p>$pathOnly</p>"
            $nfBytes = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $header = "HTTP/1.1 404 Not Found`r`n" +
                      "Content-Type: text/html; charset=utf-8`r`n" +
                      "Content-Length: $($nfBytes.Length)`r`n" +
                      "Connection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($nfBytes, 0, $nfBytes.Length)
        }

        $stream.Flush()
        $client.Close()
    }
} finally {
    $listener.Stop()
}
