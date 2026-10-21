# Planejamento dos Jogos de Lógica Diários – Deo Magalhães

Este arquivo serve como fila de produção e controle para a criação automatizada diária de jogos cognitivos e terapêuticos para o site [deomagalhaes.github.io](https://deomagalhaes.com.br/jogos.html).

---

## 📋 Fila e Status de Produção

| Dia | Jogo | Foco Neuropsicológico / Cognitivo | Arquivo | Status |
|---|---|---|---|---|
| **Dia 1** | **Torre de Hanói** | Funções Executivas, Planejamento Antecipatório e Controle Inibitório | `recursos/jogo-torre-hanoi.html` | ✅ **Publicado** |
| **Dia 2** | **Balança de Equivalências** | Raciocínio Algébrico Visual, Dedução e Abstração | `recursos/jogo-balanca-logica.html` | ⏳ *Próximo da fila* |
| **Dia 3** | **Grid de Dedução (Detetive Lógico)** | Memória Operacional, Inferência e Eliminação de Hipóteses | `recursos/jogo-detetive-logico.html` | ⏳ Aguardando |
| **Dia 4** | **Matrizes Progressivas de Raven** | Raciocínio Fluido e Relações Visuoespaciais | `recursos/jogo-matrizes-raven.html` | ⏳ Aguardando |
| **Dia 5** | **Circuito Neural (Conexão Lógica)** | Flexibilidade Mental, Atenção Focada e Resolução de Problemas | `recursos/jogo-circuito-neural.html` | ⏳ Aguardando |
| **Dia 6** | **Mini-Sudoku das Formas e Cores** | Atenção Sustentada e Pensamento Algorítmico | `recursos/jogo-mini-sudoku.html` | ⏳ Aguardando |
| **Dia 7** | **Balança da Verdade (Silogismos)** | Lógica Proposicional, Validação de Premissas e Pensamento Crítico | `recursos/jogo-silogismos.html` | ⏳ Aguardando |

---

## 🛠️ Padrão de Implementação dos Jogos

1. **Estrutura Visual:**
   - Top-bar com links de contato.
   - Header padrão do site com menu de navegação responsivo.
   - Design moderno com a paleta institucional (`#005f73`, `#0a9396`, `#ee9b00`, `#f9f6ee`).
   - Rodapé completo institucional com CRP e redes.
2. **Mecânica Interativa:**
   - Totalmente responsivo (touch screen para smartphones e cliques para desktop).
   - Efeitos sonoros via Web Audio API (sem dependências externas).
   - Contador de movimentos, tempo e sistema de pontuação com `localStorage`.
   - Explicação neurocognitiva destacando qual região cerebral ou função está sendo estimulada.
3. **Publicação:**
   - Adicionar o card correspondente com imagem de capa em `jogos.html`.
   - Executar `git add`, `git commit` e `git push origin main`.
