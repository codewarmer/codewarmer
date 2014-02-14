angular.module('mean.system').factory('Page', function() {
  var title = '',	description = '', keywords = '';
	return {
		getTitle: function() {
			return title || 'CodeWarmer - blog about software development and egeneering';
		},
		setTitle: function(newTitle) {
			title = newTitle + '| CodeWarmer';
		},
		getDescription: function() {
			return description || 'This blog is mainly about the web programming and related topics with many examples';
		},
		setDescription: function(newDescription) {
			description = newDescription;
		},
		getKeywords: function() {
			return keywords || 'node.js, express, mongoose, mongodb, angular, javascript';
		},
		setKeywords: function(newKeywords) {
			keywords = newKeywords;
		},
		setDefault: function() {
			title = description = keywords = '';
		}
	};
});

angular.module('mean.system').factory('Loader', function($window, $rootScope) {
	//use $script.js library that loaded to window.$script
	//$window.meanFiles - contains project files
	//$window.meanProviders - angular providers for current app
  return {
		load: function(ctrl, callback) {
			$script($window.meanFiles[ctrl], function() {
				//ma.requires.push('ngCkeditor');
				//console.log('test');
				var directive = $window.angular.module('ngCkeditor')._invokeQueue[0][2];
				$window.meanProviders.$compileProvider.directive(directive[0],directive[1]);
				callback();
				//$rootScope.$apply();
			});
		}
	};
});
