(function () {
  'use strict';

  describe('MEAN controllers', function () {
    describe('contactCtrl', function () {

      beforeEach(module('mean'));

      var $rootScope, $httpBackend, initContactCtrl, messageDummy, vcRecaptcha;

      beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');

        messageDummy = {
          title: 'Message title',
          text: 'Message text',
          recaptcha: '2887 Dfghj'
        };

        vcRecaptcha = {
          data: function () {
            return messageDummy.recaptcha;
          },
          reload: function () {

          }
        };

        var $controller = $injector.get('$controller');

        initContactCtrl = function () {
          return $controller('contactCtrl', {$scope: $rootScope});
        };
      }));

      afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should expose vcRecaptcha and crawler', function () {
        initContactCtrl();
        expect($rootScope.vcRecaptcha).toEqual({});
        expect($rootScope.crawler).toBe(true); //only when tested in PhantomJS
      });

      it('should send POST request when $scope.send() with valid data '+
      'and in case of success clean the form and insert message', function () {
        initContactCtrl();
        $rootScope.vcRecaptcha.service = vcRecaptcha;
        $rootScope.msg = messageDummy;

        var response = {messages: ['Great success!']};
        $httpBackend.expectPOST('/contact', messageDummy).respond(response);

        $rootScope.send();

        $httpBackend.flush();

        expect($rootScope.msg).toEqual({});
        expect($rootScope.alerts).toEqual(response.messages);
        expect($rootScope.alertClass).toBe('alert-success');
        expect($rootScope.showAlerts).toBe(true);
      });

      it('should send POST request when $scope.send() with valid data '+
      'and in case of error don\'t clean the form and insert error message',
      function () {
        initContactCtrl();
        $rootScope.vcRecaptcha.service = vcRecaptcha;
        $rootScope.msg = messageDummy;

        var response = {errors: ['Great error!']};
        $httpBackend.expectPOST('/contact', messageDummy).respond(400, response);

        $rootScope.send();

        $httpBackend.flush();

        expect($rootScope.msg).toEqual(messageDummy);
        expect($rootScope.alerts).toEqual(response.errors);
        expect($rootScope.alertClass).toBe('alert-danger');
        expect($rootScope.showAlerts).toBe(true);
      });

      it('should show error message when recieve unexpected error', function () {
        initContactCtrl();
        $rootScope.vcRecaptcha.service = vcRecaptcha;
        $rootScope.msg = messageDummy;

        $httpBackend.expectPOST('/contact', messageDummy).respond(500);
        $rootScope.send();
        $httpBackend.flush();

        expect($rootScope.alerts).toEqual(
          [{message: 'Unexpected server error. Please try again.'}]
        );
      });

    });
  });

})();
