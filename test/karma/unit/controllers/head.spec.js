(function () {
  'use strict';

  describe('MEAN controllers', function () {
    describe('HeadCtrl', function () {
      //Load app
      beforeEach(module('mean'));

      var $rootScope, initHeadCtrl;

      beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');

        initHeadCtrl = function () {
          return $controller('HeadCtrl', {$scope: $rootScope});
        };
      }));

      it('should expose Page methods', function () {
        initHeadCtrl();
        expect($rootScope.getTitle).toBeDefined();
        expect($rootScope.getDescription).toBeDefined();
        expect($rootScope.getKeywords).toBeDefined();
        expect($rootScope.getUrl).toBeDefined();
      });

    });
  });

})();
