/**
 * Module dependencies
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var UrlSchema = new Schema({
	uri: String,
	date: {
		type: Date,
		default: Date.now
	},
	html: String
});

/**
 * Statics
 */
UrlSchema.statics.load = function(uri, cb) {
  this.findOne({
    uri: uri
  }).exec(cb);
};

mongoose.model('Url', UrlSchema);
