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

}); 

// Fim do 'DOMContentLoaded'
