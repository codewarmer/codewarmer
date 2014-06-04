(function() {
  'use strict';

  describe('MEAN controllers', function() {

    describe('HeaderController', function() {

      // Load the controllers module
      beforeEach(module('mean'));

      var $rootScope,
      initHeaderController;

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

    });

  });

})();
