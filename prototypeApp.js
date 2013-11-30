/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var mongoose = require('mongoose');
var nodemailer = require("nodemailer");
var fs = require('fs');
var http = require('http');
var path = require('path');

var app = express();
app.use(express.bodyParser()); // Automatically parses form data


mongoose.connect('mongodb://localhost/todo_development', function(err){
	if(!err) {
		console.log('connected to MongoDB');
	} else {
		throw err;
	}
});
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var dailyUniquePart = new Schema({
	company_id: { type: String, required: true, trim: true },
	timestamp: { type: Date, required: true, trim: true },
	user_id: { type: String, required: true, trim: true }
});

var dailyUniquePart = mongoose.model('dailyUniquePart', dailyUniquePart);

app.post('/dailyUniquePart/addParticipant', function(req, res){
	console.log(req.body);
	var dup = new dailyUniquePart(req.body);
	console.log('----------------------------------------------');
	// var object = JSON.parse(req.body);
	// Object.keys(object);

	dup.save(function(err){
		if(!err){
			console.log('Data Inserted');
			res.redirect('http://localhost/GoosiiWebsite/');
		} else {
			console.log(err);
		}
	});
	console.log("I'm Running");
	// res.jsonp("I'm running!");
});


app.get('/analytics/display', function(req, res){
	dailyUniquePart.find({}, function(err, doc){
		var test = JSON.stringify(doc);
		// res.send(test);        
		res.jsonp(doc);
		// console.log(test);
	});
});

app.get('/analytics/getUniqueDates', function(req, res){
	dailyUniquePart.find({}).sort({timestamp: -1}).distinct('timestamp', function(err, doc){
		var test = JSON.stringify(doc);
		// res.send(test);        
		res.jsonp(doc);
		// console.log(test);
	});
});

app.listen(3000);
console.log("server is running");

// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
// app.use(express.cookieParser());
// app.use(express.session({secret: "OZhCLfxlGp9TtzSXmJtq"}))
// app.use(express.favicon());
// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', routes.index);
// app.get('/tasks', function(req, res){
// 	res.send('Tasks Page');
// 	res.render('index.jade', {
// 		title: 'Goosii'
// 	});
// });
// app.get('/tasks/new', function(req, res){
// 	res.render('tasks/new.jade', {
// 		layout: false,
// 		title: 'New Task'
// 	});
// });

// app.post('/tasks', function(req, res){
// 	var task = new Task(req.body.task);
// 	task.save(function(err){
// 		if(!err){
// 			res.redirect('/tasks');
// 		} else {
// 			res.redirect('/tasks/new');
// 		}
// 	});
// });
// mongoose.connect('mongodb://localhost/todo_development', function(err){
// 	if(!err) {
// 		console.log('connected to MongoDB');
// 	} else {
// 		throw err;
// 	}
// });
// var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;

// var dailyUniquePart = new Schema({
// 	company_id: { type: String, required: true, trim: true },
// 	timestamp: { type: Date, required: true, trim: true },
// 	user_id: { type: String, required: true, trim: true }
// });

// var dailyUniquePart = mongoose.model('dailyUniquePart', dailyUniquePart);

// app.get('/', function(req, res){
// 	console.log("I'm Running");
// 	res.send("I'm running!");
// });

// app.get('/dailyUniquePart', function(req, res){
// 	dailyUniquePart.find({}, function(err,docs){
// 		res.render('dailyUniquePart/index', {
// 			title: 'Daily Unique Participants',
// 			docs: docs
// 		});
// 	});
// });

// app.post('/dailyUniquePart', function(req, res){
// 	// console.log(Object.keys(req.body.dailyUniquePart));
// 	console.log('Am I getting this?' + '\n' +  req.params.dailyUniquePart);
// 	//var dup = new dailyUniquePart(req.body.dailyUniquePart.company_id, req.body.dailyUniquePart.timestamp, req.body.dailyUniquePart.user_id);
// 	// console.log(dup);

// 	// dup.save(function(err){
// 	// 	if(!err){
// 	// 		res.redirect('/dailyUniquePart');
// 	// 	} else {
// 	// 		console.log(err);
// 	// 		res.redirect('/dailyUniquePart/new');
// 	// 	}
// 	// });
// });

// app.get('/dailyUniquePart/new', function(req, res){
// 	res.render('dailyUniquePart/new.jade', {
// 		title: 'New DUP'
// 	});
// });

// http.createServer(app).listen(3000, function(){
//   console.log('Express server listening on port ' + 3000);
// });