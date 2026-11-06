(() => {
  'use strict';

  const root = document.documentElement;
  const motionButton = document.getElementById('music-motion-toggle');
  const motionState = document.getElementById('music-motion-state');
  const progress = document.getElementById('music-motion-progress');
  const hero = document.querySelector('.artist-hero');
  const spotlight = document.querySelector('.artist-spotlight');
  const catalog = document.getElementById('release-grid');
  const storageKey = 'willnotbill-motion-pref';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function savedPreference() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === 'on' || value === 'off' ? value : 'on';
    } catch {
      return 'on';
    }
  }
  function savePreference(value) {
    try { localStorage.setItem(storageKey, value); }
    catch { /* Storage may be disabled by the browser. */ }
  }
  let requested = savedPreference();
  let pageVisible = !document.hidden;
  const revealed = [];
  let observer = null;

  // Prepare reveal targets before the first reveal frame.
  if (hero) {
    const groups = [
      ['.artist-section-top', 'from-left', 0],
      ['.artist-release', 'up', 1],
      ['.artist-platform-grid > *', 'from-left', 1],
      ['.artist-experience-item', 'up', 1],
      ['.artist-process-intro', 'from-left', 0],
      ['.artist-process-row', 'from-right', 1],
      ['.artist-closing-inner > *', 'up', 1]
    ];
    for (const [selector, direction, stagger] of groups) {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.setAttribute('data-motion-reveal', direction);
        element.style.setProperty('--motion-delay', String(Math.min(index % 4, 3) * (stagger ? 75 : 0)) + 'ms');
        revealed.push(element);
      });
    }
  }

  const supported = 'IntersectionObserver' in window;

  function visibleInViewport(element) {
    const box = element.getBoundingClientRect();
    return box.top <= window.innerHeight * .98 && box.bottom >= 0;
  }

  function revealNow() {
    for (const element of revealed) {
      if (visibleInViewport(element)) element.classList.add('is-visible');
    }
  }

  function initializeObserver() {
    if (!hero || observer || !supported) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .09, rootMargin: '0px 0px -5% 0px' });
    for (const element of revealed) observer.observe(element);
  }

  function effectiveEnabled() { return requested === 'on' && !reduced.matches; }
  function syncMotion() {
    const enabled = effectiveEnabled();
    root.dataset.musicMotion = enabled ? 'on' : 'off';
    root.dataset.musicMotionPaused = pageVisible ? 'no' : 'yes';
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(enabled));
      motionButton.setAttribute('aria-label',
        reduced.matches ? 'Animations are off because your device requests reduced motion'
        : (enabled ? 'Turn animations off' : 'Turn animations on'));
      motionButton.title = reduced.matches
        ? 'Your device has Reduce Motion enabled'
        : (enabled ? 'Turn animations off' : 'Turn animations on');
      motionButton.disabled = reduced.matches;
    }
    if (motionState) motionState.textContent = reduced.matches ? 'SYSTEM' : (enabled ? 'ON' : 'OFF');
    if (enabled && supported) {
      initializeObserver();
      revealNow();
    } else {
      revealed.forEach(element => element.classList.add('is-visible'));
    }
    if (progress) progress.hidden = !enabled;
    updateProgress();
  }

  if (motionButton) motionButton.addEventListener('click', () => {
    if (reduced.matches) return;
    requested = requested === 'on' ? 'off' : 'on';
    savePreference(requested);
    syncMotion();
  });
  if (reduced.addEventListener) reduced.addEventListener('change', syncMotion);
  else if (reduced.addListener) reduced.addListener(syncMotion);

  let progressFrame = 0;
  function updateProgress() {
    if (!progress || !effectiveEnabled()) return;
    const distance = Math.max(1, root.scrollHeight - window.innerHeight);
    const fraction = Math.max(0, Math.min(1, window.scrollY / distance));
    progress.style.transform = 'scaleX(' + fraction.toFixed(4) + ')';
  }
  function scheduleProgress() {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      progressFrame = 0;
      updateProgress();
    });
  }
  if (progress) {
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    root.dataset.musicMotionPaused = pageVisible ? 'no' : 'yes';
  });

  // Give the cover a small tracked movement on desktop, but not touch devices.
  if (spotlight && finePointer.matches) {
    let rect = null;
    let pointerFrame = 0;
    let x = 0;
    let y = 0;
    spotlight.addEventListener('pointerenter', () => {
      if (effectiveEnabled()) rect = spotlight.getBoundingClientRect();
    });
    spotlight.addEventListener('pointermove', event => {
      if (!effectiveEnabled() || !pageVisible || !rect) return;
      x = ((event.clientX - rect.left) / rect.width - .5) * 10;
      y = ((event.clientY - rect.top) / rect.height - .5) * 10;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        spotlight.style.setProperty('--music-tilt-x', x.toFixed(1) + 'px');
        spotlight.style.setProperty('--music-tilt-y', y.toFixed(1) + 'px');
      });
    }, { passive: true });
    spotlight.addEventListener('pointerleave', () => {
      rect = null;
      spotlight.style.setProperty('--music-tilt-x','0px');
      spotlight.style.setProperty('--music-tilt-y','0px');
    });
  }

  // The catalog responds immediately to filtering, without extra layout work.
  if (catalog) {
    const filterButtons = document.querySelectorAll('[data-release-filter]');
    filterButtons.forEach(button => button.addEventListener('click', () => {
      if (!effectiveEnabled()) return;
      requestAnimationFrame(() => {
        catalog.querySelectorAll('.artist-release:not([hidden])').forEach((card,index) => {
          if (typeof card.animate !== 'function') return;
          card.animate([
            { opacity: .7, transform: 'translate3d(0,7px,0)' },
            { opacity: 1, transform: 'translate3d(0,0,0)' }
          ], {
            duration: 280,
            delay: Math.min(index,5) * 24,
            easing: 'cubic-bezier(.19,1,.22,1)'
          });
        });
      });
    }));
  }

  // Without IntersectionObserver never hide the content.
  if (!supported) revealed.forEach(element => element.classList.add('is-visible'));
  root.classList.add('music-motion-ready');
  syncMotion();
})();