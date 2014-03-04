angular.module('mean.articles').controller('ArticlesController', function ($scope, $routeParams, $location, $rootScope, $element, Global, Articles, Auth, Page) {
  $scope.global = Global;
	$scope.user = Auth.getCurrentUser();
	$scope.checkAccess = Auth.checkAccess;
	$scope.article = {};
	
	var path = $location.path();
	if(path === "/" || $routeParams.tags || $routeParams.search)
		getArticles();
	else if($routeParams.slug) {
		findOne();
		$scope.operation = "Edit Article";
	}
	else if(path === "/articles/create")
		$scope.operation = "Create Article";

	$scope.ckeditorConfig = {
		lang: 'en',
		toolbar_full: [{ name: 'basicstyles',
                     items: [ 'Bold', 'Italic', 'Strike', 'Underline' ] },
                   { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'Blockquote' ] },
                   { name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                   { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                   { name: 'tools', items: [ 'SpellChecker', 'Maximize' ] },
                   '/',
                   { name: 'styles', items: [ 'Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ] },
                   { name: 'insert', items: [ 'Image', 'Table', 'SpecialChar' ] },
                   { name: 'forms', items: [ 'Outdent', 'Indent' ] },
                   { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
                   { name: 'document', items: [ 'PageBreak', 'Source', 'pbckcode' ] },
									 { name: 'pbckcode' }
									],
		extraPlugins: 'pbckcode',
		pbckcode: {'highlighter': 'PRETTIFY', 'modes': [['BASH','sh'], ['HTML', 'html'], ['CSS', 'css'], ['PHP', 'php'], ['JS', 'javascript']]}
	};

  function findOne() {
    Articles.get({
      slug: $routeParams.slug
    }, function(article) {
      $scope.article = article;
			Page.setTitle(article.title);
			Page.setDescription(article.lead);
			if(article.tags)
				Page.setKeywords(article.tags.join(','));
    });
  }

	$scope.save = function() {
		if($scope.article._id)
			updateArticle();
		else
			createArticle();
	};

	function createArticle() {
    var article = new Articles({
      title: $scope.article.title,
			lead: $scope.article.lead,
      content: $scope.article.content,
			tags: $scope.article.tags
    });
    article.$save(function(response) {
      $location.path("posts/" + response.slug);
    });
  }
	
	function updateArticle() {
    var article = $scope.article;
    if (!article.updated) {
      article.updated = [];
    }
    article.updated.push(new Date().getTime());

    article.$update(function() {
      $location.path('/posts/' + article.slug);
    });
  }

  $scope.remove = function(article) {
    if (article) {
      article.$remove();  

      for (var i in $scope.articles) {
        if ($scope.articles[i] == article) {
          $scope.articles.splice(i, 1);
        }
      }
    }
    else {
      $scope.article.$remove();
      $location.path('/');
    }
  };

  function getArticles() {
		if($routeParams.tags || $routeParams.search){
			Page.setDefault();
			Articles.query(
				$routeParams,
				function(articles){
					$scope.articles = articles;
				});
		}
		else{
			Page.setDefault();
			Articles.query(function(articles) {
				$scope.articles = articles;
			});
		}
  }

});
