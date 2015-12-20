(function () {
    'use strict';

    angular.module('app')
    .factory('authService', function ($q, $location, $timeout, apiService, sessionService) {
        var service = {
            login: login,
            logout: logout,
            init: init
        };

        return service;

       
        function login(data) {

            return apiService.post('auth/login', data)
            .then(function(response) {
                sessionService.user(response.user);
                sessionService.token(response.token);
            });
        }

        function logout() {

            apiService.post('auth/logout');
                        
            sessionService.reset();
            $timeout(function () {
                $location.path('/');
            }, 500);
        }

        function init() {          

            if(sessionService.token()) {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            }
           
            return apiService.post('auth/token', {}, { key: 'token' })
            .then(function(token) {
                sessionService.token(token);
            });
        }
    });
})();


