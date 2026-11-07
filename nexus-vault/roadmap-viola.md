# Roadmap & Diário de Engenharia — Nexus Vault (Aba 3: Viola e Violão)

Este documento registra o backlog de projetos, histórico de implementações e metas do **Engenheiro Autônomo da Aba 3 (Viola Caipira & Violão)** do Nexus Vault.

---

## 🎯 Projeto Prioritário Atual: Fase 9 — Analisador de Tensão Mecânica e Calibre de Cordas (String Tension & Action Calculator)

- **Status:** ⏳ Próximo na esteira diária
- **Objetivos Técnicos:**
  1. Cálculo de tensão mecânica em quilograma-força (kgf) e Newtons por corda/par para encordoamentos de aço e nylon em afinações Cebolão em Mi, Cebolão em Ré, Rio Abaixo, Boiadeira e Violão 6 cordas.
  2. Diagnóstico lutherístico de sobretensão e fadiga estrutural do tampo harmônico, empenamento de cavalete e esforço axial no braço da viola.
  3. Simulador de ação de cordas (altura em milímetros nos trastes 1 e 12) com recomendações de ajuste de pestana (nut) e rastilho em osso para tocadores canhotos e destros.

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
5. **[x] Gerador / Editor e Exportador de Tablaturas e Cifras Caipiras (Fase 7 Concluída):**
   - Motor completo de criação, edição e composição de tablaturas para Viola Caipira (5 pares) e Violão (6 cordas), integração bidirecional com o braço SVG, técnicas caipiras em 1 clique (Tap, Rasq, Terças e Sextas), reprodutor Web Audio, exportação multiformato (ASCII formatado e Canvas HD PNG / Impressão PDF) e persistência de múltiplos projetos no cofre.
6. **[x] Treinador de Escalas Modais Caipiras (Modo Lídio, Mixolídio, Dórico & Nordestino na Viola e Violão) (Fase 8 Concluída):**
   - Mapeamento sonoro e visual completo dos modos litúrgicos e folclóricos do sertão brasileiro ao longo de todo o braço SVG, diferenciação cromática de notas características, 5 exercícios guiados por modo, sequenciador Web Audio API e filtros de região do braço.
7. **[ ] Analisador de Tensão e Calibre de Cordas (String Tension & Action Calculator) (Fase 9):**
   - Cálculo de tensão mecânica em kgf por par para cordas de aço e nylon em afinações Cebolão, Rio Abaixo e Boiadeira com alertas de fadiga do tampo e regulagem de cavalete.
8. **[ ] Módulo de Afinações Históricas & Regionais Raras (Meia-Guitarra, Rio Acima, São Lourenço):**
   - Expansão lutherística com novos temperamentos e afinações do folclore do Vale do Jequitinhonha, cerrado mineiro e sertão goiano.
9. **[ ] Gerador de Modulações & Preparação Harmônica Caipira:**
   - Ferramenta de transição tonal com acordes de preparação em dois tempos, pestanas móveis e dominantes secundárias típicas de duplas sertanejas clássicas.

---

## 📝 Histórico de Implementações Diárias

