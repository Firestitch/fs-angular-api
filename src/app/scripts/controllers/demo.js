'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, DummyService, fsApi) {

    	
    	fsApi.post('/somewhere', {}, { headers: { 'Api-Key': '7234987sdtf8345rtgasyhd' }})


});
