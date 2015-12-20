(function () {
    'use strict';

    angular.module('app')
    .directive('alerts', function (alertService) {
        return {
            template: '<div class="alerts"><div ng-repeat="alert in alerts" type="{{alert.type}}" class="alert {{alert.type}}">{{ alert.msg }}</div></div>',
            restrict: 'E',
            replace: true,
            link: function ($scope, attrs) {

                $scope.alerts = [];
                $scope.$watch(alertService.get,function (alerts) {
                     $scope.alerts = alerts;
                });
            }
        };
    });
})();
