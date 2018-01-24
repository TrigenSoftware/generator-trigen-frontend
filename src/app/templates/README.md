
# <%= pkg.name %>

<%= pkg.description %>

## Basic commands

Start development server: 

```bash
yarn start # or
npm start  # or
gulp dev   # or
gulp
```

Build sources for production:

```bash
yarn build    # or
npm run build # or
gulp build
```

Lint sources:

```bash
yarn test # or
npm test  # or
gulp test
```<% if (gulpTasks.includes('storybook')) { %>

Start storybook:

```bash
yarn storybook    # or
npm run storybook # or
gulp storybook
```

Build storybook:

```bash
yarn build-storybook    # or
npm run build-storybook # or
```<% } %>

> This project generated with [generator-trigen-frontend](https://www.npmjs.com/package/generator-trigen-frontend)
