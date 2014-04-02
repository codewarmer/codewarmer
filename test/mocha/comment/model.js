/**
 * Module dependencies
 */

var should = require('should'),
app = require('../../../server'),
mongoose = require('mongoose'),
Comment = mongoose.model('Comment'),
User = mongoose.model('User'),
Article = mongoose.model('Article');

describe('<Unit test>', function() {
  describe('Model Comment', function() {

		before(function(done) {
			user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      user.save(function(err) {
        article = new Article({
          title: 'Article Title',
          content: 'Article Content',
          user: user,
					tags: ['Tag1','Tag2'],
					published: 1
        });
				article.save(function(err, doc) {
					comment = new Comment({
						'discussion_id': article,
						'author': user,
						'text': 'First comment'
					});
					
					comment2 = new Comment({
						'discussion_id': article,
						'author': user,
						'text': 'Second comment'
					});

					comment3 = new Comment({
						'discussion_id': article,
						'author': user
					});

					done();
				});
      });
			
		});

		it('should begin with no comments', function(done) {
			Comment.find({}, function(err, comments) {
				comments.should.have.length(0);
				done();
			});
		});

		it('should save comment without error',function(done) {
			comment.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without text', function(done) {
			comment3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should generate thread where new comments above old ones', function(done) {
			comment2.save(function(err) {
				Comment.find({}, function(err, comments) {
					comments[0].thread.should.be.lessThan(comments[1].thread);
					done();
				});
			});
		});

		it('should generate thread where reply to comment has thread between parent and previous comment', function(done) {
			comment3.text = 'Third comment';
			comment3.parent_id = comment;
			comment3.save(function(err) {
				Comment.find({}, function(err, comments) {
					comments[2].thread.should.be.lessThan(comments[1].thread);
					comments[2].thread.should.be.lessThan(comments[0].thread);
					done();
				});
			});
		});

		after(function() {
			Comment.remove().exec();
			Article.remove().exec();
			User.remove().exec();
		});
	});
});
