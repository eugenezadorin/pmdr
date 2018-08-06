'use strict';

const fs = require('fs');
const path = require('path');

class Stats
{
	constructor() {
		this.todayStatsFile = this.makeStatsFileName( this._today() );
	}

	static increase(task, callback)
	{
		let self = new Stats();
		self.init(self.todayStatsFile, stats => {
			if (stats[task]) {
				stats[task]++;
			} else {
				stats[task] = 1;
			}
			self.save(self.todayStatsFile, stats, callback);
		});
	}

	init(file, callback) {
		fs.readFile(file, (err, data) => {
			let stats;
			if (err) {
				stats = {};
			} else {
				try {
					stats = JSON.parse(data);
				} catch (e) {
					stats = {};
				}
			}
			callback(stats);
		});
	}

	save(file, stats, callback) {
		fs.writeFile(file, JSON.stringify(stats), 'utf8', err => {
			if (callback) {
				callback(err);
			}
		});
	}

	validDate(str) {
		const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (match) {
			const date = new Date(str);
			return date instanceof Date && !isNaN(date);
		}
		return false;
	}

	makeStatsFileName(date) {
		return path.join(__dirname, '..', 'stats', date + '.json');
	}

	_today() {
		const today = new Date();
		const year = today.getFullYear();

		let month = today.getMonth() + 1;
		month =  month < 10 ? '0' + month : month;

		let day = today.getDate();
		day = day < 10 ? '0' + day : day;

		return year + '-' + month + '-' + day;
	}
}

module.exports = Stats;