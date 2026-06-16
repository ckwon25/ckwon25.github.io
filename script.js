// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Pull additional public repos live from GitHub and render them,
// skipping the ones already featured above.
const GITHUB_USERNAME = 'ckwon25';
const FEATURED_REPO_NAMES = new Set(['boatmeter', 'qiskitresearch']);

async function loadMoreProjects() {
  const grid = document.getElementById('moreProjectsGrid');
  const loadingText = document.getElementById('loadingText');

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error('GitHub API request failed');
    const repos = await res.json();

    const filtered = repos
      .filter((r) => !r.fork && !FEATURED_REPO_NAMES.has(r.name.toLowerCase()))
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (filtered.length === 0) {
      loadingText.textContent = 'No additional public repositories yet.';
      return;
    }

    grid.innerHTML = '';
    filtered.forEach((repo) => {
      const card = document.createElement('article');
      card.className = 'project-card';

      const title = document.createElement('div');
      title.className = 'project-top';
      title.innerHTML = `<h3>${escapeHtml(repo.name)}</h3>`;
      card.appendChild(title);

      const desc = document.createElement('p');
      desc.textContent = repo.description || 'No description provided yet — explore the code on GitHub.';
      card.appendChild(desc);

      const tags = document.createElement('div');
      tags.className = 'project-tags';
      if (repo.language) {
        const span = document.createElement('span');
        span.textContent = repo.language;
        tags.appendChild(span);
      }
      card.appendChild(tags);

      const links = document.createElement('div');
      links.className = 'project-links';
      links.innerHTML = `<a href="${repo.html_url}" target="_blank" rel="noopener">View on GitHub →</a>`;
      card.appendChild(links);

      grid.appendChild(card);
    });
  } catch (err) {
    loadingText.textContent = 'Could not load more repositories right now — visit my GitHub profile directly.';
    console.error(err);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadMoreProjects();
