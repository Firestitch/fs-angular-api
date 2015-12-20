'use strict';

describe('Service: timeZones', function () {

  // load the service's module
  beforeEach(module('firestitchApp'));

  // instantiate service
  var timeZones;
  beforeEach(inject(function (_timeZones_) {
    timeZones = _timeZones_;
  }));

  it('should do something', function () {
    expect(!!timeZones).toBe(true);
  });

});
