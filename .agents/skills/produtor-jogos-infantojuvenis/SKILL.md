---
name: produtor-jogos-infantojuvenis
description: >-
  Agente autônomo construtor de jogos terapêuticos e neurocognitivos infantis (4 a 11 anos) e
  juvenis (12 a 17 anos) para uso em sessões de psicoterapia/neuropsicologia e recomendação aos
  pais para uso em casa com os filhos. Opera esteira própria em jogos-infantojuvenis-planejamento.md,
  gera imagem de capa exclusiva em assets/imagens/jogo-{slug}.png e publica cards categorizados
  com tags corretas em jogos.html. Ative sempre que o usuário pedir para criar, planejar ou rodar
  a esteira de jogos infantis ou juvenis.
---

# Skill: Agente Produtor de Jogos Terapêuticos Infantis e Juvenis

Esta skill orquestra de ponta a ponta o planejamento, design, engenharia client-side, geração de arte de capa e publicação diária de jogos interativos para **crianças (4 a 11 anos)** e **adolescentes/jovens (12 a 17 anos)** no ecossistema `deomagalhaes.github.io`.

> **Diretriz de Execução Autônoma Imediata:** Nunca peça permissão nem faça perguntas antes de iniciar. Ao ser acionado para atuar na esteira de jogos infantojuvenis, inicie diretamente pelo próximo item `⏳ **Próximo da fila**` em `jogos-infantojuvenis-planejamento.md` e execute todo o fluxo até o Quality Gate (0 erros) e atualização da fila.

---

## 🎯 Passo 1: Seleção na Esteira Independente (`jogos-infantojuvenis-planejamento.md`)

1. Leia o arquivo raiz `jogos-infantojuvenis-planejamento.md` (independente de `esteiras-programacao.md` e de `jogos-planejamento.md`).
2. Identifique o próximo jogo marcado com `⏳ **Próximo da fila**` (ou o jogo solicitado pelo usuário).
3. Verifique seus metadados obrigatórios:
   - **ID:** `IJ-XX`
   - **Faixa Etária (`data-age-group`):** `infantil` (4–11 anos, grade `#grid-infantil`) ou `jovens` (12–17 anos, grade `#grid-jovens`).
   - **Tags de Filtro (`data-category`):** combinação de 1 ou 2 tags canônicas (`emocional`, `funcoes-executivas`, `memoria`, `logica`).
   - **Tags Visuais (`.card-tag-pill`):** 3 pílulas curtas para o card (Faixa etária + Habilidade alvo + `Sessão & Família`).
   - **Slug do Arquivo:** `jogos/jogo-{slug}.html` e **Capa:** `assets/imagens/jogo-{slug}.png`.

---

## 🎨 Passo 2: Geração da Imagem de Capa Condizente (`assets/imagens/jogo-{slug}.png`)

Cada jogo DEVE possuir uma imagem de capa exclusiva e temática salva em `assets/imagens/jogo-{slug}.png`:

1. **Opção A (Subagente Gerador de Imagem):**
   - Se a ferramenta `invoke_subagent` com `TypeName: "image-generator"` estiver disponível, solicite uma ilustração digital 16:9 (sem texto sobreposto na metade inferior) condizente com a metáfora clínica e os personagens/elementos do jogo, salvando em `assets/imagens/jogo-{slug}.png`.
2. **Opção B (Motor Gráfico Vetorial Determinístico GDI+):**
   - Execute o script gerador de capas infantojuvenis do repositório:
     ```powershell
     powershell -NoProfile -ExecutionPolicy Bypass -File scripts/gerar-capa-jogo-infantojuvenil.ps1 -Slug "jogo-{slug}" -Theme "<tema>" -AgeGroup "<infantil|jovens>"
     ```
   - Temas suportados pelo gerador vetorial: `tartaruga-semaforo`, `vulcao-calma`, `detetive-social`, `mochila-executiva`, `bussola-escolha`, `constelacao-memoria`, `radar-emocoes`, `ponte-empatia`, `laboratorio-foco`, `escudo-ansiedade`.
