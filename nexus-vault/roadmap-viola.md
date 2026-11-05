# Roadmap & Diário de Engenharia — Nexus Vault (Aba 3: Viola e Violão)

Este documento registra o backlog de projetos, histórico de implementações e metas do **Engenheiro Autônomo da Aba 3 (Viola Caipira & Violão)** do Nexus Vault.

---

## 🎯 Projeto Prioritário Atual: Fase 7 — Gerador, Editor e Exportador de Tablaturas e Diagramas de Cifras Caipiras

- **Status:** ⏳ Próximo na esteira diária
- **Objetivos Técnicos:**
  1. Permitir ao usuário criar, editar e compor suas próprias tablaturas e ponteios para Viola Caipira (5 pares) e Violão de 6 cordas, adicionando notas, duetos em terças/sextas, batidas e rasqueados diretamente pelo braço virtual interativo.
  2. Implementar motor de exportação de partituras/tablaturas em formato texto ASCII (.tab / .txt) formatado e diagrama gráfico imprimível (PDF / Canvas) com indicação para tocadores Canhotos e Destros.
  3. Adicionar reprodutor Web Audio API para audição imediata das criações do usuário com loop, controle de andamento e salvamento no LocalStorage via `VaultCore`.

---

## 📋 Backlog de Inovações Futuras (Projetos Proativos)

O agente autônomo selecionará diariamente o próximo projeto prioritário desta lista:

1. **[x] Módulo de Ritmos Tradicionais Caipiras no Metrônomo:**
   - Adicionados padrões percussivos e de palhetada com áudio sintetizado para: *Cururu*, *Pagode de Viola*, *Cateretê*, *Guarânia*, *Toada* e *Querência*.
2. **[x] Dicionário e Buscador Reverso de Acordes (Canhoto & Destro):**
   - Motor de dedução harmônica algorítmica a partir de digitações livres nas casas ou no braço SVG, identificação de inversões, funções modais caipiras, dedilhado Web Audio e presets curados.
3. **[x] Treinador Auditivo de Afinação e Pares Oitavados (Acoustic Beats Ear Trainer):**
   - Módulo completo de treino perceptivo com simulação física de batimentos acústicos, teste cego em 4 níveis de dificuldade, simulador de cravelha manual em cents, osciloscópio de envoltória em Canvas e patentes de violeiro (Iniciante até Tião Carreiro).
4. **[x] Biblioteca Expandida de Ponteios & Solos Canônicos de Viola Caipira (Fase 6 Concluída):**
   - Mapeamento e reprodução passo a passo de 10 clássicos em terças e sextas com visualização sincronizada no braço SVG, tablatura digital interativa com dedilhado de mão direita e controle de andamento didático.
5. **[ ] Gerador / Editor e Exportador de Tablaturas e Cifras (Fase 7):**
   - Permitir criar composições próprias na tablatura, salvar no cofre e exportar em texto ASCII e PDF imprimível.
6. **[ ] Treinador de Escalas Modais Caipiras (Modo Lídio, Mixolídio e Dórico na Viola):**
   - Mapeamento sonoro e visual dos modos litúrgicos e folclóricos do sertão brasileiro ao longo de todo o braço do instrumento.

---

## 📝 Histórico de Implementações Diárias

- **05/11/2026 — Sessão 6** (Fase 6 Concluída):
  - **Biblioteca Expandida de Ponteios & Solos Canônicos de Viola Caipira**:
    - **Repertório Canônico de 10 Clássicos Mapeados**:
      - *Pagode em Brasília* (Tião Carreiro & Lourival dos Santos) — A gênese do Pagode Caipira com repiques em cascata e batida percussiva de tampo.
      - *Chico Mineiro* (Tonico & Francisco Ribeiro) — O lirismo puro do dueto em terças no 1º e 2º par da afinação Cebolão em Mi.
      - *O Menino da Porteira* (Teddy Vieira & Luizinho) — O padrão canônico das sextas caipiras nos pares 1 e 3.
      - *O Rei do Gado* (Teddy Vieira / Tião Carreiro) — A introdução monumental de moda de viola com batida de tampo, terças cortantes partindo da 7ª casa e arremates em bordões graves.
      - *A Vaca Já Foi Pro Brejo* (Tião Carreiro & Lourival dos Santos) — Síncopes aceleradas em semicolcheias com repiques cortados e abafamento seco.
      - *Ferrugem* (Almir Sater) — Estética pantaneira contemporânea com cordas soltas como pedais contínuos e harmonia aberta lírica.
      - *Tristeza do Jeca* (Angelino de Oliveira) — A toada matriz da música caipira paulista com fraseado nostálgico em terças.
      - *Vaca Estrela e Boi Fubá* (Patativa do Assaré) — Lamento sertanejo profundo explorando o lado modal com terceira menor.
      - *Canoeiro* (Almirante / Zé Carreiro & Carreirinho) — O cururu veloz de duelo fluvial com alternância ágil de terças.
      - *Luar do Sertão* (Catulo da Paixão Cearense & João Pernambuco) — Valsa seresteira solene com melodia cantada sobre bordões pontuados.
    - **Reprodutor Interativo com Web Audio API**:
      - Síntese precisa de notas simples, duetos simultâneos (terças/sextas), batidas no tampo da viola (`playWoodTap`) e rasqueados abertos (`playRasqueado`).
      - Controle de andamento didático em 4 velocidades: 50% (Estudo Lento / Digitação), 75% (Moderado), 100% (Andamento Real) e 120% (Virtuosismo Caipira).
      - Modo Loop contínuo para repetição ininterrupta do trecho em treino.
      - Modo Passo a Passo (`[ ◀ Anterior ]` e `[ Próxima ▶ ]`) permitindo ao estudante avançar nota a nota no seu próprio ritmo, ouvindo o som de cada digitação instantaneamente.
    - **Tablatura Digital Caipira Interativa (5 Pares da Viola)**:
      - Renderização responsiva com scroll horizontal fluido e régua de compassos numerados.
      - Notação técnica de mão direita (`p` polegar, `i` indicador, `p+i` dueto pinçado, `rasq` rasqueado, `tap` batida no tampo) e dedilhado sugerido da mão esquerda (`lh`).
      - Cursor neon âmbar ativo que acompanha a execução sonora em tempo real com auto-scroll suave.
      - Interatividade total: clique em qualquer coluna/tempo da tablatura para soar o áudio imediatamente, posicionar o cursor e iluminar no braço virtual.
    - **Integração com Braço SVG (Modo Canhoto & Destro)**:
      - Novo modo de projeção no braço virtual: `🎼 Tablatura & Ponteios` (`displayMode: 'PONTEIO'`).
      - Visualização em camada fantasma (cinza translúcido) de todas as notas do ponteio ao longo do braço, permitindo antecipar os saltos de posição.
      - Destaque vibrante neon dourado e esmeralda nas notas do passo ativo no momento exato em que soam.
      - Compatibilidade nativa com modo Canhoto (pestana à direita) e Destro, e perspectivas "Diagrama" e "Músico".
    - **Ficha Técnica & Dicas do Mestre Violeiro**:
      - Contextualização histórica, tonalidade, afinação recomendada, métrica e dicas ergonômicas de execução prática.
      - Galeria em grid responsiva de 10 obras com seletor rápido sincronizado.
      - Persistência de preferências de estudo no LocalStorage via `VaultCore`.

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
