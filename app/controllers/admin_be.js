var mongoose = require('mongoose'), url_model = mongoose.model('Url'), crawler = require('../../config/zombie');

exports.getUrl = function(req,res,next,id) {
  url_model.findOne({'_id': id}, function(err,url) {
		if(err) return next(err);
		if(!url) return next(new Error('Unable to load URL'));
		req.urlDoc = url;
		next();
	});
};

exports.allUrls = function(req,res) {
  url_model.find().sort('url').exec(function(err, urls) {
		if(err)
			return res.send(500);
		else
			return res.jsonp(urls);
	});
};

exports.refreshAllUrls = function(req,res) {
  crawler.crawlAll(function(err) {
		//500 if crawler error
		if(err)	return res.send(500);
		url_model.find().sort('url').exec(function(err, urls) {
			//500 if DB error
			if(err) return res.send(500);
			//return urls
			return res.jsonp(urls);
		});
	});
};

exports.refreshUrl = function(req,res) {
  crawler.crawlOne(req.urlDoc.uri, function(err) {
		if(err)	return res.send(500);
		url_model.findOne({'_id': req.urlDoc._id}, function(err, url) {
			if(err)
				res.send(500);
			else
				return res.jsonp(url);
		});
	});
};

exports.addUrl = function(req,res) {
  crawler.crawlOne(req.body.path, function(err) {
		if(err)	return res.send(500);
		url_model.findOne({'uri': req.body.path}, function(err, url) {
			if(err)
				res.send(500);
			else
				return res.jsonp(url);
		});
	});
};

exports.deleteUrl = function(req,res) {
  req.urlDoc.remove(function(err) {
		if(err)
			return res.send(500);
		else
			return res.send(200);
	});
};
