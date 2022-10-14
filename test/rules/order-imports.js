const RuleTester = require('eslint').RuleTester;

const { test } = require('../utils');

const ruleTester = new RuleTester();
const { default: rule } = require('../../lib/rules/order-imports');

function withoutAutofixOutput(test) {
	return Object.assign({}, test, { output: test.code });
}

function generateImports(count) {
	const imports = [];
	for (let i = 0; i < count; i++) {
		imports.push(`import foo${i} from './foo${i}.js';`);
	}
	return imports.sort().join('\n');
}

ruleTester.run('order', rule, {
	valid: [
		test({
			name: 'Default order using require',
			code: `
				var async = require('async');
        var fs = require('fs');
        var relParent1 = require('../foo');
        var relParent2 = require('../foo/bar');
        var relParent3 = require('../');
        var sibling = require('./foo');
        var index = require('./');`,
		}),
		test({
			name: 'Default order using import',
			code: `
		import abs from '/absolute-path';
		import async, {foo1} from 'async';
		import fs from 'fs';
        import relParent1 from '../foo';
        import relParent2, {foo2} from '../foo/bar';
        import relParent3 from '../';
        import sibling, {foo3} from './foo';
        import index from './';`,
		}),
		test({
			name: 'Multiple module of the same rank next to each other',
			code: `
			var async = require('async');
        var fs = require('fs');
        var fs = require('fs');
        var path = require('path');
        var _ = require('lodash');
				`,
		}),
		test({
			name: 'Overriding order to be the reverse of the default order',
			code: `
        var index = require('./');
        var sibling = require('./foo');
        var relParent3 = require('../');
        var relParent2 = require('../foo/bar');
        var relParent1 = require('../foo');
        var async = require('async');
        var fs = require('fs');
      `,
			options: [{ groups: ['index', 'sibling', 'parent', 'module'] }],
		}),
		test({
			name: 'Ignore dynamic requires',
			code: `
				var async = require('async');
        var path = require('path');
        var _ = require('lodash');
        var fs = require('f' + 's');`,
		}),
		test({
			name: 'Ignore non-require call expressions',
			code: `
        var path = require('path');
        var result = add(1, 2);
        var _ = require('lodash');`,
		}),
		test({
			name: 'Ignore requires that are not at the top-level',
			code: `
        var index = require('./');
        function foo() {
          var fs = require('fs');
        }
        () => require('fs');
        if (a) {
          require('fs');
        }`,
		}),
		test({
			name: 'Ignore unknown/invalid cases',
			code: `
				var async = require('async');
				var fs = require('fs');
        var unknown1 = require(/unknown1/);
    `,
		}),
		test({
			name: 'Ignoring unassigned values by default (require)',
			code: `
        require('./foo');
        require('fs');
        var path = require('path');
    `,
		}),
		test({
			name: 'Ignoring unassigned values by default (import)',
			code: `
        import './foo';
        import 'fs';
        import path from 'path';
    `,
		}),
		test({
			name: 'No imports',
			code: `
        function add(a, b) {
          return a + b;
        }
        var foo;
    `,
		}),
		test({
			name: 'Grouping import types',
			code: `
				var async = require('async');
        var fs = require('fs');
        var path = require('path');
        var index = require('./');

        var sibling = require('./foo');
        var relParent3 = require('../');
        var relParent1 = require('../foo');
      `,
			options: [
				{
					groups: [
						['module', 'index'],
						['sibling', 'parent'],
					],
				},
			],
		}),
		test({
			name: 'Omitted types should implicitly be considered as the last type',
			code: `
        var index = require('./');
        var path = require('path');
      `,
			options: [
				{
					groups: [
						'index',
						['sibling', 'parent'],
						// missing 'module'
					],
				},
			],
		}),
		test({
			name: 'Mixing require and import should have import up top',
			code: `
        import async, {foo1} from 'async';
        import relParent2, {foo2} from '../foo/bar';
        import sibling, {foo3} from './foo';
        var fs = require('fs');
        var relParent1 = require('../foo');
        var relParent3 = require('../');
        var index = require('./');
      `,
		}),
		test({
			name: "Option: newlinesBetween: 'always'",
			code: `
        var fs = require('fs');
        var async = require('async');
        var path = require('path');
        var index = require('./');



        var sibling = require('./foo');


        var relParent1 = require('../foo');
        var relParent3 = require('../');
      `,
			options: [
				{
					groups: [['module', 'index'], ['sibling'], ['parent']],
					newlinesBetween: 'always',
				},
			],
		}),
		test({
			name: "Option: newlinesBetween: 'never'",
			code: `
				var async = require('async');
        var fs = require('fs');
        var path = require('path');
        var index = require('./');
        var sibling = require('./foo');
        var relParent1 = require('../foo');
        var relParent3 = require('../');
      `,
			options: [
				{
					groups: [['module', 'index'], ['sibling'], ['parent']],
					newlinesBetween: 'never',
				},
			],
		}),
		test({
			name: "Option: newlinesBetween: 'ignore'",
			code: `
      var fs = require('fs');
      var async = require('async');

      var index = require('./');
      var path = require('path');
      var sibling = require('./foo');


      var relParent1 = require('../foo');

      var relParent3 = require('../');
      `,
			options: [
				{
					groups: [['module', 'index'], ['sibling'], ['parent']],
					newlinesBetween: 'ignore',
				},
			],
		}),
		test({
			name: "'ignore' should be the default value for `newlinesBetween`",
			code: `
			var fs = require('fs');

      var async = require('async');

      var index = require('./');
      var path = require('path');
      var sibling = require('./foo');


      var relParent1 = require('../foo');

      var relParent3 = require('../');

      `,
			options: [
				{
					groups: [['module', 'index'], ['sibling'], ['parent']],
				},
			],
		}),
		test({
			name: "Option newlinesBetween: 'always' with multiline imports #1",
			code: `
        import path from 'path';
        import {
            I,
            Want,
            Couple,
            Imports,
            Here
        } from 'bar';
        import external from 'external'
      `,
			options: [{ newlinesBetween: 'always' }],
		}),
		test({
			name: "Option newlinesBetween: 'always' with multiline imports #2",
			code: `
        import path from 'path';
        import net
          from 'net';
				import external from 'external'

				import foo from './foo';
      `,
			options: [{ newlinesBetween: 'always' }],
		}),
		test({
			name: "Option newlinesBetween: 'always' with multiline imports #3",
			code: `
        import foo
          from '../../../../this/will/be/very/long/path/and/therefore/this/import/has/to/be/in/two/lines';

        import bar
          from './sibling';
      `,
			options: [{ newlinesBetween: 'always' }],
		}),
		test({
			name: "Option newlinesBetween: 'always' with not assigned import #1",
			code: `
        import path from 'path';

        import 'loud-rejection';
        import 'something-else';

        import foo from './foo';
      `,
			options: [{ newlinesBetween: 'always' }],
		}),
		test({
			name: "Option newlinesBetween: 'never' with not assigned import #2",
			code: `
        import path from 'path';
        import 'loud-rejection';
        import 'something-else';
        import foo from './foo';
      `,
			options: [{ newlinesBetween: 'never' }],
		}),
		test({
			name: "Option newlinesBetween: 'always' with not assigned require #1",
			code: `
        var path = require('path');

        require('loud-rejection');
        require('something-else');

        var foo = require('./foo');
      `,
			options: [{ newlinesBetween: 'always' }],
		}),
		test({
			name: "Option newlinesBetween: 'never' with not assigned require #2",
			code: `
        var path = require('path');
        require('loud-rejection');
        require('something-else');
        var foo = require('./foo');
      `,
			options: [{ newlinesBetween: 'never' }],
		}),
		test({
			name: "Option newlinesBetween: 'never' should ignore nested require statement's #1",
			code: `
        var some = require('asdas');
        var config = {
          port: 4444,
          runner: {
            server_path: require('runner-binary').path,

            cli_args: {
                'webdriver.chrome.driver': require('browser-binary').path
            }
          }
        }
      `,
			options: [{ newlinesBetween: 'never' }],
		}),
		test({
			name: "Option newlinesBetween: 'always' should ignore nested require statement's #2",
			code: `
        var some = require('asdas');
        var config = {
          port: 4444,
          runner: {
            server_path: require('runner-binary').path,
            cli_args: {
                'webdriver.chrome.driver': require('browser-binary').path
            }
          }
        }
      `,
			options: [{ newlinesBetween: 'always' }],
		}),
		// Option: newlinesBetween: 'always-and-inside-groups'
		test({
			name: 'should have at least one new line between each import statement',
			code: `
				var fs = require('fs');

				var path = require('path');

				var util = require('util');

				var async = require('async');



				var relParent1 = require('../foo');

        var relParent2 = require('../');

        var relParent3 = require('../bar');

				var sibling = require('./foo');

        var sibling2 = require('./bar');

        var sibling3 = require('./foobar');
      `,
			options: [
				{
					newlinesBetween: 'always-and-inside-groups',
				},
			],
		}),
		test({
			name: "Option alphabetize: {order: 'ignore'}",
			code: `
        import foo from 'foo';
        import bar from 'bar';

        import index from './';
      `,
			options: [
				{
					groups: ['module', 'index'],
					alphabetize: { order: 'ignore' },
				},
			],
		}),
		test({
			name: "Option alphabetize: {order: 'asc', ignoreCase: false}",
			code: `
        import Baz from 'Baz';
        import bar from 'bar';
        import foo from 'foo';

        import index from './';
      `,
			options: [
				{
					groups: ['module', 'index'],
					alphabetize: { order: 'asc', ignoreCase: false },
				},
			],
		}),
		test({
			name: "Option alphabetize: {order: 'asc', ignoreCase: true}",
			code: `
        import bar from 'bar';
        import Baz from 'Baz';
        import foo from 'foo';

        import index from './';
      `,
			options: [
				{
					groups: ['module', 'index'],
					alphabetize: { order: 'asc', ignoreCase: true },
				},
			],
		}),
		test({
			name: "Option alphabetize: {order: 'desc', ignoreCase: false}",
			code: `
        import foo from 'foo';
        import bar from 'bar';
        import Baz from 'Baz';

        import index from './';
      `,
			options: [
				{
					groups: ['module', 'index'],
					alphabetize: { order: 'desc', ignoreCase: false },
				},
			],
		}),
		test({
			name: "Option alphabetize: {order: 'desc', ignoreCase: true}",
			code: `
        import foo from 'foo';
        import Baz from 'Baz';
        import bar from 'bar';

        import index from './';
      `,
			options: [
				{
					groups: ['module', 'index'],
					alphabetize: { order: 'desc', ignoreCase: true },
				},
			],
		}),
		test({
			name: 'With large number of imports in the same group to ensure no newlines are inserted into group.',
			code: generateImports(150),
			options: [
				{
					newlinesBetween: 'always',
					alphabetize: { order: 'asc' },
				},
			],
		}),
	],
	invalid: [
		test({
			name: "Option: newlinesBetween: 'always-and-inside-groups' should have at least one new line between each import statement",
			code: `
				var fs = require('fs');

				var path = require('path');

				var util = require('util');
				var async = require('async');



				var relParent1 = require('../foo');
			`,
			output: `
				var fs = require('fs');

				var path = require('path');

				var util = require('util');

				var async = require('async');



				var relParent1 = require('../foo');
			`,
			errors: [
				{
					message: 'There should be at least one empty line between imports',
				},
			],
			options: [
				{
					newlinesBetween: 'always-and-inside-groups',
				},
			],
		}),
		test({
			name: 'fix order with spaces on the end of line',
			code: `
		        var parent = require('../parent');
		        var fs = require('fs');${' '}
		      `,
			output: `
		        var fs = require('fs');${' '}
		        var parent = require('../parent');
		      `,
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'fix order with comment on the end of line',
			code: `
		        var parent = require('../parent');
		        var fs = require('fs'); /* comment */
		      `,
			output: `
		        var fs = require('fs'); /* comment */
		        var parent = require('../parent');
		      `,
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'fix order with comments at the end and start of line',
			code: `
		        /* comment1 */  var parent = require('../parent'); /* comment2 */
		        /* comment3 */  var fs = require('fs'); /* comment4 */
		      `,
			output: `
		        /* comment3 */  var fs = require('fs'); /* comment4 */
		        /* comment1 */  var parent = require('../parent'); /* comment2 */
		      `,
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'fix order with few comments at the end and start of line',
			code: `
		        /* comment0 */  /* comment1 */  var parent = require('../parent'); /* comment2 */
		        /* comment3 */  var fs = require('fs'); /* comment4 */
		      `,
			output: `
		        /* comment3 */  var fs = require('fs'); /* comment4 */
		        /* comment0 */  /* comment1 */  var parent = require('../parent'); /* comment2 */
		      `,
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'fix order with windows end of lines',
			code:
				`/* comment0 */  /* comment1 */  var parent = require('../parent'); /* comment2 */` +
				`\r\n` +
				`/* comment3 */  var fs = require('fs'); /* comment4 */` +
				`\r\n`,
			output:
				`/* comment3 */  var fs = require('fs'); /* comment4 */` +
				`\r\n` +
				`/* comment0 */  /* comment1 */  var parent = require('../parent'); /* comment2 */` +
				`\r\n`,
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'fix order with multilines comments at the end and start of line',
			code: "/* multiline1\n\
comment1 */var parent = require('../parent'); /* multiline2\n\
comment2 */  var fs = require('fs');/* multiline3\n\
comment3 */",
			output: "/* multiline1\n\
comment1 */  var fs = require('fs');\n\
var parent = require('../parent'); /* multiline2\n\
comment2 *//* multiline3\n\
comment3 */", // the spacing here is really sensitive
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'fix order of multiple import',
			code: `
		        var parent = require('../parent');
		        var fs =
		          require('fs');
		      `,
			output: `
		        var fs =
		          require('fs');
		        var parent = require('../parent');
		      `,
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'fix order at the end of file',
			code: `
		        var parent = require('../parent');
		        var fs = require('fs');`,
			output:
				`
		        var fs = require('fs');
		        var parent = require('../parent');` + '\n',
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'module before parent module (import)',
			code: `
		        import parent from '../parent';
		        import fs from 'fs';
		      `,
			output: `
		        import fs from 'fs';
		        import parent from '../parent';
		      `,
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'module before parent (mixed import and require)',
			code: `
		        var parent = require('../parent');
		        import fs from 'fs';
		      `,
			output: `
		        import fs from 'fs';
		        var parent = require('../parent');
		      `,
			errors: [
				{
					message: '`fs` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'parent before sibling',
			code: `
		    var sibling = require('./sibling');
		    var parent = require('../parent');
		  `,
			output: `
		    var parent = require('../parent');
		    var sibling = require('./sibling');
		  `,
			errors: [
				{
					message: '`../parent` import should occur before import of `./sibling`',
				},
			],
		}),
		test({
			name: 'sibling before index',
			code: `
		    var index = require('./');
		    var sibling = require('./sibling');
		  `,
			output: `
		    var sibling = require('./sibling');
		    var index = require('./');
		  `,
			errors: [
				{
					message: '`./sibling` import should occur before import of `./`',
				},
			],
		}),
		test({
			name: "Uses 'after' wording if it creates less errors",
			code: `
		    var index = require('./');
		    var fs = require('fs');
		    var path = require('path');
		    var _ = require('lodash');
		    var foo = require('foo');
		    var bar = require('bar');
		  `,
			output: `
		    var fs = require('fs');
		    var path = require('path');
		    var _ = require('lodash');
		    var foo = require('foo');
		    var bar = require('bar');
		    var index = require('./');
		  `,
			errors: [
				{
					message: '`./` import should occur after import of `bar`',
				},
			],
		}),
		test({
			name: 'Overriding order to be the reverse of the default order',
			code: `
		    var fs = require('fs');
		    var index = require('./');
		  `,
			output: `
		    var index = require('./');
		    var fs = require('fs');
		  `,
			options: [{ groups: ['index', 'sibling', 'parent', 'module'] }],
			errors: [
				{
					message: '`./` import should occur before import of `fs`',
				},
			],
		}),
		// // member expression of require
		test(
			withoutAutofixOutput({
				code: `
		    var foo = require('./foo').bar;
		    var fs = require('fs');
		  `,
				errors: [
					{
						message: '`fs` import should occur before import of `./foo`',
					},
				],
			})
		),
		// // nested member expression of require
		test(
			withoutAutofixOutput({
				code: `
		    var foo = require('./foo').bar.bar.bar;
		    var fs = require('fs');
		  `,
				errors: [
					{
						message: '`fs` import should occur before import of `./foo`',
					},
				],
			})
		),
		// // fix near nested member expression of require with newlines
		test(
			withoutAutofixOutput({
				code: `
		    var foo = require('./foo').bar
		      .bar
		      .bar;
		    var fs = require('fs');
		  `,
				errors: [
					{
						message: '`fs` import should occur before import of `./foo`',
					},
				],
			})
		),
		// // fix nested member expression of require with newlines
		test(
			withoutAutofixOutput({
				code: `
		    var foo = require('./foo');
		    var fs = require('fs').bar
		      .bar
		      .bar;
		  `,
				errors: [
					{
						message: '`fs` import should occur before import of `./foo`',
					},
				],
			})
		),
		test({
			name: '// Grouping import types',
			code: `
		    var fs = require('fs');
		    var index = require('./');
		    var sibling = require('./foo');
		    var path = require('path');
		  `,
			output: `
		    var fs = require('fs');
		    var index = require('./');
		    var path = require('path');
		    var sibling = require('./foo');
		  `,
			options: [
				{
					groups: [
						['module', 'index'],
						['sibling', 'parent'],
					],
				},
			],
			errors: [
				{
					message: '`path` import should occur before import of `./foo`',
				},
			],
		}),
		test({
			name: 'Omitted types should implicitly be considered as the last type',
			code: `
				var path = require('path');
				var parent = require('../parent');
				var async = require('async');
		  `,
			output: `
				var path = require('path');
				var async = require('async');
				var parent = require('../parent');
		  `,
			options: [
				{
					groups: [
						'index',
						['module', 'sibling'],
						// missing 'parent'
					],
				},
			],
			errors: [
				{
					message: '`async` import should occur before import of `../parent`',
				},
			],
		}),
		test({
			name: 'Setting the order for an unknown type should make the rule trigger an error and do nothing else',
			code: `
		        var async = require('async');
		        var index = require('./');
		      `,
			options: [{ groups: ['index', ['sibling', 'parent', 'UNKNOWN', 'internal']] }],
			errors: [
				{
					message:
						"Incorrect configuration of the rule: Unknown type \"UNKNOWN\". For a regular expression, wrap the string in '/', ex: '/shared/'",
				},
			],
		}),
		test({
			name: "Type in an array can't be another array, too much nesting",
			code: `
		        var async = require('async');
		        var index = require('./');
		      `,
			options: [{ groups: ['index', ['sibling', 'parent', ['builtin'], 'internal']] }],
			errors: [
				{
					message:
						"Incorrect configuration of the rule: Unknown type [\"builtin\"]. For a regular expression, wrap the string in '/', ex: '/shared/'",
				},
			],
		}),
		test({
			name: '		// No numbers',
			code: `
		        var async = require('async');
		        var index = require('./');
		      `,
			options: [{ groups: ['index', ['sibling', 'parent', 2, 'internal']] }],
			errors: [
				{
					message:
						"Incorrect configuration of the rule: Unknown type 2. For a regular expression, wrap the string in '/', ex: '/shared/'",
				},
			],
		}),
		test({
			name: '		// Duplicate',
			code: `
		        var async = require('async');
		        var index = require('./');
		      `,
			options: [{ groups: ['index', ['sibling', 'parent', 'parent', 'internal']] }],
			errors: [
				{
					message: 'Incorrect configuration of the rule: `parent` is duplicated',
				},
			],
		}),
		test({
			name: '		// Mixing require and import should have import up top',
			code: `
		        import async, {foo1} from 'async';
		        import relParent2, {foo2} from '../foo/bar';
		        var fs = require('fs');
		        var relParent1 = require('../foo');
		        var relParent3 = require('../');
		        import sibling, {foo3} from './foo';
		        var index = require('./');
		      `,
			output: `
		        import async, {foo1} from 'async';
		        import relParent2, {foo2} from '../foo/bar';
		        import sibling, {foo3} from './foo';
		        var fs = require('fs');
		        var relParent1 = require('../foo');
		        var relParent3 = require('../');
		        var index = require('./');
		      `,
			errors: [
				{
					message: '`./foo` import should occur before import of `fs`',
				},
			],
		}),
		test({
			code: `
		        var fs = require('fs');
		        import async, {foo1} from 'async';
		        import relParent2, {foo2} from '../foo/bar';
		      `,
			output: `
		        import async, {foo1} from 'async';
		        import relParent2, {foo2} from '../foo/bar';
		        var fs = require('fs');
		      `,
			errors: [
				{
					message: '`fs` import should occur after import of `../foo/bar`',
				},
			],
		}),
		test({
			name: "Option newlinesBetween: 'never' - should report unnecessary line between groups",
			code: `
						var fs = require('fs');
						var index = require('./');
						var async = require('async');

						var path = require('path');

						var sibling = require('./foo');
						var relParent1 = require('../foo');
						var relParent3 = require('../');
		      `,
			output: `
						var fs = require('fs');
						var index = require('./');
						var async = require('async');
						var path = require('path');
						var sibling = require('./foo');
						var relParent1 = require('../foo');
						var relParent3 = require('../');
		      `,
			options: [
				{
					groups: [['module', 'index'], ['sibling'], ['parent']],
					newlinesBetween: 'never',
				},
			],
			errors: [
				{
					line: 4,
					message: 'There should be no empty line between import groups',
				},
				{
					line: 6,
					message: 'There should be no empty line between import groups',
				},
			],
		}),
		test({
			name: 'Fix newlinesBetween with comments after',
			code: `
				var fs = require('fs'); /* comment */

				var index = require('./');`,
			output: `
				var fs = require('fs'); /* comment */
				var index = require('./');`,
			options: [
				{
					groups: [['module'], ['index']],
					newlinesBetween: 'never',
				},
			],
			errors: [
				{
					line: 2,
					message: 'There should be no empty line between import groups',
				},
			],
		}),
		test({
			name: 'Cannot fix newlinesBetween with multiline comment after',
			code: `
		        var fs = require('fs'); /* multiline
				comment */

		        var index = require('./');
		      `,
			output: `
		        var fs = require('fs'); /* multiline
				comment */

		        var index = require('./');
		      `,
			options: [
				{
					groups: [['module'], ['index']],
					newlinesBetween: 'never',
				},
			],
			errors: [
				{
					line: 2,
					message: 'There should be no empty line between import groups',
				},
			],
		}),
		test({
			name: "Option newlinesBetween: 'always' - should report lack of newline between groups",
			code: `
				var fs = require('fs');
				var index = require('./');
				var path = require('path');
				var sibling = require('./foo');
				var relParent1 = require('../foo');
				var relParent3 = require('../');`,
			output: `
				var fs = require('fs');
				var index = require('./');
				var path = require('path');

				var sibling = require('./foo');

				var relParent1 = require('../foo');
				var relParent3 = require('../');`,
			options: [
				{
					groups: [['module', 'index'], ['sibling'], ['parent']],
					newlinesBetween: 'always',
				},
			],
			errors: [
				{
					line: 4,
					message: 'There should be at least one empty line between import groups',
				},
				{
					line: 5,
					message: 'There should be at least one empty line between import groups',
				},
			],
		}),
		test({
			name: "Option newlinesBetween: 'always' should report unnecessary empty lines space between import groups",
			code: `
				var fs = require('fs');

				var path = require('path');
				var index = require('./');

				var sibling = require('./foo');
		      `,
			output: `
				var fs = require('fs');
				var path = require('path');
				var index = require('./');

				var sibling = require('./foo');
		      `,
			options: [
				{
					groups: [
						['module', 'index'],
						['sibling', 'parent'],
					],
					newlinesBetween: 'always',
				},
			],
			errors: [
				{
					line: 2,
					message: 'There should be no empty line within import group',
				},
			],
		}),
		test({
			name: "Option newlinesBetween: 'never' cannot fix if there are other statements between imports",
			code: `
		        import path from 'path';
				import 'loud-rejection';

		        import 'something-else';
		        import _ from 'lodash';
		      `,
			output: `
		        import path from 'path';
				import 'loud-rejection';

		        import 'something-else';
		        import _ from 'lodash';
		      `,
			options: [{ newlinesBetween: 'never' }],
			errors: [
				{
					line: 2,
					message: 'There should be no empty line between import groups',
				},
			],
		}),
		test({
			name: "Option newlinesBetween: 'always' should report missing empty lines when using not assigned imports",
			code: `
				import path from 'path';
				import 'loud-rejection';
				import 'something-else';
				import _ from './relative';
		      `,
			output: `
				import path from 'path';

				import 'loud-rejection';
				import 'something-else';
				import _ from './relative';
		      `,
			options: [{ newlinesBetween: 'always' }],
			errors: [
				{
					line: 2,
					message: 'There should be at least one empty line between import groups',
				},
			],
		}),
		test({
			name: 'fix missing empty lines with single line comment after',
			code: `
				import path from 'path'; // comment
				import _ from './relative';
		      `,
			output: `
				import path from 'path'; // comment

				import _ from './relative';
		      `,
			options: [{ newlinesBetween: 'always' }],
			errors: [
				{
					line: 2,
					message: 'There should be at least one empty line between import groups',
				},
			],
		}),
		test({
			name: 'fix missing empty lines with few line block comment after',
			code: `
				import path from 'path'; /* comment */ /* comment */
				import _ from './relative';
		      `,
			output: `
				import path from 'path'; /* comment */ /* comment */

				import _ from './relative';
		      `,
			options: [{ newlinesBetween: 'always' }],
			errors: [
				{
					line: 2,
					message: 'There should be at least one empty line between import groups',
				},
			],
		}),
		test(
			{
				name: 'fix missing empty lines with single line block comment after',
				code: `
				import path from 'path'; /* 1
				2 */
				import _ from './relative';
		      `,
				output: `
				import path from 'path';
 /* 1
				2 */
				import _ from './relative';
		      `,
				options: [{ newlinesBetween: 'always' }],
				errors: [
					{
						line: 2,
						message: 'There should be at least one empty line between import groups',
					},
				],
			},
			{ noTrim: true }
		),
		// reorder fix cannot cross non import or require
		test(
			withoutAutofixOutput({
				code: `
				var relative = require('./relative');
				fn_call();
				var fs = require('fs');
		      `,
				errors: [
					{
						message: '`fs` import should occur before import of `./relative`',
					},
				],
			})
		),
		// reorder cannot cross non plain requires
		test(
			withoutAutofixOutput({
				code: `
		        var relative = require('./relative');
		        var a = require('./value.js')(a);
		        var fs = require('fs');
		      `,
				errors: [
					{
						message: '`fs` import should occur before import of `./relative`',
					},
				],
			})
		),
		// reorder fixes cannot be applied to non plain requires #1
		test(
			withoutAutofixOutput({
				code: `
		        var relative = require('./relative');
		        var fs = require('fs')(a);
		      `,
				errors: [
					{
						message: '`fs` import should occur before import of `./relative`',
					},
				],
			})
		),
		// reorder fixes cannot be applied to non plain requires #2
		test(
			withoutAutofixOutput({
				code: `
		        var relative = require('./relative')(a);
		        var fs = require('fs');
		      `,
				errors: [
					{
						message: '`fs` import should occur before import of `./relative`',
					},
				],
			})
		),
		// cannot require in case of not assignement require
		test(
			withoutAutofixOutput({
				code: `
		        var relative = require('./relative');
		        require('./aa');
		        var fs = require('fs');
		      `,
				errors: [
					{
						message: '`fs` import should occur before import of `./relative`',
					},
				],
			})
		),
		// reorder cannot cross function call (import statement)
		test(
			withoutAutofixOutput({
				code: `
		        import relative from './relative';
		        fn_call();
		        import fs from 'fs';
		      `,
				errors: [
					{
						message: '`fs` import should occur before import of `./relative`',
					},
				],
			})
		),
		// reorder cannot cross variable assignemet (import statement)
		test(
			withoutAutofixOutput({
				code: `
		        import relative from './relative';
		        var a = 1;
		        import fs from 'fs';
		      `,
				errors: [
					{
						message: '`fs` import should occur before import of `./relative`',
					},
				],
			})
		),
		// reorder cannot cross non plain requires (import statement)
		test(
			withoutAutofixOutput({
				code: `
		        import relative from './relative';
		        var a = require('./value.js')(a);
		        import fs from 'fs';
		      `,
				errors: [
					{
						message: '`fs` import should occur before import of `./relative`',
					},
				],
			})
		),
		// cannot reorder in case of not assignement import
		test(
			withoutAutofixOutput({
				code: `
		        import relative from './relative';
		        import './aa';
		        import fs from 'fs';
		      `,
				errors: [
					{
						message: '`fs` import should occur before import of `./relative`',
					},
				],
			})
		),
		test({
			name: 'fix incorrect order with @typescript-eslint/parser',
			code: `
		        var relative = require('./relative');
		        var fs = require('fs');
		      `,
			output: `
		        var fs = require('fs');
		        var relative = require('./relative');
		      `,
			parser: require.resolve('@typescript-eslint/parser'),
			errors: [
				{
					message: '`fs` import should occur before import of `./relative`',
				},
			],
		}),
		test({
			name: "Option alphabetize: {order: 'asc', ignoreCase: false}",
			code: `
		        import bar from 'bar';
		        import Baz from 'Baz';
		        import foo from 'foo';
		        import index from './';
		      `,
			output: `
		        import Baz from 'Baz';
		        import bar from 'bar';
		        import foo from 'foo';
		        import index from './';
		      `,
			options: [
				{
					groups: ['module', 'index'],
					alphabetize: { order: 'asc', ignoreCase: false },
				},
			],
			errors: [
				{
					message: '`Baz` import should occur before import of `bar`',
				},
			],
		}),
		test({
			name: "Option alphabetize: {order: 'asc', ignoreCase: true}",
			code: `
		        import Baz from 'Baz';
		        import bar from 'bar';
		        import foo from 'foo';
		        import index from './';
		      `,
			output: `
		        import bar from 'bar';
		        import Baz from 'Baz';
		        import foo from 'foo';
		        import index from './';
		      `,
			options: [
				{
					groups: ['module', 'index'],
					alphabetize: { order: 'asc', ignoreCase: true },
				},
			],
			errors: [
				{
					message: '`bar` import should occur before import of `Baz`',
				},
			],
		}),
		test({
			name: "Option alphabetize: {order: 'desc', ignoreCase: false}",
			code: `
		        import foo from 'foo';
		        import Baz from 'Baz';
		        import bar from 'bar';
		        import index from './';
		      `,
			output: `
		        import foo from 'foo';
		        import bar from 'bar';
		        import Baz from 'Baz';
		        import index from './';
		      `,
			options: [
				{
					groups: ['module', 'index'],
					alphabetize: { order: 'desc', ignoreCase: false },
				},
			],
			errors: [
				{
					message: '`bar` import should occur before import of `Baz`',
				},
			],
		}),
		test({
			name: "Option alphabetize: {order: 'desc', ignoreCase: true}",
			code: `
		        import foo from 'foo';
		        import bar from 'bar';
		        import Baz from 'Baz';
		        import index from './';
		      `,
			output: `
		        import foo from 'foo';
		        import Baz from 'Baz';
		        import bar from 'bar';
		        import index from './';
		      `,
			options: [
				{
					groups: ['module', 'index'],
					alphabetize: { order: 'desc', ignoreCase: true },
				},
			],
			errors: [
				{
					message: '`Baz` import should occur before import of `bar`',
				},
			],
		}),
	],
});
