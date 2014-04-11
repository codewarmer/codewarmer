angular.module('passwordGenerator', []).controller('passwordGenerator', function($scope) {
  $scope.passLengthMax = 10;
	$scope.passLength = 4;
	$scope.passDifficultyMax = 5;
	$scope.passDifficulty = 3;
	$scope.symbolsIncluded = '';
	$scope.password = '';

	var difficultyWords = ['Very Easy', 'Easy', 'Normal', 'Strong', 'Very Strong'];
	var symbols = [
		'0123456789',
		'abcdefghijklmnopqrstuvwxyz',
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		'!"#$%&\'()*+,-./',
		':;<=>?@'
	];

	$scope.zeroClipConf = {
		moviePath: '/path',
    trustedDomains: ["*"],
    allowScriptAccess: "always",
    forceHandCursor: true
	};

	$scope.generatePassword = function() {
		$scope.password = '';
		for(var i = 0, len = $scope.symbolsIncluded.length; i < $scope.passLength * 2; i++)
			$scope.password += $scope.symbolsIncluded.charAt(Math.floor(Math.random() * len));
	};
	
	$scope.$watch('passLength', function() {
		$scope.generatePassword();
	});

	$scope.$watch('passDifficulty', function(difficulty) {
		$scope.symbolsIncluded = symbols.slice(0,difficulty).join('');
		$scope.generatePassword();
		$scope.difficultyWord = difficultyWords[difficulty-1];
	});
});
