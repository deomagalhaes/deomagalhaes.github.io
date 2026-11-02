# Roadmap & Diário de Engenharia — Nexus Vault (Aba 3: Viola e Violão)

Este documento registra o backlog de projetos, histórico de implementações e metas do **Engenheiro Autônomo da Aba 3 (Viola Caipira & Violão)** do Nexus Vault.

---

## 🎯 Projeto Prioritário Atual: Fase 4 — Dicionário e Buscador Reverso de Acordes (Canhoto & Destro)

- **Status:** ⏳ Próximo na esteira diária
- **Objetivos Técnicos:**
  1. Permitir que o músico clique e posicione os dedos em quaisquer casas das cordas/pares da Viola (Cebolão em Mi) ou Violão (6 Cordas) em modo Canhoto/Destro.
  2. Implementar motor algorítmico de análise harmônica que calcule as notas tocadas (pitch classes), identifique os intervalos em relação a cada possível tônica e batize o acorde (ex: E7M, F#m7, B7(9), C#m7(11), etc.).
  3. Exibir graus, notas formadoras, função harmônica provável nas tonalidades de Mi Maior / Lá Maior / Si Maior e botão para dedilhar a digitação customizada.

---

## 📋 Backlog de Inovações Futuras (Projetos Proativos)

O agente autônomo selecionará diariamente o próximo projeto prioritário desta lista:

1. **[x] Módulo de Ritmos Tradicionais Caipiras no Metrônomo:**
   - Adicionados padrões percussivos e de palhetada com áudio sintetizado para: *Cururu*, *Pagode de Viola*, *Cateretê*, *Guarânia*, *Toada* e *Querência*.
2. **[ ] Dicionário e Buscador Reverso de Acordes:**
   - Clicar nas casas do braço canhoto/destro e o sistema identificar o nome do acorde, intervalos e notas formadoras.
3. **[ ] Treinador Auditivo de Afinação e Pares Oitavados:**
   - Exercício interativo para afinar de ouvido os pares 3º, 4º e 5º (oitavados) e 1º e 2º (uníssonos).
4. **[ ] Biblioteca Expandida de Ponteios e Intros Clássicas:**
   - Mapeamento e reprodução passo a passo de ponteios tradicionais nas terças e sextas com visualização sincronizada no braço.
5. **[ ] Gerador / Exportador de Tablaturas:**
   - Permitir salvar sequências harmônicas montadas em formato de tablatura e diagrama imprimível.

---

## 📝 Histórico de Implementações Diárias

- **02/11/2026 — Sessão 3** (Fase 3 Concluída):
  - **Módulo de Ritmos Tradicionais Caipiras & Padrões de Palhetada no Metrônomo**:
    - **Biblioteca Autêntica de Ritmos Caipiras**:
      - *Cururu Tradicional* (`2/4` cadenciado com batida no tampo)
      - *Pagode de Viola de Tião Carreiro* (`2/4` sincopado com repique de dedos no tampo em semicolcheias)
      - *Cateretê / Catira* (`2/4` com corte abafado seco de palma)
      - *Guarânia Romântica* (`3/4` ternário lento com ressonância profunda)
      - *Toada Caipira* (`6/8` com alternância de bordão, tampo e pares agudos)
      - *Querência / Valsa Caipira* (`3/4` tradicional com baixo no 1º tempo e acordes no 2º e 3º)
    - **Síntese Web Audio Percussiva Realista**:
      - `playWoodTap`: modelagem física do tampo oco de pinho/jacarandá (oscilador triangle 148Hz→45Hz com envelope percussivo rápido + gerador de ruído com filtro passa-banda em 260Hz com Q=3.2).
      - `playThumbBass`: bordão de ataque grave, opcionalmente sincronizado com as notas do acorde ativo no Campo Harmônico (`rhythmChordSync`).
      - `playRasqueado`: dedilhado em leque em todas as cordas com delay escalonado de 8ms entre pares.
      - `playIndexUp`: puxada rápida ascendente nos pares 1º e 2º (prima e segundinha).
      - `playMuteChock`: corte percussivo abafado com ruído passa-banda em 840Hz simulando a mão abafando as cordas de aço.
    - **Régua Interativa de Palhetadas com Guia Visual e Feedback Neon**:
      - Cards dinâmicos exibindo número do pulso (`1`, `1 e`, `2`, `2 e`...), seta direcional (`↓`, `↑`, `✕`, `■`, `·`), técnica e detalhe acústico.
      - Iluminação neon sincronizada em tempo real via `requestAnimationFrame` e fila do lookahead scheduler.
      - Alternância de modo entre **Ritmo Caipira** e **Metrônomo Analítico**, com mixagem de volume da caixa/tampo e clique guia simultâneo opcional.
      - Orientação ergonômica adaptada nativamente para mãos Canhotas e Destras.

- **02/11/2026 — Sessão 2** (Fase 2 Concluída):
  - **Módulo de Estudos de Progressão Harmônica & Cadências Caipiras**:
    - Implementada biblioteca canônica de progressões harmônicas:
      - *Moda & Cururu Tradicional* (`I – IV – V7 – I`)
      - *Toada Sentimental* (`I – V7 – IV – I`)
      - *Turnaround / Lamento Caipira* (`I – vi – ii – V7`)
      - *Moda em Tom Menor* (`i – iv – V7 – i`)
      - *Quatro Acordes Mágicos / Pop Sertanejo* (`I – V – vi – IV`)
      - *Cadência II – V – I com Tétrades* (`ii7 – V7 – I7M`)
      - *Ponteio Diatônico Ascendente* (`I – ii – iii – IV – V`)
    - **Régua Interativa de Compassos**: cards detalhados por compasso com número do compasso, grau romano, nome do acorde, notas formadoras, função harmônica e casas no braço.
    - **Player Sequenciador de Áudio Web Audio**: reprodução contínua da progressão em tempo real sincronizada ao BPM, com dedilhado acústico e atualização dinâmica do braço SVG canhoto/destro.
    - **Controles de Estudo**: seletor de compasso/tempos por acorde (2, 4 ou 8 tempos), alternador de Loop contínuo para treino ininterrupto e clique individual nos cards para estudo ponto a ponto.

- **02/11/2026 — Sessão 1** (Fase 1 Concluída):
  - **Expansão Completa do Campo Harmônico & Shapes**:
    - Mapeadas todas as 12 tonalidades maiores (Mi, Lá, Si, Ré, Sol, Dó, Fá, Si♭, Mi♭, Lá♭, Ré♭, Fá#) e tonalidades menores clássicas.
    - Suporte a alternância dinâmica entre **Tríades** e **Tétrades com 7ª** (`7M`, `m7`, `7`, `m7(♭5)`), com exibição de graus romanos estilizados (`I7M`, `ii7`, `iii7`, `IV7M`, `V7`, `vi7`, `viiø`).
    - Inclusão de biblioteca curada de múltiplos shapes por acorde tanto para Viola Caipira (Cebolão em Mi) quanto para Violão Padrão (6 cordas), com alternador visual de variações de shape ao longo do braço.
    - Atualização do renderizador SVG do braço canhoto/destro com novo código cromático de intervalos (verde para Tônica, ciano para Terça, âmbar para Quinta e roxo para Sétima).
  - Inicialização do sidecar diário do Engenheiro Autônomo e calibração das permissões.
