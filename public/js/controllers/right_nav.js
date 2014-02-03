angular.module('mean.system').controller('rightNavCtrl', function($scope, $http, $location, $routeParams) {
  $scope.tags = {};
	getTags();
	function getTags() {
		$http.get('/tags').
			success(function(tags) {
				$scope.tags = tags;
			}).
			error(function(error) {
				console.log(error);
			});
	}

	$scope.search = $routeParams.search || '';
	
	$scope.searchSubmit = function() {
		$location.path('/search/'+$scope.search);
	};
});
