'use strict';

angular
.module('app', [
    'config',
    'ngMaterial',
    'fs-angular-api',
    'ui.router'
])
.config(function ($stateProvider, $urlRouterProvider, fsApiProvider) {

    $urlRouterProvider
    .otherwise('/404')
    .when('', '/demo')
    .when('/', '/demo');

    $stateProvider
    .state('demo', {
        url: '/demo',
        templateUrl: 'views/demo.html',
        controller: 'DemoCtrl'
    })

    .state('404', {
        templateUrl: 'views/404.html',
        controller: 'DemoCtrl'
    });

    fsApiProvider.options({ url: 'https://service.firestitch.com/api/' });
})
.run(function ($rootScope, BOWER, fsApi) {
    $rootScope.app_name = BOWER.name;
    $rootScope.app_namespace = BOWER.namespace;    

    fsApi.on("begin",function(data, headers, options) {

        if(options.authorize) {
            var token = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
            var api_key = token ? token.key : '';

            if(api_key)
                headers['Api-Key'] = api_key;
        }

    })
    .on("fail",function(response) {

        if (response.code === 401 || response.code === 403) {
            console.log('Sorry, your session has expired, please try again.');
            throw response;
        }

        console.log(response.message);
    });

});
