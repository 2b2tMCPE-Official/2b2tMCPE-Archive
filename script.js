let currentPage = 1;
let book = new URLSearchParams(window.location.search).get('book') || 'book1';

document.getElementById('book-title').textContent = `📘 ${book.toUpperCase()}`;

function loadPage(page) {
  const path = `books/${book}/${page}.md`;
  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error('End of book');
      return res.text();
    })
    .then(text => {
      document.getElementById('content').innerHTML = marked.parse(text);
    })
    .catch(() => {
      if (page < currentPage) currentPage--; // rollback
    });
}

function nextPage() {
  currentPage++;
  loadPage(currentPage);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadPage(currentPage);
  }
}

window.onload = () => loadPage(currentPage);
