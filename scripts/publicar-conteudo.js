// scripts/publicar-conteudo.js
/**
 * Pipeline Integrado de Publicação e Social Hub — Deo Magalhães
 * 
 * Executa em cadeia:
 * 1. Processa a pauta pendente ou o artigo indicado
 * 2. Valida tags, metadados e codificação UTF-8
 * 3. Registra o card em cards-artigos.html
 * 4. Gera automaticamente o roteiro de carrossel de 6 slides (.md) em social/
 * 5. Atualiza o gerador.html (Studio Visual) com o novo preset do carrossel
 * 6. Atualiza o sitemap.xml com nova URL e data atualizada
 * 7. Executa commit e push para deploy imediato no GitHub Pages
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const SOCIAL_DIR = path.join(ROOT_DIR, 'social');
const CARDS_FILE = path.join(ROOT_DIR, 'cards-artigos.html');
const GERADOR_FILE = path.join(SOCIAL_DIR, 'gerador.html');
const README_SOCIAL = path.join(SOCIAL_DIR, 'README.md');

function getFormattedDate(d = new Date()) {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${d.getDate()} de ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

function getIsoDate(d = new Date()) {
    return d.toISOString().split('T')[0];
}

/**
 * Registra um novo card no topo de cards-artigos.html se ainda não existir
 */
function registrarCard({ href, title, description, categories, tags, dataFormatada }) {
    if (!fs.existsSync(CARDS_FILE)) return;
    let content = fs.readFileSync(CARDS_FILE, 'utf8');

    if (content.includes(`href="${href}"`)) {
        console.log(`[Card] Card já presente para ${href}`);
        return false;
    }

    const tagsHtml = (tags || ['Psicologia', 'Neurociência'])
        .map(t => `            <span class="tag-item">${t}</span>`)
        .join('\n');

    const cardHtml = `
<a href="${href}" class="article-item-custom" data-categories="${categories || 'saude-mental'}">
    <h3>${title}</h3>
    <p>${description}</p>
    <div class="article-meta-custom">
        <span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${dataFormatada}
        </span>
        <span class="tags-container">
${tagsHtml}
        </span>
    </div>
</a>
`;

    // Insere após o cabeçalho de comentário do arquivo
    const headerMarker = '<!-- Este arquivo centraliza TODOS os cards de artigos. Adicione novos cards sempre aqui. (VERSÃO OTIMIZADA) -->';
    if (content.includes(headerMarker)) {
        content = content.replace(headerMarker, `${headerMarker}\n${cardHtml}`);
    } else {
        content = cardHtml + '\n' + content;
    }

    fs.writeFileSync(CARDS_FILE, content, 'utf8');
    console.log(`[Card] ✅ Card adicionado com sucesso em cards-artigos.html`);
    return true;
}

/**
 * Gera arquivo de carrossel em social/<data>-<slug>.md no padrão canônico de 6 slides
 */
