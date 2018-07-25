'use strict';

const StatsManager = require('../lib/Stats.js');

module.exports = function(date) {
	const manager = new StatsManager();
	if (!date) {
		manager.init(manager.todayStatsFile, (stats) => {
			console.log('Pomodoro - today stats');
			console.log('');
			for (let i in stats) {
				console.log(i + ': ' + stats[i]);
			}
		});
	}
};