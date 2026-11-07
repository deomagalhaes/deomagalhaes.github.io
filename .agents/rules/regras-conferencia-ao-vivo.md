# Regra de Conferência ao Vivo e Links Diretos Clicáveis — Deo Magalhães

Sempre que você criar, editar, atualizar ou refatorar qualquer arquivo no ecossistema `deomagalhaes.github.io` (`deomagalhaes.com.br`), é **OBRIGATÓRIO** fornecer imediatamente na resposta links diretos e clicáveis para conferência ao vivo e inspeção no editor.

---

## 1. Princípio da Verificação Imediata
O usuário e os revisores devem conseguir abrir, auditar e testar imediatamente qualquer arquivo manipulado com um único clique no chat/IDE, sem necessidade de procurar caminhos na árvore de diretórios ou montar URLs manualmente.

---

## 2. Formato Obrigatório dos Links Clicáveis

Toda resposta que realizar edições ou criações de arquivos deve apresentar ao final uma seção clara e destacada:

```markdown
### 🔗 Conferência ao Vivo e Arquivos Manipulados
```

Para cada arquivo manipulado, forneça:

1. **Link Direto do Arquivo no Editor (Protocolo `file:///`):**
   - Utilizar padrão Markdown com o esquema `file:///` e barras normais (`/`).
   - Caminho base canônico do projeto: `c:/Users/PC/Documents/Repositório SITE Github/deomagalhaes.github.io`
   - Para evitar quebras por espaços ou acentos no caminho, envolva a URL em chevrons `<...>`:
     `[nome-do-arquivo.ext](<file:///c:/Users/PC/Documents/Repositório%20SITE%20Github/deomagalhaes.github.io/caminho/arquivo.ext>)`
   - Quando aplicável, aponte diretamente para o intervalo de linhas modificadas:
     `[nome-do-arquivo.ext#L10-L45](<file:///c:/Users/PC/Documents/Repositório%20SITE%20Github/deomagalhaes.github.io/caminho/arquivo.ext#L10-L45>)`

2. **Links de Conferência ao Vivo no Navegador (para páginas `.html` e aplicações interativas):**
   - **Local / Live Server (Porta 5500 ou 8000):**
     `[Visualizar no Live Server](http://127.0.0.1:5500/caminho/arquivo.html)`
   - **Visualização Local Direta no Navegador:**
     `[Abrir Arquivo no Navegador](<file:///c:/Users/PC/Documents/Repositório%20SITE%20Github/deomagalhaes.github.io/caminho/arquivo.html>)`
   - **URL Canônica em Produção / GitHub Pages:**
     `[Abrir no Domínio de Produção](https://deomagalhaes.com.br/caminho/arquivo.html)`

---

## 3. Matriz Padronizada de Apresentação

### A. Para Páginas Web (`.html`), Testes, Artigos, Recursos e Jogos
Apresente uma tabela com os canais diretos de conferência:

| Arquivo | Ação Realizada | Abrir no Editor (IDE) | Conferência Local (Live Server) | Produção (Web) |
| :--- | :--- | :--- | :--- | :--- |
| `artigos/slug.html` | Criado / Editado | [Abrir Código](<file:///c:/Users/PC/Documents/Repositório%20SITE%20Github/deomagalhaes.github.io/artigos/slug.html>) | [Visualizar Local](http://127.0.0.1:5500/artigos/slug.html) | [Abrir no Site](https://deomagalhaes.com.br/artigos/slug.html) |

### B. Para Arquivos de Suporte (`.js`, `.css`, `.json`, `.md`, `.ps1`)
Apresente a tabela com apontamento de trecho e escopo:

| Arquivo | Ação Realizada | Abrir no Editor (IDE) | Trecho / Escopo |
| :--- | :--- | :--- | :--- |
| `assets/script.js` | Modificado | [Ver Alterações](<file:///c:/Users/PC/Documents/Repositório%20SITE%20Github/deomagalhaes.github.io/assets/script.js#L120-L150>) | Implementação da função de sincronização |

---

## 4. Diretrizes Técnicas Rigorosas
1. **Barras Normais (`/`) Estritas:** NUNCA utilize barras invertidas (`\`) nos links Markdown com `file:///`. Use sempre forward slashes para assegurar interoperabilidade no editor e navegadores.
2. **Escudos de Sintaxe Markdown:** Sempre utilize `<...>` ao redor de URLs `file:///` contendo espaços (`Repositório%20SITE%20Github` ou `Repositório SITE Github`) para garantir que o cliente de chat renderize o hyperlink de ponta a ponta sem truncamento.
3. **Imediato e Automático:** Esta regra deve ser aplicada espontaneamente em todas as interações onde qualquer arquivo for gravado ou modificado via ferramentas (`write_file`, `edit_file`, etc.), dispensando solicitações adicionais do usuário.
4. **Acionamento do Botão de Publicação:** Imediatamente após a apresentação dos links de conferência, acione a regra canônica de aprovação descrita em `regras-aprovacao-publicacao.md` através da ferramenta interativa `ask_question`.
