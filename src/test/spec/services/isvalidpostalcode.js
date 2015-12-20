'use strict';

describe('Service: isValidPostalCode', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var isValidPostalCode;
  beforeEach(inject(function (_isValidPostalCode_) {
    isValidPostalCode = _isValidPostalCode_;
  }));

  it('should do something', function () {
    expect(!!isValidPostalCode).toBe(true);
  });

});
