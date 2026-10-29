// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://deomagalhaes.com.br';
const ROOT_DIR = path.resolve(__dirname, '..');
const today = new Date().toISOString().split('T')[0];

const urls = [];

function isRedirectStub(filePath) {
    try {
        const text = fs.readFileSync(filePath, 'utf8');
        return text.includes('http-equiv="refresh"');
    } catch (e) {
        return false;
    }
}

// 1. Arquivos da raiz
const rootFiles = fs.readdirSync(ROOT_DIR);
rootFiles.forEach(file => {
    if (file.endsWith('.html') && file !== 'cards-artigos.html') {
        const url = file === 'index.html' ? `${BASE_URL}/` : `${BASE_URL}/${file}`;
        urls.push({
            loc: url,
            priority: file === 'index.html' ? '1.0' : (file.includes('artigos') || file.includes('testes') || file.includes('jogos') || file.includes('recursos') ? '0.9' : '0.8'),
            changefreq: file === 'index.html' || file.includes('artigos') || file.includes('testes') || file.includes('jogos') ? 'daily' : 'weekly'
        });
    }
});

// 2. Artigos (ignora stubs de redirecionamento)
const artigosDir = path.join(ROOT_DIR, 'artigos');
if (fs.existsSync(artigosDir)) {
    const artigosFiles = fs.readdirSync(artigosDir);
    artigosFiles.forEach(file => {
        if (file.endsWith('.html')) {
            const fullPath = path.join(artigosDir, file);
            if (!isRedirectStub(fullPath)) {
                urls.push({
                    loc: `${BASE_URL}/artigos/${file}`,
                    priority: '0.8',
                    changefreq: 'monthly'
                });
            }
        }
    });
}

// 3. Testes e Escalas Psicométricas
const testesDir = path.join(ROOT_DIR, 'testes');
if (fs.existsSync(testesDir)) {
    const testesFiles = fs.readdirSync(testesDir);
    testesFiles.forEach(file => {
        if (file.endsWith('.html')) {
            urls.push({
                loc: `${BASE_URL}/testes/${file}`,
                priority: '0.85',
                changefreq: 'monthly'
            });
        }
    });
}

// 4. Jogos Cognitivos
const jogosDir = path.join(ROOT_DIR, 'jogos');
if (fs.existsSync(jogosDir)) {
    const jogosFiles = fs.readdirSync(jogosDir);
    jogosFiles.forEach(file => {
        if (file.endsWith('.html')) {
            urls.push({
                loc: `${BASE_URL}/jogos/${file}`,
                priority: '0.85',
                changefreq: 'monthly'
            });
        }
    });
}

// 5. Recursos e Ferramentas Clínicas (ignora stubs de redirecionamento)
const recursosDir = path.join(ROOT_DIR, 'recursos');
if (fs.existsSync(recursosDir)) {
    const recursosFiles = fs.readdirSync(recursosDir);
    recursosFiles.forEach(file => {
        if (file.endsWith('.html')) {
            const fullPath = path.join(recursosDir, file);
            if (!isRedirectStub(fullPath)) {
                urls.push({
                    loc: `${BASE_URL}/recursos/${file}`,
                    priority: '0.8',
                    changefreq: 'monthly'
                });
            }
        }
    });
}

// 6. Subaplicações especiais
if (fs.existsSync(path.join(recursosDir, 'explorador-dois-mundos', 'index.html'))) {
    urls.push({
        loc: `${BASE_URL}/recursos/explorador-dois-mundos/`,
        priority: '0.8',
        changefreq: 'monthly'
    });
}
if (fs.existsSync(path.join(jogosDir, 'cronicas-dos-emissarios', 'index.html'))) {
    urls.push({
        loc: `${BASE_URL}/jogos/cronicas-dos-emissarios/`,
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
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += '  </url>\n';
});

xml += '</urlset>\n';

const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`✅ sitemap.xml gerado com sucesso com ${urls.length} URLs indexáveis.`);
