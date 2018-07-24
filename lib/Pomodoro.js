'use strict';

const Stopwatch = require('timer-stopwatch');
const cliCursor = require('cli-cursor');
const keypress = require('keypress');
const notifier = require('node-notifier');
const path = require('path');
const ConsoleHelper = require('./ConsoleHelper.js');

class Pomodoro
{
	constructor(task, settings) {
		this._task = task || 'Unnamed';
		this._settings = settings;
		this._timer = null;
		this._workingPeriod = 0;
		this._console = new ConsoleHelper;
		this._initStdin();
	}

	work() {
		this._workingPeriod++;
		this._timer = this._initTimer(this._settings.work_time);
		this._timer.onTime(time => {
			this._console.display(`Pomodoro - task "${this._task}"


  Working on #${this._workingPeriod}! Time left: ${this._formatTime(time.ms)}


Press q to finish task and save it to stats

Press esc to break task without saving
			`);
		});

		this._timer.onDone(() => {
			if (this._workingPeriod % 4 == 0) {
				this.longRest();
			} else {
				this.shortRest();
			}
		});

		notifier.notify({
			title: `Pomodoro - task "${this._task}"`,
			message: `Working on #${this._workingPeriod}`,
			icon: path.join(__dirname, '..', 'tomato.png')
		});
		this._timer.start();
	}

	shortRest() {
		this._timer = this._initTimer(this._settings.short_rest_time);
		this._timer.onTime(time => {
			this._console.display(`Pomodoro - task "${this._task}"


  Short rest. Time left: ${this._formatTime(time.ms)}


Press q to finish task and save it to stats

Press esc to break task without saving
			`);
		});

		this._timer.onDone(() => {
			this.work();
		});

		notifier.notify({
			title: `Pomodoro - task "${this._task}"`,
			message: 'Time to take a short break',
			icon: path.join(__dirname, '..', 'tomato.png')
		});
		this._timer.start();
	}

	longRest() {
		this._timer = this._initTimer(this._settings.long_rest_time);
		this._timer.onTime(time => {
			this._console.display(`Pomodoro - task "${this._task}"


  Long rest. Time left: ${this._formatTime(time.ms)}


Press q to finish task and save it to stats

Press esc to break task without saving
			`);
		});

		this._timer.onDone(() => {
			this.work();
		});

		notifier.notify({
			title: `Pomodoro - task "${this._task}"`,
			message: 'Time to take a break longer',
			icon: path.join(__dirname, '..', 'tomato.png')
		});
		this._timer.start();
	}

	_initTimer(minutes) {
		return new Stopwatch(minutes * 60 * 1000, { refreshRateMS: 1000 });
	}

	_initStdin() {
		keypress(process.stdin);
		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		process.stdin.on('keypress', (ch, key) => {
			if (ch === 'q' && this._timer) {
				this._timer.stop();
			} else if (key && key.ctrl && key.name == 'c') {
				process.exit();
			} else if (key && key.name == 'escape') {
				process.exit();
			}
		});
		cliCursor.hide();
	}

	_formatTime(ms) {
		let sec = Math.floor(ms / 1000);
		let min = Math.floor(sec / 60);
		sec = sec - (min * 60);

		min = (min < 10) ? ('0' + min) : min;
		sec = (sec < 10) ? ('0' + sec) : sec;

		return `${min}:${sec}`;
	}
}

module.exports = Pomodoro;