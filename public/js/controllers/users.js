angular.module('mean.users').controller('UsersController', function($scope,$location,Auth,Loader,Page) {
	$scope.crawler = Page.isCrawler();
	$scope.user = {};
	$scope.vcRecaptcha = {};
  $scope.errors = [];

	$scope.signIn = function() {
		Auth.login($scope.user, function() {
			if($location.path() === '/signin')
				$location.path('/');
		},
		function(data,status,headers) {
			if(status === 400){
				$scope.errors = data.errors;
			}
      else{
        $scope.errors.push({
          message: 'Unknown server error. Please try again.'
        });
      }
      $scope.showErrors = true;
		});
	};

	$scope.signUp = function() {
		$scope.user.recaptcha = $scope.vcRecaptcha.service.data();
		Auth.create($scope.user, function() {
			$location.path('/');
		},
		function(data,status,headers) {
			if(status === 400){
				$scope.errors = data.errors;
			}
      else {
        $scope.errors.push({
          message: 'Unknown server error. Please try again.'
        });
      }
      $scope.showErrors = true;
      //Reload recaptcha
      $scope.vcRecaptcha.service.reload();
		});
	};
});
