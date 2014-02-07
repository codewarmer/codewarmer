angular.module('mean', ['ngCookies', 
												'ngResource', 
												'ngRoute', 
												'ngAnimate', 
												'ui.bootstrap', 
												'ui.route', 
												'angulartics', 
												'angulartics.google.analytics', 
												'mean.system', 
												'mean.articles',
												'mean.users', 
												'mean.auth', 
												'mean.comments', 
												'mean.admin', 
												'AutoFillSync', //provides sync for stored password and autofill
												'Prettify', 
												'TimeAgo' // Contains timeago filter
											 ]);

angular.module('mean.system', []);
angular.module('mean.articles', ['ngCkeditor', 'ngSanitize', 'Compile']);
angular.module('mean.users', ['vcRecaptcha']);
angular.module('mean.auth', []);
angular.module('mean.comments', ['NewLines', 'ngAnimate']);
angular.module('mean.admin', []);
