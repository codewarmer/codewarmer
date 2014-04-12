module.exports = {
	//Development files
	development: {
		js: [
			'/lib/angular/angular.min.js',
			'/lib/angular-cookies/angular-cookies.min.js',
			'/lib/angular-resource/angular-resource.min.js',
			'/lib/angular-route/angular-route.min.js',
			'/lib/angular-sanitize/angular-sanitize.js',
			'/lib/angular-animate/angular-animate.min.js',
			'/lib/angulartics/dist/angulartics.min.js',
			'/lib/angulartics/dist/angulartics-google-analytics.min.js',


			//Recaptcha
			

			//Angular UI
			'/lib/angular-bootstrap/ui-bootstrap.min.js',
			'/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
			'/lib/angular-ui-utils/ui-utils.min.js',

			//Application Init
			'/js/rolesConfig.js',
			'/js/app.js',
			'/js/config.js',
			'/js/filters.js',
			
			//Application Directives
			'/js/directives/directives.js',

			//Application Services
			'/js/services/system_srv.js',
			'/js/services/global.js',
			'/js/services/articles.js',
			'/js/services/comments.js',
			'/js/services/auth.js',

			//Application Controllers
			'/js/controllers/articles.js',
			'/js/controllers/comments.js',
			'/js/controllers/users.js',
			'/js/controllers/index.js',
			'/js/controllers/header.js',
			'/js/controllers/right_nav.js',
			'/js/controllers/admin.js',
			'/js/controllers/password_generator.js',
			'/js/controllers/regexp_tool.js',
			//'/js/init.js',

			//Third party scripts
			'/js/analytics.js'
		],
		css: [
			'/lib/bootstrap/dist/css/bootstrap.min.css',
			'/lib/google-code-prettify/src/prettify.css',
			'/css/prettify_solarized.css',
			'/css/common.css',
			
			'/css/views/articles.css',
			'/css/animation.css',
		],
		ckeditor: ['/static_lib/ckeditor/ckeditor.js', '/lib/ng-ckeditor/ng-ckeditor.src.js'],
		prettifyToMinify: ['/lib/google-code-prettify/src/prettify.js',	'/lib/google-code-prettify/src/lang-css.js'],
		prettify: ['/js/prettify.min.js'],
		recaptcha: ['//www.google.com/recaptcha/api/js/recaptcha_ajax.js', '/lib/angular-recaptcha/release/angular-recaptcha.min.js'],
		addthis: ['//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5201de684b543d8f&async=1'],
		zeroClipboard: ['/lib/zeroclipboard/ZeroClipboard.js']
	},
	//Minified production ready files
	production: {
		js: ['/js/all.min.js'],
		css: [
			'/lib/bootstrap/dist/css/bootstrap.min.css',
			'/css/all.min.css'
		],
		ckeditor: ['/static_lib/ckeditor/ckeditor.js', '/lib/ng-ckeditor/ng-ckeditor.js'],
		prettify: ['/js/prettify.min.js'],
		recaptcha: ['//www.google.com/recaptcha/api/js/recaptcha_ajax.js', '/lib/angular-recaptcha/release/angular-recaptcha.min.js'],
		addthis: ['//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5201de684b543d8f&async=1'],
		zeroClipboard: ['/lib/ZeroClipboard.min.js']
	},
	getPaths: function(type) {
		return type ? this[process.env.NODE_ENV][type] : this[process.env.NODE_ENV];
		//return type ? this.production[type] : this.production;
	},
	relativePaths: function(type) {
		var result = [];
		$this = this;
		this.development[type].forEach(function(elt) {
			if(!$this.production[type] || $this.production[type].indexOf(elt) === -1)
				result.push('./public'+elt);
		});
		return result;
		// return this.development[type].map(function(item) {
		// 	return './public'+item;
		// });
	}
};
