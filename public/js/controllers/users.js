angular.module('mean.users').controller('UsersController', function($scope, $routeParams, $location, $http, Global, Auth, vcRecaptchaService) {
  $scope.global = Global;
	
	$scope.user = {};

	$scope.signIn = function() {
		Auth.login($scope.user, function() {
			if($location.path() === '/signin')
				$location.path('/');
		},
		function(data,status,headers) {
			if(status === 400){
				$scope.message = data.message;
				$scope.showMessage = true;
			}
		});
	};

	$scope.signUp = function() {
		//console.log($scope.user);
		$scope.user.recaptcha = vcRecaptchaService.data();
		Auth.create($scope.user, function() {
			$location.path('/');
		},
		function(data,status,headers) {
			if(status === 400){
				console.log(data);
				$scope.errors = data.errors;
				$scope.showErrors = true;
				//Reload recaptcha
				vcRecaptchaService.reload();
			}
		});
	};
});
