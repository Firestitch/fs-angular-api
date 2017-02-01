'use strict';


angular.module('app')
.controller('DemoCtrl', function ($scope, DummyService, fsApi) {


	fsApi.get('dummy', { count: 10, date: new Date(), test: undefined }, { headers: { 'Api-Key': '7234987sdtf8345rtgasyhd' }})
	.then(function(data) {
		$scope.data = data;
	});

	fsApi.post('dummy', { count: 10, date: new Date(), test111: 111 }, { headers: { 'Api-Key': '7234987sdtf8345rtgasyhd' }})
	.then(function(data) {

	});

	$scope.upload = function(file) {
		if(file) {
			fsApi.post('dummy', { count: 10, date: new Date(), test111: 111, file: file }, { headers: { 'Api-Key': '7234987sdtf8345rtgasyhd' }})
			.then(function(data) {

			});
		}
	}

/*	var data  = { count: 10, date: moment(), object: { date2: moment() } };

	fsApi.post('dummy', data, { headers: { 'Api-Key': '7234987sdtf8345rtgasyhd' }})
	.then(function(data) {

	});*/

});

