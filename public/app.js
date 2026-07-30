let allRepos = [];

const form = document.getElementById('searchForm');
const usernameInput = document.getElementById('usernameInput');
const statusEl = document.getElementById('status');
const profileEl = document.getElementById('profile');
const controlsEl = document.getElementById('controls');
const resultsEl = document.getElementById('results');
const filterInput = document.getElementById('filterInput');
const languageSelect = document.getElementById('languageSelect');
const sortSelect = document.getElementById('sortSelect');
const hideForks = document.getElementById('hideForks');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username) loadUser(username);
});

[filterInput, languageSelect, sortSelect, hideForks].forEach(el => {
  el.addEventListener('input', renderRepos);
});

async function loadUser(username) {
  statusEl.textContent = 'Loading...';
  statusEl.className = 'loading';
  profileEl.classList.add('hidden');
  controlsEl.classList.add('hidden');
  resultsEl.innerHTML = '';

  try {
    const res = await fetch(`/api/repos?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = data.error || 'Something went wrong.';
      statusEl.className = '';
      return;
    }

    statusEl.textContent = '';
    renderProfile(data.user);
    allRepos = data.repos;
    populateLanguages(allRepos);
    controlsEl.classList.remove('hidden');
    renderRepos();
  } catch (err) {
    statusEl.textContent = 'Network error — check your connection and try again.';
    statusEl.className = '';
  }
}

function renderProfile(user) {
  profileEl.classList.remove('hidden');
  profileEl.innerHTML = `
    <img src="${user.avatar}" alt="${user.login}">
    <div class="meta">
      <strong>${user.name || user.login}</strong> — <a href="${user.profileUrl}" target="_blank">@${user.login}</a>
      <small>${user.bio || ''}</small>
      <small>${user.publicRepos} public repos · ${user.followers} followers</small>
    </div>
  `;
}

function populateLanguages(repos) {
  const langs = [...new Set(repos.map(r => r.language).filter(Boolean))].sort();
  languageSelect.innerHTML = '<option value="">All languages</option>' +
    langs.map(l => `<option value="${l}">${l}</option>`).join('');
}

function renderRepos() {
  let repos = [...allRepos];

  // Filter by name
  const filterText = filterInput.value.trim().toLowerCase();
  if (filterText) {
    repos = repos.filter(r => r.name.toLowerCase().includes(filterText));
  }

  // Filter by language
  const lang = languageSelect.value;
  if (lang) {
    repos = repos.filter(r => r.language === lang);
  }

  // Hide forks
  if (hideForks.checked) {
    repos = repos.filter(r => !r.isFork);
  }

  // Sort
  const sortBy = sortSelect.value;
  repos.sort((a, b) => {
    if (sortBy === 'stars') return b.stars - a.stars;
    if (sortBy === 'forks') return b.forks - a.forks;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'updated') return new Date(b.updated) - new Date(a.updated);
    return 0;
  });

  if (repos.length === 0) {
    resultsEl.innerHTML = '<p class="empty">No repos match your filters.</p>';
    return;
  }

  resultsEl.innerHTML = repos.map(r => `
    <div class="card">
      ${r.isFork ? '<span class="badge">fork</span>' : ''}
      <h3><a href="${r.url}" target="_blank">${r.name}</a></h3>
      <p>${r.description || 'No description'}</p>
      <div class="stats">
        <span>⭐ ${r.stars}</span>
        <span>🍴 ${r.forks}</span>
        <span>${r.language || '—'}</span>
      </div>
    </div>
  `).join('');
}
