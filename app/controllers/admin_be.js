var mongoose = require('mongoose'), Snapshot = mongoose.model('Snapshot'), crawler = require('../../utils/phantom');

exports.getSnapshot = function(req,res,next,id) {
  Snapshot.findOne({'_id': id}, function(err,snapshot) {
		if(err) return next(err);
		if(!snapshot) return next(new Error('Unable to load Snapshot'));
		req.snapshot = snapshot;
		next();
	});
};

exports.allSnapshots = function(req,res) {
  Snapshot.find().sort('path').exec(function(err, snapshots) {
		if(err)
			return res.send(500);
		else
			return res.jsonp(snapshots);
	});
};

exports.refreshAllSnapshots = function(req,res) {
  crawler.crawlAll(function(err) {
		//500 if crawler error
		if(err)	return res.send(500);
		Snapshot.find().sort('path').exec(function(err, snapshots) {
			//500 if DB error
			if(err) return res.send(500);
			//return Snapshots
			return res.jsonp(snapshots);
		});
	});
};

exports.refreshSnapshot = function(req,res) {
  crawler.crawlOne(req.snapshot.path, function(err) {
		if(err)	return res.send(500);
		Snapshot.findOne({'_id': req.snapshot._id}, function(err, snapshot) {
			if(err)
				res.send(500);
			else
				return res.jsonp(snapshot);
		});
	});
};

exports.addSnapshot = function(req,res) {
  crawler.crawlOne(req.body.path, function(err) {
		if(err)	return res.send(500);
		Snapshot.findOne({'path': req.body.path}, function(err, snapshot) {
			if(err)
				res.send(500);
			else
				return res.jsonp(snapshot);
		});
	});
};

exports.deleteSnapshot = function(req,res) {
  req.snapshot.remove(function(err) {
		if(err)
			return res.send(500);
		else
			return res.send(200);
	});
};
