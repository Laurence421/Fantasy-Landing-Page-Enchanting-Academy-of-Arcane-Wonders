document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    // Mobile menu
    const setMenu = (open) => {
        links.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        toggle.querySelector('i').className = open ? 'uil uil-times' : 'uil uil-bars';
    };
    toggle.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
    links.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && links.classList.contains('is-open')) {
            setMenu(false);
            toggle.focus();
        }
    });

    // Nav shadow once the page scrolls
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Buttons that jump to a section
    document.querySelectorAll('[data-scroll-to]').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelector(button.dataset.scrollTo)?.scrollIntoView();
        });
    });

    // Highlight the nav link of the section in view
    const navLinks = [...links.querySelectorAll('a')];
    const sections = [...new Set(navLinks.map((a) => a.getAttribute('href')))]
        .map((id) => document.querySelector(id))
        .filter(Boolean);
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((a) => {
                if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
                else a.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));

    // Reveal content as it scrolls into view
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // Character image: tap, click or keyboard swaps to the awakened form
    const imgs = document.getElementById('imgs');
    const flip = () => {
        const revealed = imgs.classList.toggle('is-revealed');
        imgs.setAttribute('aria-pressed', String(revealed));
    };
    imgs.addEventListener('click', flip);
    imgs.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            flip();
        }
    });
});
