const path = require('path');

const FILENAME = testFilePath('foo.js');

function testFilePath(relativePath) {
	return path.join(process.cwd(), './tests/files', relativePath);
}

function test(t, extraOptions = {}) {
	let testParams = {
		filename: FILENAME,
		...t,
		code: extraOptions.noTrim ? t.code : trimWhitespaceForEachLine(t.code),
		languageOptions: Object.assign(
			{
				sourceType: 'module',
				ecmaVersion: 6,
			},
			t.languageOptions
		),
	};

	if (testParams.output && !extraOptions.noTrim) {
		testParams.output = trimWhitespaceForEachLine(testParams.output);
	}

	return testParams;
}

function trimWhitespaceForEachLine(string = '') {
	return string
		.split('\n')
		.map((line) => line.trim())
		.join('\n');
}

module.exports = {
	FILENAME,
	test,
	testFilePath,
};
