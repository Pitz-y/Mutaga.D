// Smooth scrolling for internal links and active nav highlighting

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const yearSpan = document.getElementById('year');

    // Update year in footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', (!expanded).toString());
            navMenu.classList.toggle('open');
        });
    }

    // Close mobile menu after clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('open');
            navToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth scroll behavior using native CSS, with JS fallback for older browsers
    try {
        document.documentElement.style.scrollBehavior = 'smooth';
    } catch (_) {
        // Fallback: animate scroll
        const smoothScroll = (targetY) => {
            const startY = window.scrollY;
            const distance = targetY - startY;
            const duration = 400;
            let start;
            const step = (ts) => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / duration, 1);
                window.scrollTo(0, startY + distance * (p < 0.5 ? 2*p*p : -1 + (4 - 2*p) * p));
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const id = a.getAttribute('href')?.slice(1);
                const el = id ? document.getElementById(id) : null;
                if (el) {
                    e.preventDefault();
                    smoothScroll(el.getBoundingClientRect().top + window.scrollY - 70);
                }
            });
        });
    }

    // Active nav link highlighting on scroll
    const sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
    const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const onScroll = () => {
        const scrollPos = window.scrollY + 100; // offset for header
        let currentId = 'home';
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentId = section.id;
            }
        });
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${currentId}`;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});


