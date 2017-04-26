'use strict';


angular.module('app')
.controller('DemoCtrl', function ($scope, DummyService, fsApi, fsAlert) {

	fsApi.get('dummy', { count: 10, date: new Date(), test: undefined }, { headers: { 'Api-Key': '7234987sdtf8345rtgasyhd' }})
	.then(function(data) {
		$scope.data = data;
	});

	fsApi.post('dummy', { count: 10, date: new Date(), test111: 111 }, { headers: { 'Api-Key': '7234987sdtf8345rtgasyhd' }})
	.then(function(data) {

	});

	$scope.upload = function(file) {
		if(file) {
			fsApi.post('dummy', { count: 10, date: new Date(), test111: 111, file: file }, { progress: false, headers: { 'Api-Key': '7234987sdtf8345rtgasyhd' }})
			.then(function(data) {

			});
		}
	}

	$scope.sleep = function() {

		/*setTimeout(function() {
			fsAlert.success();
		},6000);
*/
		fsApi.get('dummy', { count: 10, date: new Date(), sleep: 8 });
	}
});

