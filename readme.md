# eslint-plugin-import-helpers

> Originally forked/inspired by [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import) and [this fork](https://github.com/dannysindra/eslint-plugin-import)

This package was created to supplement the rules provided by [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import). There are a lot of great rules in there, but we found it missing a few key use cases.

# Rules

-   enforce a _configurable_ convention in module import order ([`order-imports`])

[`order-imports`]: ./docs/rules/order-imports.md

# Installation

```sh
npm install eslint-plugin-import-helpers -g
```

or if you manage ESLint as a dev dependency:

```sh
# inside your project's working tree
npm install eslint-plugin-import-helpers --save-dev
```

To add a rule, update your `.eslintrc.(yml|json|js)`:

```yaml
---
plugins:
    - import-helpers

rules:
    import-helpers/order-imports: [2, { groups: [ ... ] } ]
    # etc...
```

# Settings

> These included settings match those of [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)

#### `import/core-modules`

An array of additional modules to consider as "core" modules--modules that should
be considered resolved but have no path on the filesystem (ie `builtins`). Your resolver may
already define some of these (for example, the Node resolver knows about `fs` and
`path`), so you need not redefine those.

For example, Electron exposes an `electron` module:

```js
import 'electron'; // without extra config, will be flagged as unresolved!
```

that would otherwise be unresolved. To avoid this, you may provide `electron` as a
core module:

```yaml
# .eslintrc.yml
settings:
    import/core-modules: [electron]
```

#### `import/external-module-folders`

An array of folders. Resolved modules only from those folders will be considered as "external". By default - `["node_modules"]`. Makes sense if you have configured your path or webpack to handle your internal paths differently and want to considered modules from some folders, for example `bower_components` or `jspm_modules`, as "external".
