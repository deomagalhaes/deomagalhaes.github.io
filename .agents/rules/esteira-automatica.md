# Automação de Esteiras Contínuas e Blindagem — Deo Magalhães

Este documento estabelece as diretrizes de execução autônoma, persistência de tarefas no sistema operacional e blindagem de codificação do ecossistema [deomagalhaes.com.br](https://deomagalhaes.com.br).

---

## 1. Agendamento Contínuo a Cada 2 Horas (Persistente no Windows)
A produção contínua está automatizada para rodar de 2 em 2 horas de forma 100% autônoma, sem necessidade de intervenção do usuário, mesmo após desligar e ligar o computador:
- **Tarefa Agendada do Windows (Task Scheduler):** `DeoMagalhaes_EsteiraContinua`
  - **Status:** Ativa (`Ready`), disparando a cada 120 minutos.
  - **Script Executor:** `scripts/executar-esteira-autonoma.ps1`
  - **Política de Reinicialização:** `StartWhenAvailable = $true` (se o computador estiver desligado no horário do gatilho, a tarefa roda assim que o sistema inicializa).
  - **Arquivo de Logs:** `logs/esteira-execucoes.log`
  - **Lock File:** `logs/esteira.lock` (previne execuções concorrentes).

---

## 2. Blindagem de Codificação de Caracteres (Regra Estrita)
Para garantir que o Studio Visual (`social/gerador.html`), artigos e testes nunca apresentem caracteres corrompidos por codepage ANSI:
1. **Leitura e Gravação Binária Estrita:**
   - Todo arquivo HTML, JS e MD DEVE ser lido com `[System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)`.
   - A gravação DEVE utilizar UTF-8 sem BOM para a web: `[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding($false)))`.
   - **PROIBIDO:** Usar `Set-Content` padrão ou embutir blocos literais multilinha com acentos dentro de scripts `.ps1` sem UTF-8 com BOM.
2. **Quality Gate Obrigatório:**
   - Antes de qualquer commit, deve ser executado `powershell -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1`.
   - O Quality Gate verifica automaticamente:
     - Zero sequências de codificação corrompida em todo o repositório.
     - Identidade e Autoridade oficial estrita (somente Deo Magalhães - Neuropsicólogo e Neurocientista CRP 04/42784).
     - Presença obrigatória de `class="container article-container"` nos artigos.
     - Presença obrigatória de `class="container footer-grid"` no rodapé.
     - 100% de balanceamento de chaves `{ }` em `social/gerador.html`.

---

## 3. Fluxo de Cada Rodada de Esteira (Os 4 Pilares)
A cada lote de produção, a esteira executa sequencialmente:
1. **Artigo Científico:** Redação profunda em `artigos/slug.html` com referências ABNT e centralização.
2. **Roteiro Social & Studio:** Redação em `social/YYYY-MM-DD-slug.md`, sincronização no histórico de `social/README.md` e injeção do preset no topo de `social/gerador.html` com UTF-8 garantido.
3. **Escala Psicométrica / Teste:** Código ESTRITAMENTE em `testes/teste-slug.html` com cálculo instantâneo client-side e devolutiva clínica por faixas.
4. **Jogo Cognitivo:** Jogo diário ESTRITAMENTE em `jogos/jogo-slug.html` com Web Audio API e validação algorítmica matemática prévia.
5. **Centralizadores:** Segregação estrita de cards: Artigos exclusivamente em `cards-artigos.html`, Testes exclusivamente na grade de `testes.html` (PROIBIDO adicionar testes em `cards-artigos.html`), Jogos em `jogos.html` e Recursos em `recursos.html`. Atualização de `pautas.md`, `testes-planejamento.md`, `jogos-planejamento.md`, `esteiras-programacao.md` e execução de `scripts/generate-sitemap.ps1`.
6. **Deploy:** `git add .`, commit semântico e `git push origin main`.
