'use strict';

var port = process.env.PORT || 3000,
env = process.env.NODE_ENV || 'development',
express = require('express'),
app = express(),
path = require('path'),
errorHandler = require('errorhandler'),
rootPath = path.normalize(__dirname);

// Expose app
exports = module.exports = app;

/***************
 * Web App 
 ***************/

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
  app.use(express.static(path.join(rootPath, 'app')));
  app.set('views', path.join(rootPath, 'app', 'views'));
} else {
  app.use(express.static(path.join(rootPath, 'build')));
  app.set('views', path.join(rootPath, 'build', 'views'));
}

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
  res.render('index', { isDevelopment: (env === 'development') });
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