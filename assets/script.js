// Espera o documento HTML estar completamente carregado e pronto
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================================================
    // 1. CABEÇALHO DINÂMICO (ENCOLHE AO ROLAR)
    // ==================================================
    const header = document.getElementById('main-header');
    // Verifica se o elemento existe na página antes de adicionar o evento
    if (header) {
        window.addEventListener('scroll', function() {
            // Usa pageYOffset para compatibilidade com navegadores mais antigos
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 80) { // Um valor um pouco menor para a transição ser mais suave
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

    // Verifica se ambos os elementos existem
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            // Adiciona ou remove a classe 'active' para mostrar/esconder o menu
            nav.classList.toggle('active'); 
        });
    }

    // ==================================================
    // 3. DESTACAR LINK ATIVO NA NAVEGAÇÃO
    // ==================================================
    // Pega o nome do arquivo da URL atual (ex: "sobre.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#main-nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Remove a classe 'active' de todos os links primeiro
        link.classList.remove('active');
        // Adiciona a classe 'active' apenas se o href do link for igual à página atual
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // ==================================================
    // 4. INICIALIZAÇÃO DO CARROSSEL DE SERVIÇOS (SWIPER.JS)
    // ==================================================
    // Verifica se a classe do carrossel existe na página e se a biblioteca Swiper foi carregada
    if (typeof Swiper !== 'undefined' && document.querySelector('.services-carousel')) {
        const servicesSwiper = new Swiper('.services-carousel', {
            slidesPerView: 1,
            spaceBetween: 30,
            
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
    
            // Breakpoints para responsividade
            breakpoints: {
                576: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 30 },
                1200: { slidesPerView: 4, spaceBetween: 30 }
            }
        });
    }

}); // Fim do 'DOMContentLoaded'
