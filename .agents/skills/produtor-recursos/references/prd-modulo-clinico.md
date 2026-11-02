# Especificação Técnica — Módulo Público e Clínico (`recursos/` & `/ferramentas-clinicas/`)

Referência arquitetural das ferramentas clínicas públicas de apoio a pacientes e famílias no ecossistema `deomagalhaes.com.br`. *(Nota de Governança Ética: A Estação de Correção Psicométrica e Tabelas ABNT/DSM-5-TR para WASI, FDT, SRS-2, BPA-2 e RAVLT foi transferida integralmente para o enclave privado `nexus-vault/js/tab-psicometria.js`).*

---

## 1. Registrador Comportamental ABC para Pais e Cuidadores (ABA)
- **Arquivo:** `recursos/registrador-abc-aba.html`
- **UX:** Interface *Mobile-First* operável com o polegar (uma mão só) durante ou logo após o episódio.
- **Estrutura de Registro:**
  - **Data/Hora:** Preenchimento automático do instante atual, editável.
  - **Contexto/Ambiente:** Casa, Escola, Terapia, Passeio/Público, Transição/Carro, Outro.
  - **A — Antecedente:** Chips de toque rápido (*Negativa de item/acesso*, *Demanda escolar/tarefa*, *Transição de rotina*, *Sobrecarga sensorial/ruído*, *Fome/Sono/Cansaço*, *Atenção desviada do adulto*) + campo complementar livre.
  - **B — Comportamento Observável:** Descrição objetiva topográfica (sem adjetivos moralizantes), duração estimada (ex.: `< 1 min`, `1–5 min`, `5–15 min`, `> 15 min` ou minutos exatos) e escala visual de **Intensidade (1 a 5)**.
  - **C — Consequência / Manejo:** Chips rápidos (*Redirecionamento calmo*, *Atenção verbal/física fornecida*, *Demanda retirada/adiada*, *Item entregue*, *Regulação sensorial/espaço calmo*, *Bloqueio físico protetivo*) + observação.
- **Análise e Exportação:**
  - Persistência em `localStorage` com resumo estatístico automático: frequência por antecedente dominante (hipótese funcional preliminar educativa), intensidade média e distribuição por contexto/turno.
  - Botões: **"Exportar CSV"**, **"Imprimir / Salvar PDF (A4)"**, **"Backup JSON"** e **"Enviar Resumo via WhatsApp para o Neuropsicólogo"** (`https://wa.me/5535933003807?text=...` ou número livre opcional, com relatório estruturado em texto formatado estilo Markdown do WhatsApp).

---

## 3. Diário de Clarificação Existencial e Desfusão Cognitiva (Fato vs. Hipótese)
- **Arquivo:** `recursos/clarificacao-existencial.html`
- **Arquitetura:** *Stepper* interativo guiado em 5 etapas socráticas (integrando TCC, ACT e Clínica Existencial):
  1. **O Evento Bruto (Fato Observável):** *"O que uma câmera de vídeo silenciosa registraria na cena, sem adjetivos, suposições de intenção ou leituras mentais?"* (com detector educativo suave de adjetivos/julgamentos comuns para treinar a descrição fenomenológica).
  2. **A Narrativa Interna (Interpretação / Hipótese):** *"Qual história sua mente contou imediatamente sobre esse fato? O que você disse a si mesmo?"* + nível de fusão inicial (0–100%).
  3. **Reação Emocional e Fisiológica:** Seleção da emoção predominante, sensações interoceptivas (tensão mandibular, aperto torácico, agitação, exaustão) e **Intensidade (0 a 10)**.
  4. **Auditoria Socrática de Evidências:** Coluna dupla — *Fatos concretos que sustentam a hipótese inicial* vs. *Fatos que refutam ou hipóteses alternativas igualmente plausíveis*.
  5. **Responsabilidade e Escolha (Práxis e Valores):** *"Independentemente do que o outro faça ou pense, qual é a microação mais funcional, digna e alinhada aos seus valores agora?"* + reavaliação da intensidade emocional pós-desfusão (0–10).
- **Saída:** Geração de relatório A4 limpo para impressão/PDF (`window.print()`) pronto para levar à sessão clínica, histórico opcional local no navegador e botão de autodestruição imediata do registro após gerar o PDF.

---

## 4. Construtor Visual de Rotina e Economia de Fichas (Infantil / Funções Executivas)
- **Arquivo:** `recursos/construtor-rotina-fichas.html`
- **Objetivo:** Montar em consultório ou em casa quadros visuais estruturados de previsibilidade e reforçamento positivo para crianças (TDAH, TEA, desenvolvimento típico).
- **Funcionalidades:**
  - Nome da criança e título personalizado do quadro, modo **Rotina por Turnos (Manhã / Tarde / Noite)** ou **Quadro Semanal de Metas (Segunda a Domingo)**.
  - Biblioteca rápida de cartões visuais lúdicos (Escovar os dentes, Vestir uniforme, Guardar brinquedos, Hora da tarefa, Banho calmo, Dormir no horário, Respirar fundo quando frustrado, etc.) + criador livre de tarefas com seletor de ícone/emoji e valor em estrelas/fichas (1 a 5 ⭐).
  - **Banco de Recompensas Combinadas:** Lista de privilégios afetivos e funcionais (ex.: 15 estrelas = escolher o jogo de tabuleiro em família; 30 estrelas = passeio no parque) com barra de progresso interativa na tela.
  - **Folha `@media print` A4 Otimizada:** Renderiza um quadro visual limpo, colorido na medida certa, com caixinhas de marcação semanal (`[ ] Seg [ ] Ter ...`) e área de combinados da família pronta para imprimir em 1 página A4.
