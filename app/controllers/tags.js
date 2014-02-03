/**
 * Controller dependencies
 */

var mongoose = require('mongoose'), Tag = mongoose.model('Tag');

/**
 * Sends all tags and amount articles in them
 */
exports.all = function(req,res) {
  Tag.find({'value':{$gt:0}}).sort('-value').exec(function(err, tags) {
		if(err)
			res.send('500');
		else
			res.jsonp(tags);
	});
};
