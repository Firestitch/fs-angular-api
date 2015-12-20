'use strict';

describe('Service: passwordsService', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var passwordsService;
  beforeEach(inject(function (_passwordsService_) {
    passwordsService = _passwordsService_;
  }));

  it('should do something', function () {
    expect(!!passwordsService).toBe(true);
  });

});
