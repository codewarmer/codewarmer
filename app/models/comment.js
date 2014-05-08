/**
 * Module dependencies.
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema, base = require('base-converter');

/**
 * Comment Schema
 */

var CommentSchema = new Schema({
	discussion_id: {
		type: Schema.ObjectId,
		required: true,
		index: true
	},
	parent_id: {
		type: Schema.ObjectId,
		index: true
	},
	replyTo: {
		type: String
	},
	thread: {
		type: String,
		index: true
	},
	posted: {
		type: Date,
		'default': Date.now,
		index: true
	},
	author: {
		type: Schema.ObjectId,
		required: true,
		ref: 'User'
	},
	text: {
		type: String,
		required: true
	}
});

/**
 * Validations
 */

CommentSchema.path('text').validate(function(text) {
  return text && text.length;
}, 'Comment text can not be empty');

/**
 * Pre-save hook
 */

CommentSchema.pre('save',function(next) {
	if(!this.thread){
		buildCommentThread(this,next);
	}
});

/**
 * Statics
 */

CommentSchema.statics.getCommentById = function(id, cb) {
	this.findOne({'_id': id}, '', {populate: 'author'}, cb);
};

CommentSchema.statics.getLastInThread = function(params, cb) {
	this.findOne(params, 'thread', {sort: '-thread'}, cb);
};

CommentSchema.statics.getCommentsByDiscussionId = function(id, cb) {
  this.find({discussion_id: id}).sort('-thread').populate('author', 'username').exec(cb);
};

mongoose.model('Comment', CommentSchema);

/**
 * Helper functions
 */

function buildCommentThread(comment, next) {
  var Comment = mongoose.model('Comment');
	//the comment is reply
	if(comment.parent_id){
		//find the parent comment in the thread
		Comment.getCommentById(comment.parent_id, function(err, parentComment) {
			//find the last comment in the thread
			Comment.getLastInThread({'parent_id': comment.parent_id}, function(err, lastInThread) {
				comment.replyTo = parentComment.author.username;
				//extract the current thread latest threadId
				if(lastInThread){
					var threadArr = lastInThread.thread.slice(0,-1).split('.');
					var threadId = threadArr.pop();
					comment.thread = threadArr.join('.') + '.' + createThreadId(threadId) + '/';
				}
				//the first comment in the discussion
				else{
					comment.thread = parentComment.thread.slice(0,-1) + '.' + createThreadId() + '/';
				}
				next();
			});
		});
	}
	//the comment is in the main tree
	else{
		//get the last comment thread in the disscussion
		Comment.getLastInThread({'discussion_id': comment.discussion_id}, function(err, lastInThread) {
			//not the first comment in discussion
			if(lastInThread && lastInThread.thread){
				//strip "/" from the end of the threadId and send to the creator
				comment.thread = createThreadId(lastInThread.thread.slice(0,-1))+'/';
			}
			//the first comment in the discussion
			else{
				comment.thread = createThreadId()+'/';
			}
			next();
		});
	}
}



function createThreadId(threadId) {
  threadId = threadId || '00';
	//strip the first char, convert the rest to the decimal and increment by 1
	var decimal = base._62ToDec(threadId.substr(1)) + 1;
	//decimal to the base62
	var base62 = base.decTo62(decimal);
	//take a length of the base62
	var len = base62.length;
	//create code for the leading character of thread id
	var chcode = len + "0".charCodeAt() - 1;
	//concat leading character and base62 number
	var str = String.fromCharCode(chcode)+''+base62;
	return str;
}
