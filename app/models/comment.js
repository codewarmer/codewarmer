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
		required: true
	},
	parent_id: {
		type: Schema.ObjectId
	},
	replyTo: {
		type: String
	},
	thread: {
		type: String
	},
	posted: {
		type: Date,
		default: Date.now
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

mongoose.model('Comment', CommentSchema);

/**
 * Helper functions
 */

function buildCommentThread(comment, next) {
  var Comment = mongoose.model('Comment');
	//console.log(comment);
	//comment is reply
	if(comment.parent_id){
		//find parent comment in thread
		Comment.findOne({'_id': comment.parent_id}, 'thread author', {populate: 'author'}, function(err, parentComment) {
			//find last comment in thread
			Comment.findOne({'parent_id': comment.parent_id}, 'thread', {sort: '-thread'}, function(err, lastInThread) {
				comment.replyTo = parentComment.author.username;
				if(lastInThread){
					var threadArr = lastInThread.thread.slice(0,-1).split('.');
					var threadId = threadArr.pop();
					comment.thread = threadArr.join('.') + '.' + createThreadId(threadId) + '/';
				}
				else{
					comment.thread = parentComment.thread.slice(0,-1) + '.' + createThreadId() + '/';
				}
				next();
			});
		});
	}
	//comment is in the main tree
	else{
		//get the last comment thread in disscussion
		Comment.findOne({'discussion_id': comment.discussion_id}, 'thread', {sort: '-thread'}, function(err, last_comment) {
			//console.log(last_comment);
			//not the first comment in discussion
			if(last_comment && last_comment.thread){
				//strip "/" from the end of the threadId and send to creator
				comment.thread = createThreadId(last_comment.thread.slice(0,-1))+'/';
			}
			//first comment in discussion
			else
				comment.thread = createThreadId()+'/';
			//console.log(comment);
			next();
		});
	}
}

function createThreadId(threadId) {
  threadId = threadId || '00';
	//strip first char, convert the rest to decimal and increment by 1
	var decimal = base._62ToDec(threadId.substr(1)) + 1;
	//decimal to base62
	var base62 = base.decTo62(decimal);
	//take a length of base62
	var len = base62.length;
	//create code for the leading character of thread id
	var chcode = len + "0".charCodeAt() - 1;
	//concat leading character and base36 number
	var str = String.fromCharCode(chcode)+''+base62;
	return str;
}
