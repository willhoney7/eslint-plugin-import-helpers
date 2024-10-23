# eslint-plugin-import-helpers

> Originally forked/inspired by [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import) and [this fork](https://github.com/dannysindra/eslint-plugin-import)

[![npm version](https://badge.fury.io/js/eslint-plugin-import-helpers.svg)](https://badge.fury.io/js/eslint-plugin-import-helpers)

This package was created to supplement the rules provided by [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import). There are a lot of great rules in there, but we found it missing a few key use cases.

# Alternatives

> [!TIP]
> Use Prettier!

I recommend using [@ianvs/prettier-plugin-sort-imports](https://github.com/IanVS/prettier-plugin-sort-imports) instead of this ESLint plugin for sorting imports. It works really well and I think Prettier is better suited for formatting-related rules.

# Rules

#### [`order-imports`]

Enforce a _configurable_ convention in module import order. See the [`order-imports`] page for configuration details.

```javascript
// Given ESLint Config
rules: {
  'import-helpers/order-imports': [
      'warn',
      {
          newlinesBetween: 'always', // new line between groups
          groups: [
              'module',
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
                newlinesBetween: 'always',
                groups: [
                    'module',
                    '/^@shared/',
                    ['parent', 'sibling', 'index'],
                ],
                alphabetize: { order: 'asc', ignoreCase: true },
            },
        ],
    }
}
```

# ESLint Versions

The 2.0 version supports ESLint v9. It may still work with older versions of ESLint but we no longer test against it. If you need ESLint v8 support, use 1.X.

# TypeScript

To use this plugin with TypeScript, you must use the TypeScript parser for ESLint. See [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser) for more details.

Please note that the import sorter does not currently work with `type` imports.

# Working with This Repo

## Dependencies

| Name                          | Version |
| ----------------------------- | ------- |
| [node.js](https://nodejs.org) | 22.x    |

## Running Tests

First, `npm install`
Then, `npm test`
