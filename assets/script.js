// Espera o documento HTML estar completamente carregado e pronto
document.addEventListener('DOMContentLoaded', function() {
    
// ==================================================
// 1. CABEÇALHO DINÂMICO (OTIMIZADO COM DEBOUNCE)
// ==================================================
const header = document.getElementById('main-header');
if (header) {
    let scrollTimeout; // Variável para guardar o timer

    const handleScroll = function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 10) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };

    window.addEventListener('scroll', function() {
        // Limpa o timer anterior sempre que um novo evento de scroll acontece
        clearTimeout(scrollTimeout);

        // Configura um novo timer para executar a função após 15ms
        scrollTimeout = setTimeout(handleScroll, 15);
    });
}



    // ==================================================
    // 2. MENU MOBILE (BOTÃO HAMBÚRGUER)
    // ==================================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.getElementById('main-nav');
    
    // Verifica se ambos os elementos (botão e menu) existem na página
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            // Adiciona ou remove a classe 'active' do menu de navegação
            nav.classList.toggle('active'); 
        });
    }

    // ==================================================
    // 3. DESTACAR LINK ATIVO NA NAVEGAÇÃO
    // ==================================================
    // Pega o nome do arquivo da página atual (ex: "index.html", "sobre.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#main-nav a');
    
    navLinks.forEach(link => {
        // Pega o href do link (ex: "/sobre.html")
        const linkPage = link.getAttribute('href').split('/').pop();
        
        // Limpa a classe 'active' de todos os links primeiro
        link.classList.remove('active');
        
        // Adiciona a classe 'active' apenas se o link corresponder à página atual
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // ==================================================
    // 4. INICIALIZAÇÃO DO CARROSSEL DE SERVIÇOS (SWIPER.JS)
    // ==================================================
    // Verifica se a biblioteca Swiper está carregada e se o elemento do carrossel existe
    if (typeof Swiper !== 'undefined' && document.querySelector('.services-carousel')) {
        const servicesSwiper = new Swiper('.services-carousel', {
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                576: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 30 },
                1200: { slidesPerView: 4, spaceBetween: 30 }
            }
        });
    }
