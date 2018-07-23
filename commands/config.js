const fs = require('fs');

module.exports = function(param, value, cmd) {
	const settingsPath = '../settings.json';
	let currentSettings = require(settingsPath);
	if (cmd.list) {
		for (let key in currentSettings) {
			console.log(`${key}: ${currentSettings[key]}`);
		}
	} else {
		if (!param || !value) {
			console.error('Parameter and value must be specified');
			return;
		}

		if (!currentSettings[param]) {
			console.error('Unknown parameter');
			return;
		}

		value = parseInt(value);
		if (isNaN(value) || value < 1) {
			console.error('Value must be positive integer');
			return;
		}

		currentSettings[param] = value;

		fs.writeFile('./settings.json', JSON.stringify(currentSettings), 'utf8', err => {
			if (err) {
				console.error('Can\'t save settings');
			} else {
				console.log('Settings saved');
			}
		});
	}
};