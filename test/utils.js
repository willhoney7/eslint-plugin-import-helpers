const path = require('path');

const FILENAME = testFilePath('foo.js');

function testFilePath(relativePath) {
	return path.join(process.cwd(), './tests/files', relativePath);
}

function test(t) {
	return Object.assign(
		{
			filename: FILENAME,
		},
		t,
		{
			parserOptions: Object.assign(
				{
					sourceType: 'module',
					ecmaVersion: 6,
				},
				t.parserOptions
			),
		}
	);
}

module.exports = {
	FILENAME,
	test,
	testFilePath,
};
