# Diretriz Fixa de Taxonomia e Estrutura de Pastas — Deo Magalhães

Este documento estabelece a segregação estrita e imutável de pastas por tipo de conteúdo no ecossistema [deomagalhaes.com.br](https://deomagalhaes.com.br).

---

## 1. Mapeamento Canônico de Pastas e Tipos de Conteúdo

Todo e qualquer conteúdo criado por agentes, esteiras automáticas ou desenvolvedores DEVE residir obrigatoriamente na pasta correspondente à sua natureza:

| Tipo de Conteúdo | Pasta Obrigatória | Padrão de Nomenclatura | Hub / Centralizador |
| :--- | :--- | :--- | :--- |
| **Artigos Científicos & Ensaios** | `artigos/` | `slug-do-artigo.html` | `artigos.html` e `cards-artigos.html` |
| **Escalas Psicométricas & Testes** | `testes/` | `teste-slug.html` ou `escala-slug.html` | `testes.html` e `testes-planejamento.md` |
| **Jogos Cognitivos & Lógica** | `jogos/` | `jogo-slug.html` | `jogos.html` e `jogos-planejamento.md` |
| **Ferramentas & Utilitários Clínicos** | `recursos/` | `nome-da-ferramenta.html` | `recursos.html` e `ferramentas-planejamento.md` |
| **Storybooks & Fábulas Infantis** | `storybooks/` ou `artigos/` | `storybook-slug.html` | `storybooks.html` e `storybooks-planejamento.md` |
| **Pílulas & Carrosséis de Redes** | `social/` | `YYYY-MM-DD-slug.md` | `social/gerador.html` e `social/README.md` |

---

## 2. Regras de Proibição e Blindagem (Quality Gate)

1. **PROIBIDO:** Salvar arquivos de testes ou escalas (`teste-*.html` ou `escala-*.html`) dentro de `artigos/` ou `recursos/`. Todo instrumento psicométrico pertence à pasta `testes/`.
2. **PROIBIDO:** Salvar jogos cognitivos (`jogo-*.html`) dentro de `recursos/` ou `artigos/`. Todo jogo pertence à pasta `jogos/`.
3. **PROIBIDO:** Remover ou corromper os stubs de redirecionamento anti-404 existentes nas pastas legadas.
4. **Links Relativos:** Em qualquer página dentro de `artigos/`, `testes/`, `jogos/` ou `recursos/`, referências a estilos e scripts raiz devem usar caminhos consistentes (`../assets/style.css` ou `/assets/style.css`).
5. **Validação Automática:** O script `scripts/check-quality-gate.ps1` é executado antes de cada commit e rejeita qualquer arquivo posicionado fora de sua pasta designada.

---

## 3. Fluxo de Publicação por Tipo

### A. Novo Artigo
- Criar em `artigos/slug.html`.
- Adicionar card no topo de `cards-artigos.html`.
- Marcar concluído em `pautas.md`.

### B. Novo Teste / Escala
- Criar em `testes/teste-slug.html`.
- Adicionar card na grade de `testes.html`.
- Adicionar card em `cards-artigos.html` com link `testes/teste-slug.html`.
- Marcar concluído em `testes-planejamento.md`.

### C. Novo Jogo Cognitivo
- Criar em `jogos/jogo-slug.html`.
- Validar algoritmo de resolução matemática prévia.
- Adicionar card na grade de `jogos.html` com link `jogos/jogo-slug.html`.
- Marcar concluído em `jogos-planejamento.md`.

### D. Nova Ferramenta Clínica
- Criar em `recursos/slug.html`.
- Adicionar card na grade de `recursos.html`.
- Marcar concluído em `ferramentas-planejamento.md`.
