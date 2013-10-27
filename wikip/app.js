var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'mydbinstance.ccwz5h4hlacu.eu-west-1.rds.amazonaws.com',
  user     : 'awsuser',
  password : 'mypassword',
  database : 'mydb'
});
connection.connect();

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
	if (req.query.article){
		console.log('looking for: '+req.query.article);
		connection.query('select * from monthly_timeline where article ="'+req.query.article+'"', function(err, rows, fields) {
			if (err) {
				console.log(util.inspect(err));
				res.render('index', {error:err, "top10":top10});
			} else {
				console.log('Found: ' + util.inspect(rows[0]));
				connection.query('select * from monthly_timeline where total_count <'+rows[0].total_count+' order by total_count desc LIMIT 9', function(err2, rows2, fields2) {
					if (err2) {
						console.log(util.inspect(err2));
						res.render('index', {error:err, "top10":top10});
					} else {
					  	var result=[];
					  	result.push(rows[0]);
					  	for (i=0; i<rows2.length;i++){
					  		result.push(rows2[i]);
					  	}
					  	res.render('index', {"error":undefined, "top10":result});
					}
				});
			}
		});
	} else {
		connection.query('select * from monthly_timeline order by total_count desc limit 10;', function(err, rows, fields){
			if (err) {
				top10=[];
				res.render('index', {error:err, "top10":top10});
			} else {
				top10=rows;
				res.render('index', { "error":undefined, "top10": top10 });
			}
		});

	}
});

app.post('/data', function(req, res){
	filtre = req.body.query;

	if (filtre) {
		connection.query('SELECT article  FROM monthly_timeline WHERE article LIKE \'%'+filtre+'%\' LIMIT 10', function(err, rows, fields) {
		  if (err) {
		  	console.log(util.inspect(err));
		  	res.send(500);
		  } else {
		  	var result=[];
		  	for (i=0; i<rows.length;i++){
		  		result.push(rows[i].article);
		  	}
			res.send(200,result);
		  }

		});
	} else {
		res.send(200,[]);
	}
	console.log(util.inspect(req.body));
});

var top10 = [];
connection.query('select * from monthly_timeline order by total_count desc limit 10;', function(err, rows, fields){
	if (err) {
		top10=[];
	} else {
		top10=rows;
		//console.log(util.inspect(top10));
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
