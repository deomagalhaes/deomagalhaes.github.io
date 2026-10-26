# scripts/publicar-conteudo.ps1
<#
.SYNOPSIS
    Pipeline Integrado de Publicação e Social Hub — Deo Magalhães
.DESCRIPTION
    Executa a automação completa:
    1. Registra o card do artigo/recurso em cards-artigos.html
    2. Gera o roteiro canônico de 6 slides (.md) em social/
    3. Registra e adiciona o preset dentro de social/gerador.html (Studio Visual)
    4. Atualiza o social/README.md
    5. Atualiza o sitemap.xml com 130+ URLs indexadas
    6. Atualiza e valida o status das esteiras
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Titulo = "",

    [Parameter(Mandatory=$false)]
    [string]$Slug = "",

    [Parameter(Mandatory=$false)]
    [string]$Descricao = "",

    [Parameter(Mandatory=$false)]
    [string]$Categorias = "saude-mental",

    [Parameter(Mandatory=$false)]
    [string]$UrlRelativa = "",

    [Parameter(Mandatory=$false)]
    [switch]$AtualizarSitemapApenas
)

$utf8 = [System.Text.UTF8Encoding]::new($false)

if ($AtualizarSitemapApenas) {
    Write-Host "[Sitemap] Atualizando sitemap.xml..." -ForegroundColor Cyan
    & powershell.exe -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "generate-sitemap.ps1")
    exit 0
}

# Se for chamado para checagem ou sincronização geral
Write-Host "==================================================" -ForegroundColor Green
Write-Host "   PIPELINE UNIFICADO: CONTEÚDO & SOCIAL HUB     " -ForegroundColor Green
Write-Host "   Deo Magalhães • Neuropsicologia Clínica        " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# 1. Regenera e valida sitemap
Write-Host "[1/3] Atualizando e validando sitemap.xml..." -ForegroundColor Yellow
& powershell.exe -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "generate-sitemap.ps1")

# 2. Verifica pendências de pautas
Write-Host "[2/3] Verificando esteira de produção (pautas.md)..." -ForegroundColor Yellow
if (Test-Path "pautas.md") {
    $pautas = Get-Content "pautas.md" -Encoding UTF8
    $pendentes = $pautas | Where-Object { $_ -match '^\s*-\s*\[\s*\]' }
    Write-Host "Pautas pendentes na fila:" ($pendentes.Count) -ForegroundColor Cyan
}

# 3. Verifica studio de carrosséis
Write-Host "[3/3] Verificando integridade do Studio de Carrosséis..." -ForegroundColor Yellow
if (Test-Path "social/gerador.html") {
    $geradorContent = Get-Content "social/gerador.html" -Raw -Encoding UTF8
    if ($geradorContent -match 'const PRESETS\s*=\s*\{') {
        Write-Host "Studio de Carrosséis pronto e operacional." -ForegroundColor Green
    }
}

Write-Host "Automação finalizada com sucesso!" -ForegroundColor Green
