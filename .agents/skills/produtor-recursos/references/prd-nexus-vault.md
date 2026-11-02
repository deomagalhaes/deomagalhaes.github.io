# Especificação Técnica — Lab Pessoal Oculto (`/nexus-vault/`)

Arquitetura privada multi-abas (*Dark Mode Technical Dashboard*), 100% Client-Side (`localStorage`) e isolada de motores de busca.

---

## Regras Globais do Vault
- **Segurança de Acesso:**
  - `<meta name="robots" content="noindex, nofollow, noarchive">` obrigatório.
  - Bloqueio por tela de autenticação PIN validado exclusivamente via hash criptográfico `SHA-256` com *salt* (`dm_vault_auth_v1::<pin>`), suportando também substituição local de hash caso o administrador altere o PIN nas configurações locais.
  - Atalho global `Ctrl+Shift+L` em `assets/script.js` abre modal minimalista que valida o hash SHA-256 e descriptografa via XOR-SHA256 o destino sem jamais expor a string `"nexus-vault"` nem o PIN no código público.
- **Sincronização Global Manual (Google Drive Ready):**
  - Barra superior fixa contendo **"Exportar Banco Completo (.json)"** e **"Importar Banco (.json)"**, serializando e restaurando atomicamente todas as chaves `dm_vault_*` das 6 abas com carimbo de data/hora e validação de integridade.

---

## Aba 1: Estação de Correção Neuropsicológica & Psicometria ABNT (`tab-psicometria.js`)
- **Acesso Estritamente Privado:** Protegido por PIN dentro de `/nexus-vault/`, sem nenhuma exposição pública.
- **Gestão Multi-Protocolo (`dm_vault_psicometria`):** Pastas de avaliação por código/iniciais, cálculo exato de Idade Cronológica (anos, meses e dias), escolaridade, lateralidade e informante.
- **Módulos Especializados de Instrumentos:**
  1. **WASI & Escalas Wechsler (WISC-IV / WAIS-III):** Subtestes WASI em Escore *T* (*M* = 50, *DP* = 10: Vocabulário, Cubos, Semelhanças, Raciocínio Matricial), somas de Escores *T*, QIV, QIE, QIT-4 e QIT-2 com IC 95% via EPM, discrepância clínica `QIV − QIE`, além de calculadora Wechsler de `IAG vs. ICC`.
  2. **FDT (Five Digit Test — Sedó):** Tempos e erros de Leitura, Contagem, Escolha e Alternância; cálculo automático exato de **`Inibição = Escolha − Leitura`** e **`Flexibilidade = Alternância − Leitura`**, conversão normativa invertida para tempo (`Z = (M − X) / DP`) ou por Percentil do manual (com seletor explícito de sentido eficiência vs. lentidão).
  3. **SRS-2 (Escala de Responsividade Social — 2ª Ed.):** Subescalas de Intervenção (Percepção, Cognição, Comunicação, Motivação Social e Padrões Restritos/Repetitivos), soma automática das 2 escalas compatíveis DSM-5-TR (**CIS** e **PRR**) e Escore Total, com classificação clínica invertida de severidade por Escore *T* (`≤ 59` Normal, `60–65` Leve, `66–75` Moderado, `≥ 76` Grave).
  4. **BPA-2 & RAVLT:** Apuração líquida automática da BPA-2 (`A − E − O` em AC, AD, AA e Atenção Geral `AG`) e todos os índices do RAVLT (`Total ΣA1–A5`, `ALT = ΣA1..A5 − 5×A1`, `Velocidade de Esquecimento = A7/A6`, `IP = B1/A1`, `IR = A6/A5` + curva de aprendizagem).
  5. **Calculadora Universal + Biblioteca Local de Normas:** Conversor `erf` (Abramowitz & Stegun) e `probit` (Acklam) + banco reutilizável de normas salvas no `localStorage`.
  6. **Compositor de Laudo ABNT NBR 14724:** Tabela sem bordas verticais com cópia Rich-Text para Word/Docs, Curva de Perfil High-DPI `.PNG` e Gerador Automático de Rascunho Técnico Descritivo.

---

