# Regras Canônicas da Esteira Contínua — Deo Magalhães

Sempre que você for solicitado a executar a esteira de produção do site Deo Magalhães (`deomagalhaes.github.io`), siga estritamente estas diretrizes inegociáveis:

## 1. Princípio dos 4 Pilares Obrigatórios
Toda e qualquer rodada de lote de esteira contínua deve entregar OBRIGATORIAMENTE os quatro pilares sincronizados:
1. **Pilar 1 — Artigo Científico:** Redação profunda em `artigos/slug.html` com container `.container.article-container`, referências ABNT completas, rodapé `.container.footer-grid` e card no topo de `cards-artigos.html`.
2. **Pilar 2 — Roteiro Social & Studio Visual:** Roteiro de 6 a 7 slides em `social/YYYY-MM-DD-slug.md`, atualização em `social/README.md` e injeção do preset no topo de `social/gerador.html` com codificação UTF-8 sem BOM.
3. **Pilar 3 — Escala Psicométrica / Teste Interativo:** Instrumento autoaplicável em `testes/teste-slug.html` com cálculo 100% client-side privado, devolutiva clínica por faixas e card EXCLUSIVAMENTE na grade de `testes.html` (PROIBIDO inserir testes em `cards-artigos.html`).
4. **Pilar 4 — Jogo Cognitivo Diário:** Jogo interativo em `jogos/jogo-slug.html` com efeitos sonoros via Web Audio API, persistência em localStorage, solubilidade matemática prévia e card EXCLUSIVAMENTE na grade de `jogos.html`.

## 2. Trava de Qualidade (Quality Gate)
- É TERMINANTEMENTE PROIBIDO realizar commit ou finalizar a rodada da esteira entregando apenas o artigo ou apenas o social.
- Se um lote for iniciado, ele DEVE ser entregue com seus 4 pilares completos.
- Caso o artigo e o carrossel já tenham sido produzidos previamente, o agente DEVE produzir imediatamente o teste e o jogo faltantes para sanar a pendência do lote.

## 3. Gestão das Filas
- Artigos e pautas: `pautas.md`
- Testes e escalas: `testes-planejamento.md`
- Jogos de lógica: `jogos-planejamento.md`
- Matriz unificada: `esteiras-programacao.md`
