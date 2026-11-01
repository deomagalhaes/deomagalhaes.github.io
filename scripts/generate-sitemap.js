// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://deomagalhaes.com.br';
const ROOT_DIR = path.resolve(__dirname, '..');
const today = new Date().toISOString().split('T')[0];

const urls = [];

function isRedirectStub(fullPath, stat) {
    if (stat.size >= 2048) return false;
    try {
        const text = fs.readFileSync(fullPath, 'utf8');
        return text.includes('http-equiv="refresh"');
    } catch (e) {
        return false;
    }
}

function getFileDate(stat) {
    return stat.mtime.toISOString().split('T')[0];
}

// 1. Arquivos da raiz
const rootFiles = fs.readdirSync(ROOT_DIR);
rootFiles.forEach(file => {
    if (file.endsWith('.html') && file !== 'cards-artigos.html') {
        const fullPath = path.join(ROOT_DIR, file);
        const stat = fs.statSync(fullPath);
        const isDynamic = ['index.html', 'artigos.html', 'testes.html', 'jogos.html', 'recursos.html'].includes(file);
        const url = file === 'index.html' ? `${BASE_URL}/` : `${BASE_URL}/${file}`;
        urls.push({
            loc: url,
            lastmod: isDynamic ? today : getFileDate(stat),
            priority: file === 'index.html' ? '1.0' : (isDynamic ? '0.9' : '0.7'),
            changefreq: isDynamic ? 'daily' : 'weekly'
        });
    }
});

// 2. Artigos
const artigosDir = path.join(ROOT_DIR, 'artigos');
if (fs.existsSync(artigosDir)) {
    const artigosFiles = fs.readdirSync(artigosDir);
    artigosFiles.forEach(file => {
        if (file.endsWith('.html')) {
            const fullPath = path.join(artigosDir, file);
            const stat = fs.statSync(fullPath);
            if (!isRedirectStub(fullPath, stat)) {
                urls.push({
                    loc: `${BASE_URL}/artigos/${file}`,
                    lastmod: getFileDate(stat),
                    priority: '0.8',
                    changefreq: 'monthly'
                });
            }
        }
    });
}

// 3. Testes
const testesDir = path.join(ROOT_DIR, 'testes');
if (fs.existsSync(testesDir)) {
    const testesFiles = fs.readdirSync(testesDir);
    testesFiles.forEach(file => {
        if (file.endsWith('.html')) {
            const fullPath = path.join(testesDir, file);
            const stat = fs.statSync(fullPath);
            urls.push({
                loc: `${BASE_URL}/testes/${file}`,
                lastmod: getFileDate(stat),
                priority: '0.85',
                changefreq: 'monthly'
            });
        }
    });
}

// 4. Jogos
const jogosDir = path.join(ROOT_DIR, 'jogos');
if (fs.existsSync(jogosDir)) {
    const jogosFiles = fs.readdirSync(jogosDir);
    jogosFiles.forEach(file => {
        if (file.endsWith('.html')) {
            const fullPath = path.join(jogosDir, file);
            const stat = fs.statSync(fullPath);
            urls.push({
                loc: `${BASE_URL}/jogos/${file}`,
                lastmod: getFileDate(stat),
                priority: '0.85',
                changefreq: 'monthly'
            });
        }
    });
}

// 5. Recursos
const recursosDir = path.join(ROOT_DIR, 'recursos');
if (fs.existsSync(recursosDir)) {
    const recursosFiles = fs.readdirSync(recursosDir);
    recursosFiles.forEach(file => {
        if (file.endsWith('.html')) {
            const fullPath = path.join(recursosDir, file);
            const stat = fs.statSync(fullPath);
            if (!isRedirectStub(fullPath, stat)) {
                urls.push({
                    loc: `${BASE_URL}/recursos/${file}`,
                    lastmod: getFileDate(stat),
                    priority: '0.8',
                    changefreq: 'monthly'
                });
            }
        }
    });
}

// 6. Subaplicações
const expPath = path.join(recursosDir, 'explorador-dois-mundos', 'index.html');
if (fs.existsSync(expPath)) {
    const stat = fs.statSync(expPath);
    urls.push({
        loc: `${BASE_URL}/recursos/explorador-dois-mundos/`,
        lastmod: getFileDate(stat),
        priority: '0.8',
        changefreq: 'monthly'
    });
}
const croPath = path.join(jogosDir, 'cronicas-dos-emissarios', 'index.html');
if (fs.existsSync(croPath)) {
    const stat = fs.statSync(croPath);
    urls.push({
        loc: `${BASE_URL}/jogos/cronicas-dos-emissarios/`,
        lastmod: getFileDate(stat),
        priority: '0.8',
        changefreq: 'monthly'
    });
}

// Gerar XML
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

urls.forEach(u => {
    xml += '  <url>\n';
    xml += `    <loc>${u.loc}</loc>\n`;
    xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += '  </url>\n';
});

xml += '</urlset>\n';

const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`✅ sitemap.xml gerado com sucesso com ${urls.length} URLs indexáveis (datas reais preservadas).`);
