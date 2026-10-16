const lang = document.documentElement.dataset.lang;
const zh = lang === 'zh';

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.book[data-group]')];
function filter(group, updateURL = false) {
  if (!['all', 'chinese', 'world'].includes(group)) group = 'all';
  for (const b of filterButtons) b.setAttribute('aria-pressed', String(b.dataset.filter === group));
  let count = 0;
  for (const card of cards) {
    card.hidden = group !== 'all' && card.dataset.group !== group;
    if (!card.hidden) count++;
  }
  const status = document.querySelector('#collection-count');
  if (status) status.textContent = `${count} ${zh ? '部作品' : 'works'}`;
  if (updateURL) {
    const url = new URL(location.href);
    group === 'all' ? url.searchParams.delete('shelf') : url.searchParams.set('shelf', group);
    history.replaceState(null, '', url);
  }
}
if (cards.length) {
  filter(new URL(location.href).searchParams.get('shelf'));
  for (const b of filterButtons) b.addEventListener('click', () => filter(b.dataset.filter, true));
  window.addEventListener('popstate', () => filter(new URL(location.href).searchParams.get('shelf')));
}

for (const link of document.querySelectorAll('[data-locale]'))
  link.addEventListener('click', () => {
    const url = new URL(link.href);
    url.search = location.search;
    url.hash = location.hash;
    link.href = url.href;
  });

for (const button of document.querySelectorAll('[data-copy]')) {
  const original = button.textContent;
  let resetTimer;
  button.setAttribute('aria-live', 'polite');
  button.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = zh ? '已复制 ✓' : 'Copied ✓';
    } catch {
      const details = document.getElementById(button.dataset.promptToggle);
      if (details) {
        details.open = true;
        details.querySelector('pre')?.focus();
      }
      button.textContent = zh ? '请选中提示词复制' : 'Select the prompt to copy';
    }
    resetTimer = setTimeout(() => {
      button.textContent = original;
    }, 2500);
  });
}

const preview = document.querySelector('#cover-preview');
for (const button of document.querySelectorAll('[data-view]'))
  button.addEventListener('click', () => {
    for (const other of document.querySelectorAll('[data-view]'))
      other.setAttribute('aria-pressed', String(other === button));
    preview.src = button.dataset.view === 'art' ? preview.dataset.art : preview.dataset.cover;
  });
