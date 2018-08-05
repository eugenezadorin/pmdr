'use strict';

const Stopwatch = require('timer-stopwatch');
const cliCursor = require('cli-cursor');
const keypress = require('keypress');
const notifier = require('node-notifier');
const path = require('path');
const ConsoleHelper = require('./ConsoleHelper.js');
const Stats = require('./Stats.js');

class Pomodoro
{
	constructor(task, settings) {
		this._task = task || 'Unnamed';
		this._settings = settings;
		this._timer = null;
		this._paused = false;
		this._workingPeriod = 0;
		this._periodType = '';
		this._console = new ConsoleHelper;
		this._initStdin();
	}

	work() {
		this._periodType = 'WORK';
		this._workingPeriod++;
		this._timer = this._initTimer(this._settings.work_time);
		this._timer.onTime(time => {
			this._console.display(
				`Pomodoro - task "${this._task}"\n\n` +
				`  Working on #${this._workingPeriod}! Time left: ${this._formatTime(time.ms)}\n\n\n` +
				this._getControlsHelp()
			);
		});

		this._timer.onDone(() => {
			Stats.increase(this._task);
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
		this._periodType = 'SHORT_REST';
		this._timer = this._initTimer(this._settings.short_rest_time);
		this._timer.onTime(time => {
			this._console.display(
				`Pomodoro - task "${this._task}"\n\n` +
				`  Short rest. Time left: ${this._formatTime(time.ms)}\n\n\n` +
				this._getControlsHelp()
			);
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
		this._periodType = 'LONG_REST';
		this._timer = this._initTimer(this._settings.long_rest_time);
		this._timer.onTime(time => {
			this._console.display(
				`Pomodoro - task "${this._task}"\n\n` +
				`  Long rest. Time left: ${this._formatTime(time.ms)}\n\n\n` +
				this._getControlsHelp()
			);
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
				this._handleSaveAndExitBtn();
			} else if (ch === 'p' && this._timer) {
				this._handlePauseBtn();
			} else if (key && key.ctrl && key.name == 'c') {
				process.exit();
			} else if (key && key.name == 'escape') {
				process.exit();
			}
		});
		cliCursor.hide();
	}

	_handleSaveAndExitBtn() {
		if (this._periodType == 'WORK') {
			Stats.increase(this._task, () => {
				process.exit();
			});
		} else {
			process.exit();
		}
	}

	_handlePauseBtn() {
		if (!this._paused) {
			this._paused = true;
			this._timer.stop();
			this._console.display(
				`Pomodoro - task "${this._task}" paused\n` +
				`Time left: ${this._formatTime(this._timer.ms)}\n\n` +
				`Press [p] again to resume`
			);
		} else {
			this._paused = false;
			this._timer.start();
		}
	}

	_formatTime(ms) {
		let sec = Math.floor(ms / 1000);
		let min = Math.floor(sec / 60);
		sec = sec - (min * 60);

		min = (min < 10) ? ('0' + min) : min;
		sec = (sec < 10) ? ('0' + sec) : sec;

		return `${min}:${sec}`;
	}

	_getControlsHelp() {
		return `Press [ q ] to finish task and save it to stats\n\n` +
			`Press [ esc ] to break task without saving\n\n` +
			`Press [ p ] to pause/resume\n\n`;
	}
}

module.exports = Pomodoro;