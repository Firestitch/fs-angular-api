'use strict';

describe('Service: alertService', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var alertService;
  beforeEach(inject(function (_alertService_) {
    alertService = _alertService_;
  }));

  it('should do something', function () {
    expect(!!alertService).toBe(true);
  });

});
