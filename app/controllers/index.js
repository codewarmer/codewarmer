/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    files = require('../../config/files');


exports.render = function(req, res) {
	var production = process.env.NODE_ENV == 'production' || false;
  res.render('index', {
    'user': req.user ? JSON.stringify(req.user) : "null",
		'production': production,
		'jsFiles': production ? JSON.stringify(files.getPaths('js')) : files.getPaths('js'),
		'cssFiles': files.getPaths('css'),
		'allFiles': JSON.stringify(files.getPaths())
  });
};
