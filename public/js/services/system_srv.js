angular.module('mean.system').factory('Page', function() {
  var title = '',	description = '', keywords = '';
	return {
		getTitle: function() {
			return title || 'Bad Gateway';
		},
		setTitle: function(newTitle) {
			title = newTitle;
		},
		getDescription: function() {
			return description || 'Blog about programming from practical perspective with lots of real life examples.';
		},
		setDescription: function(newDescription) {
			description = newDescription;
		},
		getKeywords: function() {
			return keywords || 'node.js, express, mongoose, mongodb, angularjs';
		},
		setKeywords: function(newKeywords) {
			keywords = newKeywords;
		},
		setDefault: function() {
			title = description = keywords = '';
		}
	};
});
