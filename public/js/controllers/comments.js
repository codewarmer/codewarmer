angular.module('mean.comments').controller('CommentsController', function($scope,$http,Auth,Global,Comments, $animate) {
	$scope.comment = {};
	$scope.comments = {};
	$scope.showCommentForm = false;

	$scope.$watch('article', function(value) {
		if(value._id)
			getComments();
	});

	function getComments() {
		$http.get('/comments/discussion/'+$scope.article._id).
					success(function(comments) {
						$scope.comments = comments;
					}).
					error(function(error) {
						console.log(error);
					});
	}

	$scope.save = function() {
		$scope.comment.discussion_id = $scope.article._id;
		var comment = new Comments($scope.comment);
		comment.$save(function(response) {
			getComments();
			$scope.comment.text = '';
			$scope.showCommentForm = false;
		});
	};

	var currentReplyIndex = null;

	$scope.closeReply = function(index) {
		if(currentReplyIndex !== null) $scope.comments[currentReplyIndex].openReply = false;
		currentReplyIndex = null;
		$scope.comment.parent_id = undefined;
	};

	$scope.openReply = function(index) {
		$scope.closeReply(index);
		$scope.comments[index].openReply = true;
		$scope.comment.parent_id = $scope.comments[index]._id;
		currentReplyIndex = index;
	};

});
