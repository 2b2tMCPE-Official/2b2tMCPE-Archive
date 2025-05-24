const chapters = [
  { id: 'timeline', title: 'Timeline' },
  { id: 'events', title: 'Events' },
  { id: 'groups', title: 'Groups' },
];

const contentEl = document.getElementById('content');
const chaptersEl = document.getElementById('chapters');

function renderChaptersMenu(currentId) {
  chaptersEl.innerHTML = '';
  chapters.forEach(chapter => {
    const btn = document.createElement('button');
    btn.textContent = chapter.title;
    btn.classList.toggle('active', chapter.id === currentId);
    btn.onclick = () => navigateTo(chapter.id);
    chaptersEl.appendChild(btn);
  });
}

async function loadMarkdown(id) {
  try {
    const res = await fetch(`book/${id}.md`);
    if (!res.ok) throw new Error('Not found');
    return await res.text();
  } catch {
    return '# Page Not Found';
  }
}

function renderPagination(currentId) {
  const idx = chapters.findIndex(c => c.id === currentId);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];

  const nav = document.createElement('div');
  nav.className = 'pagination';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = !prev;
  if (prev) prevBtn.onclick = () => navigateTo(prev.id);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.disabled = !next;
  if (next) nextBtn.onclick = () => navigateTo(next.id);

  nav.appendChild(prevBtn);
  nav.appendChild(nextBtn);
  return nav;
}

async function navigateTo(id) {
  const md = await loadMarkdown(id);
  contentEl.innerHTML = marked.parse(md);
  contentEl.appendChild(renderPagination(id));
  renderChaptersMenu(id);
  history.pushState({ id }, '', `?page=${id}`);
}

window.addEventListener('popstate', e => {
  const id = e.state?.id || 'timeline';
  navigateTo(id);
});

function init() {
  const params = new URLSearchParams(location.search);
  const id = params.get('page') || 'timeline';
  navigateTo(id);
}

init();
