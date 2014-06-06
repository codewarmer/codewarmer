(function () {
  'use strict';
  describe('MEAN controllers', function () {
    describe('UsersController', function () {

      beforeEach(module('mean'));

      var $rootScope, $httpBackend, $location, initUsersController, userDummy,
      userSignUpDummy, vcRecaptcha;

      beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        var $controller = $injector.get('$controller');

        initUsersController = function () {
          return $controller('UsersController', {$scope: $rootScope});
        };

        userDummy = {
          email: 'dummy@user.com',
          password: 'qwerty'
        };

        userSignUpDummy = {
          name: 'Dummy User',
          username: 'DuUs',
          email: 'dummy@user.com',
          password: 'dummy123',
          recaptcha: '123 solution'
        };

        vcRecaptcha = {
          data: function () {
            return userSignUpDummy.recaptcha;
          },
          reload: function () {

          }
        };

      }));

      afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should expose crawler, user and vcRecaptcha', function () {
        initUsersController();
        expect($rootScope.crawler).toBeDefined();
        expect($rootScope.user).toEqual({});
        expect($rootScope.vcRecaptcha).toEqual({});
      });

      it('should send POST request on $scope.signIn() with valid data ' +
      'and redirect to root if login page' ,function () {
        $location.path('/signin');
        initUsersController();
        $rootScope.user = userDummy;

        $httpBackend.expectPOST('/users/session', userDummy).respond(userDummy);

        $rootScope.signIn();
        $httpBackend.flush();

        expect($location.path()).toBe('/');
      });

      it('should send POST request on $scope.signIn() with valid data ' +
      'and stay on the same page if not login page' ,function () {
        $location.path('/posts/1233993-some-title');
        initUsersController();
        $rootScope.user = userDummy;

        $httpBackend.expectPOST('/users/session', userDummy).respond(userDummy);

        $rootScope.signIn();
        $httpBackend.flush();

        expect($location.path()).toBe('/posts/1233993-some-title');
      });

      it('should send POST request on $scope.signIn() with valid data ' +
      'and show error if response status 400' ,function () {
        initUsersController();
        $rootScope.user = userDummy;
        var response = {
          errors: [{message: 'Something wrong!'}]
        };
        $httpBackend.expectPOST('/users/session').respond(400, response);

        $rootScope.signIn();
        $httpBackend.flush();

        expect($rootScope.errors).toEqual(response.errors);
        expect($rootScope.showErrors).toBe(true);
      });

      it('should send POST request on $scope.signIn() with valid data ' +
      'and show error if unknown error' ,function () {
        initUsersController();
        $rootScope.user = userDummy;

        $httpBackend.expectPOST('/users/session').respond(500);

        $rootScope.signIn();
        $httpBackend.flush();

        expect($rootScope.errors).toEqual(
          [{message: 'Unknown server error. Please try again.'}]
        );
        expect($rootScope.showErrors).toBe(true);
      });

      it('should send POST request on $scope.signUp() with valid data ' +
      'and redirect to root if success' ,function () {
        initUsersController();
        $rootScope.vcRecaptcha.service = vcRecaptcha;
        $rootScope.user = userSignUpDummy;

        $httpBackend.expectPOST('/users', userSignUpDummy).respond(userSignUpDummy);

        $rootScope.signUp();
        $httpBackend.flush();

        expect($location.path()).toBe('/');
      });

      it('should send POST request on $scope.signUp() with valid data ' +
      'and show error if error 400' ,function () {
        initUsersController();
        $rootScope.vcRecaptcha.service = vcRecaptcha;
        $rootScope.user = userSignUpDummy;

        var response = {errors: [{message: 'Something wrong!'}]};

        $httpBackend.expectPOST('/users').respond(400, response);

        $rootScope.signUp();
        $httpBackend.flush();

        expect($rootScope.errors).toEqual(response.errors);
        expect($rootScope.showErrors).toBe(true);
      });

      it('should send POST request on $scope.signUp() with valid data ' +
      'and show error if unknown server error' ,function () {
        initUsersController();
        $rootScope.vcRecaptcha.service = vcRecaptcha;
        $rootScope.user = userSignUpDummy;

        $httpBackend.expectPOST('/users').respond(500);

        $rootScope.signUp();
        $httpBackend.flush();

        expect($rootScope.errors).toEqual(
          [{message: 'Unknown server error. Please try again.'}]
        );
        expect($rootScope.showErrors).toBe(true);
      });

    });
  });
})();
