(() => {
  'use strict';

  const search = document.getElementById('project-search');
  const quickButtons = [...document.querySelectorAll('[data-quick-search]')];
  const clearSearch = document.getElementById('clear-project-search');
  const resetFilters = document.getElementById('reset-project-filters');
  const allFilter = document.querySelector('[data-filter="all"]');
  const galleryDialog = document.getElementById('project-preview-dialog');
  const galleryImg = document.getElementById('preview-dialog-image');
  const galleryTitle = document.getElementById('preview-dialog-title');
  const galleryCaption = document.getElementById('preview-dialog-description');
  const galleryCount = document.getElementById('preview-dialog-count');
  const gallerySite = document.getElementById('preview-visit-link');
  const galleryGithub = document.getElementById('preview-github-link');
  const galleryCase = document.getElementById('preview-case-link');
  const closeButton = document.getElementById('preview-dialog-close');
  const prevButton = document.getElementById('preview-prev');
  const nextButton = document.getElementById('preview-next');
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  function updateQuickButtons() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    quickButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(query !== '' && button.dataset.quickSearch.toLocaleLowerCase() === query));
    });
    const filtered = [...document.querySelectorAll('[data-filter]')].some(button =>
      button.dataset.filter !== 'all' && button.getAttribute('aria-pressed') === 'true');
    if (clearSearch) clearSearch.hidden = !(query || filtered);
  }

  function setSearch(text) {
    if (!search) return;
    search.value = text;
    search.dispatchEvent(new Event('input', { bubbles: true }));
    updateQuickButtons();
  }

  function resetSearch() {
    if (allFilter && allFilter.getAttribute('aria-pressed') !== 'true') allFilter.click();
    setSearch('');
  }

  quickButtons.forEach(button => button.addEventListener('click', () => {
    const same = (search?.value || '').trim().toLowerCase() === button.dataset.quickSearch.toLowerCase();
    setSearch(same ? '' : button.dataset.quickSearch);
  }));
  if (clearSearch) clearSearch.addEventListener('click', resetSearch);
  if (resetFilters) resetFilters.addEventListener('click', resetSearch);
  if (search) search.addEventListener('input', updateQuickButtons);
  document.querySelectorAll('[data-filter]').forEach(button =>
    button.addEventListener('click', updateQuickButtons));
  updateQuickButtons();

  document.addEventListener('keydown', event => {
    if (galleryDialog?.open) return;
    const target = event.target;
    const isEditing = target?.isContentEditable ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName || '');
    const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (search && (shortcut || (event.key === '/' && !isEditing && !event.altKey && !event.ctrlKey && !event.metaKey))) {
      event.preventDefault();
      search.focus();
      search.scrollIntoView({ behavior: 'instant', block: 'center' });
    } else if (search && event.key === 'Escape' && document.activeElement === search) {
      event.preventDefault();
      if (search.value) setSearch('');
      else search.blur();
    }
  });

  function getProject(item) {
    const card = item.closest('article');
    if (!card) return null;
    const img = card.querySelector('img[src*="assets/screenshots/"]');
    if (!img) return null;
    const title = card.querySelector('.flip-title, .more-card h4')?.textContent?.trim();
    const website = [...card.querySelectorAll('a[href]')].find(a =>
      /^https:\/\/willn0tbill\.github\.io\//i.test(a.href))?.href;
    if (!website) return null;
    const github = [...card.querySelectorAll('a[href]')].find(a =>
      /^https:\/\/github\.com\/Willn0tBill\/[^/?#]+/i.test(a.href))?.href || '';
    const caseLink = card.querySelector('a[href^="./case-studies/"]')?.getAttribute('href') || '';
    return {
      button: item,
      card,
      title: title || 'Project screenshot',
      image: img.getAttribute('src'),
      alt: img.alt,
      website,
      github,
      caseLink,
      isPrivateFront: card.dataset.project === 'swiftsupply-ops'
    };
  }

  const gallery = [...document.querySelectorAll('[data-preview]')].map(getProject).filter(Boolean);
  let galleryEntries = gallery;
  let selectedIndex = -1;
  let trigger = null;

  function showGalleryImage(index) {
    if (!galleryEntries.length || !galleryImg || !galleryTitle) return;
    selectedIndex = (index + galleryEntries.length) % galleryEntries.length;
    const item = galleryEntries[selectedIndex];
    galleryTitle.textContent = item.title;
    galleryImg.src = item.image;
    galleryImg.alt = item.alt || ('Actual public website screenshot of ' + item.title);
    galleryCaption.textContent = item.isPrivateFront
      ? 'Public sign-in page only · November 2026. No staff-only information is shown.'
      : 'Actual public website screenshot · Captured November 2026';
    galleryCount.textContent = String(selectedIndex + 1).padStart(2,'0') + ' / ' +
      String(galleryEntries.length).padStart(2,'0');
    gallerySite.href = item.website;
    gallerySite.setAttribute('aria-label','Open ' + item.title + ' website');
    if (galleryGithub) {
      galleryGithub.href = item.github || '#';
      galleryGithub.hidden = !item.github;
      galleryGithub.setAttribute('aria-label', 'View ' + item.title + ' source on GitHub');
    }
    if (galleryCase) {
      galleryCase.href = item.caseLink || '#';
      galleryCase.hidden = !item.caseLink;
      galleryCase.setAttribute('aria-label', 'Read ' + item.title + ' case study');
    }
  }

  function openGallery(button) {
    if (!galleryDialog || typeof galleryDialog.showModal !== 'function') return;
    const current = gallery.find(item => item.button === button);
    if (!current) return;
    const visible = gallery.filter(item => !item.card.hidden);
    galleryEntries = visible.length ? visible : gallery;
    trigger = button;
    showGalleryImage(galleryEntries.indexOf(current));
    galleryDialog.showModal();
    closeButton?.focus({ preventScroll: true });
  }

  gallery.forEach(item => item.button.addEventListener('click', () => openGallery(item.button)));
  if (closeButton) closeButton.addEventListener('click', () => galleryDialog?.close());
  if (prevButton) prevButton.addEventListener('click', () => showGalleryImage(selectedIndex - 1));
  if (nextButton) nextButton.addEventListener('click', () => showGalleryImage(selectedIndex + 1));

  if (galleryDialog) {
    galleryDialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showGalleryImage(selectedIndex + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showGalleryImage(selectedIndex - 1);
      }
    });
    galleryDialog.addEventListener('click', event => {
      if (event.target === galleryDialog) galleryDialog.close();
    });
    galleryDialog.addEventListener('close', () => {
      if (!trigger?.isConnected) return;
      const card = trigger.closest('[data-flip-card]');
      if (card && !card.classList.contains('is-flipped')) {
        card.querySelector('.flip-toggle')?.click();
      }
      if (trigger.tabIndex >= 0) trigger.focus({ preventScroll: true });
      trigger = null;
      // Release the image source when closed so hidden images don't occupy memory.
      if (galleryImg) galleryImg.removeAttribute('src');
    });
  }

  let scheduled = false;
  function updateScrollUI() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const fraction = Math.max(0, Math.min(1, window.scrollY / max));
    if (progress) progress.style.transform = 'scaleX(' + fraction.toFixed(4) + ')';
    if (backToTop) {
      const visible = window.scrollY > 650;
      backToTop.classList.toggle('is-visible', visible);
      backToTop.tabIndex = visible ? 0 : -1;
    }
    let current = '';
    for (const anchor of navAnchors) {
      const section = document.querySelector(anchor.getAttribute('href'));
      if (section && section.getBoundingClientRect().top < window.innerHeight * .45) {
        current = anchor.getAttribute('href');
      }
    }
    navAnchors.forEach(anchor => {
      const active = anchor.getAttribute('href') === current;
      anchor.classList.toggle('is-current',active);
      if (active) anchor.setAttribute('aria-current','location');
      else anchor.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  function scheduleScroll() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateScrollUI);
    }
  }
  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',scheduleScroll);
  scheduleScroll();
})();
