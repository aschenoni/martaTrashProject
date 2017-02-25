'use strict';

var express = require('express');
var path = require('path');
var errorHandler = require('errorhandler');
var nconf = require('nconf');
var morgan = require('morgan');
/**
* Routes
*/
var locationRouter = require('./routes/location.js');
var smsRouter = require('./routes/sms.js');
var sensorRouter = require('./routes/arduino.js');

nconf.argv()
  .env()
  .file({
    file: '../config.json'
  });
var db = require('./server_modules/db.js');

var port = process.env.PORT || nconf.get('serverPort') || 8080,
env = process.env.NODE_ENV || 'development',
app = express(),
rootPath = path.normalize(__dirname);

// Expose app
exports = module.exports = app;

/***************
 * Web App 
 ***************/
app.use(morgan('tiny'));

if (env === 'development') {
  app.use(require('connect-livereload')());

  // Disable caching of scripts for easier testing
  app.use(function noCache(req, res, next) {
    if (req.url.indexOf('/js/') === 0) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
    }
    next();
  });

  app.use(express.static(path.join(rootPath, '.tmp')));
  app.use(express.static(path.join(rootPath, '../app_client')));
  app.set('views', path.join(rootPath, '../app_client', 'views'));
} else {
  app.use(express.static(path.join(rootPath, 'build')));
}

app.use('/location', locationRouter);
app.use('/delivery-receipt-webhook', smsRouter);
app.use('/sensor', sensorRouter);

/**
 * Set default view engine to jade (when using .jade files we do not need to
 * hand the extension to the render function)
 */
app.set('view engine', 'jade');

/**
 * Do not expose information about how your server is powered.
 */
app.disable('x-powered-by');

/**
 * Custom server header tag
 */
app.use(
  function(req, res, next) {
    res.header('Server', 'GAES v.1.0');
    next();
  }
);

// Add error handler
app.use(errorHandler());

/***************
 * Routing functions
 ***************/

function index(req, res) {
  res.send('../app_client/index.html');
}

function partials(req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
}

function subpartials(req, res) {
  var name = req.params.name;
  var directory = req.params.directory;
  res.render('partials/' + directory + '/' + name);
}

/*************** 
 * Routes 
 ***************/

app.get('/', index);

/**
 * Serve partials for the Angular.js app
 */
app.get('/partials/:name', partials);
app.get('/partials/:directory/:name', subpartials);

/**
 * Catch all other routes and serve index. These routes may be served by the 
 * Angular.js app
 */
app.get('*', index);

/***************
 * Server
 ***************/

app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});