var Auth = require('../app/controllers/auth');

module.exports = function(router, passport) {
  //User Routes
  var users = require('../app/controllers/users');
  //router.get('/signin', users.signin);
  //router.get('/signup', users.signup);
  router.get('/signout', users.signout);
  router.get('/users/me', users.me);

  //Setting up the users api
  //router.post('/users', users.create);
	router.post('/users', Auth.create);

  //Setting the local strategy route
  // router.post('/users/session', passport.authenticate('local', {
  //     failureRedirect: '/signin',
  //     failureFlash: true
  // }), users.session);

	router.post('/users/session', Auth.login);

  //Setting the FACEBOOK oauth routes
  router.route('/auth/facebook')
		.get(passport.authenticate('facebook', {
			scope: ['email', 'user_about_me'],
			failureRedirect: '/signin'
		}));


  router.route('/auth/facebook/callback')
		.get(passport.authenticate('facebook', {failureRedirect: '/signin'}))
		.get(users.authCallback);

  //Setting the GITHUB oauth routes
  router.route('/auth/github')
		.get(passport.authenticate('github', {failureRedirect: '/signin'}));


  router.route('/auth/github/callback')
		.get(passport.authenticate('github', {failureRedirect: '/signin'}))
		.get(users.authCallback);

  //Setting the TWITTER oauth routes
  router.route('/auth/twitter')
		.get(passport.authenticate('twitter', {failureRedirect: '/signin'}));


  router.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {failureRedirect: '/signin'}))
		.get(users.authCallback);

  //Setting the GOOGLE oauth routes
  router.route('/auth/google')
		.get(passport.authenticate('google', {
			failureRedirect: '/signin',
			scope: [
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email'
			]
		}));


  router.route('/auth/google/callback')
		.get(passport.authenticate('google', {failureRedirect: '/signin'}))
		.get(users.authCallback);

  //Finish with setting up the userId param
  router.param('userId', users.user);

  //Article Routes
  var articles = require('../app/controllers/articles');
  router.route('/articles')
		.get(articles.all)
		.post(Auth.checkAccess('admin'), articles.create);

  router.route('/articles/:slug')
		.get(articles.accessUnpublished)
		.get(articles.show)
		.put(Auth.checkAccess('admin'))
		.put(articles.update)
		.delete(Auth.checkAccess('admin'))
		.delete(articles.destroy);

  //Finish with setting up the Slug param
  router.param('slug', articles.article);
	
	//Comment routes
	var comments = require('../app/controllers/comments');
	router.route('/comments')
		.get(Auth.checkAccess('admin'))
		.get(comments.all)
		.post(Auth.checkAccess('auth'))
		.post(comments.create);

	router.route('/comments/:commentId')
		.put(Auth.checkAccess('admin'))
		.put(comments.update)
		.delete(Auth.checkAccess('admin'))
		.delete(comments.remove);

	router.get('/comments/discussion/:discussionId', comments.commentsByDiscussion);

	//Tags
	var tags = require('../app/controllers/tags');
	router.get('/tags', tags.all);

	//Admin
	var admin = require('../app/controllers/admin_be');

	router.route('/admin/urls')
		.get(Auth.checkAccess('admin'))
		.get(admin.allUrls)
		.post(Auth.checkAccess('admin'))
		.post(admin.refreshAllUrls);

	router.route('/admin/urls/:urlId')
		.post(Auth.checkAccess('admin'))
		.post(admin.refreshUrl);

	router.param('urlId', admin.getUrl);

  //Return angular.js app index page
  var index = require('../app/controllers/index');
  router.get('*', index.render);

};
