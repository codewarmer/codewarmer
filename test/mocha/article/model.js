/**
 * Module dependencies.
 */
var should = require('should'),
app = require('../../../server'),
mongoose = require('mongoose'),
User = mongoose.model('User'),
Article = mongoose.model('Article'),
Tag = mongoose.model('Tag');

//Globals
var user;
var article;

//The tests
describe('<Unit Test>', function() {
  describe('Model Article:', function() {
    beforeEach(function(done) {
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
					tags: ['Tag1','Tag2']
        });

        done();
      });
    });

    describe('Method Save', function() {
      it('should be able to save without problems', function(done) {
        return article.save(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without title', function(done) {
        article.title = '';
				
        return article.save(function(err) {
          should.exist(err);
          done();
        });
      });

			it('shuld have a slug after get saved', function(done) {
				return Article.find({},function(err,articles) {
					should.exist(articles[0].slug);
					done();
				});
			});

			//@TODO: find a way to test mapreduce for tags
			// it('should add tags to tags collection', function(done) {
			// 	this.timeout(10000);
			// 	return setTimeout(function() {
			// 		Article.find({},function(err,articles) {
			// 			console.log(articles);
			// 		});
			// 		Tag.find({},function(err, tags) {
			// 			should.not.exist(err);
			// 			console.log(tags);
			// 			should.exist(tags);
			// 			tags.length.should.equal(2);
			// 			done();
			// 		});
			// 	},9000)
			// });
    });

    afterEach(function(done) {
      Article.remove({});
      User.remove({});
      done();
    });
    after(function(done) {
      Article.remove().exec();
      User.remove().exec();
      done();
    });
  });
});
