#!/usr/bin/env node

var events = require('events');
var emitter = new events.EventEmitter();
var remaining = '';
var summary = {};

function init () {
	summary = {
		"key": "",
		"count": 0,
		//"200810": 0
	};
}

function printLine() {
	process.stdout.write(JSON.stringify(summary)+"\n");
	init();
}

emitter.on('lineReady', function(obj){
	//console.log('log: '+obj);
	var items = obj.split('\t');
	var currentKey = items[0];
	var values = items[1].split(' ');

	if (currentKey != summary.key) {
		if (currentKey != "") {
			printLine();
			summary.key = currentKey;
		}
	}

	summary.count += Number(values[1]);
	if (!summary[values[0]])
		summary[values[0]]=0;
	summary[values[0]] = (summary[values[0]] ? Number(values[1]) : summary[values[0]] + Number(values[1]));
	//log = JSON.parse(obj.split('\t')[1]);
});

emitter.on('dataReady', function(){
	printLine();
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