## Aba 2: Gestão Fitotécnica de Bonsai (Capacidade Fluida: +100 Plantas)
- **Modelo de Dados por Planta:**
  - `id` (ex.: `B-001`), `popularName`, `scientificName`, `bench` (Bancada/Setor), `stage` (`Muda`, `Pré-bonsai`, `Bonsai`, `Yamadori`), `pot` (`Cerâmica`, `Treino Plástico`, `Cesta/Escorredor`, `Laje/Rocha`), `substrate` (ex.: `60% Caqueira + 30% Pó de Pinus + 10% Pedrisco`), `lastFertilization` (ISO Date), `fertCycleDays` (`30` ou `45` dias), `lastRepot` (Transplante/Poda de Raiz), `repotCycleMonths` (ex.: `12`, `24` meses), `lastStyling` (Estilização/Aramação), `nextInterventionDate`, `nextInterventionNote`, `notes` (Observações técnicas) e `history` (log das últimas intervenções).
- **Produtividade e Mobile One-Handed:**
  - KPIs no topo: Total do acervo, Atrasadas para Adubação, Atrasadas para Transplante, Intervenções nos próximos 7 dias.
  - Busca instantânea textual + filtros combináveis por Espécie, Bancada, Estágio e filtro crítico **"Atrasados para Adubação / Transplante"**.
  - **Ação em Lote (Batch Action):** Seleção múltipla (individual, "Selecionar Filtradas" ou "Selecionar Bancada") + barra flutuante de polegar com **"Registrar Adubação Hoje (+30d)"**, **"Registrar Adubação Hoje (+45d)"** e **"Agendar Intervenção"**, atualizando instantaneamente dezenas de plantas em 1 clique.

---

## Aba 2: Estúdio de Viola Caipira (Cebolão em Mi) & Violão — Modo Canhoto Nativo
- **Renderizador Interativo de Braço para Canhoto (Left-Handed Fretboard):**
  - Configurado **nativamente para canhoto** (espelhado horizontalmente: pestana/mão da escala à direita e boca/corpo à esquerda na visão frontal espelhada, além de modo perspectiva do músico e toggle opcional Destro/Canhoto para consulta de materiais externos).
  - 13 casas (0 solta até 12ª casa) renderizadas em SVG responsivo de alta nitidez com marcações nos trastes 3, 5, 7, 9 e 12, exibindo notas, intervalos tônica/terça/quinta e dedilhado.
- **Instrumentos Suportados:**
  1. **Viola Caipira — Afinação Cebolão em Mi (5 pares):**
     - Do 1º par (mais agudo/baixo) ao 5º par (mais grave/cima): `1º Par: E4 (uníssono)`, `2º Par: B3 (uníssono)`, `3º Par: G#3 / G#4 (oitavado)`, `4º Par: E3 / E4 (oitavado)`, `5º Par: B2 / B3 (oitavado)` — exibido claramente como `E - B - G# - E - B`.
  2. **Violão Padrão (6 cordas):** `E2 - A2 - D3 - G3 - B3 - E4`.
