'use strict';

describe('Service: Pollyfills', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var Pollyfills;
  beforeEach(inject(function (_Pollyfills_) {
    Pollyfills = _Pollyfills_;
  }));

  it('should do something', function () {
    expect(!!Pollyfills).toBe(true);
  });

});
