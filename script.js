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

  const searchInput = document.getElementById('project-search');
  const resultsText = document.getElementById('project-results');
  const noResults = document.getElementById('no-results');
  const moreWork = document.getElementById('more-work');
  let activeFilter = 'all';

  function applyProjectFilter() {
    const query = searchInput?.value.trim().toLocaleLowerCase() || '';
    let shown = 0;
    cards.forEach(card => {
      const categoryMatch = activeFilter === 'all' ||
        (card.dataset.category || '').split(/\s+/).includes(activeFilter);
      const name = card.querySelector('.flip-title, .project-title-row h3, .more-card h4')?.textContent || '';
      const description = card.querySelector('.flip-description, .more-card p, p')?.textContent || '';
      const searchable = [name, description, card.dataset.category || ''].join(' ').toLocaleLowerCase();
      const match = categoryMatch && (!query || searchable.includes(query));
      card.hidden = !match;
      if (match) shown++;
    });
    if (moreWork) {
      const archiveCards = [...moreWork.querySelectorAll('.more-card')];
      moreWork.hidden = archiveCards.length > 0 && archiveCards.every(card => card.hidden);
    }
    if (resultsText) resultsText.textContent = 'Showing ' + shown + (shown === 1 ? ' project' : ' projects');
    if (noResults) noResults.hidden = shown !== 0;
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      applyProjectFilter();
    });
  });
  if (searchInput) searchInput.addEventListener('input', applyProjectFilter);


  // Featured project cards use an explicit flip state so touch and keyboard users
  // get the same content as hover users. Back-face links are never focusable while hidden.
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');
  const flipCards = [...document.querySelectorAll('[data-flip-card]')];

  function flipCard(card, open, focus) {
    const front = card.querySelector('.flip-card-front');
    const back = card.querySelector('.flip-card-back');
    const toggle = card.querySelector('.flip-toggle');
    const close = card.querySelector('.flip-close');
    const backControls = [...back.querySelectorAll('a,button')];

    card.classList.toggle('is-flipped', open);
    front.setAttribute('aria-hidden', String(open));
    back.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.tabIndex = open ? -1 : 0;
    backControls.forEach(element => element.tabIndex = open ? 0 : -1);

    if (focus === 'back') {
      const firstLink = back.querySelector('a');
      (firstLink || close).focus({ preventScroll: true });
    } else if (focus === 'front') {
      toggle.focus({ preventScroll: true });
    }
  }

  flipCards.forEach(card => {
    const toggle = card.querySelector('.flip-toggle');
    const close = card.querySelector('.flip-close');
    if (!toggle || !close) return;

    toggle.addEventListener('click', () => flipCard(card, true, 'back'));
    close.addEventListener('click', () => flipCard(card, false, 'front'));

    card.addEventListener('mouseenter', () => {
      if (hoverCapable.matches) flipCard(card, true);
    });
    card.addEventListener('mouseleave', () => {
      if (hoverCapable.matches && !card.contains(document.activeElement)) {
        flipCard(card, false);
      }
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Escape' && card.classList.contains('is-flipped')) {
        event.preventDefault();
        flipCard(card, false, 'front');
      }
    });
    card.addEventListener('focusout', event => {
      // Let keyboard users move through all three links without closing the card.
      if (!card.contains(event.relatedTarget) && !card.matches(':hover')) {
        flipCard(card, false);
      }
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