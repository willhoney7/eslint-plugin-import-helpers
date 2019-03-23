# eslint-plugin-import-helpers

> Originally forked/inspired by [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import) and [this fork](https://github.com/dannysindra/eslint-plugin-import)

This package was created to supplement the rules provided by [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import). There are a lot of great rules in there, but we found it missing a few key use cases.

# Rules

#### [`order-imports`]

Enforce a _configurable_ convention in module import order

```javascript
// Given ESLint Config
rules: {
  'import-helpers/order-imports': [
      'warn',
      {
          'newlines-between': 'always', // new line between groups
          groups: [
              ['builtin', 'external', 'internal'],
              '/^@shared/',
              ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
      },
  ],
}

// will fix
import SiblingComponent from './SiblingComponent';
import lodash from 'lodash';
import SharedComponent from '@shared/components/SharedComponent';
import React from 'react';

// into
import lodash from 'lodash';
import React from 'react';

import SharedComponent from '@shared/components/SharedComponent';

import SiblingComponent from './SiblingComponent';
```

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

```js
{
    // .eslintrc.js
    plugins: ['eslint-plugin-import-helpers'],
    rules: {
        'import-helpers/order-imports': [
            'warn',
            { // example configuration
                'newlines-between': 'always',
                groups: [
                    ['builtin', 'external', 'internal'],
                    '/^@shared/',
                    ['parent', 'sibling', 'index'],
                ],
                alphabetize: { order: 'asc', ignoreCase: true },
            },
        ],
    }
}
```

# Settings

> These included settings match those of [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)

#### `import/core-modules`

An array of additional modules to consider as core/builtin modules--modules that should
be considered resolved but have no path on the filesystem. Currently, we are using the [builtin-modules](https://github.com/sindresorhus/builtin-modules), which knows about `fs`, `path`, and more), so you need not redefine those.

For example, Electron exposes an `electron` module:

```js
import 'electron'; // without extra config, will be flagged as an "internal" module
```

that would otherwise be unresolved. To avoid this, you may provide `electron` as a
core module:

```js
{
    // .eslintrc.js
    settings: {
        'core-modules': ['electron']
    },
    plugins: [ ... ],
    rules: { ... }
}
```

#### `import/external-module-folders`

An array of folders. Resolved modules only from those folders will be considered as "external". By default - `["node_modules"]`. Makes sense if you have configured your path or webpack to handle your internal paths differently and want to considered modules from some folders, for example `bower_components` or `jspm_modules`, as "external".

# TypeScript

To use this plugin with TypeScript, you must use the TypeScript parser for ESLint. See [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser) for more details.
