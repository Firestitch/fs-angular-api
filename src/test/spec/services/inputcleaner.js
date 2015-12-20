'use strict';

describe('Service: inputCleaner', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var inputCleaner;
  beforeEach(inject(function (_inputCleaner_) {
    inputCleaner = _inputCleaner_;
  }));

  it('should do something', function () {
    expect(!!inputCleaner).toBe(true);
  });

});
