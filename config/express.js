/**
 * Module dependencies.
 */
var express = require('express'),
    expressSession = require('express-session'),
    //bodyParser = require('body-parser'),
    mongoStore = require('connect-mongo')(expressSession),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    config = require('./config'),
    path = require('path'),
    url = require('url'),
    mongoose = require('mongoose'),
    querystring = require('querystring'),
    Snapshot = mongoose.model('Snapshot');

module.exports = function(app, router, passport, db) {
  app.set('showStackError', true);    
  
  //Prettify HTML
  app.locals.pretty = true;

  //Should be placed before express.static
  app.use(require('compression')({
    // filter: function(req, res) {
    //   return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    // },
    level: 9
  }));

  //Setting the fav icon and static folder
  app.use(require('static-favicon')(__dirname + '/../public/img/icons/favicon.ico'));
  app.use(express.static(config.root + '/public'));

  //Don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
		//Morgan is the former express.logger
    app.use(require('morgan')(config.logFormat));
  }

  //Set views path, template engine and default layout
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  //Enable jsonp
  app.enable("jsonp callback");


  //cookieParser should be above session
  app.use(require('cookie-parser')());

  // request body parsing middleware should be above methodOverride
  app.use(require('body-parser')());
  //app.use(bodyParser.json());
  app.use(require('method-override')());

  //express/mongo session storage
  app.use(expressSession({
    secret: config.secret,
    store: new mongoStore({
      db: db.connection.db,
      collection: 'sessions'
    })
  }));

  //connect flash for flash messages
  app.use(flash());

  //dynamic helpers
  app.use(helpers(config.app.name));

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());

	//SEO for Angular.js
	app.use(function(req,res,next) {
		var fragment = req.query._escaped_fragment_;
		var path = req.url;
		var facebook =  /facebookexternalhit/.test(req.headers['user-agent']);
		var google = /google\.com\/\+/.test(req.headers['user-agent']);
		//Not a search bot
		if(typeof fragment === 'undefined' && !facebook && !google) {
			next();
			return;
		}
		
		//get real path if fragment presented
		if(typeof fragment !== 'undefined'){
			path = req.url.replace(/(.*)(&|\?)_escaped_fragment_=(.*)/ig, function(match, p1, p2, p3) {
				return p1 + (p3 && '#!' + querystring.unescape(p3));
			});
		}

		Snapshot.load(path, function(err, snapshot) {
			if(err || !snapshot)
				return res.send(404);
			else
				return res.send(200, snapshot.html);
		});

	});
	
	app.use(function(req,res,next) {
		var referer = req.header('Referer');
		if(referer && /\/auth\//.test(req.url) && !/\/(signup|signin)/.test(referer)){
			req.session.redirect = url.parse(referer).path;
			req.session.save();
		}
		next();
	});

  //routes should be at the last
  app.use(router);

  //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use(function(err, req, res, next) {
    //Treat as 404
    if (~err.message.indexOf('not found')) return next();

    //Log it
    console.error(err.stack);

    //Error page
    res.status(500).render('500', {
      error: err.stack
    });
  });

  //Assume 404 since no middleware responded
  app.use(function(req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });

};
