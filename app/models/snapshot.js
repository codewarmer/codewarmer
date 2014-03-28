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
 * Statics
 */
SnapshotSchema.statics.load = function(path, cb) {
  this.findOne({
    path: path
  }).exec(cb);
};

mongoose.model('Snapshot', SnapshotSchema);