- **07/11/2026 — Sessão 8** (Fase 8 Concluída):
  - **Treinador de Escalas Modais Caipiras (Modo Lídio, Mixolídio, Dórico, Nordestino, Jônio e Eólio)**:
    - **Mapeamento Teórico e Musicológico Completo dos Modos do Sertão**:
      - *Modo Lídio (1, 2, 3, ♯4, 5, 6, 7)*:
        - Nota característica: **4ª Aumentada (♯4 / trítono lídio)**.
        - Contextualização: A mística das Folias de Reis de Minas e Goiás e introduções atmosféricas de Almir Sater. Sonoridade celestial e aberta que ressoa em harmonia pura sobre o acorde aberto do Cebolão em Mi.
        - Harmonia geradora: Tríades I (`E`), II (`F#`) e vii menor (`D#m`).
      - *Modo Mixolídio (1, 2, 3, 4, 5, 6, ♭7)*:
        - Nota característica: **7ª Menor (♭7)**.
        - Contextualização: A alma rítmica do Cururu, Pagode de Viola de Tião Carreiro, Cateretê paulista e repente nordestino, retirando a sensível clássica europeia e imprimindo o suingue sincopado do cerrado.
        - Harmonia geradora: Tríades I (`E`), ♭VII (`D`) e v menor (`Bm`).
      - *Modo Dórico (1, 2, ♭3, 4, 5, 6, ♭7)*:
        - Notas características: **3ª Menor (♭3) e 6ª Maior (6M)**.
        - Contextualização: O lamento sertanejo do Cariri (*Vaca Estrela e Boi Fubá*), melancolia lírica sem desespero onde a 6ª maior ilumina a dor sertaneja com esperança e dignidade existencial.
        - Harmonia geradora: Tríades i menor (`Em`), IV maior (`A`) e ii menor (`F#m`).
      - *Modo Nordestino / Escala Acústica (1, 2, 3, ♯4, 5, 6, ♭7)*:
        - Notas características: **4ª Aumentada (♯4) e 7ª Menor (♭7)**.
        - Contextualização: Fusão suprema entre o Lídio e o Mixolídio; ponteio veloz de forró pé-de-serra, aboio e literatura de cordel.
        - Harmonia geradora: Acordes I7 (`E7`), II (`F#`) e ♭VII (`D`).
      - *Modo Jônio (1, 2, 3, 4, 5, 6, 7)*: Referência do Cebolão aberto natural e modas festivas.
      - *Modo Eólio (1, 2, ♭3, 4, 5, ♭6, ♭7)*: Toadas de saudade e causos noturnos no estradão.
    - **Integração com o Braço SVG Virtual (Modo Canhoto & Destro)**:
      - Novo botão de projeção direta no topo do braço: `🌟 Modos Caipiras` (`displayMode: 'MODAL'`).
      - Código cromático enriquecido:
        - Tônica (1 / T): Destaque verde esmeralda (`#10b981`) com anel dourado (`#f59e0b`).
        - Nota Característica: Destaque neon rosa vibrante (`#ec4899`) com estrela `★` e anel branco `#ffffff`.
        - 3ª do Modo: Ciano (`#06b6d4`).
        - 5ª Justa: Âmbar (`#f59e0b`).
        - Demais graus modais (2ª, 4ª, 6ª, 7ª): Roxo/Índigo (`#818cf8`).
      - **Filtro de Regiões / Shapes do Braço**:
        - *Braço Completo* (Casas 0 a 14)
        - *Posição Aberta* (Casas 0 a 4)
        - *Meio do Braço* (Casas 4 a 9)
        - *Ponteios Agudos* (Casas 9 a 14)
        - *Apenas Notas Características & Tríades*
    - **Sequenciador & Reprodutor de Exercícios Web Audio API**:
      - 5 categorias de exercícios dinâmicos calculados algorítmicamente para qualquer afinação:
        1. *Subida & Descida Linear*: Fixação de dedilhado e digitação através dos pares.
        2. *Foco na Nota Característica*: Frase caipira cadenciada ressaltando a cor modal.
        3. *Arpejo da Tríade + Nota Modal*: Conexão entre o acorde de base e a melodia.
        4. *Dueto em Terças / Sextas*: Ponteio canônico em dueto nos pares agudos.
        5. *Fraseado Tradicional do Sertão*: Síncopes e repiques rítmicos da folia/baião/lamento.
      - Controles didáticos: Play/Pause, Resetar, Passo a Passo (`◀ Anterior` / `Próxima ▶`), Loop contínuo e 4 velocidades (50%, 75%, 100%, 120%).
      - Régua visual horizontal interativa com scroll suave e iluminação sincronizada das notas em tempo real no braço SVG.
      - Clique em qualquer nota da régua para soar imediatamente e destacar no braço.
      - Botão de audição imediata da escala completa e botões para dedilhar os acordes geradores de cada modo.
    - **Conclusão da Interface do Editor de Tablaturas (Fase 7)**:
      - Implementado renderizador completo de `renderTabEditorSection()` integrando grade de pauta, seletor de composições, técnicas caipiras em 1 clique e exportações.
    - **Persistência Global no LocalStorage**:
      - Sincronização automática do modo ativo, tônica, filtro de região e preferências via `VaultCore`.

