const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const projects = JSON.parse(
  fs.readFileSync(path.join(root, 'data', 'projects.json'), 'utf8'),
);
const technologyData = JSON.parse(
  fs.readFileSync(path.join(root, 'data', 'technologies.json'), 'utf8'),
);
const projectFields = [
  'name',
  'type',
  'kind',
  'description',
  'contribution',
  'technologies',
  'accent',
];
const accents = new Set(['blue', 'green', 'orange', 'purple', 'slate']);

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
}

if (!Array.isArray(technologyData.categories)) {
  throw new TypeError('data/technologies.json precisa conter uma lista de categorias.');
}

for (const [categoryIndex, category] of technologyData.categories.entries()) {
  if (!category.name || !Array.isArray(category.technologies)) {
    throw new Error(
      `Categoria de tecnologias ${categoryIndex + 1} precisa ter nome e lista de tecnologias.`,
    );
  }

  for (const technology of category.technologies) {
    if (!technology.name) {
      throw new Error(`Há uma tecnologia sem nome na categoria "${category.name}".`);
    }
  }
}

console.log(
  `${projects.length} projetos e ${technologyData.categories.length} categorias de tecnologias validados.`,
);
