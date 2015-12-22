(function () {
    'use strict';

    /**
     * @ngdoc interface
     * @name fs-angular-api.services:fsApi
    */
    angular.module('fs-angular-api')
    .provider('fsApi', function () {

        var provider = this;

        this._options = {   url: null,
                            timeout: 10000,
                            encoding: 'json',
                            dataKey: 'data',
                            events: {
                                begin: null,
                                success: null,
                                complete: null,
                                fail: null
                            } };

        this.options = function(options) {

            if(!arguments.length)
                return this._options;

            this._options = angular.merge({},this._options,options);
        }

        this.option = function(name, value) {

             if(arguments.length==1)
                return this._options[arguments[0]];

            this._options[name] = value;
        }

        this.$get = function ($http, $httpParamSerializer, sessionService, alertService, $location) {

            return {
                    get: get,
                    gets: get,
                    post: post,
                    put: put,
                    'delete': deleted,
                    on: on
                };      
        

            function params(data) {
                return '?' + $httpParamSerializer(data);
            }

            /**
             * @ngdoc method
             * @name get
             * @methodOf fs-angular-api.services:fsApi
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object} data The query string data
             * @param {object=} options Optional arguments that override the defaults 
             */
            function get(endpoint, data, options) {

                endpoint = endpoint + params(data);

                return send('GET',endpoint, data, options);
            }

            /**
             * @ngdoc method
             * @name post
             * @methodOf fs-angular-api.services:fsApi
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object} data The post data
             * @param {object=} options Optional arguments that override the defaults 
             */            
            function post(endpoint, data, options) {
                return send('POST',endpoint, data, options);
            }

            /**
             * @ngdoc method
             * @name put
             * @methodOf fs-angular-api.services:fsApi
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object} data The post data
             * @param {object=} options Optional arguments that override the defaults 
             */  
            function put(endpoint, data, options) {
                return send('PUT',endpoint, data, options);
            }

            /**
             * @ngdoc method
             * @name delete
             * @methodOf fs-angular-api.services:fsApi
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object=} options Optional arguments that override the defaults 
             */  
            function deleted(endpoint, options) {
                return send('DELETE',endpoint, {}, options);
            }

            /**
             * @ngdoc method
             * @name send
             * @methodOf fs-angular-api.services:fsApi
             * @param {string} method The HTTP method POST, PUT, GET, DELETE 
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object} data The post data
             * @param {object=} options Optional arguments that override the defaults 
             * @param {string} options.url The base URL of the API
             * @param {string} options.encoding The encoding of the request (url, json, formdata)
             * @param {integer} options.timeout The number of milliseconds until the request timesout
             * @param {string} options.dataKey The key that represents the the data object in the response
             * @param {object} options.apply After the request is compelte apply a callback function to targeted data
             * @param {function} options.apply.function The apply callback function. The target object is passed as the first parameter
             * @param {string} options.apply.key Specifies that they key in the data object that is to be targeted
             * @param {string} [options.apply.array=false] Specifies that they target data is an array
             */
            function send(method, endpoint, data, options) {

                options = angular.extend({}, provider.options(), options || {});
                var headers = {};

                if(options.encoding=='url') {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
             
                } else if(options.encoding=='json') {
                    headers['Content-Type'] = 'text/json';

                } else if(options.encoding=='formdata') {
                    
                    var fd = new FormData();
                    angular.forEach(data, function(item, key) {
                        fd.append(key, item);
                    })

                    data = fd;
                }

                begin(data,headers,options);
                
                return $http({
                        method: method,
                        url: options.url + endpoint,
                        headers: headers,
                        timeout: options.timeout,
                        data: data,
                        transformRequest: function(obj) {

                            if(options.encoding=='url') {
                                var str = [];
                                for(var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            
                            } else if(options.encoding=='json') {
                                obj = JSON.stringify(obj);
                            }

                            return obj;
                        }
                    })
                    .then(function (response) {

                        complete(response, options);

                        if(response && options.apply) {
                         
                            if(options.apply.key) {

                                var object = response.data.data[options.apply.key];

                                if(options.apply.array) {
                                    
                                    if(object && object.length) {
                                        angular.forEach(object,function(item) {
                                            item = options.apply.function(item);
                                        });
                                    }

                                } else {

                                    if(object) {
                                        response.data.data[options.apply.key] = options.apply.function(object);
                                    }
                                }
                            }
                        }

                        return success(response, options);
                    })
                    .catch(function (response) {
                        complete(response, options);
                        fail(response, options);
                    });
            }

            function begin(data,headers,options) {
                if(options.events.begin) {
                    options.events.begin(data,headers,options);
                }
            }

            function success(response, options) {
                var data = response.data;

                if(options.dataKey) {
                   data = data[options.dataKey];
                }

                if (options && options.key) {
                    data = data[options.key];
                }

                var events = provider.option('events');
                if(events.success) {
                    events.success(response);
                }

                return data;
            }

            function complete(response, options) {
                var events = provider.option('events');
                if(events.complete) {
                    events.complete(response,options);
                }
            }

            function fail(response, options) {

                var message = "Connection issue";

                if(response.data && response.data.message)
                    message = response.data.message;

                response = {    message: message,
                                code: response.status,
                                response: response };

                // no error handling required, simply return the message
                if (options && options.handle === false) {
                    throw response;
                }

                var events = provider.option('events');
                if(events.fail) {
                    events.fail(response);
                }

                throw response;
            }


            /**
             * @ngdoc method
             * @name on
             * @methodOf fs-angular-api.services:fsApi
             * @param {string} events Specifies event type 
             * @param {string} events.begin The start of ajax call
             * @param {string} events.success Ajax returns code in the 200 range
             * @param {string} events.complete Upon the ajax completing
             * @param {string} events.fail Ajax returns and codes other then the 200 range
             * @param {function} function The callback function for the event
             */
            function on(event, value) {
                var events = provider.option('events');
                events[event] = value;
                var options = provider.option('events', events);
                return this;
            }            
        };
    });

})();