3. Confirme que o arquivo `assets/imagens/jogo-{slug}.png` existe e possui tamanho `> 10 KB` antes de criar o card em `jogos.html`.

---

## 🧩 Passo 3: Engenharia do Jogo Terapêutico (`jogos/jogo-{slug}.html`)

Utilize como base estrutural o template canônico em [resources/template-jogo-infantojuvenil.html](./resources/template-jogo-infantojuvenil.html) e implemente um jogo **100% funcional, interativo e sem código mockado**:

1. **Mecânica Dupla ou Progressiva (Engajamento Real em Sessão e em Casa):**
   - **Modos de Jogo:** Ofereça pelo menos 2 modos ou níveis adaptados (ex.: *Modo Treino Lúdico / Ação* + *Modo Missões da Vida Real / Dilemas para Conversar com Pais ou Terapeuta*).
   - **Feedback Construtivo e Regulador:** Nunca use mensagens punitivas ("Você perdeu!", "Errado!"). Quando a criança/jovem comete um erro ou age por impulso, exiba um feedback acolhedor de calibração (ex.: *"Quase lá! Vamos respirar fundo e observar a pista com calma?"*) que ensine a estratégia metacognitiva ou emocional na prática.
   - **Ferramenta de Regulação Integrada:** Sempre que o jogo envolver regulação emocional ou controle inibitório, inclua um botão/modal rápido de **"🐢 Pausa de Regulação (Respiração Guiada 4s)"** para o terapeuta ou os pais usarem junto com a criança durante a partida.
2. **Web Audio API Sensorialmente Segura:**
   - Implemente sons sintetizados suaves via `AudioContext` (acordes harmônicos em ondas `sine` e `triangle`), com botão visível de **Som Ativo / Modo Silencioso (`🔊 / 🔇`)** para crianças com TEA ou hipersensibilidade auditiva.
3. **Persistência Local e Certificado Imprimível (`localStorage` + `@media print`):**
   - Salve a pontuação, estrelas conquistadas e missões completas no `localStorage`.
   - Inclua um botão **"🖨️ Imprimir Resumo / Certificado da Sessão"** ou **"📲 Enviar Conquista para os Pais (WhatsApp)"** para reforçar o vínculo entre consultório, escola e família.
4. **Seção Obrigatória de Mediação (Terapeuta & Pais):**
   - Ao final do jogo, inclua sempre dois blocos práticos lado a lado:
     - **🩺 Como Usar na Sessão de Terapia (Guia Clínico):** O que observar no comportamento da criança/adolescente, como fazer o *scaffolding* (andaime cognitivo) e quais perguntas socráticas realizar.
     - **👨‍👩‍👧 Como Usar em Casa com os Filhos (Guia para Pais):** Como jogar em família por 10 minutos sem tom de cobrança, como validar emoções e como transferir o aprendizado do jogo para situações reais da rotina (hora da tarefa, frustrações, uso de telas, convivência com irmãos).

---

## 🔄 Passo 4: Integração em `jogos.html`, Atualização da Fila e Quality Gate

1. **Inserir Card na Categoria e Tags Corretas em `jogos.html`:**
   - Se `infantil` (4–11 anos): insira o card no topo de `#grid-infantil` com `data-age-group="infantil"`.
   - Se `jovens` (12–17 anos): insira o card no topo de `#grid-jovens` com `data-age-group="jovens"`.
   - Defina `data-category` usando apenas os slugs canônicos (`emocional`, `funcoes-executivas`, `memoria`, `logica`) e inclua `.card-tags-row` com 3 `.card-tag-pill`.
   - Atualize os contadores da categoria correspondente em `jogos.html`.
2. **Atualizar a Fila Independente (`jogos-infantojuvenis-planejamento.md`):**
   - Marque o jogo atual como `✅ **Publicado**` e avance o marcador `⏳ **Próximo da fila**` para o item seguinte.
3. **Executar Sitemap e Quality Gate:**
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-sitemap.ps1
   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1
   ```
   Somente finalize ou faça commit/push se o resultado do Quality Gate for **Total de Erros: 0**.
