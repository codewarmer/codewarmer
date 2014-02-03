//Comments Service for REST backend
angular.module('mean.comments').factory('Comments',function($resource) {
  return $resource('comments/:commentId',{
		commentId: '@_id'
	},{
		update: {method: 'PUT'}
	});
});
