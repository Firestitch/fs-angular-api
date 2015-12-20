'use strict';

describe('Service: sessionStore', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var sessionStore;
  beforeEach(inject(function (_sessionStore_) {
    sessionStore = _sessionStore_;
  }));

  it('should do something', function () {
    expect(!!sessionStore).toBe(true);
  });

});
