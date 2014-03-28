angular.module('mean.admin').controller('adminCtrl', function($scope, $http) {
  $scope.snapshots = [
		{path: 'asdasd', date: new Date()}
	];
	getSnapshots();

	$scope.refreshAll = function() {
		//console.log('refeshAll');
		$http.put('/admin/snapshots').
			success(function(snapshots) {
				$scope.snapshots = snapshots;
			});
	};

	$scope.refreshSnapshot = function(id) {
		$http.post('/admin/snapshots/'+$scope.snapshots[id]._id).
			success(function(snapshot) {
				$scope.snapshots[id].date = snapshot.date;
			});
	};

	$scope.deleteSnapshot = function(id) {
		$http.delete('/admin/snapshots/'+$scope.snapshots[id]._id).
			success(function(snapshot) {
				$scope.snapshots.splice(id,1);
			});
	};
	
	$scope.addNewSnapshot = function() {
		$http.post('/admin/snapshots', {'path': $scope.newSnapshot}).
			success(function(snapshot) {
				$scope.newSnapshot = '';
				for(var i=0,el; el = $scope.snapshots[i]; i++){
					if(el.uri == snapshot.uri){
						el.date = snapshot.date;
						return;
					}
				}
				$scope.snapshots.push(snapshot);
			});
	};

	function getSnapshots() {
		$http.get('/admin/snapshots')
		.success(function(snapshots) {
			$scope.snapshots = snapshots;
		});
	}
});
