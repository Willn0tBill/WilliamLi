(() => {
  'use strict';

  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  const year = document.getElementById('copyright-year');

  if (year) year.textContent = String(new Date().getFullYear());

  const readTheme = () => {
    try { return localStorage.getItem('william-portfolio-theme'); }
    catch (error) { return null; }
  };
  const saveTheme = (theme) => {
    try { localStorage.setItem('william-portfolio-theme', theme); }
    catch (error) { /* Privacy mode may disable storage. */ }
  };

  function setTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    if (themeButton) {
      themeButton.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeButton.setAttribute('title', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === 'dark' ? '#101311' : '#f4f5ee';
  }
  setTheme(readTheme() || 'dark');
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
      saveTheme(next);
    });
  }

  function closeMenu() {
    if (!menuButton || !navLinks) return;
    navLinks.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        const wasOpen = navLinks.classList.contains('is-open');
        closeMenu();
        if (wasOpen) menuButton.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!menuButton.contains(event.target) && !navLinks.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      cards.forEach(card => {
        card.hidden = filter !== 'all' && !card.dataset.category.split(/\s+/).includes(filter);
      });
    });
  });

  // Configure a real, verified HTTPS donation page here when one is available.
  // Never add bank details, secret keys, or payment credentials to public code.
  const DONATION_URL = '';
  const donationLink = document.getElementById('donation-link');
  const donationStatus = document.getElementById('donation-status');
  if (donationLink && donationStatus && DONATION_URL.trim()) {
    try {
      const target = new URL(DONATION_URL);
      if (target.protocol === 'https:' && target.hostname && !target.username && !target.password) {
        donationLink.href = target.href;
        donationLink.hidden = false;
        donationStatus.textContent = 'Donations are completed on the linked provider’s website. This portfolio never handles payment information.';
      }
    } catch (error) {
      // Do not show a donation button for malformed or unverified destinations.
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = [...document.querySelectorAll('.reveal')];

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    root.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('is-visible'));
  }
})();