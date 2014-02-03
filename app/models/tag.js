/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var TagSchema = new Schema({
	_id: {
		type: String,
	},
	value: {
		type: Number,
		default: 1
	}
});

TagSchema.path('_id').validate(function(id) {
  return id.length;
}, 'Tag could not be empty');

mongoose.model('Tag', TagSchema);
