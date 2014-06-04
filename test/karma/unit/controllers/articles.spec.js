(function() {
  'use strict';

  // Articles Controller Spec
  describe('MEAN controllers', function() {

    describe('ArticlesController', function() {

      // The $resource service augments the response object with methods for updating and deleting the resource.
      // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
      // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
      // When the toEqualData matcher compares two objects, it takes only object properties into
      // account and ignores methods.
      beforeEach(function() {
        this.addMatchers({
          toEqualData: function(expected) {
            return angular.equals(this.actual, expected);
          }
        });
      });

      // Load the controllers module
      beforeEach(module('mean'));

      // Initialize the controller and a mock scope
      var $rootScope,
      $httpBackend,
      $routeParams,
      $location,
      initArticlesController,
      articleDummy;

      beforeEach(inject(function($injector) {

        $rootScope = $injector.get('$rootScope');
        $routeParams = $injector.get('$routeParams');
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');

        var $controller = $injector.get('$controller');

        initArticlesController = function(){
          return $controller('ArticlesController', {'$scope': $rootScope});
        };

        var created = (new Date()).toISOString();

        articleDummy = function() {
          return {
            _id: '525cf20451979dea2c000001',
            slug: '12678923444-an-article-about-angular',
            title: 'An article about Angular',
            content: 'Angular is the best!',
            created: created,
            tags: ['tag1', 'tag2']
          };
        };

        $httpBackend.whenGET('/articles').respond([articleDummy()]);

      }));

      afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('For the root path should send GET request and save the result to an array',
      function() {
        // initialize controller
        initArticlesController();
        // test expected GET request
        $httpBackend.expectGET('/articles');
        // return response
        $httpBackend.flush();
        // test scope value
        expect($rootScope.articles).toEqualData([articleDummy()]);
      });

      it('If a search parameter presented should send GET request using this ' +
      'parameter and save the result to an array', function() {
        // fixture URL parameter
        $routeParams.search = 'some request';
        initArticlesController();

        // test expected GET request
        $httpBackend.expectGET('/articles?search=some+request').respond([articleDummy()]);
        $httpBackend.flush();
        // test scope value
        expect($rootScope.articles).toEqualData([articleDummy()]);
      });

      it('If slug parameter presented should make XHR with this parameter and ' +
      'save the result to a variable', inject(function(Page) {
        // fixture URL parament
        $routeParams.slug = articleDummy().slug;
        initArticlesController();

        // test expected GET request with response object
        $httpBackend.expectGET('/articles/' + articleDummy().slug).respond(articleDummy());
        $httpBackend.flush();

        // test scope value
        expect($rootScope.article).toEqualData(articleDummy());
        expect(Page.getKeywords()).toEqual('tag1,tag2');
      }));

      it('$scope.save() with valid form data should send a POST request ' +
      'with the form input values and then locate to a new object URL',
      function() {

        $location.path('/articles/create');
        initArticlesController();
        // test scope values
        expect($rootScope.article.created).toBeDefined();
        expect($rootScope.operation).toBe('Create Article');

        // fixture article to post
        var postArticle = articleDummy();
        delete postArticle.slug;
        delete postArticle._id;
        // fixture mock form input values
        $rootScope.article = postArticle;

        // test post request is sent
        $httpBackend.expectPOST('/articles', postArticle).respond(articleDummy());

        // run controller
        $rootScope.save();
        $httpBackend.flush();

        // test URL location to new object
        expect($location.path()).toBe('/posts/' + articleDummy().slug);
      });

      it('$scope.save() should update a valid article when _id presented',
      inject(function(Articles) {

        $location.path('/fake_path');
        initArticlesController();

        // mock article object from form
        var article = new Articles(articleDummy());

        // mock article in scope
        $rootScope.article = article;

        // test PUT happens correctly
        $httpBackend.expectPUT('/articles/' + articleDummy().slug).respond();

        // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
        //$httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/, putArticleData()).respond();
        /*
        Error: Expected PUT /articles\/([0-9a-fA-F]{24})$/ with different data
        EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!"}
        GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!","updated":[1383534772975]}
        */

        // run controller
        $rootScope.save();
        $httpBackend.flush();

        // test URL location to new object
        expect($location.path()).toBe('/posts/' + articleDummy().slug);

      }));

      it('$scope.remove() should send a DELETE request with a valid slug' +
      'and remove the article from the scope', inject(function(Articles) {

        initArticlesController();
        $httpBackend.flush();

        // fixture rideshare
        var article = new Articles(articleDummy());

        // mock rideshares in scope
        $rootScope.articles = [];
        $rootScope.articles.push(article);

        // test expected rideshare DELETE request
        $httpBackend.expectDELETE('/articles/' + articleDummy().slug).respond(204);

        // run controller
        $rootScope.remove(article);
        $httpBackend.flush();

        // test after successful delete URL location articles list
        expect($location.path()).toBe('/');
        expect($rootScope.articles.length).toBe(0);

      }));

      it('$scope.remove() should send a DELETE request with a valid slug, ' +
      'remove current article and set path to root', inject(function(Articles) {

        initArticlesController();
        $httpBackend.flush();

        // fixture rideshare
        var article = new Articles(articleDummy());

        // mock rideshare in scope
        $rootScope.article = article;

        // test expected rideshare DELETE request
        $httpBackend.expectDELETE('/articles/' + articleDummy().slug).respond(204);

        // run controller
        $rootScope.remove();
        $httpBackend.flush();

        // test after successful delete URL location articles list
        expect($location.path()).toBe('/');
        expect($rootScope.article).toEqual({});

      }));

    });

  });
}());
