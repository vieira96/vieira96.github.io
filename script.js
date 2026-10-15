const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  menuButton.classList.toggle('is-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu?.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    menuButton.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }),
);

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const projectContainer = document.querySelector('[data-projects]');
const projectFilters = [...document.querySelectorAll('[data-project-filter]')];
const projectExpandButton = document.querySelector('[data-project-expand]');
const visibleProjectLimit = 3;
const experienceContainer = document.querySelector('[data-experiences]');
const stackNav = document.querySelector('[data-stack-nav]');
const stackPanel = document.querySelector('[data-stack-panel]');
const scriptUrl = document.currentScript?.src || window.location.href;
const siteRoot = new URL('.', scriptUrl);

const technologyIcons = {
  Docker: 'docker',
  Express: 'express',
  Git: 'git',
  JavaScript: 'javascript',
  Laravel: 'laravel',
  MySQL: 'mysql',
  NestJS: 'nestjs',
  'Next.js': 'nextdotjs',
  'Node.js': 'nodedotjs',
  Nuxt: 'nuxt',
  PHP: 'php',
  'PHP 8.4': 'php',
  PostgreSQL: 'postgresql',
  Prisma: 'prisma',
  React: 'react',
  RabbitMQ: 'rabbitmq',
  Redis: 'redis',
  'Socket.IO': 'socketdotio',
  'Spring Boot': 'springboot',
  'Tailwind CSS': 'tailwindcss',
  TypeScript: 'typescript',
  'Vue.js': 'vuedotjs',
};

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ],
  );
}

function projectCard(project) {
  const tags = project.technologies
    .map((technology) => {
      const icon = technologyIcons[technology];
      const image = icon
        ? `<img src="https://cdn.simpleicons.org/${icon}/93c5fd" alt="" aria-hidden="true" loading="lazy">`
        : '';
      return `<span>${image}${escapeHtml(technology)}</span>`;
    })
    .join('');
  const preview = project.image
    ? `<img class="project-preview-image" src="${escapeHtml(project.image)}" alt="" loading="lazy">`
    : '';
  const inner = `<div class="project-accent project-accent--${escapeHtml(project.accent)}">${preview}<div class="project-preview-copy"><span>${escapeHtml(project.kind)}</span><strong>${escapeHtml(project.shortName || project.name)}</strong></div>${project.url ? '<span class="project-arrow material-symbols-outlined" aria-hidden="true">north_east</span>' : ''}</div><div class="project-info"><p class="project-type-label">${escapeHtml(project.type)}</p><h3>${escapeHtml(project.name)}</h3><p class="project-description">${escapeHtml(project.description)}</p><p class="project-contribution"><b>Minha participação</b>${escapeHtml(project.contribution)}</p><p class="project-tags-label">Stack</p><div class="tag-list">${tags}</div></div>`;
  const url = project.url && /^https:\/\//i.test(project.url);

  return url
    ? `<a class="project-card group" data-project-category="${escapeHtml(project.category)}" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer" aria-label="Abrir ${escapeHtml(project.name)}">${inner}</a>`
    : `<article class="project-card" data-project-category="${escapeHtml(project.category)}">${inner}</article>`;
}

async function loadProjects() {
  if (!projectContainer) return;

  try {
    const response = await fetch(new URL('data/projects.json', siteRoot), {
      cache: 'no-cache',
    });
    if (!response.ok)
      throw new Error(`Falha ao carregar data/projects.json (${response.status}).`);

    const projects = await response.json();
    if (!Array.isArray(projects))
      throw new TypeError('Formato inválido em data/projects.json.');

    projectContainer.innerHTML = projects.map(projectCard).join('');
    initProjectFilters(projects);
  } catch (error) {
    console.error(error);
    projectContainer.innerHTML =
      '<p class="project-load-error">Não foi possível carregar os projetos agora.</p>';
  }
}

function experienceCard(experience) {
  const company = experience.companyUrl
    ? `<a class="company-link" href="${escapeHtml(experience.companyUrl)}" target="_blank" rel="noreferrer">${escapeHtml(experience.company)} <span aria-hidden="true">↗</span></a>`
    : escapeHtml(experience.company);
  const technologies = experience.technologies
    .map((technology) => `<span>${escapeHtml(technology)}</span>`)
    .join('');
  const details = experience.details
    .map((detail) => `<li>${escapeHtml(detail)}</li>`)
    .join('');

  return `<article class="experience-item"><div class="experience-meta"><p class="experience-date">${escapeHtml(experience.date)}</p><h3>${company}</h3><p class="experience-context">${escapeHtml(experience.context)}</p></div><div class="experience-content"><h3 class="experience-role">${escapeHtml(experience.role)}</h3><p class="experience-summary">${escapeHtml(experience.summary)}</p><div class="experience-stack">${technologies}</div><details class="experience-details"><summary>${escapeHtml(experience.detailsLabel)}<span class="material-symbols-outlined" aria-hidden="true">add</span></summary><ul>${details}</ul></details></div></article>`;
}

