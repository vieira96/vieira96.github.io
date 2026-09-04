const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'projects.json'), 'utf8'));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function projectCard(project) {
  const tags = project.technologies.map((technology) => `<span>${escapeHtml(technology)}</span>`).join('');
  const inner = `<div class="project-accent project-accent--${escapeHtml(project.accent)}"><span>${escapeHtml(project.kind)}</span><strong>${escapeHtml(project.name)}</strong></div><div class="project-info"><div><p class="font-mono text-[10px] uppercase tracking-[.16em] text-blue-300">${escapeHtml(project.type)}</p><p class="project-description">${escapeHtml(project.description)}</p><p class="project-contribution"><b>Minha participação</b>${escapeHtml(project.contribution)}</p><p class="project-tags-label">Destaques</p><div class="tag-list">${tags}</div></div>${project.url ? '<span class="project-arrow material-symbols-outlined" aria-hidden="true">north_east</span>' : ''}</div>`;
  return project.url
    ? `<a class="project-card group" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer" aria-label="Abrir ${escapeHtml(project.name)}">${inner}</a>`
    : `<article class="project-card">${inner}</article>`;
}

const cards = projects.map(projectCard).join('\n');
const html = fs.readFileSync(htmlPath, 'utf8');
const replacement = `<!-- projects:start --><div class="carousel-track" data-projects>\n${cards}\n</div><!-- projects:end -->`;
if (!/<!-- projects:start -->[\s\S]*?<!-- projects:end -->/.test(html)) {
  throw new Error('Marcadores de projetos não encontrados no index.html.');
}
const output = html.replace(/<!-- projects:start -->[\s\S]*?<!-- projects:end -->/, replacement);

if (output !== html) fs.writeFileSync(htmlPath, output);
console.log(`${projects.length} projetos renderizados estaticamente.`);
