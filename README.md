# pmdr

Pomodoro time tracker in your console

## Installation

via `npm`:

	npm install -g pmdr

via `git`:

	git clone git@github.com:eugenezadorin/pmdr.git
	cd pmdr
	npm install
	npm link # to use pmdr as global package

## Usage

	$ pmdr                       # just run timer
    $ pmdr run                   # does the same
    $ pmdr run "Make newsletter" # start timer and specify task name
    $ pmdr stat                  # show stats for today
    $ pmdr stat 2018-07-21       # show stats for specified day
    $ pmdr config --list         # show configuration
    $ pmdr config work_time 30   # set work_time parameter to 30 minutes
    $ pmdr config --reset        # restore current settings to defaults

## Other

License — MIT

This project maked just for fun and inspired by [tomighty](https://github.com/tomighty/tomighty).

Thanks [Freepik](http://www.freepik.com) from [flaticon.com](https://www.flaticon.com/) for tomato icon.
