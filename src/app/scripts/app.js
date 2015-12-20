'use strict';

angular
.module('app', [
    'config',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngAnimate',
    'ngStorage',
    'mdo-angular-cryptography',
    'fs-angular-api',
    'fs-angular-alert'
])
.config(function ($routeProvider, $cryptoProvider, $mdThemingProvider, CONFIG, fsApiProvider) {
    $routeProvider
    .when('/demo', {
        templateUrl: 'views/demo.html',
        controller: 'DemoCtrl',       
    })

    .when('/404', {
        templateUrl: 'views/404.html'
    })
    .otherwise({
        redirectTo: '/demo'
    });

    fsApiProvider.options({ url: CONFIG.api.url });

    $cryptoProvider.setCryptographyKey('abc123');
    $mdThemingProvider.definePalette('amazingPaletteName', {
    '50': 'ffebee',
    '100': 'ffcdd2',
    '200': 'ef9a9a',
    '300': 'e57373',
    '400': 'ef5350',
    '500': 'f44336',
    '600': 'e53935',
    '700': 'd32f2f',
    '800': 'c62828',
    '900': 'b71c1c',
    'A100': 'ff8a80',
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'd50000',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('amazingPaletteName');

    $mdThemingProvider.alwaysWatchTheme(true);
})
.run(function (fsApi, sessionService, fsAlert, $location) {

    fsApi.on("begin",function(data, headers, options) {

        if(options.authorize) {
            var token = sessionService.token();
            var api_key = token ? token.key : '';

            if(api_key)
                headers['Api-Key'] = api_key;
        }

    })
    .on("fail",function(response) {

        if (response.code === 401 || response.code === 403) {
            fsAlert.error('Sorry, your session has expired, please try again.');
            throw response;
        }

        fsAlert.error(response.message);
    });

    fsApi.post("endssss",{ test: "!!!!!" });

});
