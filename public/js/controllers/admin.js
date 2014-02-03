angular.module('mean.admin').controller('adminCtrl', function($scope, $http) {
  $scope.urls = [
		{url: 'asdasd', date: new Date()}
	];
	getUrls();

	$scope.refreshAll = function() {
		console.log('test');
		$http.post('/admin/urls', {refreshAll: true}).
			success(function(urls) {
				$scope.urls = urls;
			});
	};

	$scope.refreshUrl = function(id) {
		$http.post('/admin/urls/'+$scope.urls[id]._id, $scope.urls[id]).
			success(function(url) {
				$scope.urls[id].date = url.date;
			});
	};

	function getUrls() {
		$http.get('/admin/urls')
		.success(function(urls) {
			$scope.urls = urls;
		});
	}
});
