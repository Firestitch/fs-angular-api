(function () {
    'use strict';
    angular.module('app')
    .factory('configService', function ($rootScope, CONFIG) {

        var service = { };

        service = angular.extend(service,CONFIG)
        $rootScope.config = CONFIG;

        return service;
    });
})();
