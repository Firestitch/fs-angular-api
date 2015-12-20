'use strict';

describe('Controller: PasswordRequestCtrl', function () {

  // load the controller's module
  beforeEach(module('firestitchApp'));

  var PasswordRequestCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PasswordRequestCtrl = $controller('PasswordRequestCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
