'use strict';

describe('Service: initService', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var initService;
  beforeEach(inject(function (_initService_) {
    initService = _initService_;
  }));

  it('should do something', function () {
    expect(!!initService).toBe(true);
  });

});
