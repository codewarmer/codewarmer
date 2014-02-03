/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    _ = require('lodash'),
    Auth = require('./auth');


/**
 * Find article by id
 */
exports.article = function(req, res, next, slug) {
    Article.load(slug, function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + slug));
        req.article = article;
        next();
    });
};

/**
 * Create a article
 */
exports.create = function(req, res) {
    var article = new Article(req.body);
    article.user = req.user;

    article.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                article: article
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Update a article
 */
exports.update = function(req, res) {
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function(err) {
        res.jsonp(article);
    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var article = req.article;

    article.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
	var queryParams = {};

	if(req.query.search){
		var search = new RegExp(req.query.search,'i');
		queryParams = {$or: [{title: search}, {lead: search}, {content: search}]};
	}
	else
		queryParams = req.query;

	if(!Auth.hasAccess('admin', req))
		queryParams.published = true;

  Article.find(queryParams).sort('-created').populate('user', 'name username').exec(function(err, articles) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(articles);
    }
  });
};

/**
 * Check access if unpublished middleware
 */

exports.accessUnpublished = function(req,res,next) {
  if(!req.article.published && !Auth.hasAccess('admin', req))
		res.send(403);
	else
		next();
};
