#!/usr/bin/env node

var events = require('events');
var emitter = new events.EventEmitter();
var remaining = '';

emitter.on('lineReady', function(line){
	//process.stderr.write('line: '+line+'\n');
	var INPUT_FILE_NAME = process.env.map_input_file;
	var dateKey = INPUT_FILE_NAME.split("-")[1].substring(0,6);

	reg = new RegExp("^fr (.*) ([0-9].*) ([0-9].*)$", "g");
	if (reg.test(line)) {
		reg.compile("(Image|Fichier|MediaWiki|Utilisateur|cat%c3%a9gorie|Cat%c3%a9gorie|Special|Sp%c3%a9cial|Sp%C3%A9cial|Wikipedia)\:(.*)");
		if (!reg.test(line)) {
			fields = line.split(' ');
			count = fields[2]
			//articleKey = fields[0]+'|'+fields[1];
			
			// enlever des images
			reg.compile("(.*).(jpg|gif|png|JPG|GIF|PNG|txt|ico)", "g");
			if (!reg.test(fields[1])){
				reg.compile("^[A-Z](.*)$","g")
				if (reg.test(fields[1]))
					process.stdout.write(fields[1] + '\t' + dateKey + ' ' + count + '\n')
			}
		}
	}
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

