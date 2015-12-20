(function () {
    'use strict';

    angular.module('app')
    .factory('storeService', function ($crypto, $localStorage, $log) {
        var service = {
            set: set,
            get: get,
            reset: reset,
            remove: remove,
            display: display
        },
        encryption = false;

        return service;

        function get(str) {

            var val = $localStorage[str];
            if(val && encryption) {
                val = decrypt(val);
            }

            return (typeof val === 'undefined') ? null : val;
        }

        function set(obj,value) {

            //if both these variables are set then treat as key value pair
            if(obj && value) {
                var obj1 = {};
                obj1[obj] = value;
                obj = obj1;
            }

            if (typeof obj === 'object') {
                // if object is a proper object, process normally
                angular.forEach(obj, function (val, key) {
                    if(encryption)
                        val = encrypt(val);
                    $localStorage[key] = val;

                });
            }
        }

        function remove(obj) {

            if(obj) {
                obj = typeof obj === 'object' ? obj : [obj];

                angular.forEach(obj,function(value) {
                    delete $localStorage[value];
                });
            }
        }

        function reset() {
            $localStorage.$reset();
        }

        function encrypt(obj) {

            obj = JSON.stringify(obj);
            obj = $crypto.encrypt(obj);

            return obj;
        }

        function decrypt(obj) {
            obj = $crypto.decrypt(obj);

            if(obj)
                obj = JSON.parse(obj);

            return obj;
        }

        function display() {

            angular.forEach($localStorage,function(value,key) {
                if(typeof value === 'string') {
                    $log.info({ key: key, value: decrypt(value) });
                }
            });
        }

    });
})();
