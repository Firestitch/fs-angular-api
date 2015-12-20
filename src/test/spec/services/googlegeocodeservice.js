'use strict';

describe('Service: geocodeService', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var geocodeService;
  beforeEach(inject(function (_geocodeService_) {
    geocodeService = _geocodeService_;
  }));

  it('should do something', function () {
    expect(!!geocodeService).toBe(true);
  });

});
