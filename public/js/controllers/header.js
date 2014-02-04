angular.module('mean.system').controller('HeaderController', function ($scope, Global, $window, Auth) {
  $scope.global = Global;
	$scope.user = Auth.getCurrentUser();
	$scope.isLoggedIn = Auth.isLoggedIn;
	$scope.signOut = Auth.signOut;

  $scope.menu = [
		{
      "title": "Create New Article",
      "link": "/posts/create",
			"access": roleAccess('admin'),
    },
		{
			"title": "Admin section",
      "link": "/admin",
			"access": roleAccess('admin'),
		}];
  $scope.isCollapsed = false;
	$scope.width = $window.innerWidth;
	
	function roleAccess(role) {
		return function() {
			return Auth.checkAccess(role);
		};
	}

	$scope.toggleCollapsed = function(){
		$scope.isCollapsed = !$scope.isCollapsed;
	};

	$scope.$watch('width', function(value) {
		$scope.isCollapsed = value<768;
	});

	$scope.updateWidth = function(){
		$scope.width = $window.innerWidth;
	};

	$window.onresize = function () {
    $scope.updateWidth();
    $scope.$apply();
  };
});

angular.module('mean.system').controller('headCtrl', function($scope, Page) {
	$scope.getTitle = Page.getTitle;
	$scope.getDescription = Page.getDescription;
	$scope.getKeywords = Page.getKeywords;
});