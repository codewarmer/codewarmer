angular.module('mean.admin').controller('adminCtrl', function($scope, $http) {
  $scope.urls = [
		{uri: 'asdasd', date: new Date()}
	];
	getUrls();

	$scope.refreshAll = function() {
		//console.log('refeshAll');
		$http.put('/admin/urls').
			success(function(urls) {
				$scope.urls = urls;
			});
	};

	$scope.refreshUrl = function(id) {
		$http.post('/admin/urls/'+$scope.urls[id]._id).
			success(function(url) {
				$scope.urls[id].date = url.date;
			});
	};

	$scope.deleteUrl = function(id) {
		$http.delete('/admin/urls/'+$scope.urls[id]._id).
			success(function(url) {
				$scope.urls.splice(id,1);
			});
	};
	
	$scope.addNewUrl = function() {
		$http.post('/admin/urls', {'path': $scope.newUrl}).
			success(function(url) {
				$scope.newUrl = '';
				for(var i=0,el; el = $scope.urls[i]; i++){
					if(el.uri == url.uri){
						el.date = url.date;
						return;
					}
				}
				$scope.urls.push(url);
			});
	};

	function getUrls() {
		$http.get('/admin/urls')
		.success(function(urls) {
			$scope.urls = urls;
		});
	}
});
