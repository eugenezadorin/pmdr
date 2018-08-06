'use strict';

const StatsManager = require('../lib/Stats.js');

module.exports = function(date) {
	const manager = new StatsManager();
	let statsFile;

	if (date) {
		if (manager.validDate(date)) {
			statsFile = manager.makeStatsFileName(date);
		} else {
			console.error('Invalid date. Use format yyyy-mm-dd');
			process.exit();
		}
	} else {
		statsFile = manager.todayStatsFile;
	}

	manager.init(statsFile, (stats) => {
		stats = extend(stats, extended => {
			if (date) {
				console.log('Pomodoro - stats for ' + date);
			} else {
				console.log('Pomodoro - today stats');
			}
			console.log('');

			let i, j, item, line;
			let countSummary = 0, timeSummary = 0;

			for (i in extended.items) {
				item = extended.items[i];
				countSummary += item.count;
				timeSummary += item.approx_time;

				line = i + ': ';
				for (j = extended.max_task_name_len - item.key_len + 5; j--; i >= 0) {
					line += ' ';
				}
				line += item.count;
				for (j = extended.max_digits_count - item.digits_count + 1; j--; i >= 0) {
					line += ' ';
				}
				line += '(' + getPluralHours(item.approx_time) + ')';
				console.log(line);
			}
			console.log('\nSummary: ' + getPluralHours(timeSummary));
			console.log('\nPlease note that the time is calculated based on your current settings and is approximate');
		});
	});
};

function extend(stats, callback) {
	const settingsPath = '../settings.json';
	let settings = require(settingsPath);

	const extended = {
		items: {},
		max_task_name_len: 0,
		max_digits_count: 0
	};
	const sortable = [];
	let i;
	for (i in stats) {
		sortable.push([i, stats[i]]);
	}
	sortable.sort((a, b) => b[1] - a[1]);
	sortable.forEach(item => {
		if (item[0].length > extended.max_task_name_len) {
			extended.max_task_name_len = item[0].length;
		}
		let digitsCount = item[1].toString().length;
		if (digitsCount > extended.max_digits_count) {
			extended.max_digits_count = digitsCount;
		}
		extended.items[item[0]] = {
			count: item[1],
			key_len: item[0].length,
			digits_count: digitsCount,
			approx_time: getApproxTime(settings.work_time + settings.short_rest_time, item[1])
		};
	});

	callback(extended);
}

function getApproxTime(minutes, periods) {
	let hours = (minutes * periods) / 60;
	if (hours != Math.round(hours)) {
		hours = parseFloat(hours.toFixed(1));
	}
	return hours;
}

function getPluralHours(hours) {
	if (hours > 1) {
		return hours + ' hours';
	}
	return hours + ' hour';
}