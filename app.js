/**
 * This is the app starter for the Keystone web client
 */

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var argv = require('yargs')
                //keystone service configuration args
                .config('config')
                .demand('dbHost')
                .describe('dbHost', 'Location of the database')
                .demand('dbPort')
                .describe('dbPort', 'Port of the database')
				.demand('db')
                .describe('db', 'The database to use')
				.demand('dbPhotoCollection')
                .describe('dbPhotoCollection', 'Collection in the db to use')
                .argv;
                
//make the argv of the app available globally (MAKE SURE THIS HAPPENS BEFORE we do require all of our routes below, otherwise args wont be exported when we need them)
exports.argv = argv;

var mongo = require('mongodb');
var monk = require('monk');

var dbLocation = argv.dbHost + ':' + argv.dbPort + '/' + argv.db;

var db = monk(dbLocation);

//Make our db accessible to our router; essentially every request will have the DB object on it
app.use(function(req,res,next){
    req.db = db;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

exports.app = app;
