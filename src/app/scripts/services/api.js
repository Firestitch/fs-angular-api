(function () {
    'use strict';

    angular.module('app')
    .factory('apiService', function ($http, $httpParamSerializer, sessionService, configService, alertService, $location) {
        var service = {
            get: get,
            gets: gets,
            post: post,
            put: put,
            send: send,
            'delete': deleted,
            options: options,
            config: {   timeout: 10000,
                        urlencoded: true,
                        dataKey: 'data',
                        authorize: true }
        };

        var sv = service;

        return service;

        function params(data) {
            return '?' + $httpParamSerializer(data);
        }

        function options(options,defaults) {
            options = options || {};
            defaults = defaults || {};
            return angular.extend(defaults,options);
        }

        function get(endpoint, data, config) {

            endpoint = endpoint + params(data);

            return send('GET',endpoint, data, config);
        }

        function gets(endpoint, data, config) {

            endpoint = endpoint + params(data);

            return send('GET',endpoint, data, config);
        }

        function post(endpoint, data, config) {
            return send('POST',endpoint, data, config);
        }

        function put(endpoint, data, config) {
            return send('PUT',endpoint, data, config);
        }

        function deleted(endpoint, config) {
            return send('DELETE',endpoint, {}, config);
        }

        function send(method, endpoint, data, config) {
            config = angular.extend({}, sv.config, config || {});
            var url = (config.url || configService.api.url) + endpoint;
            var headers = {};

            if(config.authorize) {
                var api_key = apiKey();

                if(api_key)
                    headers['Api-Key'] = api_key;
            }

            if(config.urlencoded) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            else {
                headers['Content-Type'] = undefined;

                var fd = new FormData();
                angular.forEach(data, function(item, key) {
                    fd.append(key, item);
                })

                data = fd;
            }

            return $http({
                    method: method,
                    url: url,
                    headers: headers,
                    timeout: sv.config.timeout,
                    data: data,
                    transformRequest: function(obj) {

                        if(config.urlencoded) {
                            var str = [];
                            for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        }

                        return obj;
                    }
                })
                .then(function (response) {
                    return restfulSuccess(response, config);
                })
                .catch(function (response) {
                    restfulFail(response, config);
                });
        }

        function headers(config) {
            return
        }

        function apiKey() {
            var token = sessionService.token();
            return token ? token.key : '';
        }

        function restfulSuccess(response, config) {
            var data = response.data;

            if(config.dataKey) {
               data = data[config.dataKey];
            }

            if (config && config.key) {
                data = data[config.key];
            }

            if (data === null) {
                $location.path('/404');
                throw new Error('Data could not be found.')
            }

            return data;
        }

        function restfulFail(response, config) {

            var message = "Connection issue";

            if(response.data && response.data.message)
                message = response.data.message;

            response = {    message: message,
                            code: response.status,
                            response: response };

            // no error handling required, simply return the message
            if (config && config.handle === false) {
                throw response;
            }

            // API token invalid
            if (response.code === 401 || response.code === 403) {
                alertService.error('Sorry, your session has expired, please try again.');
                $location.path('/login');
                throw response;
            }

            // General error
            alertService.error(message);
            throw response;
        }
    });
})();