- **06/11/2026 — Sessão 7** (Fase 7 Concluída):
  - **Gerador, Editor e Exportador de Tablaturas e Diagramas de Cifras Caipiras**:
    - **Motor de Composição & Edição Completo (5 Pares da Viola & 6 Cordas do Violão)**:
      - Arquitetura de projetos múltiplos armazenados de forma persistente no LocalStorage via `VaultCore`: gerenciador com criação de nova composição, seletor de projetos, edição de título e autor em tempo real, andamento BPM e fórmula de compasso (2/4, 3/4, 4/4, 6/8).
      - Quatro presets canônicos de composições para estudo e base criativa:
        - *Minha Primeira Moda Caipira* (introdução clássica em terças com cascatas, batida no tampo e rasqueado pleno de Mi Maior).
        - *Ponteio em Sextas do Estradão* (modelo canônico de sextas nos pares 1 e 3, estilo Menino da Porteira).
        - *Cururu do Rio Tietê* (síncopes velozes em semicolcheias com repiques e quedas em bordão grave).
        - *Guarânia Pantaneira* (compasso ternário lírico 3/4 com arpejos abertos e ressonância seresteira).
        - *Composição em Branco* (tablatura limpa gerada automaticamente pronta para criação livre).
    - **Integração Bidirecional com o Braço SVG (Modo Canhoto & Destro)**:
      - Novo modo de projeção no topo do braço: `📝 Editor de Tablatura` (`displayMode: 'TAB_EDITOR'`).
      - Marcação em camada fantasma (índigo translúcido) de todas as notas da composição ao longo das 14 casas para visualização global da digitação.
      - Marcadores vibrantes neon violeta e rosa com anel branco no passo ativo em tempo real.
      - **Edição Direta pelo Braço**: clicar em qualquer casa e corda do braço virtual projeta e insere a nota diretamente na coluna ativa da tablatura, emitindo o som acústico imediato!
    - **Grade Interativa de Tablatura (Scroll Horizontal Responsivo)**:
      - Notação de 5 linhas (Viola Caipira) ou 6 linhas (Violão) respeitando tanto a perspectiva 'diagram' (1º agudo no topo) quanto 'player' (grave no topo) e modo Canhoto/Destro.
      - Células de entrada numérica rápida em cada corda (0 a 14) com reprodução sonora imediata na alteração.
      - Identificação e dedução algorítmica automática de acordes a partir das digitações simultâneas via motor harmônico reverso.
      - Barra de ferramentas do passo ativo com técnicas caipiras em 1 clique:
        - `Batida no Tampo [TAP]` (dispara síntese física percussiva `playWoodTap` e limpa notas do passo).
        - `Rasqueado [RASQ]` (aplica rasqueado em leque em todas as cordas com `playRasqueado`).
        - `Terça Caipira [3ª]` (calcula e insere automaticamente dueto em terças diatônicas nos pares 1 e 2).
        - `Sexta Caipira [6ª]` (calcula e insere dueto em sextas nos pares 1 e 3).
        - Controles estruturais: `+ Tempo`, `Duplicar Tempo`, `+ Compasso`, `Limpar Passo` e `Excluir Tempo`.
    - **Importador de Solos Canônicos da Biblioteca (Fase 6 ➔ Editor Fase 7)**:
      - Modal interativo permitindo clonar qualquer um dos 10 solos canônicos da Fase 6 (Pagode em Brasília, Chico Mineiro, Menino da Porteira, O Rei do Gado, Ferrugem, Tristeza do Jeca, etc.) diretamente para o Editor de Tablatura, habilitando o violeiro a customizar e criar suas próprias variações!
    - **Motor de Exportação Multiformato de Alto Padrão**:
      - **1. Exportador em Texto ASCII (.tab / .txt)**:
        - Gera partitura textual universal perfeitamente alinhada em sistemas de 2 compassos, com cifras superiores, técnica de mão direita (RH), régua de tempos e cabeçalho completo (título, autor, afinação, BPM, métrica, orientação canhota/destra).
        - Modal de exportação com visualizador com rolagem, botão de cópia de um clique com feedback visual e download imediato do arquivo `.tab`.
      - **2. Exportador Gráfico de Diagrama / Partitura em Canvas HD (PNG)**:
        - Renderizador vetorial em Canvas 2D em 2x escala (Retina / Alta Resolução): moldura estúdio dark nobre, cabeçalho dourado, pauta detalhada com barras duplas, números de casa em badges contrastantes, acordes destacados e selo Nexus Vault.
        - Download de imagem HD em PNG de 1 clique para redes sociais ou impressão.
      - **3. Sistema de Impressão e PDF**:
        - Janela de impressão dedicada com folha formatada limpa em preto e branco otimizada para folhas A4 sem cortes de margem.
    - **Reprodutor Web Audio API Integrado**:
      - Sequenciador rítmico sincronizado ao BPM da composição com auto-scroll suave do cursor luminoso na tablatura e iluminação sincronizada no braço virtual.
      - Controles de andamento em 4 velocidades didáticas (50%, 75%, 100%, 125%), modo Loop e navegação passo a passo manual.

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
