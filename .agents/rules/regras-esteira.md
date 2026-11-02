# Diretriz Canônica e Governança de Esteiras Contínuas — Deo Magalhães

Este documento estabelece as regras unificadas de execução, governança de qualidade, blindagem arquitetural e fluxo de produção contínua para o ecossistema [deomagalhaes.com.br](https://deomagalhaes.com.br).

---

## 1. Princípio dos 4 Pilares Obrigatórios

Toda e qualquer rodada de lote de esteira contínua deve entregar OBRIGATORIAMENTE os quatro pilares sincronizados:

1. **Pilar 1 — Artigo Científico de Alta Densidade (`artigos/slug.html`):**
   - Autor canônico: **Deo Magalhães - Neuropsicólogo e Neurocientista (CRP 04/42784)**. É terminantemente proibido o prefixo "Dr.".
   - Tom: Acadêmico-clínico, profundo, humanista e existencial, integrando neurociência com psicologia baseada em evidências (TCC, ACT, Teoria do Apego, Logoterapia) e teoria crítica/filosofia.
   - Container principal com classes obrigatórias: `<div class="container article-container">`.
   - Cabeçalho padronizado `#main-header` e rodapé institucional `.container.footer-grid`.
   - Referências bibliográficas completas no padrão ABNT ao final.
   - Card inserido **EXCLUSIVAMENTE** no topo de `cards-artigos.html` com o atributo `data-categories` canônico.

2. **Pilar 2 — Roteiro Social & Studio Visual (`social/` e `social/gerador.html`):**
   - Roteiro canônico de 6 a 7 slides salvo em `social/YYYY-MM-DD-slug.md` com legenda, gancho, CTA e hashtags.
   - Registro e atualização do histórico em `social/README.md`.
   - **Injeção do Preset no Studio Visual (`social/gerador.html`):**
     - Adicionar `<option value="slug-curto" selected>Título</option>` no topo do seletor `#articleSelect`.
     - Inserir o preset no topo do objeto `const PRESETS = { ... }` com codificação UTF-8 estrita.
     - Atualizar as variáveis de estado inicial (`currentPresetKey`, `currentSlides`, `currentCaption`) para carregar o novo preset por padrão.

3. **Pilar 3 — Escala Psicométrica / Teste Interativo (`testes/teste-slug.html`):**
   - Instrumento autoaplicável baseado em literatura validada (ex: DSM-5-TR, ITQ, PG-13, Neff, etc.).
   - Cálculo 100% *client-side* seguro e privado (sem envio de dados para servidores).
   - Devolutiva clínica imediata contextualizada por faixas de pontuação com orientações psicoeducativas.
   - Card inserido **EXCLUSIVAMENTE** na grade de `testes.html`. **PROIBIDO** inserir cards de testes em `cards-artigos.html`.

4. **Pilar 4 — Jogo Cognitivo Diário (`jogos/jogo-slug.html`):**
   - Jogo cognitivo com lógica e solubilidade matemática prévia comprovada (100% de estados resolúveis).
   - Efeitos sonoros procedurais via Web Audio API e persistência de pontuação no `localStorage`.
   - **Imagem Temática Exclusiva Obrigatória:** Todo jogo deve possuir sua respectiva arte temática conceitual salva em `assets/imagens/jogo-{slug}.png` (estilo minimalista/geométrico, paleta institucional `#005f73`, `#0a9396`, `#ee9b00`, `#94d2bd`, sem tipografia sobreposta).
   - Card inserido **EXCLUSIVAMENTE** na grade de `jogos.html` com background apontando para a sua arte.

---

## 2. Blindagem de Qualidade e Critérios Técnicos (Quality Gate)

Antes de qualquer commit, a integridade do ecossistema deve ser validada via:
`powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1`

Critérios obrigatórios checados automaticamente:
1. **Zero Corrupção de Caracteres (UTF-8 estrito):** Leitura e gravação de arquivos com UTF-8 sem BOM. Proibido mojibake.
2. **Identidade Institucional:** Autor exclusivo "Deo Magalhães - Neuropsicólogo e Neurocientista (CRP 04/42784)". Sem uso de "Dr.".
3. **Menu Canônico:** Presença de `<header id="main-header">`, `<button class="mobile-menu-btn">`, `<nav id="main-nav">` com itens: `Home`, `Sobre`, `Serviços`, `Agendamento`, `Artigos`, `Testes`, `Jogos`, `Recursos`. Proibido `id="navbar"`, `id="menu-toggle"`, `class="nav-links"`, `Início` ou `contato.html` na barra superior.
4. **Layout Responsivo Centralizado:** Artigos com `.container.article-container` e rodapé com `.container.footer-grid`.
5. **Zero LaTeX Bruto em HTML e Social:** Proibição terminante de delimitadores `$ ... $`, `$$`, `\(...\)`, `\[...\]` e comandos como `\neg`, `\land`, `\lor`, `\to`, `\forall`, `\exists`, etc. Toda notação científica e lógica deve empregar caracteres Unicode nativos combinados com tags HTML semânticas (`<em>P</em>`, `<sub>`, `<sup>`). Reforçado por Git pre-commit hook e sanitizador client-side em `assets/script.js`.
6. **Balanceamento de Sintaxe no Studio:** Objeto `PRESETS` de `social/gerador.html` com chaves `{ }` 100% íntegras.

---

## 3. Gestão e Sincronização de Filas

A esteira opera sob fila coordenada:
- **Matriz Mestra Unificada:** `esteiras-programacao.md` (registra o status global dos lotes de 1 a N).
- **Fila de Artigos:** `pautas.md`.
- **Fila de Testes e Escalas:** `testes-planejamento.md`.
- **Fila de Jogos:** `jogos-planejamento.md`.
- **Fila de Ferramentas Clínicas:** `ferramentas-planejamento.md`.

---

## 4. Fluxo de Publicação e Deploy (Git Flow)

1. Selecionar o lote marcado com `⏳ **Próximo da Fila**` em `esteiras-programacao.md`.
2. Desenvolver os 4 pilares completos conforme as regras acima.
3. Atualizar `cards-artigos.html`, `testes.html`, `jogos.html` e `social/README.md`.
4. Atualizar o status do lote em `esteiras-programacao.md` e nos arquivos de fila específicos para `✅ **Concluído**`.
5. Regenerar o sitemap:
   `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-sitemap.ps1`
6. Executar o Quality Gate:
   `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1`
7. Efetuar o commit e deploy:
   - `git add .`
   - `git commit -m "feat(esteira): publica [artigo], [teste], [jogo] e [carrossel visual]"`
   - `git push origin main`
