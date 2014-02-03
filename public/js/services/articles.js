//Articles service used for articles REST endpoint
angular.module('mean.articles').factory("Articles", ['$resource', function($resource) {
    return $resource('/articles/:slug', {
        slug: '@slug'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
