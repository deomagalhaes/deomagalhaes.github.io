# Roadmap & Diário de Engenharia — Nexus Vault (Aba 3: Viola e Violão)

Este documento registra o backlog de projetos, histórico de implementações e metas do **Engenheiro Autônomo da Aba 3 (Viola Caipira & Violão)** do Nexus Vault.

---

## 🎯 Projeto Prioritário Atual: Fase 2 — Módulo de Ritmos e Ponteios Caipiras no Metrônomo

- **Status:** ⏳ Próximo na esteira diária
- **Objetivos Técnicos:**
  1. Expandir o metrônomo lookahead com padrões rítmicos percussivos e de palhetada (rasqueado e ponteado) para ritmos caipiras autênticos: *Cururu* (2/4), *Pagode de Viola* (2/4 sincopado), *Cateretê* (2/4), *Guarânia* (3/4) e *Toada* (6/8).
  2. Implementar sintetizador Web Audio para batida na caixa/tampo e repique característico da viola caipira.

---

## 📋 Backlog de Inovações Futuras (Projetos Proativos)

O agente autônomo selecionará diariamente o próximo projeto prioritário desta lista:

1. **[ ] Módulo de Ritmos Tradicionais Caipiras no Metrônomo:**
   - Adicionar padrões percussivos e de palhetada com áudio sintetizado para: *Cururu*, *Pagode de Viola*, *Cateretê*, *Querência* e *Toada*.
2. **[ ] Dicionário e Buscador Reverso de Acordes:**
   - Clicar nas casas do braço canhoto/destro e o sistema identificar o nome do acorde, intervalos e notas formadoras.
3. **[ ] Treinador Auditivo de Afinação e Pares Oitavados:**
   - Exercício interativo para afinar de ouvido os pares 3º, 4º e 5º (oitavados) e 1º e 2º (uníssonos).
4. **[ ] Biblioteca de Ponteios e Intros Clássicas:**
   - Mapeamento e reprodução passo a passo de ponteios tradicionais nas terças e sextas com visualização sincronizada no braço.
5. **[ ] Gerador / Exportador de Tablaturas:**
   - Permitir salvar sequências harmônicas montadas em formato de tablatura e diagrama imprimível.

---

## 📝 Histórico de Implementações Diárias

- **02/11/2026** (Fase 1 Concluída):
  - **Expansão Completa do Campo Harmônico & Shapes**:
    - Mapeadas todas as 12 tonalidades maiores (Mi, Lá, Si, Ré, Sol, Dó, Fá, Si♭, Mi♭, Lá♭, Ré♭, Fá#) e tonalidades menores clássicas.
    - Suporte a alternância dinâmica entre **Tríades** e **Tétrades com 7ª** (`7M`, `m7`, `7`, `m7(♭5)`), com exibição de graus romanos estilizados (`I7M`, `ii7`, `iii7`, `IV7M`, `V7`, `vi7`, `viiø`).
    - Inclusão de biblioteca curada de múltiplos shapes por acorde tanto para Viola Caipira (Cebolão em Mi) quanto para Violão Padrão (6 cordas), com alternador visual de variações de shape ao longo do braço.
    - Atualização do renderizador SVG do braço canhoto/destro com novo código cromático de intervalos (verde para Tônica, ciano para Terça, âmbar para Quinta e roxo para Sétima).
  - Inicialização do sidecar diário do Engenheiro Autônomo e calibração das permissões.
