#!/usr/bin/env node

var events = require('events');
var emitter = new events.EventEmitter();
var remaining = '';

emitter.on('lineReady', function(line){
	//process.stderr.write('line: '+line+'\n');
	var INPUT_FILE_NAME = process.env.map_input_file;
	var dateKey = INPUT_FILE_NAME.split("-")[1].substring(0,6);

	fields = line.split(' ');
	articleKey = fields[0]+'|'+fields[1];
	count = fields[2]
	if (articleKey.substring(0,2)=='fr')
		process.stdout.write(articleKey + '\t' + dateKey + ' ' + count + '\n')
});

// fires on every block of data read from stdin
process.stdin.on('data', function(chunk) {
	var capture = chunk.split('\n');

	for (var i=0;i<capture.length; i++) {
		if (i==0) {
			emitter.emit('lineReady',remaining + capture[i]);
		} else if (i<capture.length-1) {
			emitter.emit('lineReady',capture[i]);
		} else {
			remaining = capture[i];
		}
	}
});

// fires when stdin is completed being read
process.stdin.on('end', function() {
	emitter.emit('dataReady');
});

// set up the encoding for STDIN
process.stdin.setEncoding('utf8');

// resume STDIN - paused by default
process.stdin.resume();

