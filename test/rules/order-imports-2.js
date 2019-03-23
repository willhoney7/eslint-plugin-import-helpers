const RuleTester = require('eslint/lib/testers/rule-tester');

const { test } = require('../utils');

const ruleTester = new RuleTester();
const rule = require('../../src/rules/order-imports');

ruleTester.run('order', rule, {
	valid: [
		// Default order using import
		test({
			code: `
				import fs from 'fs';
				
				import async, {foo1} from 'async';
				
		    import relParent1 from '../foo';
				import relParent2, {foo2} from '../foo/bar';
				
				import relParent3 from '@shared';
				
				import sibling, {foo3} from './foo';
				
				import index from './';`,
			options: [
				{
					groups: ['builtin', 'external', 'parent', '/@shared/', 'sibling', 'index'],
					alphabetize: { order: 'asc', ignoreCase: true },
					'newlines-between': 'always'
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
					groups: [['builtin', 'external'], '/@shared/', ['parent', 'sibling', 'index']],
					alphabetize: { order: 'asc', ignoreCase: true },
					'newlines-between': 'always'
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
					groups: ['builtin', 'external', '/^@shared/', 'parent', 'sibling', 'index'],
					'newlines-between': 'always'
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
					groups: [['builtin', 'external'], '/@shared/', ['parent', 'sibling', 'index']],
					alphabetize: { order: 'asc', ignoreCase: true },
					'newlines-between': 'always-and-inside-groups'
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
					groups: ['external', 'index'],
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
