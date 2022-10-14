const RuleTester = require('eslint').RuleTester;

const { test } = require('../utils');

const ruleTester = new RuleTester();
const { default: rule } = require('../../lib/rules/order-imports');

ruleTester.run('order', rule, {
	valid: [
		// Default order using import
		// absolute at top
		test({
			name: 'modules starting with _ or @ are sorted with modules',
			code: `
				import abs from '/absolute/module';

				import blah from '_lodash';
				import module from '@module/core';
				import print from '@module/print';
				import async, {foo1} from 'async';
				import fs from 'fs';

		    	import relParent1 from '../foo';
				import relParent2, {foo2} from '../foo/bar';

				import relParent3 from '@shared';

				import sibling, {foo3} from './foo';

				import index from './';`,
			options: [
				{
					groups: ['absolute', 'module', 'parent', '/@shared/', 'sibling', 'index'],
					alphabetize: { order: 'asc', ignoreCase: true },
					newlinesBetween: 'always',
				},
			],
		}),
		test({
			code: `
				import async, {foo1} from 'async';
				import fs from 'fs';

				import relParent3 from '@shared';

				import relParent1 from '../foo';
				import relParent2, {foo2} from '../foo/bar';
				import index from './';
				import sibling, {foo3} from './foo';`,
			options: [
				{
					groups: [['module'], '/@shared/', ['parent', 'sibling', 'index']],
					alphabetize: { order: 'asc', ignoreCase: true },
					newlinesBetween: 'always',
				},
			],
		}),
		test({
			code: `
				import fs from 'fs';
				import async, {foo1} from 'async';

				import relParent3 from '@shared';

				import relParent1 from '../foo';
				import relParent2, {foo2} from '../foo/bar';

				import sibling, {foo3} from './foo';

				import index from './';
				`,
			options: [
				{
					groups: ['module', '/^@shared/', 'parent', 'sibling', 'index'],
					newlinesBetween: 'always',
				},
			],
		}),
		test({
			code: `
				import async, {foo1} from 'async';

				import fs from 'fs';

				import relParent3 from '@shared';

				import relParent1 from '../foo';

				import relParent2, {foo2} from '../foo/bar';

				import index from './';
				
				import sibling, {foo3} from './foo';`,
			options: [
				{
					groups: [['module'], '/@shared/', ['parent', 'sibling', 'index']],
					alphabetize: { order: 'asc', ignoreCase: true },
					newlinesBetween: 'always-and-inside-groups',
				},
			],
		}),
		// test out "types"
		test({
			name: 'type at end',
			code: `
				import sib from './sib';
				import type { relative } from './relative';
		      `,
			parser: require.resolve('@typescript-eslint/parser'),
			options: [{ groups: ['module', 'sibling', 'type'] }],
		}),
		test({
			name: 'type at beginning',
			code: `
				import type { relative } from './relative';
				import sib from './sib';
		      `,
			parser: require.resolve('@typescript-eslint/parser'),
			options: [{ groups: ['type', 'module', 'sibling'] }],
		}),
		test({
			name: "explicit no type group means don't treat types special, both of these pass (when alphabetization is ignored) 1",
			code: `
				import sib from './sib';
				import type { relative } from './relative';
		      `,
			parser: require.resolve('@typescript-eslint/parser'),
			options: [{ groups: ['module', 'sibling'] }],
		}),
		test({
			name: "explicit no type group means don't treat types special, both of these pass (when alphabetization is ignored) 2",
			code: `
				import type { relative } from './relative';
				import sib from './sib';
		      `,
			parser: require.resolve('@typescript-eslint/parser'),
			options: [{ groups: ['module', 'sibling'] }],
		}),
		test({
			name: "default groups don't have a type group and so types aren't special",
			code: `
				import sib from './sib';
				import type { relative } from './relative';
		      `,
			parser: require.resolve('@typescript-eslint/parser'),
		}),
		test({
			name: "default groups don't have a type group and so types aren't special",
			code: `
				import type { relative } from './relative';
				import sib from './sib';
		      `,
			parser: require.resolve('@typescript-eslint/parser'),
		}),
	],
	invalid: [
		test({
			code: `
				import type { relative } from './relative';
				import sib from './sib';
		      `,
			output: `
				import sib from './sib';
				import type { relative } from './relative';
		      `,
			parser: require.resolve('@typescript-eslint/parser'),

			options: [{ groups: ['module', 'sibling', 'type'] }],
			errors: [{ message: '`./sib` import should occur before import of `./relative`' }],
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
		// // Multiple errors
		// TODO FAILING TEST
		// test({
		// 	code: `
		//     var sibling = require('./sibling');
		//     var parent = require('../parent');
		//     var fs = require('fs');
		//   `,
		// 	output: `
		//     var fs = require('fs');
		//     var parent = require('../parent');
		//     var sibling = require('./sibling');
		//   `,
		// 	errors: [
		// 		{
		// 			message: '`../parent` import should occur before import of `./sibling`',
		// 		},
		// 		{
		// 			message: '`fs` import should occur before import of `./sibling`',
		// 		},
		// 	],
		// }),
	],
});
