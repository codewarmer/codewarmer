angular.module('mean.articles').controller('socialCtrl', function($scope, $window, $interval, $location) {
	
	$scope.zombie = $window.navigator.userAgent == 'Zombie';
	$scope.$watch('article.tags', function() {
		if($scope.article.tags)
			$scope.hashtags = $scope.article.tags.join(',');
	});
	$scope.url = $location.absUrl();
	console.log($location.absUrl());
	//Renders social buttons
  $scope.loadScripts = function() {
		//every 1000ms checks if social scripts available, renders buttons and destroys interval
		var stop = $interval(function() {
			if(gapi && FB && twttr && $scope.article.title && $scope.hashtags){
				//Google plus one
				gapi.plusone.render('gplus', {'size': 'medium'});
				//Facebook like
				FB.init({
          appId      : $window.fbkey,
          status     : true,
          xfbml      : true
        });
				// FB.ui(
				// 	{
				// 		method: 'feed',
				// 		name: $scope.article.title,
				// 		link: $scope.url,
				// 		description: $scope.article.lead,
				// 		message: ''
				// 	}
				// );
				//FB.XFBML.parse();
				//Twitter
				twttr.widgets.load()
				//Cancel of interval
				$interval.cancel(stop);
			}
		},1000);

		//Cancels interval on destroy
		$scope.$on('$destroy', function() {
			$interval.cancel(stop);
		});
	};

});
