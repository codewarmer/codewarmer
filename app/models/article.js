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


/**
 * Indexes
 */


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
	//Create slug
	this.slug = Math.floor(((new Date(this.created)).getTime()/1000)) + '-' + this.title.toLowerCase().replace(/[^\w\s]+/g,'').replace(/\s+/g, '-');
  next();
});

/**
 * Post-save hook
 */

ArticleSchema.post('save', function(doc) {
  //Tag = Tag || mongoose.model('Tag');
	Article = mongoose.model('Article');
	opts = {
		map: function() {
			if(!this.tags || !this.published)
				return;
			
			for(var i in this.tags)
				emit(this.tags[i],1);
		},
		reduce: function(key,values) {
			var count = 0;
			for(var i in values)
				count += values[i];

			return count;
		},
		out: {replace: 'tags'}
	};
	
	Article.mapReduce(opts);
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
