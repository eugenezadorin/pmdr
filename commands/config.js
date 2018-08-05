'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(param, value, cmd) {
	const settingsPath = path.join(__dirname, '..', 'settings.json');
	const defaultSettingsPath = path.join(__dirname, '..', 'default_settings.json');

	let currentSettings = require(settingsPath);

	if (cmd.list) {
		listAction();
	} else if (cmd.reset) {
		resetAction();
	} else {
		setAction();
	}

	function listAction() {
		for (let key in currentSettings) {
			console.log(`${key}: ${currentSettings[key]}`);
		}
	}

	function resetAction() {
		const defaultSettings = require(defaultSettingsPath);
		fs.writeFile(settingsPath, JSON.stringify(defaultSettings), 'utf8', err => {
			if (err) {
				console.error('Can\'t reset settings');
				console.error(err);
			} else {
				console.log('Settings restored');
			}
		});
	}

	function setAction() {
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

		fs.writeFile(settingsPath, JSON.stringify(currentSettings), 'utf8', err => {
			if (err) {
				console.error('Can\'t save settings');
			} else {
				console.log('Settings saved');
			}
		});
	}
};