# Regras da Esteira Independente de Jogos Infantis e Juvenis — Deo Magalhães

Sempre que você for acionado para planejar, criar, revisar ou publicar **Jogos Terapêuticos Infantis (4 a 11 anos) e Juvenis (12 a 17 anos)** para o site `deomagalhaes.github.io` (`deomagalhaes.com.br`), siga estritamente estas diretrizes inegociáveis.

---

## 1. Independência Operacional e Fila Própria
1. **Isolamento de Esteira:**
   - Este agente opera com planejamento e fila **100% independentes** dos demais agentes do site (não depende de `esteiras-programacao.md`, `pautas.md` ou `jogos-planejamento.md`).
   - A fila oficial exclusiva deste agente é o arquivo raiz **`jogos-infantojuvenis-planejamento.md`** (identificadores `IJ-01`, `IJ-02`, ...).
2. **Dupla Finalidade Clínica Obrigatória (Sessão Terapêutica + Casa com os Pais):**
   - **Para o Terapeuta em Sessão:** Todo jogo deve permitir mediação clínica ativa (escolhas graduadas, treino executivo/emocional sem punição aversiva, modo sem pressão de tempo para crianças ansiosas/TEA, e indicadores claros de autorregulação, controle inibitório ou flexibilidade cognitiva).
   - **Para os Pais em Casa com os Filhos:** Todo jogo deve conter, logo abaixo do tabuleiro/interação, o painel **"👨‍👩‍👧 Guia para Pais (Como Jogar Junto em Casa)"** e **"🩺 Guia de Mediação Clínica (Uso em Sessão)"**, com perguntas abertas práticas, combinados para a rotina familiar e reforçamento positivo afetivo.

---

## 2. Categorização Estrita e Sistema de Tags em `jogos.html`

Todo jogo produzido DEVE ser inserido **EXCLUSIVAMENTE** em `jogos.html` (é terminantemente proibido inserir cards de jogos em `cards-artigos.html` ou `recursos.html`), respeitando a faixa etária e as tags exatas de filtragem:

### A. Categoria por Faixa Etária (`data-age-group` e Grade HTML)
1. **Categoria Infantil (4 a 11 anos):**
   - Deve ser inserido no topo de `<div class="resource-grid-custom" id="grid-infantil">` (dentro de `<section id="categoria-infantil" class="category-section" data-age-section="infantil">`).
   - O elemento `<a class="resource-card-bg-image">` DEVE conter `data-age-group="infantil"`.
2. **Categoria Jovens / Juvenil (12 a 17 anos):**
   - Deve ser inserido no topo de `<div class="resource-grid-custom" id="grid-jovens">` (dentro de `<section id="categoria-jovens" class="category-section" data-age-section="jovens">`).
   - O elemento `<a class="resource-card-bg-image">` DEVE conter `data-age-group="jovens"`.

### B. Tags de Foco Cognitivo e Terapêutico (`data-category` + Tags Visuais)
1. **Atributo `data-category` (Obrigatório para a Toolbar de Filtros de `jogos.html`):**
   Use 1 ou 2 slugs oficiais separados por espaço, escolhidos estritamente dentre:
   - `emocional` — Regulação emocional, identificação de sentimentos, manejo de frustração/raiva/ansiedade, empatia, teoria da mente e habilidades sociais.
   - `funcoes-executivas` — Controle inibitório (PARE-PENSE-AJA / Go-NoGo), atenção sustentada/seletiva, flexibilidade cognitiva, planejamento de rotina e manejo de impulsividade (TDAH/TEA).
   - `memoria` — Memória operacional visuoespacial, memória fonológica/auditiva, retenção sequencial e associação.
   - `logica` — Raciocínio lógico dedutivo/indutivo, resolução de problemas cotidianos, causa e efeito e sequenciamento.
