(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name fs.fsApiProvider
     * @description
     * This provider is a wrapper around built in $http that provides {@link fs.fsApi service} that allows to
     * interact with REST API servers in a simple and convenient way.
     */

    angular.module('fs-angular-api', ['fs-angular-alert','angular-loading-bar'])

    .provider('fsApi', function(cfpLoadingBarProvider) {
        var provider = this;

        cfpLoadingBarProvider.includeSpinner = false;

        this._options = {
            url: null,
            timeout: 60,
            uploadTimeout: 3600,
            slowTimeout: 5,
            encoding: 'json',
            dataKey: 'data',
            events: {
                begin: null,
                success: null,
                complete: null,
                fail: null
            }
        };


        /**
         * @ngdoc method
         * @name fs.fsApiProvider#options
         * @methodOf fs.fsApiProvider
         * @description Allows you to preliminary configure all instances returned by provider.
         * @param {object} options The object every property of which represents some aspect of configuration
         * @param {string} options.url The base URL of the API
         * @param {integer} options.timeout The number of milliseconds until the request timesout
         * @param {string} options.encoding The encoding of the request. Avail options:
         * - url
         * - json
         * - formdata
         * @param {string} options.dataKey The key that represents the the data object in the response
         * @param {object} options.events Provides ability to assign custom callback that will be executed on specific
         * stages\phases of ajax request
            <ul>
                <li>
                    <label>begin</label>
                    The start of ajax call
                </li>
                <li>
                    <label>success</label>
                    Ajax returns code in the 200 range
                </li>
                <li>
                    <label>complete</label>
                    Upon the ajax completion
                </li>
                <li>
                    <label>fail</label>
                    Ajax returns and codes other then the 200 range
                </li>
            </ul>
         *
         * @example
         * <pre>
         * fsApiProvider.options({url: 'http://some.webserver.com/api/'});
         * </pre>
         */
        this.options = function(options) {

            if (!arguments.length)
                return this._options;

            this._options = angular.merge({}, this._options, options);
        }

        /**
         * @ngdoc method
         * @name fs.fsApiProvider#option
         * @methodOf fs.fsApiProvider
         * @description Getter/Setter. Provides ability either to obtain value of specified config property or set it (if second arg is provided)
         * @param {string} name The name of config property. See {@link fs.fsApiProvider#methods_options `options`} for avail properties.
         * @param {*} value The value to assign to config property
         * @example
         * <pre>
         * fsApiProvider.option('url', 'http://some.webserver.com/api/');
         * </pre>
         */
        this.option = function(name, value) {
            if (arguments.length == 1)
                return this._options[arguments[0]];

            this._options[name] = value;
        }

        /**
         * @ngdoc service
         * @name fs.fsApi
         *
         * @description
         * An instance of {@link fs.fsApiProvider fsApiProvider}. The service exposes the following methods:
         *
         * - {@link fs.fsApi#methods_options `options`}
         * - {@link fs.fsApi#methods_send `send`}
         * - {@link fs.fsApi#methods_get `get`}
         * - {@link fs.fsApi#methods_post `post`}
         * - {@link fs.fsApi#methods_put `put`}
         * - {@link fs.fsApi#methods_delete `delete`}
         */
        this.$get = function($http, $httpParamSerializer,fsAlert,$location) {

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

            /**
             * @ngdoc method
             * @name options
             * @methodOf fs.fsApi
             * @param {object} defaults The defaults
             * @param {object} overrides The overrides
             * @returns {object} The result of merging overrides into defaults
             */
            function options(defaults, overrides) {
                overrides = overrides || {};
                return angular.extend(defaults, overrides);
            }

            function params(data) {

                if (!data) {
                    return '';
                }

                var data = angular.copy(data);
                sanitize(data);

                return '?' + encode(data).join('&');
            }

            function encodeNamespace(name, namespace) {
                if (namespace && namespace.length) {
                    var _namespace = angular.copy(namespace);
                    _namespace.push(name);
                    var root = _namespace.shift();
                    return root + '[' + _namespace.join('][') + ']';
                }
                return name;
            }

            function iso8601(date) {

                var tzo = -date.getTimezoneOffset(),
                    dif = tzo >= 0 ? '+' : '-',
                    pad = function(num) {
                        var norm = Math.abs(Math.floor(num));
                        return (norm < 10 ? '0' : '') + norm;
                    };

                return date.getFullYear()
                        +'-' + pad(date.getMonth() + 1)
                        + '-' + pad(date.getDate())
                        + 'T' + pad(date.getHours())
                        + ':' + pad(date.getMinutes())
                        + ':' + pad(date.getSeconds())
                        + dif + pad(tzo / 60)
                        + ':' + pad(tzo % 60);
            }

            function sanitize(obj) {

                angular.forEach(obj, function(value, key) {
                    if (moment && moment.isMoment(value)) {
                        obj[key] = value.format();

                    } else if (value instanceof Date) {
                        obj[key] = iso8601(value);

                    } else if (value === undefined) {
                        delete obj[key];

                    } else if (angular.isObject(value)) {
                        sanitize(value);
                    }
                });

                return obj;
            }

            function encode(obj, data, namespace) {

                if (!data) {
                    data = [];
                }

                angular.forEach(obj, function(value, key) {
                    if (angular.isObject(value)) {

                        if (!namespace) {
                            namespace = [];
                        }

                        var _namespace = angular.copy(namespace);
                        _namespace.push(key);

                        encode(value, data, _namespace);

                    } else {
                        data.push(encodeNamespace(key, namespace) + "=" + encodeURIComponent(value));
                    }

                });

                return data;
            }



            /**
             * @ngdoc method
             * @name get
             * @methodOf fs.fsApi
             * @description sends GET http request to specified endpoint
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object} data The query string data
             * @param {object=} options Optional arguments that override the defaults. See the details about avail config
             * options  in {@link fs.fsApi#methods_send `send()`} method.
             *
             * @example
             * <pre>
                var config = {
                    key: 'files',
                    apply: {
                        key: 'files',
                        'array': true
                    }
                };

                fsApi.get('files', data || {}, config).then(function(files) {
                    ...
                });
             * </pre>
             */

            function get(endpoint, data, options) {
                endpoint = endpoint + params(data);
                return send('GET', endpoint, data, options);
            }

            /**
             * @ngdoc method
             * @name post
             * @methodOf fs.fsApi
             * @description sends POST http request to specified endpoint
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object} data The post data
             * @param {object=} options Optional arguments that override the defaults. See the details about avail config
             * options  in {@link fs.fsApi#methods_send `send()`} method.
             */

            function post(endpoint, data, options) {
                return send('POST', endpoint, data, options);
            }


            /**

             * @ngdoc method
             * @name put
             * @methodOf fs.fsApi
             * @description sends PUT http request to specified endpoint
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object} data The post data
             * @param {object=} options Optional arguments that override the defaults. See the details about avail config
             * options  in {@link fs.fsApi#methods_send `send()`} method.
             */

            function put(endpoint, data, options) {
                return send('PUT', endpoint, data, options);
            }


            /**
             * @ngdoc method
             * @name delete
             * @methodOf fs.fsApi
             * @description sends DELETE http request to specified endpoint
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object=} options Optional arguments that override the defaults. See the details about avail config
             * options  in {@link fs.fsApi#methods_send `send()`} method.
             */

            function deleted(endpoint, data, options) {
                return send('DELETE', endpoint, data, options);
            }

            /**

             * @ngdoc method
             * @name send
             * @methodOf fs.fsApi
             * @param {string} method The HTTP method POST, PUT, GET, DELETE
             * @param {string} endpoint The path that is appened to the options.url
             * @param {object} data The data to send
             * @param {object=} options Optional arguments that override the defaults
             * @param {string} options.url The base URL of the API
             * @param {string} options.encoding The encoding of the request (url, json, formdata)
             * @param {integer} options.timeout The number of milliseconds until the request timesout
             * @param {string} options.dataKey The key that represents the the data object in the response
             * @param {object} options.apply After the request is compelte apply a callback function to targeted data
             * @param {boolean} options.progress Progress bar loading visibility
                <ul>
                    <li>
                        <label>function</label>
                        The apply callback function. The target object is passed as the first parameter
                    </li>
                    <li>
                        <label>key</label>
                        Specifies that they key in the data object that is to be targeted
                    </li>
                    <li>
                        <label>array=false</label>
                        Specifies that they target data is an array
                    </li>
                </ul>
             */

            function send(method, endpoint, data, options) {

            	clearSlowAlert();
                options = angular.extend({}, provider.options(), options || {});
                var headers = options.headers || {};

                var request = angular.copy(data);
                var hasFile = false;
                sanitize(request);

                angular.forEach(data, function(item, key) {
                	if(item instanceof File || item instanceof Blob) {
                		hasFile = true;
                		options.encoding = 'formdata';
                	}
                });

                if (options.encoding == 'url') {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';

                } else if (options.encoding == 'json') {
                    headers['Content-Type'] = 'text/json';

                } else if (options.encoding == 'formdata') {
                    headers['Content-Type'] = undefined;
                    options.transformRequest = angular.identity;
                    var request = new FormData();
                    angular.forEach(data, function(item, key) {
                        if (item != null && item.name) {
                            request.append(key, item, item.name);
                        } else {
                            request.append(key, item);
                        }
                    });
                }

                begin(request, headers, options);

                var timeout = options.uploadTimeout;
	            var slowTimeout = null;

                if(!hasFile) {
	                timeout = options.timeout;
	                if(options.slowTimeout) {
	                	slowTimeout = setTimeout(function() {
		                	fsAlert.info('Your request is still processing, please wait...',{ hideDelay: 0, toastClass: 'fs-api-slow-timeout' });
		                },options.slowTimeout * 1000);
		            }
		        }

		        var url = options.url + endpoint;
		        if(options.forceHttps && !url.match(/^https/)) {

		        	if(url.match(/^http/)) {
		        		url = url.replace(/^https/,'https');
		        	} else {
		        		url = 'https://' + $location.$$host + ($location.$$port==80 ? '' : ':' + $location.$$port) + url;
		        	}
		        }

                return $http({
                    method: method,
                    url: url,
                    headers: headers,
                    timeout: timeout * 1000,
                    data: request,
                    ignoreLoadingBar: options.progress===false,
                    transformRequest: function(obj) {
                        if (options.encoding == 'url') {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");

                        } else if (options.encoding == 'json') {
                            obj = JSON.stringify(obj);
                        }
                        return obj;
                    }
                })

                .then(function(response) {
                    complete(response, options);

                    if (response && options.apply) {
                        if (options.apply.key) {

                            var object = response.data.data[options.apply.key];
                            if (options.apply.array) {
                                if (object && object.length) {
                                    angular.forEach(object, function(item) {
                                        item = options.apply.function(item);
                                    });
                                }

                            } else {
                                if (object) {
                                    response.data.data[options.apply.key] = options.apply.function(object);
                                }
                            }
                        }
                    }

                    return success(response, options);
                })
                .catch(function(response) {
                    complete(response, options);
                    fail(response, options);
                })
                .finally(function() {
                	clearTimeout(slowTimeout);
                	clearSlowAlert();
                });
            }

            function clearSlowAlert() {
            	if(document.querySelector('.fs-api-slow-timeout')) {
            		fsAlert.clear();
            	}
            }

            function begin(data, headers, options) {
                runEvents('begin', options, [data, headers, options]);
            }

            function success(response, options) {

                var data = response.data;
                if (options.datapaging) {

                    if (options.key) {
                        data = { data: data.data[options.key], paging: data.data.paging };
                    } else {
                        data = { data: data.data, paging: data.data.paging };
                    }

                } else {
                    if (options.dataKey) {
                        data = data[options.dataKey];
                    }

                    if (options.key) {
                        data = data[options.key];
                    }
                }

                runEvents('success', options, [response, options]);
                return data;
            }

            function complete(response, options) {
                runEvents('success', options, [response, options]);
            }

            function fail(response, options) {
                var message = "Connection issue";

                if (response.data && response.data.message)
                    message = response.data.message;

                response = {
                    message: message,
                    code: response.status,
                    response: response
                };

                // no error handling required, simply return the message
                if (options && options.handle === false) {
                    throw response;
                }

                runEvents('fail', options, [response, options]);

                throw response;
            }

            function runEvents(type, options, data) {

                if (options.events === false) {
                    return this;
                }

                if (options.events && options.events[type]) {
                    options.events[type].apply({}, data);

                } else {

                    angular.forEach(events, function(event) {
                        if (event.type == type) {
                            event.func.apply({}, data);
                        }
                    });
                }

                return this;
            }

            /**

             * @ngdoc method
             * @name on
             * @methodOf fs.fsApi
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
