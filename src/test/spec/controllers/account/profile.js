'use strict';

describe('Controller: AccountProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('firestitchApp'));

  var AccountProfileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountProfileCtrl = $controller('AccountProfileCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
