angular.module('mean.articles').controller('socialCtrl', function($scope, $window) {
  $scope.loadScripts = function() {
		gapi.plusone.render('gplus');
		FB.XFBML.parse();
		twttr.widgets.load()
		if(false || $window.navigator.userAgent !== 'Zombie'){
			//Google plus
			// var po = $window.document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			// po.src = 'https://apis.google.com/js/platform.js';
			// var s = $window.document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

			//Facebook
			// (function(d, s, id) {
			// 	var js, fjs = d.getElementsByTagName(s)[0];
			// 	if (d.getElementById(id)) return;
			// 	js = d.createElement(s); js.id = id;
			// 	js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
			// 	fjs.parentNode.insertBefore(js, fjs);
			// }($window.document, 'script', 'facebook-jssdk'));

			//Twitter
			// (function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}($window.document, 'script', 'twitter-wjs'));
		}
	};
});
