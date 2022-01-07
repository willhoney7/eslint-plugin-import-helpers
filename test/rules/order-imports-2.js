const RuleTester = require('eslint').RuleTester;

const { test } = require('../utils');

const ruleTester = new RuleTester();
const { default: rule } = require('../../lib/rules/order-imports');

ruleTester.run('order', rule, {
	valid: [
		// Default order using import
		// absolute at top
		// modules starting with _ or @ are sorted with modules
		test({
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
	],
	invalid: [
		// Option alphabetize: {order: 'desc', ignoreCase: true}
		test({
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