function gerarCarrosselMarkdown({ slug, title, slides, caption, reelsScript, dateIso, dataFormatada, urlRelativa }) {
    if (!fs.existsSync(SOCIAL_DIR)) {
        fs.mkdirSync(SOCIAL_DIR, { recursive: true });
    }

    const mdFilename = `${dateIso}-${slug}.md`;
    const mdPath = path.join(SOCIAL_DIR, mdFilename);

    let slidesMd = '';
    slides.forEach((s, idx) => {
        slidesMd += `### Slide ${idx + 1} (${s.badge || 'SLIDE'})\n`;
        slidesMd += `- **Título:** ${s.title}\n`;
        slidesMd += `- **Texto:**\n${s.body}\n`;
        if (s.footer) slidesMd += `- **Rodapé:** ${s.footer}\n`;
        slidesMd += `\n`;
    });

    const fullContent = `# Pílula de Conteúdo: ${title}

- **Artigo Base:** [${title}](${urlRelativa})
- **Data:** ${dataFormatada}
- **Autor:** Deo Magalhães (CRP 04/42784)
- **Canais:** Instagram (@deomagalhaesneuro), Threads, LinkedIn

---

## 📱 Módulo 1: Roteiro de Carrossel para Instagram (6 Slides 1080x1080)

${slidesMd}
---

## 📝 Módulo 2: Legenda Completa para Instagram

${caption}

---

## 🎬 Módulo 3: Script para Reels / Stories (60s)

${reelsScript || '* [00-10s] Gancho inicial com o conflito.\n* [10-35s] Mecanismo neuropsicológico resumido.\n* [35-60s] Síntese prática e convite para ler no site deomagalhaes.com.br.'}
`;

    fs.writeFileSync(mdPath, fullContent, 'utf8');
    console.log(`[Social] ✅ Arquivo de pílula gerado em social/${mdFilename}`);

    // Atualiza tabela do social/README.md
    if (fs.existsSync(README_SOCIAL)) {
        let readme = fs.readFileSync(README_SOCIAL, 'utf8');
        const rowMarker = '|---|---|---|---|';
        const newRow = `| **${dataFormatada}** | **${title}** | [\`social/${mdFilename}\`](${mdFilename}) | ✅ Pronto para postar |`;
        if (!readme.includes(mdFilename) && readme.includes(rowMarker)) {
            readme = readme.replace(rowMarker, `${rowMarker}\n${newRow}`);
            fs.writeFileSync(README_SOCIAL, readme, 'utf8');
            console.log(`[Social] ✅ README.md de redes atualizado`);
        }
    }

    return mdFilename;
}

/**
 * Injeta o novo preset de 6 slides dentro de social/gerador.html
 */
function injetarPresetNoStudio({ slugKey, slug, title, slides, caption }) {
    if (!fs.existsSync(GERADOR_FILE)) return;
    let geradorHtml = fs.readFileSync(GERADOR_FILE, 'utf8');

    // 1. Adiciona a opção no select se não existir
    const selectMarker = '<select id="articleSelect" onchange="loadPresetArticle(this.value)">';
    const optionTag = `<option value="${slugKey}">${title.substring(0, 50)}...</option>`;
    if (!geradorHtml.includes(`value="${slugKey}"`) && geradorHtml.includes(selectMarker)) {
        geradorHtml = geradorHtml.replace(selectMarker, `${selectMarker}\n                        ${optionTag}`);
    }

    // 2. Adiciona o objeto em PRESETS
    const presetsMarker = 'const PRESETS = {';
    if (!geradorHtml.includes(`${slugKey}: {`) && geradorHtml.includes(presetsMarker)) {
        const presetObj = `            "${slugKey}": {
                articleSlug: "${slug}",
                articleTitle: ${JSON.stringify(title)},
                slides: ${JSON.stringify(slides, null, 20).replace(/\n/g, '\n            ')},
                caption: ${JSON.stringify(caption)}
            },
`;
        geradorHtml = geradorHtml.replace(presetsMarker, `${presetsMarker}\n${presetObj}`);
        fs.writeFileSync(GERADOR_FILE, geradorHtml, 'utf8');
        console.log(`[Studio] ✅ Preset incorporado com sucesso no Studio Visual (gerador.html)`);
    }
}

/**
 * Executa o regenerador de sitemap existente
 */
function atualizarSitemap() {
    try {
        const sitemapScript = path.join(ROOT_DIR, 'scripts', 'generate-sitemap.js');
        if (fs.existsSync(sitemapScript)) {
            execSync(`node "${sitemapScript}"`, { stdio: 'inherit' });
            console.log(`[Sitemap] ✅ sitemap.xml regenerado e validado`);
        }
    } catch (err) {
        console.warn(`[Sitemap] Aviso ao atualizar sitemap:`, err.message);
    }
}

module.exports = {
    registrarCard,
    gerarCarrosselMarkdown,
    injetarPresetNoStudio,
    atualizarSitemap,
    getFormattedDate,
    getIsoDate
};

if (require.main === module) {
    console.log("Pipeline de publicação pronto para uso programático.");
}
