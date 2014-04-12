angular.module('RegexpTool', []).controller('regexpTool', function($scope) {
	var setDefaults = function() {
		$scope.method = 'test';
		$scope.modifiers = {
			i: true,
			g: true,
			m: false,
			toString: function() {
				return this.i+this.g+this.m;
			}
		};
		$scope.pattern = '';
		$scope.subject = '';
		$scope.result = '';
		$scope.replace = '';
		$scope.matches = '';
	};

	setDefaults();
	
	var escapeString = function(string) {
		var escapes = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;'
		};
		var applyEscape = function(symbol) {
			return escapes[symbol] || symbol;
		};
		return string.replace(/[&<>]/ig, applyEscape);
	};
	
	var escapePattern = function(string) {
		return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	};

	var createMatchesOutput = function(regexp, modifiers) {
		var matches = $scope.subject.match(regexp);
		var escapedString = escapeString($scope.subject);
		if(matches)
			matches.forEach(function(match) {
				match = escapeString(match);
				var matchRegexp = new RegExp('(?!<span class="match">])'+escapePattern(match), modifiers);
				escapedString = escapedString.replace(matchRegexp, '<span class="match">' + match + '</span>');
			});
		$scope.matches = escapedString;
	};

	var runRegexp = function() {
		var modifiers = '';
		for(var i in $scope.modifiers){
			if(typeof $scope.modifiers[i] !== 'function')
				modifiers += $scope.modifiers[i] ? i : '';
		}
		var regexp = new RegExp($scope.pattern, modifiers);

		//switch between the methods of RegExp and String
		switch($scope.method){
		case 'test':
		case 'exec': 
			$scope.regexpToCopy = regexp + '.' + $scope.method + '(subject);';
			$scope.result = regexp[$scope.method]($scope.subject);
			break;
		case 'replace':
		case 'match':
		case 'search':
			$scope.regexpToCopy = 'subject.' + $scope.method + '(' + regexp + ');';
			$scope.result = $scope.subject[$scope.method](regexp, $scope.replace);
			break;
		}
		//make a result look like array if it's array
		if(typeof $scope.result === 'object' && $scope.result) $scope.result = '[' + $scope.result.toString() + ']';

		//fic to display null
		if($scope.result===null) $scope.result = 'null';
		
		//alter regexp if not replace or match and create Matches output
		if($scope.method == 'replace' || $scope.method == 'match'){
			createMatchesOutput(regexp, modifiers);
		}
		else {
			modifiers = modifiers.replace('g', '');
			regexp = new RegExp($scope.pattern, modifiers);
			createMatchesOutput(regexp);
		}
	};

	$scope.$watch('subject+method+pattern+modifiers+replace', function() {
		if($scope.subject && $scope.pattern)
			runRegexp();
	});

	$scope.run = function() {
		runRegexp();
	};

	$scope.clear = function() {
		setDefaults();
	};
});
