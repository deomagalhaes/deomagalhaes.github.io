// Script para funcionalidades do site
document.addEventListener('DOMContentLoaded', function() {
    // Cabeçalho dinâmico (encolhe ao rolar)
    const header = document.getElementById('main-header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.getElementById('main-nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
        });
    }

    // Destacar link ativo na navegação
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        link.classList.remove('active');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});
