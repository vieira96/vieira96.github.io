const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const projects = JSON.parse(
  fs.readFileSync(path.join(root, 'data', 'projects.json'), 'utf8'),
);
const experiences = JSON.parse(
  fs.readFileSync(path.join(root, 'data', 'experiences.json'), 'utf8'),
);
const technologyData = JSON.parse(
  fs.readFileSync(path.join(root, 'data', 'technologies.json'), 'utf8'),
);
const projectFields = [
  'name',
  'category',
  'type',
  'kind',
  'description',
  'contribution',
  'technologies',
  'accent',
];
const accents = new Set(['blue', 'green', 'orange', 'purple', 'slate']);
const projectCategories = new Set(['personal', 'professional']);

if (!Array.isArray(projects)) {
  throw new TypeError('data/projects.json precisa conter uma lista de projetos.');
}

for (const [index, project] of projects.entries()) {
  const missingFields = projectFields.filter((field) => !(field in project));
  if (missingFields.length) {
    throw new Error(
      `Projeto ${index + 1} sem os campos obrigatórios: ${missingFields.join(', ')}.`,
    );
  }

  if (!Array.isArray(project.technologies)) {
    throw new TypeError(
      `As tecnologias do projeto "${project.name}" precisam ser uma lista.`,
    );
  }

  if (!accents.has(project.accent)) {
    throw new Error(`Cor inválida no projeto "${project.name}": ${project.accent}.`);
  }

  if (!projectCategories.has(project.category)) {
    throw new Error(
      `Categoria inválida no projeto "${project.name}": ${project.category}.`,
    );
  }
}

const experienceFields = [
  'company',
  'date',
  'role',
  'context',
  'summary',
  'technologies',
  'detailsLabel',
  'details',
];

if (!Array.isArray(experiences)) {
  throw new TypeError(
    'data/experiences.json precisa conter uma lista de experiências.',
  );
}

for (const [index, experience] of experiences.entries()) {
  const missingFields = experienceFields.filter((field) => !(field in experience));
  if (missingFields.length) {
    throw new Error(
      `Experiência ${index + 1} sem os campos obrigatórios: ${missingFields.join(', ')}.`,
    );
  }

  if (!Array.isArray(experience.technologies) || !Array.isArray(experience.details)) {
    throw new TypeError(
      `Tecnologias e detalhes da experiência "${experience.company}" precisam ser listas.`,
    );
  }
}

if (!Array.isArray(technologyData.categories)) {
  throw new TypeError('data/technologies.json precisa conter uma lista de categorias.');
}

for (const [categoryIndex, category] of technologyData.categories.entries()) {
  if (
    !category.name ||
    !category.description ||
    !Array.isArray(category.technologies)
  ) {
    throw new Error(
      `Categoria ${categoryIndex + 1} precisa ter nome, descrição e lista de tecnologias.`,
    );
  }

  for (const technology of category.technologies) {
    if (!technology.name) {
      throw new Error(`Há uma tecnologia sem nome na categoria "${category.name}".`);
    }
  }
}

console.log(
  `${projects.length} projetos, ${experiences.length} experiências e ${technologyData.categories.length} categorias de tecnologias validados.`,
);
