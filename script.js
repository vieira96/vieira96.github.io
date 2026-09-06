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
if (projectContainer) initCarousel(projectContainer.children.length);

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
