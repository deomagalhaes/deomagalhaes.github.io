# Regras de Produção de Recursos Clínicos e Lab Pessoal — Deo Magalhães

Sempre que você for solicitado a criar, revisar, expandir ou publicar ferramentas interativas, utilitários clínicos ou módulos do Lab Pessoal no ecossistema `deomagalhaes.github.io` (`deomagalhaes.com.br`), siga estritamente estas diretrizes inegociáveis:

## 1. Arquitetura Zero-Backend, Privacidade e Conformidade LGPD
1. **Isolamento Total de Dados (100% Client-Side):**
   - Nenhuma informação clínica de pacientes, respostas de instrumentos ou dados pessoais do administrador deve transitar por servidores proprietários ou bancos externos (proibido usar Supabase, Firebase ou APIs intermediárias para persistência).
   - Toda persistência deve utilizar exclusivamente `localStorage` ou `IndexedDB` no navegador do próprio usuário.
   - Todo recurso com estado persistente DEVE oferecer funções nativas e reais de **Exportar Backup (`.json` / `.csv` / Impressão PDF A4)** e **Importar Backup (`.json`)**, além de botão de limpeza rápida de dados locais.
2. **Proibição Estrita de Código Mockado ou Placeholders:**
   - Todos os motores matemáticos, estatísticos (ex.: função erro de Gauss `erf` e inversa `erfinv`), sintetizadores/metrônomos em `Web Audio API`, ações em lote (*batch actions*), cópias *rich-text* (`ClipboardItem` com `text/html`) e geradores de relatórios devem conter implementação algorítmica 100% funcional e testada.

## 2. Separação Estrita de Ambientes e Taxonomia

### Ambiente 1 — Portal Público e Clínico (`recursos/` e `/ferramentas-clinicas/`)
- **Localização Canônica:** Os arquivos individuais das ferramentas públicas DEVEM residir em `recursos/<slug>.html`.
- **Centralizadores Oficiais:**
  - Grade geral categorizada em `recursos.html` (acessível no menu principal `#main-header`).
  - Hub Clínico Dedicado em `ferramentas-clinicas/index.html` (voltado a profissionais, pais em acompanhamento ABA e pacientes).
  - Fila oficial controlada em `ferramentas-planejamento.md`.
  - **PROIBIÇÃO TAXONÔMICA:** NUNCA adicionar cards de ferramentas (`recursos/...`) dentro de `cards-artigos.html`.
- **Design System Público:**
  - Minimalista, acadêmico, sóbrio e acolhedor: tons de ardósia (`#1e293b`, `#334155`), azul-petróleo profundo institucional (`#005f73`, `#0a9396`), destaque âmbar sutil (`#ee9b00`) e fundo claro (`#f8fafc` / `#f9f6ee`).
  - Tipografia: `Inter` / `Merriweather` / `Outfit`, TailwindCSS (CDN), Lucide Icons e folha institucional `/assets/style.css`.
  - **Cabeçalho e Rodapé Obrigatórios:** Presença obrigatória da `top-bar`, `<header id="main-header">` canônico (com `button.mobile-menu-btn`, `nav#main-nav`, `Home` e os 8 links oficiais; proibido `Início` ou `contato.html`) e `<footer class="main-footer"><div class="container footer-grid">`.
  - **Identidade Institucional:** Sempre `Deo Magalhães - Neuropsicólogo e Neurocientista (CRP 04/42784)`. É terminantemente proibido usar o prefixo "Dr." antes de Deo Magalhães.

### Ambiente 2 — Lab Pessoal Oculto (`/nexus-vault/`)
- **Sigilo Profissional de Instrumentos Psicométricos Restritos:**
  - Toda estação de correção psicométrica, apuração de testes neuropsicológicos (ex.: WASI, WISC-IV/WAIS-III, FDT, SRS-2, BPA-2, RAVLT) e gerador técnico de tabelas ABNT para laudos DEVE residir **exclusivamente** dentro de `/nexus-vault/`, protegida por PIN e jamais exposta no portal público.
- **Isolamento e Invisibilidade:**
  - Acessível apenas pela rota não listada `/nexus-vault/index.html` ou via atalho global `Ctrl+Shift+L` acionando modal minimalista de PIN validado por hash criptográfico `SHA-256` (nunca expor o PIN nem a string literal `"nexus-vault"` em arquivos públicos HTML/JS, `sitemap.xml` ou `robots.txt`).
  - Toda página do Lab Pessoal DEVE conter `<meta name="robots" content="noindex, nofollow, noarchive">` no `<head>`.
  - Nenhum dado pessoal sensível (como nomes próprios de familiares) deve ser gravado de forma fixa (*hardcoded*) no código-fonte estático versionado no Git; utilize sempre campos configuráveis salvos apenas no `localStorage` do dispositivo.
- **Design System do Lab Pessoal:**
  - Estilo *Dark Mode Technical Dashboard* (`#090d16`, `#0f172a`, bordas `#1e293b`, acentos ciano/esmeralda/âmbar de alto contraste), alta densidade de informação, atalhos rápidos e botão global no topo para **Exportar / Importar Banco de Dados Completo (`.json`)**.

## 3. Responsividade, Impressão e Blindagem Anti-LaTeX
1. **Operação Mobile com Uma Mão Só:** Ferramentas de registro em tempo real (como Registrador ABC e Gestão Fitotécnica de Bonsai) devem priorizar botões de toque amplos (`min-height: 44px`), chips de seleção rápida e ações acessíveis ao polegar em telas de smartphones.
2. **Folha de Impressão Limpa (`@media print`):** Recursos geradores de relatórios, diários clínicos e quadros infantis devem ocultar menus, botões e barras de navegação na impressão (`.no-print`), formatando a saída limpa para folha A4.
3. **Zero LaTeX Bruto em HTML:** É terminantemente proibido escrever `$ ... $`, `$$ ... $$`, `\(...\)` ou comandos `\frac`, `\le`, `\ge`, `\div`, `\times` no HTML visível. Utilize sempre tags HTML semânticas (`<em>`, `<sub>`, `<sup>`) combinadas com caracteres Unicode nativos (`−`, `×`, `÷`, `≤`, `≥`, `≈`, `±`).
4. **Codificação e Quality Gate:** Gravar todos os arquivos estritamente em **UTF-8 sem BOM** e validar obrigatoriamente com `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1` antes de qualquer commit.
