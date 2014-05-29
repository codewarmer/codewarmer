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
										'mean.contact',
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
angular.module('mean.contact', []);

//TODO if there will be more than one global controller move them to controllers.js 
angular.module('mean').controller('RecaptchaCtrl', function($scope, vcRecaptchaService) {
	//make vcRecaptchaService available for parent scope
	$scope.$parent.vcRecaptcha.service = vcRecaptchaService;
});
