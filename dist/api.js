



(function () {
    'use strict';

    /**
     * @ngdoc interface
     * @name fs-angular-api.services:fsApi
    */
    angular.module('fs-angular-api',[])
    .provider('fsApi', function () {

        var provider = this;

        this._options = {   url: null,
                            timeout: 30000,
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

        this.$get = function ($http, $httpParamSerializer) {

            var events = [];
            return {
                    get: get,
                    gets: get,
                    post: post,
                    put: put,
                    'delete': deleted,
                    on: on,
                    options: options
                };      
    
            function options(defaults, overrides) {
                overrides = overrides || {};
                return angular.extend(defaults,overrides);
            }            

            function params(data) {
                
                if(!data) {
                    return '';
                }

                return '?' + encode(data).join('&');
            }

            function encodeNamespace(name,namespace) {

                if(namespace && namespace.length) {

                    var _namespace = angular.copy(namespace);

                    _namespace.push(name);

                    var root = _namespace.shift();
                    return root + '[' + _namespace.join('][') + ']';
                }

                return name;
            }

            function encode(obj,data,namespace) {

                if(!data) {
                    data = [];
                }
                
                angular.forEach(obj,function(value, key) {

                    if(value instanceof Date) {                        

                        var tzo = -value.getTimezoneOffset(),
                        dif = tzo >= 0 ? '+' : '-',
                        pad = function(num) {
                            var norm = Math.abs(Math.floor(num));
                            return (norm < 10 ? '0' : '') + norm;
                        },
                        date = value.getFullYear() 
                                + '-' + pad(value.getMonth()+1)
                                + '-' + pad(value.getDate())
                                + 'T' + pad(value.getHours())
                                + ':' + pad(value.getMinutes()) 
                                + ':' + pad(value.getSeconds()) 
                                + dif + pad(tzo / 60) 
                                + ':' + pad(tzo % 60);

                       data.push(encodeNamespace(key, namespace) + "=" + encodeURIComponent(date)); 

                    } else if(typeof value == 'object') {

                        if(!namespace) {
                            namespace = [];
                        }

                        var _namespace = angular.copy(namespace);

                        _namespace.push(key);

                        encode(value,data,_namespace);

                    } else {
                        data.push(encodeNamespace(key, namespace) + "=" + encodeURIComponent(value));
                    }
                });

                return data;
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
            function deleted(endpoint, data, options) {
                return send('DELETE',endpoint, data, options);
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
                var headers = options.headers || {};

                if(options.encoding=='url') {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
             
                } else if(options.encoding=='json') {
                    headers['Content-Type'] = 'text/json';

                } else if(options.encoding=='formdata') {
                    headers['Content-Type'] = undefined;
                    options.transformRequest = angular.identity;
                    var fd = new FormData();
                    angular.forEach(data, function(item, key) {
                        if(item != null && item.name)
                            fd.append(key, item, item.name);
                        else
                            fd.append(key, item);
                    });

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
                runEvents('begin', options, [ data, headers, options ]);
            }

            function success(response, options) {
                var data = response.data;

                if(options.datapaging) {
                   
                    if (options.key) {
                        data = { data: data.data[options.key], paging: data.data.paging };
                    } else {
                        data = { data: data.data, paging: data.data.paging };
                    }

                } else {
                    if(options.dataKey) {
                       data = data[options.dataKey];
                    }

                    if (options.key) {
                        data = data[options.key];
                    }
                }

                runEvents('success', options, [ response, options ]);

                return data;
            }

            function complete(response, options) {
                runEvents('success', options, [ response, options ]);
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

                runEvents('fail', options, [ response, options ]);

                throw response;
            }

            function runEvents(type,options,data) {
                
                if(options.events===false) {
                    return this;
                }

                if(options.events && options.events[type]) {
                    options.events[type].apply({}, data);
                } else {

                    angular.forEach(events,function(event) {
                        if(event.type==type) {
                            event.func.apply({}, data);
                        }
                    });
                }

                return this;
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
            function on(event, func) {
                events.push({ type: event, func: func });
                return this;
            }            
        };
    });
})();