# Roadmap & Diário de Engenharia — Nexus Vault (Aba 3: Viola e Violão)

Este documento registra o backlog de projetos, histórico de implementações e metas do **Engenheiro Autônomo da Aba 3 (Viola Caipira & Violão)** do Nexus Vault.

---

## 🎯 Projeto Prioritário Atual: Fase 6 — Biblioteca Expandida de Ponteios e Intros Clássicas de Viola Caipira

- **Status:** ⏳ Próximo na esteira diária
- **Objetivos Técnicos:**
  1. Mapear e expandir o repertório de ponteios e introduções clássicas com afinação Cebolão em Mi e Cebolão em Ré (ex: *Chico Mineiro*, *Rei do Gado*, *Vaca Estrela e Boi Fubá*, *Ferrugem*, *A Vaca Já Foi Pro Brejo*, *Pagode do Tião*).
  2. Implementar reprodutor interativo passo a passo nota a nota e por compasso com visualização sincronizada no braço SVG (modo Canhoto e Destro) e controle de velocidade para estudo lento (50%, 75%, 100%).
  3. Adicionar renderizador de tablaturas interativas com dedilhado de polegar e indicador destacados.

---

## 📋 Backlog de Inovações Futuras (Projetos Proativos)

O agente autônomo selecionará diariamente o próximo projeto prioritário desta lista:

1. **[x] Módulo de Ritmos Tradicionais Caipiras no Metrônomo:**
   - Adicionados padrões percussivos e de palhetada com áudio sintetizado para: *Cururu*, *Pagode de Viola*, *Cateretê*, *Guarânia*, *Toada* e *Querência*.
2. **[x] Dicionário e Buscador Reverso de Acordes (Canhoto & Destro):**
   - Motor de dedução harmônica algorítmica a partir de digitações livres nas casas ou no braço SVG, identificação de inversões, funções modais caipiras, dedilhado Web Audio e presets curados.
3. **[x] Treinador Auditivo de Afinação e Pares Oitavados (Acoustic Beats Ear Trainer):**
   - Módulo completo de treino perceptivo com simulação física de batimentos acústicos, teste cego em 4 níveis de dificuldade, simulador de cravelha manual em cents, osciloscópio de envoltória em Canvas e patentes de violeiro (Iniciante até Tião Carreiro).
4. **[ ] Biblioteca Expandida de Ponteios e Intros Clássicas:**
   - Mapeamento e reprodução passo a passo de ponteios tradicionais nas terças e sextas com visualização sincronizada no braço e controle de andamento.
5. **[ ] Gerador / Exportador de Tablaturas e Cifras:**
   - Permitir salvar sequências harmônicas montadas em formato de tablatura e diagrama imprimível.

---

## 📝 Histórico de Implementações Diárias

