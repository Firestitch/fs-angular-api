'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, DummyService, fsApi) {

    	
    	fsApi.get('dummy', { count: 10, date: new Date() }, { headers: { 'Api-Key': '7234987sdtf8345rtgasyhd' }})
    	.then(function(data) {
    		$scope.data = data;
    	});


});
