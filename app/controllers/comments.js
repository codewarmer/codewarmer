/**
 * Controller dependencies
 */

var mongoose = require('mongoose'), Comment = mongoose.model('Comment');

exports.create = function(req,res) {
  var comment = new Comment(req.body);
	comment.author = req.user;
	
	comment.save(function(err) {
		if(err){
			return res.send('500');
		}
		else{
			res.jsonp(comment);
		}
	});
};

exports.all = function(req,res) {
  
};

exports.commentsByDiscussion = function(req,res) {
  Comment.find({discussion_id: req.params.discussionId}).sort('-thread').populate('author', 'username').exec(function(err, comments) {
		if(err){
			return res.send('500');
		}
		else{
			res.jsonp(comments);
		}
	});
};

exports.update = function(req,res) {
  
};

exports.remove = function(req,res) {
  
};
