angular.module('mean.articles').controller('socialCtrl', function($scope, $window, $interval) {
	
	$scope.zombie = $window.navigator.userAgent == 'Zombie';
	//Renders social buttons
  $scope.loadScripts = function() {
		//every 1000ms checks if social scripts available, renders buttons and destroys interval
		var stop = $interval(function() {
			if(gapi && FB && twttr){
				//Google plus one
				gapi.plusone.render('gplus', {'size': 'medium'});
				//Facebook like
				FB.init({
          appId      : $window.fbkey,
          status     : true,
          xfbml      : true
        });
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
