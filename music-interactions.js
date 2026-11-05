(() => {
  'use strict';
  const buttons = [...document.querySelectorAll('[data-release-filter]')];
  const releases = [...document.querySelectorAll('.artist-release[data-year]')];
  const search = document.getElementById('music-search');
  const count = document.getElementById('release-count');
  const empty = document.getElementById('release-empty');
  const reset = document.getElementById('release-reset');
  if (!releases.length) return;

  let year = 'all';

  function render() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let visible = 0;
    releases.forEach(card => {
      const matchYear = year === 'all' || card.dataset.year === year;
      const matchSearch = !query || (card.dataset.title || '').toLocaleLowerCase().includes(query);
      const show = matchYear && matchSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = 'Showing ' + visible +
      (visible === 1 ? ' release' : ' releases');
    if (empty) empty.hidden = visible !== 0;
  }

  function setYear(value) {
    year = value;
    buttons.forEach(button => {
      const active = button.dataset.releaseFilter === year;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    render();
  }

  function clear() {
    if (search) search.value = '';
    setYear('all');
  }

  buttons.forEach(button => button.addEventListener('click', () =>
    setYear(button.dataset.releaseFilter || 'all')));
  if (search) search.addEventListener('input', render);
  if (reset) reset.addEventListener('click', () => {
    clear();
    search?.focus();
  });
  document.addEventListener('keydown', event => {
    const isEditing = event.target?.isContentEditable ||
      /^(INPUT|TEXTAREA|SELECT)$/i.test(event.target?.tagName || '');
    if (event.key === '/' && !isEditing && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      search?.focus();
    } else if (event.key === 'Escape' && document.activeElement === search) {
      if (search.value) {
        event.preventDefault();
        search.value = '';
        render();
      } else {
        search.blur();
      }
    }
  });
  render();
})();
