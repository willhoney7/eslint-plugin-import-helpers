var normalizedPath = require('path').join(__dirname, 'rules');

require('fs')
	.readdirSync(normalizedPath)
	.forEach(function(file) {
		require('./rules/' + file);
	});
