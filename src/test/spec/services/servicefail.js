'use strict';

describe('Service: serviceFail', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var serviceFail;
  beforeEach(inject(function (_serviceFail_) {
    serviceFail = _serviceFail_;
  }));

  it('should do something', function () {
    expect(!!serviceFail).toBe(true);
  });

});
