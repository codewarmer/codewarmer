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
		$scope.error = '';
		$scope.showReference = false;
		$scope.showReferenceReplace = false;
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
	
	var createMatchesOutput = function(modifiers) {
		var offset = 0;
		var regexp = new RegExp('(.*?)'+$scope.pattern, modifiers);
		var string = $scope.subject.replace(regexp, function(match, p1, p2) {
			//get offset
			offset = arguments[arguments.length-2] + match.length;
			//escape original subject and insert match span
			return escapeString(p1) + '<span class="match">'  + escapeString(match.replace(p1, '')) + '</span>';
		});
		if(offset < $scope.subject.length-1){
			var nonEscaped = $scope.subject.slice(offset);
			string = string.replace(nonEscaped, escapeString(nonEscaped));
		}
		$scope.matches = string;
	};

	var runRegexp = function() {
		var modifiers = '';
		$scope.error = '';
		$scope.result = '';
		$scope.matches = '';
		for(var i in $scope.modifiers){
			if(typeof $scope.modifiers[i] !== 'function')
				modifiers += $scope.modifiers[i] ? i : '';
		}

		//catch err and output message for debugging
		try {
			var regexp = new RegExp($scope.pattern, modifiers);
		}
		catch(err){
			$scope.error = err.message;
		}

		if($scope.error) return;

		//switch between the methods of RegExp and String
		switch($scope.method){
		case 'test':
		case 'exec': 
			$scope.regexpToCopy = regexp + '.' + $scope.method + '(subject);';
			$scope.result = regexp[$scope.method]($scope.subject);
			break;
		case 'match':
		case 'search':
		case 'split':
			$scope.regexpToCopy = 'subject.' + $scope.method + '(' + regexp + ');';
			$scope.result = $scope.subject[$scope.method](regexp);
			break;
		case 'replace':
			$scope.regexpToCopy = 'subject.' + $scope.method + '(' + regexp + ',' + $scope.replace  + ');';
			$scope.result = $scope.subject[$scope.method](regexp, $scope.replace);
			break;
		}
		//make a result look like array if it's array
		if(typeof $scope.result === 'object' && $scope.result) $scope.result = '[' + $scope.result.toString() + ']';

		//fic to display null
		if($scope.result===null) $scope.result = 'null';
		
		//remove global modifier if not replace, match or split
		if($scope.method == 'replace' || $scope.method == 'match' || $scope.method == 'split'){
			createMatchesOutput(modifiers);
		}
		else {
			modifiers = modifiers.replace('g','');
			createMatchesOutput(modifiers);
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