- **05/11/2026 — Sessão 5** (Fase 5 Concluída):
  - **Treinador Auditivo de Afinação & Pares Oitavados (Acoustic Beats Ear Trainer)**:
    - **Síntese Web Audio de Batimentos Acústicos**:
      - Modelagem física da interferência ondulatória entre cordas de referência e cordas com desafinação controlada em cents (microtons).
      - Tratamento acústico específico para pares uníssonos (1º Prima e 2º Segundinha) e pares oitavados (3º Turina, 4º Toeira e 5º Canotilho: bordão grave fundamental com reforço no 2º harmônico gerando interferência audível com a cantadeira fina aguda).
      - Dois modos de emissão sonora: *Dedilhado Caipira Periódico (Pluck)* com ataque rápido e decaimento natural a cada 2.2s, e *Ressonância Contínua (Drone)* para escuta analítica ininterrupta.
    - **Dois Modos Didáticos de Treino**:
      - *Modo 1: Desafio Auditivo Cego (Ear Training)*: teste cego com 4 patentes de dificuldade (Iniciante da Roça: ±25 a ±45 cents, Boiadeiro Afinador: ±12 a ±25 cents, Mestre Violeiro: ±5 a ±12 cents, Tião Carreiro Lendário: ±1.5 a ±5 cents). O usuário avalia se a corda está Abaixo (Flat), em Consonância Pura (0 cents) ou Acima (Sharp), com feedback técnico imediato, cálculo da frequência de batimento ($f_{\text{beat}} = |f_1 - f_2|$) e 4 botões de escuta comparativa (par desafinado, só bordão puro, só cantadeira, par em consonância pura).
      - *Modo 2: Simulador de Cravelha Manual*: afinação tátil em tempo real com slider contínuo de -60 a +60 cents e botões de micro-ajuste (±1, ±5 cents), permitindo ouvir o batimento desacelerar até zerar em tempo real e validando a afinação com cálculo de erro residual em cents e medalhas de mérito.
    - **Visualizador Osciloscópico de Batimentos em Canvas**:
      - Canvas animado em tempo real com `requestAnimationFrame` renderizando a onda composta resultante e a envoltória de modulação de amplitude.
      - Cortina de radar sensorial às cegas durante os testes não revelados e iluminação verde neon na consonância pura.
    - **Sistema de Maestria, Ranks e Gamificação Caipira**:
      - Patentes: *Iniciante da Roça*, *Peão Violeiro*, *Boiadeiro Afinador*, *Mestre Violeiro de Folia* e *Tião Carreiro Lendário*.
      - Pontuação progressiva, bônus multiplicador por sequências de acertos (Streak), taxa de precisão percentual e persistência em LocalStorage via `VaultCore`.
      - Orientações ergonômicas integradas para tocadores Canhotos (Pestana à direita) e Destros.

- **03/11/2026 — Sessão 4** (Fase 4 Concluída):
  - **Dicionário e Buscador Reverso de Acordes (Canhoto & Destro)**:
    - **Motor Algorítmico de Análise Harmônica Reversa (`analyzeReverseChord`)**:
      - Base exaustiva de fórmulas harmônicas (`REVERSE_CHORD_FORMULAS`): Tríades (Maior, Menor, Diminuto, Aumentado, Sus2, Sus4, Power Chord 5), Tétrades (7M, 7, m7, m(7M), m7(♭5), dim7, 6, m6, 7sus4, 7(♯5), 7(♭5)) e Extensões Caipiras (add9, m(add9), 9, 7M(9), m9, 6/9, 7(♭9), 7(♯9), m7(11), 7(13), 7(♭13)).
      - Suporte a omissões de 5ª típicas da viola caipira e deduções de sonoridades abertas / clusters.
      - Identificação algorítmica da nota do baixo e de inversões clássicas (Estado Fundamental, 1ª Inversão - baixo na 3ª, 2ª Inversão - baixo na 5ª, 3ª Inversão - baixo na 7ª, baixo na 9ª).
      - Análise contextual automática de funções harmônicas nas três tonalidades basilares da viola caipira: Mi Maior (nativa Cebolão), Lá Maior (subdominante) e Si Maior (dominante).
    - **Interface Integrada e Interativa**:
      - Seletores por corda/par com botões rápidos `[X]` (mudo) e casas `0` a `12`, informando em tempo real a nota gerada.
      - Presets de digitações consagradas de viola caipira (E solto, B7 tradicional, A caipira, E7M, F#m, C#m, G#m/B, E7, Aadd9, B7(9) Tião Carreiro, D folia, etc.) e violão.
      - Controles rápidos: "Dedilhar Acorde" (com pares oitavados e delay progressivo), transpositor cromático (`♭ -1` e `♯ +1`), "Todas Soltas (0)" e "Abafar (X)".
    - **Integração com o Braço SVG (Modo Canhoto & Destro)**:
      - Chaveador de modo no topo do braço: `🎵 Campo Harmônico`, `🪕 Escalas Duadas` e `🔍 Buscador Reverso`.
      - Projeção imediata no braço com marcadores cromáticos de intervalos (Tônica verde, Terça ciano, Quinta âmbar, Sétima/Sexta roxo, Extensões rosa) e anel dourado no baixo.
      - Clicar nas casas do braço SVG edita a digitação na hora, reproduz a nota acústica e atualiza a análise em tempo real.

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
