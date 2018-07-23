'use strict';

class ConsoleHelper
{
	clear() {
		process.stdout.write('\x1Bc');
	}

	display(text) {
		this.clear();
		process.stdout.write(text);
	}

	log(text) {
		process.stdout.write(text + '\n');
	}
}

module.exports = ConsoleHelper;