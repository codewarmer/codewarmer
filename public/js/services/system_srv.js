angular.module('mean.system').factory('Page', function() {
  var title = '',	description = '', keywords = '';
	return {
		getTitle: function() {
			return title || 'CodeWarmer - blog about software development and egeneering';
		},
		setTitle: function(newTitle) {
			title = newTitle + '| CodeWarmer';
		},
		getDescription: function() {
			return description || 'This blog is mainly about the web programming and related topics with many examples';
		},
		setDescription: function(newDescription) {
			description = newDescription;
		},
		getKeywords: function() {
			return keywords || 'node.js, express, mongoose, mongodb, angular, javascript';
		},
		setKeywords: function(newKeywords) {
			keywords = newKeywords;
		},
		setDefault: function() {
			title = description = keywords = '';
		}
	};
});
