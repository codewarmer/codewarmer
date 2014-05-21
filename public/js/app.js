var dependencies = ['ngCookies',
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
										'mean.filters',
										'AutoFillSync', //provides sync for stored password and autofill
										'Prettify',
										'passwordGenerator',
										'ZeroClip',
										'AddThis',
										'RegexpTool'];
var mean = angular.module('mean', dependencies);

angular.module('mean.system', []);
var ma = angular.module('mean.articles', ['ngSanitize', 'Compile']);
angular.module('mean.users', []);
angular.module('mean.auth', []);
angular.module('mean.comments', ['ngAnimate']);
angular.module('mean.admin', []);
