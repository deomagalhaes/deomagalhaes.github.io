# scripts/update-links-and-nav.ps1
$ErrorActionPreference = 'Stop'
$repoDir = Split-Path -Parent $PSScriptRoot

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Replace-In-File($relPath, $replacements) {
    $fullPath = Join-Path $repoDir $relPath
    if (-not (Test-Path $fullPath)) { return }
    $content = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)
    $modified = $false
    foreach ($entry in $replacements) {
        $find = $entry.Find
        $replace = $entry.Replace
        if ($content.Contains($find)) {
            $content = $content.Replace($find, $replace)
            $modified = $true
        }
    }
    if ($modified) {
        [System.IO.File]::WriteAllText($fullPath, $content, $utf8NoBom)
        Write-Host "Atualizado: $relPath" -ForegroundColor Green
    }
}

# 1. cards-artigos.html
Write-Host "Atualizando cards-artigos.html..." -ForegroundColor Cyan
Replace-In-File "cards-artigos.html" @(
    @{ Find = 'href="artigos/teste-'; Replace = 'href="testes/teste-' },
    @{ Find = 'href="recursos/escala-regulacao-emocional.html"'; Replace = 'href="testes/escala-regulacao-emocional.html"' }
)

# 2. index.html
Write-Host "Atualizando index.html..." -ForegroundColor Cyan
Replace-In-File "index.html" @(
    @{ Find = 'href="artigos/teste-'; Replace = 'href="testes/teste-' },
    @{ Find = 'href="recursos/escala-regulacao-emocional.html"'; Replace = 'href="testes/escala-regulacao-emocional.html"' },
    @{ Find = '<a href="artigos.html">Artigos</a>'; Replace = "<a href=`"artigos.html`">Artigos</a>`n                <a href=`"testes.html`">Testes</a>" }
)

# 3. jogos.html
Write-Host "Atualizando jogos.html..." -ForegroundColor Cyan
Replace-In-File "jogos.html" @(
    @{ Find = 'href="recursos/jogo-'; Replace = 'href="jogos/jogo-' },
    @{ Find = 'href="recursos/0-'; Replace = 'href="jogos/0-' },
    @{ Find = 'href="recursos/jogos/cronicas-dos-emissarios'; Replace = 'href="jogos/cronicas-dos-emissarios' },
    @{ Find = '<a href="artigos.html">Artigos</a>'; Replace = "<a href=`"artigos.html`">Artigos</a>`n                <a href=`"testes.html`">Testes</a>" }
)

# 4. recursos.html
Write-Host "Atualizando recursos.html..." -ForegroundColor Cyan
Replace-In-File "recursos.html" @(
    @{ Find = 'href="recursos/escala-regulacao-emocional.html"'; Replace = 'href="testes/escala-regulacao-emocional.html"' },
    @{ Find = 'href="recursos/jogos/cronicas-dos-emissarios'; Replace = 'href="jogos/cronicas-dos-emissarios' },
    @{ Find = '<a href="artigos.html">Artigos</a>'; Replace = "<a href=`"artigos.html`">Artigos</a>`n                <a href=`"testes.html`">Testes</a>" }
)

# 5. artigos.html
Write-Host "Atualizando artigos.html..." -ForegroundColor Cyan
Replace-In-File "artigos.html" @(
    @{ Find = 'href="recursos/escala-regulacao-emocional.html"'; Replace = 'href="testes/escala-regulacao-emocional.html"' },
    @{ Find = '<a href="artigos.html" class="active">Artigos</a>'; Replace = "<a href=`"artigos.html`" class=`"active`">Artigos</a>`n                <a href=`"testes.html`">Testes</a>" },
    @{ Find = '<a href="artigos.html">Artigos</a>'; Replace = "<a href=`"artigos.html`">Artigos</a>`n                <a href=`"testes.html`">Testes</a>" }
)

# 6. Páginas institucionais de navegação
$navPages = @("sobre.html", "servicos.html", "agendamento.html", "contato.html", "storybooks.html", "obrigado.html", "avaliacao.html", "atendimento-adulto.html", "atendimento-infantil.html")
foreach ($p in $navPages) {
    Replace-In-File $p @(
        @{ Find = '<a href="artigos.html">Artigos</a>'; Replace = "<a href=`"artigos.html`">Artigos</a>`n                <a href=`"testes.html`">Testes</a>" }
    )
}

# 7. Páginas de categoria
$catPages = Get-ChildItem -Path $repoDir -Filter "categoria-*.html"
foreach ($cp in $catPages) {
    Replace-In-File $cp.Name @(
        @{ Find = '<a href="artigos.html">Artigos</a>'; Replace = "<a href=`"artigos.html`">Artigos</a>`n                <a href=`"testes.html`">Testes</a>" }
    )
}

# 8. Arquivos de documentação / planejamento
Write-Host "Atualizando arquivos de planejamento..." -ForegroundColor Cyan
Replace-In-File "testes-planejamento.md" @(
    @{ Find = '`artigos/teste-'; Replace = '`testes/teste-' },
    @{ Find = '`recursos/escala-regulacao-emocional.html`'; Replace = '`testes/escala-regulacao-emocional.html`' },
    @{ Find = 'artigos/teste-'; Replace = 'testes/teste-' }
)

Replace-In-File "jogos-planejamento.md" @(
    @{ Find = '`recursos/jogo-'; Replace = '`jogos/jogo-' },
    @{ Find = 'recursos/jogo-'; Replace = 'jogos/jogo-' }
)

Replace-In-File "esteiras-programacao.md" @(
    @{ Find = 'artigos/teste-slug.html'; Replace = 'testes/teste-slug.html' },
    @{ Find = 'recursos/jogo-slug.html'; Replace = 'jogos/jogo-slug.html' }
)

# 9. Links pontuais em ferramentas e artigos
$crossLinkFiles = @(
    "recursos/descompositor-tarefas.html",
    "recursos/rpd-digital.html",
    "recursos/pomodoro-neuro.html",
    "recursos/leitor-storybooks.html",
    "artigos/neurobiologia-empatia-teoria-da-mente-contagio-emocional.html",
    "artigos/regulacao-emocional-vs-supressao-engolir-choro.html"
)
foreach ($clf in $crossLinkFiles) {
    Replace-In-File $clf @(
        @{ Find = 'recursos/escala-regulacao-emocional.html'; Replace = 'testes/escala-regulacao-emocional.html' },
        @{ Find = '../recursos/escala-regulacao-emocional.html'; Replace = '../testes/escala-regulacao-emocional.html' },
        @{ Find = '/recursos/escala-regulacao-emocional.html'; Replace = '/testes/escala-regulacao-emocional.html' }
    )
}

Write-Host "Atualização de links concluída com sucesso!" -ForegroundColor Cyan
