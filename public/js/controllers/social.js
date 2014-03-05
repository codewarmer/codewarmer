angular.module('mean.articles').controller('socialCtrl', function($scope, $window, $interval, $location) {
	
	$scope.zombie = $window.navigator.userAgent == 'Zombie';
	$scope.$watch('article.tags', function() {
		if($scope.article.tags)
			$scope.hashtags = $scope.article.tags.join(',');
	});
	$scope.url = $location.absUrl();

	//Renders social buttons
  $scope.loadScripts = function() {
		//every 1000ms checks if social scripts available, renders buttons and destroys interval
		var stop = $interval(function() {
			if(gapi && FB && twttr && $scope.article.title && $scope.hashtags){
				//Google plus one
				gapi.plusone.render('gplus', {'size': 'medium'});
				//Facebook like
				if(!FB._initialized)
					FB.init({
						appId      : $window.fbkey,
						status     : false,
						xfbml      : true
					});
				else
					FB.XFBML.parse();
				// FB.ui(
				// 	{
				// 		method: 'feed',
				// 		name: $scope.article.title,
				// 		link: $scope.url,
				// 		description: $scope.article.lead,
				// 		message: ''
				// 	}
				// );
				//
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
