angular.module('mean.system').controller('HeaderController', function ($scope,$window,Auth) {
	$scope.user = Auth.getCurrentUser();
	$scope.isLoggedIn = Auth.isLoggedIn;
	$scope.signOut = Auth.signOut;

  $scope.roleAccess = function(role) {
    return function() {
      return Auth.checkAccess(role);
    };
  };

  $scope.menu = [
    {
      "title": "About",
      "link": "/about",
      "access": true,
    },
		{
      "title": "Create New Article",
      "link": "/posts/create",
			"access": $scope.roleAccess('admin'),
    },
		{
			"title": "Admin section",
      "link": "/admin",
			"access": $scope.roleAccess('admin'),
		}
  ];
  $scope.isCollapsed = false;
	$scope.width = $window.innerWidth;

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

angular.module('mean.system').controller('HeadCtrl', function($scope, Page) {
	$scope.getTitle = Page.getTitle;
	$scope.getDescription = Page.getDescription;
	$scope.getKeywords = Page.getKeywords;
	$scope.getUrl = Page.getUrl;
});