// ==================================================
// 5. INICIALIZAÇÃO DO CARROSSEL HERO (SWIPER.JS)
// ==================================================
// Verifica se a biblioteca Swiper está carregada e se o elemento do carrossel existe
if (typeof Swiper !== 'undefined' && document.querySelector('.hero-carousel')) {
    const heroSwiper = new Swiper('.hero-carousel', {
        // Efeito de transição (fade é uma boa opção para seções hero)
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        
        // Loop infinito
        loop: true,

        // Autoplay (opcional, mas recomendado para hero)
        autoplay: {
            delay: 7000, // 7 segundos por slide
            disableOnInteraction: false, // Não para o autoplay após interação do usuário
        },

        // Paginação (as bolinhas)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // Navegação (as setas)
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

// ==================================================
// 6. INICIALIZAÇÃO DO CARROSSEL DE NOVIDADES DINÂMICAS (SWIPER.JS)
// ==================================================
const recentCarouselEl = document.querySelector('.recent-additions-carousel');
if (typeof Swiper !== 'undefined' && recentCarouselEl) {
    let recentSwiper = new Swiper('.recent-additions-carousel', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: false,
        grabCursor: true,
        autoplay: {
            delay: 6000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false
        },
        pagination: {
            el: '.recent-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.recent-next',
            prevEl: '.recent-prev',
        },
        breakpoints: {
            576: { slidesPerView: 2, spaceBetween: 20 },
            992: { slidesPerView: 3, spaceBetween: 24 },
            1200: { slidesPerView: 4, spaceBetween: 24 }
        }
    });

    // Opção 1: Fetch dinâmico inteligente dos cards mais recentes em cards-artigos.html
    const wrapper = document.getElementById('recent-additions-wrapper');
    if (wrapper) {
        fetch('cards-artigos.html')
            .then(res => {
                if (!res.ok) throw new Error('Falha ao carregar cards-artigos.html');
                return res.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const articles = doc.querySelectorAll('.article-item-custom');
                if (!articles || articles.length === 0) return;

                // Helper para determinar categoria e ícone
                const getCategoryMeta = (title, cats) => {
                    const t = title.toLowerCase();
                    const c = cats.toLowerCase();
                    if (t.includes('teste') || c.includes('teste')) {
                        return { badge: '📊 Teste Clínico', bg: '#e0f2fe', color: '#0369a1', iconBg: '#eef6fc', iconColor: '#0a9396', action: 'Realizar Teste →', icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' };
                    }
                    if (t.includes('storybook') || c.includes('storybook')) {
                        return { badge: '📖 Storybook', bg: '#fef3c7', color: '#92400e', iconBg: '#fffbeb', iconColor: '#d97706', action: 'Ler História →', icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' };
                    }
                    if (t.includes('ferramenta') || t.includes('jogo') || c.includes('jogo') || c.includes('ferramenta')) {
                        return { badge: '🫀 Ferramenta / Jogo', bg: '#e0f7fa', color: '#006064', iconBg: '#e0f2f1', iconColor: '#00796b', action: 'Acessar Recurso →', icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' };
                    }
                    return { badge: '🧠 Artigo Clínico', bg: '#ede9fe', color: '#5b21b6', iconBg: '#f5f3ff', iconColor: '#7c3aed', action: 'Ler Artigo →', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' };
                };

                const newSlides = [];
                const topItems = Array.from(articles).slice(0, 8); // Top 8 adições mais recentes

                topItems.forEach(item => {
                    const href = item.getAttribute('href') || '#';
                    const rawTitle = item.querySelector('h3') ? item.querySelector('h3').textContent.trim() : '';
                    const rawDesc = item.querySelector('p') ? item.querySelector('p').textContent.trim() : '';
                    const cats = item.getAttribute('data-categories') || '';
                    
                    // Extrai data limpa
                    let dateStr = 'Recente';
                    const metaSpan = item.querySelector('.article-meta-custom > span:first-child');
                    if (metaSpan) {
                        // Clona para remover SVGs e scripts internos antes de ler texto
                        const cloneSpan = metaSpan.cloneNode(true);
                        cloneSpan.querySelectorAll('svg, script, style').forEach(el => el.remove());
                        const textClean = cloneSpan.textContent.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
                        if (textClean && textClean.length < 40) {
                            dateStr = textClean;
                        }
                    }

                    const meta = getCategoryMeta(rawTitle, cats);

                    const slideHtml = `
                    <div class="swiper-slide">
                        <div class="service-card-detailed">
                            <span style="position:absolute; top:18px; right:18px; font-size:0.75rem; font-weight:700; background:${meta.bg}; color:${meta.color}; padding:3px 9px; border-radius:12px; z-index:2;">${meta.badge}</span>
                            <div class="icon" style="margin:0 0 15px 0; background:${meta.iconBg}; color:${meta.iconColor}; flex-shrink:0;">
                                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">${meta.icon}</svg>
                            </div>
                            <h3 style="font-size:1.12rem; line-height:1.35; margin-bottom:10px; color:var(--primary-dark-blue);">${rawTitle}</h3>
                            <p class="description" style="font-size:0.9rem; line-height:1.5; color:var(--text-color-light); margin-bottom:15px; flex-grow:1;">${rawDesc}</p>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f0f0f0; padding-top:12px; margin-top:auto; width:100%;">
                                <span style="font-size:0.8rem; color:#888; font-weight:500;">${dateStr}</span>
                                <a href="${href}" class="cta-button-small" style="padding:7px 16px; font-size:0.82rem; white-space:nowrap;">${meta.action}</a>
                            </div>
                        </div>
                    </div>`;
                    newSlides.push(slideHtml);
                });

                if (newSlides.length > 0) {
                    wrapper.innerHTML = newSlides.join('');
                    recentSwiper.update();
                }
            })
            .catch(err => {
                console.warn('Carregamento assíncrono de novidades usou fallback estático:', err);
            });
    }
}

// ==================================================
// 7. SANITIZADOR DEFENSIVO ANTI-LATEX (FALLBACK EM TEMPO REAL)
// ==================================================
const contentBlocks = document.querySelectorAll('.article-body, .theory-card');
if (contentBlocks.length > 0) {
    const latexQuickCheck = /(\$[^$\r\n]{1,120}\$|\\(neg|land|lor|to|leftrightarrow|forall|exists|therefore|sim|veebar|oplus|text|implies|iff|equiv|vdash|models|neq|leq|geq|approx|Box|Diamond)\b)/;
    const latexSymbols = {
        '\\neg': '\u00AC', '\\sim': '~', '\\land': '\u2227', '\\lor': '\u2228',
        '\\veebar': '\u22BB', '\\oplus': '\u2295', '\\to': '\u2192', '\\rightarrow': '\u2192',
        '\\leftarrow': '\u2190', '\\leftrightarrow': '\u2194', '\\implies': '\u21D2',
        '\\Rightarrow': '\u21D2', '\\iff': '\u21D4', '\\Leftrightarrow': '\u21D4',
        '\\forall': '\u2200', '\\exists': '\u2203', '\\therefore': '\u2234',
        '\\vdash': '\u22A2', '\\models': '\u22A8', '\\equiv': '\u2261',
        '\\neq': '\u2260', '\\leq': '\u2264', '\\geq': '\u2265', '\\approx': '\u2248',
        '\\pm': '\u00B1', '\\times': '\u00D7', '\\cdot': '\u00B7',
        '\\subset': '\u2282', '\\subseteq': '\u2286', '\\in': '\u2208', '\\notin': '\u2209',
        '\\cup': '\u222A', '\\cap': '\u2229', '\\emptyset': '\u2205',
        '\\Box': '\u25A1', '\\Diamond': '\u25C7'
    };

    const sanitizeLatexString = (str) => {
        let out = str.replace(/\\text\{([^}]*)\}/g, '$1');
        for (const [cmd, sym] of Object.entries(latexSymbols)) {
            out = out.split(cmd).join(sym);
        }
        out = out.replace(/([\u00AC~\u25A1\u25C7\u2200\u2203])\s+([A-Za-z])/g, '$1$2');
        out = out.replace(/(?<![A-Za-z])\$([^$\r\n]{1,120})\$/g, (_, inner) => inner.trim());
        return out;
    };

    contentBlocks.forEach(block => {
        const rawText = (block.textContent || '').replace(/(R|US)\$\s*\d/g, '');
        if (!latexQuickCheck.test(rawText)) return;

        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                const parentTag = node.parentElement ? node.parentElement.tagName : '';
                if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA'].includes(parentTag)) {
                    return NodeFilter.FILTER_REJECT;
                }
                const cleaned = node.nodeValue.replace(/(R|US)\$\s*\d/g, '');
                return latexQuickCheck.test(cleaned) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        });

        const nodesToFix = [];
        while (walker.nextNode()) nodesToFix.push(walker.currentNode);
        nodesToFix.forEach(node => {
            node.nodeValue = sanitizeLatexString(node.nodeValue);
        });
    });
}

// ==================================================
// 8. ACESSO ADMINISTRATIVO CRIPTOGRAFADO (CTRL+SHIFT+L)
// ==================================================
(function initRestrictedShortcut() {
    const DEFAULT_HASH = '354df90787ad93580dcc0ef9394ff7a37ec25f3388014fb210b3fb9431d023e5';
    const CIPHER_HEX = 'e771c79896c165d34d651f4a12057d69ccf4ee372b3a';

    function sha256Bytes(str) {
        const utf8 = new TextEncoder().encode(str);
        const K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
        const bitLen = utf8.length * 8;
        const padLen = ((utf8.length + 9 + 63) >> 6) << 6;
        const msg = new Uint8Array(padLen);
        msg.set(utf8);
        msg[utf8.length] = 0x80;
        const view = new DataView(msg.buffer);
        view.setUint32(padLen - 4, bitLen >>> 0, false);
        view.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000), false);
        const rotr = (n, x) => (x >>> n) | (x << (32 - n));
        const W = new Uint32Array(64);
        for (let offset = 0; offset < padLen; offset += 64) {
            for (let i = 0; i < 16; i++) W[i] = view.getUint32(offset + i * 4, false);
            for (let i = 16; i < 64; i++) {
                const s0 = rotr(7, W[i - 15]) ^ rotr(18, W[i - 15]) ^ (W[i - 15] >>> 3);
                const s1 = rotr(17, W[i - 2]) ^ rotr(19, W[i - 2]) ^ (W[i - 2] >>> 10);
                W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
            }
            let [a, b, c, d, e, f, g, h] = H;
            for (let i = 0; i < 64; i++) {
                const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
                const ch = (e & f) ^ (~e & g);
                const t1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
                const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const t2 = (S0 + maj) >>> 0;
                h = g; g = f; f = e; e = (d + t1) >>> 0;
                d = c; c = b; b = a; a = (t1 + t2) >>> 0;
            }
            H = H.map((v, idx) => (v + [a, b, c, d, e, f, g, h][idx]) >>> 0);
        }
        const out = new Uint8Array(32);
        const outView = new DataView(out.buffer);
        H.forEach((word, i) => outView.setUint32(i * 4, word, false));
        return out;
    }

    function bytesToHex(bytes) {
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function decryptRoute(pin, hexCipher) {
        const key = sha256Bytes('dm_vault_route_v1::' + pin);
        const len = hexCipher.length / 2;
        const out = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            const byte = parseInt(hexCipher.substr(i * 2, 2), 16);
            out[i] = byte ^ key[i % key.length];
        }
        return new TextDecoder().decode(out);
    }

    function resolveTargetUrl(relRoute) {
        if (window.location.protocol !== 'file:') {
            return '/' + relRoute.replace(/^\/+/, '');
        }
        const normPath = window.location.pathname.replace(/\\/g, '/');
        const subdirs = ['/artigos/', '/recursos/', '/testes/', '/jogos/', '/ferramentas-clinicas/', '/social/'];
        for (const sub of subdirs) {
            const idx = normPath.indexOf(sub);
            if (idx !== -1) {
                const after = normPath.slice(idx + sub.length);
                const depth = after.split('/').length;
                return '../'.repeat(depth) + relRoute;
            }
        }
        return relRoute;
    }

    function openKeyGateModal() {
        let modal = document.getElementById('dm-restricted-gate');
        if (modal) {
            modal.style.display = 'flex';
            const inp = modal.querySelector('input');
            if (inp) { inp.value = ''; inp.focus(); }
            return;
        }
        modal = document.createElement('div');
        modal.id = 'dm-restricted-gate';
        modal.setAttribute('style', 'position:fixed;inset:0;z-index:99999;background:rgba(9,13,22,0.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif;');
        modal.innerHTML = `
            <div style="background:#0f172a;border:1px solid #1e293b;border-radius:14px;padding:24px;width:100%;max-width:340px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);color:#f8fafc;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <span style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#38bdf8;font-weight:700;">Acesso Restrito</span>
                    <button type="button" id="dm-gate-close" style="background:none;border:none;color:#64748b;font-size:18px;cursor:pointer;line-height:1;">&times;</button>
                </div>
                <form id="dm-gate-form" autocomplete="off">
                    <input type="password" inputmode="numeric" id="dm-gate-pin" placeholder="PIN de autenticação" style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid #334155;background:#090d16;color:#f8fafc;font-size:16px;letter-spacing:0.25em;text-align:center;outline:none;margin-bottom:10px;" required />
                    <div id="dm-gate-err" style="color:#f87171;font-size:12px;min-height:18px;text-align:center;margin-bottom:8px;"></div>
                    <button type="submit" style="width:100%;padding:11px;border-radius:8px;border:none;background:#0284c7;color:#fff;font-weight:600;font-size:14px;cursor:pointer;">Desbloquear Ambiente</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const closeGate = () => { modal.style.display = 'none'; };
        modal.querySelector('#dm-gate-close').addEventListener('click', closeGate);
        modal.addEventListener('click', (ev) => { if (ev.target === modal) closeGate(); });

        const form = modal.querySelector('#dm-gate-form');
        const input = modal.querySelector('#dm-gate-pin');
        const errBox = modal.querySelector('#dm-gate-err');

        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const pin = (input.value || '').trim();
            const candidateHash = bytesToHex(sha256Bytes('dm_vault_auth_v1::' + pin));
            const activeHash = localStorage.getItem('dm_vault_custom_pin_hash') || DEFAULT_HASH;
            if (candidateHash !== activeHash) {
                errBox.textContent = 'Credencial inválida.';
                input.value = '';
                input.focus();
                return;
            }
            const activeCipher = localStorage.getItem('dm_vault_custom_route_hex') || CIPHER_HEX;
            const route = decryptRoute(pin, activeCipher);
            try {
                sessionStorage.setItem('dm_vault_auth_token', activeHash);
            } catch (_) {}
            window.location.href = resolveTargetUrl(route);
        });

        input.focus();
    }

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && !e.altKey && (e.code === 'KeyL' || (e.key && e.key.toLowerCase() === 'l'))) {
            e.preventDefault();
            openKeyGateModal();
        } else if (e.key === 'Escape') {
            const modal = document.getElementById('dm-restricted-gate');
            if (modal && modal.style.display !== 'none') modal.style.display = 'none';
        }
    });
})();

});

// Fim do 'DOMContentLoaded'
