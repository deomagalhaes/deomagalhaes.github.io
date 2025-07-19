// Script para funcionalidades do site
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================================================
    // 1. CABEÇALHO DINÂMICO (ENCOLHE AO ROLAR)
    // ==================================================
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // ==================================================
    // 2. MENU MOBILE (BOTÃO HAMBÚRGUER)
    // ==================================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.getElementById('main-nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            // A classe 'mobile-open' é mais semântica que 'active' para esta função
            nav.classList.toggle('mobile-open');
        });
    }

    // ==================================================
    // 3. DESTACAR LINK ATIVO NA NAVEGAÇÃO
    // ==================================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        // Garante que a comparação funcione corretamente
        const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';
        link.classList.remove('active');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // ==================================================
    // 4. INICIALIZAÇÃO DO CARROSSEL DE SERVIÇOS (SWIPER.JS)
    // ==================================================
    // Verifica se o elemento do carrossel existe na página antes de tentar inicializá-lo
    if (document.querySelector('.services-carousel')) {
        const servicesSwiper = new Swiper('.services-carousel', {
            // Quantidade de slides visíveis por padrão (telas pequenas)
            slidesPerView: 1,
            // Espaço entre os slides
            spaceBetween: 30,
            
            // Configurações de navegação (setas)
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
    
            // Configurações responsivas (breakpoints) para mostrar mais cards em telas maiores
            breakpoints: {
                // Quando a largura da tela for 576px ou mais
                576: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                // Quando a largura da tela for 992px ou mais
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
                // Quando a largura da tela for 1200px ou mais
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 30
                }
            }
        });
    }
});
