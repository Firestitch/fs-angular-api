(function () {

    'use strict';
    angular.module('app')
    .controller('BodyCtrl', function ($scope, alertService, BOWER) {
        $scope.$watch(alertService.get,function (alerts) {
            $scope.alerts = alerts;
        });

        $scope.app_name = BOWER.name;
    });
})();
