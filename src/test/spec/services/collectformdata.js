'use strict';

describe('Service: collectFormData', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var collectFormData;
  beforeEach(inject(function (_collectFormData_) {
    collectFormData = _collectFormData_;
  }));

  it('should do something', function () {
    expect(!!collectFormData).toBe(true);
  });

});
