(function () {
    'use strict';
    angular.module('app')
    .factory('alertService', function ($timeout) {
        var service = {
            add: add,
            clear: clear,
            get: get,
            error: error
        },
        alerts = [],
        timeout = 10000,
        timer;

        return service;

        function add(type, msg, options) {
           
            var options = options || {};

            if(options.clear!==false)
                clear();

            var body = angular.element(document.querySelector('body'));

            alerts
            .push({
                type: type,
                msg: msg,
                close: clear
            });

            /*
            body.animate({scrollTop: angular.element(document.querySelector('div.alert')).scrollTop()}, 500, 'swing', function () {
                $timeout.cancel(timer);
                timer = $timeout(function(){
                    clear();
                }, timeout);
            });
            */

            timer = $timeout(function(){
                clear();
            }, timeout);            
        }

        function success(message) {
            add('success',message);
        }

        function info(message) {
            add('info',message);
        }

        function warning(message) {
            add('warning',message);
        }

        function error(message) {
            add('danger',message);
        }

        function clear() {
            alerts = [];
        }

        function get() {
            return alerts;
        }
    });
})();
