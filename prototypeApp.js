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

// Collections 

var firstTimeCheckIns = new Schema({
	companyId: { type: String },
	timestamp: { type: Number },
	userId: { type: String },
});
var firstTimeCheckIns = mongoose.model('firstTimeCheckIn', firstTimeCheckIns);


var dailyUniquePart = new Schema({
	company_id: { type: String, required: true, trim: true },
	timestamp: { type: Date, required: true, trim: true },
	user_id: { type: String, required: true, trim: true }
});
var dailyUniquePart = mongoose.model('dailyUniquePart', dailyUniquePart);


var user = new Schema({
	ad_identifier: { type: String },
	birthday: { type: Date },
	contests: [{ companyId: String, participationCount: Number}],
	created: { created: Number },
	email: { type: String },
	firstName: { type: String },
	fulfillments: { type: Array },
	identifier: { type: String },
	lastName: { type: String },
	lastLogin: { type: Number },
	newsURL: { type: String },
	phoneNumber: { type: String },
	posts: { type: Array },
	pushIdentifer: { type: String },
	rewards: { type: Array },
});
var user = mongoose.model('user', user);

var companies = new Schema({
	address: { type: String },
	contest: { votes: Date, jobId: String, mobileBackgroundImage: String, participationPost: String, password: String, post: String, prize: String, prizeImg: String, startDate: Date, endDate: Date, website: String }, 
	coupon: { total: Number },
	latitude: { type: Number },
	loc: { latitude: Number, longitude: Number },
	longitude: { type: Number },
	name: { type: String },
	newsURL: { type: String },
	participants: [{ userId: String, pushIdentifier: String}],
	prize: { type: String },
	prizeImg: { type: String },
	telephone: { type: Number },
});
var companies = mongoose.model('companies', companies);

// End Collections


app.post('/dailyUniquePart/addParticipant', function(req, res){
	console.log(req.body);
	var dup = new dailyUniquePart(req.body);

	dup.save(function(err){
		if(!err){
			console.log('Data Inserted');
			res.redirect('http://localhost/GoosiiWebsite/');
		} else {
			console.log(err);
		}
	});
});


app.get('/analytics/getCompanies', function(req, res){
	companies.find({}, '_id name', function(err, doc){
		var test = JSON.stringify(doc);
		// res.send(test);        
		res.jsonp(doc);
		// console.log(test);
	});
});


app.get('/analytics/display/:companyId', function(req, res){
	firstTimeCheckIns.find({companyId: req.params.companyId}, function(err, doc){
		var test = JSON.stringify(doc);
		// res.send(test);        
		res.jsonp(doc);
		// console.log(test);
	});
});


app.get('/analytics/displayInRange/:companyId/:startDate/:endDate', function(req, res){
	firstTimeCheckIns.find({companyId: req.params.companyId, "timestamp" : {$gt: req.params.startDate, $lt: req.params.endDate}}), function(err, doc){
		var test = JSON.stringify(doc);

		console.log(doc);
		// res.send(test);        
		res.jsonp(doc);
		// console.log(test);
	});
});


// We only want information from the past seven days. 
var sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 40);
sevenDaysAgo.setHours(0);
sevenDaysAgo.setMinutes(0);
sevenDaysAgo.setSeconds(0);
sevenDaysAgo.setMilliseconds(0);

app.get('/analytics/getUniqueDates/:companyId', function(req, res){
	// console.log(Date.UTC(sevenDaysAgo.getFullYear(),sevenDaysAgo.getMonth(),sevenDaysAgo.getDate()));
	sevenDaysAgo_milli = Date.UTC(sevenDaysAgo.getFullYear(),sevenDaysAgo.getMonth(),sevenDaysAgo.getDate());
	// console.log(typeof sevenDaysAgo_milli);
	console.log(req.params.companyId + ' - ' + sevenDaysAgo_milli);
	// firstTimeCheckIns.find({}, function(err, doc){
	// 	console.log(doc);
	// 	var test = JSON.stringify(doc);
	// 	res.jsonp(doc);
	// });
	firstTimeCheckIns.find({companyId: req.params.companyId}).where('timestamp').gte(sevenDaysAgo_milli).sort({timestamp: -1}).distinct('timestamp', function(err, doc){
		console.log(doc);
		var test = JSON.stringify(doc);
		res.jsonp(doc);
	});
});


// app.get('/analytics/getUniqueDates/:companyId', function(req, res){
// 	dailyUniquePart.find({company_id: req.params.companyId}).where('timestamp').gt('2013-12-07T00:00:00.000Z').sort({timestamp: -1}).distinct('timestamp', function(err, doc){
		
// 		console.log('XXXXXXXXXX' + doc);

// 		var test = JSON.stringify(doc);
// 		// res.send(test);        
// 		res.jsonp(doc);
// 		// console.log(test);
// 	});
// });

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