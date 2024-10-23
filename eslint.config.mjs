import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['**/lib/'],
	},
	...compat.extends(
		'eslint:recommended',
		'plugin:eslint-plugin/recommended',
		'plugin:node/recommended',
		'plugin:prettier/recommended'
	),
	{
		languageOptions: {
			globals: {
				...globals.node,
			},

			ecmaVersion: 2021,
			sourceType: 'module',
		},

		settings: {
			node: {
				tryExtensions: ['.js', '.json', '.node', '.ts', '.d.ts'],
			},
		},

		rules: {
			'prettier/prettier': 0,
			'eslint-plugin/prefer-message-ids': 1,
		},
	},
	{
		files: ['test/**/*.js'],

		languageOptions: {
			globals: {
				...globals.mocha,
			},
		},
	},
	...compat.extends('plugin:@typescript-eslint/recommended').map((config) => ({
		...config,
		files: ['**/*.ts'],
	})),
	{
		files: ['**/*.ts'],

		languageOptions: {
			parser: tsParser,
		},

		rules: {
			'node/no-unsupported-features/es-syntax': [
				'error',
				{
					ignores: ['modules'],
				},
			],
		},
	},
];
