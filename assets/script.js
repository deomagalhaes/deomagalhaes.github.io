// Espera o documento HTML estar completamente carregado e pronto
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================================================
    // 1. CABEÇALHO DINÂMICO (ENCOLHE AO ROLAR)
    // ==================================================
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 80) {
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

}); 
/* ===================================================================== */
/* ||                 INICIALIZAÇÃO DO CARROSSEL DE TESTES            || */
/* ===================================================================== */
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se o elemento do carrossel de testes existe na página
    if (document.querySelector('.tests-carousel')) {
        const testsSwiper = new Swiper('.tests-carousel', {
            // Configurações do carrossel
            loop: true, // Faz o carrossel voltar ao início após o último slide
            slidesPerView: 1, // Mostra 1 slide por vez
            spaceBetween: 30, // Espaço entre os slides
            
            // Navegação por setas
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // Paginação por bolinhas
            pagination: {
                el: '.swiper-pagination',
                clickable: true, // Permite clicar nas bolinhas para navegar
            },
            
            // Autoplay (opcional, descomente para ativar)
            /*
            autoplay: {
              delay: 5000, // Tempo em milissegundos (5 segundos)
              disableOnInteraction: false,
            },
            */
        });
    }
});
// Fim do 'DOMContentLoaded'
