#!/usr/bin/env node
'use strict';

const program = require('commander');
const configCmd = require('./commands/config.js');
const runCmd = require('./commands/run.js');
const statCmd = require('./commands/stat.js');
const helpCmd = require('./commands/help.js');

program
	.name('pmdr')
	.version(require('./package.json').version)
	.description('Pomodoro time tracker in your console')
	.usage('[command]');

program.on('--help', helpCmd);

program.on('command:*', () => {
	console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
	process.exit(1);
});

program
	.command('run [task]')
	.description('Start new pomodoro cycle')
	.action(runCmd);

program
	.command('stat [date]')
	.alias('stats')
	.description('Show daily stats')
	.action(statCmd);

program
	.command('config [param] [value]')
	.option('--list', 'Show full options list')
	.option('--reset', 'Reset to defaults')
	.action(configCmd);

program.parse(process.argv);

if (program.args.length < 1) {
	runCmd();
}
