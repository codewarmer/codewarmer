var Auth = require('../app/controllers/auth');

module.exports = function(app, passport) {
  //User Routes
  var users = require('../app/controllers/users');
  //app.get('/signin', users.signin);
  //app.get('/signup', users.signup);
  app.get('/signout', users.signout);
  app.get('/users/me', users.me);

  //Setting up the users api
  //app.post('/users', users.create);
	app.post('/users', Auth.create);

  //Setting the local strategy route
  // app.post('/users/session', passport.authenticate('local', {
  //     failureRedirect: '/signin',
  //     failureFlash: true
  // }), users.session);

	app.post('/users/session', Auth.login);

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Finish with setting up the userId param
  app.param('userId', users.user);

  //Article Routes
  var articles = require('../app/controllers/articles');
  app.get('/articles', articles.all);
  app.post('/articles', Auth.checkAccess('admin'), articles.create);
  app.get('/articles/:slug', articles.accessUnpublished, articles.show);
  app.put('/articles/:slug', Auth.checkAccess('admin'), articles.update);
  app.del('/articles/:slug', Auth.checkAccess('admin'), articles.destroy);

  //Finish with setting up the articleId param
  app.param('slug', articles.article);
	
	//Comment routes
	var comments = require('../app/controllers/comments');
	app.get('/comments', Auth.checkAccess('admin'), comments.all);
	app.post('/comments', Auth.checkAccess('auth'), comments.create);
	app.get('/comments/discussion/:discussionId', comments.commentsByDiscussion);
	app.put('/comments/:commentId', Auth.checkAccess('admin'), comments.update);
	app.del('/comments/:commentId', Auth.checkAccess('admin'), comments.remove);

	//Tags
	var tags = require('../app/controllers/tags');
	app.get('/tags', tags.all);

	//Admin
	var admin = require('../app/controllers/admin_be');
	app.get('/admin/urls', Auth.checkAccess('admin'), admin.allUrls);
	app.post('/admin/urls', Auth.checkAccess('admin'), admin.refreshAllUrls);
	app.post('/admin/urls/:urlId', Auth.checkAccess('admin'), admin.refreshUrl);

	app.param('urlId', admin.getUrl);

  //Return angular.js app index page
  var index = require('../app/controllers/index');
  app.get('*', index.render);

};
