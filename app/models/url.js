/**
 * Module dependencies
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var UrlSchema = new Schema({
	url: String,
	date: {
		type: Date,
		default: Date.now
	}
});


mongoose.model('Url', UrlSchema);
