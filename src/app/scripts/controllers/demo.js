'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, DummyService) {

    $scope.date = new Date();
});
