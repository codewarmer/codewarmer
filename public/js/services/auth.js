angular.module('mean.auth').factory('Auth',function($http, $cookieStore, $window, $location) {
	'use strict';
  var currentUser = {};
	var rolesConfig = $window.rolesConfig;
	if($window.user)
		angular.copy($window.user, currentUser);

	return {
		//create user
		create: function(user, success, error) {
			$http.post('/users', user).success(function(user) {
				angular.copy(user, currentUser);
				success(user);
			}).error(error);
		},
		//login user
		login: function(user, success, error) {
			$http.post('/users/session', user).success(function(user) {
				//console.log(user);
				angular.copy(user, currentUser);
				success(user);
			}).error(error);
		},
		signOut: function() {
			$http.get('/signout').
				success(function() {
					currentUser = {};
					$location.path('/');
				}).
				error(function(data,status) {
					console.log(data);
				});
		},
		//current user
		getCurrentUser: function() {
			return currentUser;
		},
		//Check is user logged in
		isLoggedIn: function() {
			return !!currentUser.name;
		},
		checkAccess: function(access) {
			return rolesConfig.access[access].indexOf(currentUser.role) !== -1;
		}
		};
});
