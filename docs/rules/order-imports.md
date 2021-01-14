# Enforce a _configurable_ convention in module import order

Enforce a convention in the order of `require()` / `import` statements. The default order is as shown in the following example:

```js
// 1. "absolute" path modules
import abs from '/absolute-module'; // uncommon
// 2. all non-relative and non-absolute "modules"
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import chalk from 'chalk';
import foo from 'src/foo';
// 3. modules from a "parent" directory
import foo from '../foo';
import qux from '../../foo/qux';
// 4. "sibling" modules from the same or a sibling's directory
import bar from './bar';
import baz from './bar/baz';
// 5. "index" of the current directory
import main from './';
```

Notes:

-   Unassigned imports are ignored (ex: `import 'polyfill'`), as the order they are imported in may be important. Use 'unassignedImports' option if you'd like to allow them.
-   Statements using the ES6 `import` syntax must appear before any `require()` statements.

## Usage

To use the rule, update your `eslint` config.

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

## Options

This rule supports the following options:

### `groups: Array<string | Array<string>>`:

> The default value is `["absolute", "module", "parent", "sibling", "index"]`.

Groups dictates how the imports should be grouped and it what order. `groups` is an array. Each value in the array must be a valid string or an array of valid strings. The valid strings are:

-   `'module'` | `'absolute'` | `'parent'` | `'sibling'` | `'index'`
-   or a regular expression like string, ex: `/^shared/`
    -   the wrapping `/` is essential
    -   in this example, it would match any import paths starting with `'shared'`
    -   note: files are first categorized as matching a regular expression group before going into another group

The enforced order is the same as the order of each element in a group. Omitted types are implicitly grouped together as the last element. Example:

```js
[
	'absolute', // any absolute path modules are first (ex: `/path/to/code.ts`)
	'module', // then normal modules (ex: `lodash/pull`)
	['sibling', 'parent'], // Then sibling and parent types. They can be mingled together
	'/^shared/', // any import paths starting with 'shared'
	'index', // Then the index file
];
```

You can set the options like this:

```js
"import-helpers/order-imports": [
    "error",
    {"groups": [ 'module', '/^@shared/', ['parent', 'sibling', 'index'] ]}
]
```

### `newlinesBetween: [ignore|always|always-and-inside-groups|never]`:

Enforces or forbids new lines between import groups:

-   If set to `ignore`, no errors related to new lines between import groups will be reported (default).
-   If set to `always`, at least one new line between each group will be enforced, and new lines inside a group will be forbidden. To prevent multiple lines between imports, core `no-multiple-empty-lines` rule can be used.
-   If set to `always-and-inside-groups`, at least one new line between each import statement will be enforced.
-   If set to `never`, no new lines are allowed in the entire import section.

With the default group setting, the following will be valid:

```js
/* eslint import-helpers/order-imports: ["error", {"newlinesBetween": "always"}] */
import fs from 'fs';
import path from 'path';

import sibling from './foo';

import index from './';
```

```js
/* eslint import-helpers/order-imports: ["error", {"newlinesBetween": "never"}] */
import fs from 'fs';
import path from 'path';
import sibling from './foo';
import index from './';
```

### `alphabetize: object`:

Sort the order within each group in alphabetical manner:

-   `order`: use `asc` to sort in ascending order, and `desc` to sort in descending order (default: `ignore`).
-   `ignoreCase` [boolean]: when `true`, the rule ignores case-sensitivity of the import name (default: `false`).

Example setting:

```js
alphabetize: {
    order: 'asc', /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
    ignoreCase: false, /* case-sensitive. This property does not have any effect if 'order' is set to 'ignore' */
}
```

This will pass:

```js
import Baz from 'Baz';
import bar from 'bar';
import foo from 'foo';
```

This will fail the rule check:

```js
import foo from 'foo';
import bar from 'bar';
import Baz from 'Baz';
```

### `unassignedImports: [ignore|allow] (default: ignore)`

Unassigned imports refers to imports which are not assigned to any variable but are imported globally.

Example:
```js
import 'polyfill'
import 'styles.scss'
```

By default unassigned imports are ignored, as the order they are imported in may be important.

-  If set to `allow`, considers unassigned imports like any other imports when ordering.
-  If set to `ignore`, does not consider the ordering for this import.

Examples:

#### ignore
```js
/* eslint import-helpers/order-imports: [
    "error",
    {
        unassignedImports: 'ignore',
        groups: [['module'], '/\.scss$/']
    },
] */

/* Any placement of 'styles.scss' is VALID */
import 'styles.scss';
import fs from 'fs';
import path from 'path';
```

#### allow
```js
/* eslint import-helpers/order-imports: [
    "error",
    {
        unassignedImports: 'allow',
        groups: [['module'], '/\.scss$/']
    },
] */

/* INVALID */
import 'styles.scss'
import fs from 'fs';
import path from 'path';

/* VALID */
import fs from 'fs';
import path from 'path';
import 'styles.scss'
```

## Upgrading from v0.14 to v1

### `builtin` | `external` | `internal` → `module`

In v1, `builtin`, `external`, `internal` have all been combined into one group, `module`. This simplifies the logic for this rule and makes it so it ONLY looks at the import strings and doesn't attempt any module resolution itself. The same functionality can be accomplished using regular expression groups.

If you want to keep the same `builtin` functionality, create a custom regular expression group to replace it, like so.

```javascript
// v0.14
groups: ['builtin', 'sibling'];
// v1
groups: [
	'/^(assert|async_hooks|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|http2|https|inspector|module|net|os|path|perf_hooks|process|punycode|querystring|readline|repl|stream|string_decoder|timers|tls|trace_events|tty|url|util|v8|vm|zli)/',
	'sibling',
];
```

If you want to keep the same `internal`/`external` functionality, create a custom regular expression group with your modules names.

### `'newlines-between' → 'newlinesBetween'`

In v1, the `newLinesBetween` configuration option is now in camel case.
