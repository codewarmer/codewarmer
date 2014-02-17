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
//	var t = 0;
	console.log('test');
  return {
    'restrict': 'C',
    'link': function postLink(scope, element, attrs) {
			var langExtension = attrs['class'].match(/\blang(?:uage)?-([\w.]+)(?!\S)/);
			if(langExtension) langExtension = langExtension[1];
			//load Google prettify library
			//console.log('test'+t);
			//t++;
			Loader.load('prettify', {ensure: 'prettyPrintOne'}, function() {
				console.log('pretty');
				element.html(prettyPrintOne(element.html(), langExtension, true));
			});
    }
  };
});

angular.module('Compile',[]).directive('compile', function($compile) {
  return {
		'restrict': 'A',
		'link': function(scope, elem, attrs) {
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
