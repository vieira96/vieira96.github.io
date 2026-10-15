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
const carousel = document.querySelector('[data-carousel]');
const technologySummary = document.querySelector('[data-technology-summary]');
const technologyGroups = document.querySelector('[data-technology-groups]');

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
  const inner = `<div class="project-accent project-accent--${escapeHtml(project.accent)}"><span>${escapeHtml(project.kind)}</span><strong>${escapeHtml(project.name)}</strong></div><div class="project-info"><div><p class="font-mono text-[10px] uppercase tracking-[.16em] text-blue-300">${escapeHtml(project.type)}</p><p class="project-description">${escapeHtml(project.description)}</p><p class="project-contribution"><b>Minha participação</b>${escapeHtml(project.contribution)}</p><p class="project-tags-label">Destaques</p><div class="tag-list">${tags}</div></div>${project.url ? '<span class="project-arrow material-symbols-outlined" aria-hidden="true">north_east</span>' : ''}</div>`;
  const url = project.url && /^https:\/\//i.test(project.url);

  return url
    ? `<a class="project-card group" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer" aria-label="Abrir ${escapeHtml(project.name)}">${inner}</a>`
    : `<article class="project-card">${inner}</article>`;
}

async function loadProjects() {
  if (!projectContainer) return;

  try {
    const response = await fetch('data/projects.json');
    if (!response.ok)
      throw new Error(`Falha ao carregar data/projects.json (${response.status}).`);

    const projects = await response.json();
    if (!Array.isArray(projects))
      throw new TypeError('Formato inválido em data/projects.json.');

    projectContainer.innerHTML = projects.map(projectCard).join('');
    initCarousel(projects.length);
  } catch (error) {
    console.error(error);
    projectContainer.innerHTML =
      '<p class="project-load-error">Não foi possível carregar os projetos agora.</p>';
  }
}

loadProjects();
loadTechnologies();

function formatTechnologyList(technologies) {
  const names = technologies.map((technology) => escapeHtml(technology.name));
  if (names.length < 2) return names.join('');
  return `${names.slice(0, -1).join(', ')} e ${names.at(-1)}`;
}

function technologyCard(technology) {
  const image = technology.icon
    ? `<img src="https://cdn.simpleicons.org/${escapeHtml(technology.icon)}/93c5fd" alt="" loading="lazy">`
    : '';

  return `<div class="tech-item">${image}<span>${escapeHtml(technology.name)}</span></div>`;
}

async function loadTechnologies() {
  if (!technologyGroups || !technologySummary) return;

  try {
    const response = await fetch('data/technologies.json');
    if (!response.ok)
      throw new Error(`Falha ao carregar data/technologies.json (${response.status}).`);

    const data = await response.json();
    if (!Array.isArray(data.categories))
      throw new TypeError('Formato inválido em data/technologies.json.');

    technologySummary.innerHTML = data.categories
      .filter((category) => category.showInSummary)
      .map(
        (category) =>
          `<span class="block">${escapeHtml(category.name)}: ${formatTechnologyList(category.technologies)}</span>`,
      )
      .join('');

    technologyGroups.innerHTML = data.categories
      .map(
        (category) =>
          `<div class="tech-group"><p class="tech-group-title">${escapeHtml(category.name)}</p><div class="tech-grid">${category.technologies.map(technologyCard).join('')}</div></div>`,
      )
      .join('');
  } catch (error) {
    console.error(error);
    technologySummary.textContent = 'Não foi possível carregar as tecnologias agora.';
    technologyGroups.innerHTML =
      '<p class="project-load-error">Não foi possível carregar as tecnologias agora.</p>';
  }
}

function initCarousel(total) {
  if (!carousel || total < 2) return;

  const track = carousel.querySelector('[data-projects]');
  const dots = carousel.querySelector('[data-carousel-dots]');
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  let current = 0;
  const itemsPerPage = () => (window.matchMedia('(min-width: 768px)').matches ? 2 : 1);
  const pageCount = () => Math.ceil(total / itemsPerPage());

  function renderDots() {
    dots.innerHTML = Array.from(
      { length: pageCount() },
      (_, index) =>
        `<button class="carousel-dot${index === current ? ' is-active' : ''}" type="button" aria-label="Ir para página ${index + 1} dos projetos"></button>`,
    ).join('');
    [...dots.querySelectorAll('button')].forEach((dot, index) =>
      dot.addEventListener('click', () => show(index)),
    );
  }

  function show(index) {
    const pages = pageCount();
    current = (index + pages) % pages;
    track.style.transform = `translateX(-${current * 100}%)`;
    [...dots.querySelectorAll('button')].forEach((dot, dotIndex) =>
      dot.classList.toggle('is-active', dotIndex === current),
    );
  }
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  window.addEventListener('resize', () => {
    current = 0;
    renderDots();
    show(0);
  });
  renderDots();
}
