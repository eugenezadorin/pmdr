'use strict';

const logUpdate = require('log-update');

class ConsoleHelper
{
	clear() {
		process.stdout.write('\x1Bc');
	}

	display(text) {
		logUpdate(text);
	}

	log(text) {
		process.stdout.write(text + '\n');
	}
}

module.exports = ConsoleHelper;