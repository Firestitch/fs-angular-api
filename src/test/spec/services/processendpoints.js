'use strict';

describe('Service: processEndpoints', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var processEndpoints;
  beforeEach(inject(function (_processEndpoints_) {
    processEndpoints = _processEndpoints_;
  }));

  it('should do something', function () {
    expect(!!processEndpoints).toBe(true);
  });

});
