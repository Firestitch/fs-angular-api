(function () {
    'use strict';

    angular.module('app')
    .factory('DummyService', function (fsApi) {
 
        var service = {
            gets:gets
        };
       
        return service;

        function gets(data,options) {
            return fsApi.get('dummy', data, fsApi.options(options));
        }

    });
})();