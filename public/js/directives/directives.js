//'use strict';
//angular.module('resizeEvent', []).directive('ngResize', function($scope) {
//  return function(scope) {
//		function link(scope, element, attrs){
//		}
//    return {link: link};//console.log('directive');// does not fire
//  };
//});


//Dirty fix for autofill fields
angular.module('AutoFillSync',[]).directive('autoFillSync', ['$interval', function($interval) {
  return {
		'require': 'ngModel',
		'link': function(scope, elem, attrs, ngModel) {
			var origVal = elem.val();
			var stop = $interval(function() {
				var newVal = elem.val();
				//console.log('origVal:'+origVal+'; newVal:'+newVal+'; $pristine:'+ngModel.$pristine+';\n');
				if((ngModel.$pristine && origVal !== newVal) || ngModel.$modelValue !== newVal){
					ngModel.$setViewValue(newVal);
				}
			},100);
			scope.$on('$destroy', function() {
				$interval.cancel(stop);
				stop = undefined;
			});
		}
	};
}]);

angular.module('Prettify',[]).directive('prettyprint', function(Loader) {
  return {
    'restrict': 'C',
    'link': function postLink(scope, element, attrs) {
			var langExtension = attrs['class'].match(/\blang(?:uage)?-([\w.]+)(?!\S)/);
			if(langExtension) langExtension = langExtension[1];
			//load Google prettify library
			Loader.load('prettify', {ensure: 'prettyPrintOne'}, function() {
				element.html(prettyPrintOne(element.html(), langExtension, true));
			});
    }
  };
});

angular.module('Compile',[]).directive('compile', function($compile) {
  return {
		'restrict': 'A',
		'link': function(scope, elem, attrs) {
			//watching for any changes in output of scope.$eval() that evaluates js expressions
			//and if changed compile and insert result to element
			scope.$watch(
				function(scope) {
					return scope.$eval(attrs.compile);
				},
				function(value) {
					elem.html(value);
					$compile(elem.contents())(scope);
				}
			);
		}
	};
});

angular.module('AddThis',[]).directive('addthisToolbox', function($window, Loader, Page) {
    return {
        restrict: 'C',
        transclude: true,
        replace: true,
        template: '<div ng-transclude></div>',
        link: function ($scope, element, attrs) {
					if(!Page.isCrawler())
						Loader.load('addthis', {ensure: 'addthis'}, function() {
							addthis.layers({
								'theme' : 'transparent',
								'share' : {
									'position' : 'left',
									'numPreferredServices' : 5
								}   
							});
							addthis.init();
						});
        }
    };
});

angular.module('ZeroClip', []).directive('ngZeroclip', function(Loader) {
	return {
		'restrict': 'A',
		'link': function(scope, element, attrs) {
			Loader.load('zeroClipboard', {ensure: 'ZeroClipboard'}, function() {
				ZeroClipboard.config({
					moviePath: '/lib/zeroclipboard/ZeroClipboard.swf'
				});
				var client = new ZeroClipboard(element);
				
				var onDataRequested = function(event) {
					client.setText(scope.$eval(attrs.ngZeroclip));
				};

				client.on( 'load', function ( event ) {
					client.on('dataRequested', onDataRequested);
				});
				scope.$on('$destroy', function() {
					client.off('dataRequested', onDataRequested);
					client.unclip(element);
				});
			});
		}
	};
});
