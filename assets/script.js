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

}); 

// Fim do 'DOMContentLoaded'
