'use strict';

describe('Service: GOOGLEAPIKEY', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var GOOGLEAPIKEY;
  beforeEach(inject(function (_GOOGLEAPIKEY_) {
    GOOGLEAPIKEY = _GOOGLEAPIKEY_;
  }));

  it('should do something', function () {
    expect(!!GOOGLEAPIKEY).toBe(true);
  });

});
