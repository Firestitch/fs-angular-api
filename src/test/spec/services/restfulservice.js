'use strict';

describe('Service: restfulService', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var restfulService;
  beforeEach(inject(function (_restfulService_) {
    restfulService = _restfulService_;
  }));

  it('should do something', function () {
    expect(!!restfulService).toBe(true);
  });

});
