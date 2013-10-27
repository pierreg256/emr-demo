#!/usr/bin/env node

var events = require('events');
var emitter = new events.EventEmitter();
var remaining = '';


function checkArtcile(article) {
	// Check if it is URL-decodable
	var urlDecodable = true
	try {
		article = decodeURIComponent(article);

	} catch (err) {
		//process.stderr.write('error with: '+article+'\n');
		urlDecodable = false;
	}

	if (!urlDecodable)
		return '';

	// Keep only article that begin with a Capital Letter
	reg.compile("^[A-Z](.*)$","g")
	if (!reg.test(article))
		return '';

	article = article.toLowerCase();
	// Remove any wikipedia special article
	reg.compile("(aide|discussion|discuter|discussion_modèle|cial|image|fichier|media|mediawiki|utilisateur|user|catégorie|special|Spécial|wikipedia|wikipédia)\:(.*)","g")
	if (reg.test(article))
		return '';

	// Remove any image
	reg.compile("\.(jpg|gif|png|txt|ico)", "g");
	if (reg.test(article))
		return '';

	article = article.replace(/[éèêë]/g,'e').replace(/[aáàäâ]/g,'a').replace(/[ùûü]/g, 'u').replace(/[òóôö]/g,'o').replace(/[ìïî]/g,'i').replace(/[\\]/,'').replace(/[ç]/g,'c');
	process.stderr.write("article: "+article+'\n');
	return article

}

emitter.on('lineReady', function(line){
	//process.stderr.write('line: '+line+'\n');
	var INPUT_FILE_NAME = process.env.map_input_file;
	var dateKey = INPUT_FILE_NAME.split("-")[1].substring(0,6);

	// format should be respected + Keep french articles
	reg = new RegExp("^fr (.*) ([0-9].*) ([0-9].*)$", "g");
	if (reg.test(line)) {
		fields = line.split(' ');
		article = fields[1];
		count = fields[2];

		result = checkArtcile(article);
		if (result != '')
			process.stdout.write(result + '\t' + dateKey + ' ' + count + '\n');
	}

	/*
	if (reg.test(line)) {
		reg.compile("(Aide|Discussion|Discuter|Discussion_mod%c3%a8le|cial|Image|Fichier|MediaWiki|Utilisateur|cat%c3%a9gorie|Cat%c3%a9gorie|Special|Sp%c3%a9cial|Sp%C3%A9cial|Wikipedia)\:(.*)","i");
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
	}*/
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

