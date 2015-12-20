'use strict';

describe('Service: History', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var History;
  beforeEach(inject(function (_History_) {
    History = _History_;
  }));

  it('should do something', function () {
    expect(!!History).toBe(true);
  });

});
