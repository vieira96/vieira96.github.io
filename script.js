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

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.classList.remove('is-open');
  menuButton.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const technologies = [
  ['PHP', 'php'], ['Laravel', 'laravel'], ['Java', 'openjdk'], ['Spring Boot', 'springboot'],
  ['JavaScript', 'javascript'], ['Vue.js', 'vuedotjs'], ['Nuxt', 'nuxt'], ['React', 'react'], ['Next.js', 'nextdotjs'],
  ['MySQL', 'mysql'], ['PostgreSQL', 'postgresql'], ['Redis', 'redis'], ['Docker', 'docker'],
  ['Git', 'git'], ['Tailwind CSS', 'tailwindcss'],
];

const techContainer = document.querySelector('[data-technologies]');
if (techContainer) {
  techContainer.innerHTML = technologies.map(([name, icon]) => `
    <div class="tech-item"><img src="https://cdn.simpleicons.org/${icon}/93c5fd" alt="" loading="lazy" /><span>${name}</span></div>
  `).join('');
}

const projectContainer = document.querySelector('[data-projects]');
const carousel = document.querySelector('[data-carousel]');

function projectCard(project) {
  const tags = project.technologies.map((technology) => `<span>${technology}</span>`).join('');
  const inner = `<div class="project-accent project-accent--${project.accent}"><span>${project.kind}</span><strong>${project.name}</strong></div><div class="project-info"><div><p class="font-mono text-[10px] uppercase tracking-[.16em] text-blue-300">${project.type}</p><p class="project-description">${project.description}</p><p class="project-contribution"><b>Minha participação</b>${project.contribution}</p><div class="tag-list">${tags}</div></div>${project.url ? '<span class="project-arrow material-symbols-outlined" aria-hidden="true">north_east</span>' : ''}</div>`;
  return project.url
    ? `<a class="project-card group" href="${project.url}" target="_blank" rel="noreferrer" aria-label="Abrir ${project.name}">${inner}</a>`
    : `<article class="project-card">${inner}</article>`;
}

if (projectContainer) {
  fetch('projects.json')
    .then((response) => { if (!response.ok) throw new Error('Não foi possível carregar os projetos.'); return response.json(); })
    .then((projects) => { projectContainer.innerHTML = projects.map(projectCard).join(''); initCarousel(projects.length); })
    .catch(() => { projectContainer.innerHTML = '<p class="text-sm text-slate-500">Não foi possível carregar os projetos agora.</p>'; });
}

function initCarousel(total) {
  if (!carousel || total < 2) return;

  const track = carousel.querySelector('[data-projects]');
  const dots = carousel.querySelector('[data-carousel-dots]');
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  let current = 0;
  const itemsPerPage = () => window.matchMedia('(min-width: 768px)').matches ? 2 : 1;
  const pageCount = () => Math.ceil(total / itemsPerPage());

  function renderDots() {
    dots.innerHTML = Array.from({ length: pageCount() }, (_, index) => `<button class="carousel-dot${index === current ? ' is-active' : ''}" type="button" aria-label="Ir para página ${index + 1} dos projetos"></button>`).join('');
    [...dots.querySelectorAll('button')].forEach((dot, index) => dot.addEventListener('click', () => show(index)));
  }

  function show(index) {
    const pages = pageCount();
    current = (index + pages) % pages;
    track.style.transform = `translateX(-${current * 100}%)`;
    [...dots.querySelectorAll('button')].forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === current));
  }
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  window.addEventListener('resize', () => { current = 0; renderDots(); show(0); });
  renderDots();
}
