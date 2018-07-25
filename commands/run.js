'use strict';

const settings = require('../settings.json');
const Pomodoro = require('../lib/Pomodoro.js');

module.exports = function(task) {
	const pmdr = new Pomodoro(task, settings);
	pmdr.work();
};