2. **Tags Visuais no Card (`.card-tags-row > .card-tag-pill`):**
   Dentro de `.card-content` do card em `jogos.html`, inclua a linha de tags visuais indicando a faixa etária, o foco principal e o uso clínico/familiar:
   ```html
   <!-- Card de Jogo Infantojuvenil (IJ-XX) -->
   <a href="jogos/jogo-slug.html" 
      class="resource-card-bg-image" data-age-group="infantil" 
      data-category="emocional funcoes-executivas"
      style="background-image: url('assets/imagens/jogo-slug.png');">
       <div class="card-content">
           <div class="card-tags-row">
               <span class="card-tag-pill">🧸 Infantil (4–11 anos)</span>
               <span class="card-tag-pill">Regulação & Impulsos</span>
               <span class="card-tag-pill">Sessão & Família</span>
           </div>
           <h3>Título do Jogo</h3>
           <p>Descrição objetiva e acolhedora para uso em sessão clínica e em casa com os pais.</p>
       </div>
   </a>
   ```
3. **Atualização dos Contadores de `jogos.html`:**
   Sempre que inserir um novo card em `#grid-infantil` ou `#grid-jovens`, atualize também a contagem estática correspondente em `jogos.html` (no Hub `.category-hub-count`, no botão `.age-filter-btn` e no `.category-section-badge` da seção).

---

## 3. Produção Obrigatória de Imagem de Capa (`assets/imagens/jogo-{slug}.png`)
1. **Todo jogo DEVE ter uma imagem de capa própria e condizente com o tema do jogo**, salva em `assets/imagens/jogo-{slug}.png`. É proibido reutilizar capas genéricas de outros jogos.
2. **Geração da Capa:**
   - Utilize o subagente `image-generator` (ou execute o gerador gráfico dedicado `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/gerar-capa-jogo-infantojuvenil.ps1 -Slug "jogo-{slug}" -Theme "<tema>" -AgeGroup "<infantil|jovens>"`) para produzir uma arte de capa exclusiva (800×500 px ou 16:9).
   - **Diretriz Visual da Capa:** Ilustração lúdica, acolhedora e expressiva (para `infantil`) ou moderna, estilizada e dinâmica (para `jovens`), harmonizada com a paleta do site (`#005f73`, `#0a9396`, `#ee9b00`, `#94d2bd`, `#2a9d8f`) e **sem textos sobrepostos na metade inferior**, garantindo leitura limpa do título e das tags no card de `jogos.html`.

---

## 4. Padrão Técnico, Acessibilidade Sensorial e Blindagem (Quality Gate)
1. **Acessibilidade Neuroafirmativa (TEA / TDAH):**
   - Efeitos sonoros acolhedores via `Web Audio API` pura (zero arquivos `.mp3` externos que possam quebrar), acompanhados obrigatoriamente de botão visível **`🔊 Som Ativo / 🔇 Modo Silencioso (Sensibilidade Auditiva)`**.
   - Controles amplos (`min-height: 44px`), feedback visual claro e acolhedor (nunca punitivo ou assustador diante do erro; o erro é tratado como oportunidade de calibração e tentativa).
2. **Identidade e Estrutura HTML Canônica:**
   - Autor: **Deo Magalhães - Neuropsicólogo e Neurocientista (CRP 04/42784)**. Proibido o uso do prefixo "Dr.".
   - Presença obrigatória da `top-bar`, `<header id="main-header">` canônico (com `button.mobile-menu-btn`, `nav#main-nav`, `Home` e `/jogos.html` com `class="active"`) e rodapé `<footer class="main-footer"><div class="container footer-grid">`.
   - Zero LaTeX bruto (`$...$`, `$$...$$`, `\(...\)`) no HTML visível.
   - Codificação estrita em **UTF-8 sem BOM**.
3. **Fluxo de Validação e Publicação:**
   - Atualizar `jogos-infantojuvenis-planejamento.md` marcando o item atual como `✅ **Publicado**` e o seguinte como `⏳ **Próximo da fila**`.
   - Regenerar o sitemap: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-sitemap.ps1`
   - Executar o Quality Gate: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1`
   - Somente com **Total de Erros: 0**, realizar commit e push (`git add`, `git commit -m "feat(jogo-ij): publica jogo infantojuvenil [Nome]"`, `git push origin main`).
