'use strict';

const fs = require('fs');
const defaultSettings = require('./default_settings.json');

console.log('Install default settings...');
fs.writeFile('./settings.json', JSON.stringify(defaultSettings), 'utf8', err => {
	if (err) {
		console.error(err);
		process.exit();
	} else {
		console.log('Settings installation complete');
	}
});
