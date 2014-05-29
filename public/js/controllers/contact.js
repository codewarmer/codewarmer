angular.module('mean.contact').controller('contactCtrl', function ($scope, $http, Page) {
  $scope.vcRecaptcha = {};
  $scope.crawler = Page.isCrawler();

  $scope.send = function () {
    $scope.msg.recaptcha = $scope.vcRecaptcha.service.data();
    $http.post('/contact', $scope.msg).
    success(function (data) {
      $scope.alerts = data.messages;
      $scope.alertClass = 'alert-success';
      $scope.showAlerts = true;
      $scope.msg = {};
      $scope.vcRecaptcha.service.reload();
    }).
    error(function (data, status) {
      if(status === 400){
        $scope.alerts = data.errors;
        $scope.alertClass = 'alert-danger';
        $scope.showAlerts = true;
        $scope.vcRecaptcha.service.reload();
      }
    });
  };
});
