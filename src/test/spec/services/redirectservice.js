'use strict';

describe('Service: redirectService', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var redirectService;
  beforeEach(inject(function (_redirectService_) {
    redirectService = _redirectService_;
  }));

  it('should do something', function () {
    expect(!!redirectService).toBe(true);
  });

});
