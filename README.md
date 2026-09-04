# Portfólio

Site estático em HTML, CSS e JavaScript, preparado para publicar no GitHub Pages.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie estes arquivos para a branch `main`.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch `main`, a pasta `/(root)` e salve.

O Tailwind é carregado pelo CDN, portanto não há instalação nem processo de build.

## Projetos

Edite apenas o arquivo `projects.json` para incluir, remover ou alterar cards. Cada projeto aceita:

```json
{
  "name": "Nome do projeto",
  "shortName": "NOME",
  "type": "Projeto pessoal ou Projeto de empresa · Nome",
  "kind": "Uma categoria curta",
  "description": "Resumo do que foi feito.",
  "technologies": ["Tecnologia 1", "Tecnologia 2"],
  "url": "https://github.com/seu-usuario/seu-projeto",
  "accent": "blue"
}
```

`url` pode ser `null` quando o projeto não tiver site ou repositório público. As cores disponíveis em `accent` são `blue`, `purple`, `orange`, `green` e `slate`.

As logos de tecnologias usam o CDN do Simple Icons; portanto, a página precisa de conexão com a internet para mostrá-las.
