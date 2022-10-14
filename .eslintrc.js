module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	extends: [
		'eslint:recommended',
		'plugin:eslint-plugin/recommended',
		'plugin:node/recommended',
		'plugin:prettier/recommended',
	],
	env: {
		node: true,
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
	overrides: [
		{
			files: ['test/**/*.js'],
			env: {
				mocha: true,
			},
		},
		{
			parser: '@typescript-eslint/parser',
			files: ['*.ts'],
			extends: ['plugin:@typescript-eslint/recommended'],
			rules: {
				'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
			},
		},
	],
};
