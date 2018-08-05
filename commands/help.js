'use strict';

module.exports = function() {

console.log(`
  Examples:

    $ pmdr                       # just run timer
    $ pmdr run                   # does the same
    $ pmdr run "Make newsletter" # start timer and specify task name
    $ pmdr stat                  # show stats for today
    $ pmdr stat 2018-07-21       # show stats for specified day
    $ pmdr config --list         # show configuration
    $ pmdr config work_time 30   # set work_time parameter to 30 minutes
    $ pmdr config --reset        # restore current settings to defaults
`);

};