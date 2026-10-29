$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir

# =========================================================================
# 1. Padronizar pomodoro-neuro.html
# =========================================================================
$pomoPath = Join-Path $repoDir "recursos\pomodoro-neuro.html"
if (Test-Path $pomoPath) {
    $pomo = [System.IO.File]::ReadAllText($pomoPath, [System.Text.Encoding]::UTF8)
    
    # Remover styles inlines escuros da top-bar e header
    $pomo = $pomo.Replace('<div class="top-bar" style="background-color: #060b13;">', '<div class="top-bar">')
    $pomo = $pomo.Replace('<header id="main-header" style="background-color: #0d1829; border-bottom: 1px solid #1e293b;">', '<header id="main-header">')
    $pomo = $pomo.Replace('<span class="name" style="color: #ffffff;">', '<span class="name">')
    $pomo = $pomo.Replace('<span class="subtitle" style="color: #94a3b8;">', '<span class="subtitle">')
    $pomo = $pomo.Replace('<button class="mobile-menu-btn" aria-label="Abrir menu" style="color: white;">☰</button>', '<button class="mobile-menu-btn" aria-label="Abrir menu">☰</button>')
    
    # Adicionar script.js se não existir
    if (-not $pomo.Contains('script.js')) {
        $pomo = $pomo.Replace('</body>', '    <script src="../assets/script.js"></script>`r`n</body>')
    }
    
    [System.IO.File]::WriteAllText($pomoPath, $pomo, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "pomodoro-neuro.html padronizado."
}

# =========================================================================
# 2. Padronizar descompositor-tarefas.html, rpd-digital.html, leitor-storybooks.html
# =========================================================================
$tools = @("descompositor-tarefas.html", "rpd-digital.html", "leitor-storybooks.html")
foreach ($t in $tools) {
    $p = Join-Path $repoDir "recursos\$t"
    if (Test-Path $p) {
        $txt = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
        if (-not $txt.Contains('script.js')) {
            $txt = $txt.Replace('</body>', '    <script src="../assets/script.js"></script>`r`n</body>')
            [System.IO.File]::WriteAllText($p, $txt, (New-Object System.Text.UTF8Encoding($false)))
            Write-Host "$t atualizado com script.js."
        }
    }
}

# =========================================================================
# 3. Padronizar explorador-dois-mundos/index.html
# =========================================================================
$expPath = Join-Path $repoDir "recursos\explorador-dois-mundos\index.html"
if (Test-Path $expPath) {
    $exp = [System.IO.File]::ReadAllText($expPath, [System.Text.Encoding]::UTF8)
    
    # Injetar stylesheet do site
    if (-not $exp.Contains('assets/style.css')) {
        $exp = $exp.Replace('</head>', '  <link rel="stylesheet" href="../../assets/style.css">`r`n</head>')
    }
    
    # Injetar top-bar e main-header padrão logo após <body>
    if (-not $exp.Contains('id="main-header"')) {
        $stdHeader = @"
  <!-- Top Bar Padrão -->
  <div class="top-bar">
    <div class="container top-bar-content">
      <div class="top-bar-left">
        <a href="https://wa.me/5535933003807" target="_blank" title="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></a>
        <a href="mailto:contato@deomagalhaes.com.br" title="E-mail"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>
      </div>
      <div class="top-bar-right">
        <a href="https://instagram.com/deomagalhaesneuro" target="_blank" title="Instagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
        <a href="https://maps.app.goo.gl/RzFpdi8WWzzNNHM96" target="_blank" title="Localização"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></a>
      </div>
    </div>
  </div>

  <!-- Header Padrão -->
  <header id="main-header">
    <div class="header-content container">
      <a href="../../index.html" class="logo-container">
        <img src="../../assets/logo-deo.png" alt="Logotipo Deo Magalhães">
        <div class="logo-text">
          <span class="name">Deo Magalhães</span>
          <span class="subtitle">Neurociência e Comportamento</span>
        </div>
      </a>
      <button class="mobile-menu-btn" aria-label="Abrir menu">☰</button>
      <nav id="main-nav">
        <a href="../../index.html">Home</a>
        <a href="../../sobre.html">Sobre</a>
        <a href="../../servicos.html">Serviços</a>
        <a href="../../agendamento.html">Agendamento</a>
        <a href="../../artigos.html">Artigos</a>
        <a href="../../testes.html">Testes</a>
        <a href="../../jogos.html">Jogos</a>
        <a href="../../recursos.html" class="active">Recursos</a>
      </nav>
    </div>
  </header>
"@
        $exp = $exp.Replace('<body>', "<body>`r`n$stdHeader")
    }
    
    # Injetar script.js no final
    if (-not $exp.Contains('assets/script.js')) {
        $exp = $exp.Replace('</body>', '  <script src="../../assets/script.js"></script>`r`n</body>')
    }
    
    [System.IO.File]::WriteAllText($expPath, $exp, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "explorador-dois-mundos/index.html padronizado."
}