- **Ferramentas Musicais e Áudio Nativo (`Web Audio API`):**
  - **Gerador de Campo Harmônico Maior / Menor Natural:** Exibe os 7 graus (`I, ii, iii, IV, V, vi, vii°`) na tonalidade escolhida; clicar em um grau projeta imediatamente o *shape* real do acorde no braço canhoto e toca o acorde dedilhado (com simulação do par oitavado rico característico da viola caipira!).
  - **Escalas Duadas (Terças e Sextas da Viola Caipira):** Mapeamento completo das escalas duadas em **Terças** (pares 1+2 e 2+3) e **Sextas** (pares 1+3 e 2+4) nas tonalidades clássicas do Cebolão (Mi Maior, Lá Maior, Si Maior, Sol# Menor), com execução sonora passo a passo (*Play Scale*) para estudo auditivo.
  - **Metrônomo de Precisão (`Web Audio API` Lookahead):** Controle de BPM (40 a 220 BPM), tap tempo, compassos `2/4` ( Pagode / Cururu ), `3/4` ( Moda / Cateretê / Guarânia ), `4/4` e `6/8`, subdivisão para treino de *fingerpicking* / ponteio e indicador luminoso por tempo.

---

## Aba 3: Protocolo Pessoal de Desfusão e Tomada de Decisão (Rigor Comportamental)
- **Uso Rápido de Bolso:** Interface direta para momentos de alta tensão relacional ou deliberação estratégica.
- **Matriz de Análise:**
  1. **Clivagem Fenomenológica:** *Fato Objetivo Estrito* vs. *Leitura Emocional / Narrativa Reativa* + Nível de ativação autonômica atual (1–10).
  2. **Matriz Quantitativa de Trade-offs e Custo de Oportunidade:**
     - *Cenário A (Reação Impulsiva / Curto Prazo):* Alívio imediato vs. perda estimada em Paz Mental, Foco Clínico/Intelectual e Desgaste Futuro.
     - *Cenário B (Intervenção Estratégica ou Silêncio Deliberado):* Custo de autocontrole agora vs. ganho composto no médio/longo prazo.
  3. **Filtro de Proteção Ambiental e Familiar:** Avaliação objetiva de impacto sobre a estabilidade, previsibilidade emocional e proteção do ambiente do(a) filho(a)/dependente (com rótulo personalizado salvo apenas no `localStorage`, nunca fixo no código-fonte).
  4. **Decisão Operacional Registrada:** Síntese de 1 frase acionável ("O que farei e o que NÃO farei nas próximas 24h") com histórico local consultável.

---

## Aba 4: Gerador Estruturado de Cenas Terapêuticas e Contos Noturnos
- **Parâmetros Selecionáveis:**
  - Protagonista/Idade (salvos localmente), **Tema Emocional do Dia** (*Tolerância à frustração*, *Espera e autocontrole*, *Coragem diante do novo*, *Transição/separação de rotina*, *Manejo da raiva*, *Acolhimento do medo noturno*), **Arquétipo / Cenário** (*Cerrado e Fauna Brasileira*, *Floresta Encantada*, *Folclore Brasileiro Gentil*, *Observatório das Estrelas*), **Metáfora Comportamental** e **Pergunta Reflexiva Suave para a Hora de Dormir**.
- **Dupla Saída Funcional:**
  1. **Gerador Modular Instantâneo Offline:** Compõe imediatamente um conto completo, poético e acolhedor com arco narrativo de 4 atos + pergunta final de conexão afetiva, pronto para leitura noturna no celular em modo escuro suave (*Warm Night Reader*).
  2. **Construtor de Prompt Estruturado + Execução Opcional via API Local:** Gera o prompt clínico-literário completo pronto para copiar e permite (opcionalmente) colar uma *Gemini API Key* armazenada exclusivamente no `localStorage` do navegador para gerar variações inéditas via chamada direta client-side.

---

## Aba 5: Simulador de Independência Clínica vs. Renda Passiva
- **Entradas:**
  - Atendimentos semanais (padrão: `16`), Semanas ativas/mês (ex.: `4,2`), Horas indiretas semanais (laudos/estudo/gestão), Ticket Médio por sessão/avaliação (`R$`), Custos Fixos + Impostos Mensais do Consultório (`R$`), Aporte Mensal (`R$`), Patrimônio Investido Atual (`R$`), Rentabilidade Real Anual Líquida Estimada (`%` a.a. acima da inflação — FIIs/Ações/ETFs) e Horizonte de Projeção (anos).
- **Indicadores Calculados em Tempo Real:**
  - **Receita Bruta e Líquida Mensal** do consultório.
  - **Valor da Hora Clínica Líquida** (considerando horas diretas e hora efetiva total incluindo laudos/preparo).
  - **Índice de Compra de Liberdade:** Quantas **horas/sessões de consultório por mês** cada novo aporte mensal compra em renda passiva perpétua (`Renda Passiva Mensal Gerada por 1 Aporte ÷ Valor Líquido da Sessão`) e quantas sessões o patrimônio atual já cobre hoje!
  - **Marco de Crossover (Independência Clínica):** Mês/Ano exato em que a Renda Passiva Real iguala 50% (Meia-Jornada Opcional) e 100% da Receita Clínica Líquida (ou Custo de Vida alvo).
  - **Gráfico Interativo SVG/Canvas:** Curvas de *Receita Ativa Clínica Líquida* vs. *Renda Passiva Mensal Real Projetada* ao longo dos anos, com ponto de cruzamento destacado e tabela anual detalhada.
