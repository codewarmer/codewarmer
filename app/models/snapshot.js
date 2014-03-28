/**
 * Module dependencies
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var SnapshotSchema = new Schema({
	path: String,
	date: {
		type: Date,
		default: Date.now
	},
	html: String
});

/**
 * Helpers
 */

var scriptTagRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

var stripScriptTags = function(html) {
  return html.replace(scriptTagRegex,'');
}

/**
 * Statics
 */
SnapshotSchema.statics.load = function(path, cb) {
  this.findOne({
    path: path
  }).exec(cb);
};

SnapshotSchema.statics.upsert = function(data, cb) {
  data.html = '<!DOCTYPE html>\n' + stripScriptTags(data.html);
	
	data.date = new Date();
	this.update({'path': data.path}, data, {upsert: true}, function(err) {
		if(err)
			console.log(err);
		if(cb)
			cb(err);
	});
};



mongoose.model('Snapshot', SnapshotSchema);
