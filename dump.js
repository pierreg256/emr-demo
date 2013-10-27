#!/usr/bin/env node

var mysql      = require('mysql');
var fs         = require('fs');
var connection = mysql.createConnection({
  host     : 'mydbinstance.ccwz5h4hlacu.eu-west-1.rds.amazonaws.com',
  user     : 'awsuser',
  password : 'mypassword',
  database : 'mydb'
});

fs.readdir('.', function(err, files){
	if (!err) {
		connection.connect();
		for (i=0; i<files.length; i++) {
			file = files[i];
			if (file.substring(0,4)=='part'){
				console.log('handling: '+file);
				var buf = fs.readFileSync(file,{encoding:"utf8"});
				var lines = buf.split('\n');
				for (j=0;j<lines.length;j++){
					connection.query('select * from monthly_timeline', function(err, rows, fields) {
						if (err) {
							console.log("Error: " + err);
						} else {
							console.log('ok\n');
						}
					});
				}
			}
		}
	}
});

