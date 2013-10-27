#!/usr/bin/env node

var events = require('events');
var emitter = new events.EventEmitter();
var remaining = '';
var summary = {};

var entetes = [
	"200810",
	"200811",
	"200812",
	"200901",
	"200902",
	"200903",
	"200904",
	"200905",
	"200906",
	"200907",
	"200908",
	"200909",
	"200910",
	"200911",
	"200912",
	"201001",
	"201002",
];

function init () {
	summary = {
		"key": "",
		"count": 0,
	};
	for (i=0; i<entetes.length; i++) {
		summary[entetes[i]] = 0;
	}

}


function printLine() {
	if (summary.key == undefined) {
		init();
		return;
	}
	var unescaped = summary.key;
	try {
		unescaped = decodeURIComponent(summary.key);
		summary.key = unescaped;
		//process.stdout.write(JSON.stringify(summary)+"\n");
		process.stdout.write(summary.key+'\t');
		for (i=0; i<entetes.length; i++) {
			process.stdout.write(summary[entetes[i]]+'\t');
		}
		process.stdout.write(summary.count+'\n');
	} catch (err) {
	}
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
	//summary[values[0]] = (summary[values[0]] ? Number(values[1]) : summary[values[0]] + Number(values[1]));
	summary[values[0]] += Number(values[1]);
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

