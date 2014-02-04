/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
config = require('../../config/config'),
Schema = mongoose.Schema,
// textSearch = require('mongoose-text-search'),
Tag = false;


/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	slug: {
		type: String,
		index: true
	},
  created: {
    type: Date,
  default: Date.now
  },
  title: {
    type: String,
  default: '',
    trim: true
  },
	lead: {
    type: String,
  default: '',
    trim: true
  },
  content: {
    type: String,
  default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  tags: {
    type: Array,
		index: true
  },
	published: {
		type: Boolean,
		default: false
	}
});

/**
 * Plugins
 */

// ArticleSchema.plugin(textSearch);

/**
 * Indexes
 */

// ArticleSchema.index({
// 	title: 'text',
// 	lead: 'text',
// 	content: 'text'
// },{
// 	name: 'best_match_index',
// 	weights: {
// 		title: 5,
// 		lead: 4,
// 		content: 3
// 	},
// });

/**
 * Validations
 */
ArticleSchema.path('title').validate(function(title) {
  return title.length;
}, 'Title cannot be blank');

// ArticleSchema.path('tags').validate(function(tags) {
  
// });



/**
 * Pre-save hook
 */

ArticleSchema.pre('save',function(next) {
	//Save tags
	Tag = Tag || mongoose.model('Tag');
	this.tags.forEach(function(element, index, Array) {
		var newTag = new Tag({'_id': element});
		newTag.save();
	});

	//Create slug
	this.slug = Math.floor(((new Date()).getTime()/1000)) + '-' + this.title.toLowerCase().replace(/[^\w\s]+/g,'').replace(/\s+/g, '-');
  next();
});

/**
 * Statics
 */
ArticleSchema.statics.load = function(slug, cb) {
  this.findOne({
    slug: slug
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Article', ArticleSchema);
