'use strict';

describe('Service: googlePlacesService', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var googlePlacesService;
  beforeEach(inject(function (_googlePlacesService_) {
    googlePlacesService = _googlePlacesService_;
  }));

  it('should do something', function () {
    expect(!!googlePlacesService).toBe(true);
  });

});
