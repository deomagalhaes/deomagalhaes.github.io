---
trigger: always_on
---

# Regras de Publicação de Artigos — Deo Magalhães

Sempre que você for solicitado a criar, revisar ou publicar um artigo para o site de Deo Magalhães (`deomagalhaes.github.io`), siga estritamente estas diretrizes:

## 1. Identidade e Tom de Voz
- **Autor:** Deo Magalhães - Neuropsicólogo e Neurocientista (CRP 04/42784, Especialista em Neurociências, Membro da SBNp).
- **Tom:** Acadêmico-clínico, profundo, humanista, existencial e acessível. Nunca raso ou sensacionalista. Evite jargões de autoajuda barata.
- **Estrutura teórica:** Sempre integre neurociência comportamental/cognitiva com psicologia clínica (TCC, Logoterapia, Sistêmica) e filosofia (existencialismo, estoicismo, teoria crítica).
- **Referências bibliográficas:** Obrigatórias no final de todo artigo, no formato ABNT, com autores consagrados (livros e periódicos científicos com ano, preferencialmente publicações em pt-br).

## 2. Template HTML Obrigatório dos Artigos (`artigos/slug-do-artigo.html`)
- O arquivo deve residir na pasta `deomagalhaes.github.io/artigos/`.
- **`<head>`**:
  - Google Analytics: `G-9X4VW4FNZZ`.
  - `<title>`: `Título do Artigo – Deo Magalhães`.
  - `<meta name="description">`: Resumo chamativo para SEO (140-160 caracteres).
  - Favicon: `/assets/favicon2.png`.
  - CSS: `/assets/style.css`.
- **Cabeçalho padrão do site**:
  - Top bar com ícones de contato (WhatsApp, E-mail, Instagram, Localização).
  - `header#main-header` com menu de navegação onde `a[href="/artigos.html"]` possui a classe `active`.
  - Imagem do logo com proporções exatas:
    `<a href="/index.html" class="logo-container"><img src="/assets/logo-deo.png" alt="Logotipo Deo Magalhães"><div class="logo-text"><span class="name">Deo Magalhães</span><span class="subtitle">Neurociência e Comportamento</span></div></a>`
- **Corpo (`main > .container.article-container`)**:
  - **OBRIGATÓRIO:** O container do artigo DEVE conter as duas classes: `<div class="container article-container">`. Isso garante a centralização de margens (`margin: 0 auto;`) e o espaçamento correto em telas de qualquer tamanho, prevenindo que o texto fique encostado ou justificado à esquerda.
  - `header.article-header`: `h1` com o título e `p.article-author-date` com "Por Deo Magalhães - Neuropsicólogo e Neurocientista - Publicado em [Data Atual]".
  - `article.article-body`: Introdução em itálico (`<p><em>...</em></p>`), seções com `<h2>` (e `<h3>`), listas explicativas, referências com `<ol class="references-list">`, divisor `<hr class="article-divider">` e disclaimer padrão:
    `Este artigo tem caráter reflexivo e educacional. Para orientações específicas sobre diagnóstico e tratamento, consulte sempre um profissional de saúde qualificado.`
- **Rodapé padrão obrigatório do site**: Deve usar a estrutura com classe `footer-grid` (NÃO usar `footer-content` nem `footer-col` com logo grande no rodapé):
```html
<footer class="main-footer">
    <div class="container footer-grid">
        <div class="footer-column">
            <h4>Contato</h4>
            <ul>
                <li><a href="https://wa.me/5535933003807" target="_blank">(35) 9 3300-3807</a></li>
                <li><a href="mailto:contato@deomagalhaes.com.br">contato@deomagalhaes.com.br</a></li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Guaranésia, MG</li>
            </ul>
        </div>
        <div class="footer-column">
            <h4>Informações Profissionais</h4>
            <ul>
                <li>CRP 04/42784</li>
                <li>Neuropsicólogo Clínico</li>
                <li>Especialista em Neurociências</li>
                <li>Membro da SBNp</li>
            </ul>
        </div>
        <div class="footer-column">
            <h4>Redes Sociais</h4>
            <ul>
                <li><a href="https://instagram.com/deomagalhaesneuro" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> @deomagalhaesneuro</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <div class="container">
            <p>&copy; 2026 Deo Magalhães - Neuropsicólogo CRP 04/42784. Todos os direitos reservados.</p>
            <p>Desenvolvido com tecnologia moderna para melhor experiência do usuário.</p>
        </div>
    </div>
</footer>
```
- **Script final**: `<script src="/assets/script.js"></script>`.

## 3. Centralizador de Cards (`cards-artigos.html`)
Sempre que um novo artigo for criado:
- Insira o card no TOPO de `cards-artigos.html` logo abaixo de `<!-- ARQUIVO: _cards-artigos.html -->`.
- O elemento raiz deve ser `<a href="artigos/slug-do-artigo.html" class="article-item-custom" data-categories="...">`.
- O atributo `data-categories` DEVE usar apenas os slugs de categoria oficiais do site:
  - `desenvolvimento-infantil`
  - `tdah-tea`
  - `orientacao-familiar`
  - `reabilitacao-cognitiva`
  - `filosofia`
  - `saude-mental`
  - `tecnologia`
  - `desenvolvimento-pessoal`
- Inclua data atual e de 1 a 3 tags no formato `<span class="tag-item">...</span>`.

## 4. Fluxo de Publicação e Git
1. Ler o arquivo `pautas.md` e selecionar o primeiro item pendente `[ ]`.
2. Criar o arquivo HTML do artigo em `deomagalhaes.github.io/artigos/slug.html`.
3. Inserir o card no topo de `cards-artigos.html`.
4. Atualizar o `pautas.md` marcando a pauta como `[x]` com a data da publicação.
5. Executar:
   - `git add cards-artigos.html pautas.md artigos/slug.html`
   - `git commit -m "Publica artigo: Nome do Artigo"`
   - `git push origin main`
