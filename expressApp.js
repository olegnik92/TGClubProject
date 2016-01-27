/**
 * Created by OLEG on 17.01.2016.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('./services/auth').instance;
var debug = require('debug')('tgc:expressApp');



var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', function(req, res){
	if(!req.body.login || !req.body.password)
		return;

	auth.login(req.body.login, req.body.password)
		.then((user) => {
			res.status(200).send(user);
		}, (error) =>{
			res.status(403).send({error: error});
		});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//	app.use(function(err, req, res, next) {
//		res.status(err.status || 500);
//		res.render('error', {
//			message: err.message,
//			error: err
//		});
//	});
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//	res.status(err.status || 500);
//	res.render('error', {
//		message: err.message,
//		error: {}
//	});
//});


module.exports = app;
