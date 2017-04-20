
# <%= name %>

<%= description %>

## Gulp tasks

```
├── html:watch
├── html:lint
├─┬ html:dev
│ └── html:lint
├─┬ html:build
│ └── html:lint
├── images:watch
├── images:dev
├── images:build
├── style:watch
├── style:lint
├─┬ style:dev
│ └── style:lint
├─┬ style:build
│ └── style:lint
├── server
├─┬ watch
│ ├── html:watch
│ ├── images:watch
│ └── style:watch
├─┬ dev
│ └─┬── html:dev
│   ├── images:dev
│   ├── style:dev
│   ├── server
│   └── watch
├─┬ build
│ └─┬── html:build
│   ├── images:build
│   └── style:build
└─┬ default
  └── dev
```

> This project generated with [generator-trigen-frontend](https://www.npmjs.com/package/generator-trigen-frontend)
