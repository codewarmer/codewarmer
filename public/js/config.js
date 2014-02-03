//Setting up route
angular.module('mean').config(
  function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.
      when('/tags/:tags', {
        templateUrl: '/views/articles/list.html',
      }).
      when('/posts/create', {
        templateUrl: '/views/articles/edit.html',
				access: 'admin'
      }).
      when('/posts/:slug/edit', {
        templateUrl: '/views/articles/edit.html',
				access: 'admin'
      }).
      when('/posts/:slug', {
        templateUrl: '/views/articles/view.html',
      }).
			when('/search/:search', {
				templateUrl: '/views/articles/list.html',
			}).
			when('/signin', {
        templateUrl: '/views/users/signin.html'
      }).
			when('/signup', {
        templateUrl: '/views/users/signup.html'
      }).
      when('/', {
        templateUrl: '/views/articles/list.html'
      }).
			when('/admin', {
        templateUrl: '/views/admin/adm_index.html',
				access: 'admin'
      }).
      otherwise({
        redirectTo: '/'
      });

		$httpProvider.interceptors.push(function($q, $location) {
			return {
				'responseError': function(response) {
					if(response.status === 401 || response.status === 403){
						$location.path('/signin');
						return $q.reject(response);
					}
					else
						return $q.reject(response);
				}
			};
		});
  }
).run(function($rootScope, $location, $http, Auth) {
	//Check access parameter for path
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
		$rootScope.error = null;
		if(next.access && !Auth.checkAccess(next.access))
			Auth.isLoggedIn() ? $location.path('/') : $location.path('/signin');
	});
});

//Setting HTML5 Location Mode
angular.module('mean').config(function($locationProvider) {
  $locationProvider.hashPrefix("!");
	$locationProvider.html5Mode(true);
});
