# Programação Mestra de Esteiras Contínuas — Deo Magalhães

Este documento estabelece o **cronograma estruturado, matriz de entregas e regras de execução automatizada contínua** para a expansão do ecossistema [deomagalhaes.com.br](https://deomagalhaes.com.br).

Cada **Rodada de Esteira (Lote de Produção)** é uma unidade autônoma e sincronizada composta obrigatoriamente por 4 pilares:
1. **Artigo Científico de Alta Densidade** (Clínico, humanista, neurobiológico com referências ABNT).
2. **Roteiro de Carrossel Instagram (1080x1080)** (Pronto para postagem no Studio Visual e redes).
3. **Escala Psicométrica / Teste Psicoeducativo Autoaplicável** (Cálculo client-side 100% privado com devolutiva clínica).
4. **Jogo Cognitivo Interativo** (Matematicamente validado, responsivo e com efeitos Web Audio API).

---

## 🗺️ Matriz de Lotes de Produção

| Lote / Esteira | Artigo Científico | Roteiro Social Instagram | Teste / Escala Psicométrica | Jogo Cognitivo Diário | Status |
|:---:|:---|:---|:---|:---|:---:|
| **Lote 1** | **A Neurobiologia do Perdão e da Mágoa:** Como o Ressentimento Crônico Danifica o Eixo do Estresse | Carrossel: *O Custo Biológico do Rancor* | **T-14:** Inventário de Sensibilidade Sensorial e Hiper-reatividade | **Dia 12:** Matriz de Associação Semântica | ✅ **Concluído** |
| **Lote 2** | **O Sistema Glinfático e o Sono Profundo (NREM):** A Limpeza Noturna de Toxinas Cerebrais | Carrossel: *A Faxina Noturna do Cérebro* | **T-15:** Inventário de Assertividade e Estabelecimento de Limites | **Dia 13:** Torre de Londres (Planejamento Motor) | ✅ **Concluído** |
| **Lote 3** | **A Neurobiologia da Autocompaixão:** Como a Gentileza Interna Desativa a Amígdala | Carrossel: *Por Que Ser Gentil Consigo Desinflama o Corpo* | **T-16:** Escala de Autocompaixão Clínica (Neff) | **Dia 14:** Blocos de Corsi (Memória Visuoespacial) | ✅ **Concluído** |
| **Lote 4** | **Arquitetura do Pensamento Crítico:** Como Desarmar o Viés de Confirmação | Carrossel: *Por Que Acreditamos no Que Queremos* | **T-17:** Inventário de Rigidez Epistêmica e Crenças | **Dia 15:** N-Back Dual (Atualização de Memória) | ✅ **Concluído** |
| **Lote 5** | **A Neuroquímica do Vínculo Amoroso:** Ocitocina, Vasopressina e Apego Seguro | Carrossel: *A Química do Amor de Longo Prazo* | **T-18:** Escala de Satisfação Conjugal e Segurança Afetiva | **Dia 16:** Criptografia Neural (Substituição de Padrões) | ✅ **Concluído** |
| **Lote 6** | **O Fenômeno do Bloqueio Executivo no TDAH:** Por Que a Paralisia Não É Preguiça | Carrossel: *A Neurociência do Bloqueio Executivo* | **T-19:** Escala de Inércia Psíquica e Arranque Motor | **Dia 17:** Labirinto Hexagonal de Relações Espaciais | ✅ **Concluído** |
| **Lote 7** | **A Fadiga por Decisão e a Depleção do Ego:** Como Escolhas Cotidianas Esgotam o Cérebro | Carrossel: *Por Que Decidir Cansa Tanto* | **T-20:** Escala de Fadiga por Decisão e Depleção do Ego | **Dia 18:** Balança dos Ponderáveis (Inferência Bayesiana) | ✅ **Concluído** |
| **Lote 8** | **A Neurobiologia da Ruminação Depressiva:** A Hiperconectividade da Rede de Modo Padrão (DMN) e a Perda de Controle Pré-Frontal | Carrossel: *O Labirinto da Ruminação Mental* | **T-21:** Inventário de Sintomas de Desregulação do Eixo HPA | **Dia 19 & Dia 20:** Matriz de Conflitos & Campo Receptivo | ✅ **Concluído** |
| **Lote 9** | **O Efeito Nocebo e a Neurobiologia da Dor Psigogênica:** Como a Expectativa Negativa Modula as Vias Descendentes da Dor | Carrossel: *Quando o Cérebro Cria a Dor: A Ciência do Efeito Nocebo* | **T-22:** Escala de Disforia Sensível à Rejeição (RSD) e Reatividade Afetiva | **Dia 21:** Balança de Pesos e Medidas Alquímicas | ⏳ **Próximo da Fila** |

---

## ⚙️ Regras de Ouro e Critérios de Qualidade (Quality Gates)

Toda esteira deve cumprir rigorosamente as seguintes diretrizes antes de ser comitada e publicada:

### 1. Identidade e Autoridade
- **Nome do Autor:** Sempre **Deo Magalhães - Neuropsicólogo e Neurocientista (CRP 04/42784)**.
- **PROIBIDO:** Utilizar o prefixo "Dr." antes do nome Deo Magalhães.
- **Tom:** Acadêmico-clínico, profundo, humanista, integrando neurociência com psicologia baseada em evidências (TCC, ACT, Teoria do Apego) e filosofia existencial.

### 2. Estrutura HTML Obrigatória
- **Cabeçalho Institucional Padronizado (Canônico):**
  - DEVE usar `<header id="main-header"><div class="header-content container">...<button class="mobile-menu-btn" aria-label="Abrir menu">☰</button><nav id="main-nav"><a ...>...</a></nav></div></header>`.
  - Links oficiais do menu: `Home`, `Sobre`, `Serviços`, `Agendamento`, `Artigos`, `Testes`, `Jogos`, `Recursos`.
  - **PROIBIDO:** Usar `id="navbar"`, `id="menu-toggle"`, `class="nav-links"`, `Início` (usar `Home`) ou incluir `contato.html` no menu superior.
- **Artigos:**
  - Container principal: `<div class="container article-container">` (garante centralização responsiva com `margin: 0 auto;`).
  - Referências bibliográficas completas no padrão ABNT ao final.
- **Rodapé Institucional:**
  - DEVE usar a classe `footer-grid`: `<div class="container footer-grid">`.
  - Conter colunas de Contato, Informações Profissionais (CRP 04/42784) e Redes Sociais.

### 3. Studio Gerador de Redes Sociais (`social/gerador.html`)
- **OBRIGATÓRIO:** Todo carrossel produzido na esteira deve:
  1. Gerar o arquivo markdown canônico em `social/YYYY-MM-DD-slug.md` e atualizar o histórico em `social/README.md`.
  2. Ser **injetado diretamente dentro de `social/gerador.html`**:
     - Adicionar `<option value="slug-curto" selected>Título do Artigo</option>` no topo do `<select id="articleSelect">`.
     - Adicionar a estrutura do preset no topo de `const PRESETS = { ... }` contendo `articleSlug`, `articleTitle`, `slides: [...]` (mínimo de 6 slides) e `caption` completa com hashtags.
     - Definir as variáveis de estado inicial (`currentPresetKey`, `currentSlides`, `currentCaption`) para carregar o novo carrossel por padrão ao abrir o studio visual.

### 4. Validação Algorítmica dos Jogos
- Todo jogo cognitivo interativo deve ter sua **solubilidade comprovada matematicamente** por meio de simulação prévia em script PowerShell ou JavaScript antes da entrega, garantindo taxa de 100% de estados resolúveis.

### 5. Centralizadores, Taxonomia e SEO
- **Segregação estrita de pastas e cards:**
  - Artigos em `artigos/` e cards **EXCLUSIVAMENTE** em `cards-artigos.html`.
  - Testes e Escalas em `testes/` e cards **EXCLUSIVAMENTE** na grade de `testes.html`. **PROIBIDO** colocar cards de testes em `cards-artigos.html`.
  - Jogos em `jogos/` e cards **EXCLUSIVAMENTE** na grade de `jogos.html`.
  - Ferramentas e Recursos em `recursos/` e cards **EXCLUSIVAMENTE** na grade de `recursos.html`.
- Adição das novas URLs no `sitemap.xml` via `scripts/generate-sitemap.ps1`.
- Atualização das filas em `pautas.md`, `testes-planejamento.md` e `jogos-planejamento.md`.

### 6. Git Flow
- Execução de `git add .`
- Commit semântico padronizado: `feat(esteira): publica [artigo], [teste], [jogo] e [carrossel visual]`
- Envio imediato para `origin/main` via `git push origin main`.

