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
			return description || 'This blog mainly about web programming and related topics with many examples';
		},
		setDescription: function(newDescription) {
			description = newDescription;
		},
		getKeywords: function() {
			return keywords || 'node.js, express, mongoose, mongodb, angular.js, javascript';
		},
		setKeywords: function(newKeywords) {
			keywords = newKeywords;
		},
		setDefault: function() {
			title = description = keywords = '';
		}
	};
});
