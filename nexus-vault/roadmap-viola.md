# Roadmap & Diário de Engenharia — Nexus Vault (Aba 3: Viola e Violão)

Este documento registra o backlog de projetos, histórico de implementações e metas do **Engenheiro Autônomo da Aba 3 (Viola Caipira & Violão)** do Nexus Vault.

---

## 🎯 Projeto Prioritário Atual: Fase 3 — Módulo de Ritmos e Padrões de Palhetada Caipira no Metrônomo

- **Status:** ⏳ Próximo na esteira diária
- **Objetivos Técnicos:**
  1. Expandir o metrônomo lookahead com padrões rítmicos percussivos e de palhetada (rasqueado, pagode sincopado e ponteado) para ritmos caipiras autênticos: *Cururu* (2/4), *Pagode de Viola* (2/4 com repique característico), *Cateretê* (2/4), *Guarânia* (3/4) e *Toada* (6/8).
  2. Implementar sintetizador Web Audio para batida na caixa/tampo da viola e repique de dedo indicador/polegar.
  3. Adicionar guia visual com setas direcionais de palhetada (baixo/cima/abafado) sincronizadas aos tempos do metrônomo.

---

## 📋 Backlog de Inovações Futuras (Projetos Proativos)

O agente autônomo selecionará diariamente o próximo projeto prioritário desta lista:

1. **[ ] Módulo de Ritmos Tradicionais Caipiras no Metrônomo:**
   - Adicionar padrões percussivos e de palhetada com áudio sintetizado para: *Cururu*, *Pagode de Viola*, *Cateretê*, *Querência* e *Toada*.
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