async function loadExperiences() {
  if (!experienceContainer) return;

  try {
    const response = await fetch(new URL('data/experiences.json', siteRoot), {
      cache: 'no-cache',
    });
    if (!response.ok)
      throw new Error(`Falha ao carregar data/experiences.json (${response.status}).`);

    const experiences = await response.json();
    if (!Array.isArray(experiences))
      throw new TypeError('Formato inválido em data/experiences.json.');

    experienceContainer.innerHTML = experiences.map(experienceCard).join('');
  } catch (error) {
    console.error(error);
    experienceContainer.innerHTML =
      '<p class="project-load-error">Não foi possível carregar as experiências agora.</p>';
  }
}

loadProjects();
loadExperiences();
loadStack();

function initProjectFilters(projects) {
  const cards = [...projectContainer.querySelectorAll('[data-project-category]')];
  const counts = {
    all: projects.length,
    personal: projects.filter((project) => project.category === 'personal').length,
    professional: projects.filter((project) => project.category === 'professional')
      .length,
  };

  Object.entries(counts).forEach(([category, count]) => {
    const counter = document.querySelector(`[data-filter-count="${category}"]`);
    if (counter) counter.textContent = String(count).padStart(2, '0');
  });

  let expanded = false;

  function filterProjects(category) {
    const matchingCards = cards.filter(
      (card) => category === 'all' || card.dataset.projectCategory === category,
    );

    cards.forEach((card) => {
      const matches = matchingCards.includes(card);
      const withinLimit = matchingCards.indexOf(card) < visibleProjectLimit;
      card.classList.toggle('is-filtered-out', !matches);
      card.classList.toggle('is-collapsed', matches && !expanded && !withinLimit);
    });

    const hasMore = matchingCards.length > visibleProjectLimit;
    if (projectExpandButton) {
      projectExpandButton.hidden = !hasMore;
      projectExpandButton.setAttribute('aria-expanded', String(expanded));
      projectExpandButton.querySelector('[data-project-expand-label]').textContent =
        expanded ? 'Mostrar menos projetos' : 'Ver mais projetos';
      projectExpandButton.querySelector('.material-symbols-outlined').textContent =
        expanded ? 'expand_less' : 'expand_more';
    }

    projectFilters.forEach((button) => {
      const active = button.dataset.projectFilter === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  projectFilters.forEach((button) =>
    button.addEventListener('click', () => {
      expanded = false;
      filterProjects(button.dataset.projectFilter);
    }),
  );

  projectExpandButton?.addEventListener('click', () => {
    const isCollapsing = expanded;
    expanded = !expanded;
    const activeCategory =
      projectFilters.find((button) => button.classList.contains('is-active'))?.dataset
        .projectFilter || 'all';
    filterProjects(activeCategory);

    if (isCollapsing) {
      document.querySelector('#projetos')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });

  filterProjects('all');
}

function technologyCard(technology) {
  const image = technology.icon
    ? `<img src="https://cdn.simpleicons.org/${escapeHtml(technology.icon)}/93c5fd" alt="" aria-hidden="true" loading="lazy">`
    : '';

  return `<span class="stack-tag">${image}${escapeHtml(technology.name)}</span>`;
}

function renderStackDetail(category, index) {
  stackPanel.innerHTML = `<p class="stack-panel-index">// stack / ${String(index + 1).padStart(2, '0')}</p><h3>${escapeHtml(category.name)}</h3><p class="stack-description">${escapeHtml(category.description)}</p><p class="stack-list-label">Stack</p><div class="stack-tags">${category.technologies.map(technologyCard).join('')}</div>`;

  stackNav.querySelectorAll('[data-stack-index]').forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

async function loadStack() {
  if (!stackNav || !stackPanel) return;

  try {
    const response = await fetch(new URL('data/technologies.json', siteRoot), {
      cache: 'no-cache',
    });
    if (!response.ok)
      throw new Error(`Falha ao carregar data/technologies.json (${response.status}).`);

    const data = await response.json();
    if (!Array.isArray(data.categories))
      throw new TypeError('Formato inválido em data/technologies.json.');

    stackNav.innerHTML = data.categories
      .map(
        (category, index) =>
          `<button class="stack-nav-button${index === 0 ? ' is-active' : ''}" type="button" data-stack-index="${index}" aria-pressed="${index === 0}"><span class="stack-nav-number">${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(category.name)}</span><span class="stack-nav-arrow material-symbols-outlined" aria-hidden="true">north_east</span></button>`,
      )
      .join('');

    stackNav.querySelectorAll('[data-stack-index]').forEach((button, index) => {
      button.addEventListener('click', () =>
        renderStackDetail(data.categories[index], index),
      );
    });

    if (data.categories.length) renderStackDetail(data.categories[0], 0);
  } catch (error) {
    console.error(error);
    stackNav.innerHTML =
      '<p class="project-load-error">Não foi possível carregar a stack agora.</p>';
    stackPanel.innerHTML = '';
  }
}
