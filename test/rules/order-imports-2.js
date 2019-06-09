const RuleTester = require('eslint/lib/testers/rule-tester');

const { test } = require('../utils');

const ruleTester = new RuleTester();
const rule = require('rules/order-imports');

ruleTester.run('order', rule, {
	valid: [
		// Default order using import
		test({
			code: `
				import async, {foo1} from 'async';
				import module from '@module/core';
				import print from '@module/print';
				import fs from 'fs';

		    import relParent1 from '../foo';
				import relParent2, {foo2} from '../foo/bar';

				import relParent3 from '@shared';

				import sibling, {foo3} from './foo';

				import index from './';`,
			options: [
				{
					groups: ['module', 'parent', '/@shared/', 'sibling', 'index'],
					alphabetize: { order: 'asc', ignoreCase: true },
					newlinesBetween: 'always'
				}
			]
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
					newlinesBetween: 'always'
				}
			]
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
					newlinesBetween: 'always'
				}
			]
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
					newlinesBetween: 'always-and-inside-groups'
				}
			]
		})
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
					alphabetize: { order: 'desc', ignoreCase: true }
				}
			],
			errors: [
				{
					ruleID: 'order',
					message: '`Baz` import should occur before import of `bar`'
				}
			]
		})
	]
});
