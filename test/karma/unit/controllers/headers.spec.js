(function() {
  'use strict';

  describe('MEAN controllers', function() {

    describe('HeaderController', function() {

      // Load the controllers module
      beforeEach(module('mean'));

      var $rootScope, initHeaderController;

      beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');

        initHeaderController = function () {
          return $controller('HeaderController', {$scope: $rootScope});
        }
      }));

      it('should expose Auth methods', function() {
        initHeaderController();
        expect($rootScope.user).toBeDefined();
        expect($rootScope.isLoggedIn).toBeDefined();
        expect($rootScope.signOut).toBeDefined();
      });

      it('should change collapsed status on window resize',
      inject(function ($window) {
        $window.innerWidth = 1024;
        initHeaderController();
        expect($rootScope.width).toBe(1024);
        expect($rootScope.isCollapsed).toBe(false);

        $window.innerWidth = 700;
        $window.onresize();

        expect($rootScope.width).toBe(700);
        expect($rootScope.isCollapsed).toBe(true);
      }));

      it('shold change collapsed status by toggleCollapsed', function () {
        initHeaderController();
        expect($rootScope.isCollapsed).toBe(false);
        $rootScope.toggleCollapsed();
        expect($rootScope.isCollapsed).toBe(true);
      });

      it('should be able to check access by role', function () {
        initHeaderController();
        expect($rootScope.roleAccess('admin')()).toBe(false);
      });

    });

  });

})();
